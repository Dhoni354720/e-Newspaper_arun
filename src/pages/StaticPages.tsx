import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { BreakingNewsTicker } from '@/components/common/BreakingNewsTicker';
import { Footer } from '@/components/common/Footer';
import { SEOHead } from '@/components/common/SEOHead';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, Shield, FileText, ArrowLeft, Award, Users, Globe2, AlertCircle, Newspaper, Zap, Search } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { settings, publicationName } = useSettings();

  const content = {
    mr: {
      missionBadge: 'संपादकीय भूमिका',
      lead: `${publicationName} हे महाराष्ट्रातील आणि देशातील वाचकवर्गासाठी विश्वासार्ह, निष्पक्ष आणि निर्भीक बातम्या देणारे स्वतंत्र डिजिटल वृत्तपत्र व्यासपीठ आहे. डिजिटल क्रांतीच्या युगात सत्याचा शोध घेऊन लोकशाहीच्या चौथ्या स्तंभाची निष्ठा जपणे हे आमचे सर्वोच्च कर्तव्य आहे.`,
      principlesTitle: 'आमची संपादकीय मूल्ये',
      p1: 'सत्य आणि अचूकता : कोणतीही बातमी प्रसिद्ध करण्यापूर्वी प्राथमिक स्रोतांकडून पडताळणी करणे.',
      p2: 'निष्पक्षता : कोणत्याही राजकीय, आर्थिक किंवा वैयक्तिक दबावाखाली न येता सर्व बाजू मांडणे.',
      p3: 'बहुभाषिक पोहोच : मराठी, हिंदी आणि इंग्रजी या तिन्ही भाषांमध्ये वाचकांपर्यंत माहिती पोहोचवणे.',
      p4: 'स्थानिक ते जागतिक : मुंबई, पुणे, मराठवाडा, विदर्भापासून ते देश-विदेशातील महत्त्वाच्या घटनांचे संतुलित विश्लेषण.',
      note: `टीप: ${publicationName} हे स्वतंत्र डिजिटल पत्रकारीता तत्त्वांवर आधारित असून वाचकहित हेच आमचे अंतिम ध्येय आहे.`,
    },
    hi: {
      missionBadge: 'संपादकीय उद्देश्य',
      lead: `${publicationName} भारत और महाराष्ट्र के पाठकों के लिए विश्वसनीय, निष्पक्ष और निर्भीक समाचार प्रदान करने वाला स्वतंत्र डिजिटल समाचार पत्र मंच है। डिजिटल युग में सत्य की खोज और लोकतंत्र के चौथे स्तंभ की गरिमा बनाए रखना हमारा सर्वोच्च कर्तव्य है।`,
      principlesTitle: 'हमारे संपादकीय सिद्धांत',
      p1: 'सत्य और सटीकता : किसी भी समाचार को प्रकाशित करने से पहले प्राथमिक स्रोतों से सत्यापन।',
      p2: 'निष्पक्षता : किसी भी राजनीतिक, आर्थिक या व्यक्तिगत दबाव के बिना सभी पक्षों को प्रस्तुत करना।',
      p3: 'बहुभाषी पहुंच : मराठी, हिंदी और अंग्रेजी तीनों भाषाओं में पाठकों तक समय पर सूचनाएं पहुंचाना।',
      p4: 'स्थानीय से वैश्विक : महाराष्ट्र के सभी संभागों से लेकर राष्ट्रीय और वैश्विक परिप्रेक्ष्य का संतुलित विश्लेषण।',
      note: 'नोट: यह मंच स्वतंत्र डिजिटल पत्रकारिता के उच्चतम मानकों के प्रति समर्पित है।',
    },
    en: {
      missionBadge: 'Editorial Mission',
      lead: `${publicationName} is an independent, non-partisan digital newspaper committed to delivering verified, fearless journalism to readers across Maharashtra, India, and the world. In the digital era, upholding democratic accountability through investigative rigour is our guiding principle.`,
      principlesTitle: 'Our Core Principles',
      p1: 'Truth & Verification: Every dispatch is corroborated with primary sources prior to publication.',
      p2: 'Editorial Independence: Impartial reporting free from political affiliations or commercial influence.',
      p3: 'Multilingual Reach: Publishing simultaneously in Marathi, Hindi, and English for inclusive civic discourse.',
      p4: 'Grassroots to Global: Deep regional coverage spanning Mumbai, Pune, Marathwada, and Vidarbha alongside national and international developments.',
      note: 'Note: Dedicated to authentic editorial integrity, public interest, and high-speed digital journalism.',
    },
  }[language];

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between selection:bg-crimson-100 selection:text-crimson-900">
      <SEOHead title={t('aboutUs')} description={`About ${publicationName} - Independent Digital Journalism`} />
      <div>
        <Header />
        <BreakingNewsTicker />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center pb-8 border-b border-paper-border mb-8">
            <span className="text-xs font-bold text-crimson-800 uppercase tracking-wider block mb-1">
              {content.missionBadge}
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-black text-editorial-950 mb-3">
              {publicationName}
            </h1>
            <p className="text-lg font-serif italic text-editorial-700">
              "{settings.tagline}"
            </p>
          </div>

          <div className="space-y-6 text-editorial-800 leading-relaxed font-sans text-base sm:text-lg">
            <p className="drop-cap">
              {content.lead}
            </p>
            <h2 className="font-serif text-2xl font-bold text-editorial-950 pt-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-crimson-800" />
              {content.principlesTitle}
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-base">
              <li>{content.p1}</li>
              <li>{content.p2}</li>
              <li>{content.p3}</li>
              <li>{content.p4}</li>
            </ul>
            <div className="p-4 bg-paper-subtle border-l-4 border-crimson-800 rounded-r text-sm text-editorial-600 mt-6">
              <em>{content.note}</em>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { settings, publicationName } = useSettings();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    honeypot: '',
  });

  const labels = {
    mr: {
      subtitle: 'संपादकीय कक्ष, बातम्यांचे वृत्त किंवा जाहिरात संपर्कासाठी खालील माहिती वापरा.',
      bureauTitle: 'संपादकीय कार्यालय',
      hours: 'वेळ : सोमवार ते शनिवार (सकाळी ९:०० ते संध्याकाळी ६:०० IST)',
      formTitle: 'आम्हाला संदेश पाठवा',
      name: 'पूर्ण नाव *',
      namePlaceholder: 'आपले नाव',
      email: 'ईमेल पत्ता *',
      emailPlaceholder: 'your@email.com',
      subject: 'विषय',
      subjectPlaceholder: 'उदा. बातमीबाबत माहिती / अभिप्राय',
      message: 'संदेश *',
      messagePlaceholder: 'आपला संदेश येथे लिहा...',
      sendBtn: 'संदेश पाठवा',
      successTitle: 'आपला संदेश प्राप्त झाला!',
      successMsg: 'आमचा संपादकीय प्रतिनिधी लवकरात लवकर आपल्याशी संपर्क साधेल.',
      sendAnother: 'दुसरा संदेश पाठवा',
    },
    hi: {
      subtitle: 'संपादकीय कक्ष, समाचार सुझाव या विज्ञापन संपर्क के लिए नीचे दी गई जानकारी का उपयोग करें।',
      bureauTitle: 'संपादकीय कार्यालय',
      hours: 'समय : सोमवार से शनिवार (प्रातः ९:०० से सायं ६:०० IST)',
      formTitle: 'हमें संदेश भेजें',
      name: 'पूरा नाम *',
      namePlaceholder: 'आपका नाम',
      email: 'ईमेल पता *',
      emailPlaceholder: 'your@email.com',
      subject: 'विषय',
      subjectPlaceholder: 'उदा. समाचार सुझाव / प्रतिक्रिया',
      message: 'संदेश *',
      messagePlaceholder: 'अपना संदेश यहाँ लिखें...',
      sendBtn: 'संदेश भेजें',
      successTitle: 'आपका संदेश प्राप्त हुआ!',
      successMsg: 'हमारा संपादकीय प्रतिनिधि शीघ्र ही आपसे संपर्क करेगा।',
      sendAnother: 'दूसरा संदेश भेजें',
    },
    en: {
      subtitle: 'Reach out to our editorial desk, newsroom leads, or advertising bureau.',
      bureauTitle: 'Editorial Bureau',
      hours: 'Hours: Monday to Saturday (09:00 AM to 06:00 PM IST)',
      formTitle: 'Send Us a Message',
      name: 'Full Name *',
      namePlaceholder: 'Your full name',
      email: 'Email Address *',
      emailPlaceholder: 'your@email.com',
      subject: 'Subject',
      subjectPlaceholder: 'e.g., News Tip / Editorial Feedback',
      message: 'Message *',
      messagePlaceholder: 'Type your message here...',
      sendBtn: 'Send Message',
      successTitle: 'Message Received Successfully!',
      successMsg: 'Our editorial desk will review your message and reply promptly.',
      sendAnother: 'Send Another Message',
    },
  }[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    const res = await repository.submitContactMessage({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
      honeypot: formData.honeypot,
    });

    setIsSubmitting(false);

    if (res.success) {
      setSubmitted(true);
    } else {
      setFormError(res.error || 'त्रुटी आढळली');
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between selection:bg-crimson-100 selection:text-crimson-900">
      <SEOHead title={t('contactUs')} description={`Contact editorial desk at ${publicationName}`} />
      <div>
        <Header />
        <BreakingNewsTicker />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center pb-8 border-b border-paper-border mb-10">
            <h1 className="font-serif text-4xl font-black text-editorial-950 mb-2">
              {t('contactUs')}
            </h1>
            <p className="text-editorial-600 text-sm">
              {labels.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Contact Details (5 cols) */}
            <div className="md:col-span-5 bg-white border border-paper-border rounded-xl p-6 space-y-6">
              <h2 className="font-serif text-xl font-bold text-editorial-950 border-b border-paper-border pb-3">
                {labels.bureauTitle}
              </h2>
              <ul className="space-y-4 text-sm text-editorial-700">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-crimson-800 flex-shrink-0 mt-0.5" />
                  <span>{settings.office_address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-crimson-800 flex-shrink-0" />
                  <a href={`tel:${settings.contact_phone}`} className="hover:text-crimson-800 transition-colors">
                    {settings.contact_phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-crimson-800 flex-shrink-0" />
                  <a href={`mailto:${settings.contact_email}`} className="hover:text-crimson-800 transition-colors">
                    {settings.contact_email}
                  </a>
                </li>
              </ul>
              <div className="pt-4 border-t border-paper-border text-xs text-editorial-500">
                {labels.hours}
              </div>
            </div>

            {/* Interactive Feedback Form (7 cols) */}
            <div className="md:col-span-7 bg-white border border-paper-border rounded-xl p-6">
              <h2 className="font-serif text-xl font-bold text-editorial-950 mb-4">
                {labels.formTitle}
              </h2>

              {formError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="font-bold text-emerald-900 text-base">{labels.successTitle}</h3>
                  <p className="text-xs text-emerald-700">
                    {labels.successMsg}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '', honeypot: '' });
                    }}
                    className="text-xs font-semibold text-emerald-800 underline mt-2"
                  >
                    {labels.sendAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot field (hidden from legitimate users, catches spam bots) */}
                  <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                    <label htmlFor="hp_website">Leave this field blank</label>
                    <input
                      id="hp_website"
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.honeypot}
                      onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-editorial-700 block mb-1">
                      {labels.name}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={labels.namePlaceholder}
                      className="w-full px-3 py-2 text-sm bg-white border border-editorial-300 rounded focus:ring-1 focus:ring-crimson-800 focus:border-crimson-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-editorial-700 block mb-1">
                      {labels.email}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={labels.emailPlaceholder}
                      className="w-full px-3 py-2 text-sm bg-white border border-editorial-300 rounded focus:ring-1 focus:ring-crimson-800 focus:border-crimson-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-editorial-700 block mb-1">
                      {language === 'mr' ? 'फोन क्रमांक' : language === 'hi' ? 'फ़ोन नंबर' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-3 py-2 text-sm bg-white border border-editorial-300 rounded focus:ring-1 focus:ring-crimson-800 focus:border-crimson-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-editorial-700 block mb-1">
                      {labels.subject}
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder={labels.subjectPlaceholder}
                      className="w-full px-3 py-2 text-sm bg-white border border-editorial-300 rounded focus:ring-1 focus:ring-crimson-800 focus:border-crimson-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-editorial-700 block mb-1">
                      {labels.message}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={labels.messagePlaceholder}
                      className="w-full px-3 py-2 text-sm bg-white border border-editorial-300 rounded focus:ring-1 focus:ring-crimson-800 focus:border-crimson-800"
                    ></textarea>
                  </div>
                  <div className="flex items-start gap-2 pt-1 text-xs text-editorial-600">
                    <input
                      type="checkbox"
                      id="privacy-consent-contact"
                      required
                      className="mt-0.5 rounded border-editorial-300 text-crimson-800 focus:ring-crimson-800"
                    />
                    <label htmlFor="privacy-consent-contact" className="leading-tight">
                      {language === 'hi' ? (
                        <>मैं दैनिक जगत समीक्षा की <Link to="/privacy-policy" className="text-crimson-800 underline font-semibold">गोपनीयता नीति (Privacy Policy)</Link> से सहमत हूँ और संपर्क विवरण के उपयोग की सहमति देता/देती हूँ।</>
                      ) : language === 'mr' ? (
                        <>मी दैनिक जगत समीक्षाच्या <Link to="/privacy-policy" className="text-crimson-800 underline font-semibold">गोपनीयता धोरण (Privacy Policy)</Link> शी सहमत आहे आणि संपर्क तपशील वापरास संमती देतो/देते.</>
                      ) : (
                        <>I agree to the <Link to="/privacy-policy" className="text-crimson-800 underline font-semibold">Privacy Policy</Link> and consent to the processing of my contact details.</>
                      )}
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-crimson-800 hover:bg-crimson-900 disabled:opacity-50 text-white font-bold text-xs rounded transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmitting ? (language === 'mr' ? 'पाठवत आहे...' : language === 'hi' ? 'भेजा जा रहा है...' : 'Sending...') : labels.sendBtn}
                  </button>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export const PrivacyPolicyPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { publicationName } = useSettings();

  const content = {
    mr: {
      draftNotice: 'प्रारूप सूचना: हे गोपनीयता धोरण भारताच्या डिजिटल वैयक्तिक डेटा संरक्षण कायदा (DPDP Act, 2023) च्या अनुषंगाने तयार केलेले प्रारूप असून अंतिम कायदेशीर पुनरावलोकनाच्या अधीन आहे.',
      p1: `${publicationName} आमच्या सर्व वाचकांच्या वैयक्तिक गोपनीयतेचा संपूर्ण आदर करते.`,
      s1Title: '१. आम्ही कोणती माहिती संकलित करतो (Data Collected)',
      s1Text: 'आम्ही केवळ सेवा पुरवठा, तांत्रिक विश्लेषण आणि नागरिक पत्रकारिता पडताळणीसाठी आवश्यक किमान माहिती संकलित करतो: नागरिक पत्रकारिता संदेश आणि संपर्क फॉर्मद्वारे दिलेले नाव, फोन नंबर, शहर आणि ईमेल. सायबर सुरक्षा व गैरवापर रोखण्यासाठी क्लायंट आयपी पत्ता SHA-256 सह क्रिप्टोग्राफिकरित्या हॅश (ip_hash) केला जातो; मूळ आयपी पत्ता थेट साठवला जात नाही.',
      s2Title: '२. डेटा धारणा व नष्टीकरण (Data Retention & Deletion)',
      s2Text: 'नागरिक पत्रकारिता बातम्या आणि संपर्क संदेश संपादकीय पुनरावलोकनानंतर जास्तीत जास्त १८० दिवसांच्या (६ महिने) कालावधीनंतर स्वयंचलितरित्या नष्ट केले जातात. वाचकांना त्यांच्या डेटाचे संपूर्ण निष्कासन (Right to Erasure) मागण्याचा अधिकार आहे.',
      s3Title: '३. कुकीज व तृतीय पक्ष सेवा (Cookies & Third Parties)',
      s3Text: 'स्थानिक सत्र आणि भाषा प्राधान्यांसाठी आवश्यक कुकीज वापरल्या जातात. क्लाउडफ्लेअर टर्नस्टाइल (स्पॅम प्रतिबंध) आणि ओपन-मेटिओ (हवामान माहिती) या किमान तृतीय-पक्ष सेवा वापरल्या जातात, ज्यांना वाचकांचा कोणताही वैयक्तिक डेटा विकला जात नाही.',
      s4Title: '४. डेटा संरक्षण अधिकारी व संपर्क (Grievance Redressal)',
      s4Text: 'DPDP कायद्यांतर्गत डेटा अधिकार किंवा तक्रारींसाठी संपर्क: अरुण रमाकांत तिवारी (संपादक), ईमेल: jagatsameeksha2014@gmail.com, पत्ता: भांडुप (पश्चिम), मुंबई ४०००७८.',
    },
    hi: {
      draftNotice: 'प्रारूप सूचना: यह गोपनीयता नीति भारत के डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम (DPDP Act, 2023) के अनुपालन में तैयार किया गया एक प्रारूप है तथा अंतिम कानूनी समीक्षा के अधीन है।',
      p1: `${publicationName} अपने सभी पाठकों की व्यक्तिगत गोपनीयता का पूर्ण सम्मान करता है।`,
      s1Title: '१. एकत्रित की जाने वाली जानकारी (Data Collected)',
      s1Text: 'हम केवल सेवा संचालन, पाठक संवाद और नागरिक पत्रकारिता सत्यापन हेतु न्यूनतम आवश्यक जानकारी एकत्र करते हैं: नागरिक पत्रकारिता और संपर्क फॉर्म के माध्यम से नाम, फोन नंबर, शहर एवं संदेश। सुरक्षा एवं स्पैम रोकथाम हेतु क्लाइंट आईपी एड्रेस को SHA-256 साल्टेड हैश (ip_hash) के रूप में संग्रहीत किया जाता है; कच्चा (raw) आईपी कभी भी डेटाबेस में नहीं रखा जाता।',
      s2Title: '२. डेटा अवधारण एवं निस्तारण (Data Retention & Erasure)',
      s2Text: 'नागरिक पत्रकारिता संदेश और संपर्क प्रविष्टियां संपादकीय उपयोग के पश्चात अधिकतम १८० दिनों (६ माह) तक सुरक्षित रखी जाती हैं, जिसके बाद उन्हें सुरक्षित रूप से मिटा दिया जाता है। पाठकों को अपने व्यक्तिगत डेटा को हटाने का पूर्ण अधिकार है।',
      s3Title: '३. कुकीज एवं थर्ड-पार्टी सेवाएं (Cookies & Third Parties)',
      s3Text: 'वेबसाइट पर केवल आवश्यक सत्र कुकीज (भाषा चयन एवं प्रमाणीकरण) का उपयोग किया जाता है। स्पैम सुरक्षा हेतु Cloudflare Turnstile तथा मौसम पूर्वानुमान हेतु Open-Meteo API का उपयोग होता है। हम कोई भी व्यक्तिगत डेटा कभी किसी विज्ञापनदाता या तीसरे पक्ष को नहीं बेचते।',
      s4Title: '४. शिकायत निवारण एवं संपर्क (Data Grievance Officer)',
      s4Text: 'डेटा गोपनीयता अथवा सुधार अनुरोध हेतु संपर्क सूत्र: अरुण रमाकांत तिवारी (मुख्य संपादक), ईमेल: jagatsameeksha2014@gmail.com, कार्यालय: भांडुप (पश्चिम), मुंबई ४०००७८।',
    },
    en: {
      draftNotice: 'Legal Draft Notice: This privacy policy is a compliance draft formulated in accordance with the Digital Personal Data Protection Act (DPDP Act), 2023 of India, and is subject to final legal counsel review.',
      p1: `${publicationName} respects and protects the personal privacy of all our readers and digital subscribers.`,
      s1Title: '1. Personal Data Collected & Purpose',
      s1Text: 'We collect strictly minimal necessary data when voluntarily submitted via Contact or Citizen News Tip forms: Sender Name, Phone Number, City, and Message. To prevent automated abuse while respecting privacy, client IP addresses are cryptographically salted and hashed using SHA-256 (ip_hash); raw IP addresses are never persisted in our database.',
      s2Title: '2. Data Retention & Erasure Rights',
      s2Text: 'Citizen news tips and contact inquiries are retained for a maximum retention window of 180 days for editorial follow-up, after which they are purged. Readers maintain full rights to access, correction, and erasure under DPDP Act 2023.',
      s3Title: '3. Third-Party Integrations',
      s3Text: 'Our platform utilizes Cloudflare Turnstile for CAPTCHA bot defense and Open-Meteo for regional weather bulletins. No user personal data is ever commercialized or sold to third-party ad networks.',
      s4Title: '4. Grievance Redressal & Contact',
      s4Text: 'For privacy inquiries or statutory data rights requests under DPDP Act 2023, contact: Arun Ramakant Tiwari (Chief Editor), Email: jagatsameeksha2014@gmail.com, Address: Bhandup West, Mumbai 400078.',
    },
  }[language];

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between selection:bg-crimson-100 selection:text-crimson-900">
      <SEOHead title={t('privacyPolicy')} description={`Privacy Policy of ${publicationName}`} />
      <div>
        <Header />
        <BreakingNewsTicker />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          {/* Draft Disclaimer Banner */}
          <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-600 text-amber-900 text-xs rounded-r-lg font-sans">
            <p className="font-semibold">{content.draftNotice}</p>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-black text-editorial-950 mb-6 pb-4 border-b border-paper-border">
            {t('privacyPolicy')}
          </h1>
          <div className="space-y-4 text-editorial-800 text-sm sm:text-base leading-relaxed">
            <p><strong>{publicationName}</strong> {content.p1}</p>
            <h2 className="font-serif text-xl font-bold text-editorial-950 pt-3">{content.s1Title}</h2>
            <p>{content.s1Text}</p>
            <h2 className="font-serif text-xl font-bold text-editorial-950 pt-3">{content.s2Title}</h2>
            <p>{content.s2Text}</p>
            <h2 className="font-serif text-xl font-bold text-editorial-950 pt-3">{content.s3Title}</h2>
            <p>{content.s3Text}</p>
            <h2 className="font-serif text-xl font-bold text-editorial-950 pt-3">{content.s4Title}</h2>
            <p>{content.s4Text}</p>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export const TermsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { publicationName } = useSettings();

  const content = {
    mr: {
      intro: 'या संकेतस्थळाचा वापर करून आपण खालील नियम आणि अटींशी सहमत होता:',
      s1Title: '१. कॉपीराइट आणि बौद्धिक संपदा',
      s1Text: `${publicationName} वरील सर्व बातम्या, छायाचित्रे, मथळे आणि संपादकीय मजकूर कॉपीराइट कायद्यांतर्गत संरक्षित आहेत. परवानगीशिवाय मजकुराची व्यावसायिक पुनर्निर्मिती कायदेशीर गुन्ह्यास पात्र ठरेल.`,
      s2Title: '२. वाचक अभिप्राय आणि टिप्पण्या',
      s2Text: 'वाचकांनी सामाजिक सलोखा, कायदेशीर मर्यादा आणि नैतिक मानके राखूनच अभिप्राय नोंदवावेत.',
    },
    hi: {
      intro: 'इस वेबसाइट का उपयोग करके आप निम्नलिखित नियमों और शर्तों से सहमत होते हैं:',
      s1Title: '१. कॉपीराइट और बौद्धिक संपदा',
      s1Text: `${publicationName} पर सभी समाचार, चित्र, ई-अखबार और संपादकीय सामग्री कॉपीराइट कानूनों द्वारा संरक्षित हैं। पूर्व लिखित अनुमति के बिना व्यावसायिक पुनर्प्रकाशन निषिद्ध है।`,
      s2Title: '२. पाठक टिप्पणी और आचार संहिता',
      s2Text: 'पाठकों से अपेक्षा की जाती है कि वे सामाजिक सौहार्द और मर्यादा बनाए रखते हुए ही अपनी प्रतिक्रिया दें।',
    },
    en: {
      intro: 'By accessing this publication, you agree to comply with and be bound by the following Terms of Service:',
      s1Title: '1. Intellectual Property & Copyright',
      s1Text: `All articles, photographs, digital replicas, headlines, and audio-visual materials on ${publicationName} are protected under copyright laws. Unauthorized commercial redistribution or syndication is prohibited.`,
      s2Title: '2. User Conduct & Fair Use',
      s2Text: 'Readers may share articles via standard social links and citations with appropriate attribution.',
    },
  }[language];

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between selection:bg-crimson-100 selection:text-crimson-900">
      <SEOHead title={t('termsOfService')} description={`Terms of Service for ${publicationName}`} />
      <div>
        <Header />
        <BreakingNewsTicker />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-editorial-950 mb-6 pb-4 border-b border-paper-border">
            {t('termsOfService')}
          </h1>
          <div className="space-y-4 text-editorial-800 text-sm sm:text-base leading-relaxed">
            <p>{content.intro}</p>
            <h2 className="font-serif text-xl font-bold text-editorial-950 pt-3">{content.s1Title}</h2>
            <p>{content.s1Text}</p>
            <h2 className="font-serif text-xl font-bold text-editorial-950 pt-3">{content.s2Title}</h2>
            <p>{content.s2Text}</p>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export const NotFoundPage: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between selection:bg-crimson-100 selection:text-crimson-900">
      <SEOHead title={t('pageNotFound')} description={t('pageNotFoundDesc')} />
      <div>
        <Header />
        <main className="max-w-xl mx-auto px-4 py-20 text-center">
          <span className="font-serif text-8xl font-black text-crimson-800 tracking-tight block mb-3">
            {language === 'mr' ? '४०४' : language === 'hi' ? '४०४' : '404'}
          </span>
          <h1 className="font-serif text-3xl font-bold text-editorial-950 mb-3">{t('pageNotFound')}</h1>
          <p className="text-base text-editorial-600 mb-8 max-w-md mx-auto">{t('pageNotFoundDesc')}</p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-crimson-800 hover:bg-crimson-900 text-white rounded-lg font-bold text-sm shadow-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> {t('backToHome')}
            </Link>
            <Link
              to="/epaper"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-editorial-900 rounded-lg font-semibold text-sm transition-all"
            >
              <Newspaper className="w-4 h-4 text-crimson-700" />
              <span>{language === 'hi' ? 'ई-पेपर पढ़ें' : language === 'mr' ? 'ई-पेपर वाचा' : 'Read E-Paper'}</span>
            </Link>
            <Link
              to="/flash"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-editorial-900 rounded-lg font-semibold text-sm transition-all"
            >
              <Zap className="w-4 h-4 text-amber-600" />
              <span>{language === 'hi' ? 'फ़्लैश न्यूज़' : language === 'mr' ? 'फ्लॅश न्यूज' : 'Flash News'}</span>
            </Link>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-editorial-900 rounded-lg font-semibold text-sm transition-all"
            >
              <Search className="w-4 h-4 text-editorial-600" />
              <span>{language === 'hi' ? 'समाचार खोजें' : language === 'mr' ? 'बातम्या शोधा' : 'Search News'}</span>
            </Link>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
