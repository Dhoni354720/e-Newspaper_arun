import { 
  Article, 
  Category, 
  BreakingNewsItem, 
  SiteSettings, 
  MediaAsset, 
  SupportedLanguage, 
  ArticleStatus, 
  EpaperEdition, 
  EpaperPage, 
  EpaperClip,
  AuditLog, 
  ContactMessage, 
  Profile, 
  HomeBlock,
  Gallery,
  VideoItem,
  BriefItem,
  HoroscopeItem,
  HoroscopePeriod,
  HoroscopeSign,
  SupplementItem,
  NewsTip,
  NewsTipStatus,
  CMSPage,
  WeatherData
} from '@/types/database';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_ARTICLES, 
  INITIAL_BREAKING_NEWS, 
  INITIAL_EPAPER_EDITIONS, 
  INITIAL_PROFILES, 
  INITIAL_HOME_BLOCKS,
  INITIAL_GALLERIES,
  INITIAL_VIDEOS,
  INITIAL_BRIEFS,
  INITIAL_HOROSCOPES,
  INITIAL_SUPPLEMENTS,
  INITIAL_NEWS_TIPS,
  INITIAL_CMS_PAGES,
  SUPPORTED_WEATHER_CITIES
} from '@/data/seedData';
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
  PROFILES: 'djs_profiles_v2',
  HOME_BLOCKS: 'djs_home_blocks_v2',
  GALLERIES: 'djs_galleries_v2',
  VIDEOS: 'djs_videos_v2',
  BRIEFS: 'djs_briefs_v2',
  HOROSCOPES: 'djs_horoscopes_v2',
  SUPPLEMENTS: 'djs_supplements_v2',
  NEWS_TIPS: 'djs_news_tips_v2',
  CMS_PAGES: 'djs_cms_pages_v2',
  WEATHER_CACHE: 'djs_weather_cache_v2',
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
    getLocalItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    if (!isSupabaseConfigured()) {
      const initialArticles = getLocalItem(STORAGE_KEYS.ARTICLES, INITIAL_ARTICLES);
      const { updatedArticles } = checkAndAutoPublishScheduled(initialArticles);
      setLocalItem(STORAGE_KEYS.ARTICLES, updatedArticles);

      getLocalItem(STORAGE_KEYS.BREAKING_NEWS, INITIAL_BREAKING_NEWS);
      getLocalItem(STORAGE_KEYS.SETTINGS, DEFAULT_SITE_SETTINGS);
      getLocalItem(STORAGE_KEYS.EPAPER, INITIAL_EPAPER_EDITIONS);
      getLocalItem(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
      getLocalItem(STORAGE_KEYS.HOME_BLOCKS, INITIAL_HOME_BLOCKS);
      getLocalItem(STORAGE_KEYS.GALLERIES, INITIAL_GALLERIES);
      getLocalItem(STORAGE_KEYS.VIDEOS, INITIAL_VIDEOS);
      getLocalItem(STORAGE_KEYS.BRIEFS, INITIAL_BRIEFS);
      getLocalItem(STORAGE_KEYS.HOROSCOPES, INITIAL_HOROSCOPES);
      getLocalItem(STORAGE_KEYS.SUPPLEMENTS, INITIAL_SUPPLEMENTS);
      getLocalItem(STORAGE_KEYS.NEWS_TIPS, INITIAL_NEWS_TIPS);
      getLocalItem(STORAGE_KEYS.CMS_PAGES, INITIAL_CMS_PAGES);
    } else {
      // In live Supabase mode, clear any cached local dummy articles and breaking news
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.removeItem(STORAGE_KEYS.ARTICLES);
          localStorage.removeItem(STORAGE_KEYS.BREAKING_NEWS);
        } catch {
          // ignore
        }
      }
    }
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
    isTop?: boolean;
    tagSlug?: string;
    authorId?: string;
    authorSlug?: string;
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

        if (options.isTop !== undefined) {
          query = query.eq('is_top', options.isTop);
        }

        if (options.authorId) {
          query = query.eq('author_id', options.authorId);
        }

        if (options.search) {
          const cleanSearch = options.search.trim().slice(0, 100).replace(/[,()"\\]/g, ' ');
          if (cleanSearch) {
            query = query.or(`headline.ilike.%${cleanSearch}%,excerpt.ilike.%${cleanSearch}%`);
          }
        }

        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const orderColumn = options.isTop ? 'top_rank' : 'published_at';
        const { data, count, error } = await query.order(orderColumn, { ascending: options.isTop ? true : false }).range(from, to);

        if (!error && data) {
          return {
            articles: data as Article[],
            total: count !== null && count !== undefined ? count : data.length,
            page,
            totalPages: Math.ceil((count !== null && count !== undefined ? count : data.length) / limit) || 1,
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

    const profiles = getLocalItem<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    const profileMap = new Map(profiles.map(p => [p.id, p]));

    // Populate categories & author relation
    let filtered = allArticles.map(art => ({
      ...art,
      categories: (art.category_ids || []).map(id => categoryMap.get(id)).filter(Boolean) as Category[],
      author: art.author || (art.author_id ? profileMap.get(art.author_id) : undefined),
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

    // Hierarchical category filtering
    if (options.categorySlug) {
      const targetCat = categories.find(c => c.slug === options.categorySlug);
      if (targetCat) {
        const allowedCatIds = new Set<string>([targetCat.id]);
        categories.forEach(c => {
          if (c.parent_id === targetCat.id) {
            allowedCatIds.add(c.id);
          }
        });
        filtered = filtered.filter(art =>
          art.category_ids?.some(id => allowedCatIds.has(id)) ||
          art.categories?.some(cat => cat.slug === options.categorySlug || allowedCatIds.has(cat.id))
        );
      } else {
        filtered = filtered.filter(art =>
          art.categories?.some(cat => cat.slug === options.categorySlug)
        );
      }
    }

    // Filter by top news
    if (options.isTop !== undefined) {
      filtered = filtered.filter(art => art.is_top === options.isTop);
    }

    // Filter by tag
    if (options.tagSlug) {
      const qTag = options.tagSlug.toLowerCase().trim();
      filtered = filtered.filter(art =>
        art.tags?.some(t => {
          const norm = t.toLowerCase().trim();
          return norm === qTag || norm.replace(/\s+/g, '-') === qTag;
        })
      );
    }

    // Filter by author
    if (options.authorId) {
      filtered = filtered.filter(art => art.author_id === options.authorId);
    }
    if (options.authorSlug) {
      filtered = filtered.filter(art => art.author?.slug === options.authorSlug);
    }

    // Filter by breaking
    if (options.isBreaking !== undefined) {
      filtered = filtered.filter(art => art.is_breaking === options.isBreaking);
    }

    // Search query
    if (options.search) {
      const q = options.search.toLowerCase().trim().slice(0, 100);
      filtered = filtered.filter(art =>
        art.headline.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q) ||
        art.body.toLowerCase().includes(q) ||
        art.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort by top_rank if isTop, or publication date
    filtered.sort((a, b) => {
      if (options.isTop) {
        const rankA = a.top_rank ?? 999;
        const rankB = b.top_rank ?? 999;
        if (rankA !== rankB) return rankA - rankB;
      }
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
      if (isSupabaseConfigured()) {
        try {
          const dbPayload: Record<string, unknown> = {
            slug,
            headline: articleData.headline,
            subtitle: articleData.subtitle || null,
            excerpt: articleData.excerpt,
            body: cleanBody !== undefined ? cleanBody : undefined,
            language: articleData.language,
            featured_image_path: articleData.featured_image_path || null,
            image_alt: articleData.image_alt || null,
            image_caption: articleData.image_caption || null,
            status: articleData.status,
            is_breaking: articleData.is_breaking !== undefined ? Boolean(articleData.is_breaking) : undefined,
            seo_title: articleData.seo_title || articleData.headline,
            seo_description: articleData.seo_description || articleData.excerpt,
            reading_time_minutes: articleData.reading_time_minutes,
            published_at: articleData.status === 'published' ? (published_at || now) : null,
            scheduled_at: articleData.scheduled_at || null,
            updated_at: now,
          };
          Object.keys(dbPayload).forEach(k => dbPayload[k] === undefined && delete dbPayload[k]);

          if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(articleData.id)) {
            await supabase.from('articles').update(dbPayload).eq('id', articleData.id);
          }
        } catch (err) {
          console.warn('Supabase update article error:', err);
        }
      }

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
      let generatedId = `art-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      if (isSupabaseConfigured()) {
        try {
          const dbPayload: Record<string, unknown> = {
            slug,
            headline: articleData.headline || '',
            subtitle: articleData.subtitle || null,
            excerpt: articleData.excerpt || '',
            body: cleanBody || '',
            language: articleData.language || 'mr',
            featured_image_path: articleData.featured_image_path || null,
            image_alt: articleData.image_alt || null,
            image_caption: articleData.image_caption || null,
            status: articleData.status || 'draft',
            is_breaking: Boolean(articleData.is_breaking),
            seo_title: articleData.seo_title || articleData.headline,
            seo_description: articleData.seo_description || articleData.excerpt,
            reading_time_minutes: articleData.reading_time_minutes || 2,
            published_at: articleData.status === 'published' ? (published_at || now) : null,
            scheduled_at: articleData.scheduled_at || null,
            created_at: now,
            updated_at: now,
          };
          const { data: inserted, error: insertErr } = await supabase.from('articles').insert(dbPayload).select('id').single();
          if (!insertErr && inserted?.id) {
            generatedId = inserted.id;
          }
        } catch (err) {
          console.warn('Supabase insert article error:', err);
        }
      }

      const newArticle: Article = {
        id: generatedId,
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
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('articles').delete().eq('id', articleId);
      } catch (err) {
        console.warn('Supabase deleteArticle error:', err);
      }
    }

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
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*, translations:category_translations(*)')
          .order('sort_order', { ascending: true });
        if (!error && data && data.length > 0) {
          return data.map((c: any) => ({
            ...c,
            translations: (c.translations || []).reduce((acc: any, t: any) => {
              acc[t.language] = t;
              return acc;
            }, {})
          })) as Category[];
        }
      } catch (err) {
        console.warn('Supabase getCategories error:', err);
      }
    }
    const categories = getLocalItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    return categories.sort((a, b) => a.sort_order - b.sort_order);
  }

  async saveCategory(categoryData: Partial<Category>): Promise<Category> {
    if (isSupabaseConfigured()) {
      try {
        const isValidUUID = categoryData.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryData.id);
        const catPayload: Record<string, unknown> = {
          slug: categoryData.slug,
          sort_order: categoryData.sort_order || 1,
          is_active: categoryData.is_active ?? true,
        };
        if (isValidUUID) {
          catPayload.id = categoryData.id;
        }
        const { data: dbCat, error: catErr } = await supabase.from('categories').upsert(catPayload).select().single();
        if (!catErr && dbCat && categoryData.translations) {
          for (const [lang, trans] of Object.entries(categoryData.translations)) {
            if (trans && (trans as any).name) {
              await supabase.from('category_translations').upsert({
                category_id: dbCat.id,
                language: lang,
                name: (trans as any).name,
                description: (trans as any).description || null,
              }, { onConflict: 'category_id,language' });
            }
          }
        }
      } catch (err) {
        console.warn('Supabase saveCategory error:', err);
      }
    }

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
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('breaking_news').select('*, article:articles(*)');
        if (!includeInactive) {
          query = query.eq('is_active', true);
        }
        if (language) {
          query = query.eq('language', language);
        }
        const { data, error } = await query.order('display_order', { ascending: true });
        if (!error && data) {
          return data as BreakingNewsItem[];
        }
      } catch (err) {
        console.warn('Supabase getBreakingNews error:', err);
      }
    }
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
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('breaking_news')
          .select('*, article:articles(*)')
          .order('display_order', { ascending: true });
        if (!error && data) {
          return data as BreakingNewsItem[];
        }
      } catch (err) {
        console.warn('Supabase getAllBreakingNewsAdmin error:', err);
      }
    }
    const items = getLocalItem<BreakingNewsItem[]>(STORAGE_KEYS.BREAKING_NEWS, INITIAL_BREAKING_NEWS);
    const articlesResult = await this.getArticles({ limit: 1000, includePrivate: true });
    const articleMap = new Map(articlesResult.articles.map(a => [a.id, a]));

    return items.map(item => ({
      ...item,
      article: articleMap.get(item.article_id),
    })).sort((a, b) => a.display_order - b.display_order);
  }

  async saveBreakingNewsItem(itemData: Partial<BreakingNewsItem>): Promise<BreakingNewsItem> {
    const now = new Date().toISOString();
    if (isSupabaseConfigured()) {
      try {
        if (itemData.id && !itemData.id.startsWith('brk-')) {
          const { data, error } = await supabase
            .from('breaking_news')
            .update({
              article_id: itemData.article_id || null,
              language: itemData.language || 'mr',
              custom_headline: itemData.custom_headline || '',
              display_order: itemData.display_order || 1,
              is_active: itemData.is_active ?? true,
              expires_at: itemData.expires_at || null,
              updated_at: now,
            })
            .eq('id', itemData.id)
            .select()
            .single();
          if (!error && data) return data as BreakingNewsItem;
        } else {
          const { data, error } = await supabase
            .from('breaking_news')
            .insert({
              article_id: itemData.article_id || null,
              language: itemData.language || 'mr',
              custom_headline: itemData.custom_headline || '',
              display_order: itemData.display_order || 1,
              is_active: itemData.is_active ?? true,
              expires_at: itemData.expires_at || null,
              created_at: now,
              updated_at: now,
            })
            .select()
            .single();
          if (!error && data) return data as BreakingNewsItem;
        }
      } catch (e) {
        console.warn('Supabase saveBreakingNewsItem error:', e);
      }
    }

    const items = getLocalItem<BreakingNewsItem[]>(STORAGE_KEYS.BREAKING_NEWS, INITIAL_BREAKING_NEWS);

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
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('breaking_news').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase deleteBreakingNewsItem error:', e);
      }
    }
    const items = getLocalItem<BreakingNewsItem[]>(STORAGE_KEYS.BREAKING_NEWS, INITIAL_BREAKING_NEWS);
    setLocalItem(STORAGE_KEYS.BREAKING_NEWS, items.filter(i => i.id !== id));
  }

  // --------------------------------------------------------------------------
  // SITE SETTINGS
  // --------------------------------------------------------------------------
  async getSiteSettings(): Promise<SiteSettings> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('site_settings').select('*').eq('id', 'default').single();
        if (!error && data) {
          return data as SiteSettings;
        }
      } catch (e) {
        console.warn('Supabase getSiteSettings error:', e);
      }
    }
    return getLocalItem<SiteSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SITE_SETTINGS);
  }

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSiteSettings();
    const updated: SiteSettings = {
      ...current,
      ...settings,
      updated_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('site_settings').upsert({
          id: 'default',
          ...updated,
        });
      } catch (e) {
        console.warn('Supabase updateSiteSettings error:', e);
      }
    }
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
    const target = assets.find(a => a.id === id);
    if (target && isSupabaseConfigured() && target.storage_path && !target.storage_path.startsWith('local/')) {
      try {
        await supabase.storage.from('article-media').remove([target.storage_path]);
      } catch (err) {
        console.warn('Supabase deleteMedia storage error:', err);
      }
    }
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
    if (isSupabaseConfigured()) {
      try {
        const [
          { count: publishedCount, error: errPub },
          { count: draftsCount, error: errDraft },
          { count: scheduledCount, error: errSched },
          { count: breakingCount, error: errBrk },
          { count: categoriesCount, error: errCat },
          { data: recentData, error: errRecent }
        ] = await Promise.all([
          supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
          supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
          supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'scheduled'),
          supabase.from('breaking_news').select('*', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('categories').select('*', { count: 'exact', head: true }),
          supabase.from('articles').select('*, categories:article_categories(category:categories(*)), author:profiles(*)').order('updated_at', { ascending: false }).limit(5),
        ]);

        if (!errPub && !errDraft && !errSched && !errBrk && !errCat && !errRecent) {
          return {
            publishedCount: publishedCount || 0,
            draftsCount: draftsCount || 0,
            scheduledCount: scheduledCount || 0,
            breakingCount: breakingCount || 0,
            totalCategories: categoriesCount || 0,
            recentActivity: (recentData as Article[]) || [],
          };
        }
      } catch (err) {
        console.warn('Supabase getDashboardStats error:', err);
      }
    }

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

  async getEpaperEditionByDate(date: string, region: string = 'mumbai'): Promise<EpaperEdition | null> {
    const { editions } = await this.getEpaperEditions({ date, isPublished: true });
    return editions.find(e => e.edition_region === region) || editions[0] || null;
  }

  async saveEpaperClip(clip: {
    edition_id: string;
    page_number: number;
    title?: string;
    clip_url: string;
  }): Promise<EpaperClip> {
    const clips = getLocalItem<EpaperClip[]>('djs_epaper_clips', []);
    const newClip: EpaperClip = {
      id: `clip-${Date.now()}`,
      edition_id: clip.edition_id,
      page_number: clip.page_number,
      title: clip.title || 'वृत्त कतरन',
      clip_url: clip.clip_url,
      share_count: 1,
      created_at: new Date().toISOString(),
    };
    clips.unshift(newClip);
    setLocalItem('djs_epaper_clips', clips);
    return newClip;
  }

  async saveEpaperEdition(data: Partial<EpaperEdition>): Promise<EpaperEdition> {
    const editions = getLocalItem<EpaperEdition[]>(STORAGE_KEYS.EPAPER, INITIAL_EPAPER_EDITIONS);
    const now = new Date().toISOString();

    if (isSupabaseConfigured()) {
      try {
        const isValidUUID = data.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.id);
        const epaperDbPayload: Record<string, unknown> = {
          edition_date: data.edition_date || new Date().toISOString().split('T')[0],
          edition_region: data.edition_region || 'mumbai',
          title: data.title || 'दैनिक जगत समीक्षा - डिजिटल ई-पेपर',
          title_mr: data.title_mr || data.title,
          title_hi: data.title_hi || data.title,
          description: data.description || '',
          thumbnail_url: data.thumbnail_url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
          pdf_url: data.pdf_url || null,
          total_pages: data.total_pages || (data.pages?.length || 1),
          is_published: data.is_published ?? true,
          updated_at: now,
        };
        if (isValidUUID) {
          epaperDbPayload.id = data.id;
        }
        await supabase.from('epaper_editions').upsert(epaperDbPayload);
      } catch (err) {
        console.warn('Supabase saveEpaperEdition error:', err);
      }
    }

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
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('epaper_editions').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteEpaperEdition error:', err);
      }
    }

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
    if (isSupabaseConfigured()) {
      try {
        await supabase.rpc('increment_epaper_views', { edition_id: editionId });
      } catch (err) {
        console.warn('Supabase increment_epaper_views failed:', err);
      }
    }
    const editions = getLocalItem<EpaperEdition[]>(STORAGE_KEYS.EPAPER, INITIAL_EPAPER_EDITIONS);
    const edition = editions.find(e => e.id === editionId);
    if (edition) {
      edition.views_count = (edition.views_count || 0) + 1;
      setLocalItem(STORAGE_KEYS.EPAPER, editions);
    }
  }

  async incrementEpaperDownloads(editionId: string): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        await supabase.rpc('increment_epaper_downloads', { edition_id: editionId });
      } catch (err) {
        console.warn('Supabase increment_epaper_downloads failed:', err);
      }
    }
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

  // --------------------------------------------------------------------------
  // AUTHORS & PROFILES
  // --------------------------------------------------------------------------
  async getAuthors(): Promise<Profile[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('public_profiles')
          .select('*')
          .order('display_name', { ascending: true });
        if (!error && data && data.length > 0) {
          return data as Profile[];
        }
      } catch (err) {
        console.warn('Supabase getAuthors failed, using local fallback:', err);
      }
    }
    return getLocalItem<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
  }

  async getAuthorBySlug(slug: string): Promise<Profile | null> {
    const authors = await this.getAuthors();
    return authors.find(a => a.slug === slug) || null;
  }

  async getAuthorById(id: string): Promise<Profile | null> {
    const authors = await this.getAuthors();
    return authors.find(a => a.id === id) || null;
  }

  async getArticlesByAuthor(
    authorIdOrSlug: string,
    options: { language?: SupportedLanguage; page?: number; limit?: number } = {}
  ): Promise<{ articles: Article[]; total: number; page: number; totalPages: number }> {
    const authors = await this.getAuthors();
    const author = authors.find(a => a.id === authorIdOrSlug || a.slug === authorIdOrSlug);
    if (!author) {
      return { articles: [], total: 0, page: 1, totalPages: 1 };
    }
    return this.getArticles({
      ...options,
      authorId: author.id,
    });
  }

  // --------------------------------------------------------------------------
  // HOME BLOCKS
  // --------------------------------------------------------------------------
  async getHomeBlocks(): Promise<HomeBlock[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('home_blocks')
          .select('*, category:categories(*)')
          .order('sort_order', { ascending: true });
        if (!error && data) {
          return data as HomeBlock[];
        }
      } catch (err) {
        console.warn('Supabase getHomeBlocks failed, using local fallback:', err);
      }
    }
    const blocks = getLocalItem<HomeBlock[]>(STORAGE_KEYS.HOME_BLOCKS, INITIAL_HOME_BLOCKS);
    const categories = getLocalItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const catMap = new Map(categories.map(c => [c.id, c]));

    return blocks
      .map(b => ({
        ...b,
        category: b.category_id ? catMap.get(b.category_id) : undefined,
      }))
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  async saveHomeBlock(block: Partial<HomeBlock> & { block_type: HomeBlock['block_type'] }): Promise<HomeBlock> {
    const blocks = getLocalItem<HomeBlock[]>(STORAGE_KEYS.HOME_BLOCKS, INITIAL_HOME_BLOCKS);
    let saved: HomeBlock;

    if (block.id) {
      const idx = blocks.findIndex(b => b.id === block.id);
      if (idx >= 0) {
        saved = { ...blocks[idx], ...block } as HomeBlock;
        blocks[idx] = saved;
      } else {
        saved = {
          id: block.id,
          block_type: block.block_type,
          item_count: block.item_count || 4,
          sort_order: block.sort_order || blocks.length + 1,
          is_active: block.is_active !== undefined ? block.is_active : true,
          created_at: new Date().toISOString(),
          ...block,
        } as HomeBlock;
        blocks.push(saved);
      }
    } else {
      saved = {
        id: `hb-${Date.now()}`,
        block_type: block.block_type,
        item_count: block.item_count || 4,
        sort_order: blocks.length + 1,
        is_active: true,
        created_at: new Date().toISOString(),
        ...block,
      } as HomeBlock;
      blocks.push(saved);
    }

    setLocalItem(STORAGE_KEYS.HOME_BLOCKS, blocks);

    if (isSupabaseConfigured()) {
      Promise.resolve(
        supabase.from('home_blocks').upsert({
          id: saved.id,
          block_type: saved.block_type,
          category_id: saved.category_id || null,
          title_override_hi: saved.title_override_hi,
          title_override_mr: saved.title_override_mr,
          title_override_en: saved.title_override_en,
          item_count: saved.item_count,
          sort_order: saved.sort_order,
          is_active: saved.is_active,
        })
      ).catch(e => console.warn('Supabase home block sync failed:', e));
    }

    return saved;
  }

  async reorderHomeBlocks(orderedIds: string[]): Promise<void> {
    const blocks = getLocalItem<HomeBlock[]>(STORAGE_KEYS.HOME_BLOCKS, INITIAL_HOME_BLOCKS);
    const updated = blocks.map(b => {
      const newOrder = orderedIds.indexOf(b.id);
      return newOrder >= 0 ? { ...b, sort_order: newOrder + 1 } : b;
    });
    setLocalItem(STORAGE_KEYS.HOME_BLOCKS, updated);

    if (isSupabaseConfigured()) {
      Promise.all(
        updated.map(b =>
          supabase.from('home_blocks').update({ sort_order: b.sort_order }).eq('id', b.id)
        )
      ).catch(e => console.warn('Supabase home block reorder sync failed:', e));
    }
  }

  async deleteHomeBlock(id: string): Promise<void> {
    let blocks = getLocalItem<HomeBlock[]>(STORAGE_KEYS.HOME_BLOCKS, INITIAL_HOME_BLOCKS);
    blocks = blocks.filter(b => b.id !== id);
    setLocalItem(STORAGE_KEYS.HOME_BLOCKS, blocks);

    if (isSupabaseConfigured()) {
      Promise.resolve(supabase.from('home_blocks').delete().eq('id', id)).catch(e =>
        console.warn('Supabase home block delete failed:', e)
      );
    }
  }

  // --------------------------------------------------------------------------
  // PHASE 2: PHOTO GALLERIES
  // --------------------------------------------------------------------------
  async getGalleries(options: { isPublished?: boolean; limit?: number } = {}): Promise<Gallery[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase
          .from('galleries')
          .select('*, images:gallery_images(*)')
          .order('published_at', { ascending: false });
        if (options.isPublished !== undefined) {
          query = query.eq('is_published', options.isPublished);
        }
        if (options.limit) {
          query = query.limit(options.limit);
        }
        const { data, error } = await query;
        if (!error && data) {
          return data as Gallery[];
        }
      } catch (e) {
        console.warn('Supabase getGalleries fallback:', e);
      }
    }
    let list = getLocalItem<Gallery[]>(STORAGE_KEYS.GALLERIES, INITIAL_GALLERIES);
    if (options.isPublished !== undefined) {
      list = list.filter(g => g.is_published === options.isPublished);
    }
    if (options.limit) {
      list = list.slice(0, options.limit);
    }
    return list;
  }

  async getGalleryBySlug(slug: string): Promise<Gallery | null> {
    const list = await this.getGalleries();
    return list.find(g => g.slug === slug) || null;
  }

  async saveGallery(gallery: Partial<Gallery>): Promise<Gallery> {
    const list = getLocalItem<Gallery[]>(STORAGE_KEYS.GALLERIES, INITIAL_GALLERIES);
    let saved: Gallery;
    const slug = gallery.slug?.trim() || generateSlug(gallery.title_hi || gallery.title_en || 'gallery');

    if (gallery.id) {
      const idx = list.findIndex(g => g.id === gallery.id);
      saved = {
        ...list[idx],
        ...gallery,
        slug,
      } as Gallery;
      if (idx >= 0) list[idx] = saved;
      else list.push(saved);
    } else {
      saved = {
        id: `gal-${Date.now()}`,
        slug,
        title_hi: gallery.title_hi || '',
        title_mr: gallery.title_mr || '',
        title_en: gallery.title_en || '',
        cover_image_url: gallery.cover_image_url || 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80',
        credit: gallery.credit,
        is_published: gallery.is_published !== undefined ? gallery.is_published : true,
        published_at: gallery.published_at || new Date().toISOString(),
        created_at: new Date().toISOString(),
        images: gallery.images || [],
      };
      list.push(saved);
    }
    setLocalItem(STORAGE_KEYS.GALLERIES, list);

    if (isSupabaseConfigured()) {
      Promise.resolve(
        supabase.from('galleries').upsert({
          id: saved.id,
          slug: saved.slug,
          title_hi: saved.title_hi,
          title_mr: saved.title_mr,
          title_en: saved.title_en,
          cover_image_url: saved.cover_image_url,
          credit: saved.credit,
          is_published: saved.is_published,
          published_at: saved.published_at,
        })
      ).catch(e => console.warn('Supabase gallery sync error:', e));
    }

    return saved;
  }

  async deleteGallery(id: string): Promise<void> {
    let list = getLocalItem<Gallery[]>(STORAGE_KEYS.GALLERIES, INITIAL_GALLERIES);
    list = list.filter(g => g.id !== id);
    setLocalItem(STORAGE_KEYS.GALLERIES, list);

    if (isSupabaseConfigured()) {
      Promise.resolve(supabase.from('galleries').delete().eq('id', id)).catch(e =>
        console.warn('Supabase delete gallery error:', e)
      );
    }
  }

  // --------------------------------------------------------------------------
  // PHASE 2: VIDEOS
  // --------------------------------------------------------------------------
  async getVideos(options: { isPublished?: boolean; limit?: number } = {}): Promise<VideoItem[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase
          .from('videos')
          .select('*')
          .order('published_at', { ascending: false });
        if (options.isPublished !== undefined) {
          query = query.eq('is_published', options.isPublished);
        }
        if (options.limit) {
          query = query.limit(options.limit);
        }
        const { data, error } = await query;
        if (!error && data) {
          return data as VideoItem[];
        }
      } catch (e) {
        console.warn('Supabase getVideos fallback:', e);
      }
    }
    let list = getLocalItem<VideoItem[]>(STORAGE_KEYS.VIDEOS, INITIAL_VIDEOS);
    if (options.isPublished !== undefined) {
      list = list.filter(v => v.is_published === options.isPublished);
    }
    if (options.limit) {
      list = list.slice(0, options.limit);
    }
    return list;
  }

  async getVideoBySlug(slug: string): Promise<VideoItem | null> {
    const list = await this.getVideos();
    return list.find(v => v.slug === slug) || null;
  }

  async saveVideo(video: Partial<VideoItem>): Promise<VideoItem> {
    const list = getLocalItem<VideoItem[]>(STORAGE_KEYS.VIDEOS, INITIAL_VIDEOS);
    let saved: VideoItem;
    const slug = video.slug?.trim() || generateSlug(video.title_hi || video.title_en || 'video');

    if (video.id) {
      const idx = list.findIndex(v => v.id === video.id);
      saved = {
        ...list[idx],
        ...video,
        slug,
      } as VideoItem;
      if (idx >= 0) list[idx] = saved;
      else list.push(saved);
    } else {
      saved = {
        id: `vid-${Date.now()}`,
        slug,
        provider: video.provider || 'youtube',
        video_id_or_url: video.video_id_or_url || '',
        title_hi: video.title_hi || '',
        title_mr: video.title_mr || '',
        title_en: video.title_en || '',
        description_hi: video.description_hi,
        description_mr: video.description_mr,
        description_en: video.description_en,
        thumbnail_url: video.thumbnail_url || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
        duration_seconds: video.duration_seconds || 300,
        is_published: video.is_published !== undefined ? video.is_published : true,
        published_at: video.published_at || new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      list.push(saved);
    }
    setLocalItem(STORAGE_KEYS.VIDEOS, list);

    if (isSupabaseConfigured()) {
      Promise.resolve(supabase.from('videos').upsert(saved)).catch(e =>
        console.warn('Supabase video sync error:', e)
      );
    }
    return saved;
  }

  async deleteVideo(id: string): Promise<void> {
    let list = getLocalItem<VideoItem[]>(STORAGE_KEYS.VIDEOS, INITIAL_VIDEOS);
    list = list.filter(v => v.id !== id);
    setLocalItem(STORAGE_KEYS.VIDEOS, list);

    if (isSupabaseConfigured()) {
      Promise.resolve(supabase.from('videos').delete().eq('id', id)).catch(e =>
        console.warn('Supabase delete video error:', e)
      );
    }
  }

  // --------------------------------------------------------------------------
  // PHASE 2: BRIEFS / FLASH NEWS (फटाफट खबरें)
  // --------------------------------------------------------------------------
  async getBriefs(options: { language?: SupportedLanguage; limit?: number } = {}): Promise<BriefItem[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase
          .from('briefs')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });
        if (options.language) {
          query = query.eq('language', options.language);
        }
        if (options.limit) {
          query = query.limit(options.limit);
        }
        const { data, error } = await query;
        if (!error && data) {
          return data as BriefItem[];
        }
      } catch (e) {
        console.warn('Supabase getBriefs fallback:', e);
      }
    }
    let list = getLocalItem<BriefItem[]>(STORAGE_KEYS.BRIEFS, INITIAL_BRIEFS);
    list = list.filter(b => b.is_published !== false);
    if (options.language) {
      list = list.filter(b => b.language === options.language);
    }
    if (options.limit) {
      list = list.slice(0, options.limit);
    }
    return list;
  }

  async saveBrief(brief: Partial<BriefItem>): Promise<BriefItem> {
    const list = getLocalItem<BriefItem[]>(STORAGE_KEYS.BRIEFS, INITIAL_BRIEFS);
    let saved: BriefItem;

    if (brief.id) {
      const idx = list.findIndex(b => b.id === brief.id);
      saved = { ...list[idx], ...brief } as BriefItem;
      if (idx >= 0) list[idx] = saved;
      else list.push(saved);
    } else {
      saved = {
        id: `brf-${Date.now()}`,
        language: brief.language || 'hi',
        content: brief.content || '',
        image_url: brief.image_url,
        target_url: brief.target_url,
        category_id: brief.category_id,
        is_published: brief.is_published !== undefined ? brief.is_published : true,
        created_at: new Date().toISOString(),
      };
      list.unshift(saved);
    }
    setLocalItem(STORAGE_KEYS.BRIEFS, list);

    if (isSupabaseConfigured()) {
      Promise.resolve(supabase.from('briefs').upsert(saved)).catch(e =>
        console.warn('Supabase brief sync error:', e)
      );
    }
    return saved;
  }

  async deleteBrief(id: string): Promise<void> {
    let list = getLocalItem<BriefItem[]>(STORAGE_KEYS.BRIEFS, INITIAL_BRIEFS);
    list = list.filter(b => b.id !== id);
    setLocalItem(STORAGE_KEYS.BRIEFS, list);

    if (isSupabaseConfigured()) {
      Promise.resolve(supabase.from('briefs').delete().eq('id', id)).catch(e =>
        console.warn('Supabase delete brief error:', e)
      );
    }
  }

  // --------------------------------------------------------------------------
  // PHASE 2: HOROSCOPES (राशिफल)
  // --------------------------------------------------------------------------
  async getHoroscopes(period: HoroscopePeriod = 'daily', dateFor?: string): Promise<HoroscopeItem[]> {
    const targetDate = dateFor || new Date().toISOString().split('T')[0];

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('horoscopes')
          .select('*')
          .eq('period', period)
          .eq('date_for', targetDate);
        if (!error && data) {
          return data as HoroscopeItem[];
        }
      } catch (e) {
        console.warn('Supabase getHoroscopes fallback:', e);
      }
    }
    const list = getLocalItem<HoroscopeItem[]>(STORAGE_KEYS.HOROSCOPES, INITIAL_HOROSCOPES);
    const filtered = list.filter(h => h.period === period);
    return filtered.length > 0 ? filtered : list;
  }

  async getHoroscopeForSign(
    sign: HoroscopeSign,
    period: HoroscopePeriod = 'daily',
    dateFor?: string
  ): Promise<HoroscopeItem | null> {
    const all = await this.getHoroscopes(period, dateFor);
    return all.find(h => h.sign === sign) || null;
  }

  async saveHoroscope(item: Partial<HoroscopeItem> & { sign: HoroscopeSign; period: HoroscopePeriod }): Promise<HoroscopeItem> {
    const list = getLocalItem<HoroscopeItem[]>(STORAGE_KEYS.HOROSCOPES, INITIAL_HOROSCOPES);
    const dateFor = item.date_for || new Date().toISOString().split('T')[0];
    const existingIdx = list.findIndex(h => h.sign === item.sign && h.period === item.period);

    let saved: HoroscopeItem;
    if (existingIdx >= 0) {
      saved = { ...list[existingIdx], ...item, date_for: dateFor };
      list[existingIdx] = saved;
    } else {
      saved = {
        id: `horo-${item.sign}-${Date.now()}`,
        period: item.period,
        date_for: dateFor,
        sign: item.sign,
        content_hi: item.content_hi || '',
        content_mr: item.content_mr,
        content_en: item.content_en,
        lucky_number: item.lucky_number,
        lucky_color: item.lucky_color,
        author_credit: item.author_credit || 'दैनिक जगत समीक्षा ज्योतिष केंद्र',
        created_at: new Date().toISOString(),
      };
      list.push(saved);
    }
    setLocalItem(STORAGE_KEYS.HOROSCOPES, list);

    if (isSupabaseConfigured()) {
      Promise.resolve(supabase.from('horoscopes').upsert(saved)).catch(e =>
        console.warn('Supabase horoscope sync error:', e)
      );
    }
    return saved;
  }

  async saveHoroscopesBatch(items: Array<Partial<HoroscopeItem> & { sign: HoroscopeSign; period: HoroscopePeriod }>): Promise<HoroscopeItem[]> {
    const results: HoroscopeItem[] = [];
    for (const item of items) {
      const saved = await this.saveHoroscope(item);
      results.push(saved);
    }
    return results;
  }

  // --------------------------------------------------------------------------
  // PHASE 2: SUPPLEMENTS (विशेषांक)
  // --------------------------------------------------------------------------
  async getSupplements(options: { isPublished?: boolean } = {}): Promise<SupplementItem[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('supplements').select('*').order('issue_date', { ascending: false });
        if (options.isPublished !== undefined) {
          query = query.eq('is_published', options.isPublished);
        }
        const { data, error } = await query;
        if (!error && data) {
          return data as SupplementItem[];
        }
      } catch (e) {
        console.warn('Supabase getSupplements fallback:', e);
      }
    }
    let list = getLocalItem<SupplementItem[]>(STORAGE_KEYS.SUPPLEMENTS, INITIAL_SUPPLEMENTS);
    if (options.isPublished !== undefined) {
      list = list.filter(s => s.is_published === options.isPublished);
    }
    return list;
  }

  async getSupplementBySlug(slug: string): Promise<SupplementItem | null> {
    const list = await this.getSupplements();
    return list.find(s => s.slug === slug) || null;
  }

  async saveSupplement(supplement: Partial<SupplementItem>): Promise<SupplementItem> {
    const list = getLocalItem<SupplementItem[]>(STORAGE_KEYS.SUPPLEMENTS, INITIAL_SUPPLEMENTS);
    let saved: SupplementItem;
    const slug = supplement.slug?.trim() || generateSlug(supplement.title_hi || supplement.title_en || 'supplement');

    if (supplement.id) {
      const idx = list.findIndex(s => s.id === supplement.id);
      saved = { ...list[idx], ...supplement, slug } as SupplementItem;
      if (idx >= 0) list[idx] = saved;
      else list.push(saved);
    } else {
      saved = {
        id: `sup-${Date.now()}`,
        slug,
        title_hi: supplement.title_hi || '',
        title_mr: supplement.title_mr || '',
        title_en: supplement.title_en || '',
        cover_image_url: supplement.cover_image_url || 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=80',
        issue_date: supplement.issue_date || new Date().toISOString().split('T')[0],
        description: supplement.description,
        pdf_url: supplement.pdf_url,
        is_published: supplement.is_published !== undefined ? supplement.is_published : true,
        created_at: new Date().toISOString(),
      };
      list.push(saved);
    }
    setLocalItem(STORAGE_KEYS.SUPPLEMENTS, list);

    if (isSupabaseConfigured()) {
      Promise.resolve(supabase.from('supplements').upsert(saved)).catch(e =>
        console.warn('Supabase supplement sync error:', e)
      );
    }
    return saved;
  }

  // --------------------------------------------------------------------------
  // PHASE 2: NEWS TIPS (समाचार भेजें)
  // --------------------------------------------------------------------------
  async submitNewsTip(tip: {
    sender_name: string;
    sender_phone: string;
    sender_city: string;
    message: string;
    image_urls?: string[];
    honeypot?: string;
    actionKey?: string;
  }): Promise<{ success: boolean; id?: string; error?: string }> {
    const formKey = tip.actionKey || 'news_tips_submit';
    const secValidation = validateFormSecurity(formKey, tip.honeypot, 10, 600000);
    if (!secValidation.allowed) {
      return { success: false, error: secValidation.error || 'सुरक्षा सत्यापन असफल रहा।' };
    }

    if (!tip.sender_name?.trim() || !tip.sender_phone?.trim() || !tip.message?.trim()) {
      return { success: false, error: 'कृपया सभी आवश्यक फ़ील्ड भरें।' };
    }

    const newTip: NewsTip = {
      id: `tip-${Date.now()}`,
      sender_name: tip.sender_name.trim(),
      sender_phone: tip.sender_phone.trim(),
      sender_city: tip.sender_city?.trim() || 'महाराष्ट्र',
      message: tip.message.trim(),
      image_urls: tip.image_urls || [],
      status: 'new',
      created_at: new Date().toISOString(),
    };

    const tips = getLocalItem<NewsTip[]>(STORAGE_KEYS.NEWS_TIPS, INITIAL_NEWS_TIPS);
    tips.unshift(newTip);
    setLocalItem(STORAGE_KEYS.NEWS_TIPS, tips);

    if (isSupabaseConfigured()) {
      Promise.resolve(
        supabase.from('news_tips').insert({
          id: newTip.id,
          sender_name: newTip.sender_name,
          sender_phone: newTip.sender_phone,
          sender_city: newTip.sender_city,
          message: newTip.message,
          image_urls: newTip.image_urls,
          status: newTip.status,
        })
      ).catch(e => console.warn('Supabase news tips insert error:', e));
    }

    return { success: true, id: newTip.id };
  }

  async getNewsTips(options: { status?: NewsTipStatus } = {}): Promise<NewsTip[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('news_tips').select('*').order('created_at', { ascending: false });
        if (options.status) {
          query = query.eq('status', options.status);
        }
        const { data, error } = await query;
        if (!error && data) {
          return data as NewsTip[];
        }
      } catch (e) {
        console.warn('Supabase getNewsTips fallback:', e);
      }
    }
    let list = getLocalItem<NewsTip[]>(STORAGE_KEYS.NEWS_TIPS, INITIAL_NEWS_TIPS);
    if (options.status) {
      list = list.filter(t => t.status === options.status);
    }
    return list;
  }

  async updateNewsTipStatus(id: string, status: NewsTipStatus): Promise<void> {
    const list = getLocalItem<NewsTip[]>(STORAGE_KEYS.NEWS_TIPS, INITIAL_NEWS_TIPS);
    const idx = list.findIndex(t => t.id === id);
    if (idx >= 0) {
      list[idx].status = status;
      setLocalItem(STORAGE_KEYS.NEWS_TIPS, list);
    }

    if (isSupabaseConfigured()) {
      Promise.resolve(supabase.from('news_tips').update({ status }).eq('id', id)).catch(e =>
        console.warn('Supabase updateNewsTipStatus error:', e)
      );
    }
  }

  // --------------------------------------------------------------------------
  // PHASE 2: CMS EDITABLE PAGES
  // --------------------------------------------------------------------------
  async getPage(slug: string): Promise<CMSPage | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('pages').select('*').eq('slug', slug).single();
        if (!error && data) {
          return data as CMSPage;
        }
      } catch (e) {
        console.warn('Supabase getPage fallback:', e);
      }
    }
    const pages = getLocalItem<CMSPage[]>(STORAGE_KEYS.CMS_PAGES, INITIAL_CMS_PAGES);
    return pages.find(p => p.slug === slug) || null;
  }

  async getAllPages(): Promise<CMSPage[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('pages').select('*');
        if (!error && data) {
          return data as CMSPage[];
        }
      } catch (e) {
        console.warn('Supabase getAllPages fallback:', e);
      }
    }
    return getLocalItem<CMSPage[]>(STORAGE_KEYS.CMS_PAGES, INITIAL_CMS_PAGES);
  }

  async savePage(page: CMSPage): Promise<CMSPage> {
    const pages = getLocalItem<CMSPage[]>(STORAGE_KEYS.CMS_PAGES, INITIAL_CMS_PAGES);
    const idx = pages.findIndex(p => p.slug === page.slug);
    const updated = {
      ...page,
      updated_at: new Date().toISOString(),
    };
    if (idx >= 0) pages[idx] = updated;
    else pages.push(updated);
    setLocalItem(STORAGE_KEYS.CMS_PAGES, pages);

    if (isSupabaseConfigured()) {
      Promise.resolve(supabase.from('pages').upsert(updated)).catch(e =>
        console.warn('Supabase savePage error:', e)
      );
    }
    return updated;
  }

  // --------------------------------------------------------------------------
  // PHASE 2: LIVE WEATHER SERVICE (Open-Meteo Integration)
  // --------------------------------------------------------------------------
  async fetchCityWeather(cityKey: string): Promise<WeatherData> {
    const city = SUPPORTED_WEATHER_CITIES.find(c => c.key === cityKey) || SUPPORTED_WEATHER_CITIES[0];
    const cacheKey = `${STORAGE_KEYS.WEATHER_CACHE}_${city.key}`;

    try {
      // 10-minute client cache to prevent API flooding
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached) as WeatherData;
        const age = Date.now() - new Date(parsed.updatedAt).getTime();
        if (age < 1000 * 60 * 10) {
          return parsed;
        }
      }

      // Fetch live weather from Open-Meteo
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const current = data.current;
        const code = current?.weather_code ?? 0;

        // Map weather code to Hindi/Marathi/English
        const conditions = getWeatherConditionText(code);
        const weather: WeatherData = {
          cityKey: city.key,
          cityName: city.name_hi,
          temperature: Math.round(current?.temperature_2m ?? 28),
          weatherCode: code,
          condition_hi: conditions.hi,
          condition_mr: conditions.mr,
          condition_en: conditions.en,
          windSpeed: Math.round(current?.wind_speed_10m ?? 12),
          humidity: current?.relative_humidity_2m,
          updatedAt: new Date().toISOString(),
        };

        try {
          localStorage.setItem(cacheKey, JSON.stringify(weather));
        } catch {
          // ignore storage quota issues
        }
        return weather;
      }
    } catch (e) {
      console.warn('Open-Meteo fetch error, returning fallback:', e);
    }

    // High quality offline fallback
    return {
      cityKey: city.key,
      cityName: city.name_hi,
      temperature: city.key === 'delhi' ? 31 : city.key === 'pune' ? 26 : 29,
      weatherCode: 1,
      condition_hi: 'साफ एवं सुहावना मौसम',
      condition_mr: 'स्वच्छ आणि आल्हाददायक हवामान',
      condition_en: 'Clear and pleasant',
      windSpeed: 14,
      humidity: 68,
      updatedAt: new Date().toISOString(),
    };
  }
}

// Helper to map WMO Weather Codes to Devanagari text
function getWeatherConditionText(code: number): { hi: string; mr: string; en: string } {
  if (code === 0) return { hi: 'स्वच्छ आकाश (धूप)', mr: 'निरभ्र आकाश (ऊन)', en: 'Clear sky' };
  if (code <= 3) return { hi: 'आंशिक बादल', mr: 'अंशतः ढगाळ', en: 'Partly cloudy' };
  if (code <= 48) return { hi: 'कोहरा एवं धुंध', mr: 'धुके व धुसर', en: 'Foggy / Haze' };
  if (code <= 55) return { hi: 'हल्की बूंदाबांदी', mr: 'हलका रिमझिम पाऊस', en: 'Light drizzle' };
  if (code <= 65) return { hi: 'मध्यम से भारी बारिश', mr: 'मध्यम ते मुसळधार पाऊस', en: 'Rain showers' };
  if (code <= 82) return { hi: 'गरज के साथ बौछारें', mr: 'विजांसह पाऊस', en: 'Thunderstorms' };
  return { hi: 'सामान्य मौसम', mr: 'सामान्य हवामान', en: 'Fair weather' };
}

export const repository = NewsRepository.getInstance();
