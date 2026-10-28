import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { SettingsProvider } from '@/context/SettingsContext';

// Public Pages
import { HomePage } from '@/pages/HomePage';
import { NewsFeedPage } from '@/pages/NewsFeedPage';
import { CategoryPage } from '@/pages/CategoryPage';
import { ArticleDetailPage } from '@/pages/ArticleDetailPage';
import { SearchPage } from '@/pages/SearchPage';
import { EpaperPage } from '@/pages/EpaperPage';
import { AboutPage, ContactPage, PrivacyPolicyPage, TermsPage, NotFoundPage } from '@/pages/StaticPages';

// Admin CMS Pages
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminArticlesPage } from '@/pages/admin/AdminArticlesPage';
import { AdminArticleEditorPage } from '@/pages/admin/AdminArticleEditorPage';
import { AdminCategoriesPage } from '@/pages/admin/AdminCategoriesPage';
import { AdminBreakingNewsPage } from '@/pages/admin/AdminBreakingNewsPage';
import { AdminEpaperPage } from '@/pages/admin/AdminEpaperPage';
import { AdminMediaPage } from '@/pages/admin/AdminMediaPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';
import { AdminAccountPage } from '@/pages/admin/AdminAccountPage';

import { isSupabaseConfigured } from '@/lib/supabase';
import { ConfigErrorScreen } from '@/components/common/ConfigErrorScreen';

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  // Enforce Phase 0 rule: A production build with missing Supabase config must show
  // a clear configuration-error screen instead of silently running in local mode.
  if (import.meta.env.PROD && !isSupabaseConfigured()) {
    return <ConfigErrorScreen />;
  }

  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <SettingsProvider>
            <ScrollToTop />
            <Routes>
              {/* Public Portal Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/news" element={<NewsFeedPage />} />
              <Route path="/epaper" element={<EpaperPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/article/:slug" element={<ArticleDetailPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/404" element={<NotFoundPage />} />

              {/* Admin Auth Route */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Protected CMS Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="articles" element={<AdminArticlesPage />} />
                <Route path="articles/new" element={<AdminArticleEditorPage />} />
                <Route path="articles/:id/edit" element={<AdminArticleEditorPage />} />
                <Route path="epaper" element={<AdminEpaperPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="media" element={<AdminMediaPage />} />
                <Route path="breaking-news" element={<AdminBreakingNewsPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="account" element={<AdminAccountPage />} />
              </Route>

              {/* Fallback to 404 */}
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </SettingsProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;
