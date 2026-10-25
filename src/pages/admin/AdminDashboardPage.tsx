import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { repository } from '@/lib/repository';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { formatNewsDate } from '@/lib/date';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Article } from '@/types/database';
import { 
  FileText, 
  FileEdit, 
  Clock, 
  Flame, 
  PlusCircle, 
  Image as ImageIcon, 
  Layers, 
  ExternalLink,
  TrendingUp,
  ArrowRight,
  Database
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { publicationName } = useSettings();

  const [stats, setStats] = useState({
    publishedCount: 0,
    draftsCount: 0,
    scheduledCount: 0,
    breakingCount: 0,
    totalCategories: 0,
    recentActivity: [] as Article[],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    repository.getDashboardStats().then((data) => {
      if (isMounted) {
        setStats(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">
            संपादकीय डॅशबोर्ड (Editorial Dashboard)
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            स्वागत आहे, <strong className="text-gray-900">{user?.display_name}</strong>. {publicationName} चे रिअल-टाइम प्रकाशन आकडेवारी.
          </p>
        </div>

        {/* Quick Write Button */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin/articles/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-crimson-800 hover:bg-crimson-900 text-white font-bold text-xs rounded-lg shadow-sm transition-colors uppercase tracking-wider"
          >
            <PlusCircle className="w-4 h-4" />
            नवीन बातमी लिहा
          </Link>
          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-crimson-800" />
            संकेतस्थळ पहा
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Published */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              प्रकाशित बातम्या (Published)
            </p>
            <h3 className="text-3xl font-black text-gray-900 mt-1 font-mono">
              {stats.publishedCount}
            </h3>
            <Link to="/admin/articles?status=published" className="text-xs text-crimson-800 font-semibold hover:underline mt-2 inline-block">
              यादी पहा →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Drafts */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              अप्रकाशित मसुदे (Drafts)
            </p>
            <h3 className="text-3xl font-black text-amber-600 mt-1 font-mono">
              {stats.draftsCount}
            </h3>
            <Link to="/admin/articles?status=draft" className="text-xs text-amber-700 font-semibold hover:underline mt-2 inline-block">
              मसुदे संपादित करा →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <FileEdit className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Scheduled */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              नियोजित बातम्या (Scheduled)
            </p>
            <h3 className="text-3xl font-black text-blue-600 mt-1 font-mono">
              {stats.scheduledCount}
            </h3>
            <Link to="/admin/articles?status=scheduled" className="text-xs text-blue-700 font-semibold hover:underline mt-2 inline-block">
              नियोजन तपासा →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Breaking News */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              सक्रिय ब्रेकिंग (Breaking Items)
            </p>
            <h3 className="text-3xl font-black text-crimson-800 mt-1 font-mono">
              {stats.breakingCount}
            </h3>
            <Link to="/admin/breaking-news" className="text-xs text-crimson-800 font-semibold hover:underline mt-2 inline-block">
              तिकर व्यवस्थापन →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-crimson-800">
            <Flame className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Actions Ribbon */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
          त्वरित संपादकीय कृती (Quick Actions)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/admin/articles/new"
            className="p-4 rounded-lg border border-gray-200 hover:border-crimson-800 hover:bg-paper-subtle transition-all text-center group"
          >
            <PlusCircle className="w-6 h-6 text-crimson-800 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-gray-900 block">नवीन बातमी लिहा</span>
            <span className="text-[11px] text-gray-500 mt-0.5 block">Create New Article</span>
          </Link>

          <Link
            to="/admin/breaking-news"
            className="p-4 rounded-lg border border-gray-200 hover:border-crimson-800 hover:bg-paper-subtle transition-all text-center group"
          >
            <Flame className="w-6 h-6 text-crimson-800 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-gray-900 block">ब्रेकिंग न्यूज व्यवस्थापन</span>
            <span className="text-[11px] text-gray-500 mt-0.5 block">Manage Breaking Ticker</span>
          </Link>

          <Link
            to="/admin/media"
            className="p-4 rounded-lg border border-gray-200 hover:border-crimson-800 hover:bg-paper-subtle transition-all text-center group"
          >
            <ImageIcon className="w-6 h-6 text-crimson-800 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-gray-900 block">मीडिया अपलोड</span>
            <span className="text-[11px] text-gray-500 mt-0.5 block">Upload Media Assets</span>
          </Link>

          <Link
            to="/admin/categories"
            className="p-4 rounded-lg border border-gray-200 hover:border-crimson-800 hover:bg-paper-subtle transition-all text-center group"
          >
            <Layers className="w-6 h-6 text-crimson-800 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-gray-900 block">विभाग व्यवस्थापन</span>
            <span className="text-[11px] text-gray-500 mt-0.5 block">Categories & Languages</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-serif font-bold text-lg text-gray-900">
            नुकत्याच अद्ययावत केलेल्या बातम्या (Recent Publishing Activity)
          </h2>
          <Link
            to="/admin/articles"
            className="text-xs font-bold text-crimson-800 hover:underline flex items-center gap-1"
          >
            सर्व बातम्या पहा <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats.recentActivity.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            कोणतीही बातमी अद्याप नोंदवलेली नाही.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-[11px] tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">मथळा (Headline)</th>
                  <th className="py-3 px-4">भाषा</th>
                  <th className="py-3 px-4">स्थिती (Status)</th>
                  <th className="py-3 px-4">अद्ययावत दिनांक</th>
                  <th className="py-3 px-4 text-right">कृती</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentActivity.map((art) => (
                  <tr key={art.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900 max-w-md">
                      <Link
                        to={`/admin/articles/${art.id}/edit`}
                        className="hover:text-crimson-800 hover:underline block truncate"
                        title={art.headline}
                      >
                        {art.headline}
                      </Link>
                      <span className="text-[11px] text-gray-400 block truncate font-mono">
                        /{art.slug}
                      </span>
                    </td>
                    <td className="py-3 px-4 uppercase font-semibold text-gray-600">
                      {art.language}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={art.status} scheduledAt={art.scheduled_at} />
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">
                      {formatNewsDate(art.updated_at, 'mr', { format: 'short', includeTime: true })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/admin/articles/${art.id}/edit`}
                        className="text-xs font-bold text-crimson-800 hover:underline"
                      >
                        संपादित करा
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
