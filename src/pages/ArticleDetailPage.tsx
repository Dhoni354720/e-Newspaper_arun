import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { BreakingNewsTicker } from '@/components/common/BreakingNewsTicker';
import { Footer } from '@/components/common/Footer';
import { SEOHead } from '@/components/common/SEOHead';
import { ArticleCard } from '@/components/common/ArticleCard';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { repository } from '@/lib/repository';
import { formatNewsDate } from '@/lib/date';
import { Article } from '@/types/database';
import { 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  Check, 
  Copy, 
  ChevronRight, 
  Globe, 
  ArrowLeft,
  Bookmark,
  EyeOff
} from 'lucide-react';

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t, getCategoryName } = useLanguage();
  const { isStaff } = useAuth();
  const navigate = useNavigate();

  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [translations, setTranslations] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    if (!slug) return;

    // Check with includePrivate true ONLY if user is staff (for previewing drafts)
    repository.getArticleBySlug(slug, { includePrivate: isStaff }).then(async (data) => {
      if (!isMounted) return;

      if (!data) {
        setArticle(null);
        setIsLoading(false);
        return;
      }

      setArticle(data);

      // Fetch related published stories and translations for this group
      const [related, trans] = await Promise.all([
        repository.getRelatedArticles(data, 4),
        repository.getArticleTranslations(data.translation_group_id),
      ]);

      if (isMounted) {
        setRelatedArticles(related);
        setTranslations(trans);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [slug, isStaff]);

  // Auto-switch to matching translation if user changes language in the header
  useEffect(() => {
    if (!article || translations.length === 0) return;
    if (article.language !== language) {
      const matchingTranslation = translations.find((tr) => tr.language === language);
      if (matchingTranslation && matchingTranslation.slug !== slug) {
        navigate(`/article/${matchingTranslation.slug}`, { replace: true });
      }
    }
  }, [language, article, translations, slug, navigate]);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: article?.headline || 'News',
      text: article?.excerpt || '',
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignored
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper flex flex-col justify-between">
        <Header />
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-crimson-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-medium text-editorial-600 font-serif">
            {language === 'mr' ? 'वृत्तपत्र लोड होत आहे...' : language === 'hi' ? 'समाचार लोड हो रहा है...' : 'Loading dispatch...'}
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-paper flex flex-col justify-between">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
          <EyeOff className="w-12 h-12 text-crimson-800 mx-auto mb-4" />
          <h1 className="font-serif text-3xl font-bold text-editorial-950 mb-3">
            {t('pageNotFound')}
          </h1>
          <p className="text-editorial-600 text-sm mb-6 leading-relaxed">
            {t('pageNotFoundDesc')}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-crimson-800 text-white rounded font-semibold text-xs hover:bg-crimson-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t('backToHome')}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const primaryCategory = article.categories?.[0];
  const categoryName = getCategoryName(primaryCategory);
  const formattedPublishDate = formatNewsDate(article.published_at || article.created_at, language, {
    format: 'full',
    includeTime: true,
  });

  const otherTranslations = translations.filter((t) => t.id !== article.id);

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between selection:bg-crimson-100 selection:text-crimson-900">
      <SEOHead
        title={article.headline}
        description={article.excerpt}
        ogImage={article.featured_image_path}
        publishedTime={article.published_at || article.created_at}
        modifiedTime={article.updated_at}
        authorName={article.author?.display_name}
        articleCategory={categoryName}
        articleType="article"
      />

      <div>
        <Header />
        <BreakingNewsTicker />

        {/* Private Draft / Scheduled Banner (Staff Preview only) */}
        {article.status !== 'published' && (
          <div className="bg-amber-100 border-b border-amber-300 py-2.5 px-4 text-center text-xs font-semibold text-amber-900 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping"></span>
            {language === 'mr' 
              ? `हा लेख अजून प्रकाशित झालेला नाही (स्थिती: ${article.status.toUpperCase()}). हा केवळ संपादकीय पूर्वदृश्यासाठी (Preview) दिसत आहे.` 
              : language === 'hi'
              ? `यह आलेख अभी प्रकाशित नहीं हुआ है (स्थिति: ${article.status.toUpperCase()}). यह केवल संपादकीय पूर्वावलोकन (Preview) है।`
              : `This article is not yet published (Status: ${article.status.toUpperCase()}). Staff preview only.`}
          </div>
        )}

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          {/* 1. Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-editorial-500 mb-6">
            <Link to="/" className="hover:text-crimson-800 transition-colors">
              {t('backToHome')}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            {primaryCategory && (
              <>
                <Link to={`/category/${primaryCategory.slug}`} className="hover:text-crimson-800 transition-colors font-medium">
                  {categoryName}
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
            <span className="truncate max-w-[200px] text-editorial-700">{article.headline}</span>
          </nav>

          {/* 2. Category badge & Available Translations Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            {categoryName && (
              <span className="inline-block bg-crimson-800 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded shadow-xs">
                {categoryName}
              </span>
            )}

            {/* Translation switch banner if translations exist */}
            {otherTranslations.length > 0 && (
              <div className="flex items-center gap-2 text-xs bg-white border border-paper-border px-3 py-1.5 rounded-full shadow-xs">
                <Globe className="w-3.5 h-3.5 text-crimson-800" />
                <span className="text-editorial-600 font-medium">
                  {language === 'mr' ? 'इतर भाषांमध्ये वाचा:' : language === 'hi' ? 'अन्य भाषाओं में पढ़ें:' : 'Read in other languages:'}
                </span>
                {otherTranslations.map((tr) => (
                  <Link
                    key={tr.id}
                    to={`/article/${tr.slug}`}
                    className="font-bold text-crimson-800 hover:underline px-1.5 py-0.5 rounded bg-crimson-50 text-[11px]"
                  >
                    {tr.language === 'mr' ? 'मराठी' : tr.language === 'hi' ? 'हिन्दी' : 'English'}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 3. Main Editorial Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-editorial-950 leading-tight tracking-tight mb-4">
            {article.headline}
          </h1>

          {/* Subtitle if present */}
          {article.subtitle && (
            <p className="text-lg sm:text-xl font-medium text-editorial-700 mb-6 leading-relaxed border-l-4 border-crimson-800 pl-4 italic">
              {article.subtitle}
            </p>
          )}

          {/* 4. Metadata: Author, Published Date (Asia/Kolkata), Reading Time & Social Sharing */}
          <div className="py-4 border-t border-b border-paper-border flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-editorial-600">
              <span className="flex items-center gap-1.5 font-semibold text-editorial-900">
                <User className="w-4 h-4 text-crimson-800" />
                {article.author?.display_name || (language === 'mr' ? 'विशेष प्रतिनिधी' : language === 'hi' ? 'विशेष संवाददाता' : 'Staff Reporter')}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-editorial-400" />
                {formattedPublishDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-editorial-400" />
                {article.reading_time_minutes} {t('minutes')}
              </span>
            </div>

            {/* Social Share Button */}
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-editorial-300 hover:border-crimson-800 text-editorial-800 hover:text-crimson-800 text-xs font-semibold bg-white transition-all shadow-xs"
              title={t('shareStory')}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-crimson-800" />}
              <span>{copied ? t('copiedLink') : t('shareStory')}</span>
            </button>
          </div>

          {/* 5. Featured Image with Caption */}
          {article.featured_image_path && (
            <figure className="mb-8">
              <div className="aspect-[16/10] overflow-hidden rounded-xl bg-editorial-100 border border-paper-border">
                <img
                  src={article.featured_image_path}
                  alt={article.image_alt || article.headline}
                  className="w-full h-full object-cover"
                />
              </div>
              {article.image_caption && (
                <figcaption className="text-xs sm:text-sm text-editorial-500 italic mt-2 px-1 text-center sm:text-left">
                  {article.image_caption}
                </figcaption>
              )}
            </figure>
          )}

          {/* 6. Excerpt / Lead Paragraph */}
          {article.excerpt && (
            <div className="mb-6 p-4 sm:p-5 bg-paper-subtle border-l-4 border-crimson-800 rounded-r text-base sm:text-lg font-serif leading-relaxed text-editorial-800">
              {article.excerpt}
            </div>
          )}

          {/* 7. Rich Text Article Body */}
          <div
            className="tiptap-content text-editorial-900 leading-relaxed font-sans text-base sm:text-lg mb-10 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />

          {/* 8. Tags Strip */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-6 border-t border-paper-border flex flex-wrap items-center gap-2 mb-10">
              <span className="text-xs font-bold text-editorial-500 uppercase tracking-wider mr-1">
                {language === 'mr' ? 'विषय टॅग्स :' : language === 'hi' ? 'विषय टैग :' : 'Topic Tags :'}
              </span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-white border border-editorial-200 text-editorial-700 px-3 py-1 rounded-full hover:border-crimson-800 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* 9. Related Articles Section */}
          {relatedArticles.length > 0 && (
            <section className="pt-10 border-t-2 border-editorial-950 mt-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-2xl font-bold text-editorial-950">
                  {t('relatedStories')}
                </h3>
                <Link to="/" className="text-xs font-semibold text-crimson-800 hover:underline">
                  {t('allNews')}
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedArticles.map((rel) => (
                  <ArticleCard key={rel.id} article={rel} variant="grid" />
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};
