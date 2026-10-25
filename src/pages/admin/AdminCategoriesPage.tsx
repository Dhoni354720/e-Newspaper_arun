import React, { useEffect, useState } from 'react';
import { repository } from '@/lib/repository';
import { generateSlug } from '@/lib/slug';
import { Category, SupportedLanguage } from '@/types/database';
import { Layers, Plus, Edit2, Check, X, CheckCircle2 } from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadCategories = async () => {
    setIsLoading(true);
    const data = await repository.getCategories();
    setCategories(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleStartCreate = () => {
    setEditingCategory({
      slug: '',
      sort_order: categories.length + 1,
      is_active: true,
      translations: {
        mr: { id: '', category_id: '', language: 'mr', name: '', description: '' },
        hi: { id: '', category_id: '', language: 'hi', name: '', description: '' },
        en: { id: '', category_id: '', language: 'en', name: '', description: '' },
      },
    });
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    const mrName = editingCategory.translations?.mr?.name || '';
    let finalSlug = editingCategory.slug?.trim() || generateSlug(mrName || 'category');

    try {
      await repository.saveCategory({
        ...editingCategory,
        slug: finalSlug,
      });

      setFeedback('विभाग माहिती यशस्वीपणे सेव्ह झाली!');
      setTimeout(() => setFeedback(null), 3000);
      setEditingCategory(null);
      loadCategories();
    } catch {
      alert('विभाग सेव्ह करताना त्रुटी आली.');
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">
            विभाग व्यवस्थापन (Categories & Multilingual Labels)
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            मराठी, हिंदी आणि इंग्रजी भाषेतील वृत्त विभाग व क्रमवारी व्यवस्थापित करा.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-crimson-800 hover:bg-crimson-900 text-white font-bold text-xs rounded-lg shadow-sm transition-colors uppercase tracking-wider self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          नवीन विभाग जोडा
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Edit / Create Form Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900 font-serif">
                {editingCategory.id ? 'विभाग संपादित करा' : 'नवीन विभाग तयार करा'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  URL Slug (इंग्रजी संक्षिप्त ओळख) *
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.slug || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  placeholder="उदा. maharashtra, politics, sports"
                  className="w-full px-3 py-2 border rounded font-mono text-gray-800"
                />
              </div>

              {/* Multilingual Names */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    मराठी नाव (Marathi) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCategory.translations?.mr?.name || ''}
                    onChange={(e) => {
                      const current = editingCategory.translations || {} as any;
                      setEditingCategory({
                        ...editingCategory,
                        translations: {
                          ...current,
                          mr: { ...current.mr, name: e.target.value, language: 'mr' },
                        },
                      });
                    }}
                    placeholder="उदा. महाराष्ट्र"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    हिंदी नाव (Hindi)
                  </label>
                  <input
                    type="text"
                    value={editingCategory.translations?.hi?.name || ''}
                    onChange={(e) => {
                      const current = editingCategory.translations || {} as any;
                      setEditingCategory({
                        ...editingCategory,
                        translations: {
                          ...current,
                          hi: { ...current.hi, name: e.target.value, language: 'hi' },
                        },
                      });
                    }}
                    placeholder="उदा. महाराष्ट्र"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    English Name
                  </label>
                  <input
                    type="text"
                    value={editingCategory.translations?.en?.name || ''}
                    onChange={(e) => {
                      const current = editingCategory.translations || {} as any;
                      setEditingCategory({
                        ...editingCategory,
                        translations: {
                          ...current,
                          en: { ...current.en, name: e.target.value, language: 'en' },
                        },
                      });
                    }}
                    placeholder="e.g. Maharashtra"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  क्रमवारी क्रमांक (Sort Order)
                </label>
                <input
                  type="number"
                  value={editingCategory.sort_order || 1}
                  onChange={(e) => setEditingCategory({ ...editingCategory, sort_order: parseInt(e.target.value, 10) })}
                  className="w-24 px-3 py-2 border rounded"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 font-semibold"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-crimson-800 text-white rounded font-bold hover:bg-crimson-900"
                >
                  सेव्ह करा (Save)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-[11px] tracking-wider border-b border-gray-200">
            <tr>
              <th className="py-3 px-4">क्रम</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4">मराठी</th>
              <th className="py-3 px-4">हिन्दी</th>
              <th className="py-3 px-4">English</th>
              <th className="py-3 px-4 text-right">कृती</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-gray-500">{cat.sort_order}</td>
                <td className="py-3 px-4 font-mono text-gray-800 font-semibold">{cat.slug}</td>
                <td className="py-3 px-4 font-bold text-gray-900">{cat.translations?.mr?.name || '—'}</td>
                <td className="py-3 px-4 text-gray-700">{cat.translations?.hi?.name || '—'}</td>
                <td className="py-3 px-4 text-gray-700">{cat.translations?.en?.name || '—'}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => setEditingCategory(cat)}
                    className="p-1.5 text-gray-600 hover:text-crimson-800 hover:bg-gray-100 rounded"
                    title="संपादित करा"
                  >
                    <Edit2 className="w-4 h-4" />
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
