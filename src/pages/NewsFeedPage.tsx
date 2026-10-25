import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { BreakingNewsTicker } from '@/components/common/BreakingNewsTicker';
import { Footer } from '@/components/common/Footer';
import { ArticleCard } from '@/components/common/ArticleCard';
import { SEOHead } from '@/components/common/SEOHead';
import { useLanguage } from '@/context/LanguageContext';
import { repository } from '@/lib/repository';
import { Article, Category, SupportedLanguage } from '@/types/database';
import { Filter, ChevronRight, ChevronLeft, Newspaper } from 'lucide-react';

export const NewsFeedPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { language, setLanguage, t, getCategoryName } = useLanguage();

  const selectedCat = searchParams.get('cat') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    repository.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    repository.getArticles({
      language,
      categorySlug: selectedCat || undefined,
      page: pageParam,
      limit: 12,
      includePrivate: false,
    }).then((res) => {
      if (isMounted) {
        setArticles(res.articles);
        setTotal(res.total);
        setTotalPages(res.totalPages);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [language, selectedCat, pageParam]);

  const handleCategoryFilter = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set('cat', slug);
    } else {
      params.delete('cat');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between selection:bg-crimson-100 selection:text-crimson-900">
      <SEOHead title={t('allNews')} description="सर्व ताज्या राजकीय, सामाजिक व प्रादेशिक बातम्यांचे संकलन." />

      <div>
        <Header />
        <BreakingNewsTicker />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="pb-6 border-b border-paper-border mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-black text-editorial-950">
                {t('allNews')}
              </h1>
              <p className="text-editorial-600 text-sm mt-1">
                {total} {t('articleCount')} उपलब्ध
              </p>
            </div>

            {/* Category Filter Dropdown / Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-editorial-700 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> {t('filterByCategory')}:
              </span>
              <button
                onClick={() => handleCategoryFilter('')}
                className={`px-3 py-1.5 rounded-full border transition-colors ${
                  !selectedCat 
                    ? 'bg-crimson-800 text-white border-crimson-800 font-bold' 
                    : 'bg-white border-editorial-200 text-editorial-700 hover:border-crimson-800'
                }`}
              >
                {t('allNews')}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryFilter(cat.slug)}
                  className={`px-3 py-1.5 rounded-full border transition-colors ${
                    selectedCat === cat.slug 
                      ? 'bg-crimson-800 text-white border-crimson-800 font-bold' 
                      : 'bg-white border-editorial-200 text-editorial-700 hover:border-crimson-800'
                  }`}
                >
                  {getCategoryName(cat)}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-crimson-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm font-medium text-editorial-600 font-serif">बातम्या शोधत आहे...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="py-16 text-center bg-white border border-paper-border rounded-xl p-8 max-w-md mx-auto">
              <Newspaper className="w-12 h-12 text-editorial-400 mx-auto mb-3" />
              <h2 className="text-xl font-serif font-bold text-editorial-900 mb-2">
                {t('noResultsFound')}
              </h2>
              <button
                onClick={() => handleCategoryFilter('')}
                className="mt-3 px-4 py-2 bg-crimson-800 text-white rounded text-xs font-semibold hover:bg-crimson-900"
              >
                सर्व बातम्या पहा
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((art) => (
                  <ArticleCard key={art.id} article={art} variant="grid" />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t border-paper-border">
                  <button
                    onClick={() => handlePageChange(pageParam - 1)}
                    disabled={pageParam <= 1}
                    className="p-2 border border-editorial-300 rounded hover:bg-paper-subtle disabled:opacity-40 transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-xs font-semibold px-4 text-editorial-700">
                    पान {pageParam} / {totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(pageParam + 1)}
                    disabled={pageParam >= totalPages}
                    className="p-2 border border-editorial-300 rounded hover:bg-paper-subtle disabled:opacity-40 transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};
