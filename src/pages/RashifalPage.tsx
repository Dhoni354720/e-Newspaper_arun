import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { SEOHead } from '@/components/common/SEOHead';
import { repository } from '@/lib/repository';
import { ZODIAC_SIGNS } from '@/data/seedData';
import { HoroscopeItem, HoroscopePeriod, HoroscopeSign } from '@/types/database';
import { useLanguage } from '@/context/LanguageContext';
import { formatDate } from '@/lib/date';
import { Sparkles, Calendar, ArrowLeft, Award, Compass } from 'lucide-react';

export const RashifalPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [period, setPeriod] = useState<HoroscopePeriod>('daily');
  const [horoscopes, setHoroscopes] = useState<HoroscopeItem[]>([]);
  const [selectedSign, setSelectedSign] = useState<HoroscopeSign>('aries');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    repository.getHoroscopes(period).then(data => {
      if (isMounted) {
        setHoroscopes(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [period]);

  const activeHoroscope = horoscopes.find(h => h.sign === selectedSign) || horoscopes[0];
  const activeSignInfo = ZODIAC_SIGNS.find(s => s.sign === selectedSign) || ZODIAC_SIGNS[0];

  const getSignName = (signKey: HoroscopeSign): string => {
    const info = ZODIAC_SIGNS.find(s => s.sign === signKey);
    if (!info) return signKey;
    if (language === 'hi') return info.hi;
    if (language === 'mr') return info.mr;
    return info.en;
  };

  const getContent = (h: HoroscopeItem): string => {
    if (language === 'hi' && h.content_hi) return h.content_hi;
    if (language === 'mr' && h.content_mr) return h.content_mr;
    if (language === 'en' && h.content_en) return h.content_en;
    return h.content_hi || h.content_mr || h.content_en || '';
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between selection:bg-crimson-100 selection:text-crimson-900">
      <SEOHead
        title="दैनिक राशिफल (Horoscope & Astrology) | दैनिक जगत समीक्षा"
        description="दैनिक जगत समीक्षा राशिफल: मेष से मीन तक सभी १२ राशियों का आज का विस्तृत भविष्यफल, शुभ अंक, शुभ रंग और ग्रह गोचर विश्लेषण।"
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
            <span className="text-crimson-800 font-bold">{t('rashifal')}</span>
          </div>

          {/* Page Banner */}
          <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-editorial-950 text-white rounded-xl p-6 sm:p-8 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-brand-gold text-editorial-950 rounded-md font-bold shadow-xs">
                    <Sparkles className="w-4 h-4 fill-current" />
                  </span>
                  <h1 className="font-masthead text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {t('rashifal')} (Zodiac Dispatches)
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-amber-200 font-serif">
                  ग्रह-गोचर गणना पर आधारित दैनिक जगत समीक्षा का प्रामाणिक ज्योतिषीय मार्गदर्शन।
                </p>
              </div>

              {/* Period Tabs */}
              <div className="flex items-center bg-black/40 border border-white/20 p-1 rounded-lg text-xs font-semibold self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setPeriod('daily')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    period === 'daily'
                      ? 'bg-brand-gold text-editorial-950 shadow-xs font-bold'
                      : 'text-white hover:text-amber-200'
                  }`}
                >
                  दैनिक (Daily)
                </button>
                <button
                  type="button"
                  onClick={() => setPeriod('weekly')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    period === 'weekly'
                      ? 'bg-brand-gold text-editorial-950 shadow-xs font-bold'
                      : 'text-white hover:text-amber-200'
                  }`}
                >
                  साप्ताहिक (Weekly)
                </button>
                <button
                  type="button"
                  onClick={() => setPeriod('monthly')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    period === 'monthly'
                      ? 'bg-brand-gold text-editorial-950 shadow-xs font-bold'
                      : 'text-white hover:text-amber-200'
                  }`}
                >
                  मासिक (Monthly)
                </button>
              </div>
            </div>
          </div>

          {/* 12 Signs Selector Pills */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
            {ZODIAC_SIGNS.map(z => {
              const isSelected = selectedSign === z.sign;
              return (
                <button
                  key={z.sign}
                  type="button"
                  onClick={() => setSelectedSign(z.sign)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-crimson-800 border-crimson-800 text-white shadow-md scale-105 font-bold'
                      : 'bg-white border-paper-border hover:border-crimson-700 text-editorial-900 shadow-2xs hover:shadow-xs'
                  }`}
                >
                  <span className="text-xl mb-1">{z.symbol}</span>
                  <span className="text-xs font-serif font-bold leading-none">
                    {language === 'hi' ? z.hi : language === 'mr' ? z.mr : z.en}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Sign Featured Detail Card */}
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-crimson-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm font-medium text-editorial-600 font-serif">राशिफल लोड हो रहा है...</p>
            </div>
          ) : activeHoroscope ? (
            <div className="bg-white border-2 border-editorial-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-editorial-100">
                <div className="flex items-center gap-4">
                  <span className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-3xl flex items-center justify-center shadow-xs">
                    {activeSignInfo.symbol}
                  </span>
                  <div>
                    <h2 className="font-masthead text-2xl sm:text-3xl font-black text-editorial-950">
                      {getSignName(selectedSign)} राशि (
                      {activeSignInfo.en})
                    </h2>
                    <p className="text-xs font-mono text-editorial-500 mt-0.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-crimson-700" />
                      <span>{formatDate(activeHoroscope.date_for, language)}</span>
                    </p>
                  </div>
                </div>

                {/* Lucky Info Pills */}
                <div className="flex items-center gap-2 flex-wrap">
                  {activeHoroscope.lucky_number && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold font-mono">
                      <Compass className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t('luckyNumber')}: {activeHoroscope.lucky_number}</span>
                    </span>
                  )}
                  {activeHoroscope.lucky_color && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t('luckyColor')}: {activeHoroscope.lucky_color}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Prediction Text */}
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-base text-crimson-800">
                  ग्रह गोचर व फलकथन:
                </h3>
                <p className="font-serif text-base sm:text-lg text-editorial-900 leading-relaxed max-w-4xl">
                  {getContent(activeHoroscope)}
                </p>
              </div>

              {/* Attribution */}
              <div className="pt-4 border-t border-editorial-100 flex items-center justify-between text-xs text-editorial-500 font-sans">
                <span>{activeHoroscope.author_credit || 'दैनिक जगत समीक्षा ज्योतिष केंद्र'}</span>
                <span className="italic">भांडुप (पश्चिम), मुंबई</span>
              </div>
            </div>
          ) : null}

          {/* All 12 Signs Grid Overview */}
          <div className="space-y-4 pt-4">
            <h3 className="font-serif font-bold text-xl text-editorial-950 pb-2 border-b border-editorial-200">
              समस्त १२ राशियों का संपूर्ण राशिफल (All Signs Overview)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ZODIAC_SIGNS.map(z => {
                const item = horoscopes.find(h => h.sign === z.sign);
                return (
                  <div
                    key={z.sign}
                    onClick={() => {
                      setSelectedSign(z.sign);
                      window.scrollTo({ top: 180, behavior: 'smooth' });
                    }}
                    className="cursor-pointer bg-white border border-paper-border hover:border-crimson-800 rounded-xl p-5 shadow-2xs hover:shadow-xs transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{z.symbol}</span>
                        <h4 className="font-serif font-bold text-base text-editorial-950">
                          {language === 'hi' ? z.hi : language === 'mr' ? z.mr : z.en}
                        </h4>
                      </div>
                      {item?.lucky_number && (
                        <span className="text-[11px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                          अंक: {item.lucky_number}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-editorial-700 font-serif line-clamp-3 leading-relaxed">
                      {item ? getContent(item) : 'फलकथन अद्ययावत केले जात आहे...'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
