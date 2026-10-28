import React, { useEffect, useState } from 'react';
import { repository } from '@/lib/repository';
import { CMSPage, SupportedLanguage } from '@/types/database';
import { FileText, Edit2, Save, CheckCircle2, X, ExternalLink } from 'lucide-react';

export const AdminPagesManager: React.FC = () => {
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<CMSPage | null>(null);
  const [activeLang, setActiveLang] = useState<SupportedLanguage>('hi');
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    const data = await repository.getAllPages();
    setPages(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;

    try {
      await repository.savePage(editingPage);
      showToast('पृष्ठ सामग्री यशस्वीपणे सेव्ह झाली!');
      setEditingPage(null);
      loadData();
    } catch {
      alert('पृष्ठ सेव्ह करताना त्रुटी आली.');
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-red" />
            डायनामिक पृष्ठे व्यवस्थापन (CMS Dynamic Pages)
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            आमच्याबद्दल, तक्रार निवारण अधिकारी (IT Rules 2021) आणि कायदेशीर धोरणे संपादित करा.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Pages List */}
      {isLoading ? (
        <div className="py-12 text-center text-gray-500 text-sm">लोड होत आहे...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pages.map(page => (
            <div
              key={page.slug}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-bold">
                    /{page.slug}
                  </span>
                  <a
                    href={`/page/${page.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-red hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>पहा</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <h3 className="font-bold text-base text-gray-900 font-serif">
                  {page.title_hi || page.title_mr || page.title_en}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 font-serif">
                  {page.meta_description || 'कोणतेही वर्णन नाही'}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400 font-mono text-[11px]">
                  अद्यतन: {new Date(page.updated_at).toLocaleDateString('hi-IN')}
                </span>

                <button
                  type="button"
                  onClick={() => setEditingPage(page)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-brand-red" />
                  <span>संपादित करा</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingPage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-gray-900 font-serif">
                  पृष्ठ संपादित करा: /{editingPage.slug}
                </h3>
                <p className="text-xs text-gray-500">
                  मल्टीलिंग्युअल शीर्षक व HTML मजकूर अद्ययावत करा.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language Switcher Tabs */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg text-xs font-bold w-fit">
              <button
                type="button"
                onClick={() => setActiveLang('hi')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeLang === 'hi' ? 'bg-white text-brand-red shadow-xs' : 'text-gray-600'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setActiveLang('mr')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeLang === 'mr' ? 'bg-white text-brand-red shadow-xs' : 'text-gray-600'
                }`}
              >
                मराठी
              </button>
              <button
                type="button"
                onClick={() => setActiveLang('en')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeLang === 'en' ? 'bg-white text-brand-red shadow-xs' : 'text-gray-600'
                }`}
              >
                English
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  शीर्षक ({activeLang.toUpperCase()}) *
                </label>
                <input
                  type="text"
                  required
                  value={
                    activeLang === 'hi'
                      ? editingPage.title_hi
                      : activeLang === 'mr'
                      ? editingPage.title_mr
                      : editingPage.title_en
                  }
                  onChange={e => {
                    const val = e.target.value;
                    if (activeLang === 'hi') setEditingPage({ ...editingPage, title_hi: val });
                    else if (activeLang === 'mr') setEditingPage({ ...editingPage, title_mr: val });
                    else setEditingPage({ ...editingPage, title_en: val });
                  }}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  मजकूर / HTML Body ({activeLang.toUpperCase()}) *
                </label>
                <textarea
                  required
                  rows={12}
                  value={
                    activeLang === 'hi'
                      ? editingPage.body_hi
                      : activeLang === 'mr'
                      ? editingPage.body_mr
                      : editingPage.body_en
                  }
                  onChange={e => {
                    const val = e.target.value;
                    if (activeLang === 'hi') setEditingPage({ ...editingPage, body_hi: val });
                    else if (activeLang === 'mr') setEditingPage({ ...editingPage, body_mr: val });
                    else setEditingPage({ ...editingPage, body_en: val });
                  }}
                  className="w-full border border-gray-300 rounded-lg p-3 text-xs text-gray-900 font-mono leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  मेटा वर्णन (Meta Description for SEO)
                </label>
                <input
                  type="text"
                  value={editingPage.meta_description || ''}
                  onChange={e => setEditingPage({ ...editingPage, meta_description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditingPage(null)}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-red text-white font-bold rounded-lg hover:bg-brand-red-dark shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>सेव्ह करा</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
