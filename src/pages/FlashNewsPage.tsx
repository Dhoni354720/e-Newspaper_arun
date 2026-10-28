import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { SEOHead } from '@/components/common/SEOHead';
import { repository } from '@/lib/repository';
import { BriefItem } from '@/types/database';
import { useLanguage } from '@/context/LanguageContext';
import { Zap, Clock, Share2, ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react';

export const FlashNewsPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [briefs, setBriefs] = useState<BriefItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBriefs = () => {
    setIsLoading(true);
    repository.getBriefs({ language, limit: 50 }).then(data => {
      setBriefs(data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadBriefs();
  }, [language]);

  const getTimeAgo = (dateStr: string): string => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return language === 'hi' ? 'अभी-अभी' : language === 'mr' ? 'आत्ताच' : 'Just now';
    if (diffMins < 60) return language === 'hi' ? `${diffMins} मिनट पहले` : language === 'mr' ? `${diffMins} मिनिटांपूर्वी` : `${diffMins}m ago`;
    if (diffHours < 24) return language === 'hi' ? `${diffHours} घंटे पहले` : language === 'mr' ? `${diffHours} तासांपूर्वी` : `${diffHours}h ago`;
    const days = Math.floor(diffHours / 24);
    return language === 'hi' ? `${days} दिन पहले` : language === 'mr' ? `${days} दिवसांपूर्वी` : `${days}d ago`;
  };

  const handleShareWhatsApp = (brief: BriefItem) => {
    const text = encodeURIComponent(
      `⚡ *दैनिक जगत समीक्षा फटाफट खबर*\n\n${brief.content}\n\nविस्तृत समाचार पढ़ें: ${window.location.origin}${brief.target_url || '/flash'}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between selection:bg-crimson-100 selection:text-crimson-900">
      <SEOHead
        title="फटाफट खबरें (Flash News Briefs) | दैनिक जगत समीक्षा"
        description="दैनिक जगत समीक्षा फटाफट खबरें: देश, महाराष्ट्र, मुंबई, राजनीति, व्यापार और खेल की सबसे तेज संक्षिप्त ब्रेकिंग खबरें।"
      />

      <div>
        <Header />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-editorial-500">
            <Link to="/" className="hover:text-crimson-800 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('backToHome')}</span>
            </Link>
            <span>/</span>
            <span className="text-crimson-800 font-bold">{t('flashNews')}</span>
          </div>

          {/* Heading */}
          <div className="bg-gradient-to-r from-crimson-950 via-crimson-900 to-editorial-950 text-white rounded-xl p-6 sm:p-8 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-brand-gold text-editorial-950 rounded-md font-bold text-xs flex items-center gap-1 shadow-xs">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>LIVE</span>
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <h1 className="font-masthead text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {t('flashNews')} (Speed Newsfeed)
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-editorial-200 font-serif">
                  दिनभर की सभी महत्वपूर्ण घटनाओं का 60 शब्दों में सटीक एवं त्वरित सार।
                </p>
              </div>

              <button
                type="button"
                onClick={loadBriefs}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors self-start sm:self-auto border border-white/20"
                title="ताज़ा करें"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>रिफ्रेश</span>
              </button>
            </div>
          </div>

          {/* Flash News Stream */}
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-crimson-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm font-medium text-editorial-600 font-serif">फटाफट खबरें लोड हो रही हैं...</p>
            </div>
          ) : briefs.length === 0 ? (
            <div className="py-16 text-center bg-white border border-paper-border rounded-xl p-8 max-w-md mx-auto">
              <Zap className="w-12 h-12 text-editorial-400 mx-auto mb-3" />
              <h2 className="text-base font-bold text-editorial-900 mb-1">कोई फटाफट खबर उपलब्ध नहीं है</h2>
              <p className="text-xs text-editorial-500">डेस्क शीघ्र ही नए त्वरित अपडेट जारी करेगा।</p>
            </div>
          ) : (
            <div className="space-y-4">
              {briefs.map((brief, idx) => (
                <div
                  key={brief.id}
                  className="bg-white border border-paper-border hover:border-crimson-800/60 rounded-xl p-5 sm:p-6 shadow-xs hover:shadow-sm transition-all space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-editorial-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-crimson-100 text-crimson-900 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-editorial-500 font-mono flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-crimson-700" />
                        {getTimeAgo(brief.created_at)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleShareWhatsApp(brief)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full transition-colors"
                      title="WhatsApp पर शेयर करें"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>व्हाट्सएप</span>
                    </button>
                  </div>

                  <p className="text-base sm:text-lg text-editorial-950 font-serif leading-relaxed">
                    {brief.content}
                  </p>

                  {brief.target_url && (
                    <div className="pt-2">
                      <Link
                        to={brief.target_url}
                        className="inline-flex items-center gap-1 text-xs font-bold text-crimson-800 hover:text-crimson-900 transition-colors"
                      >
                        <span>विस्तृत समाचार पढ़ें</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
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
