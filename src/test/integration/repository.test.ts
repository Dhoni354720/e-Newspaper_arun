import { describe, it, expect, beforeEach } from 'vitest';
import { repository } from '@/lib/repository';
import { Article } from '@/types/database';

describe('NewsRepository & Publishing Lifecycle Integration Tests', () => {
  it('strictly excludes drafts from public articles queries', async () => {
    // 1. Fetch public articles
    const publicResult = await repository.getArticles({ includePrivate: false });
    const hasDrafts = publicResult.articles.some(a => a.status === 'draft');
    expect(hasDrafts).toBe(false);

    // 2. Fetch admin articles with includePrivate: true
    const adminResult = await repository.getArticles({ includePrivate: true, status: 'all' });
    const hasAdminDrafts = adminResult.articles.some(a => a.status === 'draft');
    expect(hasAdminDrafts).toBe(true);
  });

  it('strictly excludes future scheduled articles from public queries', async () => {
    const publicResult = await repository.getArticles({ includePrivate: false });
    const now = new Date();

    for (const art of publicResult.articles) {
      if (art.status === 'scheduled') {
        expect(art.status).not.toBe('scheduled');
      }
      if (art.published_at) {
        expect(new Date(art.published_at).getTime()).toBeLessThanOrEqual(now.getTime() + 1000);
      }
    }
  });

  it('filters articles by language accurately', async () => {
    const mrArticles = await repository.getArticles({ language: 'mr', includePrivate: false });
    for (const art of mrArticles.articles) {
      expect(art.language).toBe('mr');
    }

    const enArticles = await repository.getArticles({ language: 'en', includePrivate: false });
    for (const art of enArticles.articles) {
      expect(art.language).toBe('en');
    }
  });

  it('supports full lifecycle: draft -> publish -> unpublish -> delete', async () => {
    const testHeadline = 'चाचणी संपादकीय बातमी २०२६ - ' + Date.now();

    // 1. Create a draft
    const draft = await repository.saveArticle({
      headline: testHeadline,
      excerpt: 'चाचणी संक्षिप्त सारांश',
      body: '<p>चाचणी सविस्तर मजकूर.</p>',
      language: 'mr',
      status: 'draft',
      category_ids: ['c1000000-0000-0000-0000-000000000001'],
    });

    expect(draft.id).toBeDefined();
    expect(draft.status).toBe('draft');

    // 2. Verify draft does NOT appear on public feed
    const publicBefore = await repository.getArticles({ search: testHeadline, includePrivate: false });
    expect(publicBefore.articles.length).toBe(0);

    // 3. Publish the draft
    const published = await repository.saveArticle({
      id: draft.id,
      status: 'published',
      published_at: new Date().toISOString(),
    });
    expect(published.status).toBe('published');

    // 4. Verify it NOW appears on public feed
    const publicAfter = await repository.getArticles({ search: testHeadline, includePrivate: false });
    expect(publicAfter.articles.length).toBe(1);
    expect(publicAfter.articles[0].headline).toBe(testHeadline);

    // 5. Unpublish back to draft
    const unpublished = await repository.saveArticle({
      id: draft.id,
      status: 'draft',
      published_at: null,
    });
    expect(unpublished.status).toBe('draft');

    // 6. Verify it vanishes from public feed again
    const publicRecheck = await repository.getArticles({ search: testHeadline, includePrivate: false });
    expect(publicRecheck.articles.length).toBe(0);

    // 7. Delete article
    await repository.deleteArticle(draft.id);
    const lookup = await repository.getArticleById(draft.id, { includePrivate: true });
    expect(lookup).toBeNull();
  });
});
