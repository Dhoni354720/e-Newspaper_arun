import React, { useEffect, useState } from 'react';
import { repository } from '@/lib/repository';
import { MediaAsset } from '@/types/database';
import { Image as ImageIcon, Upload, Trash2, Copy, Check, FileText, CheckCircle2 } from 'lucide-react';

export const AdminMediaPage: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadMedia = async () => {
    setIsLoading(true);
    const data = await repository.getMediaAssets();
    setAssets(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 10 * 1024 * 1024) {
      alert('प्रतिमेचा आकार १० MB पेक्षा कमी असावा.');
      return;
    }

    setIsUploading(true);
    try {
      await repository.uploadMedia(file);
      setFeedback('प्रतिमा यशस्वीरित्या मीडिया लायब्ररीत जोडली गेली!');
      setTimeout(() => setFeedback(null), 3000);
      loadMedia();
    } catch {
      alert('अपलोड करण्यात त्रुटी आली.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyUrl = async (id: string, url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('तुम्हाला खात्री आहे का की ही प्रतिमा काढून टाकायची आहे?')) {
      await repository.deleteMedia(id);
      loadMedia();
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-crimson-800" />
            मीडिया लायब्ररी (Media Library & Storage)
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            बातम्यांसाठी वापरल्या जाणाऱ्या सर्व प्रतिमा, छायाचित्रे आणि मीडिया मालमत्ता व्यवस्थापित करा.
          </p>
        </div>

        {/* Upload Button */}
        <div>
          <input
            type="file"
            id="page-media-upload"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label
            htmlFor="page-media-upload"
            className="inline-flex items-center gap-2 px-4 py-2 bg-crimson-800 hover:bg-crimson-900 text-white font-bold text-xs rounded-lg shadow-sm transition-colors uppercase tracking-wider cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? 'अपलोड होत आहे...' : 'नवीन प्रतिमा अपलोड करा'}
          </label>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Grid of Images */}
      {isLoading ? (
        <div className="p-16 text-center text-gray-500">
          <div className="w-8 h-8 border-4 border-crimson-800 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          मीडिया लोड होत आहे...
        </div>
      ) : assets.length === 0 ? (
        <div className="p-16 text-center bg-white border border-gray-200 rounded-xl">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800 mb-1">अद्याप कोणतीही प्रतिमा नाही</h3>
          <p className="text-xs text-gray-500">
            वरील बटणावर क्लिक करून पहिली बातमी प्रतिमा अपलोड करा.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <img
                  src={asset.public_url}
                  alt={asset.alt_text || asset.file_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-3 space-y-1">
                <p className="text-xs font-semibold text-gray-900 truncate" title={asset.file_name}>
                  {asset.file_name}
                </p>
                <p className="text-[10px] text-gray-500">
                  {(asset.file_size / 1024).toFixed(0)} KB • {asset.mime_type.split('/')[1]?.toUpperCase()}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                  <button
                    onClick={() => handleCopyUrl(asset.id, asset.public_url)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-crimson-800 hover:underline"
                    title="URL कॉपी करा"
                  >
                    {copiedId === asset.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" /> कॉपी झाली!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> लिंक
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(asset.id)}
                    className="p-1 text-gray-400 hover:text-red-700 rounded transition-colors"
                    title="काढून टाका"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
