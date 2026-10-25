import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Menu, 
  X, 
  Globe, 
  ShieldCheck, 
  Share2, 
  Facebook, 
  Twitter, 
  Youtube, 
  Send,
  Calendar,
  Sparkles,
  Newspaper
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';
import { useAuth } from '@/context/AuthContext';
import { getCurrentMastheadDate } from '@/lib/date';
import { repository } from '@/lib/repository';
import { Category, SupportedLanguage } from '@/types/database';

export const Header: React.FC = () => {
  const { language, setLanguage, t, getCategoryName } = useLanguage();
  const { settings, publicationName, tagline } = useSettings();
  const { isStaff } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    repository.getCategories().then(setCategories);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const currentDateFormatted = getCurrentMastheadDate(language);

  return (
    <header className="border-b border-paper-border bg-paper w-full text-editorial-900 select-none">
      {/* 1. Top Utility Bar: Date, Edition, Demo Notice, Social Links & Admin Entry */}
      <div className="bg-editorial-950 text-editorial-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Date & Edition */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-editorial-200 font-medium">
              <Calendar className="w-3.5 h-3.5 text-crimson-500" />
              {currentDateFormatted}
            </span>
            <span className="hidden sm:inline text-editorial-500">|</span>
            <span className="hidden sm:inline text-editorial-400">
              {t('regionalEdition')}
            </span>
          </div>

          {/* Right: Demo Tag, Social Links & Editorial Login */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="inline-flex items-center gap-1 bg-crimson-900/60 border border-crimson-700/50 text-crimson-200 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold">
              <Sparkles className="w-2.5 h-2.5" />
              Demo Publication
            </span>

            {/* Social Icons */}
            <div className="hidden md:flex items-center gap-2 border-l border-editorial-800 pl-3">
              {settings.social_links.twitter && (
                <a href={settings.social_links.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="Twitter / X">
                  <Twitter className="w-3.5 h-3.5" />
                </a>
              )}
              {settings.social_links.facebook && (
                <a href={settings.social_links.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="Facebook">
                  <Facebook className="w-3.5 h-3.5" />
                </a>
              )}
              {settings.social_links.youtube && (
                <a href={settings.social_links.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="YouTube">
                  <Youtube className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Admin CMS portal button */}
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 text-editorial-300 hover:text-white border-l border-editorial-800 pl-3 font-medium transition-colors"
              title={t('adminPortal')}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-crimson-400" />
              <span>{isStaff ? 'CMS Panel' : 'संपादकीय कक्ष'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Newspaper Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded text-editorial-800 hover:bg-paper-subtle transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Central Masthead Logo & Title */}
          <div className="flex-1 text-center">
            <Link to="/" className="inline-block group focus:outline-none">
              <h1 className="font-masthead text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-editorial-950 group-hover:text-crimson-800 transition-colors">
                {publicationName}
              </h1>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="h-[1px] w-6 sm:w-16 bg-crimson-800 hidden sm:inline-block"></span>
                <p className="text-xs sm:text-sm font-serif italic text-editorial-700 tracking-wide">
                  {tagline}
                </p>
                <span className="h-[1px] w-6 sm:w-16 bg-crimson-800 hidden sm:inline-block"></span>
              </div>
            </Link>
          </div>

          {/* Right Action Controls: Language Switcher & Search */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher: मराठी | हिन्दी | English */}
            <div className="hidden sm:flex items-center bg-paper-subtle border border-paper-border rounded-full p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setLanguage('mr')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  language === 'mr' 
                    ? 'bg-crimson-800 text-white shadow-sm font-semibold' 
                    : 'text-editorial-700 hover:text-editorial-950'
                }`}
              >
                मराठी
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  language === 'hi' 
                    ? 'bg-crimson-800 text-white shadow-sm font-semibold' 
                    : 'text-editorial-700 hover:text-editorial-950'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  language === 'en' 
                    ? 'bg-crimson-800 text-white shadow-sm font-semibold' 
                    : 'text-editorial-700 hover:text-editorial-950'
                }`}
              >
                English
              </button>
            </div>

            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 sm:p-2.5 rounded-full border border-paper-border hover:bg-paper-subtle text-editorial-800 transition-colors"
              aria-label="Search articles"
              title={t('searchButton')}
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Expandable Search Input Bar */}
        {searchOpen && (
          <form onSubmit={handleSearchSubmit} className="mt-4 pt-3 border-t border-paper-border transition-all">
            <div className="relative max-w-2xl mx-auto flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                autoFocus
                className="w-full pl-4 pr-24 py-2.5 bg-white border border-editorial-300 rounded shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-crimson-800 focus:border-crimson-800 text-editorial-900"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-4 py-1.5 bg-crimson-800 text-white text-xs font-semibold rounded hover:bg-crimson-900 transition-colors"
              >
                {t('searchButton')}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 3. Primary Editorial Navigation Bar (Sticky on Desktop) */}
      <nav className="border-t border-b border-editorial-900/10 bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Category Ribbon */}
            <div className="flex items-center overflow-x-auto no-scrollbar scroll-smooth py-1 gap-1 sm:gap-2 text-xs sm:text-sm font-medium tracking-wide">
              <Link
                to="/"
                className={`whitespace-nowrap px-3 py-2 rounded transition-colors ${
                  location.pathname === '/' 
                    ? 'text-crimson-800 font-bold border-b-2 border-crimson-800' 
                    : 'text-editorial-800 hover:text-crimson-800'
                }`}
              >
                {t('allNews')}
              </Link>
              <Link
                to="/epaper"
                className={`whitespace-nowrap px-3 py-1.5 rounded-full font-bold transition-all inline-flex items-center gap-1.5 ml-1 ${
                  location.pathname === '/epaper'
                    ? 'bg-crimson-800 text-white shadow-sm'
                    : 'bg-crimson-50 text-crimson-800 border border-crimson-200 hover:bg-crimson-800 hover:text-white'
                }`}
              >
                <Newspaper className="w-3.5 h-3.5" />
                <span>{t('epaper')}</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-crimson-600"></span>
                </span>
              </Link>
              {categories.map((cat) => {
                const isActive = location.pathname === `/category/${cat.slug}`;
                return (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className={`whitespace-nowrap px-3 py-2 rounded transition-colors ${
                      isActive 
                        ? 'text-crimson-800 font-bold border-b-2 border-crimson-800' 
                        : 'text-editorial-800 hover:text-crimson-800'
                    }`}
                  >
                    {getCategoryName(cat)}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Language Switcher Quick Pill */}
            <div className="flex sm:hidden items-center ml-2 border-l border-paper-border pl-2">
              <button
                onClick={() => {
                  const nextLang: SupportedLanguage = language === 'mr' ? 'hi' : language === 'hi' ? 'en' : 'mr';
                  setLanguage(nextLang);
                }}
                className="text-xs font-bold text-crimson-800 bg-paper-subtle px-2 py-1 rounded"
              >
                {language.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 4. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
          <div className="bg-paper w-4/5 max-w-sm h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-paper-border">
                <span className="font-masthead font-bold text-xl text-editorial-950">{publicationName}</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-editorial-700 hover:text-editorial-950"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Language switcher in mobile drawer */}
              <div className="mt-4 pt-2">
                <label className="text-xs font-semibold text-editorial-500 uppercase tracking-wider block mb-2">
                  भाषा निवडा / Choose Language
                </label>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-medium">
                  <button
                    onClick={() => setLanguage('mr')}
                    className={`py-2 rounded border ${language === 'mr' ? 'bg-crimson-800 text-white border-crimson-800' : 'bg-white border-paper-border'}`}
                  >
                    मराठी
                  </button>
                  <button
                    onClick={() => setLanguage('hi')}
                    className={`py-2 rounded border ${language === 'hi' ? 'bg-crimson-800 text-white border-crimson-800' : 'bg-white border-paper-border'}`}
                  >
                    हिन्दी
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`py-2 rounded border ${language === 'en' ? 'bg-crimson-800 text-white border-crimson-800' : 'bg-white border-paper-border'}`}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* Categories list */}
              <div className="mt-6">
                <span className="text-xs font-semibold text-editorial-500 uppercase tracking-wider block mb-2">
                  {t('categories')}
                </span>
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/"
                      className="block px-3 py-2 rounded text-sm text-editorial-900 hover:bg-paper-subtle font-medium"
                    >
                      {t('allNews')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/epaper"
                      className="flex items-center gap-2 px-3 py-2 rounded text-sm text-crimson-800 bg-crimson-50 font-bold border border-crimson-200"
                    >
                      <Newspaper className="w-4 h-4" />
                      <span>{t('epaper')}</span>
                    </Link>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        to={`/category/${cat.slug}`}
                        className="block px-3 py-2 rounded text-sm text-editorial-900 hover:bg-paper-subtle font-medium"
                      >
                        {getCategoryName(cat)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Drawer Actions */}
            <div className="pt-6 border-t border-paper-border mt-6 space-y-3">
              <Link
                to="/admin"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-editorial-950 text-white text-xs font-semibold rounded hover:bg-editorial-900 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-crimson-500" />
                {t('adminPortal')}
              </Link>
              <p className="text-[11px] text-editorial-500 text-center">
                © {new Date().getFullYear()} {publicationName}
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
