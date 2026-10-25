import { describe, it, expect } from 'vitest';
import { generateSlug, ensureUniqueSlug } from '@/lib/slug';

describe('Slug Generation Unit Tests', () => {
  it('generates clean ASCII slug from English text', () => {
    const title = 'Maharashtra Budget 2026: Infrastructure & Rural Growth';
    const slug = generateSlug(title);
    expect(slug).toBe('maharashtra-budget-2026-infrastructure-rural-growth');
  });

  it('transliterates Devanagari text into URL-safe phonetic slug', () => {
    const marathiTitle = 'पुणे मुंबई द्रुतगती मार्ग';
    const slug = generateSlug(marathiTitle);
    expect(slug).toContain('pune');
    expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it('ensures slug uniqueness by appending sequential counters', () => {
    const existing = ['pune-mumbai-expressway', 'pune-mumbai-expressway-2'];
    const unique = ensureUniqueSlug('pune-mumbai-expressway', existing);
    expect(unique).toBe('pune-mumbai-expressway-3');
  });

  it('returns candidate directly if no collision exists', () => {
    const existing = ['delhi-news', 'mumbai-news'];
    const unique = ensureUniqueSlug('pune-news', existing);
    expect(unique).toBe('pune-news');
  });
});
