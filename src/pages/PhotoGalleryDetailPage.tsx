import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { SEOHead } from '@/components/common/SEOHead';
import { repository } from '@/lib/repository';
import { Gallery, GalleryImage } from '@/types/database';
import { useLanguage } from '@/context/LanguageContext';
import { formatDate } from '@/lib/date';
import { 
  Camera, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Maximize2,
  Calendar,
  Share2
} from 'lucide-react';

export const PhotoGalleryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();

  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    if (slug) {
      repository.getGalleryBySlug(slug).then(data => {
        if (isMounted) {
          setGallery(data);
          setIsLoading(false);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const images: GalleryImage[] = gallery?.images && gallery.images.length > 0
    ? gallery.images
    : gallery ? [{
        id: 'img-cover',
        gallery_id: gallery.id,
        image_url: gallery.cover_image_url,
        caption_hi: gallery.title_hi,
        caption_mr: gallery.title_mr,
        caption_en: gallery.title_en,
        credit: gallery.credit,
        sort_order: 1,
        created_at: gallery.created_at,
      }] : [];

  const handleNext = useCallback(() => {
    if (activeImageIndex === null || images.length === 0) return;
    setActiveImageIndex((activeImageIndex + 1) % images.length);
  }, [activeImageIndex, images.length]);

  const handlePrev = useCallback(() => {
    if (activeImageIndex === null || images.length === 0) return;
    setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length);
  }, [activeImageIndex, images.length]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (activeImageIndex === null) return;
      if (e.key === 'Escape') setActiveImageIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    },
    [activeImageIndex, handleNext, handlePrev]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const getTitle = (g: Gallery): string => {
    if (language === 'hi') return g.title_hi;
    if (language === 'mr') return g.title_mr;
    return g.title_en;
  };

  const getCaption = (img: GalleryImage): string => {
    if (language === 'hi' && img.caption_hi) return img.caption_hi;
    if (language === 'mr' && img.caption_mr) return img.caption_mr;
    if (language === 'en' && img.caption_en) return img.caption_en;
    return img.caption_hi || img.caption_mr || img.caption_en || '';
  };

  const handleShare = () => {
    if (navigator.share && gallery) {
      navigator.share({
        title: getTitle(gallery),
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('गैलरी लिंक कॉपी हो गया!');
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between selection:bg-crimson-100 selection:text-crimson-900">
      {gallery && (
        <SEOHead
          title={`${getTitle(gallery)} | फोटो गैलरी | दैनिक जगत समीक्षा`}
          description={getTitle(gallery)}
          ogImage={gallery.cover_image_url}
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
            <Link to="/photos" className="hover:text-crimson-800 transition-colors">
              {t('photoGallery')}
            </Link>
            {gallery && (
              <>
                <span>/</span>
                <span className="text-crimson-800 font-bold truncate max-w-xs">{getTitle(gallery)}</span>
              </>
            )}
          </div>

          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-crimson-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm font-medium text-editorial-600 font-serif">तस्वीरें लोड हो रही हैं...</p>
            </div>
          ) : !gallery ? (
            <div className="py-16 text-center bg-white border border-paper-border rounded-xl p-8 max-w-md mx-auto">
              <h2 className="text-base font-bold text-editorial-900 mb-2">फोटो गैलरी नहीं मिली</h2>
              <Link to="/photos" className="text-xs font-bold text-crimson-800 hover:underline">
                ← सभी फोटो गैलरी देखें
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="bg-white border-2 border-editorial-200 rounded-xl p-6 sm:p-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <span className="bg-crimson-50 text-crimson-800 border border-crimson-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" />
                    <span>{images.length} तस्वीरें</span>
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-editorial-500 font-mono flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(gallery.published_at, language)}
                    </span>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="p-1.5 text-editorial-600 hover:text-crimson-800 hover:bg-editorial-50 rounded transition-colors"
                      title="शेयर करें"
                      aria-label="Share Gallery"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h1 className="font-masthead text-2xl sm:text-3xl md:text-4xl font-black text-editorial-950 leading-tight">
                  {getTitle(gallery)}
                </h1>

                {gallery.credit && (
                  <p className="text-xs font-sans text-editorial-600 border-t border-editorial-100 pt-3">
                    <strong>छायाचित्र क्रेडिट:</strong> {gallery.credit}
                  </p>
                )}
              </div>

              {/* Masonry / Photo Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <div
                    key={img.id}
                    onClick={() => setActiveImageIndex(idx)}
                    className="group relative cursor-pointer overflow-hidden rounded-xl bg-editorial-100 border border-paper-border shadow-2xs hover:shadow-md transition-all"
                  >
                    <div className="aspect-4/3 overflow-hidden">
                      <img
                        src={img.image_url}
                        alt={getCaption(img) || `तस्वीर ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="p-2.5 bg-black/70 text-white rounded-full">
                        <Maximize2 className="w-5 h-5" />
                      </span>
                    </div>
                    {getCaption(img) && (
                      <div className="p-3 bg-white border-t border-editorial-100">
                        <p className="text-xs text-editorial-800 line-clamp-2 font-serif">
                          {getCaption(img)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Lightbox Modal */}
      {activeImageIndex !== null && images[activeImageIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 select-none animate-fade-in">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold bg-white/10 px-3 py-1 rounded-full">
                {activeImageIndex + 1} / {images.length}
              </span>
              <span className="text-sm font-serif font-semibold text-white/90 truncate max-w-md hidden sm:inline">
                {gallery ? getTitle(gallery) : ''}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setActiveImageIndex(null)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Center Image Container */}
          <div className="relative flex-1 flex items-center justify-center my-4 min-h-0">
            <img
              src={images[activeImageIndex].image_url}
              alt={getCaption(images[activeImageIndex])}
              className="max-h-full max-w-full object-contain rounded shadow-2xl"
            />

            {/* Nav Arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-2 sm:left-4 p-3 bg-black/60 hover:bg-black/90 text-white rounded-full shadow-lg transition-transform hover:scale-110"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-2 sm:right-4 p-3 bg-black/60 hover:bg-black/90 text-white rounded-full shadow-lg transition-transform hover:scale-110"
                  aria-label="Next Image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Caption */}
          <div className="text-center max-w-2xl mx-auto pt-3 border-t border-white/10 w-full">
            {getCaption(images[activeImageIndex]) && (
              <p className="text-xs sm:text-sm text-white/90 font-serif leading-relaxed">
                {getCaption(images[activeImageIndex])}
              </p>
            )}
            {images[activeImageIndex].credit && (
              <p className="text-[11px] text-white/60 font-sans mt-1">
                फोटो: {images[activeImageIndex].credit}
              </p>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
