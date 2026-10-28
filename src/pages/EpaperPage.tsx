import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { BreakingNewsTicker } from '@/components/common/BreakingNewsTicker';
import { Footer } from '@/components/common/Footer';
import { SEOHead } from '@/components/common/SEOHead';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';
import { repository } from '@/lib/repository';
import { EpaperEdition, EpaperPage as IEpaperPage } from '@/types/database';
import { 
  Newspaper, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Maximize2, 
  Minimize2, 
  Share2, 
  Calendar, 
  Eye, 
  ArrowLeft,
  Check,
  MapPin,
  Layers,
  Sparkles
} from 'lucide-react';

export const EpaperPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { publicationName, tagline } = useSettings();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedDate = searchParams.get('date') || '';
  const selectedRegion = searchParams.get('region') || 'pune';

  const [editions, setEditions] = useState<EpaperEdition[]>([]);
  const [currentEdition, setCurrentEdition] = useState<EpaperEdition | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const viewerRef = useRef<HTMLDivElement>(null);

  // Load available editions
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    repository.getEpaperEditions({ isPublished: true }).then((res) => {
      if (!isMounted) return;
      setEditions(res.editions);

      // Find matching edition by date and region, or first available
      let match: EpaperEdition | undefined;
      if (selectedDate && selectedRegion) {
        match = res.editions.find(e => e.edition_date === selectedDate && e.edition_region === selectedRegion);
      } else if (selectedRegion) {
        match = res.editions.find(e => e.edition_region === selectedRegion);
      } else if (selectedDate) {
        match = res.editions.find(e => e.edition_date === selectedDate);
      }

      const activeEdition = match || res.editions[0] || null;
      setCurrentEdition(activeEdition);
      setCurrentPageIndex(0);
      setIsLoading(false);

      if (activeEdition) {
        repository.incrementEpaperViews(activeEdition.id);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedDate, selectedRegion]);

  // Keyboard navigation for page flip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentEdition?.pages || currentEdition.pages.length <= 1) return;
      if (e.key === 'ArrowRight') {
        setCurrentPageIndex(prev => Math.min(prev + 1, (currentEdition.pages?.length || 1) - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentPageIndex(prev => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentEdition]);

  const handleSelectEdition = (edition: EpaperEdition) => {
    setCurrentEdition(edition);
    setCurrentPageIndex(0);
    setZoomLevel(1);
    const params = new URLSearchParams(searchParams);
    params.set('date', edition.edition_date);
    params.set('region', edition.edition_region);
    setSearchParams(params);
    repository.incrementEpaperViews(edition.id);
  };

  const handleRegionChange = (reg: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('region', reg);
    setSearchParams(params);
  };

  const handleDateChange = (date: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('date', date);
    setSearchParams(params);
  };

  const toggleFullscreen = () => {
    if (!viewerRef.current) return;
    if (!document.fullscreenElement) {
      viewerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleDownload = () => {
    if (!currentEdition) return;
    repository.incrementEpaperDownloads(currentEdition.id);
    if (currentEdition.pdf_url) {
      window.open(currentEdition.pdf_url, '_blank');
    } else {
      const activePage = currentEdition.pages?.[currentPageIndex];
      if (activePage?.image_url) {
        window.open(activePage.image_url, '_blank');
      }
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentEdition?.title || 'Janvani E-Paper',
          text: currentEdition?.description || '',
          url,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const activePages = currentEdition?.pages || [];
  const activePage = activePages[currentPageIndex];
  const totalPages = activePages.length;

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-between selection:bg-crimson-100 selection:text-crimson-900">
      <SEOHead
        title={`${t('epaper')} — ${currentEdition?.title || publicationName}`}
        description={currentEdition?.description || 'Read the official digital newspaper edition online.'}
      />

      <div>
        <Header />
        <BreakingNewsTicker />

        <main className="max-w-7xl mx-auto px-2 sm:px-6 py-4 sm:py-6 space-y-4">
          {/* 1. E-Paper Masthead Banner & Controls Bar */}
          <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-crimson-800 text-white px-2.5 py-0.5 rounded text-xs font-black uppercase tracking-wider shadow-sm">
                    <Newspaper className="w-3.5 h-3.5" />
                    {t('epaper')}
                  </span>
                  <span className="text-xs font-semibold text-stone-500">
                    {currentEdition?.edition_date}
                  </span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-black text-stone-900 mt-1">
                  {currentEdition?.title || t('epaperTitle')}
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 font-serif italic mt-0.5">
                  {t('epaperSubtitle')}
                </p>
              </div>

              {/* View Count & Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {currentEdition && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-stone-600 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200 font-medium mr-2">
                    <Eye className="w-4 h-4 text-crimson-700" />
                    <span>{(currentEdition.views_count || 0).toLocaleString()} {t('totalViews')}</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-crimson-800 hover:bg-crimson-900 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                  title={t('downloadPdf')}
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('downloadPdf')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold border border-stone-300 transition-colors"
                  title="Share E-Paper"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  <span>{copied ? t('copiedLink') : t('shareStory')}</span>
                </button>
              </div>
            </div>

            {/* Region Tabs & Date Selection Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-xs">
              {/* Region Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <span className="font-bold text-stone-500 uppercase tracking-wider mr-1 hidden sm:inline">
                  {t('selectEdition')}:
                </span>
                <button
                  onClick={() => handleRegionChange('pune')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    selectedRegion === 'pune'
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {t('puneEdition')}
                </button>
                <button
                  onClick={() => handleRegionChange('mumbai')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    selectedRegion === 'mumbai'
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {t('mumbaiEdition')}
                </button>
                <button
                  onClick={() => handleRegionChange('maharashtra')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    selectedRegion === 'maharashtra'
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {t('stateEdition')}
                </button>
              </div>

              {/* Archive Edition Date Picker */}
              <div className="flex items-center gap-2 ml-auto">
                <Calendar className="w-4 h-4 text-crimson-800" />
                <label htmlFor="epaper-date-select" className="font-semibold text-stone-700">
                  {t('selectDate')}:
                </label>
                <select
                  id="epaper-date-select"
                  value={currentEdition?.edition_date || ''}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="bg-stone-50 border border-stone-300 rounded px-2.5 py-1 text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-crimson-800"
                >
                  {editions.map((ed) => (
                    <option key={ed.id} value={ed.edition_date}>
                      {ed.edition_date} — {ed.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. Interactive Digital Newspaper Reader Viewer */}
          {isLoading ? (
            <div className="py-24 text-center bg-white rounded-xl border border-stone-200 shadow-sm">
              <div className="w-10 h-10 border-4 border-crimson-800 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm font-serif text-stone-600">{t('loadingEpaper')}</p>
            </div>
          ) : !currentEdition || totalPages === 0 ? (
            <div className="py-20 text-center bg-white rounded-xl border border-stone-200 p-8 max-w-lg mx-auto shadow-sm">
              <Newspaper className="w-12 h-12 text-stone-400 mx-auto mb-3" />
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">{t('noEpaperFound')}</h3>
              <p className="text-xs text-stone-600 mb-4">कृपया दुसरी तारीख किंवा आवृत्ती निवडून पुन्हा पहा.</p>
              <button
                onClick={() => {
                  const first = editions[0];
                  if (first) handleSelectEdition(first);
                }}
                className="px-4 py-2 bg-crimson-800 text-white text-xs font-bold rounded-lg hover:bg-crimson-900"
              >
                {t('todayEdition')}
              </button>
            </div>
          ) : (
            <div 
              ref={viewerRef} 
              className={`bg-stone-900 rounded-xl overflow-hidden shadow-xl border border-stone-800 flex flex-col ${
                isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
              }`}
            >
              {/* Viewer Control Bar */}
              <div className="bg-stone-950/90 text-stone-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 text-xs">
                {/* Left: Page Info */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white bg-crimson-800 px-2.5 py-0.5 rounded text-[11px] uppercase tracking-wide">
                    {t('pageNumber')} {currentPageIndex + 1} / {totalPages}
                  </span>
                  <span className="text-stone-300 font-medium truncate max-w-[200px] sm:max-w-xs">
                    {activePage?.page_title}
                  </span>
                </div>

                {/* Center: Page Turn Controls */}
                <div className="flex items-center gap-1 bg-stone-900 px-2 py-1 rounded-lg border border-stone-800">
                  <button
                    type="button"
                    onClick={() => setCurrentPageIndex(prev => Math.max(prev - 1, 0))}
                    disabled={currentPageIndex <= 0}
                    className="p-1 hover:bg-stone-800 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    title={t('prevPage')}
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>

                  <span className="px-2 font-mono text-stone-200 text-xs font-semibold">
                    {currentPageIndex + 1} / {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setCurrentPageIndex(prev => Math.min(prev + 1, totalPages - 1))}
                    disabled={currentPageIndex >= totalPages - 1}
                    className="p-1 hover:bg-stone-800 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    title={t('nextPage')}
                    aria-label="Next Page"
                  >
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Right: Zoom & Fullscreen Controls */}
                <div className="flex items-center gap-1.5 ml-auto">
                  <button
                    type="button"
                    onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
                    className="p-1.5 hover:bg-stone-800 rounded text-stone-300 hover:text-white transition-colors"
                    title={t('zoomOut')}
                    aria-label="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>

                  <span className="font-mono text-[11px] text-stone-400 w-10 text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>

                  <button
                    type="button"
                    onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
                    className="p-1.5 hover:bg-stone-800 rounded text-stone-300 hover:text-white transition-colors"
                    title={t('zoomIn')}
                    aria-label="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setZoomLevel(1)}
                    className="p-1.5 hover:bg-stone-800 rounded text-stone-300 hover:text-white transition-colors"
                    title={t('resetZoom')}
                    aria-label="Reset Zoom"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="p-1.5 hover:bg-stone-800 rounded text-stone-300 hover:text-white transition-colors ml-1"
                    title={isFullscreen ? t('exitFullScreen') : t('fullScreen')}
                    aria-label="Toggle Fullscreen"
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Central Interactive Broadsheet Display */}
              <div className="relative flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center min-h-[500px] max-h-[820px] bg-stone-950/80">
                {activePage && (
                  <div
                    style={{
                      transform: `scale(${zoomLevel})`,
                      transformOrigin: 'top center',
                      transition: 'transform 0.2s ease-out',
                    }}
                    className="bg-white rounded shadow-2xl max-w-full overflow-hidden border border-stone-700"
                  >
                    <img
                      src={activePage.image_url}
                      alt={activePage.page_title}
                      className="w-auto h-auto max-w-[850px] object-contain select-none"
                      draggable={false}
                    />
                  </div>
                )}
              </div>

              {/* 3. Bottom Filmstrip / Thumbnails Strip */}
              <div className="bg-stone-950 border-t border-stone-800 p-3">
                <div className="flex items-center justify-between pb-2 text-xs text-stone-400">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-crimson-600" />
                    {t('pages')} ({totalPages}):
                  </span>
                  <span className="text-[11px] text-stone-500">
                    कीबोर्डवरील बाण (Left / Right Arrow) वापरूनही पाने बदलू शकता
                  </span>
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-700">
                  {activePages.map((page, idx) => {
                    const isCurrent = idx === currentPageIndex;
                    return (
                      <button
                        key={page.id}
                        type="button"
                        onClick={() => {
                          setCurrentPageIndex(idx);
                          setZoomLevel(1);
                        }}
                        className={`flex-shrink-0 text-left rounded-lg p-1 transition-all ${
                          isCurrent
                            ? 'ring-2 ring-crimson-600 bg-stone-800 shadow-lg scale-105'
                            : 'opacity-60 hover:opacity-100 hover:bg-stone-900'
                        }`}
                      >
                        <div className="w-20 h-28 bg-stone-800 rounded overflow-hidden border border-stone-700 flex items-center justify-center">
                          <img
                            src={page.thumbnail_url || page.image_url}
                            alt={page.page_title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-[10px] text-stone-300 font-medium text-center mt-1 truncate w-20">
                          {t('page')} {page.page_number}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 4. Archives and Other Editions Card */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-4 flex items-center gap-2 border-b border-stone-200 pb-2">
              <Calendar className="w-5 h-5 text-crimson-800" />
              {t('editionArchive')} — {t('allEditions')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {editions.map((ed) => (
                <div
                  key={ed.id}
                  onClick={() => handleSelectEdition(ed)}
                  className={`cursor-pointer border rounded-xl p-4 flex gap-4 transition-all ${
                    ed.id === currentEdition?.id
                      ? 'border-crimson-800 bg-crimson-50/40 shadow-sm'
                      : 'border-stone-200 hover:border-stone-400 bg-white hover:shadow-xs'
                  }`}
                >
                  <div className="w-16 h-22 bg-stone-100 rounded border border-stone-300 flex-shrink-0 overflow-hidden">
                    <img src={ed.thumbnail_url} alt={ed.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-crimson-800 bg-crimson-100 px-2 py-0.5 rounded">
                        {ed.edition_region.toUpperCase()}
                      </span>
                      <h4 className="font-serif font-bold text-stone-900 text-sm mt-1 truncate">
                        {ed.title}
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {ed.edition_date} • {ed.total_pages} {t('pages')}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-stone-400" /> {(ed.views_count || 0).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3 text-stone-400" /> {(ed.downloads_count || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
