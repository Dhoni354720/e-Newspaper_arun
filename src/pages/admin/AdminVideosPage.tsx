import React, { useEffect, useState } from 'react';
import { repository } from '@/lib/repository';
import { VideoItem } from '@/types/database';
import { Video, Plus, Trash2, Edit2, CheckCircle2, X } from 'lucide-react';

export const AdminVideosPage: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState<Partial<VideoItem> | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    const data = await repository.getVideos();
    setVideos(data);
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
    setEditingVideo({
      provider: 'youtube',
      video_id_or_url: '',
      title_hi: '',
      title_mr: '',
      title_en: '',
      description_hi: '',
      thumbnail_url: '',
      duration_seconds: 300,
      is_published: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;

    try {
      await repository.saveVideo(editingVideo);
      showToast('व्हिडिओ यशस्वीरित्या सेव्ह झाला!');
      setEditingVideo(null);
      loadData();
    } catch {
      alert('व्हिडिओ सेव्ह करताना त्रुटी आली.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('हा व्हिडिओ हटवायचा आहे का?')) return;
    await repository.deleteVideo(id);
    setVideos(videos.filter(v => v.id !== id));
    showToast('व्हिडिओ हटवला.');
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif flex items-center gap-2">
            <Video className="w-6 h-6 text-brand-red" />
            व्हिडिओ बातमी व्यवस्थापन (Videos CMS)
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            YouTube किंवा डिजिटल व्हिडिओ बुलेटिन्स प्रकाशित करा व व्यवस्थापित करा.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red hover:bg-brand-red-dark text-white font-bold text-xs rounded-lg shadow-sm transition-colors uppercase tracking-wider self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          नवीन व्हिडिओ जोडा
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
      ) : videos.length === 0 ? (
        <div className="py-12 text-center text-gray-400 text-xs">कोणताही व्हिडिओ उपलब्ध नाही.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(video => (
            <div
              key={video.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="aspect-16/10 overflow-hidden bg-gray-100">
                  <img
                    src={video.thumbnail_url}
                    alt={video.title_hi}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-gray-900 font-serif line-clamp-2">
                    {video.title_hi || video.title_mr || video.title_en}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono">
                    ID: {video.video_id_or_url} • कालावधी: {Math.floor((video.duration_seconds || 0) / 60)} मि.
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-gray-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setEditingVideo(video)}
                  className="p-1.5 text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>संपादित करा</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(video.id)}
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
      {editingVideo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900 font-serif">
                {editingVideo.id ? 'व्हिडिओ संपादित करा' : 'नवीन व्हिडिओ जोडा'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingVideo(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  YouTube ID किंवा URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. dQw4w9WgXcQ किंवा https://youtu.be/..."
                  value={editingVideo.video_id_or_url || ''}
                  onChange={e => setEditingVideo({ ...editingVideo, video_id_or_url: e.target.value })}
                  className="w-full border rounded-lg p-2 text-gray-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  हिन्दी शीर्षक *
                </label>
                <input
                  type="text"
                  required
                  value={editingVideo.title_hi || ''}
                  onChange={e => setEditingVideo({ ...editingVideo, title_hi: e.target.value })}
                  className="w-full border rounded-lg p-2 text-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  मराठी शीर्षक
                </label>
                <input
                  type="text"
                  value={editingVideo.title_mr || ''}
                  onChange={e => setEditingVideo({ ...editingVideo, title_mr: e.target.value })}
                  className="w-full border rounded-lg p-2 text-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  English Title
                </label>
                <input
                  type="text"
                  value={editingVideo.title_en || ''}
                  onChange={e => setEditingVideo({ ...editingVideo, title_en: e.target.value })}
                  className="w-full border rounded-lg p-2 text-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  थंबनेल इमेज URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={editingVideo.thumbnail_url || ''}
                  onChange={e => setEditingVideo({ ...editingVideo, thumbnail_url: e.target.value })}
                  className="w-full border rounded-lg p-2 text-gray-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  कालावधी सेकंदात (Duration in seconds)
                </label>
                <input
                  type="number"
                  placeholder="उदा. 480"
                  value={editingVideo.duration_seconds || 300}
                  onChange={e => setEditingVideo({ ...editingVideo, duration_seconds: parseInt(e.target.value, 10) || 300 })}
                  className="w-full border rounded-lg p-2 text-gray-900 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
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
