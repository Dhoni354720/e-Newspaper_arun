import { Article, Category, BreakingNewsItem, SiteSettings, MediaAsset, SupportedLanguage, ArticleStatus, EpaperEdition, EpaperPage, AuditLog, ContactMessage } from '@/types/database';
import { INITIAL_CATEGORIES, INITIAL_ARTICLES, INITIAL_BREAKING_NEWS, INITIAL_EPAPER_EDITIONS } from '@/data/seedData';
import { DEFAULT_SITE_SETTINGS } from '@/config/site';
import { isSupabaseConfigured, isDemoMode, supabase } from './supabase';
import { generateSlug, ensureUniqueSlug } from './slug';
import { sanitizeHtml } from './sanitize';
import { validateFormSecurity } from './security/formProtection';

const STORAGE_KEYS = {
  ARTICLES: 'djs_articles_v2',
  CATEGORIES: 'djs_categories_v2',
  BREAKING_NEWS: 'djs_breaking_v2',
  SETTINGS: 'djs_settings_v2',
  MEDIA: 'djs_media_v2',
  EPAPER: 'djs_epaper_v2',
  AUDIT_LOGS: 'djs_audit_v2',
  CONTACT_MESSAGES: 'djs_contact_messages_v2',
};

// Memory fallback / LocalStorage loader with seed data
function getLocalItem<T>(key: string, defaultVal: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(stored) as T;
  } catch {
    return defaultVal;
  }
}

function setLocalItem<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

/**
 * Check and auto-publish scheduled articles whose scheduled_at timestamp has arrived
 */
function checkAndAutoPublishScheduled(articles: Article[]): { updatedArticles: Article[]; publishedCount: number } {
  const now = new Date();
  let publishedCount = 0;

  const updatedArticles = articles.map(art => {
    if (art.status === 'scheduled' && art.scheduled_at) {
      const schedTime = new Date(art.scheduled_at);
      if (schedTime <= now) {
        publishedCount++;
        return {
          ...art,
          status: 'published' as ArticleStatus,
          published_at: art.scheduled_at,
          updated_at: now.toISOString(),
        };
      }
    }
    return art;
  });

  return { updatedArticles, publishedCount };
}

export class NewsRepository {
  private static instance: NewsRepository;

  private constructor() {
    // Strip seed articles from production; seed only in dev or explicit demo mode
    const shouldSeed = !import.meta.env.PROD && (isDemoMode() || import.meta.env.DEV);

    getLocalItem(STORAGE_KEYS.CATEGORIES, shouldSeed ? INITIAL_CATEGORIES : []);
    const initialArticles = getLocalItem(STORAGE_KEYS.ARTICLES, shouldSeed ? INITIAL_ARTICLES : []);
    const { updatedArticles } = checkAndAutoPublishScheduled(initialArticles);
    setLocalItem(STORAGE_KEYS.ARTICLES, updatedArticles);

    getLocalItem(STORAGE_KEYS.BREAKING_NEWS, shouldSeed ? INITIAL_BREAKING_NEWS : []);
    getLocalItem(STORAGE_KEYS.SETTINGS, DEFAULT_SITE_SETTINGS);
    getLocalItem(STORAGE_KEYS.EPAPER, shouldSeed ? INITIAL_EPAPER_EDITIONS : []);
  }

  public static getInstance(): NewsRepository {
    if (!NewsRepository.instance) {
      NewsRepository.instance = new NewsRepository();
    }
    return NewsRepository.instance;
  }

  // --------------------------------------------------------------------------
  // ARTICLES
  // --------------------------------------------------------------------------
  async getArticles(options: {
    language?: SupportedLanguage;
    categorySlug?: string;
    status?: ArticleStatus | 'all';
    isBreaking?: boolean;
    search?: string;
    page?: number;
    limit?: number;
    includePrivate?: boolean; // Only true for authorized admin CMS calls
  } = {}): Promise<{ articles: Article[]; total: number; page: number; totalPages: number }> {
    const page = options.page || 1;
    const limit = options.limit || 12;

    // Supabase Live Mode
    if (isSupabaseConfigured()) {
      try {
        let query = supabase
          .from('articles')
          .select(`
            *,
            categories:article_categories(category:categories(*)),
            author:profiles(*)
          `, { count: 'exact' });

        if (!options.includePrivate) {
          query = query.eq('status', 'published').lte('published_at', new Date().toISOString());
        } else if (options.status && options.status !== 'all') {
          query = query.eq('status', options.status);
        }

        if (options.language) {
          query = query.eq('language', options.language);
        }

        if (options.isBreaking !== undefined) {
          query = query.eq('is_breaking', options.isBreaking);
        }

        if (options.search) {
          query = query.or(`headline.ilike.%${options.search}%,excerpt.ilike.%${options.search}%`);
        }

        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const { data, count, error } = await query.order('published_at', { ascending: false }).range(from, to);

        if (!error && data) {
          return {
            articles: data as Article[],
            total: count || data.length,
            page,
            totalPages: Math.ceil((count || data.length) / limit),
          };
        }
      } catch (err) {
        console.warn('Supabase query failed, using resilient fallback:', err);
      }
    }

    // Local / Persistent Fallback Mode
    let allArticles = getLocalItem<Article[]>(STORAGE_KEYS.ARTICLES, INITIAL_ARTICLES);
    const { updatedArticles, publishedCount } = checkAndAutoPublishScheduled(allArticles);
    if (publishedCount > 0) {
      allArticles = updatedArticles;
      setLocalItem(STORAGE_KEYS.ARTICLES, allArticles);
    }

    const categories = getLocalItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const categoryMap = new Map(categories.map(c => [c.id, c]));

    // Populate categories relation
    let filtered = allArticles.map(art => ({
      ...art,
      categories: (art.category_ids || []).map(id => categoryMap.get(id)).filter(Boolean) as Category[],
    }));

    // Filter by privacy
    const now = new Date();
    if (!options.includePrivate) {
      filtered = filtered.filter(art => {
        if (art.status !== 'published') return false;
        if (!art.published_at) return false;
        return new Date(art.published_at) <= now;
      });
    } else if (options.status && options.status !== 'all') {
      filtered = filtered.filter(art => art.status === options.status);
    }

    // Filter by language
    if (options.language) {
      filtered = filtered.filter(art => art.language === options.language);
    }

    // Filter by category slug
    if (options.categorySlug) {
      filtered = filtered.filter(art =>
        art.categories?.some(cat => cat.slug === options.categorySlug)
      );
    }

    // Filter by breaking
    if (options.isBreaking !== undefined) {
      filtered = filtered.filter(art => art.is_breaking === options.isBreaking);
    }

    // Search query
    if (options.search) {
      const q = options.search.toLowerCase().trim();
      filtered = filtered.filter(art =>
        art.headline.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q) ||
        art.body.toLowerCase().includes(q) ||
        art.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort by publication date or updated_at
    filtered.sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at).getTime();
      const dateB = new Date(b.published_at || b.created_at).getTime();
      return dateB - dateA;
    });

    const total = filtered.length;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      articles: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async getArticleBySlug(slug: string, options: { includePrivate?: boolean } = {}): Promise<Article | null> {
    const result = await this.getArticles({ limit: 1000, includePrivate: options.includePrivate });
    const article = result.articles.find(a => a.slug === slug);
    return article || null;
  }

  async getArticleById(id: string, options: { includePrivate?: boolean } = {}): Promise<Article | null> {
    const result = await this.getArticles({ limit: 1000, includePrivate: options.includePrivate });
    const article = result.articles.find(a => a.id === id);
    return article || null;
  }

  async getRelatedArticles(currentArticle: Article, limit: number = 4): Promise<Article[]> {
    const result = await this.getArticles({
      language: currentArticle.language,
      limit: 20,
      includePrivate: false,
    });

    const primaryCategoryId = currentArticle.category_ids?.[0];

    const related = result.articles
      .filter(a => a.id !== currentArticle.id)
      .sort((a, b) => {
        const aMatchesCat = a.category_ids?.includes(primaryCategoryId || '') ? 1 : 0;
        const bMatchesCat = b.category_ids?.includes(primaryCategoryId || '') ? 1 : 0;
        return bMatchesCat - aMatchesCat;
      });

    return related.slice(0, limit);
  }

  async getArticleTranslations(translationGroupId: string): Promise<Article[]> {
    const result = await this.getArticles({ limit: 100, includePrivate: false });
    return result.articles.filter(a => a.translation_group_id === translationGroupId);
  }

  async getAllTranslationsForGroup(translationGroupId: string): Promise<Article[]> {
    const result = await this.getArticles({ limit: 1000, includePrivate: true });
    return result.articles.filter(a => a.translation_group_id === translationGroupId);
  }

  async saveArticle(articleData: Partial<Article>): Promise<Article> {
    const articles = getLocalItem<Article[]>(STORAGE_KEYS.ARTICLES, []);
    const existingSlugs = articles.map(a => a.slug).filter(s => s !== articleData.slug);

    let slug = articleData.slug || generateSlug(articleData.headline || 'news-item');
    slug = ensureUniqueSlug(slug, existingSlugs, articleData.id);

    const now = new Date().toISOString();

    let published_at = articleData.published_at;
    if (articleData.status === 'published' && !published_at) {
      published_at = now;
    }

    // Phase 0 rule 6: Sanitize article HTML body on save
    const cleanBody = articleData.body !== undefined ? sanitizeHtml(articleData.body) : undefined;

    if (articleData.id) {
      // Update existing
      const index = articles.findIndex(a => a.id === articleData.id);
      if (index === -1) throw new Error('Article not found');

      const updatedArticle: Article = {
        ...articles[index],
        ...articleData,
        slug,
        body: cleanBody !== undefined ? cleanBody : articles[index].body,
        published_at: articleData.status === 'published' ? (published_at || now) : null,
        updated_at: now,
      };

      articles[index] = updatedArticle;
      setLocalItem(STORAGE_KEYS.ARTICLES, articles);

      // Audit log on article update / publish
      await this.logAudit({
        action: updatedArticle.status === 'published' ? 'publish' : 'update',
        entity_type: 'articles',
        entity_id: updatedArticle.id,
        metadata: {
          headline: updatedArticle.headline,
          status: updatedArticle.status,
          language: updatedArticle.language,
        },
      });

      return updatedArticle;
    } else {
      // Create new
      const newArticle: Article = {
        id: `art-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        slug,
        language: articleData.language || 'mr',
        translation_group_id: articleData.translation_group_id || `grp-${Date.now()}`,
        headline: articleData.headline || '',
        subtitle: articleData.subtitle || '',
        excerpt: articleData.excerpt || '',
        body: cleanBody || '',
        featured_image_path: articleData.featured_image_path || '',
        image_alt: articleData.image_alt || '',
        image_caption: articleData.image_caption || '',
        author_id: articleData.author_id || 'usr-author-01',
        author: {
          id: articleData.author_id || 'usr-author-01',
          display_name: 'संपादकीय प्रतिनिधी',
          role: 'author', // Phase 0 rule 2: Default to least-privilege author
          created_at: now,
          updated_at: now,
        },
        status: articleData.status || 'draft',
        is_breaking: Boolean(articleData.is_breaking),
        seo_title: articleData.seo_title || articleData.headline,
        seo_description: articleData.seo_description || articleData.excerpt,
        reading_time_minutes: articleData.reading_time_minutes || 2,
        published_at: articleData.status === 'published' ? (published_at || now) : null,
        scheduled_at: articleData.scheduled_at || null,
        created_at: now,
        updated_at: now,
        category_ids: articleData.category_ids || [],
        tags: articleData.tags || [],
      };

      articles.unshift(newArticle);
      setLocalItem(STORAGE_KEYS.ARTICLES, articles);

      // Audit log on article create / publish
      await this.logAudit({
        action: newArticle.status === 'published' ? 'publish' : 'create',
        entity_type: 'articles',
        entity_id: newArticle.id,
        metadata: {
          headline: newArticle.headline,
          status: newArticle.status,
          language: newArticle.language,
        },
      });

      return newArticle;
    }
  }

  async duplicateArticleAsDraft(articleId: string): Promise<Article> {
    const article = await this.getArticleById(articleId, { includePrivate: true });
    if (!article) throw new Error('Article not found');

    const duplicateData: Partial<Article> = {
      ...article,
      id: undefined,
      slug: `${article.slug}-copy`,
      headline: `${article.headline} [प्रत]`,
      status: 'draft',
      published_at: null,
      scheduled_at: null,
      created_at: undefined,
      updated_at: undefined,
    };

    return this.saveArticle(duplicateData);
  }

  async deleteArticle(articleId: string): Promise<void> {
    const articles = getLocalItem<Article[]>(STORAGE_KEYS.ARTICLES, []);
    const filtered = articles.filter(a => a.id !== articleId);
    setLocalItem(STORAGE_KEYS.ARTICLES, filtered);

    // Also remove from breaking news if present
    const breaking = getLocalItem<BreakingNewsItem[]>(STORAGE_KEYS.BREAKING_NEWS, []);
    setLocalItem(STORAGE_KEYS.BREAKING_NEWS, breaking.filter(b => b.article_id !== articleId));

    // Audit log on article delete
    await this.logAudit({
      action: 'delete',
      entity_type: 'articles',
      entity_id: articleId,
    });
  }

  // --------------------------------------------------------------------------
  // CATEGORIES
  // --------------------------------------------------------------------------
  async getCategories(): Promise<Category[]> {
    const categories = getLocalItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    return categories.sort((a, b) => a.sort_order - b.sort_order);
  }

  async saveCategory(categoryData: Partial<Category>): Promise<Category> {
    const categories = getLocalItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const now = new Date().toISOString();

    if (categoryData.id) {
      const idx = categories.findIndex(c => c.id === categoryData.id);
      if (idx === -1) throw new Error('Category not found');
      categories[idx] = { ...categories[idx], ...categoryData };
      setLocalItem(STORAGE_KEYS.CATEGORIES, categories);
      return categories[idx];
    } else {
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        slug: categoryData.slug || generateSlug(categoryData.slug || 'category'),
        sort_order: categoryData.sort_order || categories.length + 1,
        is_active: categoryData.is_active ?? true,
        created_at: now,
        translations: categoryData.translations || {
          mr: { id: `t-mr-${Date.now()}`, category_id: `cat-${Date.now()}`, language: 'mr', name: 'नवीन विभाग' },
          hi: { id: `t-hi-${Date.now()}`, category_id: `cat-${Date.now()}`, language: 'hi', name: 'नई श्रेणी' },
          en: { id: `t-en-${Date.now()}`, category_id: `cat-${Date.now()}`, language: 'en', name: 'New Category' },
        },
      };
      categories.push(newCategory);
      setLocalItem(STORAGE_KEYS.CATEGORIES, categories);
      return newCategory;
    }
  }

  // --------------------------------------------------------------------------
  // BREAKING NEWS
  // --------------------------------------------------------------------------
  async getBreakingNews(language: SupportedLanguage = 'mr', includeInactive: boolean = false): Promise<BreakingNewsItem[]> {
    const items = getLocalItem<BreakingNewsItem[]>(STORAGE_KEYS.BREAKING_NEWS, INITIAL_BREAKING_NEWS);
    const articlesResult = await this.getArticles({ limit: 1000, includePrivate: false });
    const publishedArticleMap = new Map(articlesResult.articles.map(a => [a.id, a]));

    const populated = items
      .map(item => ({
        ...item,
        article: item.article_id ? publishedArticleMap.get(item.article_id) : undefined,
      }))
      .filter(item => {
        if (!includeInactive && !item.is_active) return false;
        if (item.language !== language) return false;
        // Linked article must be published on the public site ONLY IF an article_id was specified
        if (!includeInactive && item.article_id && !item.article) return false;
        return true;
      });

    return populated.sort((a, b) => a.display_order - b.display_order);
  }

  async getAllBreakingNewsAdmin(): Promise<BreakingNewsItem[]> {
    const items = getLocalItem<BreakingNewsItem[]>(STORAGE_KEYS.BREAKING_NEWS, INITIAL_BREAKING_NEWS);
    const articlesResult = await this.getArticles({ limit: 1000, includePrivate: true });
    const articleMap = new Map(articlesResult.articles.map(a => [a.id, a]));

    return items.map(item => ({
      ...item,
      article: articleMap.get(item.article_id),
    })).sort((a, b) => a.display_order - b.display_order);
  }

  async saveBreakingNewsItem(itemData: Partial<BreakingNewsItem>): Promise<BreakingNewsItem> {
    const items = getLocalItem<BreakingNewsItem[]>(STORAGE_KEYS.BREAKING_NEWS, INITIAL_BREAKING_NEWS);
    const now = new Date().toISOString();

    if (itemData.id) {
      const idx = items.findIndex(i => i.id === itemData.id);
      if (idx === -1) throw new Error('Breaking item not found');
      items[idx] = { ...items[idx], ...itemData, updated_at: now };
      setLocalItem(STORAGE_KEYS.BREAKING_NEWS, items);
      return items[idx];
    } else {
      const newItem: BreakingNewsItem = {
        id: `brk-${Date.now()}`,
        article_id: itemData.article_id || '',
        language: itemData.language || 'mr',
        custom_headline: itemData.custom_headline,
        display_order: itemData.display_order || items.length + 1,
        is_active: itemData.is_active ?? true,
        expires_at: itemData.expires_at || null,
        created_at: now,
        updated_at: now,
      };
      items.push(newItem);
      setLocalItem(STORAGE_KEYS.BREAKING_NEWS, items);
      return newItem;
    }
  }

  async deleteBreakingNewsItem(id: string): Promise<void> {
    const items = getLocalItem<BreakingNewsItem[]>(STORAGE_KEYS.BREAKING_NEWS, INITIAL_BREAKING_NEWS);
    setLocalItem(STORAGE_KEYS.BREAKING_NEWS, items.filter(i => i.id !== id));
  }

  // --------------------------------------------------------------------------
  // SITE SETTINGS
  // --------------------------------------------------------------------------
  async getSiteSettings(): Promise<SiteSettings> {
    return getLocalItem<SiteSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SITE_SETTINGS);
  }

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSiteSettings();
    const updated: SiteSettings = {
      ...current,
      ...settings,
      updated_at: new Date().toISOString(),
    };
    setLocalItem(STORAGE_KEYS.SETTINGS, updated);

    // Audit log on settings update
    await this.logAudit({
      action: 'update',
      entity_type: 'site_settings',
      entity_id: 'default',
      metadata: { publication_name: updated.publication_name },
    });

    return updated;
  }

  // --------------------------------------------------------------------------
  // MEDIA ASSETS
  // --------------------------------------------------------------------------
  async getMediaAssets(): Promise<MediaAsset[]> {
    return getLocalItem<MediaAsset[]>(STORAGE_KEYS.MEDIA, [
      {
        id: 'med-01',
        storage_path: 'articles/transit-corridor.jpg',
        public_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
        file_name: 'transit-corridor.jpg',
        mime_type: 'image/jpeg',
        file_size: 245000,
        alt_text: 'Pune-Mumbai Expressway and transit corridor',
        caption: 'High-speed modern transport link',
        created_at: '2026-02-21T06:00:00Z',
      },
      {
        id: 'med-02',
        storage_path: 'articles/smart-farming.jpg',
        public_url: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1200&q=80',
        file_name: 'smart-farming.jpg',
        mime_type: 'image/jpeg',
        file_size: 310000,
        alt_text: 'Smart agriculture and irrigation sensor',
        caption: 'Marathwada AI irrigation project',
        created_at: '2026-02-21T07:00:00Z',
      },
      {
        id: 'med-03',
        storage_path: 'articles/cricket-stadium.jpg',
        public_url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80',
        file_name: 'cricket-stadium.jpg',
        mime_type: 'image/jpeg',
        file_size: 420000,
        alt_text: 'Cricket Stadium and pitch match',
        caption: 'Test match cricket tournament',
        created_at: '2026-02-21T07:45:00Z',
      },
    ]);
  }

  async uploadMedia(file: File, altText?: string, caption?: string): Promise<MediaAsset> {
    // If Supabase Storage is configured, upload to Supabase bucket
    if (isSupabaseConfigured()) {
      try {
        const fileExt = file.name.split('.').pop();
        const filePath = `articles/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('article-media')
          .upload(filePath, file, { cacheControl: '3600', upsert: false });

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('article-media').getPublicUrl(filePath);
          const asset: MediaAsset = {
            id: `med-${Date.now()}`,
            storage_path: filePath,
            public_url: publicUrl,
            file_name: file.name,
            mime_type: file.type,
            file_size: file.size,
            alt_text: altText,
            caption: caption,
            created_at: new Date().toISOString(),
          };
          const current = await this.getMediaAssets();
          setLocalItem(STORAGE_KEYS.MEDIA, [asset, ...current]);
          return asset;
        }
      } catch (e) {
        console.warn('Supabase storage upload error, using local data URL:', e);
      }
    }

    // Local Data URL Fallback
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const publicUrl = reader.result as string;
        const asset: MediaAsset = {
          id: `med-${Date.now()}`,
          storage_path: `local/${file.name}`,
          public_url: publicUrl,
          file_name: file.name,
          mime_type: file.type,
          file_size: file.size,
          alt_text: altText || file.name,
          caption: caption || '',
          created_at: new Date().toISOString(),
        };

        const current = await this.getMediaAssets();
        setLocalItem(STORAGE_KEYS.MEDIA, [asset, ...current]);
        resolve(asset);
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  async deleteMedia(id: string): Promise<void> {
    const assets = await this.getMediaAssets();
    setLocalItem(STORAGE_KEYS.MEDIA, assets.filter(a => a.id !== id));
  }

  // --------------------------------------------------------------------------
  // DASHBOARD STATS
  // --------------------------------------------------------------------------
  async getDashboardStats(): Promise<{
    publishedCount: number;
    draftsCount: number;
    scheduledCount: number;
    breakingCount: number;
    totalCategories: number;
    recentActivity: Article[];
  }> {
    const articles = getLocalItem<Article[]>(STORAGE_KEYS.ARTICLES, INITIAL_ARTICLES);
    const breaking = getLocalItem<BreakingNewsItem[]>(STORAGE_KEYS.BREAKING_NEWS, INITIAL_BREAKING_NEWS);
    const categories = getLocalItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);

    const published = articles.filter(a => a.status === 'published');
    const drafts = articles.filter(a => a.status === 'draft');
    const scheduled = articles.filter(a => a.status === 'scheduled');
    const activeBreaking = breaking.filter(b => b.is_active);

    const sortedByUpdate = [...articles].sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );

    return {
      publishedCount: published.length,
      draftsCount: drafts.length,
      scheduledCount: scheduled.length,
      breakingCount: activeBreaking.length,
      totalCategories: categories.length,
      recentActivity: sortedByUpdate.slice(0, 5),
    };
  }

  // --------------------------------------------------------------------------
  // E-PAPER EDITIONS & READER (High-capacity for thousands of viewers)
  // --------------------------------------------------------------------------
  async getEpaperEditions(options: {
    region?: string;
    date?: string;
    isPublished?: boolean;
    limit?: number;
    page?: number;
  } = {}): Promise<{ editions: EpaperEdition[]; total: number }> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('epaper_editions').select(`*, pages:epaper_pages(*)`, { count: 'exact' });
        if (options.isPublished !== undefined) {
          query = query.eq('is_published', options.isPublished);
        }
        if (options.region && options.region !== 'all') {
          query = query.eq('edition_region', options.region);
        }
        if (options.date) {
          query = query.eq('edition_date', options.date);
        }
        const { data, count, error } = await query.order('edition_date', { ascending: false });
        if (!error && data) {
          return { editions: data as EpaperEdition[], total: count || data.length };
        }
      } catch (e) {
        console.warn('Supabase epaper fetch error, falling back:', e);
      }
    }

    const editions = getLocalItem<EpaperEdition[]>(STORAGE_KEYS.EPAPER, INITIAL_EPAPER_EDITIONS);
    let filtered = [...editions];

    if (options.isPublished !== undefined) {
      filtered = filtered.filter(e => e.is_published === options.isPublished);
    }
    if (options.region && options.region !== 'all') {
      filtered = filtered.filter(e => e.edition_region === options.region);
    }
    if (options.date) {
      filtered = filtered.filter(e => e.edition_date === options.date);
    }

    filtered.sort((a, b) => new Date(b.edition_date).getTime() - new Date(a.edition_date).getTime());
    return {
      editions: filtered,
      total: filtered.length,
    };
  }

  async getEpaperEditionById(id: string): Promise<EpaperEdition | null> {
    const { editions } = await this.getEpaperEditions();
    return editions.find(e => e.id === id) || null;
  }

  async getEpaperEditionByDate(date: string, region: string = 'pune'): Promise<EpaperEdition | null> {
    const { editions } = await this.getEpaperEditions({ date, isPublished: true });
    return editions.find(e => e.edition_region === region) || editions[0] || null;
  }

  async saveEpaperEdition(data: Partial<EpaperEdition>): Promise<EpaperEdition> {
    const editions = getLocalItem<EpaperEdition[]>(STORAGE_KEYS.EPAPER, INITIAL_EPAPER_EDITIONS);
    const now = new Date().toISOString();

    if (data.id) {
      const idx = editions.findIndex(e => e.id === data.id);
      if (idx === -1) throw new Error('E-Paper edition not found');
      editions[idx] = {
        ...editions[idx],
        ...data,
        updated_at: now,
      };
      setLocalItem(STORAGE_KEYS.EPAPER, editions);

      await this.logAudit({
        action: editions[idx].is_published ? 'publish' : 'update',
        entity_type: 'epaper_editions',
        entity_id: editions[idx].id,
        metadata: { date: editions[idx].edition_date, title: editions[idx].title },
      });

      return editions[idx];
    } else {
      const newEdition: EpaperEdition = {
        id: `ep-${Date.now()}`,
        edition_date: data.edition_date || new Date().toISOString().split('T')[0],
        edition_region: data.edition_region || 'mumbai',
        title: data.title || 'दैनिक जगत समीक्षा - डिजिटल ई-पेपर',
        title_mr: data.title_mr || data.title,
        title_hi: data.title_hi || data.title,
        description: data.description || '',
        thumbnail_url: data.thumbnail_url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
        pdf_url: data.pdf_url || '',
        file_size_bytes: data.file_size_bytes || 5242880,
        total_pages: data.total_pages || (data.pages?.length || 1),
        is_published: data.is_published ?? true,
        views_count: data.views_count || 0,
        downloads_count: data.downloads_count || 0,
        pages: data.pages || [
          {
            id: `page-${Date.now()}-1`,
            edition_id: `ep-${Date.now()}`,
            page_number: 1,
            page_title: 'मुख्य पृष्ठ',
            image_url: data.thumbnail_url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
            created_at: now,
          }
        ],
        created_at: now,
        updated_at: now,
      };
      editions.unshift(newEdition);
      setLocalItem(STORAGE_KEYS.EPAPER, editions);

      await this.logAudit({
        action: newEdition.is_published ? 'publish' : 'create',
        entity_type: 'epaper_editions',
        entity_id: newEdition.id,
        metadata: { date: newEdition.edition_date, title: newEdition.title },
      });

      return newEdition;
    }
  }

  async deleteEpaperEdition(id: string): Promise<void> {
    const editions = getLocalItem<EpaperEdition[]>(STORAGE_KEYS.EPAPER, []);
    setLocalItem(STORAGE_KEYS.EPAPER, editions.filter(e => e.id !== id));

    await this.logAudit({
      action: 'delete',
      entity_type: 'epaper_editions',
      entity_id: id,
    });
  }

  async saveEpaperPage(editionId: string, pageData: Partial<EpaperPage>): Promise<EpaperPage> {
    const editions = getLocalItem<EpaperEdition[]>(STORAGE_KEYS.EPAPER, INITIAL_EPAPER_EDITIONS);
    const editionIdx = editions.findIndex(e => e.id === editionId);
    if (editionIdx === -1) throw new Error('Edition not found');

    const edition = editions[editionIdx];
    const pages = edition.pages || [];
    const now = new Date().toISOString();

    let savedPage: EpaperPage;
    if (pageData.id) {
      const pIdx = pages.findIndex(p => p.id === pageData.id);
      if (pIdx === -1) throw new Error('Page not found');
      pages[pIdx] = { ...pages[pIdx], ...pageData };
      savedPage = pages[pIdx];
    } else {
      savedPage = {
        id: `page-${Date.now()}`,
        edition_id: editionId,
        page_number: pageData.page_number || pages.length + 1,
        page_title: pageData.page_title || `पान क्र. ${pages.length + 1}`,
        image_url: pageData.image_url || edition.thumbnail_url,
        created_at: now,
      };
      pages.push(savedPage);
    }

    pages.sort((a, b) => a.page_number - b.page_number);
    edition.pages = pages;
    edition.total_pages = pages.length;
    edition.updated_at = now;
    editions[editionIdx] = edition;
    setLocalItem(STORAGE_KEYS.EPAPER, editions);
    return savedPage;
  }

  async deleteEpaperPage(editionId: string, pageId: string): Promise<void> {
    const editions = getLocalItem<EpaperEdition[]>(STORAGE_KEYS.EPAPER, INITIAL_EPAPER_EDITIONS);
    const editionIdx = editions.findIndex(e => e.id === editionId);
    if (editionIdx === -1) return;

    const edition = editions[editionIdx];
    edition.pages = (edition.pages || []).filter(p => p.id !== pageId);
    edition.total_pages = edition.pages.length;
    editions[editionIdx] = edition;
    setLocalItem(STORAGE_KEYS.EPAPER, editions);
  }

  async incrementEpaperViews(editionId: string): Promise<void> {
    const editions = getLocalItem<EpaperEdition[]>(STORAGE_KEYS.EPAPER, INITIAL_EPAPER_EDITIONS);
    const edition = editions.find(e => e.id === editionId);
    if (edition) {
      edition.views_count = (edition.views_count || 0) + 1;
      setLocalItem(STORAGE_KEYS.EPAPER, editions);
    }
  }

  async incrementEpaperDownloads(editionId: string): Promise<void> {
    const editions = getLocalItem<EpaperEdition[]>(STORAGE_KEYS.EPAPER, INITIAL_EPAPER_EDITIONS);
    const edition = editions.find(e => e.id === editionId);
    if (edition) {
      edition.downloads_count = (edition.downloads_count || 0) + 1;
      setLocalItem(STORAGE_KEYS.EPAPER, editions);
    }
  }

  // --------------------------------------------------------------------------
  // AUDIT LOGS & COMPLIANCE
  // --------------------------------------------------------------------------
  async logAudit(entry: {
    actor_id?: string;
    action: 'create' | 'update' | 'delete' | 'publish' | 'auto_publish';
    entity_type: string;
    entity_id?: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    const now = new Date().toISOString();

    // 1. Always record to local storage store for resilience / offline inspection
    const logs = getLocalItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
    const newLog: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      actor_id: entry.actor_id,
      action: entry.action,
      entity_type: entry.entity_type,
      entity_id: entry.entity_id,
      metadata: entry.metadata,
      created_at: now,
    };
    logs.unshift(newLog);
    setLocalItem(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 500));

    // 2. Non-blocking sync to live Supabase backend if configured
    if (isSupabaseConfigured()) {
      Promise.resolve(
        supabase.from('audit_logs').insert({
          actor_id: entry.actor_id || null,
          action: entry.action,
          entity_type: entry.entity_type,
          entity_id: entry.entity_id || null,
          metadata: entry.metadata || {},
          created_at: now,
        })
      ).catch(() => {
        // Graceful non-blocking fallback if remote migration is pending
      });
    }
  }

  async getAuditLogs(limit: number = 50): Promise<AuditLog[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);
        if (!error && data && data.length > 0) return data as AuditLog[];
      } catch {
        // Fall back to local
      }
    }
    const logs = getLocalItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
    return logs.slice(0, limit);
  }

  // --------------------------------------------------------------------------
  // CONTACT & PUBLIC FORM INBOX
  // --------------------------------------------------------------------------
  async submitContactMessage(data: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    honeypot?: string;
  }): Promise<{ success: boolean; error?: string }> {
    const secCheck = validateFormSecurity('contact_messages', data.honeypot);
    if (!secCheck.allowed) {
      return { success: false, error: secCheck.error || 'सुरक्षा जाँच विफल (Security check failed)' };
    }

    if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
      return { success: false, error: 'कृपया सभी आवश्यक फ़ील्ड भरें (Please fill all required fields).' };
    }

    const now = new Date().toISOString();
    const record = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || undefined,
      subject: data.subject?.trim() || 'सामान्य संपर्क',
      message: data.message.trim(),
      status: 'unread' as const,
    };

    // 1. Always record in local store for resilience
    const messages = getLocalItem<ContactMessage[]>(STORAGE_KEYS.CONTACT_MESSAGES, []);
    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      ...record,
      created_at: now,
      updated_at: now,
    };
    messages.unshift(newMsg);
    setLocalItem(STORAGE_KEYS.CONTACT_MESSAGES, messages);

    // 2. Non-blocking sync to Supabase if configured
    if (isSupabaseConfigured()) {
      Promise.resolve(
        supabase.from('contact_messages').insert({
          ...record,
          phone: record.phone || null,
          created_at: now,
          updated_at: now,
        })
      ).catch(() => {
        // Table may be in pending migration on remote database
      });
    }

    await this.logAudit({
      action: 'create',
      entity_type: 'contact_messages',
      metadata: { name: record.name, email: record.email, subject: record.subject },
    });

    return { success: true };
  }

  async getContactMessages(limit: number = 50): Promise<ContactMessage[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);
        if (!error && data && data.length > 0) return data as ContactMessage[];
      } catch {
        // Fall back to local
      }
    }
    const messages = getLocalItem<ContactMessage[]>(STORAGE_KEYS.CONTACT_MESSAGES, []);
    return messages.slice(0, limit);
  }
}

export const repository = NewsRepository.getInstance();
