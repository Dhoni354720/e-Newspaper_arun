import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, User, ArrowRight } from 'lucide-react';
import { Article } from '@/types/database';
import { useLanguage } from '@/context/LanguageContext';
import { formatNewsDate } from '@/lib/date';

interface ArticleCardProps {
  article: Article;
  variant?: 'lead' | 'horizontal' | 'grid' | 'compact' | 'text-only';
  showExcerpt?: boolean;
  priorityImage?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'grid',
  showExcerpt = true,
  priorityImage = false,
}) => {
  const { language, t, getCategoryName } = useLanguage();

  const formattedDate = formatNewsDate(article.published_at || article.created_at, language, {
    format: 'short',
    includeTime: false,
  });

  const primaryCategory = article.categories?.[0];
  const categoryName = getCategoryName(primaryCategory);
  const imageUrl = article.featured_image_path || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80';

  // 1. LEAD / HERO STORY VARIANT
  if (variant === 'lead') {
    return (
      <article className="group relative bg-white border border-paper-border rounded-lg overflow-hidden shadow-sm hover:shadow-editorial-hover transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Featured Image */}
          <div className="lg:col-span-7 relative overflow-hidden bg-editorial-100 aspect-[16/10] lg:aspect-auto">
            <Link to={`/article/${article.slug}`} className="block w-full h-full">
              <img
                src={imageUrl}
                alt={article.image_alt || article.headline}
                loading={priorityImage ? 'eager' : 'lazy'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out min-h-[260px] lg:min-h-[420px]"
              />
            </Link>
            {categoryName && (
              <span className="absolute top-3 left-3 bg-crimson-800 text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm">
                {categoryName}
              </span>
            )}
          </div>

          {/* Lead Content */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white">
            <div>
              <div className="flex items-center gap-3 text-xs text-editorial-500 mb-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-crimson-800" />
                  {formattedDate}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-editorial-400" />
                  {article.reading_time_minutes} {t('minutes')}
                </span>
              </div>

              <Link to={`/article/${article.slug}`} className="block group">
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-3xl font-bold text-editorial-950 leading-tight group-hover:text-crimson-800 transition-colors mb-3">
                  {article.headline}
                </h2>
              </Link>

              {article.subtitle && (
                <p className="text-sm font-semibold text-editorial-700 mb-3 border-l-2 border-crimson-800 pl-2.5 italic">
                  {article.subtitle}
                </p>
              )}

              {showExcerpt && article.excerpt && (
                <p className="text-editorial-600 text-sm sm:text-base leading-relaxed line-clamp-4">
                  {article.excerpt}
                </p>
              )}
            </div>

            <div className="pt-6 mt-4 border-t border-paper-border flex items-center justify-between">
              {article.author?.display_name && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-editorial-700">
                  <User className="w-3.5 h-3.5 text-editorial-400" />
                  {article.author.display_name}
                </span>
              )}
              <Link
                to={`/article/${article.slug}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-crimson-800 group-hover:translate-x-1 transition-transform"
              >
                {t('readMore')} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // 2. HORIZONTAL ROW VARIANT
  if (variant === 'horizontal') {
    return (
      <article className="group bg-white border border-paper-border rounded-lg p-4 sm:p-5 hover:shadow-editorial-hover transition-all flex flex-col sm:flex-row gap-4 items-center">
        <Link to={`/article/${article.slug}`} className="w-full sm:w-48 sm:h-32 flex-shrink-0 relative overflow-hidden rounded bg-editorial-100 aspect-[16/10] sm:aspect-auto">
          <img
            src={imageUrl}
            alt={article.image_alt || article.headline}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {categoryName && (
            <span className="absolute top-2 left-2 bg-editorial-950/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
              {categoryName}
            </span>
          )}
        </Link>

        <div className="flex-1 w-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] text-editorial-500 mb-1">
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{article.reading_time_minutes} {t('minutes')}</span>
            </div>
            <Link to={`/article/${article.slug}`} className="block">
              <h3 className="font-serif text-base sm:text-lg font-bold text-editorial-950 leading-snug group-hover:text-crimson-800 transition-colors mb-1.5">
                {article.headline}
              </h3>
            </Link>
            {showExcerpt && article.excerpt && (
              <p className="text-xs sm:text-sm text-editorial-600 line-clamp-2 leading-relaxed">
                {article.excerpt}
              </p>
            )}
          </div>
        </div>
      </article>
    );
  }

  // 3. COMPACT THUMBNAIL VARIANT (For sidebars & top news lists)
  if (variant === 'compact') {
    return (
      <article className="group flex gap-3 items-start pb-3 border-b border-paper-border last:border-b-0">
        <Link to={`/article/${article.slug}`} className="w-20 h-16 sm:w-24 sm:h-18 flex-shrink-0 relative overflow-hidden rounded bg-editorial-100">
          <img
            src={imageUrl}
            alt={article.image_alt || article.headline}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] text-editorial-500 mb-1">
            {categoryName && <span className="font-semibold text-crimson-800">{categoryName}</span>}
            <span>•</span>
            <span>{formattedDate}</span>
          </div>
          <Link to={`/article/${article.slug}`} className="block">
            <h4 className="font-serif text-sm font-semibold text-editorial-900 leading-snug group-hover:text-crimson-800 transition-colors line-clamp-2">
              {article.headline}
            </h4>
          </Link>
        </div>
      </article>
    );
  }

  // 4. TEXT-ONLY VARIANT (Dense headline lists)
  if (variant === 'text-only') {
    return (
      <article className="group py-2.5 border-b border-paper-border last:border-b-0">
        <div className="flex items-center gap-2 text-[11px] text-editorial-500 mb-1">
          {categoryName && (
            <span className="font-semibold text-crimson-800 uppercase tracking-wider text-[10px]">
              {categoryName}
            </span>
          )}
          <span>•</span>
          <span>{formattedDate}</span>
        </div>
        <Link to={`/article/${article.slug}`} className="block">
          <h4 className="font-serif text-sm sm:text-base font-semibold text-editorial-950 hover:text-crimson-800 transition-colors leading-snug">
            {article.headline}
          </h4>
        </Link>
      </article>
    );
  }

  // 5. STANDARD GRID CARD (Default)
  return (
    <article className="group bg-white border border-paper-border rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-editorial-hover transition-all">
      <div>
        <Link to={`/article/${article.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-editorial-100">
          <img
            src={imageUrl}
            alt={article.image_alt || article.headline}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {categoryName && (
            <span className="absolute top-2.5 left-2.5 bg-editorial-950/80 backdrop-blur-sm text-white text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
              {categoryName}
            </span>
          )}
        </Link>

        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 text-xs text-editorial-500 mb-2">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{article.reading_time_minutes} {t('minutes')}</span>
          </div>

          <Link to={`/article/${article.slug}`} className="block">
            <h3 className="font-serif text-lg font-bold text-editorial-950 leading-snug group-hover:text-crimson-800 transition-colors mb-2 line-clamp-2">
              {article.headline}
            </h3>
          </Link>

          {showExcerpt && article.excerpt && (
            <p className="text-editorial-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
              {article.excerpt}
            </p>
          )}
        </div>
      </div>

      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 flex items-center justify-between border-t border-paper-border/60">
        <span className="text-xs text-editorial-500 truncate max-w-[150px]">
          {article.author?.display_name || 'संपादकीय प्रतिनिधी'}
        </span>
        <Link
          to={`/article/${article.slug}`}
          className="text-xs font-bold text-crimson-800 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          {t('readMore')} <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </article>
  );
};
