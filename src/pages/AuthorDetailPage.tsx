import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { ArticleCard } from '@/components/common/ArticleCard';
import { SEOHead } from '@/components/common/SEOHead';
import { useLanguage } from '@/context/LanguageContext';
import { repository } from '@/lib/repository';
import { Profile, Article } from '@/types/database';
import { User, Feather, ArrowLeft, Newspaper, Mail, Award } from 'lucide-react';

export const AuthorDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();

  const [author, setAuthor] = useState<Profile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    if (slug) {
      repository.getAuthorBySlug(slug).then(foundAuthor => {
        if (!isMounted) return;
        if (foundAuthor) {
          setAuthor(foundAuthor);
          repository
            .getArticlesByAuthor(foundAuthor.id, { language, limit: 30 })
            .then(res => {
              if (isMounted) {
                setArticles(res.articles);
                setIsLoading(false);
              }
            });
        } else {
          // If slug lookup failed, search authors list by slug or id
          repository.getAuthors().then(authors => {
            if (!isMounted) return;
            const fallback = authors.find(a => a.slug === slug || a.id === slug);
            if (fallback) {
              setAuthor(fallback);
              repository.getArticlesByAuthor(fallback.id, { language, limit: 30 }).then(res => {
                if (isMounted) {
                  setArticles(res.articles);
                  setIsLoading(false);
                }
              });
            } else {
              setIsLoading(false);
            }
          });
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [slug, language]);

  // Multilingual bio resolution
  const getAuthorBio = (p: Profile): string => {
    if (language === 'hi' && p.bio_hi) return p.bio_hi;
    if (language === 'mr' && p.bio_mr) return p.bio_mr;
    if (language === 'en' && p.bio_en) return p.bio_en;
    return p.bio_hi || p.bio_mr || p.bio_en || t('noAuthorBio');
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between selection:bg-crimson-100 selection:text-crimson-900">
      <SEOHead
        title={author ? `${author.display_name} | लेखक परिचय | दैनिक जगत समीक्षा` : 'लेखक परिचय | दैनिक जगत समीक्षा'}
        description={author ? `${author.display_name} के दैनिक जगत समीक्षा में प्रकाशित सभी लेख एवं विचार।` : ''}
      />

      <div>
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-editorial-500">
            <Link to="/" className="hover:text-crimson-800 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('backToHome')}</span>
            </Link>
            <span>/</span>
            <span className="text-editorial-400">{t('authorBio')}</span>
            {author && (
              <>
                <span>/</span>
                <span className="text-crimson-800 font-bold">{author.display_name}</span>
              </>
            )}
          </div>

          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-crimson-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm font-medium text-editorial-600 font-serif">{t('loadingNews')}</p>
            </div>
          ) : !author ? (
            <div className="py-16 text-center bg-white border border-paper-border rounded-xl p-8 max-w-md mx-auto">
              <User className="w-12 h-12 text-editorial-400 mx-auto mb-3" />
              <h2 className="text-lg font-bold text-editorial-900 mb-2">लेखक नहीं मिला</h2>
              <p className="text-xs text-editorial-500 mb-4">
                यह लेखक प्रोफाइल उपलब्ध नहीं है अथवा हटा दी गई है।
              </p>
              <Link to="/" className="text-xs font-bold text-crimson-800 hover:underline">
                ← {t('backToHome')}
              </Link>
            </div>
          ) : (
            <>
              {/* Author Banner Card */}
              <div className="bg-white border-2 border-editorial-200 rounded-xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                  {/* Photo */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={author.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                      alt={author.display_name}
                      className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-crimson-800 shadow-md"
                    />
                    {author.is_columnist && (
                      <span className="absolute bottom-0 right-0 bg-amber-500 text-editorial-950 p-1.5 rounded-full shadow" title="नियमित स्तंभकार">
                        <Award className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                      <h1 className="font-masthead text-2xl sm:text-3xl font-black text-editorial-950">
                        {author.display_name}
                      </h1>
                      {author.designation && (
                        <span className="text-xs font-bold text-crimson-800 bg-crimson-50 border border-crimson-200 px-3 py-1 rounded-full">
                          {author.designation}
                        </span>
                      )}
                      {author.is_columnist && (
                        <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Feather className="w-3 h-3" />
                          स्तंभकार
                        </span>
                      )}
                    </div>

                    <p className="text-editorial-700 text-sm sm:text-base leading-relaxed font-serif max-w-3xl">
                      {getAuthorBio(author)}
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-editorial-500">
                      <span className="font-bold text-editorial-900">
                        {articles.length} {t('articlesWritten')}
                      </span>
                      <span>•</span>
                      <span>दैनिक जगत समीक्षा</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Author Articles Feed */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b-2 border-crimson-800 pb-2">
                  <h2 className="font-masthead text-xl sm:text-2xl font-bold text-editorial-950">
                    {t('allArticlesByAuthor')}
                  </h2>
                  <span className="text-xs text-editorial-500 font-medium">
                    कुल {articles.length} लेख
                  </span>
                </div>

                {articles.length === 0 ? (
                  <div className="py-12 text-center bg-white border border-paper-border rounded-lg p-6">
                    <Newspaper className="w-10 h-10 text-editorial-400 mx-auto mb-2" />
                    <p className="text-xs text-editorial-600">
                      इस लेखक द्वारा वर्तमान भाषा में अभी कोई लेख प्रकाशित नहीं हुआ है।
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map(art => (
                      <ArticleCard key={art.id} article={art} variant="grid" />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};
