import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { SEOHead } from '@/components/common/SEOHead';
import { repository } from '@/lib/repository';
import { VideoItem } from '@/types/database';
import { useLanguage } from '@/context/LanguageContext';
import { formatDate } from '@/lib/date';
import { Video, Play, ArrowLeft, Clock, Calendar, Share2 } from 'lucide-react';

export const VideoHubPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    repository.getVideos({ isPublished: true }).then(data => {
      if (isMounted) {
        setVideos(data);
        if (data.length > 0) {
          setActiveVideo(data[0]);
        }
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const getTitle = (v: VideoItem): string => {
    if (language === 'hi') return v.title_hi;
    if (language === 'mr') return v.title_mr;
    return v.title_en;
  };

  const getDescription = (v: VideoItem): string => {
    if (language === 'hi' && v.description_hi) return v.description_hi;
    if (language === 'mr' && v.description_mr) return v.description_mr;
    if (language === 'en' && v.description_en) return v.description_en;
    return v.description_hi || v.description_mr || v.description_en || '';
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Convert raw youtube ID or URL into privacy-friendly youtube-nocookie embed URL
  const getEmbedUrl = (v: VideoItem): string => {
    let videoId = v.video_id_or_url;
    if (videoId.includes('v=')) {
      const parts = videoId.split('v=');
      videoId = parts[1].split('&')[0];
    } else if (videoId.includes('youtu.be/')) {
      const parts = videoId.split('youtu.be/');
      videoId = parts[1].split('?')[0];
    }
    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
  };

  const handleShare = (v: VideoItem) => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: getTitle(v),
        text: getDescription(v),
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert('वीडियो लिंक कॉपी हो गया!');
    }
  };

  // VideoObject JSON-LD Schema
  const videoSchema = activeVideo
    ? {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: getTitle(activeVideo),
        description: getDescription(activeVideo),
        thumbnailUrl: [activeVideo.thumbnail_url],
        uploadDate: activeVideo.published_at,
        embedUrl: getEmbedUrl(activeVideo),
      }
    : null;

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between selection:bg-crimson-100 selection:text-crimson-900">
      <SEOHead
        title="वीडियो हब (Video News) | दैनिक जगत समीक्षा"
        description="दैनिक जगत समीक्षा वीडियो बुलेटिन: ग्राउंड रिपोर्ट्स, संपादकीय विश्लेषण, महाराष्ट्र एवं राष्ट्रीय समाचार वीडियो कवरेज।"
        jsonLd={videoSchema ? JSON.stringify(videoSchema) : undefined}
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
            <span className="text-crimson-800 font-bold">{t('videoHub')}</span>
          </div>

          {/* Heading */}
          <div className="border-b-2 border-editorial-950 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 bg-crimson-800 text-white rounded-md shadow-xs">
                <Video className="w-5 h-5" />
              </span>
              <h1 className="font-masthead text-3xl sm:text-4xl font-black text-editorial-950 tracking-tight">
                {t('videoHub')} (Video Newsroom)
              </h1>
            </div>
            <p className="text-sm text-editorial-600 font-serif">
              दैनिक जगत समीक्षा की डिजिटल वीडियो डेस्क द्वारा प्रस्तुत खोजी रिपोर्ट्स, ग्राउंड बुलेटिन और संपादकीय संवाद।
            </p>
          </div>

          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-crimson-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm font-medium text-editorial-600 font-serif">वीडियो लोड हो रहे हैं...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="py-16 text-center bg-white border border-paper-border rounded-xl p-8 max-w-md mx-auto">
              <Video className="w-12 h-12 text-editorial-400 mx-auto mb-3" />
              <h2 className="text-base font-bold text-editorial-900 mb-1">कोई वीडियो उपलब्ध नहीं है</h2>
              <p className="text-xs text-editorial-500">शीघ्र ही नए वीडियो बुलेटिन जोड़े जाएंगे।</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Featured Active Player */}
              {activeVideo && (
                <div className="bg-white border-2 border-editorial-200 rounded-xl overflow-hidden shadow-sm">
                  {/* YouTube Privacy Embed */}
                  <div className="relative aspect-16/9 w-full bg-black">
                    <iframe
                      src={getEmbedUrl(activeVideo)}
                      title={getTitle(activeVideo)}
                      className="absolute inset-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  {/* Video Meta Info */}
                  <div className="p-6 sm:p-8 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3 text-xs text-editorial-500 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-crimson-700" />
                          {formatDate(activeVideo.published_at, language)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDuration(activeVideo.duration_seconds)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleShare(activeVideo)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-editorial-200 hover:border-crimson-800 text-xs font-semibold text-editorial-800 hover:text-crimson-800 transition-colors shadow-2xs"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>शेयर करें</span>
                      </button>
                    </div>

                    <h2 className="font-masthead text-2xl sm:text-3xl font-black text-editorial-950">
                      {getTitle(activeVideo)}
                    </h2>

                    {getDescription(activeVideo) && (
                      <p className="text-sm sm:text-base text-editorial-700 font-serif leading-relaxed border-t border-editorial-100 pt-3">
                        {getDescription(activeVideo)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Video Grid Playlist */}
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-xl text-editorial-950 pb-2 border-b border-editorial-200">
                  अन्य वीडियो बुलेटिन (All Videos)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map(video => {
                    const isActive = activeVideo?.id === video.id;
                    return (
                      <div
                        key={video.id}
                        onClick={() => {
                          setActiveVideo(video);
                          window.scrollTo({ top: 180, behavior: 'smooth' });
                        }}
                        className={`group cursor-pointer bg-white rounded-xl overflow-hidden border transition-all flex flex-col ${
                          isActive
                            ? 'border-crimson-800 ring-2 ring-crimson-800/20 shadow-md'
                            : 'border-paper-border hover:border-crimson-700 shadow-2xs hover:shadow-xs'
                        }`}
                      >
                        {/* Thumbnail with Play Badge */}
                        <div className="relative aspect-16/10 overflow-hidden bg-editorial-100">
                          <img
                            src={video.thumbnail_url}
                            alt={getTitle(video)}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="w-12 h-12 rounded-full bg-crimson-800 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            </span>
                          </div>

                          {/* Duration Badge */}
                          <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded shadow">
                            {formatDuration(video.duration_seconds)}
                          </span>
                        </div>

                        {/* Title & Date */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                          <h4 className="font-serif font-bold text-sm text-editorial-950 group-hover:text-crimson-800 transition-colors line-clamp-2 leading-snug">
                            {getTitle(video)}
                          </h4>
                          <span className="text-[11px] font-mono text-editorial-500">
                            {formatDate(video.published_at, language)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};
