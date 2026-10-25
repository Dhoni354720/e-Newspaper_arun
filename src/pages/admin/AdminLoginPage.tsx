import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { isSupabaseConfigured } from '@/lib/supabase';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft, Database, CheckCircle2 } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login, isStaff } = useAuth();
  const { publicationName } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('admin@janvaninews.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: string })?.from || '/admin';

  // If already logged in as staff
  if (isStaff) {
    navigate('/admin', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error || 'लॉगिन अयशस्वी झाले. कृपया माहिती तपासा.');
    }
  };

  const hasLiveSupabase = isSupabaseConfigured();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-crimson-800 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <span className="font-masthead text-3xl font-black text-white tracking-tight">
              {publicationName}
            </span>
          </Link>
          <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-crimson-400 font-semibold tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4" />
            संपादकीय कक्ष लॉगिन (CMS Access)
          </div>
        </div>

        {/* Database Status Pill */}
        <div className="mt-4 flex items-center justify-center">
          {hasLiveSupabase ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-emerald-950 border border-emerald-700 text-emerald-300">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              Live Supabase Database Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-amber-950/80 border border-amber-700 text-amber-300">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              Resilient Local Mode (Ready for Supabase credentials)
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-6 shadow-xl rounded-xl sm:px-10 border border-gray-700">
          {error && (
            <div className="mb-4 p-3 bg-red-900/40 border border-red-700 text-red-200 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                प्रशासक ईमेल (Admin Email)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@janvaninews.com"
                  className="w-full pl-9 pr-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-crimson-700 focus:border-crimson-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                पासवर्ड (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-crimson-700 focus:border-crimson-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-crimson-800 hover:bg-crimson-900 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md uppercase tracking-wider"
            >
              {isSubmitting ? 'तपासत आहे...' : 'संपादकीय कक्षात प्रवेश करा'}
            </button>
          </form>

          {/* Quick Demo Credentials Info Box */}
          <div className="mt-6 pt-5 border-t border-gray-700 text-xs text-gray-400 space-y-2">
            <p className="font-semibold text-gray-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-crimson-400" />
              प्रात्यक्षिक प्रशासक खात्याची माहिती (Demo Login):
            </p>
            <div className="bg-gray-900/80 p-2.5 rounded border border-gray-700 font-mono text-[11px] text-gray-300 space-y-1">
              <div>ईमेल: <span className="text-amber-300">admin@janvaninews.com</span></div>
              <div>पासवर्ड: <span className="text-amber-300">admin123</span></div>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              लॉगिन केल्यानंतर आपण बातम्या लिहू शकता, मसुदे सेव्ह करू शकता, प्रतिमा अपलोड करू शकता आणि बातम्या थेट प्रकाशित करू शकता.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            मुख्य वृत्तपत्राकडे परत जा (Return to Website)
          </Link>
        </div>
      </div>
    </div>
  );
};
