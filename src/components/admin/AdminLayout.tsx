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

export const AdminLayout: React.FC = () => {
  const { user, isLoading, isStaff, logout } = useAuth();
  const { publicationName } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If still loading auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-crimson-800 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium text-gray-600">प्रशासक सत्र तपासत आहे...</p>
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
    { label: 'डॅशबोर्ड (Overview)', href: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'सर्व बातम्या (Articles)', href: '/admin/articles', icon: FileText, exact: true },
    { label: 'नवीन बातमी (Write New)', href: '/admin/articles/new', icon: PlusCircle },
    { label: 'ई-वृत्तपत्र (E-Paper)', href: '/admin/epaper', icon: Newspaper },
    { label: 'विभाग व्यवस्थापन (Categories)', href: '/admin/categories', icon: Layers },
    { label: 'होमपेज ब्लॉक्स (Home Blocks)', href: '/admin/home-blocks', icon: Sparkles },
    { label: 'फटाफट बातम्या (Flash News)', href: '/admin/flash', icon: Zap },
    { label: 'दैनिक राशीभविष्य (Horoscope)', href: '/admin/rashifal', icon: Sun },
    { label: 'फोटो गॅलरी (Galleries)', href: '/admin/galleries', icon: Camera },
    { label: 'व्हिडिओ बातमी (Videos)', href: '/admin/videos', icon: Video },
    { label: 'नागरिक पत्रकारिता (News Tips)', href: '/admin/news-tips', icon: Send },
    { label: 'डायनामिक पृष्ठे (Pages)', href: '/admin/pages', icon: Files },
    { label: 'ब्रेकिंग न्यूज (Breaking News)', href: '/admin/breaking-news', icon: Flame },
    { label: 'मीडिया लायब्ररी (Media)', href: '/admin/media', icon: ImageIcon },
    { label: 'संपादकीय सेटिंग्ज (Settings)', href: '/admin/settings', icon: Settings },
    { label: 'माझे खाते (Account)', href: '/admin/account', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row text-editorial-900 font-sans">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-editorial-950 text-white p-4 flex items-center justify-between border-b border-editorial-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="font-masthead font-bold text-lg text-white">{publicationName}</span>
          <span className="text-[10px] bg-crimson-800 text-white px-2 py-0.5 rounded font-mono">CMS</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-gray-300 hover:text-white"
          aria-label="Toggle admin sidebar"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-editorial-950 text-gray-300 flex flex-col justify-between transition-transform transform md:translate-x-0 md:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Masthead Header in Sidebar */}
          <div className="p-6 border-b border-editorial-800 flex items-center justify-between">
            <div>
              <Link to="/admin" className="block">
                <span className="font-masthead text-xl font-black text-white tracking-tight">
                  {publicationName}
                </span>
                <span className="block text-[11px] text-crimson-400 font-medium tracking-wide">
                  संपादकीय कक्ष (Editorial CMS)
                </span>
              </Link>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
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
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: User profile & Logout */}
        <div className="p-4 border-t border-editorial-800 space-y-3">
          {/* Public site link */}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-3 py-2 bg-editorial-900 hover:bg-editorial-800 text-xs text-gray-300 hover:text-white rounded transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-crimson-400" />
              वेबसाईट उघडा (View Site)
            </span>
          </Link>

          {/* User profile card */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-crimson-900 border border-crimson-700 flex items-center justify-center text-white text-xs font-bold">
                {(user.display_name || user.role || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.display_name || 'Admin'}</p>
                <p className="text-[10px] text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-gray-400 hover:text-red-400 rounded transition-colors"
              title="लॉग आऊट (Sign out)"
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
