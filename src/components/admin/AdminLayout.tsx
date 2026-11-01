import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Layers, 
  Flame, 
  Newspaper,
  Image as ImageIcon, 
  Settings, 
  User, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X,
  ShieldAlert,
  Sparkles,
  Zap,
  Sun,
  Send,
  Camera,
  Video,
  Files
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { useLanguage } from '@/context/LanguageContext';
import { SupportedLanguage } from '@/types/database';

const ADMIN_NAV_LABELS: Record<SupportedLanguage, Record<string, string>> = {
  mr: {
    dashboard: 'डॅशबोर्ड (Overview)',
    articles: 'सर्व बातम्या (Articles)',
    writeNew: 'नवीन बातमी (Write New)',
    epaper: 'ई-वृत्तपत्र (E-Paper)',
    categories: 'विभाग व्यवस्थापन (Categories)',
    homeBlocks: 'होमपेज ब्लॉक्स (Home Blocks)',
    flashNews: 'फटाफट बातम्या (Flash News)',
    horoscope: 'दैनिक राशीभविष्य (Horoscope)',
    galleries: 'फोटो गॅलरी (Galleries)',
    videos: 'व्हिडिओ बातमी (Videos)',
    newsTips: 'नागरिक पत्रकारिता (News Tips)',
    pages: 'डायनामिक पृष्ठे (Pages)',
    breakingNews: 'ब्रेकिंग न्यूज (Breaking News)',
    media: 'मीडिया लायब्ररी (Media)',
    settings: 'संपादकीय सेटिंग्ज (Settings)',
    account: 'माझे खाते (Account)',
    editorialRoom: 'संपादकीय कक्ष (Editorial CMS)',
    viewSite: 'वेबसाईट उघडा (View Site)',
    signOut: 'लॉग आऊट',
    checkingAuth: 'प्रशासक सत्र तपासत आहे...',
  },
  hi: {
    dashboard: 'डैशबोर्ड (Overview)',
    articles: 'सभी समाचार (Articles)',
    writeNew: 'नया समाचार (Write New)',
    epaper: 'ई-समाचार पत्र (E-Paper)',
    categories: 'श्रेणी प्रबंधन (Categories)',
    homeBlocks: 'होमपेज ब्लॉक्स (Home Blocks)',
    flashNews: 'फटाफट खबरें (Flash News)',
    horoscope: 'दैनिक राशिफल (Horoscope)',
    galleries: 'फोटो गैलरी (Galleries)',
    videos: 'वीडियो समाचार (Videos)',
    newsTips: 'नागरिक पत्रकारिता (News Tips)',
    pages: 'डायनामिक पेज (Pages)',
    breakingNews: 'ब्रेकिंग न्यूज़ (Breaking News)',
    media: 'मीडिया लाइब्रेरी (Media)',
    settings: 'संपादकीय सेटिंग्स (Settings)',
    account: 'मेरा खाता (Account)',
    editorialRoom: 'संपादकीय कक्ष (Editorial CMS)',
    viewSite: 'वेबसाइट देखें (View Site)',
    signOut: 'लॉग आउट',
    checkingAuth: 'व्यवस्थापक सत्र जांचा जा रहा है...',
  },
  en: {
    dashboard: 'Dashboard (Overview)',
    articles: 'All Articles',
    writeNew: 'Write New Article',
    epaper: 'E-Paper Management',
    categories: 'Categories Manager',
    homeBlocks: 'Homepage Blocks',
    flashNews: 'Flash News Ticker',
    horoscope: 'Daily Horoscope (Rashifal)',
    galleries: 'Photo Galleries',
    videos: 'Video News Hub',
    newsTips: 'Citizen News Tips',
    pages: 'Dynamic Pages',
    breakingNews: 'Breaking News Alerts',
    media: 'Media Asset Library',
    settings: 'Editorial Site Settings',
    account: 'My Account & Profile',
    editorialRoom: 'Editorial CMS Desk',
    viewSite: 'View Live Site',
    signOut: 'Sign Out',
    checkingAuth: 'Verifying Admin Session...',
  },
};

export const AdminLayout: React.FC = () => {
  const { user, isLoading, isStaff, logout } = useAuth();
  const { publicationName } = useSettings();
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const labels = ADMIN_NAV_LABELS[language] || ADMIN_NAV_LABELS.hi;

  // If still loading auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-crimson-800 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium text-gray-600">{labels.checkingAuth}</p>
        </div>
      </div>
    );
  }

  // Enforce server/auth guard: If user not authenticated or not authorized staff, redirect to login
  if (!isStaff || !user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: labels.dashboard, href: '/admin', icon: LayoutDashboard, exact: true },
    { label: labels.articles, href: '/admin/articles', icon: FileText, exact: true },
    { label: labels.writeNew, href: '/admin/articles/new', icon: PlusCircle },
    { label: labels.epaper, href: '/admin/epaper', icon: Newspaper },
    { label: labels.categories, href: '/admin/categories', icon: Layers },
    { label: labels.homeBlocks, href: '/admin/home-blocks', icon: Sparkles },
    { label: labels.flashNews, href: '/admin/flash', icon: Zap },
    { label: labels.horoscope, href: '/admin/rashifal', icon: Sun },
    { label: labels.galleries, href: '/admin/galleries', icon: Camera },
    { label: labels.videos, href: '/admin/videos', icon: Video },
    { label: labels.newsTips, href: '/admin/news-tips', icon: Send },
    { label: labels.pages, href: '/admin/pages', icon: Files },
    { label: labels.breakingNews, href: '/admin/breaking-news', icon: Flame },
    { label: labels.media, href: '/admin/media', icon: ImageIcon },
    { label: labels.settings, href: '/admin/settings', icon: Settings },
    { label: labels.account, href: '/admin/account', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row text-editorial-900 font-sans">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-editorial-950 text-white p-3 flex items-center justify-between border-b border-editorial-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="font-masthead font-bold text-base text-white">{publicationName}</span>
          <span className="text-[10px] bg-crimson-800 text-white px-1.5 py-0.5 rounded font-mono">CMS</span>
        </div>

        {/* Mobile Language Switcher */}
        <div className="flex items-center gap-1 bg-editorial-900 rounded-lg p-0.5 border border-editorial-700 text-[11px]">
          {(['hi', 'mr', 'en'] as SupportedLanguage[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-2 py-0.5 rounded transition-all font-semibold ${
                language === lang
                  ? 'bg-crimson-800 text-white shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {lang === 'hi' ? 'हिन्दी' : lang === 'mr' ? 'मराठी' : 'EN'}
            </button>
          ))}
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-gray-300 hover:text-white"
          aria-label="Toggle admin sidebar"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-editorial-950 text-gray-300 flex flex-col h-full md:h-screen md:sticky md:top-0 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Masthead Header in Sidebar */}
        <div className="p-4 border-b border-editorial-800 flex items-center justify-between shrink-0">
          <div>
            <Link to="/admin" onClick={() => setSidebarOpen(false)} className="block">
              <span className="font-masthead text-lg font-black text-white tracking-tight">
                {publicationName}
              </span>
              <span className="block text-[11px] text-crimson-400 font-medium tracking-wide">
                {labels.editorialRoom}
              </span>
            </Link>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-editorial-900 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trilingual Language Selector (Hindi / Marathi / English) */}
        <div className="px-4 py-2.5 border-b border-editorial-800 bg-editorial-900/60">
          <div className="flex items-center justify-between text-xs mb-1.5 text-gray-400 font-medium">
            <span>प्रशासकीय भाषा (CMS Language):</span>
          </div>
          <div className="grid grid-cols-3 gap-1 bg-editorial-950 p-1 rounded-lg border border-editorial-800">
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`py-1 text-xs rounded font-medium transition-all text-center ${
                language === 'hi'
                  ? 'bg-crimson-800 text-white font-bold shadow-xs'
                  : 'text-gray-400 hover:text-white hover:bg-editorial-900'
              }`}
            >
              हिन्दी (HI)
            </button>
            <button
              type="button"
              onClick={() => setLanguage('mr')}
              className={`py-1 text-xs rounded font-medium transition-all text-center ${
                language === 'mr'
                  ? 'bg-crimson-800 text-white font-bold shadow-xs'
                  : 'text-gray-400 hover:text-white hover:bg-editorial-900'
              }`}
            >
              मराठी (MR)
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`py-1 text-xs rounded font-medium transition-all text-center ${
                language === 'en'
                  ? 'bg-crimson-800 text-white font-bold shadow-xs'
                  : 'text-gray-400 hover:text-white hover:bg-editorial-900'
              }`}
            >
              English (EN)
            </button>
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4">
          <nav className="space-y-1 pb-4">
            {navItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.href
                : location.pathname.startsWith(item.href);

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-crimson-800 text-white font-semibold shadow-xs'
                      : 'text-gray-400 hover:text-white hover:bg-editorial-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: User profile & Logout */}
        <div className="p-4 border-t border-editorial-800 space-y-3 shrink-0 bg-editorial-950">
          {/* Public site link */}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-3 py-2 bg-editorial-900 hover:bg-editorial-800 text-xs text-gray-300 hover:text-white rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-crimson-400" />
              {labels.viewSite}
            </span>
          </Link>

          {/* User profile card */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-crimson-900 border border-crimson-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {(user.display_name || user.role || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.display_name || 'Admin'}</p>
                <p className="text-[10px] text-gray-400 capitalize truncate">{user.role}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-editorial-900 transition-colors shrink-0"
              title={labels.signOut}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};
