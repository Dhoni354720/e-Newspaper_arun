import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { BreakingNewsTicker } from '@/components/common/BreakingNewsTicker';
import { Footer } from '@/components/common/Footer';
import { ArticleCard } from '@/components/common/ArticleCard';
import { SEOHead } from '@/components/common/SEOHead';
import { useLanguage } from '@/context/LanguageContext';
import { repository } from '@/lib/repository';
import { Article, Category } from '@/types/database';
import { ChevronRight, Newspaper, ArrowLeft } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t, getCategoryName } = useLanguage();

  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    if (!slug) return;

    Promise.all([
      repository.getCategories(),
      repository.getArticles({
        categorySlug: slug,
        language,
        limit: 24,
        includePrivate: false,
      }),
    ]).then(([allCategories, articlesRes]) => {
      if (!isMounted) return;

      const found = allCategories.find((c) => c.slug === slug);
      setCategory(found || null);
      setArticles(articlesRes.articles);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [slug, language]);

  const categoryName = category ? getCategoryName(category) : slug?.toUpperCase();
  const categoryDescription = category?.translations?.[language]?.description || '';

  const leadStory = articles[0];
  const otherStories = articles.slice(1);

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between selection:bg-crimson-100 selection:text-crimson-900">
      <SEOHead
        title={categoryName}
        description={categoryDescription || `${categoryName} विभागातील ताज्या बातम्या आणि विश्लेषण.`}
      />

      <div>
        <Header />
        <BreakingNewsTicker />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-editorial-500 mb-6">
            <Link to="/" className="hover:text-crimson-800 transition-colors">
              {t('backToHome')}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-editorial-800 font-semibold">{categoryName}</span>
          </nav>

          {/* Category Banner */}
          <div className="pb-6 border-b-2 border-editorial-950 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-crimson-800 uppercase tracking-wider block mb-1">
                {t('categories')}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-editorial-950 tracking-tight">
                {categoryName}
              </h1>
              {categoryDescription && (
                <p className="text-sm sm:text-base text-editorial-600 mt-2 max-w-2xl font-serif">
                  {categoryDescription}
                </p>
              )}
            </div>

            <span className="text-xs font-semibold text-editorial-500 bg-paper-subtle px-3 py-1.5 rounded border border-paper-border">
              एकूण {articles.length} {t('articleCount')}
            </span>
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
                या विभागात अद्याप बातम्या नाहीत
              </h2>
              <p className="text-sm text-editorial-600 mb-4">
                लवकरच या विभागात ताज्या घडामोडी प्रसिद्ध केल्या जातील.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-crimson-800 text-white rounded text-xs font-semibold hover:bg-crimson-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> {t('backToHome')}
              </Link>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Lead Story for Category */}
              {leadStory && (
                <ArticleCard article={leadStory} variant="lead" priorityImage={true} />
              )}

              {/* Other Stories Grid */}
              {otherStories.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-paper-border">
                  {otherStories.map((art) => (
                    <ArticleCard key={art.id} article={art} variant="grid" />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};
