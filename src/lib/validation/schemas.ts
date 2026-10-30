import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'नाव किमान २ अक्षरांचे असावे (Name min 2 chars)').max(120, 'Name max 120 chars'),
  email: z.string().trim().email('वैध ईमेल पत्ता द्या (Invalid email address)').max(120, 'Email max 120 chars'),
  phone: z.string().trim().regex(/^[0-9+\s\-()]{7,20}$/, 'वैध फोन नंबर द्या (Invalid phone number)').optional().or(z.literal('')),
  message: z.string().trim().min(10, 'संदेश किमान १० अक्षरांचा असावा (Message min 10 chars)').max(5000, 'Message max 5000 chars'),
  honeypot: z.string().max(0, 'Spam detected').optional().default(''),
  turnstile_token: z.string().optional(),
}).strict();

export type ContactFormInput = z.infer<typeof contactFormSchema>;

export const newsTipFormSchema = z.object({
  sender_name: z.string().trim().min(2, 'नाव किमान २ अक्षरांचे असावे (Name min 2 chars)').max(120, 'Name max 120 chars'),
  sender_phone: z.string().trim().regex(/^[0-9+\s\-()]{7,20}$/, 'वैध फोन नंबर आवश्यक (Valid phone number required)'),
  sender_city: z.string().trim().min(2, 'शहराचे नाव द्या (City name required)').max(100, 'City max 100 chars'),
  message: z.string().trim().min(10, 'बातमीचा तपशील किमान १० अक्षरांचा असावा (Message min 10 chars)').max(5000, 'Message max 5000 chars'),
  image_urls: z.array(z.string().url('Invalid image URL').max(1000)).max(5, 'Maximum 5 images allowed').optional().default([]),
  honeypot: z.string().max(0, 'Spam detected').optional().default(''),
  turnstile_token: z.string().optional(),
}).strict();

export type NewsTipFormInput = z.infer<typeof newsTipFormSchema>;

export const articleInputSchema = z.object({
  id: z.string().optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens').max(200).optional(),
  headline: z.string().trim().min(5, 'Headline must be at least 5 chars').max(300, 'Headline max 300 chars'),
  subtitle: z.string().trim().max(500).optional().nullable(),
  excerpt: z.string().trim().max(1000).optional().nullable(),
  body: z.string().min(10, 'Article body must be at least 10 chars'),
  featured_image_path: z.string().max(1000).optional().nullable(),
  image_alt: z.string().max(300).optional().nullable(),
  image_caption: z.string().max(500).optional().nullable(),
  author_id: z.string().optional(),
  category_ids: z.array(z.string()).default([]),
  tags: z.array(z.string().max(50)).default([]),
  language: z.enum(['hi', 'mr', 'en']).default('hi'),
  status: z.enum(['draft', 'submitted', 'scheduled', 'published', 'archived']).default('draft'),
  is_breaking: z.boolean().default(false),
  seo_title: z.string().max(200).optional().nullable(),
  seo_description: z.string().max(500).optional().nullable(),
  scheduled_at: z.string().datetime().optional().nullable(),
  published_at: z.string().datetime().optional().nullable(),
}).strict();

export type ArticleInput = z.infer<typeof articleInputSchema>;

export const searchInputSchema = z.object({
  q: z.string().trim().max(100, 'Query exceeds maximum allowed length of 100 characters'),
  language: z.enum(['hi', 'mr', 'en']).optional(),
  category: z.string().max(50).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export type SearchInput = z.infer<typeof searchInputSchema>;
