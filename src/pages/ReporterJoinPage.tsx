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
  Mic2, 
  Sparkles, 
  ShieldCheck, 
  PhoneCall, 
  MessageSquare, 
  BadgeCheck, 
  FileText, 
  MapPin, 
  Building2,
  Briefcase,
  HelpCircle
} from 'lucide-react';

interface ReporterLocale {
  seoTitle: string;
  seoDescription: string;
  breadcrumb: string;
  heroBadge: string;
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroTitleSuffix: string;
  heroSub: string;
  whatsappCta: string;
  benefits: {
    icon: 'BadgeCheck' | 'MessageSquare' | 'FileText' | 'Building2';
    title: string;
    desc: string;
  }[];
  rulesHeading: string;
  rules: { label: string; text: string }[];
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
  stateLabel: string;
  districtLabel: string;
  districtPlaceholder: string;
  beatLabel: string;
  experienceLabel: string;
  orgLabel: string;
  orgPlaceholder: string;
  resumeLabel: string;
  resumePlaceholder: string;
  samplesLabel: string;
  samplesPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitSending: string;
  submitBtn: string;
  submitNote: string;
  alertValidation: string;
  waTitle: string;
  waName: string;
  waPhone: string;
  waEmail: string;
  waLocation: string;
  waBeat: string;
  waExp: string;
  waOrg: string;
  waResume: string;
  waSamples: string;
  waMessage: string;
  waClosing: string;
  notProvided: string;
}

const REPORTER_CONTENT: Record<'mr' | 'hi' | 'en', ReporterLocale> = {
  mr: {
    seoTitle: 'पत्रकार व बातमीदार नोंदणी (Reporter Onboarding) | दैनिक जगत समीक्षा',
    seoDescription: 'दैनिक जगत समीक्षा वृत्तपत्र व डिजिटल पोर्टलसाठी तालुका, जिल्हा व शहर पातळीवर पत्रकार, बातमीदार व स्ट्रिंगर म्हणून जोडा. थेट मुख्य संपादकांशी संपर्क.',
    breadcrumb: 'पत्रकार नोंदणी',
    heroBadge: 'अधिकृत बातमीदार व स्ट्रिंगर भरती',
    heroTitlePrefix: 'दैनिक जगत समीक्षाचे ',
    heroTitleHighlight: 'अधिकृत बातमीदार / पत्रकार',
    heroTitleSuffix: ' व्हा',
    heroSub: 'आपल्या शहर, तालुका किंवा जिल्ह्यातील ताज्या घडामोडी, शोध पत्रकारिता आणि जनसमस्या थेट लाखो वाचकांपर्यंत पोहोचवा. वृत्तपत्र व्यवस्थापन आणि मुख्य संपादकांशी थेट संपर्क.',
    whatsappCta: 'थेट संपादकांशी बोला:',
    benefits: [
      {
        icon: 'BadgeCheck',
        title: 'अधिकृत पत्रकारिता ओळखपत्र (Press Card)',
        desc: 'पात्रता आणि कागदपत्र पडताळणीनंतर दैनिक जगत समीक्षाचे अधिकृत वार्ताहर ओळखपत्र प्रदान केले जाईल.',
      },
      {
        icon: 'MessageSquare',
        title: 'संपादकांशी थेट व्हॉट्सॲप संवाद',
        desc: '८८२८८१२२८२ या क्रमांकावर मुख्य संपादकीय कक्षाशी थेट जोडणी व बातम्यांना त्वरित मंजुरी.',
      },
      {
        icon: 'FileText',
        title: 'नाव व फोटोसह बायलाईन',
        desc: 'आपल्या प्रत्येक बातमी व शोध अहवालाला वृत्तपत्र आणि संकेतस्थळावर अधिकृत बातमीदार म्हणून प्रसिद्धी.',
      },
      {
        icon: 'Building2',
        title: 'विस्तृत डिजिटल व प्रिंट नेटवर्क',
        desc: 'महाराष्ट्र, उत्तर प्रदेश, दिल्ली आणि देशभरात पसरलेल्या अग्रगण्य माध्यम समूहासह काम करण्याची संधी.',
      },
    ],
    rulesHeading: 'वार्ताहर पदाच्या अटी व कार्यपद्धती',
    rules: [
      { label: 'सत्यता व निष्पक्षता:', text: 'बातम्यांमध्ये वस्तुनिष्ठता, निष्पक्षता आणि सत्यता राखणे अनिवार्य आहे.' },
      { label: 'स्थानिक वार्तांकन:', text: 'आपल्या कार्यक्षेत्रातील स्थानिक नागरी समस्या, प्रशासन व विकासकामांचे सातत्यपूर्ण वृत्तांकन.' },
      { label: 'रिझ्युमे / माहिती:', text: 'खालील फॉर्ममध्ये आपला बायोडाटा / कामाचा अनुभव किंवा बातम्यांच्या लिंक्स नक्की द्या.' },
      { label: 'त्वरित पडताळणी:', text: 'फॉर्म सबमिट केल्यावर थेट व्हॉट्सॲपवर माहिती पाठवून त्वरित मुलाखत/संवाद सुरू होईल.' },
    ],
    helplineLabel: 'थेट मुख्य संपादक कक्ष:',
    officeTitle: 'दैनिक जगत समीक्षा मुख्य कार्यालय:',
    officeAddress: 'कल्याण, महाराष्ट्र - ४२१३०१',
    officeRni: 'RNI क्र. MAHHIN/2014/57312 • संरक्षक: राकेश शंकर शेट्टी • मुख्य संपादक: अरुण रमाकांत तिवारी',
    formHeading: 'पत्रकार / बातमीदार ऑनलाईन नोंदणी अर्ज',
    formSub: 'आपली अचूक माहिती भरा. हा अर्ज थेट ८८२८८१२२८२ या क्रमांकावर मुख्य संपादकांच्या व्हॉट्सॲपवर पाठवला जाईल.',
    successTitle: 'आपला पत्रकार नोंदणी अर्ज तयार झाला आहे!',
    successDesc: 'आम्ही आपल्याला मुख्य संपादकांच्या व्हॉट्सॲप विंडोमध्ये जोडले आहे. विंडो उघडली नसेल तर खालील बटण दाबा:',
    successBtn: 'व्हॉट्सॲपवर अर्ज पाठवा (8828812282)',
    nameLabel: 'पूर्ण नाव (Full Name) *',
    namePlaceholder: 'उदा. सुनील रमेश जोशी',
    phoneLabel: 'व्हॉट्सॲप / मोबाइल नंबर *',
    phonePlaceholder: 'उदा. 9876543210',
    emailLabel: 'ईमेल पत्ता (Email)',
    emailPlaceholder: 'उदा. sunil.reporter@gmail.com',
    stateLabel: 'राज्य (State) *',
    districtLabel: 'जिल्हा / तालुका / शहर (District / Tehsil / City) *',
    districtPlaceholder: 'उदा. कल्याण, ठाणे / नाशिक / लखनौ / भोपाळ',
    beatLabel: 'वार्तांकन विषय / बीट (Reporting Beat) *',
    experienceLabel: 'पत्रकारितेतील अनुभव (Experience Level) *',
    orgLabel: 'सध्याची / पूर्वीची वृत्तसंस्था (Current or Previous Media Org)',
    orgPlaceholder: 'उदा. स्थानिक दैनिक / वृत्तवाहिनी / डिजिटल पोर्टल / स्वतंत्र पत्रकार',
    resumeLabel: 'बायोडाटा / रिझ्युमे लिंक किंवा संक्षिप्त परिचय (Resume / Bio) *',
    resumePlaceholder: 'उदा. Google Drive लिंक, LinkedIn प्रोफाइल, किंवा आपल्या शिक्षणाचा व पत्रकारिता अनुभवाचा संक्षिप्त गोषवारा...',
    samplesLabel: 'प्रकाशित बातम्यांच्या लिंक्स किंवा प्रेस कार्ड क्रमांक (Sample Links / Press ID)',
    samplesPlaceholder: 'उदा. यापूर्वी प्रसिद्ध झालेल्या बातम्यांच्या वेब लिंक्स (पर्यायी)...',
    messageLabel: 'मुख्य संपादकांस संदेश (Message to Chief Editor)',
    messagePlaceholder: 'उदा. मला माझ्या तालुक्यातील सर्वसामान्य लोकांचे प्रश्न आणि विकासाच्या बातम्या मांडायच्या आहेत...',
    submitSending: 'अर्ज पाठवला जात आहे...',
    submitBtn: 'नोंदणी अर्ज सबमिट करा व 8828812282 वर व्हॉट्सॲप उघडा',
    submitNote: 'बटण दाबल्यावर आपल्या व्हॉट्सॲपवर सर्व तपशीलांसह ८८२८८१२२८२ क्रमांकावर थेट चॅट सुरू होईल.',
    alertValidation: 'कृपया आपले नाव, व्हॉट्सॲप नंबर, जिल्हा/शहर, आणि बायोडाटा प्रविष्ट करा.',
    waTitle: 'दैनिक जगत समीक्षा - बातमीदार / पत्रकार नोंदणी अर्ज',
    waName: 'नाव:',
    waPhone: 'व्हॉट्सॲप:',
    waEmail: 'ईमेल:',
    waLocation: 'स्थान (राज्य/जिल्हा):',
    waBeat: 'वार्तांकन बीट:',
    waExp: 'अनुभव:',
    waOrg: 'मागील वृत्तसंस्था:',
    waResume: 'बायोडाटा / रिझ्युमे:',
    waSamples: 'बातम्यांचे नमुने / लिंक्स:',
    waMessage: 'संपादकांस संदेश:',
    waClosing: 'कृपया माझा अर्ज स्वीकारून दैनिक जगत समीक्षाच्या बातमीदार पदाची पुढील प्रक्रिया व ओळखपत्राबाबत मार्गदर्शन करावे. धन्यवाद!',
    notProvided: 'दिलेला नाही',
  },
  hi: {
    seoTitle: 'पत्रकार एवं संवाददाता पंजीकरण (Reporter Join) | दैनिक जगत समीक्षा',
    seoDescription: 'दैनिक जगत समीक्षा राष्ट्रीय समाचार पत्र एवं डिजिटल पोर्टल के लिए जिला, तहसील व नगर स्तर पर संवाददाता, रिपोर्टर व स्ट्रिंगर के रूप में जुड़ें। प्रधान संपादक से सीधा संपर्क।',
    breadcrumb: 'संवाददाता जुड़ें',
    heroBadge: 'आधिकारिक संवाददाता एवं स्ट्रिंगर भर्ती',
    heroTitlePrefix: 'दैनिक जगत समीक्षा के ',
    heroTitleHighlight: 'आधिकारिक पत्रकार / संवाददाता',
    heroTitleSuffix: ' बनें',
    heroSub: 'अपने क्षेत्र, जिले या तहसील की निष्पक्ष खबरें, खोजी पत्रकारिता और जनहित के मुद्दे सीधे लाखों पाठकों तक पहुँचाएँ। समाचार पत्र प्रबंधन एवं प्रधान संपादक से सीधा संपर्क।',
    whatsappCta: 'सीधे संपादक से संपर्क करें:',
    benefits: [
      {
        icon: 'BadgeCheck',
        title: 'आधिकारिक प्रेस पहचान पत्र (Press ID Card)',
        desc: 'दस्तावेज सत्यापन और योग्यता के आधार पर दैनिक जगत समीक्षा का अधिकृत संवाददाता प्रेस कार्ड प्रदान किया जाएगा।',
      },
      {
        icon: 'MessageSquare',
        title: 'प्रधान संपादक से सीधा व्हाट्सएप संपर्क',
        desc: '8828812282 पर मुख्य संपादकीय डेस्क से सीधा संवाद एवं समाचारों की त्वरित स्वीकृति व प्रकाशन।',
      },
      {
        icon: 'FileText',
        title: 'नाम एवं फोटो सहित बायलाइन',
        desc: 'आपके द्वारा प्रेषित प्रत्येक समाचार एवं विशेष रिपोर्ट को समाचार पत्र एवं पोर्टल पर लेखक बायलाइन मिलेगी।',
      },
      {
        icon: 'Building2',
        title: 'राष्ट्रीय स्तर का मीडिया नेटवर्क',
        desc: 'महाराष्ट्र, उत्तर प्रदेश, दिल्ली और देश भर में सक्रिय विश्वसनीय राष्ट्रीय समाचार पत्र समूह के साथ जुड़ने का अवसर।',
      },
    ],
    rulesHeading: 'संवाददाता नियम एवं कार्यप्रणाली',
    rules: [
      { label: 'सत्यता एवं निष्पक्षता:', text: 'सभी समाचारों में तथ्यात्मक सत्यता, निष्पक्षता और पत्रकारिता के नैतिक मानकों का पालन अनिवार्य है।' },
      { label: 'स्थानीय कवरेज:', text: 'अपने क्षेत्र की जनसमस्याओं, प्रशासनिक कार्यों और विकासपरक खबरों का नियमित प्रेषण।' },
      { label: 'बायोडाटा / रिज्यूमे:', text: 'नीचे दिए फॉर्म में अपना बायोडाटा/रिज्यूमे लिंक या पूर्व अनुभव का संक्षिप्त विवरण अवश्य लिखें।' },
      { label: 'त्वरित वार्ता:', text: 'आवेदन सबमिट करते ही आपका विवरण सीधे मुख्य संपादक के व्हाट्सएप पर प्रेषित हो जाएगा।' },
    ],
    helplineLabel: 'सीधा प्रधान संपादक कक्ष:',
    officeTitle: 'दैनिक जगत समीक्षा मुख्य कार्यालय:',
    officeAddress: 'कल्याण, महाराष्ट्र - 421301',
    officeRni: 'RNI क्र. MAHHIN/2014/57312 • संरक्षक: राकेश शंकर शेट्टी • प्रधान संपादक: अरुण रमाकांत तिवारी',
    formHeading: 'संवाददाता / रिपोर्टर ऑनलाइन पंजीकरण फॉर्म',
    formSub: 'नीचे अपनी जानकारी भरें। यह आवेदन सीधे 8828812282 पर प्रधान संपादक के व्हाट्सएप से जोड़ा जाएगा।',
    successTitle: 'आपका संवाददाता पंजीकरण आवेदन तैयार हो गया है!',
    successDesc: 'हमने आपको प्रधान संपादक के व्हाट्सएप से जोड़ दिया है। यदि विंडो नहीं खुली तो नीचे दिए बटन पर क्लिक करें:',
    successBtn: 'व्हाट्सएप पर आवेदन भेजें (8828812282)',
    nameLabel: 'पूरा नाम (Full Name) *',
    namePlaceholder: 'उदा. सुनील कुमार त्रिपाठी',
    phoneLabel: 'व्हाट्सएप / मोबाइल नंबर *',
    phonePlaceholder: 'उदा. 9876543210',
    emailLabel: 'ईमेल पता (Email)',
    emailPlaceholder: 'उदा. sunil.reporter@gmail.com',
    stateLabel: 'राज्य (State) *',
    districtLabel: 'जिला / तहसील / नगर (District / Tehsil / City) *',
    districtPlaceholder: 'उदा. लखनऊ, कानपुर / कल्याण, ठाणे / भोपाल / दिल्ली',
    beatLabel: 'वार्तांकन विषय / बीट (Reporting Beat) *',
    experienceLabel: 'पत्रकारिता अनुभव (Experience Level) *',
    orgLabel: 'वर्तमान अथवा पूर्व मीडिया संस्थान (Current or Previous Media Org)',
    orgPlaceholder: 'उदा. स्थानीय दैनिक / न्यूज चैनल / वेब पोर्टल / स्वतंत्र पत्रकार',
    resumeLabel: 'बायोडाटा / रिज्यूमे लिंक अथवा संक्षिप्त परिचय (Resume / Bio) *',
    resumePlaceholder: 'उदा. Google Drive लिंक, LinkedIn प्रोफाइल, या अपनी शिक्षा एवं पत्रकारिता अनुभव का संक्षिप्त विवरण...',
    samplesLabel: 'प्रकाशित समाचारों के लिंक या प्रेस आईडी (Sample News Links / Press ID)',
    samplesPlaceholder: 'उदा. पूर्व में प्रकाशित खबरों के वेब लिंक (वैकल्पिक)...',
    messageLabel: 'प्रधान संपादक के नाम संदेश (Message to Chief Editor)',
    messagePlaceholder: 'उदा. मैं अपने क्षेत्र की जनसमस्याओं और प्रशासनिक खबरों को निष्पक्षता से दैनिक जगत समीक्षा में उठाना चाहता हूँ...',
    submitSending: 'आवेदन भेजा जा रहा है...',
    submitBtn: 'आवेदन सबमिट करें और 8828812282 पर व्हाट्सएप खोलें',
    submitNote: 'बटन दबाने पर आपके व्हाट्सएप में संपूर्ण विवरण के साथ 8828812282 पर चैट शुरू हो जाएगी।',
    alertValidation: 'कृपया अपना नाम, व्हाट्सएप नंबर, जिला/नगर और बायोडाटा विवरण दर्ज करें।',
    waTitle: 'दैनिक जगत समीक्षा - संवाददाता / रिपोर्टर पंजीकरण आवेदन',
    waName: 'नाम:',
    waPhone: 'व्हाट्सएप:',
    waEmail: 'ईमेल:',
    waLocation: 'स्थान (राज्य/जिला):',
    waBeat: 'रिपोर्टिंग बीट:',
    waExp: 'अनुभव:',
    waOrg: 'पूर्व मीडिया संस्थान:',
    waResume: 'बायोडाटा / रिज्यूमे:',
    waSamples: 'समाचार लिंक / प्रेस कार्ड:',
    waMessage: 'संपादक को संदेश:',
    waClosing: 'कृपया मेरा आवेदन स्वीकार कर दैनिक जगत समीक्षा के संवाददाता पद की अगली प्रक्रिया व प्रेस पहचान पत्र हेतु मार्गदर्शन प्रदान करें। धन्यवाद!',
    notProvided: 'नहीं दिया गया',
  },
  en: {
    seoTitle: 'Join as News Reporter & Stringer | Dainik Jagat Sameeksha',
    seoDescription: 'Apply to join Dainik Jagat Sameeksha as a certified district reporter, field stringer, or special correspondent. Direct access to Chief Editor via WhatsApp.',
    breadcrumb: 'Reporter Connect',
    heroBadge: 'Official Field Reporter & Stringer Recruitment',
    heroTitlePrefix: 'Become an Authorized ',
    heroTitleHighlight: 'News Reporter / Correspondent',
    heroTitleSuffix: ' for Dainik Jagat Sameeksha',
    heroSub: 'Report grassroots governance, investigative dispatches, and public interest stories directly from your district, tehsil, or city to millions of readers nationwide.',
    whatsappCta: 'Chat Directly with Chief Editor:',
    benefits: [
      {
        icon: 'BadgeCheck',
        title: 'Authorized Press ID Card',
        desc: 'Accredited press credential card issued following background and document verification.',
      },
      {
        icon: 'MessageSquare',
        title: 'Direct WhatsApp Access to Chief Editor',
        desc: 'Fast-track communication with the Editor-in-Chief at 8828812282 for urgent breaking news clearances.',
      },
      {
        icon: 'FileText',
        title: 'Verified Author Byline with Photo',
        desc: 'Every accepted investigative piece and report published with your official contributor byline.',
      },
      {
        icon: 'Building2',
        title: 'Growing National Media Footprint',
        desc: 'Work with a respected news group actively covering Maharashtra, Uttar Pradesh, Delhi, and Madhya Pradesh.',
      },
    ],
    rulesHeading: 'Reporter Terms & Code of Conduct',
    rules: [
      { label: 'Factuality & Objectivity:', text: 'Zero tolerance for unverified allegations; strict adherence to press ethics.' },
      { label: 'Regional Coverage:', text: 'Focus on civic infrastructure, administration, law, agriculture, and local developments.' },
      { label: 'Resume & Work Samples:', text: 'Provide your Google Drive resume link, portfolio, or past clippings in the form below.' },
      { label: 'Direct WhatsApp Routing:', text: 'Your application is delivered directly to the Editor-in-Chief on WhatsApp.' },
    ],
    helplineLabel: 'Direct Editorial Bureau Helpline:',
    officeTitle: 'Dainik Jagat Sameeksha Head Office:',
    officeAddress: 'Kalyan, Maharashtra - 421301',
    officeRni: 'RNI Reg. MAHHIN/2014/57312 • Patron: Rakesh Shankar Shetty • Chief Editor: Arun Ramakant Tiwari',
    formHeading: 'Online Reporter Application Form',
    formSub: 'Submit your credentials below. This form routes directly to the Chief Editor via WhatsApp at 8828812282.',
    successTitle: 'Your Reporter Application is Prepared!',
    successDesc: 'We have connected you directly to the Chief Editor on WhatsApp. If the chat did not open automatically, click below:',
    successBtn: 'Send Application via WhatsApp (8828812282)',
    nameLabel: 'Full Name *',
    namePlaceholder: 'e.g. Sunil Kumar Joshi',
    phoneLabel: 'WhatsApp / Mobile Number *',
    phonePlaceholder: 'e.g. 9876543210',
    emailLabel: 'Email Address',
    emailPlaceholder: 'e.g. sunil.reporter@gmail.com',
    stateLabel: 'State *',
    districtLabel: 'District / Tehsil / City *',
    districtPlaceholder: 'e.g. Kalyan / Lucknow / Bhopal / Delhi',
    beatLabel: 'Reporting Beat / Specialization *',
    experienceLabel: 'Journalism Experience *',
    orgLabel: 'Current or Previous Media Organization',
    orgPlaceholder: 'e.g. Local Daily / News Channel / Web Portal / Freelance',
    resumeLabel: 'Resume / Bio Link or Summary *',
    resumePlaceholder: 'e.g. Google Drive link to CV, LinkedIn URL, or summary of your journalism background...',
    samplesLabel: 'Published Article Links or Press ID (Optional)',
    samplesPlaceholder: 'e.g. URLs of previously published articles or clips...',
    messageLabel: 'Cover Note to Chief Editor',
    messagePlaceholder: 'e.g. I would like to cover rural governance and public infrastructure from my district...',
    submitSending: 'Submitting application...',
    submitBtn: 'Submit Application & Open WhatsApp (8828812282)',
    submitNote: 'Clicking submit opens WhatsApp pre-formatted with your credentials addressed to 8828812282.',
    alertValidation: 'Please enter your name, WhatsApp number, district/city, and resume details.',
    waTitle: 'Dainik Jagat Sameeksha - Field Reporter / Stringer Application',
    waName: 'Name:',
    waPhone: 'WhatsApp:',
    waEmail: 'Email:',
    waLocation: 'Location (State/District):',
    waBeat: 'Reporting Beat:',
    waExp: 'Experience:',
    waOrg: 'Previous Media Org:',
    waResume: 'Resume / Bio:',
    waSamples: 'Work Samples / Links:',
    waMessage: 'Message to Editor:',
    waClosing: 'Kindly review my reporter application and advise on next steps and press credential issuance. Thank you!',
    notProvided: 'Not provided',
  },
};

export const ReporterJoinPage: React.FC = () => {
  const { language, t } = useLanguage();
  const c = REPORTER_CONTENT[language] || REPORTER_CONTENT.hi;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [district, setDistrict] = useState('');
  const [beat, setBeat] = useState('civic');
  const [experience, setExperience] = useState('1-3');
  const [org, setOrg] = useState('');
  const [resume, setResume] = useState('');
  const [samples, setSamples] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const WHATSAPP_NUMBER = '8828812282';

  const beatOptions: Record<string, { mr: string; hi: string; en: string }> = {
    civic: { mr: 'स्थानिक नागरी समस्या व प्रशासन (Civic & Local Governance)', hi: 'स्थानीय नागरिक समस्याएं एवं प्रशासन (Civic & Local)', en: 'Civic & Local Governance' },
    crime: { mr: 'गुन्हेगारी व कायदा (Crime & Legal Investigation)', hi: 'अपराध एवं कानून (Crime & Legal Investigation)', en: 'Crime & Legal Investigation' },
    politics: { mr: 'राजकारण व निवडणुका (Politics & Elections)', hi: 'राजनीति एवं चुनाव (Politics & Elections)', en: 'Politics & Elections' },
    rural: { mr: 'ग्रामीण व कृषी वार्ता (Rural & Agriculture)', hi: 'ग्रामीण एवं कृषि समाचार (Rural & Agriculture)', en: 'Rural & Agriculture' },
    business: { mr: 'व्यापार व उद्योग (Business & Commerce)', hi: 'व्यापार एवं उद्योग (Business & Commerce)', en: 'Business & Commerce' },
    development: { mr: 'विकासकामे व पायाभूत सुविधा (Infrastructure & Development)', hi: 'विकास एवं बुनियादी ढांचा (Infrastructure)', en: 'Infrastructure & Development' },
    education: { mr: 'शिक्षण व आरोग्य (Education & Healthcare)', hi: 'शिक्षा एवं स्वास्थ्य (Education & Healthcare)', en: 'Education & Healthcare' },
    investigative: { mr: 'विशेष शोध पत्रकारिता (Investigative Journalism)', hi: 'विशेष खोजी पत्रकारिता (Investigative Journalism)', en: 'Investigative Journalism' },
    general: { mr: 'सर्वसाधारण बातमीदार (General Beat / Stringer)', hi: 'सामान्य संवाददाता (General Beat / Stringer)', en: 'General Beat / Stringer' },
  };

  const experienceOptions: Record<string, { mr: string; hi: string; en: string }> = {
    fresher: { mr: 'नवशिका / फ्रेशर (Fresher - New Entrant)', hi: 'नवागंतुक / फ्रेशर (Fresher - New Entrant)', en: 'Fresher / New to Journalism' },
    '1-3': { mr: '१ ते ३ वर्षे (1 - 3 Years Experience)', hi: '1 से 3 वर्ष (1 - 3 Years Experience)', en: '1 to 3 Years Experience' },
    '3-5': { mr: '३ ते ५ वर्षे (3 - 5 Years Experience)', hi: '3 से 5 वर्ष (3 - 5 Years Experience)', en: '3 to 5 Years Experience' },
    '5+': { mr: '५ वर्षांपेक्षा अधिक (5+ Years Senior Journalist)', hi: '5 वर्ष से अधिक (5+ Years Senior Journalist)', en: '5+ Years Senior Journalist' },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !district.trim() || !resume.trim()) {
      alert(c.alertValidation);
      return;
    }

    setIsSubmitting(true);

    const beatLabel = beatOptions[beat]?.[language] || beat;
    const expLabel = experienceOptions[experience]?.[language] || experience;

    // Build structured WhatsApp message directed to owner / editor
    const formattedMessage = [
      `*${c.waTitle}*`,
      `=================================`,
      `👤 *${c.waName}* ${fullName.trim()}`,
      `📱 *${c.waPhone}* ${phone.trim()}`,
      `📧 *${c.waEmail}* ${email.trim() || c.notProvided}`,
      `📍 *${c.waLocation}* ${district.trim()}, ${state}`,
      `🎯 *${c.waBeat}* ${beatLabel}`,
      `⏳ *${c.waExp}* ${expLabel}`,
      `🏢 *${c.waOrg}* ${org.trim() || c.notProvided}`,
      `📄 *${c.waResume}*`,
      `${resume.trim()}`,
      `🔗 *${c.waSamples}* ${samples.trim() || c.notProvided}`,
      `💬 *${c.waMessage}* ${message.trim() || c.notProvided}`,
      `=================================`,
      `\n${c.waClosing}`
    ].join('\n');

    try {
      // Record lead in contact store
      await repository.submitContactMessage({
        name: fullName.trim(),
        email: email.trim() || 'reporter-lead@jagatsameeksha.com',
        phone: phone.trim(),
        subject: `[संवाददाता भर्ती] ${fullName.trim()} - ${district.trim()}, ${state}`,
        message: `State: ${state} | District: ${district} | Beat: ${beatLabel} | Exp: ${expLabel} | Org: ${org} | Resume: ${resume} | Samples: ${samples} | Note: ${message}`,
      });
    } catch {
      // Continue to WhatsApp redirect even if offline store encounters an issue
    }

    // Direct WhatsApp redirect to 8828812282
    const waUrl = `https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(formattedMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const renderBenefitIcon = (icon: string) => {
    switch (icon) {
      case 'BadgeCheck':
        return <BadgeCheck className="w-6 h-6" />;
      case 'MessageSquare':
        return <MessageSquare className="w-6 h-6" />;
      case 'FileText':
        return <FileText className="w-6 h-6" />;
      case 'Building2':
      default:
        return <Building2 className="w-6 h-6" />;
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

        <main className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-8 sm:space-y-10">
          {/* Breadcrumb & Switcher to Membership */}
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
              to="/membership"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-all"
            >
              <span>⭐</span>
              <span>{t('membership')}</span>
            </Link>
          </div>

          {/* Hero Masthead Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-editorial-950 via-emerald-950 to-editorial-900 text-white p-5 sm:p-10 shadow-xl border-2 border-emerald-500/40">
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500 text-editorial-950 text-xs font-black uppercase tracking-wider shadow-sm">
                <Mic2 className="w-3.5 h-3.5" />
                <span>{c.heroBadge}</span>
              </div>

              <h1 className="font-masthead text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {c.heroTitlePrefix}<span className="text-emerald-400 font-serif">{c.heroTitleHighlight}</span>{c.heroTitleSuffix}
              </h1>

              <p className="text-xs sm:text-base text-gray-200 font-serif leading-relaxed">
                {c.heroSub}
              </p>

              {/* Direct WhatsApp Callout Pill */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <a
                  href={`https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent('नमस्ते, मैं दैनिक जगत समीक्षा में संवाददाता / रिपोर्टर के रूप में जुड़ना चाहता हूँ।')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{c.whatsappCta} +91 {WHATSAPP_NUMBER}</span>
                </a>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs text-emerald-300 text-xs font-mono border border-emerald-400/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>RNI: MAHHIN/2014/57312</span>
                </div>
              </div>
            </div>

            {/* Background Accent Graphics */}
            <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
          </div>

          {/* Core Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {c.benefits.map((benefit, idx) => {
              const bgColors = [
                'bg-emerald-50 text-emerald-800', 
                'bg-crimson-50 text-crimson-800', 
                'bg-amber-50 text-amber-800', 
                'bg-blue-50 text-blue-800'
              ];
              return (
                <div key={idx} className="bg-white p-5 sm:p-6 rounded-xl border border-paper-border shadow-xs space-y-2.5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold ${bgColors[idx % bgColors.length]}`}>
                    {renderBenefitIcon(benefit.icon)}
                  </div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-editorial-950">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left Column: Guidelines & Contact Information */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-6">
              <div className="bg-emerald-50/70 border border-emerald-300 rounded-2xl p-5 sm:p-6 space-y-4">
                <h3 className="font-serif font-bold text-base sm:text-lg text-emerald-950 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <span>{c.rulesHeading}</span>
                </h3>

                <ul className="space-y-3 text-xs text-emerald-900 leading-relaxed font-serif">
                  {c.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>{rule.label}</strong> {rule.text}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-3 border-t border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold shrink-0">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-emerald-900 font-bold">{c.helplineLabel}</p>
                      <a href={`tel:${WHATSAPP_NUMBER}`} className="text-sm font-mono font-bold text-emerald-900 hover:underline">
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

            {/* Right Column: Interactive Reporter Registration Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl border-2 border-editorial-200 p-5 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-black text-editorial-950">
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
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
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
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
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
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                {/* State & District */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      {c.stateLabel}
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    >
                      <option value="Maharashtra">महाराष्ट्र (Maharashtra)</option>
                      <option value="Uttar Pradesh">उत्तर प्रदेश (Uttar Pradesh)</option>
                      <option value="Madhya Pradesh">मध्य प्रदेश (Madhya Pradesh)</option>
                      <option value="Delhi">दिल्ली (Delhi NCR)</option>
                      <option value="Other">अन्य राज्य (Other State)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      {c.districtLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder={c.districtPlaceholder}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                {/* Reporting Beat & Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      {c.beatLabel}
                    </label>
                    <select
                      value={beat}
                      onChange={(e) => setBeat(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    >
                      {Object.entries(beatOptions).map(([key, val]) => (
                        <option key={key} value={key}>
                          {val[language] || val.hi}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      {c.experienceLabel}
                    </label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    >
                      {Object.entries(experienceOptions).map(([key, val]) => (
                        <option key={key} value={key}>
                          {val[language] || val.hi}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Current / Previous Org */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    {c.orgLabel}
                  </label>
                  <input
                    type="text"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    placeholder={c.orgPlaceholder}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                {/* Resume / Bio Link or Summary */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    {c.resumeLabel}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                    placeholder={c.resumePlaceholder}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                {/* Sample Published Links */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    {c.samplesLabel}
                  </label>
                  <input
                    type="text"
                    value={samples}
                    onChange={(e) => setSamples(e.target.value)}
                    placeholder={c.samplesPlaceholder}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                {/* Message to Editor */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    {c.messageLabel}
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={c.messagePlaceholder}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                {/* Submit & WhatsApp Routing Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
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

