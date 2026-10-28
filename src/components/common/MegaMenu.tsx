import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronRight, Newspaper, Flame, Sparkles } from 'lucide-react';
import { Category, Article, SupportedLanguage } from '@/types/database';
import { repository } from '@/lib/repository';
import { useLanguage } from '@/context/LanguageContext';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose, categories }) => {
  const { language, t, getCategoryName } = useLanguage();
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (isOpen) {
      repository.getArticles({ language, limit: 4 }).then(res => {
        setRecentArticles(res.articles);
      });
    }
  }, [isOpen, language]);

  if (!isOpen) return null;

  // Group categories into broadsheet desks
  const nationalCats = categories.filter(c => ['top-news', 'india', 'international', 'politics'].includes(c.slug));
  const regionalCats = categories.filter(c => ['maharashtra', 'madhya-pradesh', 'delhi'].includes(c.slug));
  const crimeAndLawCats = categories.filter(c => ['crime', 'court'].includes(c.slug));
  const businessSportsCats = categories.filter(c => ['business', 'sports', 'entertainment'].includes(c.slug));
  const editorialCats = categories.filter(c => ['editorial', 'lead-editorial', 'opinion', 'columns'].includes(c.slug));
  const specialCats = categories.filter(c =>
    ['agriculture', 'education', 'health', 'lifestyle', 'religion-culture', 'weather', 'curious-odd', 'supplements', 'photos', 'videos', 'rashifal'].includes(c.slug)
  );

  // Group subcategories under parents
  const getSubcategories = (parentId: string) => categories.filter(c => c.parent_id === parentId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm transition-all animate-fadeIn">
      <div className="min-h-screen px-4 text-center">
        {/* Backdrop close click */}
        <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

        {/* Modal Dialog */}
        <div className="inline-block w-full max-w-6xl my-8 p-6 text-left align-middle transition-all transform bg-white shadow-2xl rounded-lg border-t-4 border-crimson-800 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-editorial-200">
            <div className="flex items-center gap-3">
              <span className="bg-crimson-800 text-white text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                {t('megaMenu')}
              </span>
              <h2 className="text-xl sm:text-2xl font-masthead font-black text-editorial-950">
                {t('allSections')}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-editorial-500 hover:text-editorial-950 hover:bg-paper-subtle transition-colors"
              aria-label="Close sections menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 py-6">
            {/* Column 1: National & Politics */}
            <div>
              <h3 className="font-serif font-bold text-sm text-crimson-900 border-b border-crimson-200 pb-1.5 mb-3 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-crimson-700" />
                <span>देश एवं राजनीति</span>
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/top-news"
                    onClick={onClose}
                    className="font-bold text-crimson-800 hover:underline flex items-center justify-between"
                  >
                    <span>{t('topNews')}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-crimson-600" />
                  </Link>
                </li>
                {nationalCats.map(cat => (
                  <li key={cat.id}>
                    <Link
                      to={`/category/${cat.slug}`}
                      onClick={onClose}
                      className="text-editorial-800 hover:text-crimson-800 transition-colors block py-0.5"
                    >
                      {getCategoryName(cat)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Regional States & Cities */}
            <div>
              <h3 className="font-serif font-bold text-sm text-crimson-900 border-b border-crimson-200 pb-1.5 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>प्रादेशिक एवं नगर</span>
              </h3>
              <div className="space-y-3 text-sm">
                {regionalCats.map(parentCat => {
                  const subs = getSubcategories(parentCat.id);
                  return (
                    <div key={parentCat.id}>
                      <Link
                        to={`/category/${parentCat.slug}`}
                        onClick={onClose}
                        className="font-bold text-editorial-900 hover:text-crimson-800 block"
                      >
                        {getCategoryName(parentCat)}
                      </Link>
                      {subs.length > 0 && (
                        <ul className="pl-2 mt-1 space-y-1 text-xs text-editorial-600 border-l border-editorial-200">
                          {subs.map(sub => (
                            <li key={sub.id}>
                              <Link
                                to={`/category/${sub.slug}`}
                                onClick={onClose}
                                className="hover:text-crimson-800 hover:underline block py-0.5"
                              >
                                • {getCategoryName(sub)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 3: Crime, Courts, Business & Sports */}
            <div>
              <h3 className="font-serif font-bold text-sm text-crimson-900 border-b border-crimson-200 pb-1.5 mb-3">
                क्राइम, व्यापार व खेल
              </h3>
              <ul className="space-y-2 text-sm">
                {crimeAndLawCats.map(cat => (
                  <li key={cat.id}>
                    <Link
                      to={`/category/${cat.slug}`}
                      onClick={onClose}
                      className="text-editorial-800 hover:text-crimson-800 font-medium block"
                    >
                      {getCategoryName(cat)}
                    </Link>
                  </li>
                ))}
                <li className="pt-2 border-t border-editorial-100"></li>
                {businessSportsCats.map(cat => (
                  <li key={cat.id}>
                    <Link
                      to={`/category/${cat.slug}`}
                      onClick={onClose}
                      className="text-editorial-800 hover:text-crimson-800 block"
                    >
                      {getCategoryName(cat)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Editorial & Opinion */}
            <div>
              <h3 className="font-serif font-bold text-sm text-crimson-900 border-b border-crimson-200 pb-1.5 mb-3">
                संपादकीय एवं विचार
              </h3>
              <ul className="space-y-2 text-sm">
                {editorialCats.map(cat => (
                  <li key={cat.id}>
                    <Link
                      to={`/category/${cat.slug}`}
                      onClick={onClose}
                      className="text-editorial-800 hover:text-crimson-800 block"
                    >
                      {getCategoryName(cat)}
                    </Link>
                  </li>
                ))}
                <li className="pt-2 border-t border-editorial-100">
                  <Link
                    to="/author/arun-ramakant-tiwari"
                    onClick={onClose}
                    className="text-xs font-semibold text-crimson-800 hover:underline block"
                  >
                    प्रधान संपादक अरुण रमाकांत तिवारी के आलेख →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 5: Supplements & Special Features */}
            <div>
              <h3 className="font-serif font-bold text-sm text-crimson-900 border-b border-crimson-200 pb-1.5 mb-3">
                परिशिष्ट एवं विशेष
              </h3>
              <ul className="space-y-1.5 text-xs text-editorial-700">
                {specialCats.map(cat => (
                  <li key={cat.id}>
                    <Link
                      to={`/category/${cat.slug}`}
                      onClick={onClose}
                      className="hover:text-crimson-800 hover:underline block py-0.5"
                    >
                      {getCategoryName(cat)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Latest Headlines Preview + E-paper quick banner */}
          <div className="pt-4 border-t border-editorial-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-paper-subtle p-4 rounded-b-md">
            <div className="flex-1">
              <span className="text-[11px] font-bold text-editorial-500 uppercase tracking-wider block mb-1">
                ताज़ा मुख्य समाचार (Latest Dispatches)
              </span>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-editorial-900">
                {recentArticles.slice(0, 3).map(art => (
                  <Link
                    key={art.id}
                    to={`/article/${art.slug}`}
                    onClick={onClose}
                    className="hover:text-crimson-800 hover:underline line-clamp-1 max-w-xs"
                  >
                    • {art.headline}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/epaper"
              onClick={onClose}
              className="inline-flex items-center gap-2 bg-crimson-800 hover:bg-crimson-900 text-white font-bold text-xs px-4 py-2 rounded shadow transition-all whitespace-nowrap"
            >
              <Newspaper className="w-4 h-4" />
              <span>{t('readEpaper')} (PDF)</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
