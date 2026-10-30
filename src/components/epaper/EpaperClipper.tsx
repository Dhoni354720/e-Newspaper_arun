import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Scissors, 
  X, 
  Download, 
  Share2, 
  Check, 
  Copy, 
  Maximize2, 
  RotateCcw,
  Sparkles,
  Newspaper,
  MessageCircle
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { safeUrl } from '@/lib/sanitize';

interface CropBox {
  x: number; // percentage (0-100)
  y: number;
  width: number;
  height: number;
}

interface EpaperClipperProps {
  pageImageUrl: string;
  zoomImageUrl?: string;
  pageNumber: number;
  editionTitle: string;
  editionDate: string;
  editionRegion?: string;
  onClose: () => void;
}

export const EpaperClipper: React.FC<EpaperClipperProps> = ({
  pageImageUrl,
  zoomImageUrl,
  pageNumber,
  editionTitle,
  editionDate,
  editionRegion = 'मुंबई',
  onClose,
}) => {
  const { language, t } = useLanguage();

  const [crop, setCrop] = useState<CropBox | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [clippedImageDataUrl, setClippedImageDataUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Keyboard escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (clippedImageDataUrl) {
          setClippedImageDataUrl(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clippedImageDataUrl, onClose]);

  // Mouse / Touch Drag handling
  const getRelativeCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!imgRef.current) return null;
    const rect = imgRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

    return {
      xPercent: (x / rect.width) * 100,
      yPercent: (y / rect.height) * 100,
    };
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    // If clicking inside existing buttons or if already clipped, ignore
    const coords = getRelativeCoordinates(e);
    if (!coords) return;

    setIsDragging(true);
    setStartPos({ x: coords.xPercent, y: coords.yPercent });
    setCrop({
      x: coords.xPercent,
      y: coords.yPercent,
      width: 0,
      height: 0,
    });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !startPos) return;
    const coords = getRelativeCoordinates(e);
    if (!coords) return;

    const x = Math.min(startPos.x, coords.xPercent);
    const y = Math.min(startPos.y, coords.yPercent);
    const width = Math.abs(coords.xPercent - startPos.x);
    const height = Math.abs(coords.yPercent - startPos.y);

    setCrop({ x, y, width, height });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Generate Branded Composite on HTML5 Canvas
  const generateClip = useCallback(async () => {
    if (!crop || crop.width < 5 || crop.height < 5) return;
    setIsProcessing(true);

    try {
      // Validate source high-res or standard image URL
      const rawUrl = zoomImageUrl || pageImageUrl;
      const sourceUrl = safeUrl(rawUrl, '');
      if (!sourceUrl || (!sourceUrl.startsWith('/') && !sourceUrl.startsWith('http:') && !sourceUrl.startsWith('https:'))) {
        throw new Error('Invalid or disallowed image URL for clipping');
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = sourceUrl;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load page image for clipping'));
      });

      // Clamp coordinates to valid percentage bounds (0-100)
      const safeX = Math.max(0, Math.min(95, crop.x));
      const safeY = Math.max(0, Math.min(95, crop.y));
      const safeW = Math.max(5, Math.min(100 - safeX, crop.width));
      const safeH = Math.max(5, Math.min(100 - safeY, crop.height));

      // Calculate pixel crop coordinates
      const cropPxX = (safeX / 100) * img.naturalWidth;
      const cropPxY = (safeY / 100) * img.naturalHeight;
      const cropPxW = (safeW / 100) * img.naturalWidth;
      const cropPxH = (safeH / 100) * img.naturalHeight;

      // Cap maximum canvas dimensions to prevent memory exhaustion / canvas DoS
      const targetW = Math.max(400, Math.min(1800, cropPxW || 900));
      const scale = targetW / (cropPxW || 1);
      const targetCropH = Math.min(3000, cropPxH * scale);

      const headerH = 115;
      const footerH = 50;
      const canvasW = targetW;
      const canvasH = headerH + targetCropH + footerH;

      const canvas = document.createElement('canvas');
      canvas.width = canvasW;
      canvas.height = canvasH;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context unavailable');

      // 1. White Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasW, canvasH);

      // 2. Top Header Masthead Banner
      ctx.fillStyle = '#ed1c24'; // Client Brand Red
      ctx.fillRect(0, 0, canvasW, 70);

      // Gold Accent Line
      ctx.fillStyle = '#fbc707'; // Client Brand Gold
      ctx.fillRect(0, 70, canvasW, 4);

      // Secondary header strip
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, 74, canvasW, 41);

      // Brand Title Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px "Rozha One", "Martel", serif, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('दैनिक जगत समीक्षा', canvasW / 2, 36);

      // Masthead Metadata Subtitle (Date, Region, Page, RNI, Editor)
      ctx.fillStyle = '#e7e5e4';
      ctx.font = '500 15px "Martel", serif, sans-serif';
      ctx.textAlign = 'center';
      const metaText = `दिनांक: ${editionDate} • पृष्ठ: ${pageNumber} • RNI: MAHHIN/2014/57312 • संपादक: अरुण रमाकांत तिवारी`;
      ctx.fillText(metaText, canvasW / 2, 94);

      // 3. Draw Cropped Article
      ctx.drawImage(
        img,
        cropPxX, cropPxY, cropPxW, cropPxH,
        0, headerH, targetW, targetCropH
      );

      // 4. Subtle Border around cropped area
      ctx.strokeStyle = '#d6d3d1';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, headerH, targetW, targetCropH);

      // 5. Bottom Statutory & Digital Footer
      ctx.fillStyle = '#f5f5f4';
      ctx.fillRect(0, headerH + targetCropH, canvasW, footerH);

      ctx.fillStyle = '#ed1c24';
      ctx.fillRect(0, headerH + targetCropH, canvasW, 2);

      ctx.fillStyle = '#44403c';
      ctx.font = '600 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        'दैनिक जगत समीक्षा डिजिटल ई-पेपर • www.jagatsameeksha.com • भांडुप (पश्चिम), मुंबई ४०००७८',
        canvasW / 2,
        headerH + targetCropH + (footerH / 2)
      );

      const dataUrl = canvas.toDataURL('image/png', 0.95);
      setClippedImageDataUrl(dataUrl);
    } catch (err) {
      console.error('Error generating newspaper clip:', err);
      alert('कतरन तयार करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsProcessing(false);
    }
  }, [crop, editionDate, pageNumber, pageImageUrl, zoomImageUrl]);

  const handleDownload = () => {
    if (!clippedImageDataUrl) return;
    const a = document.createElement('a');
    a.href = clippedImageDataUrl;
    a.download = `Dainik_Jagat_Sameeksha_${editionDate.replace(/\s+/g, '_')}_p${pageNumber}_clip.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = async () => {
    if (!clippedImageDataUrl) return;
    try {
      const res = await fetch(clippedImageDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `*दैनिक जगत समीक्षा* (${editionDate})\nपृष्ठ क्र. ${pageNumber} वरील विशेष बातमी:\nhttps://www.jagatsameeksha.com/epaper`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-between animate-fadeIn select-none">
      {/* Top Clipper Header Bar */}
      <div className="bg-editorial-950 text-white px-4 py-3 flex items-center justify-between border-b border-editorial-800 z-10">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-crimson-800 text-white rounded-lg shadow-sm">
            <Scissors className="w-4 h-4" />
          </span>
          <div>
            <h2 className="font-masthead font-bold text-base sm:text-lg text-white">
              वृत्त कतरन साधन (Interactive Article Clipper)
            </h2>
            <p className="text-xs text-editorial-400">
              पृष्ठावर माउस अथवा बोटाने बातमीभोवती चौकोन ओढा आणि ब्रँडेड कतरन तयार करा.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {crop && crop.width > 5 && crop.height > 5 && !clippedImageDataUrl && (
            <button
              type="button"
              onClick={generateClip}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-editorial-950 rounded-lg text-xs font-black shadow transition-all animate-pulse"
            >
              <Scissors className="w-4 h-4" />
              <span>{isProcessing ? 'कतरन बनत आहे...' : 'कतरन तयार करा'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-editorial-400 hover:text-white hover:bg-editorial-900 rounded-lg transition-colors"
            aria-label="Close Clipper"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Drag Canvas Area */}
      {!clippedImageDataUrl ? (
        <div 
          ref={containerRef}
          className="flex-1 overflow-auto p-4 flex items-center justify-center relative touch-none cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
          <div className="relative inline-block max-w-full shadow-2xl rounded overflow-hidden border-2 border-crimson-800/60">
            <img
              ref={imgRef}
              src={pageImageUrl}
              alt={`Broadsheet Page ${pageNumber}`}
              className="w-auto h-auto max-h-[82vh] object-contain pointer-events-none select-none block"
              draggable={false}
            />

            {/* Crop Overlay Selection Box */}
            {crop && (
              <div
                style={{
                  left: `${crop.x}%`,
                  top: `${crop.y}%`,
                  width: `${crop.width}%`,
                  height: `${crop.height}%`,
                }}
                className="absolute border-2 border-crimson-600 bg-crimson-600/20 backdrop-contrast-125 shadow-2xl pointer-events-none transition-none"
              >
                {/* Visual Corner Resizing Grips */}
                <span className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-amber-400 border border-black rounded-xs"></span>
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-400 border border-black rounded-xs"></span>
                <span className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-amber-400 border border-black rounded-xs"></span>
                <span className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-400 border border-black rounded-xs"></span>

                <div className="absolute top-1 left-1 bg-black/80 text-amber-300 font-mono text-[10px] px-1.5 py-0.5 rounded shadow">
                  कतरन क्षेत्र (Selection)
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Preview Modal for Generated Clip */
        <div className="flex-1 overflow-auto p-4 sm:p-6 flex flex-col items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-editorial-200 overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Title Bar */}
            <div className="p-4 bg-editorial-950 text-white flex items-center justify-between border-b border-editorial-800">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-sm">कतरन तयार झाली आहे (Branded Clip Ready)</span>
              </div>
              <button
                onClick={() => setClippedImageDataUrl(null)}
                className="text-xs text-editorial-400 hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>दुसरे निवडा</span>
              </button>
            </div>

            {/* Image Preview Box */}
            <div className="p-4 flex-1 overflow-auto bg-stone-100 flex items-center justify-center">
              <img
                src={clippedImageDataUrl}
                alt="Generated Article Clip"
                className="max-h-[55vh] w-auto object-contain rounded shadow-lg border border-stone-300"
              />
            </div>

            {/* Action Buttons */}
            <div className="p-4 bg-white border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>व्हाट्सएपवर शेअर करा</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-crimson-800 hover:bg-crimson-900 text-white text-xs font-bold rounded-lg shadow transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>PNG डाउनलोड</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg border border-stone-300 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'कॉपी झाले!' : 'कॉपी करा'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors"
              >
                बंद करा (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Hint Strip */}
      <div className="bg-editorial-950/95 text-editorial-400 px-4 py-2 text-center text-xs border-t border-editorial-900">
        <span>
          💡 टीप: बातमी वाचकांना पाठवण्यासाठी कतरनवर दैनिक जगत समीक्षाचा अधिकृत मथळा व दिनांक आपोआप जोडला जातो.
        </span>
      </div>
    </div>
  );
};
