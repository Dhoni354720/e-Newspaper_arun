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
  Users 
} from 'lucide-react';

interface BenefitItem {
  icon: 'PenTool' | 'MessageSquare' | 'Award' | 'Users';
  title: string;
  desc: string;
}

interface RuleItem {
  label: string;
  text: string;
}

interface MembershipLocale {
  seoTitle: string;
  seoDescription: string;
  breadcrumb: string;
  heroBadge: string;
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroTitleSuffix: string;
  heroSub: string;
  feeLabel: string;
  feeAmount: string;
  feeFrequency: string;
  whatsappCta: string;
  benefits: BenefitItem[];
  rulesHeading: string;
  rules: RuleItem[];
  helplineLabel: string;
  officeTitle: string;
  officeAddress: string;
  officeRni: string;
  formHeading: string;
  formSub: string;
  successTitle: string;
  successDesc: string;
  successBtn: string;
  nameLabel: string;
  namePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  cityLabel: string;
  cityPlaceholder: string;
  categoryLabel: string;
  sampleLabel: string;
  samplePlaceholder: string;
  planLabel: string;
  planName: string;
  planPrice: string;
  planPeriod: string;
  submitSending: string;
  submitBtn: string;
  submitNote: string;
  alertValidation: string;
  waGreeting: string;
  waTitle: string;
  waName: string;
  waPhone: string;
  waEmail: string;
  waCity: string;
  waCategory: string;
  waSample: string;
  waFee: string;
  waGoal: string;
  waClosing: string;
  notProvided: string;
  defaultCity: string;
  defaultSample: string;
}

const MEMBERSHIP_CONTENT: Record<'mr' | 'hi' | 'en', MembershipLocale> = {
  mr: {
    seoTitle: 'विशेष सदस्य नोंदणी (Membership ₹200/Month) | दैनिक जगत समीक्षा',
    seoDescription: 'दैनिक जगत समीक्षाच्या विशेष सदस्यतेसाठी अर्ज करा (फक्त ₹२००/महिना). आपले स्वतःचे वैयक्तिक आलेख, विचार आणि बातम्या थेट संकेतस्थळावर प्रसिद्ध करा.',
    breadcrumb: 'सदस्यता',
    heroBadge: 'विशेष लेखक व वाचक सदस्यता योजना',
    heroTitlePrefix: 'आपले स्वतःचे आलेख आता थेट ',
    heroTitleHighlight: 'दैनिक जगत समीक्षावर',
    heroTitleSuffix: ' प्रसिद्ध करा',
    heroSub: 'ही सदस्यता विशेषतः अशा विचारवंत, साहित्यिक, अभ्यासक आणि नागरिकांसाठी आहे ज्यांना आपले विचार, विश्लेषण आणि बातम्या थेट आमच्या संकेतस्थळावर लाखो वाचकांपर्यंत पोहोचवायच्या आहेत.',
    feeLabel: 'सदस्यता शुल्क:',
    feeAmount: '₹२००',
    feeFrequency: '/ महिना (Per Month)',
    whatsappCta: 'थेट व्हॉट्सॲपवर बोला:',
    benefits: [
      {
        icon: 'PenTool',
        title: 'वैयक्तिक लेख प्रकाशन',
        desc: 'सदस्यता घेतल्यानंतर तुम्ही तुमचे वैयक्तिक लेख थेट प्रशासक/संपादकांना सांगून संकेतस्थळावर प्रकाशित करू शकाल.',
      },
      {
        icon: 'MessageSquare',
        title: 'संपादकांशी थेट संपर्क',
        desc: '८८२८८१२२८२ या विशेष व्हॉट्सॲप क्रमांकावर संपादकीय टीमशी थेट संवाद व त्वरित लेख मंजुरी.',
      },
      {
        icon: 'Award',
        title: 'अधिकृत लेखक बायलाईन',
        desc: 'प्रत्येक लेखाखाली तुमचे स्वतःचे नाव, लेखक परिचय व छायाचित्र देऊन अधिकृत लेखकाचा मान दिला जाईल.',
      },
      {
        icon: 'Users',
        title: 'विस्तृत वाचक वर्ग',
        desc: 'मुंबई, कल्याण, ठाणे व संपूर्ण महाराष्ट्रातील हजारो दैनंदिन वाचकांपर्यंत आपले विचार पोहोचवा.',
      },
    ],
    rulesHeading: 'सदस्यतेचे नियम व कार्यपद्धती',
    rules: [
      { label: 'मासिक शुल्क:', text: 'प्रति महिना ₹२०० (कोणतीही छुपी फी नाही).' },
      { label: 'लेख पाठवणे:', text: 'फॉर्म भरल्यानंतर थेट व्हॉट्सॲप (8828812282) द्वारे लेख पाठवता येईल.' },
      { label: 'संपादकीय दर्जा:', text: 'सामाजिक सलोखा आणि सत्यतेचे नियम पाळणारे सर्व लेख प्राधान्याने अपलोड केले जातील.' },
      { label: 'सोशल शेअरिंग:', text: 'प्रकाशित झालेल्या लेखाची डिजिटल लिंक आपल्याला दिली जाईल, जी आपण सहज शेअर करू शकाल.' },
    ],
    helplineLabel: 'थेट मदत व हेल्पलाइन:',
    officeTitle: 'दैनिक जगत समीक्षा मुख्य कार्यालय:',
    officeAddress: 'कल्याण, महाराष्ट्र - ४२१३०१',
    officeRni: 'RNI क्र. MAHHIN/2014/57312 • मुख्य संपादक: अरुण रमाकांत तिवारी',
    formHeading: 'सदस्यतेसाठी ऑनलाईन अर्ज करा',
    formSub: 'खालील माहिती भरून सबमिट करा. हा अर्ज थेट ८८२८८१२२८२ या क्रमांकावर व्हॉट्सॲपद्वारे जोडला जाईल.',
    successTitle: 'आपला अर्ज यशस्वीरीत्या तयार झाला आहे!',
    successDesc: 'आम्ही आपल्याला थेट व्हॉट्सॲप विंडोमध्ये रीडायरेक्ट केले आहे. जर विंडो उघडली नसेल तर खालील बटणावर क्लिक करा:',
    successBtn: 'व्हॉट्सॲप उघडा (8828812282)',
    nameLabel: 'पूर्ण नाव (Full Name) *',
    namePlaceholder: 'उदा. राजेश सूर्यकांत पाटील',
    phoneLabel: 'व्हॉट्सॲप / मोबाइल नंबर *',
    phonePlaceholder: 'उदा. 9876543210',
    emailLabel: 'ईमेल पत्ता (Email)',
    emailPlaceholder: 'उदा. yourname@gmail.com',
    cityLabel: 'शहर / परिसर (City / Location) *',
    cityPlaceholder: 'उदा. कल्याण / ठाणे / मुंबई / पुणे',
    categoryLabel: 'आलेखाचे मुख्य क्षेत्र (Article Category) *',
    sampleLabel: 'आपल्या लेखाचे विषय किंवा संक्षिप्त माहिती (Brief Note / Topics)',
    samplePlaceholder: 'उदा. मला स्थानिक पायाभूत सुविधा, सामाजिक समस्या किंवा कृषी संदर्भातील विचार नियमितपणे मांडायचे आहेत...',
    planLabel: 'निवडलेली सदस्यता योजना:',
    planName: 'मासिक वैयक्तिक आलेख प्रकाशन विशेषाधिकार',
    planPrice: '₹२००',
    planPeriod: '/ प्रति महिना',
    submitSending: 'अर्ज पाठवला जात आहे...',
    submitBtn: 'अर्ज सबमिट करा व 8828812282 वर व्हॉट्सॲप उघडा',
    submitNote: 'बटण दाबल्यावर आपल्या व्हॉट्सॲपवर पूर्व-लिखित संदेशासह ८८२८८१२२८२ क्रमांक उघडेल.',
    alertValidation: 'कृपया आपले नाव व व्हॉट्सॲप नंबर प्रविष्ट करा.',
    waGreeting: 'नमस्कार, मला दैनिक जगत समीक्षाच्या ₹२००/महिना सदस्यतेबद्दल माहिती हवी आहे.',
    waTitle: 'दैनिक जगत समीक्षा विशेष सदस्यतेसाठी अर्ज',
    waName: 'नाव:',
    waPhone: 'मोबाइल / व्हॉट्सॲप:',
    waEmail: 'ईमेल:',
    waCity: 'शहर / पत्ता:',
    waCategory: 'आलेखाचा प्रकार:',
    waSample: 'आलेखाचा विषय / संक्षिप्त माहिती:',
    waFee: 'सदस्यता शुल्क:',
    waGoal: 'उद्देश: स्वतःचे वैयक्तिक लेख, विचार व बातम्या थेट संकेतस्थळावर संपादकांकडून अपलोड करून घेणे.',
    waClosing: 'कृपया माझी सदस्यता सुरू करून पुढील प्रक्रिया सांगावी. धन्यवाद!',
    notProvided: 'दिलेला नाही',
    defaultCity: 'कल्याण / महाराष्ट्र',
    defaultSample: 'मला माझे वैयक्तिक लेख या संकेतस्थळावर प्रकाशित करायचे आहेत.',
  },
  hi: {
    seoTitle: 'विशेष सदस्य पंजीकरण (Membership ₹200/Month) | दैनिक जगत समीक्षा',
    seoDescription: 'दैनिक जगत समीक्षा की विशेष सदस्यता के लिए आवेदन करें (मात्र ₹200/माह)। अपने व्यक्तिगत आलेख, विचार और समाचार सीधे वेबसाइट पर प्रकाशित करें।',
    breadcrumb: 'सदस्यता',
    heroBadge: 'विशेष लेखक एवं पाठक सदस्यता योजना',
    heroTitlePrefix: 'अपने आलेख अब सीधे ',
    heroTitleHighlight: 'दैनिक जगत समीक्षा पर',
    heroTitleSuffix: ' प्रकाशित करें',
    heroSub: 'यह सदस्यता विशेष रूप से उन विचारकों, साहित्यकारों, शोधकर्ताओं और नागरिकों के लिए है जो अपने विचार, विश्लेषण और समाचार सीधे हमारी वेबसाइट पर लाखों पाठकों तक पहुँचाना चाहते हैं।',
    feeLabel: 'सदस्यता शुल्क:',
    feeAmount: '₹200',
    feeFrequency: '/ माह (Per Month)',
    whatsappCta: 'सीधे व्हाट्सएप पर संपर्क करें:',
    benefits: [
      {
        icon: 'PenTool',
        title: 'व्यक्तिगत लेख प्रकाशन',
        desc: 'सदस्यता लेने के बाद आप अपने व्यक्तिगत लेख सीधे संपादकीय टीम के माध्यम से वेबसाइट पर प्रकाशित कर सकेंगे।',
      },
      {
        icon: 'MessageSquare',
        title: 'संपादकों से सीधा संपर्क',
        desc: '8828812282 विशेष व्हाट्सएप नंबर पर संपादकीय टीम से सीधा संवाद एवं त्वरित अनुमोदन।',
      },
      {
        icon: 'Award',
        title: 'आधिकारिक लेखक बायलाइन',
        desc: 'प्रत्येक लेख के नीचे आपका नाम, लेखक परिचय एवं फोटो के साथ आधिकारिक लेखक का सम्मान मिलेगा।',
      },
      {
        icon: 'Users',
        title: 'विस्तृत पाठक वर्ग',
        desc: 'महाराष्ट्र, उत्तर प्रदेश, दिल्ली और देश भर के हजारों पाठकों तक अपने विचारों को पहुँचाएँ।',
      },
    ],
    rulesHeading: 'सदस्यता के नियम एवं कार्यप्रणाली',
    rules: [
      { label: 'मासिक शुल्क:', text: 'प्रति माह ₹200 (कोई छुपा शुल्क नहीं)।' },
      { label: 'लेख भेजना:', text: 'फॉर्म भरने के बाद सीधे व्हाट्सएप (8828812282) के माध्यम से लेख भेजे जा सकते हैं।' },
      { label: 'संपादकीय मानक:', text: 'सामाजिक सौहार्द और तथ्यात्मक सत्यता का पालन करने वाले लेखों को प्राथमिकता से प्रकाशित किया जाएगा।' },
      { label: 'सोशल शेयरिंग:', text: 'प्रकाशित लेख का डिजिटल लिंक आपको मिलेगा, जिसे आप आसानी से साझा कर सकते हैं।' },
    ],
    helplineLabel: 'सीधी सहायता एवं हेल्पलाइन:',
    officeTitle: 'दैनिक जगत समीक्षा मुख्य कार्यालय:',
    officeAddress: 'कल्याण, महाराष्ट्र - 421301',
    officeRni: 'RNI क्र. MAHHIN/2014/57312 • प्रधान संपादक: अरुण रमाकांत तिवारी',
    formHeading: 'सदस्यता हेतु ऑनलाइन आवेदन करें',
    formSub: 'नीचे दी गई जानकारी भरें। यह आवेदन सीधे 8828812282 पर व्हाट्सएप से जोड़ा जाएगा।',
    successTitle: 'आपका आवेदन सफलतापूर्वक तैयार हो गया है!',
    successDesc: 'हमने आपको सीधे व्हाट्सएप विंडो में रीडायरेक्ट किया है। यदि विंडो नहीं खुली तो नीचे दिए बटन पर क्लिक करें:',
    successBtn: 'व्हाट्सएप खोलें (8828812282)',
    nameLabel: 'पूरा नाम (Full Name) *',
    namePlaceholder: 'उदा. राजेश कुमार शर्मा',
    phoneLabel: 'व्हाट्सएप / मोबाइल नंबर *',
    phonePlaceholder: 'उदा. 9876543210',
    emailLabel: 'ईमेल पता (Email)',
    emailPlaceholder: 'उदा. yourname@gmail.com',
    cityLabel: 'शहर / क्षेत्र (City / Location) *',
    cityPlaceholder: 'उदा. कल्याण / मुंबई / लखनऊ / दिल्ली',
    categoryLabel: 'आलेख का मुख्य क्षेत्र (Article Category) *',
    sampleLabel: 'अपने लेख के विषय अथवा संक्षिप्त जानकारी (Brief Note / Topics)',
    samplePlaceholder: 'उदा. मैं स्थानीय विकास, सामाजिक मुद्दों अथवा नीति विश्लेषण पर नियमित विचार व्यक्त करना चाहता हूँ...',
    planLabel: 'चयनित सदस्यता योजना:',
    planName: 'मासिक व्यक्तिगत आलेख प्रकाशन विशेषाधिकार',
    planPrice: '₹200',
    planPeriod: '/ प्रति माह',
    submitSending: 'आवेदन भेजा जा रहा है...',
    submitBtn: 'आवेदन सबमिट करें और 8828812282 पर व्हाट्सएप खोलें',
    submitNote: 'बटन दबाने पर आपके व्हाट्सएप में पूर्व-लिखित संदेश के साथ 8828812282 नंबर खुल जाएगा।',
    alertValidation: 'कृपया अपना नाम और व्हाट्सएप नंबर दर्ज करें।',
    waGreeting: 'नमस्ते, मुझे दैनिक जगत समीक्षा की ₹200/माह सदस्यता के बारे में जानकारी चाहिए।',
    waTitle: 'दैनिक जगत समीक्षा विशेष सदस्यता हेतु आवेदन',
    waName: 'नाम:',
    waPhone: 'मोबाइल / व्हाट्सएप:',
    waEmail: 'ईमेल:',
    waCity: 'शहर / पता:',
    waCategory: 'आलेख का प्रकार:',
    waSample: 'आलेख का विषय / संक्षिप्त जानकारी:',
    waFee: 'सदस्यता शुल्क:',
    waGoal: 'उद्देश्य: अपने व्यक्तिगत लेख, विचार और समाचार सीधे वेबसाइट पर संपादकों द्वारा प्रकाशित करवाना।',
    waClosing: 'कृपया मेरी सदस्यता शुरू कर आगे की प्रक्रिया बताएं। धन्यवाद!',
    notProvided: 'नहीं दिया गया',
    defaultCity: 'कल्याण / महाराष्ट्र',
    defaultSample: 'मैं अपने व्यक्तिगत लेख इस वेबसाइट पर प्रकाशित करना चाहता हूँ।',
  },
  en: {
    seoTitle: 'Special Contributor Membership (₹200/Month) | Dainik Jagat Sameeksha',
    seoDescription: 'Apply for Dainik Jagat Sameeksha special membership (only ₹200/mo). Publish your independent columns, analyses, and news reports directly on our platform.',
    breadcrumb: 'Membership',
    heroBadge: 'Special Writer & Reader Membership Program',
    heroTitlePrefix: 'Publish your independent writings directly on ',
    heroTitleHighlight: 'Dainik Jagat Sameeksha',
    heroTitleSuffix: '',
    heroSub: 'This membership is tailored for thinkers, writers, researchers, and citizens who want to reach thousands of readers with their opinions, analysis, and reports.',
    feeLabel: 'Membership Fee:',
    feeAmount: '₹200',
    feeFrequency: '/ Month',
    whatsappCta: 'Chat directly on WhatsApp:',
    benefits: [
      {
        icon: 'PenTool',
        title: 'Independent Column Publishing',
        desc: 'Publish your personal columns and analytical pieces directly through our dedicated editorial desk.',
      },
      {
        icon: 'MessageSquare',
        title: 'Direct Editorial Access',
        desc: 'Direct communication and prompt review with our editorial desk via WhatsApp at 8828812282.',
      },
      {
        icon: 'Award',
        title: 'Verified Contributor Byline',
        desc: 'Each article will feature your name, author biography, and portrait with a verified contributor byline.',
      },
      {
        icon: 'Users',
        title: 'Extensive Readership',
        desc: 'Reach thousands of daily readers across Maharashtra, Uttar Pradesh, Delhi, and nationwide.',
      },
    ],
    rulesHeading: 'Membership Guidelines & Workflow',
    rules: [
      { label: 'Monthly fee:', text: '₹200 per month (transparent pricing, no hidden costs).' },
      { label: 'Submissions:', text: 'Share your draft articles directly via WhatsApp (8828812282) after submitting this form.' },
      { label: 'Editorial standards:', text: 'Articles adhering to factual accuracy and public ethics are published on priority.' },
      { label: 'Social sharing:', text: 'Receive shareable digital web links to promote your published writings.' },
    ],
    helplineLabel: 'Direct Support & Helpline:',
    officeTitle: 'Dainik Jagat Sameeksha Head Office:',
    officeAddress: 'Kalyan, Maharashtra - 421301',
    officeRni: 'RNI Reg. MAHHIN/2014/57312 • Chief Editor: Arun Ramakant Tiwari',
    formHeading: 'Apply for Membership Online',
    formSub: 'Fill in the information below. This application connects directly to WhatsApp at 8828812282.',
    successTitle: 'Your application has been prepared successfully!',
    successDesc: 'We have redirected you to WhatsApp. If the window did not open, click the button below:',
    successBtn: 'Open WhatsApp (8828812282)',
    nameLabel: 'Full Name *',
    namePlaceholder: 'e.g. Rajesh Kumar Sharma',
    phoneLabel: 'WhatsApp / Mobile Number *',
    phonePlaceholder: 'e.g. 9876543210',
    emailLabel: 'Email Address',
    emailPlaceholder: 'e.g. yourname@gmail.com',
    cityLabel: 'City / Location *',
    cityPlaceholder: 'e.g. Kalyan / Mumbai / Lucknow / Delhi',
    categoryLabel: 'Primary Writing Domain (Article Category) *',
    sampleLabel: 'Brief Topics / Notes on your writing',
    samplePlaceholder: 'e.g. I would like to regularly share perspectives on local development, social issues, or policy...',
    planLabel: 'Selected Membership Plan:',
    planName: 'Monthly Columnist & Author Publishing Privilege',
    planPrice: '₹200',
    planPeriod: '/ per month',
    submitSending: 'Submitting application...',
    submitBtn: 'Submit Application & Open WhatsApp (8828812282)',
    submitNote: 'Clicking submit opens WhatsApp with your pre-filled details to 8828812282.',
    alertValidation: 'Please enter your name and WhatsApp number.',
    waGreeting: 'Hello, I would like to enquire about the ₹200/month membership with Dainik Jagat Sameeksha.',
    waTitle: 'Dainik Jagat Sameeksha Membership Application',
    waName: 'Name:',
    waPhone: 'Mobile / WhatsApp:',
    waEmail: 'Email:',
    waCity: 'City / Location:',
    waCategory: 'Domain:',
    waSample: 'Topics / Brief Note:',
    waFee: 'Membership Fee:',
    waGoal: 'Goal: Publish independent articles, columns and reports directly on the news website.',
    waClosing: 'Kindly confirm my membership enrollment and next steps. Thank you!',
    notProvided: 'Not provided',
    defaultCity: 'Kalyan / Maharashtra',
    defaultSample: 'I would like to publish my personal articles on this news platform.',
  },
};

export const MembershipPage: React.FC = () => {
  const { language, t } = useLanguage();
  const c = MEMBERSHIP_CONTENT[language] || MEMBERSHIP_CONTENT.hi;

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
      alert(c.alertValidation);
      return;
    }

    setIsSubmitting(true);

    const catLabel = categoryOptions[articleCategory]?.[language] || articleCategory;

    // Build formatted message for WhatsApp redirection
    const formattedMessage = [
      `*${c.waTitle}*`,
      `---------------------------------`,
      `👤 *${c.waName}* ${fullName.trim()}`,
      `📱 *${c.waPhone}* ${phone.trim()}`,
      `📧 *${c.waEmail}* ${email.trim() || c.notProvided}`,
      `📍 *${c.waCity}* ${city.trim() || c.defaultCity}`,
      `✍️ *${c.waCategory}* ${catLabel}`,
      `📝 *${c.waSample}*`,
      `${articleSample.trim() || c.defaultSample}`,
      `---------------------------------`,
      `💰 *${c.waFee}* ₹${PLAN_PRICE} ${c.planPeriod}`,
      `🎯 *${c.waGoal}*`,
      `\n${c.waClosing}`
    ].join('\n');

    try {
      // Record submission in repository contact/membership lead store
      await repository.submitContactMessage({
        name: fullName.trim(),
        email: email.trim() || 'membership-lead@jagatsameeksha.com',
        phone: phone.trim(),
        subject: `[${c.breadcrumb} ₹${PLAN_PRICE}] ${fullName.trim()} - Article Author`,
        message: `City: ${city} | Category: ${catLabel} | Plan: ₹${PLAN_PRICE}/mo | Note: ${articleSample}`,
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

  const renderBenefitIcon = (icon: BenefitItem['icon']) => {
    switch (icon) {
      case 'PenTool':
        return <PenTool className="w-6 h-6" />;
      case 'MessageSquare':
        return <MessageSquare className="w-6 h-6" />;
      case 'Award':
        return <Award className="w-6 h-6" />;
      case 'Users':
      default:
        return <Users className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between selection:bg-crimson-100 selection:text-crimson-900">
      <SEOHead
        title={c.seoTitle}
        description={c.seoDescription}
      />

      <div>
        <Header />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
          {/* Breadcrumb & Switcher to Reporter Onboarding */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-editorial-500">
            <div className="flex items-center gap-2">
              <Link to="/" className="hover:text-crimson-800 transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('backToHome')}</span>
              </Link>
              <span>/</span>
              <span className="text-crimson-800 font-bold">
                {c.breadcrumb}
              </span>
            </div>

            <Link
              to="/join-reporter"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100 transition-all shadow-2xs"
            >
              <span>🎙️</span>
              <span>{language === 'mr' ? 'बातमीदार / पत्रकार नोंदणी' : language === 'hi' ? 'संवाददाता / पत्रकार जुड़ें' : 'Join as News Reporter'}</span>
            </Link>
          </div>

          {/* Hero Masthead Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-editorial-950 via-crimson-950 to-editorial-900 text-white p-6 sm:p-10 shadow-xl border-2 border-amber-500/40">
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-editorial-950 text-xs font-black uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>{c.heroBadge}</span>
              </div>

              <h1 className="font-masthead text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {c.heroTitlePrefix}<span className="text-amber-400 font-serif">{c.heroTitleHighlight}</span>{c.heroTitleSuffix}
              </h1>

              <p className="text-sm sm:text-base text-gray-200 font-serif leading-relaxed">
                {c.heroSub}
              </p>

              {/* Price Tag Badge */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <div className="bg-amber-400 text-editorial-950 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-md">
                  <span className="text-xs uppercase tracking-wide">{c.feeLabel}</span>
                  <span className="text-2xl sm:text-3xl font-black font-mono">{c.feeAmount}</span>
                  <span className="text-xs font-medium">{c.feeFrequency}</span>
                </div>

                <a
                  href={`https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(c.waGreeting)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{c.whatsappCta} {WHATSAPP_NUMBER}</span>
                </a>
              </div>
            </div>

            {/* Background Accent Graphics */}
            <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 bg-crimson-600/10 rounded-full blur-3xl pointer-events-none"></div>
          </div>

          {/* Core Benefits 4-Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {c.benefits.map((benefit, idx) => {
              const bgColors = ['bg-crimson-50 text-crimson-800', 'bg-amber-50 text-amber-800', 'bg-emerald-50 text-emerald-800', 'bg-blue-50 text-blue-800'];
              return (
                <div key={idx} className="bg-white p-6 rounded-xl border border-paper-border shadow-xs space-y-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${bgColors[idx % bgColors.length]}`}>
                    {renderBenefitIcon(benefit.icon)}
                  </div>
                  <h3 className="font-serif font-bold text-base text-editorial-950">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-editorial-600 leading-relaxed font-serif">
                    {benefit.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Form & Instructions Split Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Explanatory Card (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-6 space-y-4">
                <h3 className="font-serif font-bold text-lg text-amber-950 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-700" />
                  <span>{c.rulesHeading}</span>
                </h3>

                <ul className="space-y-3 text-xs text-amber-900 leading-relaxed font-serif">
                  {c.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>{rule.label}</strong> {rule.text}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-3 border-t border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-crimson-800 text-white flex items-center justify-center font-bold shrink-0">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-amber-900 font-bold">{c.helplineLabel}</p>
                      <a href={`tel:${WHATSAPP_NUMBER}`} className="text-sm font-mono font-bold text-crimson-800 hover:underline">
                        +91 {WHATSAPP_NUMBER}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Office Location */}
              <div className="bg-white border border-paper-border rounded-2xl p-5 text-xs text-editorial-600 space-y-1">
                <p className="font-bold text-editorial-900">{c.officeTitle}</p>
                <p>{c.officeAddress}</p>
                <p className="text-[11px] text-editorial-500">{c.officeRni}</p>
              </div>
            </div>

            {/* Right Column: Interactive Membership Application Form (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border-2 border-editorial-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-black text-editorial-950">
                  {c.formHeading}
                </h2>
                <p className="text-xs text-editorial-600 mt-1">
                  {c.formSub}
                </p>
              </div>

              {submitted && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>{c.successTitle}</span>
                  </div>
                  <p>
                    {c.successDesc}
                  </p>
                  <a
                    href={`https://wa.me/91${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-bold"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{c.successBtn}</span>
                  </a>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Full Name */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    {c.nameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={c.namePlaceholder}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-crimson-800"
                  />
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      {c.phoneLabel}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={c.phonePlaceholder}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-crimson-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      {c.emailLabel}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={c.emailPlaceholder}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-crimson-800"
                    />
                  </div>
                </div>

                {/* City & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      {c.cityLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder={c.cityPlaceholder}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-crimson-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      {c.categoryLabel}
                    </label>
                    <select
                      value={articleCategory}
                      onChange={(e) => setArticleCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-crimson-800 bg-white"
                    >
                      {Object.entries(categoryOptions).map(([key, val]) => (
                        <option key={key} value={key}>
                          {val[language] || val.hi}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Article Description / Sample */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    {c.sampleLabel}
                  </label>
                  <textarea
                    rows={4}
                    value={articleSample}
                    onChange={(e) => setArticleSample(e.target.value)}
                    placeholder={c.samplePlaceholder}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-crimson-800"
                  />
                </div>

                {/* Selected Plan confirmation card */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-900 block">{c.planLabel}</span>
                    <span className="text-sm font-serif text-amber-800">{c.planName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-amber-950 font-mono">{c.planPrice}</span>
                    <span className="text-[11px] text-amber-800 block">{c.planPeriod}</span>
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
                    {isSubmitting ? c.submitSending : c.submitBtn}
                  </span>
                </button>

                <p className="text-[11px] text-gray-500 text-center">
                  {c.submitNote}
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
