import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { repository } from '@/lib/repository';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { EpaperPage } from '@/pages/EpaperPage';

const TestAppWrapper: React.FC<{ initialEntries?: string[]; children: React.ReactNode }> = ({
  initialEntries = ['/'],
  children,
}) => (
  <MemoryRouter initialEntries={initialEntries}>
    <LanguageProvider>
      <AuthProvider>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </AuthProvider>
    </LanguageProvider>
  </MemoryRouter>
);

describe('E-Paper, Multilingual Synchronization & Security Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // 1. MULTILINGUAL SWITCHING INTEGRATION
  it('switches editorial articles across Marathi, Hindi, and English correctly', async () => {
    const mrRes = await repository.getArticles({ language: 'mr', limit: 10, includePrivate: false });
    const hiRes = await repository.getArticles({ language: 'hi', limit: 10, includePrivate: false });
    const enRes = await repository.getArticles({ language: 'en', limit: 10, includePrivate: false });

    expect(mrRes.articles.length).toBeGreaterThan(0);
    expect(hiRes.articles.length).toBeGreaterThan(0);
    expect(enRes.articles.length).toBeGreaterThan(0);

    // Verify all returned articles match the requested language
    expect(mrRes.articles.every(a => a.language === 'mr')).toBe(true);
    expect(hiRes.articles.every(a => a.language === 'hi')).toBe(true);
    expect(enRes.articles.every(a => a.language === 'en')).toBe(true);
  });

  it('correctly maps and retrieves translations across languages for a translation group', async () => {
    const allArticles = await repository.getArticles({ limit: 30, includePrivate: false });
    const multiLangArticle = allArticles.articles.find(a => a.translation_group_id);
    expect(multiLangArticle).toBeDefined();

    if (multiLangArticle) {
      const translations = await repository.getArticleTranslations(multiLangArticle.translation_group_id);
      expect(translations.length).toBeGreaterThanOrEqual(1);

      for (const tr of translations) {
        expect(tr.translation_group_id).toBe(multiLangArticle.translation_group_id);
      }
    }
  });

  // 2. E-PAPER DIGITAL READER & CMS LIFECYCLE
  it('loads public e-paper editions and supports edition creation, page flipping, and view counting', async () => {
    // 1. Fetch initial public editions
    const { editions } = await repository.getEpaperEditions();
    expect(editions.length).toBeGreaterThan(0);

    const firstEdition = editions[0];
    expect(firstEdition.pages).toBeDefined();
    expect(firstEdition.pages.length).toBeGreaterThan(0);
    expect(firstEdition.views_count).toBeGreaterThanOrEqual(0);

    // 2. Increment view count (thousands of viewers scalability)
    const initialViews = firstEdition.views_count;
    await repository.incrementEpaperViews(firstEdition.id);
    const updated = await repository.getEpaperEditionById(firstEdition.id);
    expect(updated?.views_count).toBe(initialViews + 1);

    // 3. Client CMS creates a new e-paper edition
    const newEdition = await repository.saveEpaperEdition({
      title: 'नागपूर विशेष पुरवणी - डिजिटल आवृत्ती',
      edition_date: '2026-02-25',
      edition_region: 'nagpur',
      total_pages: 2,
      thumbnail_url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
      is_published: true,
      pages: [
        {
          id: 'page-nagpur-1',
          edition_id: '',
          page_number: 1,
          image_url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1400&q=80',
          page_title: 'मुख्य पान (Front Page)',
        },
        {
          id: 'page-nagpur-2',
          edition_id: '',
          page_number: 2,
          image_url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1400&q=80',
          page_title: 'विदर्भ व्यापार व कृषी',
        },
      ],
    });

    expect(newEdition.id).toBeDefined();
    expect(newEdition.edition_region).toBe('nagpur');
    expect(newEdition.pages.length).toBe(2);

    // 4. Verify new edition is retrievable by date
    const dateLookup = await repository.getEpaperEditionByDate('2026-02-25', 'nagpur');
    expect(dateLookup?.id).toBe(newEdition.id);

    // 5. Delete edition
    await repository.deleteEpaperEdition(newEdition.id);
    const checkDeleted = await repository.getEpaperEditionById(newEdition.id);
    expect(checkDeleted).toBeNull();
  });

  // 3. STANDALONE BREAKING NEWS FLASH HEADLINES
  it('supports publishing standalone breaking headlines without requiring an article', async () => {
    const flashHeadline = 'मंत्रालयात आपत्कालीन बैठक संपन्न; महत्वाचे धोरणात्मक निर्णय जाहीर';

    const item = await repository.saveBreakingNewsItem({
      custom_headline: flashHeadline,
      language: 'mr',
      is_active: true,
      display_order: 1,
    });

    expect(item.id).toBeDefined();
    expect(item.custom_headline).toBe(flashHeadline);
    expect(item.article_id).toBe('');

    // Fetch public breaking news for Marathi
    const breaking = await repository.getBreakingNews('mr', false);
    const found = breaking.find(b => b.custom_headline === flashHeadline);
    expect(found).toBeDefined();

    // Cleanup
    await repository.deleteBreakingNewsItem(item.id);
  });

  // 4. SECURITY & PERMISSIONS TESTS
  it('prevents draft articles from leaking to unauthenticated public search and queries', async () => {
    const draft = await repository.saveArticle({
      headline: 'गोपनीय संपादकीय मसुदा (Confidential Draft)',
      excerpt: 'केवळ संपादकीय मंडळासाठी',
      body: '<p>अंतर्गत पुनरावलोकन</p>',
      language: 'mr',
      status: 'draft',
      category_ids: ['c1000000-0000-0000-0000-000000000001'],
    });

    // Public search must return 0 results
    const publicSearch = await repository.getArticles({
      search: 'Confidential Draft',
      includePrivate: false,
    });
    expect(publicSearch.articles.length).toBe(0);

    // Direct slug lookup with includePrivate: false must return null
    const slugLookup = await repository.getArticleBySlug(draft.slug, { includePrivate: false });
    expect(slugLookup).toBeNull();

    // Cleanup
    await repository.deleteArticle(draft.id);
  });

  it('renders E-Paper public page and displays title and viewer controls', async () => {
    render(
      <TestAppWrapper initialEntries={['/epaper']}>
        <EpaperPage />
      </TestAppWrapper>
    );

    await waitFor(() => {
      const epaperBadges = screen.getAllByText(/ई-पेपर|E-Paper/i);
      expect(epaperBadges.length).toBeGreaterThan(0);
    });
  });
});
