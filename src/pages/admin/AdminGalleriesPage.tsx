import React, { useEffect, useState } from 'react';
import { repository } from '@/lib/repository';
import { Gallery } from '@/types/database';
import { Camera, Plus, Trash2, Edit2, CheckCircle2, X } from 'lucide-react';

export const AdminGalleriesPage: React.FC = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingGallery, setEditingGallery] = useState<Partial<Gallery> | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    const data = await repository.getGalleries();
    setGalleries(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleStartCreate = () => {
    setEditingGallery({
      title_hi: '',
      title_mr: '',
      title_en: '',
      cover_image_url: '',
      credit: '',
      is_published: true,
      images: [],
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGallery) return;

    try {
      await repository.saveGallery(editingGallery);
      showToast('फोटो गॅलरी यशस्वीरित्या सेव्ह झाली!');
      setEditingGallery(null);
      loadData();
    } catch {
      alert('गॅलरी सेव्ह करताना त्रुटी आली.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('ही फोटो गॅलरी हटवायची आहे का?')) return;
    await repository.deleteGallery(id);
    setGalleries(galleries.filter(g => g.id !== id));
    showToast('गॅलरी हटवली.');
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif flex items-center gap-2">
            <Camera className="w-6 h-6 text-brand-red" />
            फोटो गॅलरी व्यवस्थापन (Photo Galleries CMS)
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            वेबसाइटवरील फोटो गॅलरी तयार करा, संपादित करा आणि छायाचित्रे व्यवस्थापित करा.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red hover:bg-brand-red-dark text-white font-bold text-xs rounded-lg shadow-sm transition-colors uppercase tracking-wider self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          नवीन गॅलरी तयार करा
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {isLoading ? (
        <div className="py-12 text-center text-gray-500 text-sm">लोड होत आहे...</div>
      ) : galleries.length === 0 ? (
        <div className="py-12 text-center text-gray-400 text-xs">कोणतीही फोटो गॅलरी उपलब्ध नाही.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map(gallery => (
            <div
              key={gallery.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="aspect-16/10 overflow-hidden bg-gray-100">
                  <img
                    src={gallery.cover_image_url}
                    alt={gallery.title_hi}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-gray-900 font-serif line-clamp-2">
                    {gallery.title_hi || gallery.title_mr || gallery.title_en}
                  </h3>
                  <p className="text-xs text-gray-500">
                    छायाचित्रे: {gallery.images?.length || 1} • क्रेडिट: {gallery.credit || 'जगत समीक्षा'}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-gray-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setEditingGallery(gallery)}
                  className="p-1.5 text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>संपादित करा</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(gallery.id)}
                  className="p-1.5 text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>हटवा</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingGallery && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900 font-serif">
                {editingGallery.id ? 'फोटो गॅलरी संपादित करा' : 'नवीन फोटो गॅलरी तयार करा'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingGallery(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  हिन्दी शीर्षक *
                </label>
                <input
                  type="text"
                  required
                  value={editingGallery.title_hi || ''}
                  onChange={e => setEditingGallery({ ...editingGallery, title_hi: e.target.value })}
                  className="w-full border rounded-lg p-2 text-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  मराठी शीर्षक
                </label>
                <input
                  type="text"
                  value={editingGallery.title_mr || ''}
                  onChange={e => setEditingGallery({ ...editingGallery, title_mr: e.target.value })}
                  className="w-full border rounded-lg p-2 text-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  English Title
                </label>
                <input
                  type="text"
                  value={editingGallery.title_en || ''}
                  onChange={e => setEditingGallery({ ...editingGallery, title_en: e.target.value })}
                  className="w-full border rounded-lg p-2 text-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  कव्हर इमेज URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={editingGallery.cover_image_url || ''}
                  onChange={e => setEditingGallery({ ...editingGallery, cover_image_url: e.target.value })}
                  className="w-full border rounded-lg p-2 text-gray-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  छायाचित्र क्रेडिट (Credit)
                </label>
                <input
                  type="text"
                  placeholder="उदा. दैनिक जगत समीक्षा फोटो ब्यूरो / संतोष सांवत"
                  value={editingGallery.credit || ''}
                  onChange={e => setEditingGallery({ ...editingGallery, credit: e.target.value })}
                  className="w-full border rounded-lg p-2 text-gray-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditingGallery(null)}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-red text-white font-bold rounded-lg hover:bg-brand-red-dark shadow-sm"
                >
                  सेव्ह करा
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
