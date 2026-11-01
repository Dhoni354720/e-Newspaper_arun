import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { SEOHead } from '@/components/common/SEOHead';
import { useLanguage } from '@/context/LanguageContext';
import { repository } from '@/lib/repository';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Send, 
  PenTool, 
  Sparkles, 
  ShieldCheck, 
  PhoneCall, 
  MessageSquare, 
  Award, 
  Users,
  Clock,
  HelpCircle
} from 'lucide-react';

export const MembershipPage: React.FC = () => {
  const { language, t } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [articleCategory, setArticleCategory] = useState('opinion');
  const [articleSample, setArticleSample] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const WHATSAPP_NUMBER = '8828812282';
  const PLAN_PRICE = '200';

  const categoryOptions: Record<string, { mr: string; hi: string; en: string }> = {
    opinion: { mr: 'संपादकीय व वैयक्तिक विचार (Opinions & Columns)', hi: 'संपादकीय एवं विचार (Opinions & Columns)', en: 'Opinions & Columns' },
    social: { mr: 'सामाजिक व नागरी प्रश्न (Social & Civic Issues)', hi: 'सामाजिक एवं नागरिक मुद्दे (Social & Civic Issues)', en: 'Social & Civic Issues' },
    literature: { mr: 'साहित्य, कथा व कविता (Literature & Poetry)', hi: 'साहित्य, कहानी एवं कविता (Literature & Poetry)', en: 'Literature & Poetry' },
    business: { mr: 'व्यापार, अर्थकारण व स्टार्टअप (Business & Market)', hi: 'व्यापार एवं उद्योग (Business & Market)', en: 'Business & Market' },
    local: { mr: 'स्थानिक शहर / गाव वार्ता (Local Community News)', hi: 'स्थानीय नगर / ग्राम समाचार (Local Community News)', en: 'Local Community News' },
    culture: { mr: 'संस्कृती, अध्यात्म व सण (Culture & Heritage)', hi: 'संस्कृति एवं अध्यात्म (Culture & Heritage)', en: 'Culture & Heritage' },
    other: { mr: 'इतर विशेष विषय (Other Special Topics)', hi: 'अन्य विशेष विषय (Other Special Topics)', en: 'Other Special Topics' },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      alert('कृपया आपले नाव व व्हॉट्सॲप नंबर प्रविष्ट करा.');
      return;
    }

    setIsSubmitting(true);

    const catLabel = categoryOptions[articleCategory]?.[language] || articleCategory;

    // Build formatted message for WhatsApp redirection
    const formattedMessage = [
      `*दैनिक जगत समीक्षा विशेष सदस्यतेसाठी अर्ज*`,
      `---------------------------------`,
      `👤 *नाव:* ${fullName.trim()}`,
      `📱 *मोबाइल / व्हॉट्सॲप:* ${phone.trim()}`,
      `📧 *ईमेल:* ${email.trim() || 'दिलेला नाही'}`,
      `📍 *शहर / पत्ता:* ${city.trim() || 'कल्याण / महाराष्ट्र'}`,
      `✍️ *आलेखाचा प्रकार:* ${catLabel}`,
      `📝 *आलेखाचा विषय / संक्षिप्त माहिती:*`,
      `${articleSample.trim() || 'मला माझे वैयक्तिक लेख या संकेतस्थळावर प्रकाशित करायचे आहेत.'}`,
      `---------------------------------`,
      `💰 *सदस्यता शुल्क:* ₹${PLAN_PRICE} प्रति महिना`,
      `🎯 *उद्देश:* स्वतःचे वैयक्तिक लेख, विचार व बातम्या थेट संकेतस्थळावर संपादकांकडून अपलोड करून घेणे.`,
      `\nकृपया माझी सदस्यता सुरू करून पुढील प्रक्रिया सांगावी. धन्यवाद!`
    ].join('\n');

    try {
      // Record submission in repository contact/membership lead store
      await repository.submitContactMessage({
        name: fullName.trim(),
        email: email.trim() || 'membership-lead@jagatsameeksha.com',
        phone: phone.trim(),
        subject: `[सदस्यता ₹${PLAN_PRICE}/महिना] ${fullName.trim()} - आलेख प्रकाशन`,
        message: `शहर: ${city} | आलेख वर्ग: ${catLabel} | योजना: ₹${PLAN_PRICE}/महिना | माहिती: ${articleSample}`,
      });
    } catch {
      // Continue to WhatsApp redirect even if offline store encounters an issue
    }

    // Open WhatsApp directly with target 8828812282
    const waUrl = `https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(formattedMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between selection:bg-crimson-100 selection:text-crimson-900">
      <SEOHead
        title="विशेष सदस्य नोंदणी (Membership ₹200/Month) | दैनिक जगत समीक्षा"
        description="दैनिक जगत समीक्षाच्या विशेष सदस्यतेसाठी अर्ज करा (फक्त ₹२००/महिना). आपले स्वतःचे वैयक्तिक आलेख, विचार आणि बातम्या थेट संकेतस्थळावर प्रसिद्ध करा."
      />

      <div>
        <Header />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-editorial-500">
            <Link to="/" className="hover:text-crimson-800 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('backToHome')}</span>
            </Link>
            <span>/</span>
            <span className="text-crimson-800 font-bold">
              {language === 'mr' ? 'सदस्यता' : language === 'hi' ? 'सदस्यता' : 'Membership'}
            </span>
          </div>

          {/* Hero Masthead Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-editorial-950 via-crimson-950 to-editorial-900 text-white p-6 sm:p-10 shadow-xl border-2 border-amber-500/40">
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-editorial-950 text-xs font-black uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>विशेष लेखक व वाचक सदस्यता योजना</span>
              </div>

              <h1 className="font-masthead text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                आपले स्वतःचे आलेख आता थेट <span className="text-amber-400 font-serif">दैनिक जगत समीक्षावर</span> प्रसिद्ध करा
              </h1>

              <p className="text-sm sm:text-base text-gray-200 font-serif leading-relaxed">
                ही सदस्यता विशेषतः अशा विचारवंत, साहित्यिक, अभ्यासक आणि नागरिकांसाठी आहे ज्यांना आपले विचार, विश्लेषण आणि बातम्या थेट आमच्या संकेतस्थळावर लाखो वाचकांपर्यंत पोहोचवायच्या आहेत. 
              </p>

              {/* Price Tag Badge */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <div className="bg-amber-400 text-editorial-950 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-md">
                  <span className="text-xs uppercase tracking-wide">सदस्यता शुल्क:</span>
                  <span className="text-2xl sm:text-3xl font-black font-mono">₹२००</span>
                  <span className="text-xs font-medium">/ महिना (Per Month)</span>
                </div>

                <a
                  href={`https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent('नमस्कार, मला दैनिक जगत समीक्षाच्या ₹२००/महिना सदस्यतेबद्दल माहिती हवी आहे.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>थेट व्हॉट्सॲपवर बोला: {WHATSAPP_NUMBER}</span>
                </a>
              </div>
            </div>

            {/* Background Accent Graphics */}
            <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 bg-crimson-600/10 rounded-full blur-3xl pointer-events-none"></div>
          </div>

          {/* Core Benefits 4-Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-paper-border shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-crimson-50 text-crimson-800 flex items-center justify-center font-bold">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-editorial-950">
                वैयक्तिक लेख प्रकाशन
              </h3>
              <p className="text-xs text-editorial-600 leading-relaxed font-serif">
                सदस्यता घेतल्यानंतर तुम्ही तुमचे वैयक्तिक लेख थेट प्रशासक/संपादकांना सांगून संकेतस्थळावर प्रकाशित करू शकाल.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-paper-border shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-editorial-950">
                संपादकांशी थेट संपर्क
              </h3>
              <p className="text-xs text-editorial-600 leading-relaxed font-serif">
                ८८२८८१२२८२ या विशेष व्हॉट्सॲप क्रमांकावर संपादकीय टीमशी थेट संवाद व त्वरित लेख मंजुरी.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-paper-border shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-editorial-950">
                अधिकृत लेखक बायलाईन
              </h3>
              <p className="text-xs text-editorial-600 leading-relaxed font-serif">
                प्रत्येक लेखाखाली तुमचे स्वतःचे नाव, लेखक परिचय व छायाचित्र देऊन अधिकृत लेखकाचा मान दिला जाईल.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-paper-border shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-editorial-950">
                विस्तृत वाचक वर्ग
              </h3>
              <p className="text-xs text-editorial-600 leading-relaxed font-serif">
                मुंबई, कल्याण, ठाणे व संपूर्ण महाराष्ट्रातील हजारो दैनंदिन वाचकांपर्यंत आपले विचार पोहोचवा.
              </p>
            </div>
          </div>

          {/* Form & Instructions Split Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Explanatory Card (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-6 space-y-4">
                <h3 className="font-serif font-bold text-lg text-amber-950 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-700" />
                  <span>सदस्यतेचे नियम व कार्यपद्धती</span>
                </h3>

                <ul className="space-y-3 text-xs text-amber-900 leading-relaxed font-serif">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>मासिक शुल्क:</strong> प्रति महिना ₹२०० (कोणतीही छुपी फी नाही).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>लेख पाठवणे:</strong> फॉर्म भरल्यानंतर थेट व्हॉट्सॲप (8828812282) द्वारे लेख पाठवता येईल.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>संपादकीय दर्जा:</strong> सामाजिक सलोखा आणि सत्यतेचे नियम पाळणारे सर्व लेख प्राधान्याने अपलोड केले जातील.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>सोशल शेअरिंग:</strong> प्रकाशित झालेल्या लेखाची डिजिटल लिंक आपल्याला दिली जाईल, जी आपण सहज शेअर करू शकाल.</span>
                  </li>
                </ul>

                <div className="pt-3 border-t border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-crimson-800 text-white flex items-center justify-center font-bold shrink-0">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-amber-900 font-bold">थेट मदत व हेल्पलाइन:</p>
                      <a href="tel:8828812282" className="text-sm font-mono font-bold text-crimson-800 hover:underline">
                        +91 8828812282
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Office Location */}
              <div className="bg-white border border-paper-border rounded-2xl p-5 text-xs text-editorial-600 space-y-1">
                <p className="font-bold text-editorial-900">दैनिक जगत समीक्षा मुख्य कार्यालय:</p>
                <p>कल्याण, महाराष्ट्र - ४२१३०१</p>
                <p className="text-[11px] text-editorial-500">RNI क्र. MAHHIN/2014/57312 • मुख्य संपादक: अरुण रमाकांत तिवारी</p>
              </div>
            </div>

            {/* Right Column: Interactive Membership Application Form (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border-2 border-editorial-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-black text-editorial-950">
                  सदस्यतेसाठी ऑनलाईन अर्ज करा
                </h2>
                <p className="text-xs text-editorial-600 mt-1">
                  खालील माहिती भरून सबमिट करा. हा अर्ज थेट <span className="font-mono font-bold text-crimson-800">८८२८८१२२८२</span> या क्रमांकावर व्हॉट्सॲपद्वारे जोडला जाईल.
                </p>
              </div>

              {submitted && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>आपला अर्ज यशस्वीरीत्या तयार झाला आहे!</span>
                  </div>
                  <p>
                    आम्ही आपल्याला थेट व्हॉट्सॲप विंडोमध्ये रीडायरेक्ट केले आहे. जर विंडो उघडली नसेल तर खालील बटणावर क्लिक करा:
                  </p>
                  <a
                    href={`https://wa.me/91${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-bold"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>व्हॉट्सॲप उघडा (8828812282)</span>
                  </a>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Full Name */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    पूर्ण नाव (Full Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="उदा. राजेश सूर्यकांत पाटील"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-crimson-800"
                  />
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      व्हॉट्सॲप / मोबाइल नंबर *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="उदा. 9876543210"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-crimson-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      ईमेल पत्ता (Email)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="उदा. yourname@gmail.com"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-crimson-800"
                    />
                  </div>
                </div>

                {/* City & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      शहर / परिसर (City / Location) *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="उदा. कल्याण / ठाणे / मुंबई / पुणे"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-crimson-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      आलेखाचे मुख्य क्षेत्र (Article Category) *
                    </label>
                    <select
                      value={articleCategory}
                      onChange={(e) => setArticleCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-crimson-800 bg-white"
                    >
                      {Object.entries(categoryOptions).map(([key, val]) => (
                        <option key={key} value={key}>
                          {val[language] || val.mr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Article Description / Sample */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    आपल्या लेखाचे विषय किंवा संक्षिप्त माहिती (Brief Note / Topics)
                  </label>
                  <textarea
                    rows={4}
                    value={articleSample}
                    onChange={(e) => setArticleSample(e.target.value)}
                    placeholder="उदा. मला स्थानिक पायाभूत सुविधा, सामाजिक समस्या किंवा कृषी संदर्भातील विचार नियमितपणे मांडायचे आहेत..."
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-crimson-800"
                  />
                </div>

                {/* Selected Plan confirmation card */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-900 block">निवडलेली सदस्यता योजना:</span>
                    <span className="text-sm font-serif text-amber-800">मासिक वैयक्तिक आलेख प्रकाशन विशेषाधिकार</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-amber-950 font-mono">₹२००</span>
                    <span className="text-[11px] text-amber-800 block">/ प्रति महिना</span>
                  </div>
                </div>

                {/* Submit and WhatsApp Redirect Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-crimson-800 to-crimson-900 hover:from-crimson-700 hover:to-crimson-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting ? 'अर्ज पाठवला जात आहे...' : `अर्ज सबमिट करा व 8828812282 वर व्हॉट्सॲप उघडा`}
                  </span>
                </button>

                <p className="text-[11px] text-gray-500 text-center">
                  बटण दाबल्यावर आपल्या व्हॉट्सॲपवर पूर्व-लिखित संदेशासह ८८२८८१२२८२ क्रमांक उघडेल.
                </p>
              </form>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
