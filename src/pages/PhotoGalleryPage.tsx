import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { SEOHead } from '@/components/common/SEOHead';
import { repository } from '@/lib/repository';
import { Gallery } from '@/types/database';
import { useLanguage } from '@/context/LanguageContext';
import { formatDate } from '@/lib/date';
import { Camera, Image as ImageIcon, ArrowLeft, ArrowRight } from 'lucide-react';

export const PhotoGalleryPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    repository.getGalleries({ isPublished: true }).then(data => {
      if (isMounted) {
        setGalleries(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const getTitle = (g: Gallery): string => {
    if (language === 'hi') return g.title_hi;
    if (language === 'mr') return g.title_mr;
    return g.title_en;
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between selection:bg-crimson-100 selection:text-crimson-900">
      <SEOHead
        title="फोटो गैलरी (Photo Galleries) | दैनिक जगत समीक्षा"
        description="दैनिक जगत समीक्षा की विशेष फोटो गैलरी: महाराष्ट्र, संस्कृति, राजनीति, खेल और राष्ट्रीय आयोजनों की अनूठी तस्वीरें।"
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
            <span className="text-crimson-800 font-bold">{t('photoGallery')}</span>
          </div>

          {/* Page Heading */}
          <div className="border-b-2 border-editorial-950 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 bg-crimson-800 text-white rounded-md shadow-xs">
                <Camera className="w-5 h-5" />
              </span>
              <h1 className="font-masthead text-3xl sm:text-4xl font-black text-editorial-950 tracking-tight">
                {t('photoGallery')} (Photo Galleries)
              </h1>
            </div>
            <p className="text-sm text-editorial-600 font-serif">
              दैनिक जगत समीक्षा के वरिष्ठ फोटो पत्रकारों द्वारा कैद किए गए विशेष क्षण, जन आंदोलन और सांस्कृतिक धरोहर।
            </p>
          </div>

          {/* Galleries Grid */}
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-crimson-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm font-medium text-editorial-600 font-serif">गैलरी लोड हो रही है...</p>
            </div>
          ) : galleries.length === 0 ? (
            <div className="py-16 text-center bg-white border border-paper-border rounded-xl p-8 max-w-md mx-auto">
              <ImageIcon className="w-12 h-12 text-editorial-400 mx-auto mb-3" />
              <h2 className="text-base font-bold text-editorial-900 mb-1">कोई फोटो गैलरी उपलब्ध नहीं है</h2>
              <p className="text-xs text-editorial-500">कृपया शीघ्र ही दोबारा देखें।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleries.map(gallery => {
                const imgCount = gallery.images ? gallery.images.length : 1;
                return (
                  <Link
                    key={gallery.id}
                    to={`/photos/${gallery.slug}`}
                    className="group bg-white border border-paper-border hover:border-crimson-800 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                  >
                    {/* Cover Image Container */}
                    <div className="relative aspect-16/10 overflow-hidden bg-editorial-100">
                      <img
                        src={gallery.cover_image_url}
                        alt={getTitle(gallery)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      {/* Photo Count Badge */}
                      <span className="absolute top-3 right-3 bg-black/75 backdrop-blur-xs text-white text-xs font-mono font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow">
                        <Camera className="w-3.5 h-3.5 text-amber-400" />
                        <span>{imgCount} फोटो</span>
                      </span>

                      {/* Date on image */}
                      <span className="absolute bottom-3 left-3 text-editorial-200 text-xs font-mono">
                        {formatDate(gallery.published_at, language)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h2 className="font-serif font-bold text-base sm:text-lg text-editorial-950 group-hover:text-crimson-800 transition-colors line-clamp-2 leading-snug">
                          {getTitle(gallery)}
                        </h2>
                        {gallery.credit && (
                          <p className="text-xs text-editorial-500 mt-2 font-sans italic">
                            क्रेडिट: {gallery.credit}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-editorial-100 flex items-center justify-between text-xs font-bold text-crimson-800">
                        <span>गैलरी देखें</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};
