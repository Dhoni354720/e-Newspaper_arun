import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { ArticleCard } from '@/components/common/ArticleCard';
import { SEOHead } from '@/components/common/SEOHead';
import { useLanguage } from '@/context/LanguageContext';
import { repository } from '@/lib/repository';
import { Article } from '@/types/database';
import { Flame, ArrowLeft, Newspaper } from 'lucide-react';

export const TopNewsPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    repository
      .getArticles({ language, isTop: true, limit: 20 })
      .then(res => {
        if (isMounted) {
          // If no explicitly flagged top articles in this language, fallback to latest published
          if (res.articles.length > 0) {
            setArticles(res.articles);
          } else {
            repository.getArticles({ language, limit: 12 }).then(fallback => {
              if (isMounted) setArticles(fallback.articles);
            });
          }
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [language]);

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between selection:bg-crimson-100 selection:text-crimson-900">
      <SEOHead
        title={`${t('topNews')} | दैनिक जगत समीक्षा`}
        description="दैनिक जगत समीक्षा मुख्य एवं शीर्ष समाचार - देश, विदेश और महाराष्ट्र की सबसे महत्वपूर्ण खबरें।"
      />

      <div>
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* Breadcrumb & Section Header */}
          <div className="border-b-2 border-crimson-800 pb-4">
            <div className="flex items-center gap-2 text-xs text-editorial-500 mb-2">
              <Link to="/" className="hover:text-crimson-800 transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('backToHome')}</span>
              </Link>
              <span>/</span>
              <span className="text-crimson-800 font-bold">{t('topNews')}</span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-crimson-800 text-white rounded-lg shadow-sm">
                  <Flame className="w-6 h-6" />
                </span>
                <div>
                  <h1 className="font-masthead text-3xl sm:text-4xl font-black text-editorial-950">
                    {t('topNews')}
                  </h1>
                  <p className="text-xs sm:text-sm text-editorial-600 font-serif">
                    दैनिक जगत समीक्षा के संपादकीय पटल द्वारा चयनित आज के सबसे महत्वपूर्ण समाचार
                  </p>
                </div>
              </div>

              <span className="text-xs font-serif font-bold text-editorial-700 bg-paper-subtle px-3 py-1.5 rounded border border-paper-border">
                एकूण {articles.length} {t('articleCount')}
              </span>
            </div>
          </div>

          {/* Articles Grid */}
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-crimson-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm font-medium text-editorial-600 font-serif">{t('loadingNews')}</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="py-16 text-center bg-white border border-paper-border rounded-xl p-8 max-w-md mx-auto">
              <Newspaper className="w-12 h-12 text-editorial-400 mx-auto mb-3" />
              <h2 className="text-lg font-bold text-editorial-900 mb-2">{t('noResultsFound')}</h2>
              <Link to="/" className="text-xs font-bold text-crimson-800 hover:underline">
                ← {t('backToHome')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((art, idx) => (
                <div key={art.id} className="relative">
                  <span className="absolute -top-2.5 -left-2.5 z-10 w-7 h-7 rounded-full bg-crimson-800 text-white text-xs font-black flex items-center justify-center shadow-md">
                    {idx + 1}
                  </span>
                  <ArticleCard article={art} variant="grid" />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};
