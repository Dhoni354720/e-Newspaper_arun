import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { BreakingNewsTicker } from '@/components/common/BreakingNewsTicker';
import { Footer } from '@/components/common/Footer';
import { ArticleCard } from '@/components/common/ArticleCard';
import { SEOHead } from '@/components/common/SEOHead';
import { useLanguage } from '@/context/LanguageContext';
import { repository } from '@/lib/repository';
import { Article, Category } from '@/types/database';
import { ArrowRight, TrendingUp, Sparkles, Newspaper, Flame } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { language, t, getCategoryName } = useLanguage();

  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      repository.getArticles({ language, limit: 30, includePrivate: false }),
      repository.getCategories(),
    ]).then(([articlesRes, categoriesRes]) => {
      if (isMounted) {
        setArticles(articlesRes.articles);
        setCategories(categoriesRes);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [language]);

  // Lead story: first article with priority
  const leadStory = articles[0];
  const secondaryStories = articles.slice(1, 4);
  const latestFeed = articles.slice(4, 9);

  // Group stories by category slug
  const getArticlesForCategory = (slug: string, limit = 4): Article[] => {
    return articles
      .filter((a) => a.categories?.some((c) => c.slug === slug))
      .slice(0, limit);
  };

  const maharashtraStories = getArticlesForCategory('maharashtra');
  const politicsStories = getArticlesForCategory('politics');
  const businessStories = getArticlesForCategory('business');
  const techStories = getArticlesForCategory('technology');
  const sportsStories = getArticlesForCategory('sports');
  const agStories = getArticlesForCategory('agriculture');

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between selection:bg-crimson-100 selection:text-crimson-900">
      <SEOHead />

      <div>
        {/* Header */}
        <Header />

        {/* Breaking News Ticker */}
        <BreakingNewsTicker />

        {/* Main Content Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-12">
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-crimson-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm font-medium text-editorial-600 font-serif">
                {language === 'mr' ? 'बातम्या लोड होत आहेत...' : language === 'hi' ? 'समाचार लोड हो रहे हैं...' : 'Loading editorial dispatches...'}
              </p>
            </div>
          ) : articles.length === 0 ? (
            <div className="py-16 text-center bg-white border border-paper-border rounded-xl p-8 max-w-xl mx-auto">
              <Newspaper className="w-12 h-12 text-editorial-400 mx-auto mb-3" />
              <h2 className="text-xl font-serif font-bold text-editorial-900 mb-2">
                {t('noResultsFound')}
              </h2>
              <p className="text-sm text-editorial-600 mb-4">
                {language === 'mr' ? 'या भाषेमध्ये अद्याप कोणतीही बातमी प्रकाशित झालेली नाही.' : 'No articles published in this language yet.'}
              </p>
              <Link
                to="/admin/articles/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-crimson-800 text-white rounded text-xs font-semibold hover:bg-crimson-900"
              >
                संपादकीय कक्षात बातमी लिहा
              </Link>
            </div>
          ) : (
            <>
              {/* SECTION 1: TOP EDITORIAL HERO (Lead story + Sidebar Latest News Feed) */}
              <section aria-label={t('leadStory')}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Lead Hero (8 cols) */}
                  <div className="lg:col-span-8 space-y-6">
                    {leadStory && (
                      <ArticleCard article={leadStory} variant="lead" priorityImage={true} />
                    )}

                    {/* Secondary 2-col Stories */}
                    {secondaryStories.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-paper-border">
                        {secondaryStories.map((art) => (
                          <ArticleCard key={art.id} article={art} variant="grid" />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sidebar Feed: Latest News (4 cols) */}
                  <aside className="lg:col-span-4 bg-white border border-paper-border rounded-lg p-5 shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b-2 border-editorial-950 mb-4">
                      <h3 className="font-serif font-bold text-lg text-editorial-950 flex items-center gap-2">
                        <Flame className="w-4 h-4 text-crimson-800" />
                        {t('latestNews')}
                      </h3>
                      <Link
                        to="/news"
                        className="text-xs font-semibold text-crimson-800 hover:text-crimson-900 inline-flex items-center gap-1"
                      >
                        {t('readMore')} <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="divide-y divide-paper-border">
                      {latestFeed.map((art) => (
                        <ArticleCard key={art.id} article={art} variant="compact" />
                      ))}
                    </div>
                  </aside>
                </div>
              </section>

              {/* SECTION 2: MAHARASHTRA & REGIONAL FOCUS */}
              {maharashtraStories.length > 0 && (
                <section className="pt-8 border-t-2 border-editorial-950">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="font-serif text-2xl font-black text-editorial-950 tracking-tight">
                        {t('maharashtraFocus')}
                      </h2>
                      <div className="h-1 w-12 bg-crimson-800 mt-1"></div>
                    </div>
                    <Link
                      to="/category/maharashtra"
                      className="text-xs font-bold text-crimson-800 hover:underline inline-flex items-center gap-1"
                    >
                      {t('readMore')} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {maharashtraStories.map((art) => (
                      <ArticleCard key={art.id} article={art} variant="grid" />
                    ))}
                  </div>
                </section>
              )}

              {/* FEATURED PROMO: DIGITAL E-PAPER BANNER */}
              <section className="relative overflow-hidden bg-gradient-to-r from-editorial-950 via-crimson-950 to-editorial-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-crimson-800/30">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-crimson-600/20 to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-crimson-600/30 border border-crimson-500/40 rounded-full text-xs font-bold text-amber-300 uppercase tracking-widest">
                      <Sparkles className="w-3.5 h-3.5" />
                      {t('todayEdition')} • Live Digital Paper
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-white">
                      {language === 'mr' ? 'आजचे ई-वृत्तपत्र वाचा (Digital Replica)' : language === 'hi' ? 'आज का ई-समाचार पत्र पढ़ें (Digital Replica)' : 'Read Today\'s E-Newspaper (Digital Replica)'}
                    </h2>
                    <p className="text-white/80 text-sm leading-relaxed font-sans">
                      {language === 'mr' 
                        ? 'मुद्रित आवृत्तीचा अस्सल अनुभव, संपूर्ण पानांचे उच्च-दर्जाचे डिजिटल वाचन आणि झूम सुविधा आता मोफत उपलब्ध.' 
                        : language === 'hi'
                        ? 'मुद्रित संस्करण का प्रामाणिक अनुभव, उच्च गुणवत्ता वाले डिजिटल पन्ने और ज़ूम सुविधा अब निःशुल्क उपलब्ध।'
                        : 'Experience authentic high-definition page replicas of print editions with pan, zoom, and regional editions.'}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
                    <Link
                      to="/epaper"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 text-white font-bold text-sm rounded-lg shadow-lg hover:shadow-crimson-600/50 transition-all uppercase tracking-wider"
                    >
                      <Newspaper className="w-4 h-4" />
                      {t('epaper')}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </section>

              {/* SECTION 3: AGRICULTURE & SMART FARMING FEATURE */}
              {agStories.length > 0 && (
                <section className="bg-editorial-100/60 border border-editorial-200 rounded-xl p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {t('agFocus')}
                      </span>
                      <h2 className="font-serif text-2xl font-black text-editorial-950 mt-1.5">
                        {language === 'mr' ? 'शेती तंत्रज्ञान आणि बाजारभाव' : language === 'hi' ? 'कृषि प्रौद्योगिकी और बाजार भाव' : 'Agritech & Farming Insights'}
                      </h2>
                    </div>
                    <Link
                      to="/category/agriculture"
                      className="text-xs font-bold text-editorial-900 hover:text-crimson-800 inline-flex items-center gap-1"
                    >
                      {t('readMore')} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {agStories.map((art) => (
                      <ArticleCard key={art.id} article={art} variant="horizontal" />
                    ))}
                  </div>
                </section>
              )}

              {/* SECTION 4: POLITICS & BUSINESS (2 Column Division) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-paper-border">
                {/* Politics Column */}
                <section>
                  <div className="flex items-center justify-between pb-2 border-b-2 border-editorial-950 mb-4">
                    <h3 className="font-serif text-xl font-black text-editorial-950">
                      {t('politicsFocus')}
                    </h3>
                    <Link to="/category/politics" className="text-xs font-bold text-crimson-800 hover:underline">
                      {t('readMore')}
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {politicsStories.map((art) => (
                      <ArticleCard key={art.id} article={art} variant="horizontal" />
                    ))}
                  </div>
                </section>

                {/* Sports / Business Column */}
                <section>
                  <div className="flex items-center justify-between pb-2 border-b-2 border-editorial-950 mb-4">
                    <h3 className="font-serif text-xl font-black text-editorial-950">
                      {t('sportsFocus')}
                    </h3>
                    <Link to="/category/sports" className="text-xs font-bold text-crimson-800 hover:underline">
                      {t('readMore')}
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {sportsStories.concat(businessStories).slice(0, 3).map((art) => (
                      <ArticleCard key={art.id} article={art} variant="horizontal" />
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};
