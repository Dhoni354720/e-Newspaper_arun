import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { SEOHead } from '@/components/common/SEOHead';
import { repository } from '@/lib/repository';
import { SupplementItem } from '@/types/database';
import { useLanguage } from '@/context/LanguageContext';
import { formatDate } from '@/lib/date';
import { safeUrl } from '@/lib/sanitize';
import { BookOpen, Download, ArrowLeft, Calendar, FileText, CheckCircle2 } from 'lucide-react';

export const SupplementDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();

  const [supplement, setSupplement] = useState<SupplementItem | null>(null);
  const [allSupplements, setAllSupplements] = useState<SupplementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    if (slug) {
      Promise.all([
        repository.getSupplementBySlug(slug),
        repository.getSupplements({ isPublished: true }),
      ]).then(([target, all]) => {
        if (isMounted) {
          setSupplement(target);
          setAllSupplements(all);
          setIsLoading(false);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const getTitle = (s: SupplementItem): string => {
    if (language === 'hi') return s.title_hi;
    if (language === 'mr') return s.title_mr;
    return s.title_en;
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between selection:bg-crimson-100 selection:text-crimson-900">
      {supplement && (
        <SEOHead
          title={`${getTitle(supplement)} | विशेषांक | दैनिक जगत समीक्षा`}
          description={supplement.description || getTitle(supplement)}
          ogImage={supplement.cover_image_url}
        />
      )}

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
            <span className="text-crimson-800 font-bold">{t('supplements')}</span>
            {supplement && (
              <>
                <span>/</span>
                <span className="text-editorial-600 truncate max-w-xs">{getTitle(supplement)}</span>
              </>
            )}
          </div>

          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-crimson-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm font-medium text-editorial-600 font-serif">विशेषांक लोड हो रहा है...</p>
            </div>
          ) : !supplement ? (
            <div className="py-16 text-center bg-white border border-paper-border rounded-xl p-8 max-w-md mx-auto">
              <BookOpen className="w-12 h-12 text-editorial-400 mx-auto mb-3" />
              <h2 className="text-base font-bold text-editorial-900 mb-2">विशेषांक उपलब्ध नहीं है</h2>
              <Link to="/" className="text-xs font-bold text-crimson-800 hover:underline">
                ← मुख्य पृष्ठ पर लौटें
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Supplement Hero Section */}
              <div className="bg-white border-2 border-editorial-200 rounded-xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
                {/* Cover Image */}
                <div className="md:col-span-5 relative rounded-lg overflow-hidden border border-paper-border shadow-md bg-editorial-100 aspect-3/4">
                  <img
                    src={supplement.cover_image_url}
                    alt={getTitle(supplement)}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-crimson-800 text-white text-xs font-bold font-mono px-3 py-1 rounded-full shadow">
                    विशेषांक संस्करण
                  </span>
                </div>

                {/* Info & Actions */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs text-editorial-500 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-crimson-700" />
                      <span>प्रकाशन दिनांक: {formatDate(supplement.issue_date, language)}</span>
                    </div>

                    <h1 className="font-masthead text-2xl sm:text-3xl md:text-4xl font-black text-editorial-950 leading-tight">
                      {getTitle(supplement)}
                    </h1>

                    {supplement.description && (
                      <p className="text-sm sm:text-base text-editorial-700 font-serif leading-relaxed border-t border-editorial-100 pt-4">
                        {supplement.description}
                      </p>
                    )}

                    <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-editorial-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>पूर्ण रंगीन मुद्रित संस्करण (Multi-color print supplement)</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-editorial-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>विशेषज्ञों एवं वरिष्ठ पत्रकारों के विशेष आलेख संग्रह</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-editorial-100">
                    {supplement.pdf_url && (
                      <a
                        href={safeUrl(supplement.pdf_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-crimson-800 hover:bg-crimson-900 text-white text-xs font-bold shadow-sm transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>विशेषांक पीडीएफ डाउनलोड करें (PDF)</span>
                      </a>
                    )}
                    <Link
                      to="/epaper"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-editorial-300 hover:border-crimson-800 text-editorial-800 hover:text-crimson-800 text-xs font-bold transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>ई-अखबार में पढ़ें</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Other Supplements Rail */}
              {allSupplements.length > 1 && (
                <div className="space-y-4 pt-4">
                  <h3 className="font-serif font-bold text-xl text-editorial-950 pb-2 border-b border-editorial-200">
                    अन्य विशेषांक एवं पुरवणी (Archive)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {allSupplements
                      .filter(s => s.id !== supplement.id)
                      .map(s => (
                        <Link
                          key={s.id}
                          to={`/supplement/${s.slug}`}
                          className="group bg-white border border-paper-border hover:border-crimson-800 rounded-xl overflow-hidden shadow-2xs hover:shadow-xs transition-all flex flex-col"
                        >
                          <div className="aspect-16/10 overflow-hidden bg-editorial-100">
                            <img
                              src={s.cover_image_url}
                              alt={getTitle(s)}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <div className="p-4 space-y-2">
                            <span className="text-[11px] font-mono text-editorial-500">
                              {formatDate(s.issue_date, language)}
                            </span>
                            <h4 className="font-serif font-bold text-sm text-editorial-950 group-hover:text-crimson-800 transition-colors line-clamp-2">
                              {getTitle(s)}
                            </h4>
                          </div>
                        </Link>
                      ))}
                  </div>
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
