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
import { TopNewsPage } from '@/pages/TopNewsPage';
import { TagPage } from '@/pages/TagPage';
import { AuthorDetailPage } from '@/pages/AuthorDetailPage';
import { SearchPage } from '@/pages/SearchPage';
import { EpaperPage } from '@/pages/EpaperPage';
import { PhotoGalleryPage } from '@/pages/PhotoGalleryPage';
import { PhotoGalleryDetailPage } from '@/pages/PhotoGalleryDetailPage';
import { VideoHubPage } from '@/pages/VideoHubPage';
import { FlashNewsPage } from '@/pages/FlashNewsPage';
import { RashifalPage } from '@/pages/RashifalPage';
import { SupplementDetailPage } from '@/pages/SupplementDetailPage';
import { NewsTipsPage } from '@/pages/NewsTipsPage';
import { DynamicPage } from '@/pages/DynamicPage';
import { AboutPage, ContactPage, PrivacyPolicyPage, TermsPage, NotFoundPage } from '@/pages/StaticPages';

// Admin CMS Pages
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminArticlesPage } from '@/pages/admin/AdminArticlesPage';
import { AdminArticleEditorPage } from '@/pages/admin/AdminArticleEditorPage';
import { AdminCategoriesPage } from '@/pages/admin/AdminCategoriesPage';
import { AdminHomeBlocksPage } from '@/pages/admin/AdminHomeBlocksPage';
import { AdminBreakingNewsPage } from '@/pages/admin/AdminBreakingNewsPage';
import { AdminFlashNewsPage } from '@/pages/admin/AdminFlashNewsPage';
import { AdminRashifalPage } from '@/pages/admin/AdminRashifalPage';
import { AdminNewsTipsPage } from '@/pages/admin/AdminNewsTipsPage';
import { AdminGalleriesPage } from '@/pages/admin/AdminGalleriesPage';
import { AdminVideosPage } from '@/pages/admin/AdminVideosPage';
import { AdminPagesManager } from '@/pages/admin/AdminPagesManager';
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
              <Route path="/top-news" element={<TopNewsPage />} />
              <Route path="/epaper" element={<EpaperPage />} />
              <Route path="/epaper/:editionId" element={<EpaperPage />} />
              <Route path="/epaper/:editionId/page/:pageNumber" element={<EpaperPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/article/:slug" element={<ArticleDetailPage />} />
              <Route path="/tag/:slug" element={<TagPage />} />
              <Route path="/author/:slug" element={<AuthorDetailPage />} />
              <Route path="/photos" element={<PhotoGalleryPage />} />
              <Route path="/photos/:slug" element={<PhotoGalleryDetailPage />} />
              <Route path="/videos" element={<VideoHubPage />} />
              <Route path="/flash" element={<FlashNewsPage />} />
              <Route path="/rashifal" element={<RashifalPage />} />
              <Route path="/supplement/:slug" element={<SupplementDetailPage />} />
              <Route path="/submit-news" element={<NewsTipsPage />} />
              <Route path="/page/:slug" element={<DynamicPage />} />
              <Route path="/grievance" element={<DynamicPage fixedSlug="grievance" />} />
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
                <Route path="flash" element={<AdminFlashNewsPage />} />
                <Route path="rashifal" element={<AdminRashifalPage />} />
                <Route path="news-tips" element={<AdminNewsTipsPage />} />
                <Route path="galleries" element={<AdminGalleriesPage />} />
                <Route path="videos" element={<AdminVideosPage />} />
                <Route path="pages" element={<AdminPagesManager />} />
                <Route path="epaper" element={<AdminEpaperPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="home-blocks" element={<AdminHomeBlocksPage />} />
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
