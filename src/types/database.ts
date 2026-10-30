export type SupportedLanguage = 'mr' | 'hi' | 'en';

export type ArticleStatus = 'draft' | 'submitted' | 'scheduled' | 'published' | 'archived';

export type UserRole = 'admin' | 'editor' | 'author';

export interface Profile {
  id: string;
  display_name: string;
  slug?: string;
  role: UserRole;
  avatar_url?: string;
  bio_hi?: string;
  bio_mr?: string;
  bio_en?: string;
  designation?: string;
  social_links?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  is_columnist?: boolean;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  publication_name: string;
  publication_name_mr: string;
  publication_name_hi: string;
  publication_name_en?: string;
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
  editor_name?: string;
  rni_number?: string;
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
    mastheadStyle: 'broadsheet' | 'classic' | 'modern' | 'minimal';
    enableBreakingTicker: boolean;
  };
  updated_at: string;
}

export type CategoryKind = 'news' | 'city' | 'opinion' | 'supplement' | 'special';

export interface Category {
  id: string;
  slug: string;
  parent_id?: string | null;
  kind?: CategoryKind;
  show_in_nav?: boolean;
  nav_order?: number;
  color_hex?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  translations?: Record<SupportedLanguage, CategoryTranslation>;
  subcategories?: Category[];
}

export interface CategoryTranslation {
  id: string;
  category_id: string;
  language: SupportedLanguage;
  name: string;
  description?: string;
}

export type ArticleKind = 'standard' | 'lead' | 'feature' | 'opinion' | 'brief';

export interface Article {
  id: string;
  slug: string;
  language: SupportedLanguage;
  translation_group_id: string;
  headline: string;
  subtitle?: string;
  excerpt: string;
  body: string;
  dateline?: string; // e.g., 'दिल्ली:-', 'इंदौर:-'
  credit_line?: string; // e.g., 'जगत समीक्षा डेस्क', 'अरुण तिवारी'
  kind?: ArticleKind;
  is_top?: boolean;
  top_rank?: number;
  epaper_edition_id?: string | null;
  epaper_page_number?: number | null;
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

export type HomeBlockType =
  | 'hero'
  | 'ticker'
  | 'top_news'
  | 'latest'
  | 'city'
  | 'opinion'
  | 'crime'
  | 'sports'
  | 'entertainment'
  | 'lifestyle'
  | 'photo_strip'
  | 'video_strip'
  | 'rashifal'
  | 'weather'
  | 'epaper_promo'
  | 'ad_slot';

export interface HomeBlock {
  id: string;
  block_type: HomeBlockType;
  category_id?: string | null;
  category?: Category;
  title_override_hi?: string;
  title_override_mr?: string;
  title_override_en?: string;
  item_count: number;
  sort_order: number;
  is_active: boolean;
  config?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ArticleRevision {
  id: string;
  article_id: string;
  author_id?: string;
  author?: Profile;
  headline: string;
  body: string;
  excerpt?: string;
  change_summary?: string;
  created_at: string;
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
  zoom_image_url?: string;
  created_at: string;
}

export interface EpaperClip {
  id: string;
  edition_id: string;
  page_number: number;
  title?: string;
  clip_url: string;
  share_count: number;
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

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  created_at: string;
  updated_at: string;
}

// ----------------------------------------------------------------------------
// PHASE 2: NEW CONTENT TYPES & SUBSYSTEMS
// ----------------------------------------------------------------------------

export interface GalleryImage {
  id: string;
  gallery_id: string;
  image_url: string;
  thumbnail_url?: string;
  caption_hi?: string;
  caption_mr?: string;
  caption_en?: string;
  credit?: string;
  sort_order: number;
  created_at: string;
}

export interface Gallery {
  id: string;
  slug: string;
  title_hi: string;
  title_mr: string;
  title_en: string;
  cover_image_url: string;
  credit?: string;
  category_id?: string;
  category?: Category;
  images?: GalleryImage[];
  is_published: boolean;
  published_at: string;
  created_at: string;
}

export interface VideoItem {
  id: string;
  slug: string;
  provider: 'youtube' | 'vimeo' | 'custom';
  video_id_or_url: string;
  title_hi: string;
  title_mr: string;
  title_en: string;
  description_hi?: string;
  description_mr?: string;
  description_en?: string;
  thumbnail_url: string;
  duration_seconds?: number;
  category_id?: string;
  category?: Category;
  is_published: boolean;
  published_at: string;
  created_at: string;
}

export interface BriefItem {
  id: string;
  language: SupportedLanguage;
  content: string;
  image_url?: string;
  target_url?: string;
  category_id?: string;
  category?: Category;
  is_published: boolean;
  created_at: string;
}

export type HoroscopeSign =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces';

export type HoroscopePeriod = 'daily' | 'weekly' | 'monthly';

export interface HoroscopeItem {
  id: string;
  period: HoroscopePeriod;
  date_for: string; // YYYY-MM-DD
  sign: HoroscopeSign;
  content_hi: string;
  content_mr?: string;
  content_en?: string;
  lucky_number?: number;
  lucky_color?: string;
  author_credit?: string;
  created_at: string;
}

export interface SupplementItem {
  id: string;
  slug: string;
  title_hi: string;
  title_mr: string;
  title_en: string;
  cover_image_url: string;
  issue_date: string; // YYYY-MM-DD
  description?: string;
  pdf_url?: string;
  is_published: boolean;
  created_at: string;
}

export type NewsTipStatus = 'new' | 'reviewed' | 'used' | 'rejected';

export interface NewsTip {
  id: string;
  sender_name: string;
  sender_phone: string;
  sender_city: string;
  message: string;
  image_urls?: string[];
  status: NewsTipStatus;
  created_at: string;
}

export interface CMSPage {
  slug: string;
  title_hi: string;
  title_mr: string;
  title_en: string;
  body_hi: string;
  body_mr: string;
  body_en: string;
  meta_description?: string;
  is_published: boolean;
  updated_at: string;
}

export interface WeatherCity {
  key: string;
  name_hi: string;
  name_mr: string;
  name_en: string;
  latitude: number;
  longitude: number;
}

export interface WeatherData {
  cityKey: string;
  cityName: string;
  temperature: number; // Celsius
  weatherCode: number;
  condition_hi: string;
  condition_mr: string;
  condition_en: string;
  windSpeed: number; // km/h
  humidity?: number; // %
  updatedAt: string;
}


