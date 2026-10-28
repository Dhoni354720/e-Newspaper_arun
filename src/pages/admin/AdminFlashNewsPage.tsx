import React, { useEffect, useState } from 'react';
import { repository } from '@/lib/repository';
import { BriefItem, SupportedLanguage } from '@/types/database';
import { Zap, Plus, Trash2, Send, CheckCircle2 } from 'lucide-react';

export const AdminFlashNewsPage: React.FC = () => {
  const [briefs, setBriefs] = useState<BriefItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState<SupportedLanguage>('hi');
  const [targetUrl, setTargetUrl] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    const data = await repository.getBriefs({ limit: 40 });
    setBriefs(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleQuickPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const saved = await repository.saveBrief({
        language,
        content: content.trim(),
        target_url: targetUrl.trim() || undefined,
        is_published: true,
      });

      setBriefs([saved, ...briefs]);
      setContent('');
      setTargetUrl('');
      showToast('फटाफट खबर तत्काळ प्रकाशित झाली!');
    } catch {
      alert('खबर प्रकाशित करताना त्रुटी आली.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('ही फटाफट बातमी हटवायची आहे का?')) return;
    await repository.deleteBrief(id);
    setBriefs(briefs.filter(b => b.id !== id));
    showToast('बातमी हटवली.');
  };

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif flex items-center gap-2">
            <Zap className="w-6 h-6 text-brand-red" />
            फटाफट बातम्या डेस्क (Quick 30-Second Flash Publisher)
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            ३० सेकंदात मोबाइल किंवा डेस्कटॉपवरून थेट लाइव्ह फटाफट अपडेट्स प्रसिद्ध करा.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Quick 30-sec Publish Form */}
      <form onSubmit={handleQuickPublish} className="bg-white border-2 border-brand-red/30 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-red flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            त्वरित बातमी जोडा (Fast Post)
          </span>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600 font-medium">भाषा:</label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value as SupportedLanguage)}
              className="border border-gray-300 rounded p-1 text-xs bg-white text-gray-900"
            >
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div>
          <textarea
            required
            rows={3}
            placeholder="येथे १-२ ओळीत महत्त्वाची ताजी घडामोड लिहा (उदा. मध्य रेल्वे मार्गावर लोकल गाड्या १५ मिनिटे उशिराने धावत आहेत)..."
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-900 focus:ring-2 focus:ring-brand-red outline-hidden leading-relaxed font-serif"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <input
            type="text"
            placeholder="संबंधित लिंक (पर्यायी, उदा. /category/mumbai)"
            value={targetUrl}
            onChange={e => setTargetUrl(e.target.value)}
            className="w-full sm:w-80 border border-gray-300 rounded-lg p-2 text-xs text-gray-900 font-mono"
          />

          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 bg-brand-red hover:bg-brand-red-dark text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>लाइव्ह प्रसिद्ध करा (Publish Live)</span>
          </button>
        </div>
      </form>

      {/* Existing Flash Briefs */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-900 text-sm font-serif">
          सध्या सक्रिय असलेल्या फटाफट बातम्या ({briefs.length})
        </h3>

        {isLoading ? (
          <div className="py-12 text-center text-gray-500 text-sm">लोड होत आहे...</div>
        ) : briefs.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-xs">कोणतीही बातमी उपलब्ध नाही.</div>
        ) : (
          briefs.map((brief, idx) => (
            <div
              key={brief.id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-2xs gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 h-6 rounded-full bg-editorial-100 text-editorial-800 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-900 font-serif leading-relaxed line-clamp-2">
                    {brief.content}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500 font-mono">
                    <span className="uppercase font-bold text-brand-red">{brief.language}</span>
                    <span>•</span>
                    <span>{new Date(brief.created_at).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    {brief.target_url && (
                      <>
                        <span>•</span>
                        <span className="text-blue-600 truncate max-w-xs">{brief.target_url}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(brief.id)}
                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded shrink-0"
                title="हटवा"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
