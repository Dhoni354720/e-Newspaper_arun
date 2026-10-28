import React, { useEffect, useState } from 'react';
import { repository } from '@/lib/repository';
import { NewsTip, NewsTipStatus } from '@/types/database';
import { Send, PhoneCall, MapPin, CheckCircle, XCircle, Clock, CheckCircle2, ExternalLink } from 'lucide-react';

export const AdminNewsTipsPage: React.FC = () => {
  const [tips, setTips] = useState<NewsTip[]>([]);
  const [statusFilter, setStatusFilter] = useState<NewsTipStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    const filter = statusFilter === 'all' ? undefined : statusFilter;
    const data = await repository.getNewsTips(filter ? { status: filter } : {});
    setTips(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleUpdateStatus = async (id: string, newStatus: NewsTipStatus) => {
    await repository.updateNewsTipStatus(id, newStatus);
    setTips(tips.map(t => (t.id === id ? { ...t, status: newStatus } : t)));
    showToast(`बातमीची स्थिती '${newStatus}' म्हणून अद्ययावत केली.`);
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif flex items-center gap-2">
            <Send className="w-6 h-6 text-brand-red" />
            नागरिक पत्रकारिता इनबॉक्स (Citizen News Tips Inbox)
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            वाचकांनी पाठवलेल्या स्थानिक बातम्या, छायाचित्रे व जनसमस्यांचे पुनरावलोकन करा.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white border border-gray-200 p-1 rounded-lg text-xs font-semibold shadow-2xs">
          {(['all', 'new', 'reviewed', 'used', 'rejected'] as const).map(st => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md capitalize transition-all ${
                statusFilter === st
                  ? 'bg-editorial-950 text-white font-bold shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {st === 'all' ? 'सर्व' : st}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="py-12 text-center text-gray-500 text-sm">लोड होत आहे...</div>
      ) : tips.length === 0 ? (
        <div className="py-16 text-center bg-white border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
          <Send className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h2 className="text-base font-bold text-gray-900 mb-1">कोणतीही बातमी उपलब्ध नाही</h2>
          <p className="text-xs text-gray-500">निवडलेल्या फिल्टरनुसार कोणताही संदेश नाही.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tips.map(tip => {
            const statusColors: Record<NewsTipStatus, string> = {
              new: 'bg-blue-50 text-blue-800 border-blue-200',
              reviewed: 'bg-amber-50 text-amber-800 border-amber-200',
              used: 'bg-emerald-50 text-emerald-800 border-emerald-200',
              rejected: 'bg-red-50 text-red-800 border-red-200',
            };

            return (
              <div
                key={tip.id}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-gray-900 font-serif">
                      {tip.sender_name}
                    </span>
                    <span className={`text-[11px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${statusColors[tip.status]}`}>
                      {tip.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-crimson-600" />
                      {tip.sender_city}
                    </span>
                    <span>•</span>
                    <a
                      href={`tel:${tip.sender_phone}`}
                      className="flex items-center gap-1 font-bold text-editorial-800 hover:text-crimson-800"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                      {tip.sender_phone}
                    </a>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(tip.created_at).toLocaleString('hi-IN')}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-800 font-serif leading-relaxed">
                  {tip.message}
                </p>

                {/* Attached Images */}
                {tip.image_urls && tip.image_urls.length > 0 && (
                  <div className="flex items-center gap-3 pt-2 overflow-x-auto">
                    {tip.image_urls.map((img, i) => (
                      <a
                        key={i}
                        href={img}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative group w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shrink-0"
                      >
                        <img src={img} alt="Tip attachment" className="w-full h-full object-cover" />
                        <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                          <ExternalLink className="w-4 h-4" />
                        </span>
                      </a>
                    ))}
                  </div>
                )}

                {/* Status Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 text-xs">
                  {tip.status !== 'used' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(tip.id, 'used')}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>बातमी वापरली (Mark as Used)</span>
                    </button>
                  )}
                  {tip.status !== 'reviewed' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(tip.id, 'reviewed')}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold border border-amber-300 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>तपासली (Reviewed)</span>
                    </button>
                  )}
                  {tip.status !== 'rejected' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(tip.id, 'rejected')}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-800 font-bold border border-red-300 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                      <span>नाकारली (Reject)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
