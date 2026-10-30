import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { SEOHead } from '@/components/common/SEOHead';
import { repository } from '@/lib/repository';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  PhoneCall, 
  Mail, 
  Image as ImageIcon,
  Plus,
  Trash2
} from 'lucide-react';

export const NewsTipsPage: React.FC = () => {
  const { t } = useLanguage();

  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderCity, setSenderCity] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    if (imageUrls.length >= 5) {
      alert('आप अधिकतम 5 तस्वीरें संलग्न कर सकते हैं।');
      return;
    }
    setImageUrls([...imageUrls, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await repository.submitNewsTip({
        sender_name: senderName,
        sender_phone: senderPhone,
        sender_city: senderCity,
        message,
        image_urls: imageUrls,
        honeypot,
      });

      if (res.success) {
        setSuccess(true);
        setSenderName('');
        setSenderPhone('');
        setSenderCity('');
        setMessage('');
        setImageUrls([]);
      } else {
        setError(res.error || 'समाचार भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
      }
    } catch {
      setError('सर्वर से संपर्क नहीं हो सका। कृपया अपनी इंटरनेट कनेक्टिविटी जांचें।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between selection:bg-crimson-100 selection:text-crimson-900">
      <SEOHead
        title="समाचार भेजें (Citizen Journalism) | दैनिक जगत समीक्षा"
        description="दैनिक जगत समीक्षा को अपने शहर, गांव या क्षेत्र की जनसरोकार से जुड़ी खबरें, फोटो और वीडियो सीधे न्यूज़डेस्क को भेजें।"
      />

      <div>
        <Header />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-editorial-500">
            <Link to="/" className="hover:text-crimson-800 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('backToHome')}</span>
            </Link>
            <span>/</span>
            <span className="text-crimson-800 font-bold">{t('newsTips')}</span>
          </div>

          {/* Heading Banner */}
          <div className="bg-gradient-to-r from-editorial-950 via-editorial-900 to-crimson-950 text-white rounded-xl p-6 sm:p-8 shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-crimson-800 text-white rounded-md shadow-xs">
                <Send className="w-4 h-4" />
              </span>
              <h1 className="font-masthead text-2xl sm:text-3xl font-black text-white tracking-tight">
                {t('submitNewsTip')} (Citizen Newsroom)
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-editorial-200 font-serif leading-relaxed max-w-2xl">
              क्या आपके क्षेत्र में कोई जनहितकारी मुद्दा, भ्रष्टाचार, दुर्घटना या विशेष उपलब्धि हुई है? अपनी खबर, तस्वीरें और विवरण दैनिक जगत समीक्षा के संपादकीय कक्ष को सीधे भेजें।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Form */}
            <div className="md:col-span-8 bg-white border border-paper-border rounded-xl p-6 sm:p-8 shadow-xs">
              {success ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-masthead text-2xl font-bold text-editorial-950">
                    आपकी खबर सफलतापूर्वक प्राप्त हुई!
                  </h3>
                  <p className="text-xs sm:text-sm text-editorial-600 font-serif max-w-md mx-auto">
                    दैनिक जगत समीक्षा के संपादकीय डेस्क द्वारा तथ्य सत्यापन के उपरांत इसे प्रमुखता से प्रकाशित किया जाएगा। जनसरोकार में सहभागिता के लिए धन्यवाद।
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="mt-4 px-6 py-2 bg-crimson-800 hover:bg-crimson-900 text-white font-bold text-xs rounded-lg shadow-sm transition-colors"
                  >
                    एक और खबर भेजें
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-300 text-red-800 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Honeypot hidden input */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="website_url_check"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={e => setHoneypot(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-editorial-900 mb-1">
                        आपका पूरा नाम (Your Name) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="उदा. रमेश पाटील"
                        value={senderName}
                        onChange={e => setSenderName(e.target.value)}
                        className="w-full border border-editorial-200 rounded-lg p-2.5 text-xs text-editorial-900 focus:ring-2 focus:ring-crimson-800 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-editorial-900 mb-1">
                        मोबाइल / व्हाट्सएप नंबर (Phone / WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="उदा. +91 98220 12345"
                        value={senderPhone}
                        onChange={e => setSenderPhone(e.target.value)}
                        className="w-full border border-editorial-200 rounded-lg p-2.5 text-xs text-editorial-900 focus:ring-2 focus:ring-crimson-800 outline-hidden font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-editorial-900 mb-1">
                      शहर / कस्बा / तहसील (City / Location) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. भांडुप, मुंबई / शिवाजी नगर, पुणे"
                      value={senderCity}
                      onChange={e => setSenderCity(e.target.value)}
                      className="w-full border border-editorial-200 rounded-lg p-2.5 text-xs text-editorial-900 focus:ring-2 focus:ring-crimson-800 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-editorial-900 mb-1">
                      समाचार का विस्तृत विवरण (Story Message / Tip Details) *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="घटना क्या है, कब और कहां घटी? संबंधित अधिकारी या प्रत्यक्षदर्शियों की जानकारी लिखें..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className="w-full border border-editorial-200 rounded-lg p-3 text-xs text-editorial-900 focus:ring-2 focus:ring-crimson-800 outline-hidden leading-relaxed font-serif"
                    />
                  </div>

                  {/* Photo URLs Attachment */}
                  <div className="space-y-2 pt-2 border-t border-editorial-100">
                    <label className="block font-semibold text-editorial-900">
                      फोटो लिंक जोड़ें (Attach Image URLs - Max 5)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://example.com/photo.jpg"
                        value={newImageUrl}
                        onChange={e => setNewImageUrl(e.target.value)}
                        className="flex-1 border border-editorial-200 rounded-lg p-2 text-xs text-editorial-900 outline-hidden font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-3 py-2 bg-editorial-100 hover:bg-editorial-200 text-editorial-800 rounded-lg font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>जोड़ें</span>
                      </button>
                    </div>

                    {imageUrls.length > 0 && (
                      <div className="space-y-1.5 pt-2">
                        {imageUrls.map((url, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 bg-editorial-50 border rounded-lg text-xs"
                          >
                            <span className="truncate max-w-xs font-mono text-[11px] text-editorial-700">
                              {url}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-2 pt-2 text-xs text-editorial-700">
                    <input
                      type="checkbox"
                      id="privacy-consent-tip"
                      required
                      className="mt-0.5 rounded border-editorial-300 text-crimson-800 focus:ring-crimson-800"
                    />
                    <label htmlFor="privacy-consent-tip" className="leading-tight">
                      {language === 'hi' ? (
                        <>मैं प्रमाणित करता/करती हूँ कि दी गई जानकारी सत्य है और दैनिक जगत समीक्षा की <Link to="/privacy-policy" className="text-crimson-800 underline font-semibold">गोपनीयता नीति (Privacy Policy)</Link> के तहत संपर्क विवरण सत्यापन हेतु उपयोग की सहमति देता/देती हूँ।</>
                      ) : language === 'mr' ? (
                        <>मी प्रमाणित करतो/करते की दिलेली माहिती खरी आहे आणि दैनिक जगत समीक्षाच्या <Link to="/privacy-policy" className="text-crimson-800 underline font-semibold">गोपनीयता धोरण (Privacy Policy)</Link> अंतर्गत संपर्क पडताळणीस संमती देतो/देते.</>
                      ) : (
                        <>I certify this tip is accurate and consent to verification of my contact details under the <Link to="/privacy-policy" className="text-crimson-800 underline font-semibold">Privacy Policy</Link> (DPDP Act, 2023).</>
                      )}
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-crimson-800 hover:bg-crimson-900 text-white font-bold text-xs rounded-lg shadow-sm transition-colors uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'खबर भेजी जा रही है...' : 'संपादकीय कक्ष को खबर भेजें'}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar Security & Policy Notice */}
            <div className="md:col-span-4 space-y-6">
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
                  <span>पत्रकारिता गोपनीयता सुरक्षा</span>
                </div>
                <p className="text-xs text-amber-800 font-serif leading-relaxed">
                  दैनिक जगत समीक्षा भारतीय प्रेस परिषद (PCI) के दिशानिर्देशों के अनुसार कार्य करता है। यदि आप संवेदनशील खोजी खबर भेज रहे हैं, तो आपकी पहचान को कानूनी रूप से पूर्णतः गोपनीय रखा जाएगा।
                </p>
              </div>

              <div className="bg-white border border-paper-border rounded-xl p-5 space-y-3 text-xs text-editorial-800">
                <h4 className="font-bold font-serif text-sm text-editorial-950 pb-2 border-b">
                  सीधा संपादकीय संपर्क
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-3.5 h-3.5 text-crimson-700" />
                    <span className="font-mono font-bold">+91-8369517611</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-3.5 h-3.5 text-crimson-700" />
                    <span className="font-mono font-bold">+91-7448193748</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-crimson-700" />
                    <span className="font-mono">jagatsameeksha2014@gmail.com</span>
                  </div>
                </div>
                <p className="text-[11px] text-editorial-500 pt-2 border-t">
                  भांडुप (पश्चिम), मुंबई, महाराष्ट्र - ४०००७८
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
