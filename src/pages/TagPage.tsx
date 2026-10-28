import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { ArticleCard } from '@/components/common/ArticleCard';
import { SEOHead } from '@/components/common/SEOHead';
import { useLanguage } from '@/context/LanguageContext';
import { repository } from '@/lib/repository';
import { Article } from '@/types/database';
import { Tag as TagIcon, ArrowLeft, Newspaper } from 'lucide-react';

export const TagPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const displayTag = slug ? decodeURIComponent(slug).replace(/-/g, ' ') : '';

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    if (slug) {
      repository
        .getArticles({ language, tagSlug: slug, limit: 30 })
        .then(res => {
          if (isMounted) {
            setArticles(res.articles);
            setIsLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [slug, language]);

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between selection:bg-crimson-100 selection:text-crimson-900">
      <SEOHead
        title={`#${displayTag} | दैनिक जगत समीक्षा`}
        description={`दैनिक जगत समीक्षा पर #${displayTag} से संबंधित सभी समाचार, विश्लेषण और रिपोर्ट।`}
      />

      <div>
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* Breadcrumb & Tag Header */}
          <div className="border-b-2 border-editorial-900 pb-4">
            <div className="flex items-center gap-2 text-xs text-editorial-500 mb-2">
              <Link to="/" className="hover:text-crimson-800 transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('backToHome')}</span>
              </Link>
              <span>/</span>
              <span className="text-editorial-400">{t('tags')}</span>
              <span>/</span>
              <span className="text-crimson-800 font-bold">#{displayTag}</span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-editorial-900 text-white rounded-lg shadow-sm">
                  <TagIcon className="w-6 h-6 text-crimson-400" />
                </span>
                <div>
                  <h1 className="font-masthead text-2xl sm:text-3xl font-black text-editorial-950 capitalize">
                    #{displayTag}
                  </h1>
                  <p className="text-xs text-editorial-600 font-serif">
                    इस विषय पर प्रकाशित सभी समाचार एवं संपादकीय आलेख
                  </p>
                </div>
              </div>

              <span className="text-xs font-serif font-bold text-editorial-700 bg-paper-subtle px-3 py-1.5 rounded border border-paper-border">
                {articles.length} {t('articleCount')}
              </span>
            </div>
          </div>

          {/* Articles Feed */}
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-crimson-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm font-medium text-editorial-600 font-serif">{t('loadingNews')}</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="py-16 text-center bg-white border border-paper-border rounded-xl p-8 max-w-md mx-auto">
              <Newspaper className="w-12 h-12 text-editorial-400 mx-auto mb-3" />
              <h2 className="text-lg font-bold text-editorial-900 mb-2">{t('noResultsFound')}</h2>
              <p className="text-xs text-editorial-500 mb-4">
                टैग "#{displayTag}" के लिए वर्तमान भाषा में कोई लेख उपलब्ध नहीं है।
              </p>
              <Link to="/" className="text-xs font-bold text-crimson-800 hover:underline">
                ← {t('backToHome')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((art) => (
                <ArticleCard key={art.id} article={art} variant="grid" />
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};
