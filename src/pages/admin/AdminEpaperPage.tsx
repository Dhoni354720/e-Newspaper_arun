import React, { useEffect, useState } from 'react';
import { repository } from '@/lib/repository';
import { EpaperEdition, EpaperPage } from '@/types/database';
import { 
  Newspaper, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  Download, 
  CheckCircle2, 
  X, 
  Upload, 
  Calendar, 
  Layers, 
  ExternalLink,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminEpaperPage: React.FC = () => {
  const [editions, setEditions] = useState<EpaperEdition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [editionDate, setEditionDate] = useState(new Date().toISOString().split('T')[0]);
  const [editionRegion, setEditionRegion] = useState('pune');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [pagesCount, setPagesCount] = useState(6);

  const loadData = async () => {
    setIsLoading(true);
    const res = await repository.getEpaperEditions();
    setEditions(res.editions);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setEditionDate(new Date().toISOString().split('T')[0]);
    setEditionRegion('mumbai');
    setDescription('');
    setThumbnailUrl('');
    setPdfUrl('');
    setIsPublished(true);
    setPagesCount(4);
    setModalOpen(false);
  };

  const handleOpenCreate = () => {
    resetForm();
    setTitle('दैनिक जगत समीक्षा - मुंबई मुख्य संस्करण');
    setModalOpen(true);
  };

  const handleOpenEdit = (edition: EpaperEdition) => {
    setEditingId(edition.id);
    setTitle(edition.title);
    setEditionDate(edition.edition_date);
    setEditionRegion(edition.edition_region);
    setDescription(edition.description || '');
    setThumbnailUrl(edition.thumbnail_url);
    setPdfUrl(edition.pdf_url || '');
    setIsPublished(edition.is_published);
    setPagesCount(edition.total_pages || edition.pages?.length || 6);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('कृपया आवृत्तीचे नाव प्रविष्ट करा.');
      return;
    }

    try {
      // Build default pages if creating new
      const defaultPages: EpaperPage[] = Array.from({ length: pagesCount }, (_, i) => ({
        id: `page-${Date.now()}-${i + 1}`,
        edition_id: editingId || `ep-${Date.now()}`,
        page_number: i + 1,
        page_title: i === 0 ? 'मुख्य पृष्ठ' : i === 1 ? 'शहर वार्ता' : i === 2 ? 'संपादकीय' : i === 3 ? 'राज्य व देश' : i === 4 ? 'व्यापार व बाजार' : 'क्रीडा व मनोरंजन',
        image_url: thumbnailUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
        created_at: new Date().toISOString(),
      }));

      await repository.saveEpaperEdition({
        id: editingId || undefined,
        title: title.trim(),
        title_mr: title.trim(),
        edition_date: editionDate,
        edition_region: editionRegion,
        description: description.trim(),
        thumbnail_url: thumbnailUrl.trim() || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
        pdf_url: pdfUrl.trim() || undefined,
        total_pages: pagesCount,
        is_published: isPublished,
        pages: defaultPages,
      });

      setFeedback(editingId ? 'ई-वृत्तपत्र आवृत्ती अद्ययावत केली!' : 'नवीन ई-वृत्तपत्र आवृत्ती यशस्वीरीत्या अपलोड केली!');
      setTimeout(() => setFeedback(null), 3000);
      resetForm();
      loadData();
    } catch {
      alert('ई-वृत्तपत्र सेव्ह करताना त्रुटी आली.');
    }
  };

  const handleTogglePublish = async (edition: EpaperEdition) => {
    await repository.saveEpaperEdition({
      id: edition.id,
      is_published: !edition.is_published,
    });
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('तुम्हाला ही ई-वृत्तपत्र आवृत्ती हटवायची आहे का?')) {
      await repository.deleteEpaperEdition(id);
      loadData();
    }
  };

  const totalReads = editions.reduce((acc, ed) => acc + (ed.views_count || 0), 0);
  const totalDownloads = editions.reduce((acc, ed) => acc + (ed.downloads_count || 0), 0);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif flex items-center gap-2">
            <Newspaper className="w-7 h-7 text-crimson-800" />
            ई-वृत्तपत्र व्यवस्थापन (E-Newspaper CMS)
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            हजारो वाचकांसाठी दैनिक मुद्रित वृत्तपत्राच्या डिजिटल आवृत्त्या (PDF आणि पृष्ठे) अपलोड व व्यवस्थापित करा.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/epaper"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg border border-stone-300 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            वाचकांचे ई-पेपर पहा
          </Link>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-crimson-800 hover:bg-crimson-900 text-white font-bold text-xs rounded-lg shadow-sm transition-colors uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            नवीन ई-वृत्तपत्र अपलोड करा
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {feedback}
        </div>
      )}

      {/* 2. Analytics & Capacity Banner (for thousands of viewers) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">एकूण आवृत्त्या</span>
            <Layers className="w-5 h-5 text-crimson-800" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{editions.length}</p>
          <span className="text-[11px] text-emerald-600 font-medium">प्रकाशित व सक्रिय संग्रह</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">एकूण वाचक संख्या</span>
            <Eye className="w-5 h-5 text-crimson-800" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{totalReads.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 font-medium">हजारो वाचकांपर्यंत पोहोच</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">एकूण PDF डाउनलोड्स</span>
            <Download className="w-5 h-5 text-crimson-800" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{totalDownloads.toLocaleString()}</p>
          <span className="text-[11px] text-gray-500">वाचकांनी संग्रहित केलेल्या प्रती</span>
        </div>
      </div>

      {/* 3. Editions Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-serif font-bold text-gray-900 text-lg">अपलोड केलेल्या ई-वृत्तपत्र आवृत्त्या</h2>
          <span className="text-xs text-gray-500 font-mono">Total {editions.length} editions</span>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-gray-500 text-xs">लोड होत आहे...</div>
        ) : editions.length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-sm">
            कोणतीही आवृत्ती अपलोड केलेली नाही. वरील बटण वापरून नवीन ई-पेपर जोडा.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 text-gray-600 uppercase text-[11px] border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">आवृत्ती / तारीख</th>
                  <th className="px-4 py-3">विभाग / Region</th>
                  <th className="px-4 py-3">पाने</th>
                  <th className="px-4 py-3">वाचक संख्या</th>
                  <th className="px-4 py-3">स्थिती</th>
                  <th className="px-6 py-3 text-right">कृती</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {editions.map((ed) => (
                  <tr key={ed.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 bg-gray-100 rounded border border-gray-200 overflow-hidden flex-shrink-0">
                          <img src={ed.thumbnail_url} alt={ed.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 font-serif text-sm">{ed.title}</p>
                          <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3 text-crimson-800" /> {ed.edition_date}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 bg-stone-100 text-stone-800 rounded font-bold uppercase text-[10px] tracking-wider">
                        {ed.edition_region}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono font-medium">
                      {ed.total_pages || ed.pages?.length || 1} पाने
                    </td>
                    <td className="px-4 py-4 font-mono">
                      <div className="text-gray-900 font-semibold">{(ed.views_count || 0).toLocaleString()} वाचक</div>
                      <div className="text-gray-500 text-[10px]">{(ed.downloads_count || 0).toLocaleString()} डाउनलोड</div>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(ed)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          ed.is_published 
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                      >
                        {ed.is_published ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            प्रकाशित (Live)
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                            मसुदा (Draft)
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          to={`/epaper?date=${ed.edition_date}&region=${ed.edition_region}`}
                          target="_blank"
                          className="p-1.5 text-gray-500 hover:text-crimson-800 hover:bg-gray-100 rounded"
                          title="वाचकांच्या दृष्टीने पहा"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(ed)}
                          className="p-1.5 text-gray-500 hover:text-blue-700 hover:bg-gray-100 rounded"
                          title="संपादित करा"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(ed.id)}
                          className="p-1.5 text-gray-500 hover:text-red-700 hover:bg-gray-100 rounded"
                          title="हटवा"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Upload / Edit Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <h3 className="font-serif text-xl font-bold text-gray-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-crimson-800" />
                {editingId ? 'ई-वृत्तपत्र आवृत्ती संपादित करा' : 'नवीन ई-वृत्तपत्र अपलोड करा'}
              </h3>
              <button
                type="button"
                onClick={resetForm}
                className="p-1 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  आवृत्तीचे शीर्षक (Edition Title) *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="उदा. दैनिक जगत समीक्षा - मुंबई मुख्य संस्करण"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-crimson-800"
                />
              </div>

              {/* Date & Region */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    प्रकाशन तारीख (Edition Date) *
                  </label>
                  <input
                    type="date"
                    value={editionDate}
                    onChange={(e) => setEditionDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-crimson-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    विभाग / Region *
                  </label>
                  <select
                    value={editionRegion}
                    onChange={(e) => setEditionRegion(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-crimson-800"
                  >
                    <option value="mumbai">मुंबई आवृत्ती (Mumbai Edition)</option>
                    <option value="maharashtra">महाराष्ट्र राज्य आवृत्ती (State Edition)</option>
                    <option value="pune">पुणे आवृत्ती (Pune Edition)</option>
                    <option value="all">सर्व आवृत्त्या (All Regions)</option>
                  </select>
                </div>
              </div>

              {/* Total Pages Count */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  एकूण पाने संख्या (Total Pages)
                </label>
                <input
                  type="number"
                  min="1"
                  max="48"
                  value={pagesCount}
                  onChange={(e) => setPagesCount(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-crimson-800"
                />
              </div>

              {/* PDF Document URL */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  ई-वृत्तपत्र PDF लिंक (Full PDF Download URL)
                </label>
                <input
                  type="url"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  placeholder="https://your-domain.com/storage/epaper-2026-02-25.pdf"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-crimson-800"
                />
                <span className="text-[11px] text-gray-500 mt-0.5 block">
                  वाचक थेट ही संपूर्ण आवृत्ती PDF स्वरूपात डाउनलोड करू शकतील.
                </span>
              </div>

              {/* Thumbnail Image URL */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  मुखपृष्ठ छायाचित्र / Thumbnail URL
                </label>
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... किंवा SVG Data URL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-crimson-800"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  संक्षिप्त वर्णन (Description)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="उदा. पुणे शहर व उपनगरातील विशेष राजकीय व नागरी घडामोडी..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-crimson-800"
                />
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="epaper-is-published"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 text-crimson-800 rounded border-gray-300 focus:ring-crimson-800"
                />
                <label htmlFor="epaper-is-published" className="font-bold text-gray-900 cursor-pointer">
                  लगेच प्रकाशित करा (Publish immediately for readers)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-crimson-800 hover:bg-crimson-900 text-white font-bold rounded-lg shadow-sm"
                >
                  {editingId ? 'बदल सेव्ह करा' : 'ई-वृत्तपत्र अपलोड करा'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
