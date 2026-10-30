import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { repository } from '@/lib/repository';
import { formatNewsDate } from '@/lib/date';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Article, Category, ArticleStatus, SupportedLanguage } from '@/types/database';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Edit3, 
  Copy, 
  Eye, 
  Trash2, 
  Globe, 
  ChevronLeft, 
  ChevronRight,
  Send,
  RotateCcw
} from 'lucide-react';

export const AdminArticlesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const statusFilter = (searchParams.get('status') as ArticleStatus | 'all') || 'all';
  const categoryFilter = searchParams.get('cat') || '';
  const langFilter = (searchParams.get('lang') as SupportedLanguage) || undefined;
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadArticles = async () => {
    setIsLoading(true);
    const [articlesRes, categoriesRes] = await Promise.all([
      repository.getArticles({
        status: statusFilter,
        categorySlug: categoryFilter || undefined,
        language: langFilter,
        search: searchQuery || undefined,
        page: pageParam,
        limit: 15,
        includePrivate: true,
      }),
      repository.getCategories(),
    ]);

    setArticles(articlesRes.articles);
    setTotal(articlesRes.total);
    setTotalPages(articlesRes.totalPages);
    setCategories(categoriesRes);
    setIsLoading(false);
  };

  useEffect(() => {
    loadArticles();
  }, [statusFilter, categoryFilter, langFilter, pageParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadArticles();
  };

  const updateParam = (key: string, val: string) => {
    const params = new URLSearchParams(searchParams);
    if (val && val !== 'all') {
      params.set(key, val);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleDuplicate = async (articleId: string) => {
    try {
      const duplicated = await repository.duplicateArticleAsDraft(articleId);
      setActionMessage(`बातमीची प्रत यशस्वीपणे तयार झाली (${duplicated.headline})`);
      setTimeout(() => setActionMessage(null), 3000);
      loadArticles();
    } catch {
      alert('प्रत तयार करण्यात त्रुटी आली.');
    }
  };

  const handleTogglePublish = async (article: Article) => {
    try {
      const newStatus: ArticleStatus = article.status === 'published' ? 'draft' : 'published';
      await repository.saveArticle({
        id: article.id,
        status: newStatus,
        published_at: newStatus === 'published' ? new Date().toISOString() : null,
      });
      setActionMessage(
        newStatus === 'published'
          ? 'बातमी यशस्वीरीत्या प्रकाशित झाली!'
          : 'बातमी अप्रकाशित करून मसुद्यात हलवली.'
      );
      setTimeout(() => setActionMessage(null), 3000);
      loadArticles();
    } catch {
      alert('स्थिती बदलण्यात त्रुटी आली.');
    }
  };

  const handleDelete = async (articleId: string, headline: string) => {
    if (window.confirm(`तुम्हाला खात्री आहे का की तुम्हाला "${headline}" ही बातमी कायमची काढून टाकायची आहे?`)) {
      await repository.deleteArticle(articleId);
      setActionMessage('बातमी यशस्वीरित्या हटवली.');
      setTimeout(() => setActionMessage(null), 3000);
      loadArticles();
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">
            सर्व बातम्यांचे व्यवस्थापन (Articles Management)
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            एकूण {total} बातम्या नोंदवलेल्या आहेत (मसुदे, नियोजित व प्रकाशित बातम्यांसह).
          </p>
        </div>

        <Link
          to="/admin/articles/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-crimson-800 hover:bg-crimson-900 text-white font-bold text-xs rounded-lg shadow-sm transition-colors uppercase tracking-wider self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          नवीन बातमी तयार करा
        </Link>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2 animate-fade-in">
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input (5 cols) */}
          <form onSubmit={handleSearchSubmit} className="md:col-span-5 relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="मथळा किंवा विषय शोधा..."
              className="w-full pl-9 pr-20 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-crimson-800 focus:border-crimson-800 focus:bg-white"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1 bg-gray-800 text-white text-xs rounded hover:bg-black"
            >
              शोधा
            </button>
          </form>

          {/* Status Filter (3 cols) */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => updateParam('status', e.target.value)}
              className="w-full py-2 px-3 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-crimson-800"
            >
              <option value="all">सर्व स्थिती (All Status)</option>
              <option value="published">प्रकाशित (Published)</option>
              <option value="submitted">पुनरावलोकन प्रलंबित (Submitted)</option>
              <option value="draft">मसुदा (Draft)</option>
              <option value="scheduled">नियोजित (Scheduled)</option>
              <option value="archived">संग्रहित (Archived)</option>
            </select>
          </div>

          {/* Category Filter (2 cols) */}
          <div className="md:col-span-2">
            <select
              value={categoryFilter}
              onChange={(e) => updateParam('cat', e.target.value)}
              className="w-full py-2 px-3 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-crimson-800"
            >
              <option value="">सर्व विभाग (All Categories)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.translations?.mr?.name || c.slug}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter (2 cols) */}
          <div className="md:col-span-2">
            <select
              value={langFilter || ''}
              onChange={(e) => updateParam('lang', e.target.value)}
              className="w-full py-2 px-3 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-crimson-800"
            >
              <option value="">सर्व भाषा (All Languages)</option>
              <option value="mr">मराठी (MR)</option>
              <option value="hi">हिन्दी (HI)</option>
              <option value="en">English (EN)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-16 text-center text-gray-500">
            <div className="w-8 h-8 border-4 border-crimson-800 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            बातम्यांची यादी लोड होत आहे...
          </div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            कोणतीही बातमी सापडली नाही. कृपया फिल्टर निकष बदला किंवा नवीन बातमी तयार करा.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-[11px] tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">बातमीचा मथळा (Headline)</th>
                  <th className="py-3 px-4">विभाग</th>
                  <th className="py-3 px-4">भाषा</th>
                  <th className="py-3 px-4">स्थिती</th>
                  <th className="py-3 px-4">प्रकाशन / अद्ययावत</th>
                  <th className="py-3 px-4 text-right">कृती (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {articles.map((art) => {
                  const cat = art.categories?.[0];
                  return (
                    <tr key={art.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-gray-900 max-w-sm">
                        <Link
                          to={`/admin/articles/${art.id}/edit`}
                          className="hover:text-crimson-800 hover:underline font-serif font-bold text-sm block line-clamp-2"
                        >
                          {art.headline}
                        </Link>
                        <span className="text-[11px] text-gray-400 font-mono block mt-0.5">
                          /{art.slug}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-gray-600">
                        {cat?.translations?.mr?.name || cat?.slug || '—'}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-xs uppercase text-gray-700">
                        {art.language}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={art.status} scheduledAt={art.scheduled_at} />
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-500 whitespace-nowrap">
                        {art.published_at
                          ? formatNewsDate(art.published_at, 'mr', { format: 'short', includeTime: false })
                          : formatNewsDate(art.updated_at, 'mr', { format: 'short', includeTime: false })}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Edit button */}
                          <Link
                            to={`/admin/articles/${art.id}/edit`}
                            className="p-1.5 text-gray-600 hover:text-crimson-800 hover:bg-gray-100 rounded transition-colors"
                            title="संपादित करा"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>

                          {/* Quick Publish / Unpublish */}
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(art)}
                            className="p-1.5 text-gray-600 hover:text-emerald-700 hover:bg-gray-100 rounded transition-colors"
                            title={art.status === 'published' ? 'अप्रकाशित करा (Unpublish to Draft)' : 'प्रकाशित करा (Publish Now)'}
                          >
                            {art.status === 'published' ? <RotateCcw className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                          </button>

                          {/* Duplicate as draft */}
                          <button
                            type="button"
                            onClick={() => handleDuplicate(art.id)}
                            className="p-1.5 text-gray-600 hover:text-blue-700 hover:bg-gray-100 rounded transition-colors"
                            title="प्रत मसुद्यात बनवा (Duplicate as Draft)"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Public Preview */}
                          <Link
                            to={`/article/${art.slug}`}
                            target="_blank"
                            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                            title="पूर्वदृश्य पहा (View Preview)"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(art.id, art.headline)}
                            className="p-1.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            title="कायमचे काढून टाका"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
            <span>
              एकूण {total} पैकी पृष्ठ {pageParam} (पान {pageParam} / {totalPages})
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateParam('page', (pageParam - 1).toString())}
                disabled={pageParam <= 1}
                className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => updateParam('page', (pageParam + 1).toString())}
                disabled={pageParam >= totalPages}
                className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
