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
import { Search as SearchIcon, Filter, Newspaper, ArrowLeft } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { language, setLanguage, t, getCategoryName } = useLanguage();

  const query = searchParams.get('q') || '';
  const selectedCat = searchParams.get('cat') || '';
  const selectedLang = (searchParams.get('lang') as SupportedLanguage) || language;

  const [inputVal, setInputVal] = useState(query);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    repository.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setInputVal(query);

    if (!query.trim()) {
      setArticles([]);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    repository.getArticles({
      search: query,
      categorySlug: selectedCat || undefined,
      language: selectedLang,
      limit: 50,
      includePrivate: false,
    }).then((res) => {
      if (isMounted) {
        setArticles(res.articles);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [query, selectedCat, selectedLang]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (inputVal.trim()) {
      params.set('q', inputVal.trim());
    } else {
      params.delete('q');
    }
    setSearchParams(params);
  };

  const handleCategoryFilter = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set('cat', slug);
    } else {
      params.delete('cat');
    }
    setSearchParams(params);
  };

  const handleLanguageFilter = (lang: SupportedLanguage) => {
    const params = new URLSearchParams(searchParams);
    params.set('lang', lang);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between selection:bg-crimson-100 selection:text-crimson-900">
      <SEOHead title={`${t('searchButton')}: ${query}`} description="बातमी शोध निकाल." />

      <div>
        <Header />
        <BreakingNewsTicker />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Search Header Form */}
          <div className="max-w-3xl mx-auto mb-10 text-center">
            <h1 className="font-serif text-3xl font-black text-editorial-950 mb-3">
              {t('searchButton')}
            </h1>
            <p className="text-sm text-editorial-600 mb-6">
              वृत्तपत्रातील सर्व संग्रहित बातम्या, संपादकीय लेख व विश्लेषण शोधा
            </p>

            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-5 pr-28 py-3 bg-white border-2 border-editorial-300 rounded-lg text-base text-editorial-900 shadow-xs focus:ring-2 focus:ring-crimson-800 focus:border-crimson-800 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2 bg-crimson-800 hover:bg-crimson-900 text-white font-bold text-xs rounded transition-colors"
              >
                {t('searchButton')}
              </button>
            </form>

            {/* Filter controls: Category and Language */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-editorial-600 font-semibold">{t('filterByLanguage')}:</span>
              {(['mr', 'hi', 'en'] as SupportedLanguage[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLanguageFilter(lang)}
                  className={`px-2.5 py-1 rounded border transition-colors ${
                    selectedLang === lang
                      ? 'bg-crimson-800 text-white border-crimson-800 font-semibold'
                      : 'bg-white border-paper-border text-editorial-700 hover:border-editorial-400'
                  }`}
                >
                  {lang === 'mr' ? 'मराठी' : lang === 'hi' ? 'हिन्दी' : 'English'}
                </button>
              ))}

              <span className="text-editorial-400 mx-1">|</span>

              <span className="text-editorial-600 font-semibold">{t('filterByCategory')}:</span>
              <button
                type="button"
                onClick={() => handleCategoryFilter('')}
                className={`px-2.5 py-1 rounded border transition-colors ${
                  !selectedCat
                    ? 'bg-editorial-950 text-white border-editorial-950 font-semibold'
                    : 'bg-white border-paper-border text-editorial-700 hover:border-editorial-400'
                }`}
              >
                {t('allNews')}
              </button>
              {categories.slice(0, 6).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryFilter(cat.slug)}
                  className={`px-2.5 py-1 rounded border transition-colors ${
                    selectedCat === cat.slug
                      ? 'bg-editorial-950 text-white border-editorial-950 font-semibold'
                      : 'bg-white border-paper-border text-editorial-700 hover:border-editorial-400'
                  }`}
                >
                  {getCategoryName(cat)}
                </button>
              ))}
            </div>
          </div>

          {/* Results Display */}
          {isLoading ? (
            <div className="py-16 text-center">
              <div className="w-10 h-10 border-4 border-crimson-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm font-medium text-editorial-600 font-serif">शोध चालू आहे...</p>
            </div>
          ) : query ? (
            <div>
              <div className="pb-4 border-b border-paper-border mb-8 flex items-center justify-between">
                <h2 className="text-lg font-bold text-editorial-950 font-serif">
                  {t('searchResultsFor')} <span className="text-crimson-800">"{query}"</span>
                </h2>
                <span className="text-xs text-editorial-600 font-medium">
                  {articles.length} {t('articleCount')} आढळल्या
                </span>
              </div>

              {articles.length === 0 ? (
                <div className="py-16 text-center bg-white border border-paper-border rounded-xl p-8 max-w-md mx-auto">
                  <Newspaper className="w-12 h-12 text-editorial-400 mx-auto mb-3" />
                  <h3 className="text-lg font-serif font-bold text-editorial-900 mb-2">
                    {t('noResultsFound')}
                  </h3>
                  <p className="text-xs text-editorial-600">
                    कृपया इतर शब्द, वेगळी श्रेणी किंवा वेगळी भाषा निवडून पुन्हा शोध घ्या.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((art) => (
                    <ArticleCard key={art.id} article={art} variant="grid" />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-editorial-500 text-sm">
              कृपया वरील शोध चौकटीत शब्द किंवा विषय टाईप करा.
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};
