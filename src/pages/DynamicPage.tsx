import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { SEOHead } from '@/components/common/SEOHead';
import { repository } from '@/lib/repository';
import { CMSPage } from '@/types/database';
import { useLanguage } from '@/context/LanguageContext';
import { sanitizeHtml } from '@/lib/sanitize';
import { ArrowLeft, FileText, Calendar } from 'lucide-react';

interface DynamicPageProps {
  fixedSlug?: string;
}

export const DynamicPage: React.FC<DynamicPageProps> = ({ fixedSlug }) => {
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const slug = fixedSlug || routeSlug || '';
  const { language, t } = useLanguage();

  const [page, setPage] = useState<CMSPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    if (slug) {
      repository.getPage(slug).then(data => {
        if (isMounted) {
          setPage(data);
          setIsLoading(false);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const getTitle = (p: CMSPage): string => {
    if (language === 'hi') return p.title_hi;
    if (language === 'mr') return p.title_mr;
    return p.title_en;
  };

  const getBody = (p: CMSPage): string => {
    if (language === 'hi') return p.body_hi;
    if (language === 'mr') return p.body_mr;
    return p.body_en;
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between selection:bg-crimson-100 selection:text-crimson-900">
      {page && (
        <SEOHead
          title={`${getTitle(page)} | दैनिक जगत समीक्षा`}
          description={page.meta_description || getTitle(page)}
        />
      )}

      <div>
        <Header />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-editorial-500">
            <Link to="/" className="hover:text-crimson-800 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('backToHome')}</span>
            </Link>
            <span>/</span>
            {page && (
              <span className="text-crimson-800 font-bold truncate max-w-sm">
                {getTitle(page)}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-crimson-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm font-medium text-editorial-600 font-serif">पृष्ठ लोड हो रहा है...</p>
            </div>
          ) : !page ? (
            <div className="py-16 text-center bg-white border border-paper-border rounded-xl p-8 max-w-md mx-auto">
              <FileText className="w-12 h-12 text-editorial-400 mx-auto mb-3" />
              <h2 className="text-base font-bold text-editorial-900 mb-2">पृष्ठ उपलब्ध नहीं है</h2>
              <Link to="/" className="text-xs font-bold text-crimson-800 hover:underline">
                ← मुख्य पृष्ठ पर लौटें
              </Link>
            </div>
          ) : (
            <article className="bg-white border-2 border-editorial-200 rounded-xl p-6 sm:p-10 shadow-sm space-y-6">
              <div className="border-b border-editorial-100 pb-4 space-y-2">
                <h1 className="font-masthead text-2xl sm:text-3xl md:text-4xl font-black text-editorial-950">
                  {getTitle(page)}
                </h1>
                <p className="text-xs font-mono text-editorial-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>अंतिम अद्यतन: {new Date(page.updated_at).toLocaleDateString('hi-IN')}</span>
                </p>
              </div>

              {/* Sanitized HTML Body */}
              <div
                className="prose prose-editorial max-w-none text-editorial-900 text-sm sm:text-base leading-relaxed font-serif"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(getBody(page)) }}
              />
            </article>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};
