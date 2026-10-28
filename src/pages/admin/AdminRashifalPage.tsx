import React, { useEffect, useState } from 'react';
import { repository } from '@/lib/repository';
import { ZODIAC_SIGNS } from '@/data/seedData';
import { HoroscopeItem, HoroscopeSign, HoroscopePeriod } from '@/types/database';
import { Sparkles, Save, CheckCircle2, Calendar, Compass, Award } from 'lucide-react';

export const AdminRashifalPage: React.FC = () => {
  const [period, setPeriod] = useState<HoroscopePeriod>('daily');
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [activeSign, setActiveSign] = useState<HoroscopeSign>('aries');
  const [formData, setFormData] = useState<Record<HoroscopeSign, { content_hi: string; lucky_number?: number; lucky_color?: string }>>(
    () => {
      const initial: Record<string, { content_hi: string; lucky_number?: number; lucky_color?: string }> = {};
      ZODIAC_SIGNS.forEach(z => {
        initial[z.sign] = { content_hi: '', lucky_number: undefined, lucky_color: '' };
      });
      return initial as Record<HoroscopeSign, { content_hi: string; lucky_number?: number; lucky_color?: string }>;
    }
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = async (dateStr: string, p: HoroscopePeriod) => {
    setIsLoading(true);
    const existing = await repository.getHoroscopes(p, dateStr);
    const updated: Record<string, { content_hi: string; lucky_number?: number; lucky_color?: string }> = {};

    ZODIAC_SIGNS.forEach(z => {
      const match = existing.find(e => e.sign === z.sign);
      updated[z.sign] = {
        content_hi: match?.content_hi || '',
        lucky_number: match?.lucky_number,
        lucky_color: match?.lucky_color || '',
      };
    });

    setFormData(updated as Record<HoroscopeSign, { content_hi: string; lucky_number?: number; lucky_color?: string }>);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData(targetDate, period);
  }, [targetDate, period]);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleFieldChange = (sign: HoroscopeSign, field: 'content_hi' | 'lucky_number' | 'lucky_color', val: unknown) => {
    setFormData(prev => ({
      ...prev,
      [sign]: {
        ...prev[sign],
        [field]: val,
      },
    }));
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const batchPayload: Array<Partial<HoroscopeItem> & { sign: HoroscopeSign; period: HoroscopePeriod }> = ZODIAC_SIGNS.map(z => ({
        sign: z.sign,
        period,
        date_for: targetDate,
        content_hi: formData[z.sign]?.content_hi || '',
        lucky_number: formData[z.sign]?.lucky_number,
        lucky_color: formData[z.sign]?.lucky_color,
        author_credit: 'दैनिक जगत समीक्षा ज्योतिष केंद्र',
      }));

      await repository.saveHoroscopesBatch(batchPayload);
      showToast('सर्व १२ राशींचे दैनिक भविष्य यशस्वीरित्या सेव्ह झाले!');
    } catch {
      alert('राशिफल सेव्ह करताना त्रुटी आली.');
    } finally {
      setIsSaving(false);
    }
  };

  const currentSignInfo = ZODIAC_SIGNS.find(z => z.sign === activeSign) || ZODIAC_SIGNS[0];

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-brand-red" />
            दैनिक राशीभविष्य व्यवस्थापन (Batch Horoscope Editor)
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            एकाच स्क्रीनवरून सर्व १२ राशींचे दैनिक भाकीत, शुभ अंक आणि शुभ रंग अपडेट करा.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1.5 shadow-2xs">
          <Calendar className="w-4 h-4 text-brand-red" />
          <input
            type="date"
            value={targetDate}
            onChange={e => setTargetDate(e.target.value)}
            className="text-xs font-mono font-bold text-gray-900 border-none outline-hidden"
          />
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* 12 Signs Navigation Bar */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5 bg-gray-50 p-2 rounded-xl border border-gray-200">
          {ZODIAC_SIGNS.map(z => {
            const hasContent = Boolean(formData[z.sign]?.content_hi?.trim());
            const isCurrent = activeSign === z.sign;
            return (
              <button
                key={z.sign}
                type="button"
                onClick={() => setActiveSign(z.sign)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs transition-all relative ${
                  isCurrent
                    ? 'bg-brand-red text-white shadow-xs font-bold'
                    : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200'
                }`}
              >
                <span className="text-base leading-none mb-0.5">{z.symbol}</span>
                <span className="text-[11px] font-serif">{z.hi}</span>
                {hasContent && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Sign Edit Card */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xl flex items-center justify-center">
                {currentSignInfo.symbol}
              </span>
              <div>
                <h3 className="font-bold text-lg text-gray-900 font-serif">
                  {currentSignInfo.hi} राशि ({currentSignInfo.en})
                </h3>
                <p className="text-xs text-gray-500 font-mono">
                  दिनांक: {targetDate}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 text-xs mb-1">
              दैनिक फलकथन (हिन्दी फलादेश) *
            </label>
            <textarea
              rows={4}
              required
              placeholder={`${currentSignInfo.hi} राशि के जातकों के लिए आज का ग्रह गोचर फल, आर्थिक लाभ, कार्यक्षेत्र एवं पारिवारिक स्थिति का विवरण लिखें...`}
              value={formData[activeSign]?.content_hi || ''}
              onChange={e => handleFieldChange(activeSign, 'content_hi', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-900 focus:ring-2 focus:ring-brand-red outline-hidden leading-relaxed font-serif"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-semibold text-gray-700 text-xs mb-1 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-600" />
                <span>शुभ अंक (Lucky Number)</span>
              </label>
              <input
                type="number"
                min="1"
                max="99"
                placeholder="उदा. 7"
                value={formData[activeSign]?.lucky_number ?? ''}
                onChange={e =>
                  handleFieldChange(activeSign, 'lucky_number', parseInt(e.target.value, 10) || undefined)
                }
                className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 text-xs mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>शुभ रंग (Lucky Color)</span>
              </label>
              <input
                type="text"
                placeholder="उदा. पीला, लाल, सफेद"
                value={formData[activeSign]?.lucky_color || ''}
                onChange={e => handleFieldChange(activeSign, 'lucky_color', e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-600">
            टीप: सर्व १२ राशींचे भाकीत भरल्यानंतर खालील बटनावर क्लिक करून एकाच वेळी सेव्ह करा.
          </p>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-brand-red hover:bg-brand-red-dark text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'सेव्ह होत आहे...' : 'सर्व १२ राशी सेव्ह करा (Batch Save)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
