export type SupportedLanguage = 'mr' | 'hi' | 'en';

export type ArticleStatus = 'draft' | 'scheduled' | 'published' | 'archived';

export type UserRole = 'admin' | 'editor' | 'author';

export interface Profile {
  id: string;
  display_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  publication_name: string;
  publication_name_mr: string;
  publication_name_hi: string;
  tagline: string;
  tagline_mr?: string;
  tagline_hi?: string;
  tagline_en?: string;
  logo_path?: string;
  default_language: SupportedLanguage;
  supported_languages: SupportedLanguage[];
  contact_email: string;
  contact_phone: string;
  office_address: string;
  social_links: {
    twitter?: string;
    facebook?: string;
    youtube?: string;
    telegram?: string;
    instagram?: string;
    whatsapp?: string;
  };
  theme_settings: {
    accentColor: string;
    mastheadStyle: 'classic' | 'modern' | 'minimal';
    enableBreakingTicker: boolean;
  };
  updated_at: string;
}

export interface Category {
  id: string;
  slug: string;
  parent_id?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  translations?: Record<SupportedLanguage, CategoryTranslation>;
}

export interface CategoryTranslation {
  id: string;
  category_id: string;
  language: SupportedLanguage;
  name: string;
  description?: string;
}

export interface Article {
  id: string;
  slug: string;
  language: SupportedLanguage;
  translation_group_id: string;
  headline: string;
  subtitle?: string;
  excerpt: string;
  body: string;
  featured_image_path?: string;
  image_alt?: string;
  image_caption?: string;
  author_id?: string;
  author?: Profile;
  status: ArticleStatus;
  is_breaking: boolean;
  seo_title?: string;
  seo_description?: string;
  reading_time_minutes: number;
  published_at?: string | null;
  scheduled_at?: string | null;
  created_at: string;
  updated_at: string;
  category_ids?: string[];
  categories?: Category[];
  tags?: string[];
}

export interface MediaAsset {
  id: string;
  storage_path: string;
  public_url: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  alt_text?: string;
  caption?: string;
  uploaded_by?: string;
  created_at: string;
}

export interface BreakingNewsItem {
  id: string;
  article_id: string;
  article?: Article;
  language: SupportedLanguage;
  custom_headline?: string;
  display_order: number;
  is_active: boolean;
  expires_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface EpaperPage {
  id: string;
  edition_id: string;
  page_number: number;
  page_title: string;
  image_url: string;
  thumbnail_url?: string;
  created_at: string;
}

export interface EpaperEdition {
  id: string;
  edition_date: string; // YYYY-MM-DD
  edition_region: string; // 'pune' | 'mumbai' | 'maharashtra' | 'all'
  title: string;
  title_mr?: string;
  title_hi?: string;
  description?: string;
  thumbnail_url: string;
  pdf_url?: string;
  file_size_bytes?: number;
  total_pages: number;
  is_published: boolean;
  views_count: number;
  downloads_count: number;
  pages?: EpaperPage[];
  created_at: string;
  updated_at: string;
}

