import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { BreakingNewsTicker } from '@/components/common/BreakingNewsTicker';
import { Footer } from '@/components/common/Footer';
import { ArticleCard } from '@/components/common/ArticleCard';
import { WeatherWidget } from '@/components/common/WeatherWidget';
import { SEOHead } from '@/components/common/SEOHead';
import { useLanguage } from '@/context/LanguageContext';
import { repository } from '@/lib/repository';
import { Article, Category, HomeBlock, EpaperEdition } from '@/types/database';
import { 
  ArrowRight, 
  TrendingUp, 
  Sparkles, 
  Newspaper, 
  Flame, 
  Sun, 
  ShieldAlert, 
  Medal, 
  Feather,
  MapPin,
  Clock
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { language, t, getCategoryName } = useLanguage();

  const [articles, setArticles] = useState<Article[]>([]);
  const [topArticles, setTopArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [homeBlocks, setHomeBlocks] = useState<HomeBlock[]>([]);
  const [latestEpaper, setLatestEpaper] = useState<EpaperEdition | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Active city tab for regional block
  const [activeCityTab, setActiveCityTab] = useState<'mumbai' | 'pune' | 'nagpur' | 'indore' | 'delhi'>('mumbai');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      repository.getArticles({ language, limit: 40, includePrivate: false }),
      repository.getArticles({ language, isTop: true, limit: 6, includePrivate: false }),
      repository.getCategories(),
      repository.getHomeBlocks(),
      repository.getEpaperEditions(1),
    ]).then(([articlesRes, topRes, categoriesRes, blocksRes, epaperRes]) => {
      if (isMounted) {
        setArticles(articlesRes.articles);
        setTopArticles(topRes.articles);
        setCategories(categoriesRes);
        setHomeBlocks(blocksRes.filter(b => b.is_active));
        if (epaperRes && epaperRes.length > 0) {
          setLatestEpaper(epaperRes[0]);
        }
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [language]);

  // Lead and secondary stories
  const leadStory = articles[0];
  const secondaryStories = articles.slice(1, 4);
  const latestFeed = articles.slice(4, 10);

  // Category filter helper
  const getArticlesForCategory = (slug: string, limit = 4): Article[] => {
    return articles
      .filter((a) => a.categories?.some((c) => c.slug === slug))
      .slice(0, limit);
  };

  const getArticlesByTagOrCat = (keywords: string[], limit = 4): Article[] => {
    return articles
      .filter(a => 
        keywords.some(k => 
          a.categories?.some(c => c.slug.includes(k)) ||
          a.tags?.some(t => t.toLowerCase().includes(k)) ||
          a.headline.toLowerCase().includes(k)
        )
      )
      .slice(0, limit);
  };

  // Weather mock data for prominent broadsheet cities
  const cityWeatherData = [
    { city: 'मुंबई (Mumbai)', temp: '31°C', condition: 'धूप एवं आर्द्र', icon: '☀️' },
    { city: 'पुणे (Pune)', temp: '29°C', condition: 'सुहावना', icon: '🌤️' },
    { city: 'नागपुर (Nagpur)', temp: '34°C', condition: 'गर्म', icon: '☀️' },
    { city: 'इंदौर (Indore)', temp: '30°C', condition: 'साफ आसमान', icon: '🌤️' },
    { city: 'दिल्ली (Delhi)', temp: '32°C', condition: 'धुंध एवं धूप', icon: '⛅' },
  ];

  // Render individual block by type
  const renderHomeBlock = (block: HomeBlock) => {
    switch (block.block_type) {
      case 'hero':
        if (!leadStory) return null;
        return (
          <section key={block.id} aria-label={t('leadStory')} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Lead Hero (8 cols) */}
              <div className="lg:col-span-8">
                <ArticleCard article={leadStory} variant="lead" priorityImage={true} />

                {/* Secondary 3 stories under Lead */}
                {secondaryStories.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    {secondaryStories.map((art) => (
                      <ArticleCard key={art.id} article={art} variant="grid" showExcerpt={false} />
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar Latest Dispatches (4 cols) */}
              <aside className="lg:col-span-4 bg-white border border-paper-border rounded-lg p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b-2 border-crimson-800">
                  <h3 className="font-serif font-bold text-lg text-editorial-950 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-crimson-800" />
                    <span>{t('latestNews')}</span>
                  </h3>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-crimson-800 bg-crimson-50 px-2 py-0.5 rounded">
                    LIVE
                  </span>
                </div>

                <div className="divide-y divide-paper-border">
                  {latestFeed.map((art) => (
                    <ArticleCard key={art.id} article={art} variant="compact" />
                  ))}
                </div>

                {/* Link to all news */}
                <div className="pt-2">
                  <Link
                    to="/category/india"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-paper-subtle hover:bg-crimson-800 hover:text-white text-editorial-800 text-xs font-bold rounded transition-colors"
                  >
                    <span>{t('viewAllNews')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </aside>
            </div>
          </section>
        );

      case 'top_news':
        const displayTop = topArticles.length > 0 ? topArticles : articles.slice(0, 4);
        return (
          <section key={block.id} className="bg-editorial-950 text-white rounded-xl p-6 sm:p-8 space-y-6 shadow-md border-t-4 border-crimson-600">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-editorial-800">
              <div className="flex items-center gap-3">
                <span className="bg-crimson-600 text-white p-2 rounded-lg">
                  <Flame className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="font-masthead text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {block.title_override_hi || t('topNews')}
                  </h2>
                  <p className="text-xs text-editorial-400 font-serif">
                    दैनिक जगत समीक्षा विशेष चयन • प्रमुख राष्ट्रीय व प्रादेशिक समाचार
                  </p>
                </div>
              </div>
              <Link
                to="/top-news"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-crimson-400 hover:text-white transition-colors"
              >
                <span>सम्पूर्ण शीर्ष समाचार देखें</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayTop.slice(0, 4).map((art, idx) => (
                <article key={art.id} className="group flex flex-col justify-between bg-editorial-900 border border-editorial-800 rounded-lg p-4 hover:border-crimson-600 transition-all">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-crimson-800 text-white text-xs font-black flex items-center justify-center">
                        {idx + 1}
                      </span>
                      {art.dateline && (
                        <span className="text-[11px] font-bold text-amber-400">{art.dateline}</span>
                      )}
                    </div>
                    <Link to={`/article/${art.slug}`}>
                      <h3 className="font-serif text-base font-bold text-white group-hover:text-crimson-400 transition-colors line-clamp-3 mb-2 leading-snug">
                        {art.headline}
                      </h3>
                    </Link>
                    {art.excerpt && (
                      <p className="text-xs text-editorial-400 line-clamp-2 leading-relaxed">
                        {art.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="pt-3 mt-3 border-t border-editorial-800 flex items-center justify-between text-[11px] text-editorial-400">
                    <span>{art.author?.display_name || 'विशेष संवाददाता'}</span>
                    <Link to={`/article/${art.slug}`} className="text-crimson-400 font-bold hover:underline">
                      पढ़ें →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'city':
        const cityArticles = getArticlesByTagOrCat([activeCityTab], 4);
        return (
          <section key={block.id} className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-editorial-900 pb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-crimson-800" />
                <h2 className="font-masthead text-2xl font-bold text-editorial-950">
                  {block.title_override_hi || 'नगर एवं प्रादेशिक हलचल'}
                </h2>
              </div>

              {/* City Filter Tabs */}
              <div className="flex flex-wrap gap-1 text-xs font-semibold">
                {[
                  { id: 'mumbai', label: 'मुंबई (Mumbai)' },
                  { id: 'pune', label: 'पुणे (Pune)' },
                  { id: 'nagpur', label: 'नागपुर (Nagpur)' },
                  { id: 'indore', label: 'इंदौर (Indore)' },
                  { id: 'delhi', label: 'दिल्ली (Delhi)' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCityTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-full transition-all ${
                      activeCityTab === tab.id
                        ? 'bg-crimson-800 text-white shadow-sm'
                        : 'bg-paper-subtle text-editorial-700 hover:bg-editorial-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cityArticles.length > 0 ? (
                cityArticles.map(art => (
                  <ArticleCard key={art.id} article={art} variant="grid" />
                ))
              ) : (
                articles.slice(0, 4).map(art => (
                  <ArticleCard key={art.id} article={art} variant="grid" />
                ))
              )}
            </div>
          </section>
        );

      case 'opinion':
        const opinionArticles = getArticlesForCategory('editorial', 3);
        return (
          <section key={block.id} className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b-2 border-amber-800/40">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-amber-800 text-white rounded-lg">
                  <Feather className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="font-serif font-black text-2xl sm:text-3xl text-editorial-950">
                    {block.title_override_hi || t('opinionAndEditorial')}
                  </h2>
                  <p className="text-xs text-editorial-600 font-serif">
                    संपादक अरुण रमाकांत तिवारी का दृष्टिकोण एवं प्रबुद्ध स्तंभकारों के विचार
                  </p>
                </div>
              </div>
              <Link
                to="/category/editorial"
                className="text-xs font-bold text-amber-900 hover:text-crimson-800 transition-colors inline-flex items-center gap-1"
              >
                <span>सभी अग्रलेख व विचार</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Chief Editor Profile Feature */}
              <div className="bg-white border border-amber-300 rounded-lg p-5 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                      alt="अरुण रमाकांत तिवारी"
                      className="w-14 h-14 rounded-full object-cover border-2 border-crimson-800"
                    />
                    <div>
                      <h4 className="font-bold text-base text-editorial-950">
                        अरुण रमाकांत तिवारी
                      </h4>
                      <p className="text-xs font-semibold text-crimson-800">
                        प्रधान संपादक (Chief Editor)
                      </p>
                    </div>
                  </div>
                  <blockquote className="text-xs text-editorial-700 italic border-l-2 border-crimson-800 pl-3 my-3">
                    "पत्रकारिता जब सत्ता के दबाव और स्वार्थ से मुक्त होती है, तभी वह लोकतंत्र का सच्चा चौथा स्तंभ बन पाती है।"
                  </blockquote>
                </div>
                <Link
                  to="/author/arun-ramakant-tiwari"
                  className="inline-flex items-center justify-center gap-1 py-1.5 px-3 bg-crimson-800 text-white text-xs font-bold rounded hover:bg-crimson-900 transition-colors mt-2"
                >
                  <span>संपादक के सभी आलेख पढ़ें</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Middle & Right: Latest Editorial Columns */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(opinionArticles.length > 0 ? opinionArticles : articles.slice(0, 2)).map(art => (
                  <article key={art.id} className="bg-white border border-paper-border rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                        अग्रलेख / विचार
                      </span>
                      <Link to={`/article/${art.slug}`}>
                        <h4 className="font-serif text-base font-bold text-editorial-950 hover:text-crimson-800 transition-colors line-clamp-2 mb-2 leading-snug">
                          {art.headline}
                        </h4>
                      </Link>
                      <p className="text-xs text-editorial-600 line-clamp-3 leading-relaxed">
                        {art.excerpt}
                      </p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-paper-border flex items-center justify-between text-xs text-editorial-500">
                      <span>{art.author?.display_name || 'अरुण रमाकांत तिवारी'}</span>
                      <Link to={`/article/${art.slug}`} className="text-crimson-800 font-bold hover:underline">
                        विस्तार से →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        );

      case 'crime':
        const crimeArticles = getArticlesForCategory('crime', 3);
        const courtArticles = getArticlesForCategory('court', 3);
        return (
          <section key={block.id} className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-editorial-900 pb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-crimson-800" />
                <h2 className="font-masthead text-2xl font-bold text-editorial-950">
                  {block.title_override_hi || 'क्राइम एवं अदालत (Crime & Courts)'}
                </h2>
              </div>
              <Link
                to="/category/crime"
                className="text-xs font-bold text-crimson-800 hover:underline inline-flex items-center gap-1"
              >
                <span>अधिक क्राइम समाचार</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Column 1: Crime dispatches */}
              <div className="bg-white border border-paper-border rounded-lg p-5 shadow-sm space-y-3">
                <h3 className="font-serif font-bold text-base text-crimson-900 border-b border-crimson-100 pb-1.5">
                  अपराध एवं अन्वेषण
                </h3>
                <div className="divide-y divide-paper-border">
                  {(crimeArticles.length > 0 ? crimeArticles : articles.slice(0, 3)).map(art => (
                    <ArticleCard key={art.id} article={art} variant="compact" />
                  ))}
                </div>
              </div>

              {/* Column 2: Judicial rulings & Courts */}
              <div className="bg-white border border-paper-border rounded-lg p-5 shadow-sm space-y-3">
                <h3 className="font-serif font-bold text-base text-editorial-900 border-b border-editorial-100 pb-1.5">
                  न्यायालय एवं विधिक फैसले
                </h3>
                <div className="divide-y divide-paper-border">
                  {(courtArticles.length > 0 ? courtArticles : articles.slice(3, 6)).map(art => (
                    <ArticleCard key={art.id} article={art} variant="compact" />
                  ))}
                </div>
              </div>
            </div>
          </section>
        );

      case 'sports':
        const sportsArticles = getArticlesForCategory('sports', 4);
        return (
          <section key={block.id} className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-editorial-900 pb-2">
              <div className="flex items-center gap-2">
                <Medal className="w-5 h-5 text-blue-700" />
                <h2 className="font-masthead text-2xl font-bold text-editorial-950">
                  {block.title_override_hi || t('sportsFocus')}
                </h2>
              </div>
              <Link
                to="/category/sports"
                className="text-xs font-bold text-crimson-800 hover:underline inline-flex items-center gap-1"
              >
                <span>{t('viewAllNews')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(sportsArticles.length > 0 ? sportsArticles : articles.slice(0, 4)).map(art => (
                <ArticleCard key={art.id} article={art} variant="grid" />
              ))}
            </div>
          </section>
        );

      case 'epaper_promo':
        if (!latestEpaper) return null;
        return (
          <section key={block.id} className="bg-gradient-to-r from-editorial-900 to-editorial-950 text-white rounded-xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* E-Paper Broadsheet Thumbnail */}
              <div className="md:col-span-4 flex justify-center">
                <div className="relative group w-48 sm:w-56 shadow-2xl rounded overflow-hidden border-2 border-amber-400 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                  <img
                    src={latestEpaper.thumbnail_url || latestEpaper.pages?.[0]?.image_url}
                    alt={latestEpaper.title}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-crimson-800 text-white text-xs font-bold py-1.5 px-3 rounded shadow">
                      ई-पेपर खोलें
                    </span>
                  </div>
                </div>
              </div>

              {/* Promo Pitch & CTA */}
              <div className="md:col-span-8 space-y-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-950/60 border border-amber-600/40 px-3 py-1 rounded-full">
                  <Newspaper className="w-3.5 h-3.5" />
                  दैनिक डिजिटल मुद्रित संस्करण
                </span>

                <h3 className="font-masthead text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                  {latestEpaper.title_hi || latestEpaper.title}
                </h3>

                <p className="text-sm sm:text-base text-editorial-300 max-w-xl leading-relaxed">
                  कागजी अखबार जैसा सहज अनुभव अब अपनी मोबाइल, टैबलेट या कंप्यूटर स्क्रीन पर। दैनिक मुद्रित संस्करण को उच्च गुणवत्ता (HD) में ऑनलाइन पढ़ें अथवा PDF सुरक्षित करें।
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    to="/epaper"
                    className="inline-flex items-center gap-2 bg-crimson-800 hover:bg-crimson-700 text-white font-bold text-sm px-6 py-3 rounded-lg shadow-lg hover:shadow-crimson-900/50 transition-all"
                  >
                    <Newspaper className="w-4 h-4" />
                    <span>{t('readEpaper')}</span>
                  </Link>

                  <Link
                    to="/epaper"
                    className="inline-flex items-center gap-1.5 text-xs text-editorial-300 hover:text-white underline font-medium"
                  >
                    <span>{t('editionArchive')} देखें →</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );

      case 'weather':
        return (
          <section key={block.id} className="my-6">
            <WeatherWidget />
          </section>
        );

      default:
        return null;
    }
  };

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
                संपादकीय कक्ष में नया समाचार लिखें
              </Link>
            </div>
          ) : (
            <>
              {/* Dynamic Home Blocks Rendered in sort_order */}
              {homeBlocks.map(block => renderHomeBlock(block))}
            </>
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};
