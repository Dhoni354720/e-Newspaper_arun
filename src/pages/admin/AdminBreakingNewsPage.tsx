import React, { useEffect, useState } from 'react';
import { repository } from '@/lib/repository';
import { BreakingNewsItem, Article, SupportedLanguage } from '@/types/database';
import { Flame, Plus, Trash2, CheckCircle2, Eye, ToggleLeft, ToggleRight, X } from 'lucide-react';

export const AdminBreakingNewsPage: React.FC = () => {
  const [items, setItems] = useState<BreakingNewsItem[]>([]);
  const [publishedArticles, setPublishedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [selectedArticleId, setSelectedArticleId] = useState('');
  const [customHeadline, setCustomHeadline] = useState('');
  const [language, setLanguage] = useState<SupportedLanguage>('mr');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    const [breakingItems, articlesRes] = await Promise.all([
      repository.getAllBreakingNewsAdmin(),
      repository.getArticles({ status: 'published', limit: 100, includePrivate: false }),
    ]);

    setItems(breakingItems);
    setPublishedArticles(articlesRes.articles);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticleId && !customHeadline.trim()) {
      alert('कृपया संबंधित प्रकाशित बातमी निवडा किंवा थेट मथळा (Headline) प्रविष्ट करा.');
      return;
    }

    try {
      const headlineToSave = customHeadline.trim() || 
        (selectedArticleId ? publishedArticles.find(a => a.id === selectedArticleId)?.headline : '');

      await repository.saveBreakingNewsItem({
        article_id: selectedArticleId || undefined,
        language,
        custom_headline: headlineToSave || undefined,
        display_order: displayOrder,
        is_active: isActive,
      });

      setFeedback('ब्रेकिंग न्यूज तिकर यशस्वीरीत्या जोडले!');
      setTimeout(() => setFeedback(null), 3000);
      setModalOpen(false);
      setSelectedArticleId('');
      setCustomHeadline('');
      loadData();
    } catch {
      alert('ब्रेकिंग न्यूज सेव्ह करताना त्रुटी आली.');
    }
  };

  const handleToggleActive = async (item: BreakingNewsItem) => {
    await repository.saveBreakingNewsItem({
      id: item.id,
      is_active: !item.is_active,
    });
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('तुम्हाला खात्री आहे का?')) {
      await repository.deleteBreakingNewsItem(id);
      loadData();
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif flex items-center gap-2">
            <Flame className="w-6 h-6 text-crimson-800" />
            ब्रेकिंग न्यूज व्यवस्थापन (Breaking News Strip)
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            मुख्य पानावरील लाल ब्रेकिंग न्यूज तिकरच्या बातम्या आणि प्राधान्यक्रम व्यवस्थापित करा.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setDisplayOrder(items.length + 1);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-crimson-800 hover:bg-crimson-900 text-white font-bold text-xs rounded-lg shadow-sm transition-colors uppercase tracking-wider self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          नवीन ब्रेकिंग बातमी जोडा
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Live Ticker Preview */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-crimson-800" />
          थेट तिकर पूर्वदृश्य (Live Strip Preview)
        </h3>
        <div className="bg-crimson-800 text-white text-xs py-2 px-3 rounded flex items-center gap-3">
          <span className="bg-white text-crimson-900 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
            BREAKING
          </span>
          <span className="truncate flex-1">
            {items.find((i) => i.is_active)?.custom_headline ||
              items.find((i) => i.is_active)?.article?.headline ||
              'सध्या कोणतीही ब्रेकिंग बातमी सक्रिय नाही.'}
          </span>
        </div>
      </div>

      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900">
                नवीन ब्रेकिंग बातमी जोडा
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  संबंधित बातमी (पर्यायी / Optional)
                </label>
                <select
                  value={selectedArticleId}
                  onChange={(e) => {
                    setSelectedArticleId(e.target.value);
                    const found = publishedArticles.find((a) => a.id === e.target.value);
                    if (found && !customHeadline) {
                      setCustomHeadline(found.headline);
                      setLanguage(found.language);
                    }
                  }}
                  className="w-full py-2 px-3 border rounded text-xs text-gray-800"
                >
                  <option value="">-- थेट स्वतंत्र मथळा (Standalone Flash Headline) --</option>
                  {publishedArticles.map((art) => (
                    <option key={art.id} value={art.id}>
                      [{art.language.toUpperCase()}] {art.headline}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-gray-500 mt-1 block">
                  बातमी निवडल्यास वाचक त्यावर क्लिक करून संपूर्ण बातमी वाचू शकतील. निवड न केल्यास केवळ फ्लॅश मथळा दिसेल.
                </span>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  {selectedArticleId ? 'तिकरवरील मथळा (Custom Headline - ऐच्छिक)' : 'थेट ब्रेकिंग मथळा (Breaking Headline) *'}
                </label>
                <input
                  type="text"
                  required={!selectedArticleId}
                  value={customHeadline}
                  onChange={(e) => setCustomHeadline(e.target.value)}
                  placeholder={selectedArticleId ? 'मूळ मथळा वापरा किंवा येथे संक्षिप्त रूप द्या' : 'येथे थेट ब्रेकिंग मथळा टाईप करा...'}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">भाषा *</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                    className="w-full py-2 px-3 border rounded text-xs"
                  >
                    <option value="mr">मराठी (MR)</option>
                    <option value="hi">हिन्दी (HI)</option>
                    <option value="en">English (EN)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">क्रमवारी (Order)</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded text-gray-600 font-semibold"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-crimson-800 text-white rounded font-bold hover:bg-crimson-900"
                >
                  जोडा
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Items Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-[11px] tracking-wider border-b border-gray-200">
            <tr>
              <th className="py-3 px-4">क्रम</th>
              <th className="py-3 px-4">मथळा</th>
              <th className="py-3 px-4">प्रकार</th>
              <th className="py-3 px-4">भाषा</th>
              <th className="py-3 px-4">सक्रिय (Active)</th>
              <th className="py-3 px-4 text-right">कृती</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-gray-500">{item.display_order}</td>
                <td className="py-3 px-4 font-medium text-gray-900 max-w-md">
                  {item.custom_headline || item.article?.headline || '—'}
                </td>
                <td className="py-3 px-4">
                  {item.article_id ? (
                    <span className="inline-flex items-center text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200">
                      संलग्न बातमी
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
                      थेट फ्लॅश
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 font-mono uppercase text-xs font-semibold text-gray-600">
                  {item.language}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleToggleActive(item)}
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${
                      item.is_active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-gray-100 text-gray-500 border-gray-300'
                    }`}
                  >
                    {item.is_active ? 'सक्रिय (Live)' : 'बंद (Off)'}
                  </button>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-gray-400 hover:text-red-700 rounded"
                    title="काढून टाका"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
