import React, { useEffect, useState } from 'react';
import { repository } from '@/lib/repository';
import { HomeBlock, HomeBlockType, Category } from '@/types/database';
import { 
  Sparkles, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Edit2, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  X,
  Layers,
  LayoutGrid
} from 'lucide-react';

const BLOCK_TYPE_LABELS: Record<HomeBlockType, { hi: string; en: string }> = {
  hero: { hi: 'मुख्य बातमी / लीड (Hero Lead)', en: 'Hero Lead' },
  top_news: { hi: 'शीर्ष समाचार (Top News / Big 4)', en: 'Top News' },
  city_tabs: { hi: 'शहर/प्रादेशिक टॅब्स (City Dispatches)', en: 'City Tabs' },
  opinion: { hi: 'संपादकीय व विचार (Editor Arun Ramakant Tiwari Column)', en: 'Editorial & Opinion' },
  crime: { hi: 'अपराध विशेष (Crime & Legal Bureau)', en: 'Crime Special' },
  sports: { hi: 'क्रीडा विश्व (Sports Desk)', en: 'Sports' },
  epaper_promo: { hi: 'ई-वृत्तपत्र प्रसार (E-Paper Strip)', en: 'E-Paper Promo' },
  weather: { hi: 'हवामान व पंचांग (Weather Widget)', en: 'Weather' },
  category_grid: { hi: 'विभाग ग्रीड (Category Grid)', en: 'Category Grid' },
  custom: { hi: 'कस्टम ब्लॉक (Custom Block)', en: 'Custom Block' },
};

export const AdminHomeBlocksPage: React.FC = () => {
  const [blocks, setBlocks] = useState<HomeBlock[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBlock, setEditingBlock] = useState<Partial<HomeBlock> | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    const [fetchedBlocks, fetchedCategories] = await Promise.all([
      repository.getHomeBlocks(),
      repository.getCategories(),
    ]);
    setBlocks(fetchedBlocks);
    setCategories(fetchedCategories);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;

    setBlocks(newBlocks);
    await repository.reorderHomeBlocks(newBlocks.map(b => b.id));
    showToast('होमपेज ब्लॉक्सचा क्रम अद्ययावत केला!');
  };

  const handleToggleActive = async (block: HomeBlock) => {
    const updated = await repository.saveHomeBlock({
      ...block,
      is_active: !block.is_active,
    });
    setBlocks(blocks.map(b => (b.id === block.id ? updated : b)));
    showToast(updated.is_active ? 'ब्लॉक सक्रिय केला.' : 'ब्लॉक निष्क्रिय केला.');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('हा ब्लॉक हटवायचा आहे का?')) return;
    await repository.deleteHomeBlock(id);
    setBlocks(blocks.filter(b => b.id !== id));
    showToast('ब्लॉक यशस्वीरित्या हटवला.');
  };

  const handleStartCreate = () => {
    setEditingBlock({
      block_type: 'category_grid',
      title_override_hi: '',
      title_override_mr: '',
      title_override_en: '',
      item_count: 4,
      is_active: true,
      sort_order: blocks.length + 1,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlock || !editingBlock.block_type) return;

    try {
      const saved = await repository.saveHomeBlock({
        ...editingBlock,
        block_type: editingBlock.block_type as HomeBlockType,
      });

      if (editingBlock.id) {
        setBlocks(blocks.map(b => (b.id === saved.id ? saved : b)));
      } else {
        setBlocks([...blocks, saved]);
      }

      setEditingBlock(null);
      showToast('होमपेज ब्लॉक सेव्ह झाला!');
      loadData();
    } catch {
      alert('ब्लॉक सेव्ह करताना त्रुटी आली.');
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-brand-red" />
            होमपेज ब्लॉक्स व्यवस्थापन (Home Blocks Customizer)
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            दैनिक जगत समीक्षाच्या मुख्यपृष्ठावरील विभागांची मांडणी, क्रमवारी आणि दृश्यता नियंत्रित करा.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red hover:bg-brand-red-dark text-white font-bold text-xs rounded-lg shadow-sm transition-colors uppercase tracking-wider self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          नवीन ब्लॉक जोडा
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Blocks List */}
      {isLoading ? (
        <div className="py-12 text-center text-gray-500 text-sm">
          होमपेज ब्लॉक्स लोड होत आहेत...
        </div>
      ) : (
        <div className="space-y-3">
          {blocks.map((block, idx) => {
            const labelInfo = BLOCK_TYPE_LABELS[block.block_type] || {
              hi: block.block_type,
              en: block.block_type,
            };
            const cat = categories.find(c => c.id === block.category_id);

            return (
              <div
                key={block.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  block.is_active
                    ? 'bg-white border-gray-200 shadow-xs hover:border-gray-300'
                    : 'bg-gray-50/70 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="w-8 h-8 rounded-full bg-editorial-100 text-editorial-800 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">
                        {block.title_override_hi || labelInfo.hi}
                      </span>
                      <span className="text-[11px] font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {block.block_type}
                      </span>
                      {cat && (
                        <span className="text-[11px] font-sans bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                          विभाग: {cat.translations?.hi?.name || cat.slug}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      कमाल आयटम्स: <span className="font-semibold">{block.item_count}</span>
                      {block.title_override_mr && ` | मराठी: "${block.title_override_mr}"`}
                      {block.title_override_en && ` | English: "${block.title_override_en}"`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-4">
                  {/* Reorder Buttons */}
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    className="p-1.5 text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:hover:text-gray-500 rounded hover:bg-gray-100"
                    title="वर हलवा (Move Up)"
                    aria-label="Move block up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === blocks.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    className="p-1.5 text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:hover:text-gray-500 rounded hover:bg-gray-100"
                    title="खाली हलवा (Move Down)"
                    aria-label="Move block down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  {/* Active Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(block)}
                    className={`p-1.5 rounded transition-colors ${
                      block.is_active
                        ? 'text-emerald-600 hover:bg-emerald-50'
                        : 'text-gray-400 hover:bg-gray-200'
                    }`}
                    title={block.is_active ? 'निष्क्रिय करा (Hide)' : 'सक्रिय करा (Show)'}
                    aria-label="Toggle active"
                  >
                    {block.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => setEditingBlock(block)}
                    className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                    title="संपादित करा (Edit)"
                    aria-label="Edit block"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDelete(block.id)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                    title="हटवा (Delete)"
                    aria-label="Delete block"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Create Modal */}
      {editingBlock && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900 font-serif">
                {editingBlock.id ? 'ब्लॉक संपादित करा' : 'नवीन ब्लॉक जोडा'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingBlock(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  ब्लॉकचा प्रकार (Block Type) *
                </label>
                <select
                  value={editingBlock.block_type || 'category_grid'}
                  onChange={e =>
                    setEditingBlock({
                      ...editingBlock,
                      block_type: e.target.value as HomeBlockType,
                    })
                  }
                  className="w-full border rounded-lg p-2.5 bg-white text-gray-900"
                >
                  {Object.entries(BLOCK_TYPE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>
                      {label.hi}
                    </option>
                  ))}
                </select>
              </div>

              {editingBlock.block_type === 'category_grid' && (
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    संबंधित विभाग (Category Link)
                  </label>
                  <select
                    value={editingBlock.category_id || ''}
                    onChange={e =>
                      setEditingBlock({
                        ...editingBlock,
                        category_id: e.target.value || undefined,
                      })
                    }
                    className="w-full border rounded-lg p-2.5 bg-white text-gray-900"
                  >
                    <option value="">-- विभाग निवडा --</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.translations?.hi?.name || c.slug} ({c.slug})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  कमाल बातम्यांची संख्या (Item Count)
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={editingBlock.item_count || 4}
                  onChange={e =>
                    setEditingBlock({
                      ...editingBlock,
                      item_count: parseInt(e.target.value, 10) || 4,
                    })
                  }
                  className="w-full border rounded-lg p-2.5 text-gray-900"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100">
                <p className="font-semibold text-gray-700">पर्यायी शीर्षक ओव्हरराइड (Custom Titles)</p>
                <div>
                  <label className="block text-gray-600 text-[11px] mb-0.5">हिन्दी शीर्षक</label>
                  <input
                    type="text"
                    placeholder="उदा. विशेष संपादकीय विचार"
                    value={editingBlock.title_override_hi || ''}
                    onChange={e =>
                      setEditingBlock({ ...editingBlock, title_override_hi: e.target.value })
                    }
                    className="w-full border rounded-lg p-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-[11px] mb-0.5">मराठी शीर्षक</label>
                  <input
                    type="text"
                    placeholder="उदा. विशेष संपादकीय विचार"
                    value={editingBlock.title_override_mr || ''}
                    onChange={e =>
                      setEditingBlock({ ...editingBlock, title_override_mr: e.target.value })
                    }
                    className="w-full border rounded-lg p-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-[11px] mb-0.5">English Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Editorial Column"
                    value={editingBlock.title_override_en || ''}
                    onChange={e =>
                      setEditingBlock({ ...editingBlock, title_override_en: e.target.value })
                    }
                    className="w-full border rounded-lg p-2 text-gray-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="block_is_active"
                  checked={editingBlock.is_active !== false}
                  onChange={e =>
                    setEditingBlock({ ...editingBlock, is_active: e.target.checked })
                  }
                  className="w-4 h-4 text-brand-red rounded border-gray-300 focus:ring-brand-red"
                />
                <label htmlFor="block_is_active" className="text-gray-700 font-medium">
                  हा ब्लॉक मुख्यपृष्ठावर सक्रिय ठेवा (Active on Homepage)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditingBlock(null)}
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
