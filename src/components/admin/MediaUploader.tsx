import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, X, Check, Library } from 'lucide-react';
import { repository } from '@/lib/repository';
import { MediaAsset } from '@/types/database';

interface MediaUploaderProps {
  value?: string;
  altText?: string;
  caption?: string;
  onChange: (data: { url: string; altText: string; caption: string }) => void;
  label?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  value = '',
  altText = '',
  caption = '',
  onChange,
  label = 'प्रमुख प्रतिमा (Featured Image)',
}) => {
  const [currentUrl, setCurrentUrl] = useState(value);
  const [currentAlt, setCurrentAlt] = useState(altText);
  const [currentCaption, setCurrentCaption] = useState(caption);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryAssets, setLibraryAssets] = useState<MediaAsset[]>([]);

  useEffect(() => {
    setCurrentUrl(value);
    setCurrentAlt(altText);
    setCurrentCaption(caption);
  }, [value, altText, caption]);

  const loadLibrary = async () => {
    const assets = await repository.getMediaAssets();
    setLibraryAssets(assets);
    setLibraryOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('फाईलचा आकार खूप मोठा आहे (कमाल मर्यादा १० MB).');
      return;
    }

    // Validate MIME type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('केवळ सुरक्षित इमेज फॉरमॅट्स (JPEG, PNG, WebP, AVIF) समर्थित आहेत.');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const asset = await repository.uploadMedia(file, currentAlt, currentCaption);
      setCurrentUrl(asset.public_url);
      onChange({
        url: asset.public_url,
        altText: currentAlt || asset.alt_text || file.name,
        caption: currentCaption || asset.caption || '',
      });
    } catch (err: unknown) {
      setError('प्रतिमा अपलोड करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectFromLibrary = (asset: MediaAsset) => {
    setCurrentUrl(asset.public_url);
    if (!currentAlt && asset.alt_text) setCurrentAlt(asset.alt_text);
    if (!currentCaption && asset.caption) setCurrentCaption(asset.caption);

    onChange({
      url: asset.public_url,
      altText: currentAlt || asset.alt_text || '',
      caption: currentCaption || asset.caption || '',
    });
    setLibraryOpen(false);
  };

  const handleRemove = () => {
    setCurrentUrl('');
    onChange({
      url: '',
      altText: currentAlt,
      caption: currentCaption,
    });
  };

  const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCurrentAlt(val);
    onChange({
      url: currentUrl,
      altText: val,
      caption: currentCaption,
    });
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCurrentCaption(val);
    onChange({
      url: currentUrl,
      altText: currentAlt,
      caption: val,
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-editorial-800">{label}</label>
        <button
          type="button"
          onClick={loadLibrary}
          className="text-xs font-semibold text-crimson-800 hover:text-crimson-900 inline-flex items-center gap-1"
        >
          <Library className="w-3.5 h-3.5" />
          मीडिया लायब्ररीतून निवडा
        </button>
      </div>

      {error && (
        <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded border border-red-200">
          {error}
        </div>
      )}

      {currentUrl ? (
        <div className="space-y-3">
          <div className="relative aspect-[16/9] w-full max-w-md rounded-lg overflow-hidden border border-editorial-200 bg-editorial-100">
            <img src={currentUrl} alt={currentAlt || 'Selected media'} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-full transition-colors"
              title="प्रतिमा काढा"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
            <div>
              <label className="text-xs font-medium text-editorial-600 block mb-1">
                Alt Text (वर्णन)
              </label>
              <input
                type="text"
                value={currentAlt}
                onChange={handleAltChange}
                placeholder="उदा. मुंबई-पुणे एक्सप्रेसवेचे दृश्य"
                className="w-full px-3 py-1.5 text-xs bg-white border border-editorial-300 rounded focus:ring-1 focus:ring-crimson-800"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-editorial-600 block mb-1">
                कॅपशन (Image Caption)
              </label>
              <input
                type="text"
                value={currentCaption}
                onChange={handleCaptionChange}
                placeholder="उदा. प्रात्यक्षिक छायाचित्र"
                className="w-full px-3 py-1.5 text-xs bg-white border border-editorial-300 rounded focus:ring-1 focus:ring-crimson-800"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-editorial-300 hover:border-crimson-800 rounded-lg p-6 text-center bg-paper-subtle transition-colors">
          <input
            type="file"
            id="file-upload"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
            <Upload className="w-8 h-8 text-editorial-400 mb-2" />
            <span className="text-sm font-semibold text-editorial-900">
              {isUploading ? 'अपलोड होत आहे...' : 'प्रतिमा अपलोड करा किंवा येथे ड्रॅग करा'}
            </span>
            <span className="text-xs text-editorial-500 mt-1">
              JPG, PNG, WebP किंवा AVIF (कमाल १० MB)
            </span>
          </label>
        </div>
      )}

      {/* Media Library Modal */}
      {libraryOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-paper-border flex items-center justify-between bg-paper-subtle">
              <h3 className="font-bold text-editorial-950 text-base">मीडिया लायब्ररी (Media Library)</h3>
              <button onClick={() => setLibraryOpen(false)} className="p-1 text-editorial-600 hover:text-editorial-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {libraryAssets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => handleSelectFromLibrary(asset)}
                  className="group relative aspect-[4/3] rounded border border-editorial-200 overflow-hidden cursor-pointer hover:border-crimson-800 transition-colors"
                >
                  <img src={asset.public_url} alt={asset.alt_text || asset.file_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                    निवडा
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-paper-border bg-paper-subtle text-right">
              <button
                type="button"
                onClick={() => setLibraryOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold bg-editorial-200 hover:bg-editorial-300 text-editorial-800 rounded transition-colors"
              >
                बंद करा
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
