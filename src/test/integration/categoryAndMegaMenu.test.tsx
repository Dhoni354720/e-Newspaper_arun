import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { Header } from '@/components/common/Header';
import { AuthorDetailPage } from '@/pages/AuthorDetailPage';
import { repository } from '@/lib/repository';

const TestWrapper: React.FC<{ initialEntries?: string[]; children: React.ReactNode }> = ({
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

describe('Category Hierarchy, Author Directory, and MegaMenu Integration', () => {
  it('loads hierarchical broadsheet categories with parent-child links', async () => {
    const categories = await repository.getCategories();
    expect(categories.length).toBeGreaterThanOrEqual(15);

    const maharashtra = categories.find(c => c.slug === 'maharashtra');
    expect(maharashtra).toBeDefined();

    // Mumbai should have maharashtra as its parent
    const mumbai = categories.find(c => c.slug === 'mumbai');
    expect(mumbai).toBeDefined();
    expect(mumbai?.parent_id).toBe(maharashtra?.id);

    // Kind categorization
    expect(maharashtra?.kind).toBe('city');
    const editorial = categories.find(c => c.slug === 'editorial');
    expect(editorial?.kind).toBe('opinion');
  });

  it('hierarchically queries articles when querying parent category slug', async () => {
    const res = await repository.getArticles({
      categorySlug: 'maharashtra',
      limit: 20,
    });

    expect(res.articles.length).toBeGreaterThan(0);
    // At least one article should be from child category (like mumbai) or maharashtra itself
    const foundChildOrParent = res.articles.some(
      a => a.categories?.some(c => c.slug === 'maharashtra' || c.slug === 'mumbai')
    );
    expect(foundChildOrParent).toBe(true);
  });

  it('retrieves Chief Editor Arun Ramakant Tiwari and author articles', async () => {
    const authors = await repository.getAuthors();
    expect(authors.length).toBeGreaterThan(0);

    const chiefEditor = await repository.getAuthorBySlug('arun-ramakant-tiwari');
    expect(chiefEditor).toBeDefined();
    expect(chiefEditor?.display_name).toBe('अरुण रमाकांत तिवारी');
    expect(chiefEditor?.designation).toBe('प्रधान संपादक (Chief Editor)');

    if (chiefEditor) {
      const authorRes = await repository.getArticlesByAuthor(chiefEditor.id);
      expect(authorRes.articles.length).toBeGreaterThan(0);
    }
  });

  it('renders AuthorDetailPage with editor profile, designation, and articles', async () => {
    render(
      <TestWrapper initialEntries={['/author/arun-ramakant-tiwari']}>
        <Routes>
          <Route path="/author/:slug" element={<AuthorDetailPage />} />
        </Routes>
      </TestWrapper>
    );

    await waitFor(
      () => {
        expect(screen.getByRole('heading', { name: 'अरुण रमाकांत तिवारी' })).toBeInTheDocument();
        expect(screen.getAllByText(/प्रधान संपादक/i).length).toBeGreaterThanOrEqual(1);
      },
      { timeout: 7000 }
    );
  }, 10000);

  it('toggles Mega Menu open and closed from Header navigation', async () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    // Find the Mega Menu button
    const megaMenuBtn = screen.getByRole('button', { name: /सभी अनुभाग|सर्व विभाग|All Sections/i });
    expect(megaMenuBtn).toBeInTheDocument();

    // Click to open Mega Menu
    fireEvent.click(megaMenuBtn);

    // MegaMenu content should now be visible with multiple category links
    await waitFor(
      () => {
        const matches = screen.getAllByText(/महाराष्ट्र/i);
        expect(matches.length).toBeGreaterThanOrEqual(2);
      },
      { timeout: 7000 }
    );

    // Click again to close MegaMenu
    fireEvent.click(megaMenuBtn);
  }, 10000);
});
