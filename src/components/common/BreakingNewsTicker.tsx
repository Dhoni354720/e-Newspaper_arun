import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, ChevronLeft, ChevronRight, Pause, Play, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { repository } from '@/lib/repository';
import { BreakingNewsItem } from '@/types/database';

export const BreakingNewsTicker: React.FC = () => {
  const { language, t } = useLanguage();
  const [items, setItems] = useState<BreakingNewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    repository.getBreakingNews(language, false).then(data => {
      if (isMounted) {
        setItems(data);
        setCurrentIndex(0);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [language]);

  // Auto-rotate ticker headlines unless paused
  useEffect(() => {
    if (items.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [items.length, isPaused]);

  // If loading or empty state
  if (isLoading) {
    return (
      <div className="bg-crimson-800 text-white text-xs py-2 px-4 flex items-center gap-3">
        <span className="font-bold flex items-center gap-1 uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 animate-pulse text-amber-300" />
          {t('breakingNews')}
        </span>
        <span className="opacity-75 text-xs animate-pulse">
          {language === 'mr' ? 'ताज्या घडामोडी लोड होत आहेत...' : language === 'hi' ? 'ताज़ा घटनाक्रम लोड हो रहे हैं...' : 'Loading breaking headlines...'}
        </span>
      </div>
    );
  }

  if (items.length === 0) {
    return null; // Clean editorial look when no breaking items are active
  }

  const currentItem = items[currentIndex];
  const headline = currentItem.custom_headline || currentItem.article?.headline || '';
  const articleSlug = currentItem.article?.slug || '';

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % items.length);
  };

  return (
    <aside 
      aria-label={t('breakingNews')}
      className="bg-gradient-to-r from-crimson-900 via-crimson-800 to-crimson-900 text-white text-xs sm:text-sm py-2 px-4 border-b border-crimson-950/20 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="inline-flex items-center gap-1.5 bg-white text-crimson-900 px-2.5 py-0.5 rounded font-black uppercase text-[11px] sm:text-xs tracking-wider shadow-sm">
            <Flame className="w-3.5 h-3.5 text-crimson-700 animate-bounce" />
            {t('breakingNews')}
          </span>
        </div>

        {/* Center: Active Headline with Link */}
        <div className="flex-1 overflow-hidden">
          {articleSlug ? (
            <Link
              to={`/article/${articleSlug}`}
              className="block truncate font-medium hover:text-amber-200 transition-colors focus:outline-none focus:underline"
              title={headline}
            >
              {headline}
            </Link>
          ) : (
            <span className="block truncate font-medium text-amber-50" title={headline}>
              {headline}
            </span>
          )}
        </div>

        {/* Right: Controls (Previous, Pause/Play, Next, Counter) */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 text-white/90">
          {items.length > 1 && (
            <span className="text-[11px] text-white/70 mr-1 font-mono">
              {currentIndex + 1}/{items.length}
            </span>
          )}

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 hover:bg-crimson-700/60 rounded transition-colors"
            title={isPaused ? 'बातमी फिरवणे सुरू करा' : 'बातमी फिरवणे थांबवा'}
            aria-label={isPaused ? 'Resume ticker' : 'Pause ticker'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {items.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="p-1 hover:bg-crimson-700/60 rounded transition-colors"
                title="मागील बातमी"
                aria-label="Previous headline"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-1 hover:bg-crimson-700/60 rounded transition-colors"
                title="पुढील बातमी"
                aria-label="Next headline"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};
