import { 
  Article, 
  Category, 
  BreakingNewsItem, 
  SiteSettings, 
  EpaperEdition, 
  Profile, 
  HomeBlock,
  Gallery,
  VideoItem,
  BriefItem,
  HoroscopeItem,
  SupplementItem,
  NewsTip,
  CMSPage,
  WeatherCity,
  HoroscopeSign
} from '@/types/database';
import { DEFAULT_SITE_SETTINGS } from '@/config/site';

// Category IDs
export const CAT_TOP = 'c1000000-0000-0000-0000-000000000000';
export const CAT_MAHARASHTRA = 'c1000000-0000-0000-0000-000000000001';
export const CAT_MUMBAI = 'c1000000-0000-0000-0000-000000000002';
export const CAT_PUNE = 'c1000000-0000-0000-0000-000000000003';
export const CAT_INDIA = 'c1000000-0000-0000-0000-000000000004';
export const CAT_POLITICS = 'c1000000-0000-0000-0000-000000000005';
export const CAT_BUSINESS = 'c1000000-0000-0000-0000-000000000006';
export const CAT_TECH = 'c1000000-0000-0000-0000-000000000007';
export const CAT_EDUCATION = 'c1000000-0000-0000-0000-000000000008';
export const CAT_SPORTS = 'c1000000-0000-0000-0000-000000000009';
export const CAT_ENTERTAINMENT = 'c1000000-0000-0000-0000-000000000010';
export const CAT_HEALTH = 'c1000000-0000-0000-0000-000000000011';
export const CAT_AGRICULTURE = 'c1000000-0000-0000-0000-000000000012';
export const CAT_WORLD = 'c1000000-0000-0000-0000-000000000013';
export const CAT_MP = 'c1000000-0000-0000-0000-000000000014';
export const CAT_DELHI = 'c1000000-0000-0000-0000-000000000015';
export const CAT_CRIME = 'c1000000-0000-0000-0000-000000000016';
export const CAT_COURT = 'c1000000-0000-0000-0000-000000000017';
export const CAT_EDITORIAL = 'c1000000-0000-0000-0000-000000000018';
export const CAT_SUPPLEMENT = 'c1000000-0000-0000-0000-000000000019';
export const CAT_THANE_NM = 'c1000000-0000-0000-0000-000000000020';
export const CAT_NAGPUR = 'c1000000-0000-0000-0000-000000000021';
export const CAT_NASHIK = 'c1000000-0000-0000-0000-000000000022';
export const CAT_INDORE = 'c1000000-0000-0000-0000-000000000023';
export const CAT_GWALIOR = 'c1000000-0000-0000-0000-000000000024';
export const CAT_LEAD_ED = 'c1000000-0000-0000-0000-000000000025';
export const CAT_OPINION = 'c1000000-0000-0000-0000-000000000026';
export const CAT_COLUMNS = 'c1000000-0000-0000-0000-000000000027';
export const CAT_LIFESTYLE = 'c1000000-0000-0000-0000-000000000028';
export const CAT_RELIGION = 'c1000000-0000-0000-0000-000000000029';
export const CAT_WEATHER = 'c1000000-0000-0000-0000-000000000030';
export const CAT_CURIOUS = 'c1000000-0000-0000-0000-000000000031';
export const CAT_PHOTOS = 'c1000000-0000-0000-0000-000000000032';
export const CAT_VIDEOS = 'c1000000-0000-0000-0000-000000000033';
export const CAT_RASHIFAL = 'c1000000-0000-0000-0000-000000000034';

// Translation Group UUIDs
const GROUP_1 = 'g1000000-0000-0000-0000-000000000001';
const GROUP_2 = 'g2000000-0000-0000-0000-000000000002';
const GROUP_3 = 'g3000000-0000-0000-0000-000000000003';
const GROUP_4 = 'g4000000-0000-0000-0000-000000000004';
const GROUP_5 = 'g5000000-0000-0000-0000-000000000005';
const GROUP_6 = 'g6000000-0000-0000-0000-000000000006';
const GROUP_7 = 'g7000000-0000-0000-0000-000000000007';
const GROUP_8 = 'g8000000-0000-0000-0000-000000000008';
const GROUP_9 = 'g9000000-0000-0000-0000-000000000009';
const GROUP_10 = 'g10000000-0000-0000-0000-000000000010';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: CAT_TOP,
    slug: 'top-news',
    kind: 'news',
    show_in_nav: true,
    nav_order: 1,
    color_hex: '#ed1c24',
    sort_order: 1,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 't0-hi', category_id: CAT_TOP, language: 'hi', name: 'शीर्ष समाचार', description: 'दैनिक जगत समीक्षा मुख्य समाचार' },
      mr: { id: 't0-mr', category_id: CAT_TOP, language: 'mr', name: 'ठळक बातम्या', description: 'दैनिक जगत समीक्षा ठळक घडामोडी' },
      en: { id: 't0-en', category_id: CAT_TOP, language: 'en', name: 'Top Stories', description: 'Top headline stories' },
    },
  },
  {
    id: CAT_INDIA,
    slug: 'india',
    kind: 'news',
    show_in_nav: true,
    nav_order: 2,
    color_hex: '#ed1c24',
    sort_order: 2,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 't4-hi', category_id: CAT_INDIA, language: 'hi', name: 'देश', description: 'राष्ट्रीय घटनाक्रम और देश भर की खबरें' },
      mr: { id: 't4-mr', category_id: CAT_INDIA, language: 'mr', name: 'देश', description: 'राष्ट्रीय घडामोडी' },
      en: { id: 't4-en', category_id: CAT_INDIA, language: 'en', name: 'National', description: 'National policy and union governance' },
    },
  },
  {
    id: CAT_WORLD,
    slug: 'international',
    kind: 'news',
    show_in_nav: true,
    nav_order: 3,
    color_hex: '#0284c7',
    sort_order: 3,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 'tw-hi', category_id: CAT_WORLD, language: 'hi', name: 'विदेश', description: 'अंतरराष्ट्रीय संबंध और वैश्विक घटनाक्रम' },
      mr: { id: 'tw-mr', category_id: CAT_WORLD, language: 'mr', name: 'परराष्ट्र', description: 'आंतरराष्ट्रीय घडामोडी व जागतिक वार्ता' },
      en: { id: 'tw-en', category_id: CAT_WORLD, language: 'en', name: 'International', description: 'Global geopolitics and foreign affairs' },
    },
  },
  {
    id: CAT_POLITICS,
    slug: 'politics',
    kind: 'news',
    show_in_nav: true,
    nav_order: 4,
    color_hex: '#dc2626',
    sort_order: 4,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 't5-hi', category_id: CAT_POLITICS, language: 'hi', name: 'राजनीति', description: 'राजनीतिक समाचार और निष्पक्ष विश्लेषण' },
      mr: { id: 't5-mr', category_id: CAT_POLITICS, language: 'mr', name: 'राजकारण', description: 'राजकीय घडामोडी व विश्लेषण' },
      en: { id: 't5-en', category_id: CAT_POLITICS, language: 'en', name: 'Politics', description: 'Governance, electoral and parliamentary affairs' },
    },
  },
  {
    id: CAT_MAHARASHTRA,
    slug: 'maharashtra',
    kind: 'city',
    show_in_nav: true,
    nav_order: 5,
    color_hex: '#ea580c',
    sort_order: 5,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 't1-hi', category_id: CAT_MAHARASHTRA, language: 'hi', name: 'महाराष्ट्र', description: 'महाराष्ट्र की ताज़ा खबरें और प्रादेशिक विश्लेषण' },
      mr: { id: 't1-mr', category_id: CAT_MAHARASHTRA, language: 'mr', name: 'महाराष्ट्र', description: 'महाराष्ट्रातील ताज्या घडामोडी आणि विश्लेषण' },
      en: { id: 't1-en', category_id: CAT_MAHARASHTRA, language: 'en', name: 'Maharashtra', description: 'State policies, regional governance and community news' },
    },
  },
  {
    id: CAT_MUMBAI,
    slug: 'mumbai',
    parent_id: CAT_MAHARASHTRA,
    kind: 'city',
    show_in_nav: false,
    color_hex: '#ea580c',
    sort_order: 6,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 't2-hi', category_id: CAT_MUMBAI, language: 'hi', name: 'मुंबई', description: 'मुंबई शहर और उपनगरीय समाचार' },
      mr: { id: 't2-mr', category_id: CAT_MUMBAI, language: 'mr', name: 'मुंबई', description: 'मुंबई शहर आणि उपनगरीय वार्ता' },
      en: { id: 't2-en', category_id: CAT_MUMBAI, language: 'en', name: 'Mumbai', description: 'Metropolitan Mumbai infrastructure and city affairs' },
    },
  },
  {
    id: CAT_THANE_NM,
    slug: 'thane-navi-mumbai',
    parent_id: CAT_MAHARASHTRA,
    kind: 'city',
    show_in_nav: false,
    color_hex: '#ea580c',
    sort_order: 7,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 'ttnm-hi', category_id: CAT_THANE_NM, language: 'hi', name: 'ठाणे / नवी मुंबई', description: 'ठाणे और नवी मुंबई की खबरें' },
      mr: { id: 'ttnm-mr', category_id: CAT_THANE_NM, language: 'mr', name: 'ठाणे / नवी मुंबई', description: 'ठाणे आणि नवी मुंबई परिसर वार्ता' },
      en: { id: 'ttnm-en', category_id: CAT_THANE_NM, language: 'en', name: 'Thane & Navi Mumbai', description: 'Thane and Navi Mumbai updates' },
    },
  },
  {
    id: CAT_PUNE,
    slug: 'pune',
    parent_id: CAT_MAHARASHTRA,
    kind: 'city',
    show_in_nav: false,
    color_hex: '#ea580c',
    sort_order: 8,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 't3-hi', category_id: CAT_PUNE, language: 'hi', name: 'पुणे', description: 'पुणे और पिंपरी-चिंचवड समाचार' },
      mr: { id: 't3-mr', category_id: CAT_PUNE, language: 'mr', name: 'पुणे', description: 'पुणे आणि पिंपरी-चिंचवड वार्ता' },
      en: { id: 't3-en', category_id: CAT_PUNE, language: 'en', name: 'Pune', description: 'Pune knowledge hub and PCMC updates' },
    },
  },
  {
    id: CAT_NAGPUR,
    slug: 'nagpur',
    parent_id: CAT_MAHARASHTRA,
    kind: 'city',
    show_in_nav: false,
    color_hex: '#ea580c',
    sort_order: 9,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 'tng-hi', category_id: CAT_NAGPUR, language: 'hi', name: 'नागपुर', description: 'विदर्भ एवं नागपुर उपराजधानी समाचार' },
      mr: { id: 'tng-mr', category_id: CAT_NAGPUR, language: 'mr', name: 'नागपूर', description: 'विदर्भ आणि नागपूर उपराजधानी वार्ता' },
      en: { id: 'tng-en', category_id: CAT_NAGPUR, language: 'en', name: 'Nagpur', description: 'Vidarbha and Nagpur regional news' },
    },
  },
  {
    id: CAT_NASHIK,
    slug: 'nashik',
    parent_id: CAT_MAHARASHTRA,
    kind: 'city',
    show_in_nav: false,
    color_hex: '#ea580c',
    sort_order: 10,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 'tns-hi', category_id: CAT_NASHIK, language: 'hi', name: 'नाशिक', description: 'उत्तर महाराष्ट्र एवं नाशिक समाचार' },
      mr: { id: 'tns-mr', category_id: CAT_NASHIK, language: 'mr', name: 'नाशिक', description: 'उत्तर महाराष्ट्र आणि नाशिक वार्ता' },
      en: { id: 'tns-en', category_id: CAT_NASHIK, language: 'en', name: 'Nashik', description: 'North Maharashtra and Nashik district updates' },
    },
  },
  {
    id: CAT_MP,
    slug: 'madhya-pradesh',
    kind: 'city',
    show_in_nav: true,
    nav_order: 6,
    color_hex: '#16a34a',
    sort_order: 11,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 'tmp-hi', category_id: CAT_MP, language: 'hi', name: 'मध्य प्रदेश', description: 'मध्य प्रदेश की प्रमुख हलचल' },
      mr: { id: 'tmp-mr', category_id: CAT_MP, language: 'mr', name: 'मध्य प्रदेश', description: 'मध्य प्रदेशातील घडामोडी' },
      en: { id: 'tmp-en', category_id: CAT_MP, language: 'en', name: 'Madhya Pradesh', description: 'Madhya Pradesh regional and governance reporting' },
    },
  },
  {
    id: CAT_INDORE,
    slug: 'indore',
    parent_id: CAT_MP,
    kind: 'city',
    show_in_nav: false,
    color_hex: '#16a34a',
    sort_order: 12,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 'tind-hi', category_id: CAT_INDORE, language: 'hi', name: 'इंदौर', description: 'इंदौर शहर एवं मालवा समाचार' },
      mr: { id: 'tind-mr', category_id: CAT_INDORE, language: 'mr', name: 'इंदूर', description: 'इंदूर शहर व माळवा वार्ता' },
      en: { id: 'tind-en', category_id: CAT_INDORE, language: 'en', name: 'Indore', description: 'Indore city and Malwa region' },
    },
  },
  {
    id: CAT_GWALIOR,
    slug: 'gwalior',
    parent_id: CAT_MP,
    kind: 'city',
    show_in_nav: false,
    color_hex: '#16a34a',
    sort_order: 13,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 'tgw-hi', category_id: CAT_GWALIOR, language: 'hi', name: 'ग्वालियर', description: 'ग्वालियर चंबल संभाग की खबरें' },
      mr: { id: 'tgw-mr', category_id: CAT_GWALIOR, language: 'mr', name: 'ग्वाल्हेर', description: 'ग्वाल्हेर चंबळ विभागातील वार्ता' },
      en: { id: 'tgw-en', category_id: CAT_GWALIOR, language: 'en', name: 'Gwalior', description: 'Gwalior-Chambal regional dispatches' },
    },
  },
  {
    id: CAT_DELHI,
    slug: 'delhi',
    kind: 'city',
    show_in_nav: true,
    nav_order: 7,
    color_hex: '#2563eb',
    sort_order: 14,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 'tdl-hi', category_id: CAT_DELHI, language: 'hi', name: 'दिल्ली', description: 'राष्ट्रीय राजधानी क्षेत्र दिल्ली समाचार' },
      mr: { id: 'tdl-mr', category_id: CAT_DELHI, language: 'mr', name: 'दिल्ली', description: 'राष्ट्रीय राजधानी दिल्ली आणि एनसीआर वार्ता' },
      en: { id: 'tdl-en', category_id: CAT_DELHI, language: 'en', name: 'Delhi NCR', description: 'National Capital Region updates' },
    },
  },
  {
    id: CAT_CRIME,
    slug: 'crime',
    kind: 'news',
    show_in_nav: true,
    nav_order: 8,
    color_hex: '#b91c1c',
    sort_order: 15,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 'tcr-hi', category_id: CAT_CRIME, language: 'hi', name: 'क्राइम', description: 'अपराध, अन्वेषण और सुरक्षा समाचार' },
      mr: { id: 'tcr-mr', category_id: CAT_CRIME, language: 'mr', name: 'गुन्हेगारी', description: 'गुन्हे अन्वेषण आणि सुरक्षा वार्ता' },
      en: { id: 'tcr-en', category_id: CAT_CRIME, language: 'en', name: 'Crime', description: 'Investigative reporting and crime beat' },
    },
  },
  {
    id: CAT_COURT,
    slug: 'court',
    kind: 'news',
    show_in_nav: true,
    nav_order: 9,
    color_hex: '#4f46e5',
    sort_order: 16,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 'tct-hi', category_id: CAT_COURT, language: 'hi', name: 'अदालत', description: 'उच्चतम न्यायालय, उच्च न्यायालय एवं विधिक फैसले' },
      mr: { id: 'tct-mr', category_id: CAT_COURT, language: 'mr', name: 'न्यायालये', description: 'सर्वोच्च न्यायालय, उच्च न्यायालय आणि कायदेशीर निकाल' },
      en: { id: 'tct-en', category_id: CAT_COURT, language: 'en', name: 'Courts & Law', description: 'Supreme Court, High Courts and judicial rulings' },
    },
  },
  {
    id: CAT_BUSINESS,
    slug: 'business',
    kind: 'news',
    show_in_nav: true,
    nav_order: 10,
    color_hex: '#059669',
    sort_order: 17,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 't6-hi', category_id: CAT_BUSINESS, language: 'hi', name: 'व्यापार', description: 'बाजार, अर्थव्यवस्था और उद्योग जगत' },
      mr: { id: 't6-mr', category_id: CAT_BUSINESS, language: 'mr', name: 'अर्थकारण', description: 'व्यापार, बाजार आणि अर्थव्यवस्था' },
      en: { id: 't6-en', category_id: CAT_BUSINESS, language: 'en', name: 'Business', description: 'Markets, corporate enterprise and economy' },
    },
  },
  {
    id: CAT_SPORTS,
    slug: 'sports',
    kind: 'news',
    show_in_nav: true,
    nav_order: 11,
    color_hex: '#0891b2',
    sort_order: 18,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 't9-hi', category_id: CAT_SPORTS, language: 'hi', name: 'खेल', description: 'क्रिकेट और खेल जगत की ताज़ा खबरें' },
      mr: { id: 't9-mr', category_id: CAT_SPORTS, language: 'mr', name: 'क्रीडा', description: 'क्रीडा जगतातील घडामोडी' },
      en: { id: 't9-en', category_id: CAT_SPORTS, language: 'en', name: 'Sports', description: 'Cricket, athletics and global tournament coverage' },
    },
  },
  {
    id: CAT_ENTERTAINMENT,
    slug: 'entertainment',
    kind: 'news',
    show_in_nav: true,
    nav_order: 12,
    color_hex: '#db2777',
    sort_order: 19,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 't10-hi', category_id: CAT_ENTERTAINMENT, language: 'hi', name: 'मनोरंजन', description: 'सिनेमा, कला और मनोरंजन जगत' },
      mr: { id: 't10-mr', category_id: CAT_ENTERTAINMENT, language: 'mr', name: 'मनोरंजन', description: 'चित्रपट, नाटक आणि कला' },
      en: { id: 't10-en', category_id: CAT_ENTERTAINMENT, language: 'en', name: 'Entertainment', description: 'Cinema, OTT and performing arts' },
    },
  },
  {
    id: CAT_EDITORIAL,
    slug: 'editorial',
    kind: 'opinion',
    show_in_nav: true,
    nav_order: 13,
    color_hex: '#9333ea',
    sort_order: 20,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 'ted-hi', category_id: CAT_EDITORIAL, language: 'hi', name: 'संपादकीय', description: 'संपादकीय दृष्टिकोण, अग्रलेख और बौद्धिक विचार' },
      mr: { id: 'ted-mr', category_id: CAT_EDITORIAL, language: 'mr', name: 'संपादकीय', description: 'संपादकीय भूमिका, अग्रलेख व विचार' },
      en: { id: 'ted-en', category_id: CAT_EDITORIAL, language: 'en', name: 'Editorial', description: 'Editorial stance, opinions and intellectual analysis' },
    },
  },
  {
    id: CAT_LEAD_ED,
    slug: 'lead-editorial',
    parent_id: CAT_EDITORIAL,
    kind: 'opinion',
    show_in_nav: false,
    color_hex: '#9333ea',
    sort_order: 21,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 'tled-hi', category_id: CAT_LEAD_ED, language: 'hi', name: 'अग्रलेख', description: 'संपादक अरुण रमाकांत तिवारी का दैनिक अग्रलेख' },
      mr: { id: 'tled-mr', category_id: CAT_LEAD_ED, language: 'mr', name: 'अग्रलेख', description: 'संपादकांचा दैनिक अग्रलेख' },
      en: { id: 'tled-en', category_id: CAT_LEAD_ED, language: 'en', name: 'Lead Editorial', description: 'Daily editorial by the Editor-in-Chief' },
    },
  },
  {
    id: CAT_OPINION,
    slug: 'opinion',
    parent_id: CAT_EDITORIAL,
    kind: 'opinion',
    show_in_nav: false,
    color_hex: '#9333ea',
    sort_order: 22,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 'top-hi', category_id: CAT_OPINION, language: 'hi', name: 'विचार-मंथन', description: 'समकालीन मुद्दों पर प्रबुद्ध लेखकों के विचार' },
      mr: { id: 'top-mr', category_id: CAT_OPINION, language: 'mr', name: 'विचारमंथन', description: 'समकालीन विषयांवरील विचार' },
      en: { id: 'top-en', category_id: CAT_OPINION, language: 'en', name: 'Op-Ed', description: 'Guest essays and think pieces' },
    },
  },
  {
    id: CAT_COLUMNS,
    slug: 'columns',
    parent_id: CAT_EDITORIAL,
    kind: 'opinion',
    show_in_nav: false,
    color_hex: '#9333ea',
    sort_order: 23,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 'tcol-hi', category_id: CAT_COLUMNS, language: 'hi', name: 'स्तंभ', description: 'साप्ताहिक एवं नियमित स्तंभ' },
      mr: { id: 'tcol-mr', category_id: CAT_COLUMNS, language: 'mr', name: 'स्तंभ', description: 'नियमित स्तंभ' },
      en: { id: 'tcol-en', category_id: CAT_COLUMNS, language: 'en', name: 'Columns', description: 'Weekly columns' },
    },
  },
  {
    id: CAT_AGRICULTURE,
    slug: 'agriculture',
    kind: 'news',
    show_in_nav: false,
    sort_order: 24,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 't12-hi', category_id: CAT_AGRICULTURE, language: 'hi', name: 'कृषि', description: 'कृषि तकनीक, फसल मूल्य और ग्रामीण समाचार' },
      mr: { id: 't12-mr', category_id: CAT_AGRICULTURE, language: 'mr', name: 'कृषी', description: 'शेती तंत्रज्ञान आणि शेतकरी वार्ता' },
      en: { id: 't12-en', category_id: CAT_AGRICULTURE, language: 'en', name: 'Agriculture', description: 'Agritech, rural economy and sustainable farming' },
    },
  },
  {
    id: CAT_EDUCATION,
    slug: 'education',
    kind: 'news',
    show_in_nav: false,
    sort_order: 25,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 't8-hi', category_id: CAT_EDUCATION, language: 'hi', name: 'शिक्षा व करियर', description: 'शिक्षा, उच्च अध्ययन और करियर गाइडेंस' },
      mr: { id: 't8-mr', category_id: CAT_EDUCATION, language: 'mr', name: 'शिक्षण', description: 'शालेय, उच्च शिक्षण व करिअर' },
      en: { id: 't8-en', category_id: CAT_EDUCATION, language: 'en', name: 'Education', description: 'Academia, universities and careers' },
    },
  },
  {
    id: CAT_HEALTH,
    slug: 'health',
    kind: 'news',
    show_in_nav: false,
    sort_order: 26,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 't11-hi', category_id: CAT_HEALTH, language: 'hi', name: 'स्वास्थ्य', description: 'चिकित्सा, स्वास्थ्य और आरोग्य सलाह' },
      mr: { id: 't11-mr', category_id: CAT_HEALTH, language: 'mr', name: 'आरोग्य', description: 'आरोग्य, जीवनशैली आणि सल्ला' },
      en: { id: 't11-en', category_id: CAT_HEALTH, language: 'en', name: 'Health', description: 'Medical research and public wellness' },
    },
  },
  {
    id: CAT_LIFESTYLE,
    slug: 'lifestyle',
    kind: 'supplement',
    show_in_nav: false,
    sort_order: 27,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 'tls-hi', category_id: CAT_LIFESTYLE, language: 'hi', name: 'लाइफस्टाइल', description: 'फैशन, खान-पान और जीवनशैली' },
      mr: { id: 'tls-mr', category_id: CAT_LIFESTYLE, language: 'mr', name: 'जीवनशैली', description: 'फॅशन, खाद्यसंस्कृती आणि जीवनशैली' },
      en: { id: 'tls-en', category_id: CAT_LIFESTYLE, language: 'en', name: 'Lifestyle', description: 'Living, culture, food and wellness' },
    },
  },
  {
    id: CAT_RELIGION,
    slug: 'religion-culture',
    kind: 'supplement',
    show_in_nav: false,
    sort_order: 28,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 'trel-hi', category_id: CAT_RELIGION, language: 'hi', name: 'धर्म व संस्कृति', description: 'पर्व, त्योहार और आध्यात्मिक चिंतन' },
      mr: { id: 'trel-mr', category_id: CAT_RELIGION, language: 'mr', name: 'धर्म व संस्कृती', description: 'उत्सव, सण आणि अध्यात्म' },
      en: { id: 'trel-en', category_id: CAT_RELIGION, language: 'en', name: 'Faith & Culture', description: 'Traditions, spirituality and festivals' },
    },
  },
  {
    id: CAT_WEATHER,
    slug: 'weather',
    kind: 'special',
    show_in_nav: false,
    sort_order: 29,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 'twth-hi', category_id: CAT_WEATHER, language: 'hi', name: 'मौसम', description: 'तापमान एवं मौसम पूर्वानुमान' },
      mr: { id: 'twth-mr', category_id: CAT_WEATHER, language: 'mr', name: 'हवामान', description: 'तापमान व हवामान अंदाज' },
      en: { id: 'twth-en', category_id: CAT_WEATHER, language: 'en', name: 'Weather', description: 'Meteorological and climate updates' },
    },
  },
  {
    id: CAT_CURIOUS,
    slug: 'curious-odd',
    kind: 'special',
    show_in_nav: false,
    sort_order: 30,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 'tcur-hi', category_id: CAT_CURIOUS, language: 'hi', name: 'विचित्र', description: 'दुनिया के अनोखे और अजब-गजब किस्से' },
      mr: { id: 'tcur-mr', category_id: CAT_CURIOUS, language: 'mr', name: 'अजब-गजब', description: 'जगातील अजब व आश्चर्यकारक घटना' },
      en: { id: 'tcur-en', category_id: CAT_CURIOUS, language: 'en', name: 'Curious & Odd', description: 'Unusual, viral and odd news from around the world' },
    },
  },
  {
    id: CAT_SUPPLEMENT,
    slug: 'supplements',
    kind: 'supplement',
    show_in_nav: false,
    sort_order: 31,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 'tsup-hi', category_id: CAT_SUPPLEMENT, language: 'hi', name: 'पुरवणी', description: 'दैनिक जगत समीक्षा विशेष परिशिष्ट' },
      mr: { id: 'tsup-mr', category_id: CAT_SUPPLEMENT, language: 'mr', name: 'पुरवणी', description: 'विशेष साप्ताहिक पुरवण्या' },
      en: { id: 'tsup-en', category_id: CAT_SUPPLEMENT, language: 'en', name: 'Supplements', description: 'Special weekend and thematic broadsheet supplements' },
    },
  },
  {
    id: CAT_PHOTOS,
    slug: 'photos',
    kind: 'special',
    show_in_nav: false,
    sort_order: 32,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 'tpho-hi', category_id: CAT_PHOTOS, language: 'hi', name: 'फोटो गैलरी', description: 'कैमरे की नज़र से ताज़ा तस्वीरें' },
      mr: { id: 'tpho-mr', category_id: CAT_PHOTOS, language: 'mr', name: 'फोटो दालन', description: 'छायाचित्रे' },
      en: { id: 'tpho-en', category_id: CAT_PHOTOS, language: 'en', name: 'Photo Gallery', description: 'Photo essays and news pictures' },
    },
  },
  {
    id: CAT_VIDEOS,
    slug: 'videos',
    kind: 'special',
    show_in_nav: false,
    sort_order: 33,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 'tvid-hi', category_id: CAT_VIDEOS, language: 'hi', name: 'वीडियो', description: 'ग्राउंड रिपोर्ट और विशेष वीडियो' },
      mr: { id: 'tvid-mr', category_id: CAT_VIDEOS, language: 'mr', name: 'व्हिडिओ', description: 'ग्राउंड रिपोर्ट आणि व्हिडिओ वार्ता' },
      en: { id: 'tvid-en', category_id: CAT_VIDEOS, language: 'en', name: 'Videos', description: 'Video journalism and field reporting' },
    },
  },
  {
    id: CAT_RASHIFAL,
    slug: 'rashifal',
    kind: 'special',
    show_in_nav: false,
    sort_order: 34,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    translations: {
      hi: { id: 'tras-hi', category_id: CAT_RASHIFAL, language: 'hi', name: 'राशिफल', description: 'दैनिक राशिफल एवं ग्रह गोचर' },
      mr: { id: 'tras-mr', category_id: CAT_RASHIFAL, language: 'mr', name: 'राशीभविष्य', description: 'दैनिक राशीभविष्य' },
      en: { id: 'tras-en', category_id: CAT_RASHIFAL, language: 'en', name: 'Horoscope', description: 'Daily astrological insights' },
    },
  },
];

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'usr-admin-01',
    slug: 'arun-ramakant-tiwari',
    display_name: 'अरुण रमाकांत तिवारी',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    designation: 'प्रधान संपादक (Chief Editor)',
    bio_hi: 'दैनिक जगत समीक्षा के संस्थापक एवं प्रधान संपादक। भारतीय समाचार पत्र उद्योग में तीन दशकों से अधिक का निष्पक्ष एवं निर्भीक पत्रकारिता का अनुभव।',
    bio_mr: 'दैनिक जगत समीक्षाचे संस्थापक व मुख्य संपादक. भारतीय वृत्तपत्र क्षेत्रात तीन दशकांपेक्षा अधिक काळ निष्पक्ष व निर्भीक पत्रकारितेचा अनुभव.',
    bio_en: 'Founder and Editor-in-Chief of Dainik Jagat Sameeksha with over 30 years of principled investigative print journalism.',
    is_columnist: true,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr-bureau-special',
    slug: 'special-correspondent',
    display_name: 'विशेष संवाददाता',
    role: 'author',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    designation: 'विशेष संवाददाता (National Bureau)',
    bio_hi: 'दैनिक जगत समीक्षा राष्ट्रीय एवं प्रादेशिक खोजी रिपोर्टिंग ब्यूरो।',
    bio_mr: 'दैनिक जगत समीक्षा राष्ट्रीय व प्रादेशिक शोध पत्रकारिता ब्युरो पथक.',
    bio_en: 'Special correspondent bureau covering national governance, investigative pieces, and state developments.',
    is_columnist: false,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr-legal-desk',
    slug: 'legal-correspondent',
    display_name: 'विधि संवाददाता',
    role: 'author',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    designation: 'विधिक ब्यूरो (Legal Bureau)',
    bio_hi: 'उच्चतम न्यायालय एवं मुंबई उच्च न्यायालय विधिक मामलों के विशेषज्ञ विश्लेषक।',
    bio_mr: 'सर्वोच्च न्यायालय आणि मुंबई उच्च न्यायालय कायदेशीर बाबींचे विश्लेषक.',
    bio_en: 'Supreme Court of India and Bombay High Court legal affairs analyst.',
    is_columnist: true,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr-sports-desk',
    slug: 'sports-desk',
    display_name: 'खेल ब्यूरो',
    role: 'author',
    avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    designation: 'क्रीडा एवं खेल प्रतिनिधि',
    bio_hi: 'क्रिकेट, ओलंपिक एवं राष्ट्रीय खेल स्पर्धाओं की विस्तृत कवरेज।',
    bio_mr: 'क्रिकेट, ऑलिम्पिक आणि राष्ट्रीय क्रीडा स्पर्धांचे सखोल वार्तांकन.',
    bio_en: 'National and international sports desk reporter.',
    is_columnist: false,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

export const INITIAL_HOME_BLOCKS: HomeBlock[] = [
  {
    id: 'hb-01',
    block_type: 'hero',
    title_override_hi: 'प्रमुख समाचार',
    title_override_mr: 'प्रमुख घडामोडी',
    title_override_en: 'Lead Stories',
    item_count: 5,
    sort_order: 1,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 'hb-02',
    block_type: 'ticker',
    title_override_hi: 'ताज़ा ब्रेकिंग',
    title_override_mr: 'ताजी ब्रेकिंग',
    title_override_en: 'Breaking News',
    item_count: 8,
    sort_order: 2,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 'hb-03',
    block_type: 'top_news',
    title_override_hi: 'ठळक खबरें (शीर्ष समाचार)',
    title_override_mr: 'ठळक बातम्या',
    title_override_en: 'Top Headlines',
    item_count: 4,
    sort_order: 3,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 'hb-04',
    block_type: 'city',
    category_id: CAT_MAHARASHTRA,
    title_override_hi: 'महाराष्ट्र एवं मुंबई मेट्रो',
    title_override_mr: 'महाराष्ट्र व मुंबई विशेष',
    title_override_en: 'Maharashtra & Mumbai Metro',
    item_count: 4,
    sort_order: 4,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 'hb-05',
    block_type: 'opinion',
    category_id: CAT_EDITORIAL,
    title_override_hi: 'संपादकीय एवं विचार',
    title_override_mr: 'संपादकीय व विचार',
    title_override_en: 'Editorial & Opinion',
    item_count: 3,
    sort_order: 5,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 'hb-06',
    block_type: 'crime',
    category_id: CAT_CRIME,
    title_override_hi: 'क्राइम एवं अदालत',
    title_override_mr: 'गुन्हेगारी आणि न्यायालये',
    title_override_en: 'Crime & Courts',
    item_count: 3,
    sort_order: 6,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 'hb-07',
    block_type: 'sports',
    category_id: CAT_SPORTS,
    title_override_hi: 'खेल जगत',
    title_override_mr: 'क्रीडा विश्व',
    title_override_en: 'Sports World',
    item_count: 4,
    sort_order: 7,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 'hb-08',
    block_type: 'epaper_promo',
    title_override_hi: 'आज का ई-समाचार पत्र',
    title_override_mr: 'आजचे ई-वृत्तपत्र',
    title_override_en: "Today's E-Paper Edition",
    item_count: 1,
    sort_order: 8,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 'hb-09',
    block_type: 'weather',
    title_override_hi: 'मौसम अपडेट',
    title_override_mr: 'हवामान अंदाज',
    title_override_en: 'Weather Forecast',
    item_count: 1,
    sort_order: 9,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
  },
];

const DEFAULT_AUTHOR = INITIAL_PROFILES[0];

export const INITIAL_ARTICLES: Article[] = [
  // ==========================================
  // ARTICLE 1: High-Speed Transit Corridor
  // ==========================================
  {
    id: 'art-001-mr',
    slug: 'pune-mumbai-hyper-transit-corridor-sanctioned-2026',
    language: 'mr',
    translation_group_id: GROUP_1,
    headline: 'पुणे-मुंबई दरम्यान नवीन ग्रीनफील्ड द्रुतगती कॉरिडोअरला मंजुरी; प्रवास केवळ ५० मिनिटांत होणार',
    subtitle: 'दळणवळण क्रांती : राज्य मंत्रिमंडळाचा महत्त्वपूर्ण निर्णय, पर्यावरणपूरक तंत्रज्ञानाचा वापर',
    excerpt: 'पुणे आणि मुंबई महानगर क्षेत्रातील वाहतूक कोंडीवर कायमस्वरूपी मात करण्यासाठी नव्या उच्च-गती द्रुतगती कॉरिडोअरला राज्य मंत्रिमंडळाने आज अंतिम मंजुरी दिली आहे.',
    body: `<p class="lead"><strong>मुंबई :</strong> पुणे आणि मुंबई या दोन प्रमुख औद्योगिक व आर्थिक केंद्रांमधील वाढत्या वाहतूक गर्दीवर कायमस्वरूपी उपाय म्हणून नव्या ग्रीनफील्ड हायपर-ट्रान्झिट कॉरिडोअरला राज्य शासनाने आज अधिकृत मान्यता दिली आहे. या प्रकल्पामुळे दोन्ही शहरांमधील प्रवासाचे अंतर केवळ ५० मिनिटांवर येणार आहे.</p>
<h2>प्रकल्पाची वैशिष्ट्ये व नियोजन</h2>
<p>नवीन कॉरिडोअर पर्यावरण संवर्धनाला सर्वोच्च प्राधान्य देऊन उभारण्यात येणार आहे. पश्चिम घाटातील जैवविविधतेला कोणतीही बाधा पोहोचणार नाही अशा अत्याधुनिक टनेल व एलिव्हेटेड मार्गांचा यामध्ये समावेश असेल.</p>
<blockquote>"हा केवळ एक रस्ता प्रकल्प नसून महाराष्ट्राच्या आर्थिक प्रगतीला नवी गती देणारा गेम-चेंजर कॉरिडोअर ठरेल," असे उद्योग व पायाभूत सुविधा मंत्रालयाने स्पष्ट केले.</blockquote>
<h2>शेतकऱ्यांना योग्य मोबदला आणि थेट सहभाग</h2>
<p>जमीन भूसंपादनाबाबत स्पष्ट भूमिका मांडताना प्रशासनाने जाहीर केले आहे की, प्रकल्पबाधित शेतकऱ्यांना बाजारभावापेक्षा अधिक मोबदला आणि प्रकल्पाच्या व्यावसायिक गाळ्यांमध्ये विशेष आरक्षण दिले जाईल. यामुळे ग्रामीण भागातील रोजगाराला मोठी चालना मिळणार आहे.</p>
<p>पहिल्या टप्प्याचे काम येत्या नोव्हेंबरपासून सुरू करण्याचे उद्दिष्ट निश्चित करण्यात आले आहे.</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'आधुनिक द्रुतगती महामार्ग व वाहतूक पायाभूत सुविधा',
    image_caption: 'पुणे-मुंबई नवीन द्रुतगती कॉरिडोअरचा प्रस्तावित आराखडा व प्रात्यक्षिक चित्रण.',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'संपादकीय प्रतिनिधी' },
    status: 'published',
    is_breaking: true,
    seo_title: 'पुणे-मुंबई नवीन ग्रीनफील्ड द्रुतगती कॉरिडोअर | JANVANI NEWS',
    seo_description: 'पुणे आणि मुंबई दरम्यान ५० मिनिटांत प्रवास शक्य करणाऱ्या नवीन द्रुतगती महामार्गाला राज्य मंत्रिमंडळाची मंजुरी.',
    reading_time_minutes: 3,
    published_at: '2026-02-21T06:30:00Z',
    created_at: '2026-02-21T06:00:00Z',
    updated_at: '2026-02-21T06:30:00Z',
    category_ids: [CAT_MAHARASHTRA, CAT_PUNE, CAT_MUMBAI],
    tags: ['पायाभूत सुविधा', 'पुणे-मुंबई', 'महाराष्ट्र विकास', 'वाहतूक'],
  },
  {
    id: 'art-001-hi',
    slug: 'pune-mumbai-hyper-transit-corridor-manzoor-2026',
    language: 'hi',
    translation_group_id: GROUP_1,
    headline: 'पुणे-मुंबई के बीच नए ग्रीनफील्ड एक्सप्रेस कॉरिडोर को मंजूरी; 50 मिनट में पूरा होगा सफर',
    subtitle: 'परिवहन क्रांति : राज्य मंत्रिमंडल का बड़ा फैसला, पर्यावरण अनुकूल तकनीक से होगा निर्माण',
    excerpt: 'पुणे और मुंबई के बीच यातायात के भारी दबाव को समाप्त करने के लिए राज्य मंत्रिमंडल ने नए हाई-स्पीड ग्रीनफील्ड कॉरिडोर को अंतिम हरी झंडी दे दी है।',
    body: `<p class="lead"><strong>मुंबई :</strong> महाराष्ट्र सरकार ने पुणे और मुंबई के बीच नए ग्रीनफील्ड एक्सप्रेसवे के निर्माण को आधिकारिक मंजूरी प्रदान कर दी है। इस आधुनिक परियोजना के पूरा होने के बाद दोनों शहरों के बीच यात्रा का समय घटकर मात्र 50 मिनट रह जाएगा।</p>
<h2>पर्यावरण संरक्षण और आधुनिक इंजीनियरिंग</h2>
<p>परियोजना के तहत पश्चिमी घाट की प्राकृतिक सुंदरता और जैव विविधता को सुरक्षित रखने के लिए आधुनिक सुरंगों और एलिवेटेड ट्रैक का निर्माण किया जाएगा। वन्यजीव गलियारों को किसी भी प्रकार की क्षति नहीं पहुंचने दी जाएगी।</p>
<blockquote>"यह कॉरिडोर केवल एक सड़क मार्ग नहीं है, बल्कि पश्चिमी भारत के आर्थिक विकास की धुरी साबित होगा," बुनियादी ढांचा मंत्रालय ने कहा।</blockquote>`,
    featured_image_path: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'एक्सप्रेसवे इंफ्रास्ट्रक्चर',
    image_caption: 'पुणे-मुंबई ग्रीनफील्ड कॉरिडोर का प्रस्तावित मॉडल।',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'संपादकीय ब्यूरो' },
    status: 'published',
    is_breaking: true,
    seo_title: 'पुणे-मुंबई ग्रीनफील्ड कॉरिडोर को मंजूरी | JANVANI NEWS',
    seo_description: 'पुणे और मुंबई के बीच यात्रा का समय घटकर 50 मिनट होगा, राज्य मंत्रिमंडल की मंजूरी।',
    reading_time_minutes: 3,
    published_at: '2026-02-21T06:35:00Z',
    created_at: '2026-02-21T06:00:00Z',
    updated_at: '2026-02-21T06:35:00Z',
    category_ids: [CAT_MAHARASHTRA, CAT_PUNE, CAT_MUMBAI],
    tags: ['इंफ्रास्ट्रक्चर', 'महाराष्ट्र', 'परिवहन', 'पुणे-मुंबई'],
  },
  {
    id: 'art-001-en',
    slug: 'pune-mumbai-hyper-transit-corridor-approved-2026',
    language: 'en',
    translation_group_id: GROUP_1,
    headline: 'Cabinet Clears 50-Minute Greenfield High-Speed Transit Corridor Linking Pune and Mumbai',
    subtitle: 'Transit Revolution: Eco-sensitive engineering and advanced viaducts to slash intercity travel time',
    excerpt: 'In a landmark infrastructure development, the state cabinet has sanctioned the high-speed greenfield transit corridor linking Pune and Mumbai metropolitan belts.',
    body: `<p class="lead"><strong>Mumbai:</strong> In a decisive step towards de-congesting regional transit, the Maharashtra government has formally approved the greenfield hyper-transit corridor connecting Pune and Mumbai. The multi-modal expressway is designed to reduce the commute between the two metropolises to just 50 minutes.</p>
<h2>Project Highlights and Environmental Safeguards</h2>
<p>Special engineering design guarantees that the Western Ghats' ecological sanctuaries remain undisturbed. Tunnel boring and viaduct technologies will be deployed to avoid fragmentation of wildlife habitats.</p>
<blockquote>"This corridor is not merely a highway; it is the economic backbone for western India\'s next trillion-dollar growth trajectory," the infrastructure ministry affirmed.</blockquote>
<h2>Landowner Rehabilitation & Equitable Growth</h2>
<p>Direct cash compensation above market benchmark alongside commercial development quotas have been earmarked for participating agrarian families.</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'Modern expressway infrastructure',
    image_caption: 'Conceptual render of the Pune-Mumbai high-speed transit corridor.',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'Editorial Bureau' },
    status: 'published',
    is_breaking: true,
    seo_title: 'Pune-Mumbai Greenfield Corridor Approved | JANVANI NEWS',
    seo_description: 'Travel time between Pune and Mumbai set to reduce to 50 minutes under new state greenfield transit plan.',
    reading_time_minutes: 3,
    published_at: '2026-02-21T06:35:00Z',
    created_at: '2026-02-21T06:00:00Z',
    updated_at: '2026-02-21T06:35:00Z',
    category_ids: [CAT_MAHARASHTRA, CAT_PUNE, CAT_MUMBAI],
    tags: ['Infrastructure', 'Transit', 'Maharashtra', 'Economy'],
  },

  // ==========================================
  // ARTICLE 2: Agritech & AI
  // ==========================================
  {
    id: 'art-002-mr',
    slug: 'ai-driven-irrigation-transforming-marathwada-farms',
    language: 'mr',
    translation_group_id: GROUP_2,
    headline: 'कृत्रिम बुद्धिमत्ता (AI) तंत्रज्ञानाने मराठवाड्यातील शेतीत क्रांती; पाण्याचा ४० टक्के वापर कमी होऊन उत्पादनात वाढ',
    subtitle: 'स्मार्ट शेती : हवामानाचा अचूक अंदाज आणि स्वयंचलित सूक्ष्म सिंचन प्रणालीचा शेतकऱ्यांना मोठा लाभ',
    excerpt: 'दुष्काळग्रस्त मराठवाड्यात डिजिटल सेन्सर्स आणि कृत्रिम बुद्धिमत्ता आधारित जलव्यवस्थापन प्रणालीमुळे शेतकऱ्यांचे जीवनमान उंचावत असून उत्पन्नात लक्षणीय भर पडत आहे.',
    body: `<p class="lead"><strong>छत्रपती संभाजीनगर :</strong> पारंपरिक दुष्काळी पट्ट्यात आधुनिक तंत्रज्ञानाचा वापर करून पाण्याचा थेंब अन् थेंब सत्कारणी लावणारे मराठवाड्यातील शेतकरी आता संपूर्ण देशासाठी मार्गदर्शक ठरत आहेत. एआय संचलित सूक्ष्म सिंचन यंत्रणेमुळे पिकांचे उत्पादन सरासरी ३५ टक्क्यांनी वाढले आहे.</p>
<h2>मातीतील ओलाव्यावर आधारित अचूक पाणीपुरवठा</h2>
<p>या तंत्रज्ञानामध्ये जमिनीखाली बसवण्यात आलेले सेन्सर्स थेट सॅटेलाइट आणि कृत्रिम बुद्धिमत्ता अल्गोरिदमशी जोडलेले असतात. झाडाच्या मुळांना नेमके किती पाणी आवश्यक आहे याचा रिअल-टाइम डेटा शेतकऱ्याच्या मोबाईल ॲपवर उपलब्ध होतो.</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'स्मार्ट शेती तंत्रज्ञान आणि सूक्ष्म सिंचन',
    image_caption: 'मराठवाड्यातील शेतामध्ये बसवण्यात आलेली आधुनिक सेन्सर प्रणाली.',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'कृषी प्रतिनिधी' },
    status: 'published',
    is_breaking: false,
    seo_title: 'मराठवाड्यात AI शेती तंत्रज्ञानाची क्रांती | JANVANI NEWS',
    seo_description: 'कृत्रिम बुद्धिमत्तेच्या साहाय्याने मराठवाड्यातील शेतकऱ्यांनी वाचवले ४० टक्के पाणी, उत्पादनात वाढ.',
    reading_time_minutes: 3,
    published_at: '2026-02-21T07:15:00Z',
    created_at: '2026-02-21T07:00:00Z',
    updated_at: '2026-02-21T07:15:00Z',
    category_ids: [CAT_AGRICULTURE, CAT_TECH, CAT_MAHARASHTRA],
    tags: ['कृषी', 'तंत्रज्ञान', 'मराठवाडा', 'सिंचन'],
  },
  {
    id: 'art-002-hi',
    slug: 'ai-smart-farming-transforming-marathwada-agriculture-hi',
    language: 'hi',
    translation_group_id: GROUP_2,
    headline: 'कृत्रिम बुद्धिमत्ता (AI) से मराठवाड़ा में कृषि क्रांति; 40% पानी की बचत के साथ पैदावार में भारी उछाल',
    subtitle: 'स्मार्ट खेती : सेंसर और मौसम पूर्वानुमान तकनीक ने बदली किसानों की तकदीर',
    excerpt: 'सूखा प्रभावित मराठवाड़ा में एआई संचालित सूक्ष्म सिंचाई प्रणाली से किसानों की लागत आधी हुई और उत्पादन में 35 प्रतिशत की बढ़ोतरी दर्ज की गई।',
    body: `<p class="lead"><strong>छत्रपति संभाजीनगर :</strong> तकनीक के सही उपयोग से कैसे जल संकट को मात दी जा सकती है, इसका उत्कृष्ट उदाहरण मराठवाड़ा के प्रगतिशील किसानों ने प्रस्तुत किया है। एआई और आईओटी सेंसर आधारित स्मार्ट ड्रिप सिंचाई से पानी की बचत के साथ-साथ फलों और कपास की गुणवत्ता में सुधार हुआ है।</p>
<h2>सीधे मोबाइल ऐप पर रियल-टाइम परामर्श</h2>
<p>भूमि में स्थापित वायरलेस सेंसर मिट्टी की नमी, लवणता और पोषक तत्वों की स्थिति सीधे क्लाउड सर्वर पर भेजते हैं, जिससे किसान को सिंचाई का सही समय पता चलता है।</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'स्मार्ट खेती तकनीक',
    image_caption: 'मराठवाड़ा के खेतों में लगी आधुनिक आईओटी सेंसर प्रणाली।',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'कृषि संवाददाता' },
    status: 'published',
    is_breaking: false,
    seo_title: 'मराठवाड़ा में AI आधारित स्मार्ट खेती | JANVANI NEWS',
    seo_description: 'एआई और ड्रिप सिंचाई से मराठवाड़ा के किसानों ने पानी बचाया और उत्पादन बढ़ाया।',
    reading_time_minutes: 3,
    published_at: '2026-02-21T07:18:00Z',
    created_at: '2026-02-21T07:00:00Z',
    updated_at: '2026-02-21T07:18:00Z',
    category_ids: [CAT_AGRICULTURE, CAT_TECH, CAT_MAHARASHTRA],
    tags: ['कृषि', 'तकनीक', 'महाराष्ट्र', 'एआई'],
  },
  {
    id: 'art-002-en',
    slug: 'ai-guided-micro-irrigation-transforming-farms-en',
    language: 'en',
    translation_group_id: GROUP_2,
    headline: 'AI-Guided Micro-Irrigation Revolutionizes Agrarian Yields in Drought-Prone Marathwada',
    subtitle: 'Precision Agritech: Farmers slash water utilization by 40% while achieving 35% productivity leap',
    excerpt: 'Agritech deployments featuring IoT soil sensors and predictive AI algorithms are transforming drought resilience across Maharashtra farming clusters.',
    body: `<p class="lead"><strong>Chhatrapati Sambhajinagar:</strong> Integrating cutting-edge artificial intelligence with precision drip irrigation is proving transformative for agrarian households in central Maharashtra, curbing water waste by 40% while enhancing crop quality.</p>
<h2>Sub-Surface Soil Intelligence</h2>
<p>Wireless IoT probes buried at root depth continuously telemetry moisture, temperature, and nitrogen levels to localized machine learning models, ensuring water is released only when crops demand it.</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'Smart farming and drip irrigation',
    image_caption: 'Agritech IoT deployment across Marathwada agricultural tracts.',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'Agritech Desk' },
    status: 'published',
    is_breaking: false,
    seo_title: 'AI Micro-Irrigation in Marathwada | JANVANI NEWS',
    seo_description: 'Precision agritech enables Marathwada cultivators to maximize yield with 40% less water.',
    reading_time_minutes: 3,
    published_at: '2026-02-21T07:20:00Z',
    created_at: '2026-02-21T07:00:00Z',
    updated_at: '2026-02-21T07:20:00Z',
    category_ids: [CAT_AGRICULTURE, CAT_TECH, CAT_MAHARASHTRA],
    tags: ['Agriculture', 'Technology', 'Agritech', 'Water'],
  },

  // ==========================================
  // ARTICLE 3: Sports Victory
  // ==========================================
  {
    id: 'art-003-mr',
    slug: 'india-cricket-championship-series-victory-2026',
    language: 'mr',
    translation_group_id: GROUP_3,
    headline: 'भारताचा ऐतिहासिक कसोटी विजय; रोमांचक सामन्यात प्रतिस्पर्ध्याला नमवत मालिका जिंकली',
    subtitle: 'क्रीडा वार्ता : भारतीय गोलंदाजांचा भेदक मारा आणि मधल्या फळीतील फलंदाजांचे शानदार योगदान',
    excerpt: 'शेवटच्या दिवशी रंगलेल्या अटीतटीच्या सामन्यात भारतीय संघाने अविस्मरणीय विजय संपादन करत कसोटी मालिका आपल्या नावावर केली आहे.',
    body: `<p class="lead"><strong>नवी दिल्ली :</strong> भारतीय क्रिकेट संघाने पुन्हा एकदा आंतरराष्ट्रीय पटलावर आपला दबदबा सिद्ध करत कसोटी क्रिकेट मालिकेत दणदणीत विजय साकारला आहे. अटीतटीच्या सामन्यात पाचव्या दिवशी भारतीय फिरकीपटूंनी केलेल्या अचूक माऱ्याच्या बळावर प्रतिस्पर्ध्याला पराभवाचा धक्का दिला.</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'क्रिकेट मैदान आणि सामना',
    image_caption: 'ऐतिहासिक विजयानंतर भारतीय संघाचा जल्लोष.',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'क्रीडा प्रतिनिधी' },
    status: 'published',
    is_breaking: true,
    seo_title: 'भारताचा ऐतिहासिक कसोटी मालिका विजय | JANVANI NEWS',
    seo_description: 'पाचव्या दिवशी अखेरच्या सत्रात भारताचा थरारक कसोटी विजय, मालिका खिशात.',
    reading_time_minutes: 2,
    published_at: '2026-02-21T08:00:00Z',
    created_at: '2026-02-21T07:45:00Z',
    updated_at: '2026-02-21T08:00:00Z',
    category_ids: [CAT_SPORTS, CAT_INDIA],
    tags: ['क्रिकेट', 'क्रीडा', 'भारत'],
  },
  {
    id: 'art-003-hi',
    slug: 'india-historic-test-series-victory-2026-hi',
    language: 'hi',
    translation_group_id: GROUP_3,
    headline: 'भारत की ऐतिहासिक टेस्ट सीरीज जीत; रोमांचक मुकाबले में विपक्षी टीम को मात देकर रचा इतिहास',
    subtitle: 'खेल जगत : पांचवें दिन भारतीय गेंदबाजों का शानदार प्रदर्शन, देश भर में जश्न का माहौल',
    excerpt: 'आखिरी सत्र तक खिंचे रोमांचक टेस्ट मुकाबले में भारतीय टीम ने धैर्य और आक्रामकता का बेहतरीन संतुलन दिखाते हुए सीरीज पर 3-1 से कब्जा जमा लिया।',
    body: `<p class="lead"><strong>नई दिल्ली :</strong> भारतीय क्रिकेट टीम ने अपनी धरती पर एक और गौरवशाली अध्याय जोड़ते हुए टेस्ट श्रृंखला में ऐतिहासिक जीत दर्ज की है। अंतिम दिन मैच का रुख पूरी तरह से भारतीय स्पिनरों के जादुई स्पेल के पक्ष में मुड़ गया।</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'क्रिकेट स्टेडियम मैच',
    image_caption: 'मैच जीतने के बाद जश्न मनाते भारतीय क्रिकेट खिलाड़ी।',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'खेल डेस्क' },
    status: 'published',
    is_breaking: true,
    seo_title: 'भारत की ऐतिहासिक टेस्ट श्रृंखला जीत | JANVANI NEWS',
    seo_description: 'अंतिम सत्र में भारत का शानदार प्रदर्शन, टेस्ट श्रृंखला 3-1 से जीती।',
    reading_time_minutes: 2,
    published_at: '2026-02-21T08:05:00Z',
    created_at: '2026-02-21T07:45:00Z',
    updated_at: '2026-02-21T08:05:00Z',
    category_ids: [CAT_SPORTS, CAT_INDIA],
    tags: ['क्रिकेट', 'खेल', 'भारत'],
  },
  {
    id: 'art-003-en',
    slug: 'india-clinches-historic-test-championship-series-en',
    language: 'en',
    translation_group_id: GROUP_3,
    headline: 'India Clinches Historic Test Championship Series with Thrilling Final-Day Victory',
    subtitle: 'Cricket Glory: Masterful spin performance in final session seals emphatic 3-1 series triumph',
    excerpt: 'A sensational final-session bowling display propelled the Indian cricket team to an unforgettable Test match triumph and decisive series title.',
    body: `<p class="lead"><strong>New Delhi:</strong> Showcasing exceptional grit and tactical discipline, Team India secured a pulsating Test series victory on Day 5, bowling out the touring side in the final hour of play amidst rapturous crowd cheers.</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'Cricket stadium match',
    image_caption: 'Team India celebrates a dramatic final-wicket victory on Day 5.',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'Sports Correspondent' },
    status: 'published',
    is_breaking: true,
    seo_title: 'India Wins Historic Test Championship Series | JANVANI NEWS',
    seo_description: 'Final session bowling blitz seals 3-1 Test series triumph for India.',
    reading_time_minutes: 2,
    published_at: '2026-02-21T08:10:00Z',
    created_at: '2026-02-21T07:45:00Z',
    updated_at: '2026-02-21T08:10:00Z',
    category_ids: [CAT_SPORTS, CAT_INDIA],
    tags: ['Cricket', 'Sports', 'India', 'Test Championship'],
  },

  // ==========================================
  // ARTICLE 4: Business & Economy
  // ==========================================
  {
    id: 'art-004-mr',
    slug: 'mumbai-fintech-hub-global-investment-record',
    language: 'mr',
    translation_group_id: GROUP_4,
    headline: 'मुंबईतील फिनटेक क्षेत्रात ऐतिहासिक गुंतवणूक; जागतिक गुंतवणूकदारांचा भारतावर प्रचंड विश्वास',
    subtitle: 'अर्थकारण : चालू आर्थिक वर्षात ४ अब्ज डॉलर्सहून अधिक विदेशी गुंतवणुकीची नोंद',
    excerpt: 'डिजिटल पेमेंट, सायबर सिक्युरिटी आणि ब्लॉकचेन आधारित वित्तीय तंत्रज्ञानासाठी मुंबई हे आशियातील आघाडीचे केंद्र ठरले असून जागतिक भांडवलाचा ओघ सुरूच आहे.',
    body: `<p class="lead"><strong>मुंबई :</strong> मुंबईच्या बीकेसी आणि ठाणे पट्ट्यातील फिनटेक क्लस्टरने जागतिक गुंतवणूक आकर्षित करण्यात नवा उच्चांक गाठला आहे. रिझर्व्ह बँक ऑफ इंडियाच्या पारदर्शक धोरणांमुळे आंतरराष्ट्रीय गुंतवणूकदारांनी भारतीय स्टार्ट-अप्सवर मोठा विश्वास दर्शवला आहे.</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'मुंबई बीकेसी वित्तीय केंद्र',
    image_caption: 'मुंबईचे आंतरराष्ट्रीय वित्तीय केंद्र (BKC).',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'अर्थ प्रतिनिधी' },
    status: 'published',
    is_breaking: false,
    seo_title: 'मुंबई फिनटेक क्षेत्रात विक्रमी गुंतवणूक | JANVANI NEWS',
    seo_description: 'मुंबईच्या वित्तीय क्षेत्रात विदेशी गुंतवणुकीचा नवा उच्चांक.',
    reading_time_minutes: 2,
    published_at: '2026-02-21T08:30:00Z',
    created_at: '2026-02-21T08:00:00Z',
    updated_at: '2026-02-21T08:30:00Z',
    category_ids: [CAT_BUSINESS, CAT_MUMBAI],
    tags: ['अर्थकारण', 'मुंबई', 'फिनटेक', 'शेअर बाजार'],
  },
  {
    id: 'art-004-hi',
    slug: 'mumbai-fintech-hub-global-investment-record-hi',
    language: 'hi',
    translation_group_id: GROUP_4,
    headline: 'मुंबई फिनटेक सेक्टर में रिकॉर्ड निवेश; वैश्विक निवेशकों का भारत की डिजिटल अर्थव्यवस्था पर भरोसा',
    subtitle: 'व्यापार : चालू वित्त वर्ष में 4 अरब डॉलर से अधिक का प्रत्यक्ष विदेशी निवेश दर्ज',
    excerpt: 'डिजिटल भुगतान, साइबर सुरक्षा और वित्तीय तकनीक के क्षेत्र में मुंबई एशिया का सबसे तेजी से उभरता हब बनकर उभरा है।',
    body: `<p class="lead"><strong>मुंबई :</strong> बांद्रा-कुर्ला कॉम्प्लेक्स (BKC) और मुंबई महानगर क्षेत्र में फिनटेक कंपनियों ने विदेशी पूंजी निवेश का नया कीर्तिमान स्थापित किया है। रिजर्व बैंक के प्रगतिशील नियमों से स्टार्ट-अप इकोसिस्टम को मजबूती मिली है।</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'मुंबई वित्तीय केंद्र',
    image_caption: 'मुंबई का अंतरराष्ट्रीय वित्तीय हब (BKC)।',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'व्यापार डेस्क' },
    status: 'published',
    is_breaking: false,
    seo_title: 'मुंबई फिनटेक में रिकॉर्ड निवेश | JANVANI NEWS',
    seo_description: 'मुंबई के फिनटेक उद्योग में 4 अरब डॉलर का विदेशी निवेश आकर्षित हुआ।',
    reading_time_minutes: 2,
    published_at: '2026-02-21T08:35:00Z',
    created_at: '2026-02-21T08:00:00Z',
    updated_at: '2026-02-21T08:35:00Z',
    category_ids: [CAT_BUSINESS, CAT_MUMBAI],
    tags: ['व्यापार', 'मुंबई', 'फिनटेक', 'अर्थव्यवस्था'],
  },
  {
    id: 'art-004-en',
    slug: 'mumbai-fintech-hub-attracts-record-global-capital-en',
    language: 'en',
    translation_group_id: GROUP_4,
    headline: 'Mumbai FinTech Hub Attracts Record $4B in Global Inward Capital Flows',
    subtitle: 'Financial Enterprise: Institutional investors back next-generation payment and blockchain networks',
    excerpt: 'Consolidating its stance as Asia\'s premier financial powerhouse, Mumbai\'s BKC fintech cluster has recorded milestone overseas investments.',
    body: `<p class="lead"><strong>Mumbai:</strong> Foreign direct investment across digital payments, risk scoring, and enterprise banking software reached $4 billion in the current financial year, highlighting global investor appetite for India\'s fintech innovators.</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'Mumbai BKC Financial Hub',
    image_caption: 'Mumbai\'s prime international finance corridor (BKC).',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'Markets Correspondent' },
    status: 'published',
    is_breaking: false,
    seo_title: 'Mumbai FinTech Hub Sets Investment Record | JANVANI NEWS',
    seo_description: 'Global venture capital into Mumbai financial tech hits record $4B milestone.',
    reading_time_minutes: 2,
    published_at: '2026-02-21T08:40:00Z',
    created_at: '2026-02-21T08:00:00Z',
    updated_at: '2026-02-21T08:40:00Z',
    category_ids: [CAT_BUSINESS, CAT_MUMBAI],
    tags: ['Business', 'Mumbai', 'FinTech', 'Investment'],
  },

  // ==========================================
  // ARTICLE 5: Education
  // ==========================================
  {
    id: 'art-005-mr',
    slug: 'maharashtra-digital-classrooms-initiative-2026',
    language: 'mr',
    translation_group_id: GROUP_5,
    headline: 'राज्यातील सर्व जिल्हा परिषद शाळांमध्ये मोफत डिजिटल लायब्ररी आणि इंटरनेट सुविधा सुरू',
    subtitle: 'शिक्षण क्रांती : ग्रामीण भागातील विद्यार्थ्यांसाठी अत्याधुनिक ई-लर्निंग प्लॅटफॉर्म उपलब्ध',
    excerpt: 'ग्रामीण महाराष्ट्रातील शिक्षणाचा दर्जा उंचावण्यासाठी शासनाने सर्व जिल्हा परिषद शाळा हाय-स्पीड इंटरनेट आणि डिजिटल अभ्यासक्रमाशी जोडल्या आहेत.',
    body: `<p class="lead"><strong>पुणे :</strong> ग्रामीण भागातील विद्यार्थ्यांचा शैक्षणिक विकास अधिक सुलभ व्हावा यासाठी राज्य शिक्षण मंडळाने सर्व शाळांमध्ये स्मार्ट क्लासरूम आणि मोफत डिजिटल वाचनालयाची सुरुवात केली आहे.</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'डिजिटल वर्ग आणि शिक्षण',
    image_caption: 'जिल्हा परिषद शाळेतील डिजिटल क्लासरूमचे प्रात्यक्षिक.',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'शिक्षण प्रतिनिधी' },
    status: 'published',
    is_breaking: false,
    seo_title: 'जिल्हा परिषद शाळांमध्ये डिजिटल क्रांती | JANVANI NEWS',
    seo_description: 'सर्व जिल्हा परिषद शाळांमध्ये मोफत ई-लर्निंग सुविधा सुरू.',
    reading_time_minutes: 2,
    published_at: '2026-02-21T09:00:00Z',
    created_at: '2026-02-21T08:30:00Z',
    updated_at: '2026-02-21T09:00:00Z',
    category_ids: [CAT_EDUCATION, CAT_TECH, CAT_MAHARASHTRA],
    tags: ['शिक्षण', 'महाराष्ट्र', 'डिजिटल वर्ग'],
  },
  {
    id: 'art-005-hi',
    slug: 'maharashtra-digital-smart-classrooms-in-schools-hi',
    language: 'hi',
    translation_group_id: GROUP_5,
    headline: 'महाराष्ट्र के सभी जिला परिषद स्कूलों में डिजिटल स्मार्ट क्लासरूम और मुफ्त इंटरनेट शुरू',
    subtitle: 'शिक्षा क्रांति : ग्रामीण छात्रों को आधुनिक कंप्यूटर और ई-लाइब्रेरी की सौगात',
    excerpt: 'ग्रामीण अंचल के सरकारी विद्यालयों को आधुनिक तकनीक से जोड़ते हुए राज्य सरकार ने डिजिटल क्लासरूम परियोजना का शुभारंभ किया है।',
    body: `<p class="lead"><strong>पुणे :</strong> ग्रामीण छात्रों को विश्वस्तरीय शिक्षा सुलभ कराने के उद्देश्य से राज्य शिक्षा विभाग ने सभी प्राथमिक और माध्यमिक जिला परिषद स्कूलों में हाई-स्पीड ब्रॉडबैंड और इंटरैक्टिव स्क्रीन स्थापित कर दी हैं।</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'डिजिटल कक्षा और शिक्षा',
    image_caption: 'स्कूल में स्मार्ट क्लासरूम में पढ़ते हुए ग्रामीण विद्यार्थी।',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'शिक्षा डेस्क' },
    status: 'published',
    is_breaking: false,
    seo_title: 'जिला परिषद स्कूलों में स्मार्ट क्लासरूम | JANVANI NEWS',
    seo_description: 'सरकारी स्कूलों में मुफ्त इंटरनेट और डिजिटल लाइब्रेरी से आधुनिक शिक्षा।',
    reading_time_minutes: 2,
    published_at: '2026-02-21T09:05:00Z',
    created_at: '2026-02-21T08:30:00Z',
    updated_at: '2026-02-21T09:05:00Z',
    category_ids: [CAT_EDUCATION, CAT_TECH, CAT_MAHARASHTRA],
    tags: ['शिक्षा', 'महाराष्ट्र', 'स्मार्ट क्लास'],
  },
  {
    id: 'art-005-en',
    slug: 'maharashtra-launches-smart-classrooms-rural-schools-en',
    language: 'en',
    translation_group_id: GROUP_5,
    headline: 'Maharashtra Equips Rural Schools with High-Speed Internet and Interactive Smart Classrooms',
    subtitle: 'EdTech Equity: Groundbreaking drive bridges digital educational divide for over 2 million students',
    excerpt: 'State education authorities have completed the rollout of fiber broadband and digital tablet libraries across rural Zilla Parishad schools.',
    body: `<p class="lead"><strong>Pune:</strong> In a transformative drive to democratize quality learning, Maharashtra has connected all Zilla Parishad educational institutions to optical fiber connectivity and rich multilingual digital curriculums.</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'Digital classroom and students',
    image_caption: 'Students interacting with modern e-learning panels in a rural classroom.',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'Education Desk' },
    status: 'published',
    is_breaking: false,
    seo_title: 'Maharashtra Smart Classrooms in Rural Schools | JANVANI NEWS',
    seo_description: '2 million students gain access to interactive digital learning in government schools.',
    reading_time_minutes: 2,
    published_at: '2026-02-21T09:10:00Z',
    created_at: '2026-02-21T08:30:00Z',
    updated_at: '2026-02-21T09:10:00Z',
    category_ids: [CAT_EDUCATION, CAT_TECH, CAT_MAHARASHTRA],
    tags: ['Education', 'Tech', 'Maharashtra', 'Schools'],
  },

  // ==========================================
  // ARTICLE 6: Healthcare & Research
  // ==========================================
  {
    id: 'art-006-mr',
    slug: 'pune-institute-breakthrough-indigenous-vaccine-research',
    language: 'mr',
    translation_group_id: GROUP_6,
    headline: 'पुण्यातील संशोधन संस्थेला मोठे यश; स्वदेशी कर्करोग प्रतिबंधक लशीच्या मानवी चाचण्या यशस्वी',
    subtitle: 'आरोग्य वार्ता : जागतिक आरोग्य परिषदेत भारतीय शास्त्रज्ञांच्या संशोधनाची प्रशंसा',
    excerpt: 'पुण्यातील वैद्यकीय संशोधन केंद्राने विकसित केलेल्या स्वदेशी लशीच्या तिसऱ्या टप्प्यातील क्लिनिकल चाचण्या यशस्वी ठरल्या असून उत्पादन लवकरच सुरू होईल.',
    body: `<p class="lead"><strong>पुणे :</strong> भारतीय वैद्यकीय विज्ञानाने पुन्हा एकदा जागतिक पटलावर आपला प्रभाव सिद्ध केला आहे. पुण्यातील राष्ट्रीय संशोधन प्रयोगशाळेने तयार केलेली अत्याधुनिक लस ९४ टक्के परिणामकारक ठरली आहे.</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'वैद्यकीय प्रयोगशाळा व संशोधन',
    image_caption: 'पुण्यातील लॅबमध्ये संशोधन करणारे भारतीय शास्त्रज्ञ.',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'आरोग्य प्रतिनिधी' },
    status: 'published',
    is_breaking: false,
    seo_title: 'पुण्यात स्वदेशी लशीचे संशोधन यशस्वी | JANVANI NEWS',
    seo_description: 'पुण्यातील प्रयोगशाळेत विकसित लशीच्या चाचण्या यशस्वी.',
    reading_time_minutes: 2,
    published_at: '2026-02-21T09:30:00Z',
    created_at: '2026-02-21T09:00:00Z',
    updated_at: '2026-02-21T09:30:00Z',
    category_ids: [CAT_HEALTH, CAT_PUNE, CAT_TECH],
    tags: ['आरोग्य', 'पुणे', 'संशोधन', 'लस'],
  },
  {
    id: 'art-006-hi',
    slug: 'pune-institute-breakthrough-indigenous-vaccine-hi',
    language: 'hi',
    translation_group_id: GROUP_6,
    headline: 'पुणे अनुसंधान संस्थान को ऐतिहासिक सफलता; स्वदेशी कैंसर रोधी टीके का ह्यूमन ट्रायल सफल',
    subtitle: 'स्वास्थ्य : भारतीय वैज्ञानिकों के शोध की वैश्विक मंच पर सराहना, जल्द शुरू होगा उत्पादन',
    excerpt: 'पुणे के प्रमुख बायोमेडिकल रिसर्च सेंटर द्वारा विकसित स्वदेशी दवा का अंतिम क्लीनिकल ट्रायल 94 प्रतिशत प्रभावी साबित हुआ है।',
    body: `<p class="lead"><strong>पुणे :</strong> भारतीय चिकित्सा विज्ञान के इतिहास में एक नया मील का पत्थर जुड़ गया है। पुणे में विकसित स्वदेशी ऑन्कोलॉजी टीके ने उम्मीद से बेहतर परिणाम दिए हैं और इसके व्यावसायिक निर्माण की तैयारियां शुरू कर दी गई हैं।</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'बायोमेडिकल रिसर्च लैब',
    image_caption: 'पुणे के बायो-रिसर्च सेंटर में जांच करते वैज्ञानिक।',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'स्वास्थ्य डेस्क' },
    status: 'published',
    is_breaking: false,
    seo_title: 'पुणे में स्वदेशी टीके का सफल परीक्षण | JANVANI NEWS',
    seo_description: 'पुणे के वैज्ञानिकों द्वारा विकसित टीका 94% प्रभावी पाया गया।',
    reading_time_minutes: 2,
    published_at: '2026-02-21T09:35:00Z',
    created_at: '2026-02-21T09:00:00Z',
    updated_at: '2026-02-21T09:35:00Z',
    category_ids: [CAT_HEALTH, CAT_PUNE, CAT_TECH],
    tags: ['स्वास्थ्य', 'पुणे', 'अनुसंधान', 'दवा'],
  },
  {
    id: 'art-006-en',
    slug: 'pune-biomedical-institute-clinical-trial-breakthrough-en',
    language: 'en',
    translation_group_id: GROUP_6,
    headline: 'Pune Biomedical Institute Achieves Landmark Breakthrough in Indigenous Immunotherapy Trials',
    subtitle: 'Medical Milestone: Phase III human clinical trials report 94% therapeutic efficacy rate',
    excerpt: 'Pioneering work by scientists in Pune has yielded an affordable therapeutic immunization candidate, winning global scientific acclaim.',
    body: `<p class="lead"><strong>Pune:</strong> Marking a profound triumph for Indian scientific research, clinical trials conducted across premier medical centers confirmed a 94% efficacy benchmark for the indigenously developed targeted oncology treatment.</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'Biomedical laboratory research',
    image_caption: 'Indian research scientists at the Pune biotechnology research complex.',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'Healthcare Desk' },
    status: 'published',
    is_breaking: false,
    seo_title: 'Pune Breakthrough in Immunotherapy Research | JANVANI NEWS',
    seo_description: 'Indigenous clinical trial in Pune shows 94% efficacy, advancing global healthcare.',
    reading_time_minutes: 2,
    published_at: '2026-02-21T09:40:00Z',
    created_at: '2026-02-21T09:00:00Z',
    updated_at: '2026-02-21T09:40:00Z',
    category_ids: [CAT_HEALTH, CAT_PUNE, CAT_TECH],
    tags: ['Health', 'Pune', 'Biomedical', 'Science'],
  },

  // ==========================================
  // ARTICLE 7: Entertainment & Culture
  // ==========================================
  {
    id: 'art-007-mr',
    slug: 'national-film-awards-maharashtra-cinema-triumph',
    language: 'mr',
    translation_group_id: GROUP_7,
    headline: 'राष्ट्रीय चित्रपट पुरस्कारांमध्ये मराठी सिनेसृष्टीचा डंका; सर्वोत्कृष्ट दिग्दर्शन आणि अभिनयाचा बहुमान',
    subtitle: 'मनोरंजन : आशयसंपन्न आणि सामाजिक विषयांवर आधारित चित्रपटांचे देशपातळीवर कौतुक',
    excerpt: 'नवी दिल्ली येथे जाहीर झालेल्या ७२व्या राष्ट्रीय चित्रपट पुरस्कारांमध्ये मराठी चित्रपटांनी विविध महत्त्वाच्या श्रेणींमध्ये अव्वल स्थान मिळवले आहे.',
    body: `<p class="lead"><strong>मुंबई :</strong> राष्ट्रीय चित्रपट पुरस्कारांमध्ये मराठी सिनेसृष्टीने पुन्हा एकदा आपल्या दर्जेदार कथा आणि दिग्दर्शनाचा ठसा उमटवला आहे. अनेक प्रतिष्ठेचे पुरस्कार मराठी चित्रपटांनी पटकावले आहेत.</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'सिनेमा व चित्रपट पुरस्कार',
    image_caption: 'राष्ट्रीय चित्रपट पुरस्कार सोहळ्यातील सुवर्णक्षण.',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'मनोरंजन वार्ताहर' },
    status: 'published',
    is_breaking: false,
    seo_title: 'राष्ट्रीय चित्रपट पुरस्कारांमध्ये मराठीचा डंका | JANVANI NEWS',
    seo_description: '७२व्या राष्ट्रीय चित्रपट पुरस्कारांमध्ये मराठी चित्रपटांना मानाचे स्थान.',
    reading_time_minutes: 2,
    published_at: '2026-02-21T10:00:00Z',
    created_at: '2026-02-21T09:30:00Z',
    updated_at: '2026-02-21T10:00:00Z',
    category_ids: [CAT_ENTERTAINMENT, CAT_MUMBAI],
    tags: ['मनोरंजन', 'चित्रपट', 'मराठी सिनेमा'],
  },
  {
    id: 'art-007-hi',
    slug: 'national-film-awards-honor-regional-cinema-hi',
    language: 'hi',
    translation_group_id: GROUP_7,
    headline: 'राष्ट्रीय फिल्म पुरस्कारों में क्षेत्रीय सिनेमा का परचम; सर्वश्रेष्ठ निर्देशन और पटकथा में अव्वल',
    subtitle: 'मनोरंजन : सामाजिक सरोकारों और मानवीय संवेदनाओं से जुड़ी फिल्मों को मिले शीर्ष सम्मान',
    excerpt: 'नई दिल्ली में घोषित राष्ट्रीय फिल्म पुरस्कारों में सामाजिक यथार्थ पर आधारित कृतियों ने आलोचकों और दर्शकों का दिल जीत लिया।',
    body: `<p class="lead"><strong>मुंबई :</strong> राष्ट्रीय फिल्म पुरस्कारों के ताजा संस्करण में भारतीय सिनेमा की विविधता और कलात्मक गहराई का भव्य उत्सव देखने को मिला। मराठी और हिंदी की संवेदनशील फिल्मों ने मुख्य श्रेणियों में बाजी मारी।</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'सिनेमा पुरस्कार समारोह',
    image_caption: 'राष्ट्रीय फिल्म पुरस्कार समारोह का दृश्य।',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'मनोरंजन डेस्क' },
    status: 'published',
    is_breaking: false,
    seo_title: 'राष्ट्रीय फिल्म पुरस्कारों में सिनेमा का गौरव | JANVANI NEWS',
    seo_description: 'राष्ट्रीय फिल्म पुरस्कारों में क्षेत्रीय व सार्थक फिल्मों को शीर्ष सम्मान मिला।',
    reading_time_minutes: 2,
    published_at: '2026-02-21T10:05:00Z',
    created_at: '2026-02-21T09:30:00Z',
    updated_at: '2026-02-21T10:05:00Z',
    category_ids: [CAT_ENTERTAINMENT, CAT_MUMBAI],
    tags: ['मनोरंजन', 'सिनेमा', 'पुरस्कार', 'मुंबई'],
  },
  {
    id: 'art-007-en',
    slug: 'national-film-awards-celebrate-cinematic-excellence-en',
    language: 'en',
    translation_group_id: GROUP_7,
    headline: 'National Film Awards Honor Meaningful Storytelling and Directorial Brilliance',
    subtitle: 'Cinema Arts: Thoughtful narratives tackling contemporary cultural themes dominate top accolades',
    excerpt: 'At the prestigious National Film Awards in New Delhi, compelling regional and Hindi cinematic masterpieces were celebrated for artistic distinction.',
    body: `<p class="lead"><strong>Mumbai:</strong> Celebrating storytelling that moves minds and hearts, the National Film Awards jury spotlighted innovative screenplays and breathtaking performances across Marathi and national cinema productions.</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'Cinema and film celebration',
    image_caption: 'Awards presentation recognizing distinguished screen accomplishments.',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'Culture Critic' },
    status: 'published',
    is_breaking: false,
    seo_title: 'National Film Awards Celebrate Cinematic Excellence | JANVANI NEWS',
    seo_description: 'Distinguished films honored for narrative depth and technical artistry.',
    reading_time_minutes: 2,
    published_at: '2026-02-21T10:10:00Z',
    created_at: '2026-02-21T09:30:00Z',
    updated_at: '2026-02-21T10:10:00Z',
    category_ids: [CAT_ENTERTAINMENT, CAT_MUMBAI],
    tags: ['Entertainment', 'Cinema', 'Awards', 'Culture'],
  },

  // ==========================================
  // ARTICLE 8: Politics & Local Governance
  // ==========================================
  {
    id: 'art-008-mr',
    slug: 'maharashtra-local-governance-reforms-passed-2026',
    language: 'mr',
    translation_group_id: GROUP_8,
    headline: 'स्थानिक स्वराज्य संस्थांच्या पारदर्शकतेसाठी ऐतिहासिक विधेयक मंजूर; नागरिकांना थेट अधिकार',
    subtitle: 'राजकारण : नगरपरिषदा व महानगरपालिकांमधील विकासकामांचे थेट सोशल ऑडिट होणार',
    excerpt: 'नागरिकांच्या तक्रारींचे २४ तासांत निवारण आणि ई-निविदा प्रक्रियेत पूर्ण पारदर्शकता आणणारे नवे सुधारणा विधेयक विधानसभेत एकमुखाने संमत झाले.',
    body: `<p class="lead"><strong>मुंबई :</strong> स्थानिक स्वराज्य संस्थांचा कारभार अधिक लोकाभिमुख आणि पारदर्शक करण्यासाठी राज्य शासनाने मांडलेले ऐतिहासिक विधेयक विधिमंडळाच्या दोन्ही सभागृहांत संमत झाले आहे.</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'विधानसभा व कायदेमंडळ',
    image_caption: 'विधिमंडळाच्या अधिवेशनादरम्यान घेतलेला महत्त्वपूर्ण निर्णय.',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'राजकीय विश्लेषक' },
    status: 'published',
    is_breaking: false,
    seo_title: 'स्थानिक स्वराज्य संस्था सुधारणा विधेयक मंजूर | JANVANI NEWS',
    seo_description: 'नागरिकांच्या थेट सहभागासह स्थानिक संस्थांमध्ये सोशल ऑडिट सक्तीचे.',
    reading_time_minutes: 3,
    published_at: '2026-02-21T10:30:00Z',
    created_at: '2026-02-21T10:00:00Z',
    updated_at: '2026-02-21T10:30:00Z',
    category_ids: [CAT_POLITICS, CAT_MAHARASHTRA],
    tags: ['राजकारण', 'विधानसभा', 'स्थानिक स्वराज्य'],
  },
  {
    id: 'art-008-hi',
    slug: 'local-governance-transparency-bill-passed-hi',
    language: 'hi',
    translation_group_id: GROUP_8,
    headline: 'स्थानीय निकायों में पारदर्शिता के लिए ऐतिहासिक विधेयक पारित; नागरिकों को मिले सीधे अधिकार',
    subtitle: 'राजनीति : नगर निगमों और परिषदों के सभी विकास कार्यों का अब अनिवार्य सोशल ऑडिट होगा',
    excerpt: 'जन शिकायतों के 24 घंटे में समाधान और ई-टेंडरिंग प्रक्रिया में पूर्ण पारदर्शिता सुनिश्चित करने वाला सुधार विधेयक विधानसभा में सर्वसम्मति से पारित।',
    body: `<p class="lead"><strong>मुंबई :</strong> स्थानीय प्रशासन को जवाबदेह और जनहितैषी बनाने की दिशा में राज्य विधानमंडल ने ऐतिहासिक सुधार विधेयक को हरी झंडी दे दी है। अब नागरिक सीधे ऑनलाइन पोर्टल से वार्ड बजट की निगरानी कर सकेंगे।</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'विधान भवन सत्र',
    image_caption: 'विधानसभा में सुधार विधेयक पर हुई गंभीर चर्चा।',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'राजनीतिक विश्लेषक' },
    status: 'published',
    is_breaking: false,
    seo_title: 'स्थानीय निकाय सुधार विधेयक पारित | JANVANI NEWS',
    seo_description: 'विधानसभा में पारित विधेयक से नगर निगमों के विकास कार्यों में जवाबदेही बढ़ेगी।',
    reading_time_minutes: 3,
    published_at: '2026-02-21T10:35:00Z',
    created_at: '2026-02-21T10:00:00Z',
    updated_at: '2026-02-21T10:35:00Z',
    category_ids: [CAT_POLITICS, CAT_MAHARASHTRA],
    tags: ['राजनीति', 'विधानसभा', 'सुधार', 'महाराष्ट्र'],
  },
  {
    id: 'art-008-en',
    slug: 'legislature-passes-civic-transparency-and-audit-bill-en',
    language: 'en',
    translation_group_id: GROUP_8,
    headline: 'Legislature Unanimously Passes Landmark Civic Governance Transparency and Audit Bill',
    subtitle: 'Democratic Governance: Mandatory citizen social audits and 24-hour grievance turnaround codified',
    excerpt: 'In an unprecedented institutional reform, municipal corporations will now submit all ward budgetary outlays to public digital scrutiny.',
    body: `<p class="lead"><strong>Mumbai:</strong> Empowering citizens with real-time oversight of public civil engineering works, the legislative assembly passed a sweeping municipal accountability statute today with broad cross-party support.</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'Parliamentary and assembly chambers',
    image_caption: 'State legislative assembly session passing civic reform measures.',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'Policy Editor' },
    status: 'published',
    is_breaking: false,
    seo_title: 'Civic Governance Reform Bill Passed | JANVANI NEWS',
    seo_description: 'Citizen social audits made statutory across municipal corporations.',
    reading_time_minutes: 3,
    published_at: '2026-02-21T10:40:00Z',
    created_at: '2026-02-21T10:00:00Z',
    updated_at: '2026-02-21T10:40:00Z',
    category_ids: [CAT_POLITICS, CAT_MAHARASHTRA],
    tags: ['Politics', 'Governance', 'Assembly', 'Reform'],
  },

  // ==========================================
  // ARTICLE 9: Green Hydrogen & Tech
  // ==========================================
  {
    id: 'art-009-mr',
    slug: 'green-hydrogen-industrial-grid-initiative-2026',
    language: 'mr',
    translation_group_id: GROUP_9,
    headline: 'महाराष्ट्रात आशियातील सर्वात मोठ्या ग्रीन हायड्रोजन हबची घोषणा; २० हजार कोटींची गुंतवणूक',
    subtitle: 'ऊर्जा क्रांती : कोकण किनारपट्टीवर शून्य कार्बन उत्सर्जनाचा नवा प्रकल्प उभारणार',
    excerpt: 'उद्योग जगताला पर्यावरणपूरक ऊर्जा पुरवण्यासाठी राज्य सरकारने नवीकरणीय ऊर्जा क्षेत्रातील महाप्रकल्पाचा सामंजस्य करार केला आहे.',
    body: `<p class="lead"><strong>रत्नागिरी :</strong> हरित ऊर्जेच्या क्षेत्रात महाराष्ट्र देशाला दिशा दाखवणारे राज्य बनले आहे. ग्रीन हायड्रोजन निर्मितीसाठी २० हजार कोटी रुपयांच्या ऐतिहासिक करारावर स्वाक्षऱ्या झाल्या आहेत.</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'हरित ऊर्जा आणि पवनचक्की प्रकल्प',
    image_caption: 'पर्यावरणपूरक स्वच्छ ऊर्जा प्रकल्पाचा आराखडा.',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'ऊर्जा वार्ताहर' },
    status: 'published',
    is_breaking: false,
    seo_title: 'ग्रीन हायड्रोजन हबची घोषणा | JANVANI NEWS',
    seo_description: 'महाराष्ट्रात २० हजार कोटींची हरित ऊर्जा गुंतवणूक.',
    reading_time_minutes: 2,
    published_at: '2026-02-21T11:00:00Z',
    created_at: '2026-02-21T10:30:00Z',
    updated_at: '2026-02-21T11:00:00Z',
    category_ids: [CAT_TECH, CAT_BUSINESS, CAT_MAHARASHTRA],
    tags: ['ऊर्जा', 'तंत्रज्ञान', 'पर्यावरण'],
  },
  {
    id: 'art-009-hi',
    slug: 'green-hydrogen-hub-announced-maharashtra-hi',
    language: 'hi',
    translation_group_id: GROUP_9,
    headline: 'महाराष्ट्र में एशिया के सबसे बड़े ग्रीन हाइड्रोजन हब की घोषणा; 20,000 करोड़ रुपये का निवेश',
    subtitle: 'स्वच्छ ऊर्जा : तटीय क्षेत्र में शून्य कार्बन उत्सर्जन वाले आधुनिक संयंत्र का होगा निर्माण',
    excerpt: 'उद्योगों को स्वच्छ ईंधन उपलब्ध कराने और कार्बन उत्सर्जन घटाने के लिए राज्य सरकार ने बड़े ऊर्जा समझौते पर हस्ताक्षर किए।',
    body: `<p class="lead"><strong>रत्नागिरी :</strong> स्वच्छ ऊर्जा के क्षेत्र में देश को आत्मनिर्भर बनाने की दिशा में महाराष्ट्र ने बड़ा कदम उठाया है। 20 हजार करोड़ की लागत से बनने वाले संयंत्र से हजारों युवाओं को रोजगार मिलेगा।</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'स्वच्छ ऊर्जा और पवन ऊर्जा संयंत्र',
    image_caption: 'ग्रीन हाइड्रोजन ऊर्जा संयंत्र का प्रस्तावित प्रारूप।',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'ऊर्जा संवाददाता' },
    status: 'published',
    is_breaking: false,
    seo_title: 'ग्रीन हाइड्रोजन हब से बदलेगी ऊर्जा नीति | JANVANI NEWS',
    seo_description: 'महाराष्ट्र में 20,000 करोड़ का हरित ऊर्जा निवेश आकर्षित।',
    reading_time_minutes: 2,
    published_at: '2026-02-21T11:05:00Z',
    created_at: '2026-02-21T10:30:00Z',
    updated_at: '2026-02-21T11:05:00Z',
    category_ids: [CAT_TECH, CAT_BUSINESS, CAT_MAHARASHTRA],
    tags: ['ऊर्जा', 'तकनीक', 'व्यापार', 'महाराष्ट्र'],
  },
  {
    id: 'art-009-en',
    slug: 'maharashtra-unveils-green-hydrogen-industrial-hub-en',
    language: 'en',
    translation_group_id: GROUP_9,
    headline: 'Maharashtra Unveils Asia\'s Largest Green Hydrogen Hub with $2.4B Investment Accord',
    subtitle: 'Clean Energy Transition: Coastal zero-emission complex to supply green feedstock to industrial parks',
    excerpt: 'Marking a seminal milestone for net-zero manufacturing, a major consortium has committed $2.4 billion for high-capacity electrolyzer installations.',
    body: `<p class="lead"><strong>Ratnagiri:</strong> Propelling western India to the forefront of decarbonized heavy industry, the state administration sealed definitive agreements for a 1.2 GW renewable green hydrogen generation corridor along the western coastline.</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'Clean wind energy and industrial turbines',
    image_caption: 'Renewable power infrastructure powering green hydrogen generation.',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'Energy Analyst' },
    status: 'published',
    is_breaking: false,
    seo_title: 'Maharashtra Unveils Green Hydrogen Hub | JANVANI NEWS',
    seo_description: '$2.4B clean energy investment accelerates industrial decarbonization.',
    reading_time_minutes: 2,
    published_at: '2026-02-21T11:10:00Z',
    created_at: '2026-02-21T10:30:00Z',
    updated_at: '2026-02-21T11:10:00Z',
    category_ids: [CAT_TECH, CAT_BUSINESS, CAT_MAHARASHTRA],
    tags: ['Energy', 'Technology', 'Business', 'CleanTech'],
  },

  // ==========================================
  // ARTICLE 10: Politics & National Vision
  // ==========================================
  {
    id: 'art-010-mr',
    slug: 'election-commission-announces-electoral-roadmap-2026',
    language: 'mr',
    translation_group_id: GROUP_10,
    headline: 'निवडणूक आयोगाकडून मतदार नोंदणी आणि आधुनिक डिजिटल मतदान सुरक्षा आराखडा जाहीर',
    subtitle: 'लोकशाही व्यवस्था : बनावट मतदारांना आळा घालण्यासाठी बायोमेट्रिक पडताळणी प्रणालीची चाचणी',
    excerpt: 'मुक्त आणि निष्पक्ष वातावरणात निवडणुका पार पाडण्यासाठी केंद्रीय निवडणूक आयोगाने सर्व राज्यांसाठी नवी मार्गदर्शक तत्त्वे जारी केली आहेत.',
    body: `<p class="lead"><strong>नवी दिल्ली :</strong> भारतीय लोकशाहीच्या बळकटीकरणासाठी निवडणूक आयोगाने आधुनिक तंत्रज्ञानाचा वापर करून मतदार याद्या १०० टक्के अचूक करण्याचे निर्देश दिले आहेत.</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'मतदान केंद्र आणि मतपत्रिका',
    image_caption: 'निवडणूक आयोगाची पत्रकार परिषद आणि सुरक्षा नियोजन.',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'राजकीय संपादक' },
    status: 'published',
    is_breaking: false,
    seo_title: 'निवडणूक आयोगाचा सुरक्षा आराखडा जाहीर | JANVANI NEWS',
    seo_description: 'डिजिटल मतदार नोंदणी आणि निवडणूक सुधारणांवर भर.',
    reading_time_minutes: 2,
    published_at: '2026-02-21T11:30:00Z',
    created_at: '2026-02-21T11:00:00Z',
    updated_at: '2026-02-21T11:30:00Z',
    category_ids: [CAT_POLITICS, CAT_INDIA],
    tags: ['राजकारण', 'निवडणूक', 'लोकशाही'],
  },
  {
    id: 'art-010-hi',
    slug: 'election-commission-announces-digital-electoral-roadmap-hi',
    language: 'hi',
    translation_group_id: GROUP_10,
    headline: 'चुनाव आयोग ने जारी किया नया डिजिटल सुरक्षा रोडमैप; मतदाता सूची में शत-प्रतिशत पारदर्शिता',
    subtitle: 'लोकतंत्र : फर्जी मतदान रोकने के लिए बायोमेट्रिक तकनीक और स्मार्ट पहचान पत्र का उपयोग',
    excerpt: 'पारदर्शी और निष्पक्ष चुनाव संचालन के लिए निर्वाचन आयोग ने सभी राज्यों के लिए कड़े दिशा-निर्देश और नई मानक संचालन प्रक्रिया जारी की है।',
    body: `<p class="lead"><strong>नई दिल्ली :</strong> निर्वाचन आयोग ने चुनावी प्रक्रिया को और अधिक मजबूत बनाने के लिए डिजिटल मतदाता पहचान प्रणाली और बूथ स्तरीय सुरक्षा उपायों का व्यापक खाका पेश किया है।</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'मतदान और लोकतंत्र',
    image_caption: 'चुनाव आयोग के वरिष्ठ अधिकारियों की उच्चस्तरीय बैठक।',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'राष्ट्रीय डेस्क' },
    status: 'published',
    is_breaking: false,
    seo_title: 'चुनाव आयोग का नया रोडमैप जारी | JANVANI NEWS',
    seo_description: 'निष्पक्ष चुनाव के लिए चुनाव आयोग ने तकनीक आधारित कदम उठाए।',
    reading_time_minutes: 2,
    published_at: '2026-02-21T11:35:00Z',
    created_at: '2026-02-21T11:00:00Z',
    updated_at: '2026-02-21T11:35:00Z',
    category_ids: [CAT_POLITICS, CAT_INDIA],
    tags: ['राजनीति', 'चुनाव', 'लोकतंत्र', 'भारत'],
  },
  {
    id: 'art-010-en',
    slug: 'election-commission-unveils-high-security-digital-electoral-roadmap-en',
    language: 'en',
    translation_group_id: GROUP_10,
    headline: 'Election Commission Unveils High-Security Digital Electoral Integrity Roadmap',
    subtitle: 'Electoral Democracy: Cryptographic audit trails and synchronized voter verification deployed',
    excerpt: 'Setting benchmark standards for sovereign ballot integrity, the election authority has formalized next-generation guidelines for electoral fairness.',
    body: `<p class="lead"><strong>New Delhi:</strong> In a comprehensive policy announcement, the Election Commission detailed cryptographic roll auditing alongside tamper-evident verification technologies designed to preserve absolute public confidence in the ballot.</p>`,
    featured_image_path: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'Election polling station',
    image_caption: 'Official briefing on national electoral integrity safeguards.',
    author_id: 'usr-admin-01',
    author: { ...DEFAULT_AUTHOR, display_name: 'National Bureau' },
    status: 'published',
    is_breaking: false,
    seo_title: 'Election Commission Unveils Digital Integrity Roadmap | JANVANI NEWS',
    seo_description: 'Advanced protocols introduced to safeguard national electoral accuracy.',
    reading_time_minutes: 2,
    published_at: '2026-02-21T11:40:00Z',
    created_at: '2026-02-21T11:00:00Z',
    updated_at: '2026-02-21T11:40:00Z',
    category_ids: [CAT_POLITICS, CAT_INDIA],
    tags: ['Politics', 'Election', 'Democracy', 'India'],
  },

  // ==========================================
  // Scheduled & Draft Test Articles
  // ==========================================
  {
    id: 'art-011-scheduled',
    slug: 'upcoming-monsoon-forecast-maharashtra-2026',
    language: 'mr',
    translation_group_id: 'g11000000-0000-0000-0000-000000000011',
    headline: '[नियोजित] आगामी मान्सून हंगामाचा पहिला दीर्घकालीन अंदाज लवकरच जाहीर होणार',
    subtitle: 'हवामान : यंदा सरासरीपेक्षा चांगल्या पावसाची हवामान तज्ज्ञांची शक्यता',
    excerpt: 'हवामान विभागाकडून मान्सून २०२६ चा पहिला अधिकृत अंदाज उद्या प्रसिद्ध केला जाणार आहे.',
    body: `<p>हा लेख नियोजित (Scheduled) आहे आणि प्रकाशित वेळेपूर्वी सर्वसामान्य वाचकांना दिसणार नाही.</p>`,
    status: 'scheduled',
    is_breaking: false,
    reading_time_minutes: 2,
    published_at: null,
    scheduled_at: '2026-12-31T12:00:00Z',
    created_at: '2026-02-21T11:00:00Z',
    updated_at: '2026-02-21T11:00:00Z',
    category_ids: [CAT_AGRICULTURE],
    tags: ['हवामान', 'मान्सून'],
  },
  {
    id: 'art-012-draft',
    slug: 'metro-line-expansion-pune-draft-preview',
    language: 'mr',
    translation_group_id: 'g12000000-0000-0000-0000-000000000012',
    headline: '[मसुदा - Draft] पुणे मेट्रोच्या पुढील टप्प्याचा सविस्तर सर्वेक्षण अहवाल',
    subtitle: 'कचरा मसुदा : अंतर्गत संपादकीय तपासणीसाठी',
    excerpt: 'हा एक मसुदा आहे जो संपादकीय मंजुरीशिवाय प्रकाशित केला जात नाही.',
    body: `<p>हा मसुदा केवळ संपादकीय कक्षात लॉग इन केलेल्या वापरकर्त्यांनाच दिसेल.</p>`,
    status: 'draft',
    is_breaking: false,
    reading_time_minutes: 1,
    published_at: null,
    scheduled_at: null,
    created_at: '2026-02-21T11:30:00Z',
    updated_at: '2026-02-21T11:30:00Z',
    category_ids: [CAT_PUNE],
    tags: ['पुणे', 'मेट्रो'],
  },
];

export const INITIAL_BREAKING_NEWS: BreakingNewsItem[] = [
  // Marathi Breaking Headlines
  {
    id: 'brk-001',
    article_id: 'art-001-mr',
    language: 'mr',
    custom_headline: 'पुणे-मुंबई ५० मिनिटांच्या नवीन द्रुतगती कॉरिडोअरला राज्य मंत्रिमंडळाची अंतिम मंजुरी',
    display_order: 1,
    is_active: true,
    expires_at: null,
    created_at: '2026-02-21T06:30:00Z',
    updated_at: '2026-02-21T06:30:00Z',
  },
  {
    id: 'brk-002',
    article_id: 'art-003-mr',
    language: 'mr',
    custom_headline: 'भारताचा कसोटी क्रिकेट मालिकेत थरारक विजय; पाचव्या दिवशी प्रतिस्पर्धी निष्प्रभ',
    display_order: 2,
    is_active: true,
    expires_at: null,
    created_at: '2026-02-21T08:00:00Z',
    updated_at: '2026-02-21T08:00:00Z',
  },
  {
    id: 'brk-003-mr',
    article_id: 'art-004-mr',
    language: 'mr',
    custom_headline: 'मुंबईच्या फिनटेक क्षेत्रात ४ अब्ज डॉलर्सची विक्रमी गुंतवणूक; आशियातील अव्वल केंद्र',
    display_order: 3,
    is_active: true,
    expires_at: null,
    created_at: '2026-02-21T08:30:00Z',
    updated_at: '2026-02-21T08:30:00Z',
  },
  {
    id: 'brk-004-mr',
    article_id: 'art-009-mr',
    language: 'mr',
    custom_headline: 'महाराष्ट्रात आशियातील सर्वात मोठ्या ग्रीन हायड्रोजन हबची घोषणा; २० हजार कोटींचा प्रकल्प',
    display_order: 4,
    is_active: true,
    expires_at: null,
    created_at: '2026-02-21T11:00:00Z',
    updated_at: '2026-02-21T11:00:00Z',
  },

  // Hindi Breaking Headlines
  {
    id: 'brk-101-hi',
    article_id: 'art-001-hi',
    language: 'hi',
    custom_headline: 'पुणे-मुंबई के बीच 50 मिनट के नए ग्रीनफील्ड कॉरिडोर को राज्य सरकार की अंतिम मंजूरी',
    display_order: 1,
    is_active: true,
    expires_at: null,
    created_at: '2026-02-21T06:40:00Z',
    updated_at: '2026-02-21T06:40:00Z',
  },
  {
    id: 'brk-102-hi',
    article_id: 'art-003-hi',
    language: 'hi',
    custom_headline: 'भारतीय क्रिकेट टीम ने जीती टेस्ट सीरीज; पांचवें दिन शानदार गेंदबाजी से रचा इतिहास',
    display_order: 2,
    is_active: true,
    expires_at: null,
    created_at: '2026-02-21T08:05:00Z',
    updated_at: '2026-02-21T08:05:00Z',
  },
  {
    id: 'brk-103-hi',
    article_id: 'art-004-hi',
    language: 'hi',
    custom_headline: 'मुंबई फिनटेक उद्योग में रिकॉर्ड 4 अरब डॉलर का विदेशी निवेश; एशिया में शीर्ष पर',
    display_order: 3,
    is_active: true,
    expires_at: null,
    created_at: '2026-02-21T08:35:00Z',
    updated_at: '2026-02-21T08:35:00Z',
  },
  {
    id: 'brk-104-hi',
    article_id: 'art-009-hi',
    language: 'hi',
    custom_headline: 'महाराष्ट्र में 20,000 करोड़ का ग्रीन हाइड्रोजन हब मंजूर; स्वच्छ ऊर्जा क्रांति',
    display_order: 4,
    is_active: true,
    expires_at: null,
    created_at: '2026-02-21T11:05:00Z',
    updated_at: '2026-02-21T11:05:00Z',
  },

  // English Breaking Headlines
  {
    id: 'brk-201-en',
    article_id: 'art-001-en',
    language: 'en',
    custom_headline: 'Cabinet Clears 50-Minute High-Speed Transit Corridor Linking Pune and Mumbai',
    display_order: 1,
    is_active: true,
    expires_at: null,
    created_at: '2026-02-21T06:35:00Z',
    updated_at: '2026-02-21T06:35:00Z',
  },
  {
    id: 'brk-202-en',
    article_id: 'art-003-en',
    language: 'en',
    custom_headline: 'Team India Seals Historic Test Championship Series with Thrilling Day 5 Win',
    display_order: 2,
    is_active: true,
    expires_at: null,
    created_at: '2026-02-21T08:10:00Z',
    updated_at: '2026-02-21T08:10:00Z',
  },
  {
    id: 'brk-203-en',
    article_id: 'art-004-en',
    language: 'en',
    custom_headline: 'Mumbai FinTech Cluster Influx Surpasses Record $4B in Global Institutional Capital',
    display_order: 3,
    is_active: true,
    expires_at: null,
    created_at: '2026-02-21T08:40:00Z',
    updated_at: '2026-02-21T08:40:00Z',
  },
  {
    id: 'brk-204-en',
    article_id: 'art-009-en',
    language: 'en',
    custom_headline: 'Maharashtra Inks $2.4B Deal for Asia\'s Largest Green Hydrogen Complex',
    display_order: 4,
    is_active: true,
    expires_at: null,
    created_at: '2026-02-21T11:10:00Z',
    updated_at: '2026-02-21T11:10:00Z',
  },
];

// Helper to generate dynamic SVG data URL for newspaper broadsheet page preview
function generatePagePreview(editionTitle: string, pageNum: number, pageName: string, dateStr: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1150" width="800" height="1150">
    <rect width="800" height="1150" fill="#fdfbf7"/>
    <rect x="25" y="25" width="750" height="1100" fill="#ffffff" stroke="#e2ddd5" stroke-width="2"/>
    
    <!-- Top Utility Bar -->
    <rect x="40" y="40" width="720" height="28" fill="#1c1917"/>
    <text x="50" y="58" fill="#f5f5f4" font-family="serif" font-size="12" font-weight="bold">DAINIK JAGAT SAMEEKSHA EPAPER • ${dateStr} • ${editionTitle}</text>
    <text x="740" y="58" fill="#e7e5e4" font-family="sans-serif" font-size="11" text-anchor="end">PAGE ${pageNum} : ${pageName.toUpperCase()}</text>
    
    <!-- Masthead -->
    <line x1="40" y1="85" x2="760" y2="85" stroke="#ed1c24" stroke-width="3"/>
    <text x="400" y="135" fill="#ed1c24" font-family="serif" font-size="46" font-weight="900" text-anchor="middle" letter-spacing="2">दैनिक जगत समीक्षा</text>
    <text x="400" y="156" fill="#78716c" font-family="serif" font-size="13" font-style="italic" text-anchor="middle">सत्य, निष्पक्ष एवं निर्भीक • RNI: MAHHIN/2014/57312 • भांडुप, मुंबई</text>
    <line x1="40" y1="170" x2="760" y2="170" stroke="#1c1917" stroke-width="2"/>
    <line x1="40" y1="174" x2="760" y2="174" stroke="#1c1917" stroke-width="1"/>
    
    <!-- Lead Headline -->
    <rect x="40" y="185" width="720" height="70" fill="#fafaf9"/>
    <text x="55" y="215" fill="#ed1c24" font-family="sans-serif" font-size="12" font-weight="bold">★ मुख्य समाचार — ${pageName} ★</text>
    <text x="55" y="242" fill="#0c0a09" font-family="serif" font-size="22" font-weight="800">${editionTitle} : राष्ट्रीय विकास एवं निष्पक्ष विश्लेषण</text>
    
    <!-- Column 1: Lead Story -->
    <rect x="40" y="270" width="345" height="240" fill="#f5f5f4" rx="4"/>
    <text x="212" y="390" fill="#a8a29e" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">[ मुद्रित छायाचित्र • Editorial Photo ]</text>
    <text x="40" y="530" fill="#1c1917" font-family="serif" font-size="16" font-weight="bold">दैनिक जगत समीक्षा का राष्ट्रीय संकल्प</text>
    <text x="40" y="552" fill="#44403c" font-family="sans-serif" font-size="11" line-height="1.4">
      <tspan x="40" dy="0">प्रधान संपादक अरुण रमाकांत तिवारी के मार्गदर्शन में निष्पक्ष</tspan>
      <tspan x="40" dy="16">एवं निर्भीक पत्रकारिता का निरंतर प्रवाह। मुंबई और महाराष्ट्र का</tspan>
      <tspan x="40" dy="16">सर्वाधिक प्रतिष्ठित हिंदी दैनिक समाचार पत्र।</tspan>
    </text>
    
    <!-- Column 2: Side Stories -->
    <line x1="400" y1="270" x2="400" y2="700" stroke="#e7e5e4" stroke-width="1"/>
    <text x="415" y="295" fill="#ed1c24" font-family="serif" font-size="18" font-weight="bold">कृषि एवं ग्रामीण विकास</text>
    <text x="415" y="318" fill="#44403c" font-family="sans-serif" font-size="11">
      <tspan x="415" dy="0">सूक्ष्म सिंचाई और एआई से किसानों को मिला बड़ा लाभ,</tspan>
      <tspan x="415" dy="16">लागत में 40% की बचत और उत्पादन में रिकॉर्ड बढ़ोतरी।</tspan>
    </text>
    
    <line x1="415" y1="365" x2="760" y2="365" stroke="#e7e5e4" stroke-width="1"/>
    <text x="415" y="395" fill="#0c0a09" font-family="serif" font-size="18" font-weight="bold">फिनटेक एवं व्यापार जगत</text>
    <text x="415" y="418" fill="#44403c" font-family="sans-serif" font-size="11">
      <tspan x="415" dy="0">मुंबई अंतरराष्ट्रीय वित्तीय केंद्र में 4 अरब डॉलर का निवेश,</tspan>
      <tspan x="415" dy="16">उद्योग और रोजगार को मिली नई गति।</tspan>
    </text>
    
    <!-- Bottom Grid Section (3 sub-columns) -->
    <line x1="40" y1="620" x2="760" y2="620" stroke="#1c1917" stroke-width="1"/>
    <rect x="40" y="635" width="225" height="180" fill="#fafaf9" stroke="#e7e5e4"/>
    <text x="50" y="660" fill="#ed1c24" font-family="serif" font-size="14" font-weight="bold">खेल : राष्ट्रीय गौरव</text>
    <text x="50" y="685" fill="#57534e" font-family="sans-serif" font-size="10">भारतीय टीम ने जीती रोमांचक टेस्ट श्रृंखला।</text>
    
    <rect x="285" y="635" width="230" height="180" fill="#fafaf9" stroke="#e7e5e4"/>
    <text x="295" y="660" fill="#ed1c24" font-family="serif" font-size="14" font-weight="bold">शिक्षा : डिजिटल क्रांति</text>
    <text x="295" y="685" fill="#57534e" font-family="sans-serif" font-size="10">स्कूलों में स्मार्ट टैबलेट लाइब्रेरी की शुरुआत।</text>
    
    <rect x="535" y="635" width="225" height="180" fill="#fafaf9" stroke="#e7e5e4"/>
    <text x="545" y="660" fill="#ed1c24" font-family="serif" font-size="14" font-weight="bold">स्वास्थ्य : चिकित्सा विज्ञान</text>
    <text x="545" y="685" fill="#57534e" font-family="sans-serif" font-size="10">स्वदेशी इम्यूनोथेरेपी शोध में बड़ी सफलता।</text>
    
    <!-- Bottom Editorial Footer -->
    <line x1="40" y1="1080" x2="760" y2="1080" stroke="#1c1917" stroke-width="2"/>
    <text x="400" y="1105" fill="#78716c" font-family="sans-serif" font-size="11" text-anchor="middle">
      संपादक : अरुण रमाकांत तिवारी • RNI क्र. MAHHIN/2014/57312 • भांडुप (पश्चिम), मुंबई 400078
    </text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// ==========================================
// INITIAL E-PAPER EDITIONS
// ==========================================
export const INITIAL_EPAPER_EDITIONS: EpaperEdition[] = [
  // 1. Primary BroadSheet Edition: 26 August 2026 Mumbai Main
  {
    id: 'ep-djs-20260826',
    edition_date: '2026-08-26',
    edition_region: 'mumbai',
    title: 'दैनिक जगत समीक्षा - 26 अगस्त 2026 (मुंबई मुख्य संस्करण)',
    title_mr: 'दैनिक जगत समीक्षा - 26 ऑगस्ट 2026 (मुंबई मुख्य आवृत्ती)',
    title_hi: 'दैनिक जगत समीक्षा - 26 अगस्त 2026 (मुंबई मुख्य संस्करण)',
    title_en: 'Dainik Jagat Sameeksha - 26 August 2026 (Mumbai Edition)',
    description: 'दैनिक जगत समीक्षा का 26 अगस्त 2026 का 4-पृष्ठीय संपूर्ण डिजिटल मुद्रित संस्करण। संपादक: अरुण रमाकांत तिवारी। RNI: MAHHIN/2014/57312',
    thumbnail_url: '/epaper/2026-08-26/page-1-thumb.jpg',
    pdf_url: '/client-assets/DAINIK_JAGAT_SAMEEKSHA_26_AUGUST_2026.pdf',
    file_size_bytes: 1497917,
    total_pages: 4,
    is_published: true,
    views_count: 24500,
    downloads_count: 8920,
    created_at: '2026-08-26T00:30:00Z',
    updated_at: '2026-08-26T00:30:00Z',
    pages: [
      {
        id: 'djs-20260826-p1',
        edition_id: 'ep-djs-20260826',
        page_number: 1,
        page_title: 'मुख्य पृष्ठ (Front Page / Lead Stories)',
        image_url: '/epaper/2026-08-26/page-1.jpg',
        thumbnail_url: '/epaper/2026-08-26/page-1-thumb.jpg',
        zoom_image_url: '/epaper/2026-08-26/page-1-zoom.jpg',
        created_at: '2026-08-26T00:30:00Z',
      },
      {
        id: 'djs-20260826-p2',
        edition_id: 'ep-djs-20260826',
        page_number: 2,
        page_title: 'प्रादेशिक एवं मुंबई वार्ता (Regional & City Dispatches)',
        image_url: '/epaper/2026-08-26/page-2.jpg',
        thumbnail_url: '/epaper/2026-08-26/page-2-thumb.jpg',
        zoom_image_url: '/epaper/2026-08-26/page-2-zoom.jpg',
        created_at: '2026-08-26T00:30:00Z',
      },
      {
        id: 'djs-20260826-p3',
        edition_id: 'ep-djs-20260826',
        page_number: 3,
        page_title: 'संपादकीय एवं विचारमंथन (Editorial & Op-Ed)',
        image_url: '/epaper/2026-08-26/page-3.jpg',
        thumbnail_url: '/epaper/2026-08-26/page-3-thumb.jpg',
        zoom_image_url: '/epaper/2026-08-26/page-3-zoom.jpg',
        created_at: '2026-08-26T00:30:00Z',
      },
      {
        id: 'djs-20260826-p4',
        edition_id: 'ep-djs-20260826',
        page_number: 4,
        page_title: 'व्यापार, खेल एवं देश वार्ता (Nation, Business & Sports)',
        image_url: '/epaper/2026-08-26/page-4.jpg',
        thumbnail_url: '/epaper/2026-08-26/page-4-thumb.jpg',
        zoom_image_url: '/epaper/2026-08-26/page-4-zoom.jpg',
        created_at: '2026-08-26T00:30:00Z',
      },
    ],
  },

  // 2. Maharashtra State Edition (26 August 2026)
  {
    id: 'ep-djs-state-20260826',
    edition_date: '2026-08-26',
    edition_region: 'maharashtra',
    title: 'दैनिक जगत समीक्षा - महाराष्ट्र राज्य संस्करण',
    title_mr: 'दैनिक जगत समीक्षा - महाराष्ट्र राज्य आवृत्ती',
    title_hi: 'दैनिक जगत समीक्षा - महाराष्ट्र राज्य संस्करण',
    title_en: 'Dainik Jagat Sameeksha - Maharashtra State Edition',
    description: 'संपूर्ण महाराष्ट्र के ३६ जिलों की राजनीतिक, आर्थिक एवं सामाजिक हलचल का प्रामाणिक दर्पण।',
    thumbnail_url: '/epaper/2026-08-26/page-1-thumb.jpg',
    pdf_url: '/client-assets/DAINIK_JAGAT_SAMEEKSHA_26_AUGUST_2026.pdf',
    file_size_bytes: 1497917,
    total_pages: 4,
    is_published: true,
    views_count: 19820,
    downloads_count: 6140,
    created_at: '2026-08-26T00:45:00Z',
    updated_at: '2026-08-26T00:45:00Z',
    pages: [
      {
        id: 'djs-state-p1',
        edition_id: 'ep-djs-state-20260826',
        page_number: 1,
        page_title: 'राज्य मुख्य पृष्ठ (State Front Page)',
        image_url: '/epaper/2026-08-26/page-1.jpg',
        thumbnail_url: '/epaper/2026-08-26/page-1-thumb.jpg',
        zoom_image_url: '/epaper/2026-08-26/page-1-zoom.jpg',
        created_at: '2026-08-26T00:45:00Z',
      },
      {
        id: 'djs-state-p2',
        edition_id: 'ep-djs-state-20260826',
        page_number: 2,
        page_title: 'विदर्भ, मराठवाडा व उत्तर महाराष्ट्र (Regions)',
        image_url: '/epaper/2026-08-26/page-2.jpg',
        thumbnail_url: '/epaper/2026-08-26/page-2-thumb.jpg',
        zoom_image_url: '/epaper/2026-08-26/page-2-zoom.jpg',
        created_at: '2026-08-26T00:45:00Z',
      },
      {
        id: 'djs-state-p3',
        edition_id: 'ep-djs-state-20260826',
        page_number: 3,
        page_title: 'संपादकीय व विशेष आलेख (Editorial & Opinion)',
        image_url: '/epaper/2026-08-26/page-3.jpg',
        thumbnail_url: '/epaper/2026-08-26/page-3-thumb.jpg',
        zoom_image_url: '/epaper/2026-08-26/page-3-zoom.jpg',
        created_at: '2026-08-26T00:45:00Z',
      },
      {
        id: 'djs-state-p4',
        edition_id: 'ep-djs-state-20260826',
        page_number: 4,
        page_title: 'कृषि, व्यापार एवं देश (Agriculture & Nation)',
        image_url: '/epaper/2026-08-26/page-4.jpg',
        thumbnail_url: '/epaper/2026-08-26/page-4-thumb.jpg',
        zoom_image_url: '/epaper/2026-08-26/page-4-zoom.jpg',
        created_at: '2026-08-26T00:45:00Z',
      },
    ],
  },
];

// ----------------------------------------------------------------------------
// PHASE 2: NEW CONTENT TYPES SEED DATA
// ----------------------------------------------------------------------------

export const SUPPORTED_WEATHER_CITIES: WeatherCity[] = [
  { key: 'mumbai', name_hi: 'मुंबई', name_mr: 'मुंबई', name_en: 'Mumbai', latitude: 19.076, longitude: 72.8777 },
  { key: 'pune', name_hi: 'पुणे', name_mr: 'पुणे', name_en: 'Pune', latitude: 18.5204, longitude: 73.8567 },
  { key: 'nagpur', name_hi: 'नागपुर', name_mr: 'नागपूर', name_en: 'Nagpur', latitude: 21.1458, longitude: 79.0882 },
  { key: 'delhi', name_hi: 'दिल्ली', name_mr: 'नवी दिल्ली', name_en: 'Delhi', latitude: 28.6139, longitude: 77.209 },
  { key: 'indore', name_hi: 'इंदौर', name_mr: 'इंदूर', name_en: 'Indore', latitude: 22.7196, longitude: 75.8577 },
  { key: 'gwalior', name_hi: 'ग्वालियर', name_mr: 'ग्वाल्हेर', name_en: 'Gwalior', latitude: 26.2183, longitude: 78.1828 },
];

export const ZODIAC_SIGNS: Array<{ sign: HoroscopeSign; hi: string; mr: string; en: string; symbol: string }> = [
  { sign: 'aries', hi: 'मेष', mr: 'मेष', en: 'Aries', symbol: '♈' },
  { sign: 'taurus', hi: 'वृषभ', mr: 'वृषभ', en: 'Taurus', symbol: '♉' },
  { sign: 'gemini', hi: 'मिथुन', mr: 'मिथुन', en: 'Gemini', symbol: '♊' },
  { sign: 'cancer', hi: 'कर्क', mr: 'कर्क', en: 'Cancer', symbol: '♋' },
  { sign: 'leo', hi: 'सिंह', mr: 'सिंह', en: 'Leo', symbol: '♌' },
  { sign: 'virgo', hi: 'कन्या', mr: 'कन्या', en: 'Virgo', symbol: '♍' },
  { sign: 'libra', hi: 'तुला', mr: 'तूळ', en: 'Libra', symbol: '♎' },
  { sign: 'scorpio', hi: 'वृश्चिक', mr: 'वृश्चिक', en: 'Scorpio', symbol: '♏' },
  { sign: 'sagittarius', hi: 'धनु', mr: 'धनु', en: 'Sagittarius', symbol: '♐' },
  { sign: 'capricorn', hi: 'मकर', mr: 'मकर', en: 'Capricorn', symbol: '♑' },
  { sign: 'aquarius', hi: 'कुंभ', mr: 'कुंभ', en: 'Aquarius', symbol: '♒' },
  { sign: 'pisces', hi: 'मीन', mr: 'मीन', en: 'Pisces', symbol: '♓' },
];

export const INITIAL_GALLERIES: Gallery[] = [
  {
    id: 'gal-mumbai-ganeshotsav',
    slug: 'mumbai-ganeshotsav-darshan',
    title_hi: 'मुंबई गणेशोत्सव: लालबाग से गिरगांव चौपाटी तक आस्था और संस्कृति का महाकुंभ',
    title_mr: 'मुंबई गणेशोत्सव: लालबाग ते गिरगाव चौपाटीपर्यंत भक्तीचा महासागर',
    title_en: 'Mumbai Ganeshotsav: The Grand Cultural Spectacle from Lalbaug to Girgaon',
    cover_image_url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80',
    credit: 'दैनिक जगत समीक्षा फोटो ब्यूरो / संतोष सांवत',
    is_published: true,
    published_at: '2026-08-25T10:00:00Z',
    created_at: '2026-08-25T10:00:00Z',
    images: [
      {
        id: 'gimg-1',
        gallery_id: 'gal-mumbai-ganeshotsav',
        image_url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1600&q=80',
        thumbnail_url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=400&q=80',
        caption_hi: 'लालबागचा राजा के दर्शन हेतु उमड़ी लाखों श्रद्धालुओं की ऐतिहासिक कतार।',
        caption_mr: 'लालबागच्या राजाच्या दर्शनासाठी उसळलेली लाखो भाविकांची रीघ.',
        caption_en: 'Hundreds of thousands of devotees queuing for darshan at Lalbaugcha Raja.',
        credit: 'जगत समीक्षा फोटो',
        sort_order: 1,
        created_at: '2026-08-25T10:00:00Z',
      },
      {
        id: 'gimg-2',
        gallery_id: 'gal-mumbai-ganeshotsav',
        image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        thumbnail_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
        caption_hi: 'पारंपरिक ढोल-ताशा पथकों द्वारा प्रस्तुत ओजस्वी वादन।',
        caption_mr: 'पारंपरिक ढोल-ताशा पथकांचे मनमोहक आणि चैतन्यमय वादन.',
        caption_en: 'Traditional Dhol-Tasha troupes energizing Mumbai streets.',
        credit: 'जगत समीक्षा फोटो',
        sort_order: 2,
        created_at: '2026-08-25T10:00:00Z',
      },
      {
        id: 'gimg-3',
        gallery_id: 'gal-mumbai-ganeshotsav',
        image_url: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=1600&q=80',
        thumbnail_url: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=400&q=80',
        caption_hi: 'गिरगांव चौपाटी पर विसर्जन की भव्य संध्या आरती और जनसैलाब।',
        caption_mr: 'गिरगाव चौपाटीवरील भव्य विसर्जन संध्याकाळ आणि महाआरती.',
        caption_en: 'Sunset immersion ceremony at Girgaon Chowpatty.',
        credit: 'जगत समीक्षा फोटो',
        sort_order: 3,
        created_at: '2026-08-25T10:00:00Z',
      },
    ],
  },
  {
    id: 'gal-nashik-kumbh',
    slug: 'nashik-godavari-kumbh-heritage',
    title_hi: 'कुंभ नगरी नासिक: गोदावरी रामकुंड की संध्या महाआरती और सांस्कृतिक वैभव',
    title_mr: 'कुंभनगरी नाशिक: गोदावरी रामकुंडावरील संध्या महाआरती व सांस्कृतिक वैभव',
    title_en: 'Historic Nashik: Evening Godavari Maha Aarti at Holy Ramkund',
    cover_image_url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80',
    credit: 'दैनिक जगत समीक्षा उत्तर महाराष्ट्र ब्यूरो',
    is_published: true,
    published_at: '2026-08-24T12:00:00Z',
    created_at: '2026-08-24T12:00:00Z',
    images: [
      {
        id: 'gimg-4',
        gallery_id: 'gal-nashik-kumbh',
        image_url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1600&q=80',
        thumbnail_url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=400&q=80',
        caption_hi: 'दीपदान के साथ गोदावरी तट पर प्रज्ज्वलित सहस्त्र दीप।',
        caption_mr: 'दीपदानाने उजळलेला गोदामाईचा पावन रामकुंड परिसर.',
        caption_en: 'Thousands of floating clay lamps lighting the Ramkund ghats.',
        credit: 'जगत समीक्षा फोटो',
        sort_order: 1,
        created_at: '2026-08-24T12:00:00Z',
      },
    ],
  },
];

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid-mumbai-coastal-road',
    slug: 'mumbai-coastal-road-expansion-ground-report',
    provider: 'youtube',
    video_id_or_url: 'dQw4w9WgXcQ',
    title_hi: 'मुंबई कोस्टल रोड फेज 2 का ग्राउंड रियलिटी चेक; दैनिक जगत समीक्षा विशेष रिपोर्ट',
    title_mr: 'मुंबई कोस्टल रोड टप्पा २ चे प्रत्यक्ष वास्तव; दैनिक जगत समीक्षा विशेष वृत्तांत',
    title_en: 'Mumbai Coastal Road Phase 2 Ground Reality Check: Dainik Jagat Sameeksha Special',
    description_hi: 'वरली से कांदिवली तक जोड़ने वाले तटीय महामार्ग की प्रगति, सुरंग निर्माण तकनीक और नागरिकों के फीडबैक पर विशेष ग्राउंड रिपोर्ट।',
    description_mr: 'वरळी ते कांदिवली सागरी महामार्गाची सद्यस्थिती व प्रगती यावर सविस्तर वृत्त.',
    description_en: 'Comprehensive ground investigation into the Worli-Kandivali coastal corridor progress.',
    thumbnail_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    duration_seconds: 485,
    is_published: true,
    published_at: '2026-08-26T08:30:00Z',
    created_at: '2026-08-26T08:30:00Z',
  },
  {
    id: 'vid-editor-analysis-budget',
    slug: 'chief-editor-arun-tiwari-analysis-budget',
    provider: 'youtube',
    video_id_or_url: 'dQw4w9WgXcQ',
    title_hi: 'संपादकीय विश्लेषण: प्रधान संपादक अरुण रमाकांत तिवारी के साथ महाराष्ट्र बजट 2026',
    title_mr: 'संपादकीय विश्लेषण: मुख्य संपादक अरुण रमाकांत तिवारी यांच्या समवेत महाराष्ट्र अर्थसंकल्प २०२६',
    title_en: 'Editorial Breakdown: Chief Editor Arun Ramakant Tiwari Analyzes Maharashtra Budget 2026',
    description_hi: 'दैनिक जगत समीक्षा के प्रधान संपादक अरुण रमाकांत तिवारी द्वारा राज्य बजट की प्राथमिकताओं, ऋण भार और किसान राहत पैकेजों का निष्पक्ष विश्लेषण।',
    description_mr: 'राज्य अर्थसंकल्पाची बलस्थाने आणि त्रुटी यावर मुख्य संपादकांचे रोखठोक भाष्य.',
    description_en: 'In-depth editorial critique of Maharashtra state budget by Chief Editor Arun Ramakant Tiwari.',
    thumbnail_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    duration_seconds: 720,
    is_published: true,
    published_at: '2026-08-26T07:15:00Z',
    created_at: '2026-08-26T07:15:00Z',
  },
];

export const INITIAL_BRIEFS: BriefItem[] = [
  {
    id: 'brf-1',
    language: 'hi',
    content: 'मुंबई उपनगरीय रेलवे: मध्य रेलवे ने छत्रपति शिवाजी महाराज टर्मिनस और कल्याण के बीच आज से 12 नई एसी लोकल ट्रेनें शुरू कीं।',
    target_url: '/category/mumbai',
    is_published: true,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'brf-2',
    language: 'hi',
    content: 'शेयर बाजार अपडेट: सेंसेक्स 420 अंक चढ़कर 82,650 पर पहुंचा; निफ्टी 25,200 के पार बंद। बैंकिंग सेक्टर में भारी लिवाली।',
    target_url: '/category/business',
    is_published: true,
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'brf-3',
    language: 'hi',
    content: 'मौसम विभाग: विदर्भ एवं मराठवाड़ा के 8 जिलों में अगले 24 घंटों में मध्यम से भारी बारिश का यलो अलर्ट जारी।',
    target_url: '/category/maharashtra',
    is_published: true,
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: 'brf-4',
    language: 'hi',
    content: 'टी-20 अभ्यास मैच: भारतीय टीम ने अभ्यास मैच में ऑस्ट्रेलिया को 5 विकेट से हराया; कप्तान हार्दिक पांड्या का ऑलराउंड प्रदर्शन।',
    target_url: '/category/sports',
    is_published: true,
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
];

export const INITIAL_HOROSCOPES: HoroscopeItem[] = [
  {
    id: 'horo-aries',
    period: 'daily',
    date_for: new Date().toISOString().split('T')[0],
    sign: 'aries',
    content_hi: 'कार्यक्षेत्र में नए अवसरों की प्राप्ति होगी। पदोन्नति अथवा मान-सम्मान में वृद्धि के योग हैं। पारिवारिक वातावरण सुखद रहेगा। वाणी पर संयम रखें।',
    content_mr: 'कामाच्या ठिकाणी नवीन संधी मिळतील. मान-सन्मान वाढेल. कुटुंबात आनंदाचे वातावरण राहील.',
    content_en: 'New professional opportunities arrive today. Harmony prevails at home. Speak prudently.',
    lucky_number: 9,
    lucky_color: 'लाल (Red)',
    author_credit: 'दैनिक जगत समीक्षा ज्योतिष केंद्र',
    created_at: new Date().toISOString(),
  },
  {
    id: 'horo-taurus',
    period: 'daily',
    date_for: new Date().toISOString().split('T')[0],
    sign: 'taurus',
    content_hi: 'आर्थिक मामलों में सावधानी बरतें। अनावश्यक खर्चों से बचें। व्यापार में साझेदारों का सहयोग मिलेगा। स्वास्थ्य का ध्यान रखें।',
    content_mr: 'आर्थिक व्यवहारात सावधगिरी बाळगा. अनावश्यक खर्च टाळा. जोडीदाराचे सहकार्य लाभेल.',
    content_en: 'Exercise financial caution. Avoid impulse expenses. Health requires attention.',
    lucky_number: 6,
    lucky_color: 'सफेद (White)',
    author_credit: 'दैनिक जगत समीक्षा ज्योतिष केंद्र',
    created_at: new Date().toISOString(),
  },
  {
    id: 'horo-gemini',
    period: 'daily',
    date_for: new Date().toISOString().split('T')[0],
    sign: 'gemini',
    content_hi: 'विद्यार्थियों के लिए आज का दिन अत्यंत शुभ है। साक्षात्कार में सफलता मिलेगी। मित्रों से सुखद समाचार प्राप्त होगा।',
    content_mr: 'विद्यार्थ्यांसाठी आजचा दिवस शुभ. मुलाखतींमध्ये यश मिळेल. मित्रांकडून चांगली बातमी मिळेल.',
    content_en: 'Favorable day for students and academics. Interviews will yield positive outcomes.',
    lucky_number: 5,
    lucky_color: 'हरा (Green)',
    author_credit: 'दैनिक जगत समीक्षा ज्योतिष केंद्र',
    created_at: new Date().toISOString(),
  },
  {
    id: 'horo-cancer',
    period: 'daily',
    date_for: new Date().toISOString().split('T')[0],
    sign: 'cancer',
    content_hi: 'मानसिक शांति का अनुभव होगा। भूमि या वाहन क्रय करने की योजना बन सकती है। माता-पिता का आशीर्वाद लेकर कार्य प्रारंभ करें।',
    content_mr: 'मानसिक शांतता लाभेल. वाहन खरेदीचे बेत आखाल. ज्येष्ठांचे आशीर्वाद फलदायी ठरतील.',
    content_en: 'Inner serenity prevails. Property or automobile decisions favor you today.',
    lucky_number: 2,
    lucky_color: 'सिल्वर (Silver)',
    author_credit: 'दैनिक जगत समीक्षा ज्योतिष केंद्र',
    created_at: new Date().toISOString(),
  },
  {
    id: 'horo-leo',
    period: 'daily',
    date_for: new Date().toISOString().split('T')[0],
    sign: 'leo',
    content_hi: 'आत्मविश्वास में भारी वृद्धि होगी। सरकारी कार्यों में गति आएगी। व्यापारिक यात्रा लाभप्रद सिद्ध होगी। शत्रु परास्त होंगे।',
    content_mr: 'आत्मविश्वास वाढेल. शासकीय कामांना गती मिळेल. व्यावसायिक प्रवास फायदेशीर ठरेल.',
    content_en: 'High confidence and leadership power. Government and official work moves rapidly.',
    lucky_number: 1,
    lucky_color: 'सुनहरा (Gold)',
    author_credit: 'दैनिक जगत समीक्षा ज्योतिष केंद्र',
    created_at: new Date().toISOString(),
  },
  {
    id: 'horo-virgo',
    period: 'daily',
    date_for: new Date().toISOString().split('T')[0],
    sign: 'virgo',
    content_hi: 'प्रबंधन एवं कानूनी मामलों में सफलता प्राप्त होगी। रुका हुआ धन वापस मिलने के योग हैं। खान-पान में सतर्कता बरतें।',
    content_mr: 'व्यवस्थापन आणि कायदेशीर बाबींमध्ये यश लाभेल. रखडलेली देणी वसूल होतील.',
    content_en: 'Analytical and legal victories. Delayed payments are likely to be recovered.',
    lucky_number: 7,
    lucky_color: 'हल्का हरा (Light Green)',
    author_credit: 'दैनिक जगत समीक्षा ज्योतिष केंद्र',
    created_at: new Date().toISOString(),
  },
  {
    id: 'horo-libra',
    period: 'daily',
    date_for: new Date().toISOString().split('T')[0],
    sign: 'libra',
    content_hi: 'दांपत्य जीवन में मधुरता बढ़ेगी। कला, संगीत एवं साहित्य से जुड़े जातकों को विशेष सम्मान मिलेगा। नए अनुबंध संभव हैं।',
    content_mr: 'वैवाहिक जीवनात गोडवा वाढेल. कला-साहित्यातील व्यक्तींना विशेष सन्मान मिळेल.',
    content_en: 'Harmony in relationships. Artists and creative professionals earn praise.',
    lucky_number: 6,
    lucky_color: 'गुलाबी (Pink)',
    author_credit: 'दैनिक जगत समीक्षा ज्योतिष केंद्र',
    created_at: new Date().toISOString(),
  },
  {
    id: 'horo-scorpio',
    period: 'daily',
    date_for: new Date().toISOString().split('T')[0],
    sign: 'scorpio',
    content_hi: 'साहस और पराक्रम में वृद्धि होगी। तकनीकी कार्यों में दक्षता बढ़ेगी। किसी पुराने विवाद का सर्वसम्मत समाधान निकलेगा।',
    content_mr: 'पराक्रमात वाढ होईल. जुन्या वादावर तोडगा निघेल. आरोग्य चांगले राहील.',
    content_en: 'Courage and tenacity lead to victory over challenges. Lingering disputes get resolved.',
    lucky_number: 9,
    lucky_color: 'मैरून (Maroon)',
    author_credit: 'दैनिक जगत समीक्षा ज्योतिष केंद्र',
    created_at: new Date().toISOString(),
  },
  {
    id: 'horo-sagittarius',
    period: 'daily',
    date_for: new Date().toISOString().split('T')[0],
    sign: 'sagittarius',
    content_hi: 'धार्मिक यात्रा एवं सत्संग का योग है। उच्च अधिकारियों का पूर्ण सहयोग प्राप्त होगा। संतान पक्ष से शुभ समाचार मिलेगा।',
    content_mr: 'धार्मिक प्रवासाचे योग. वरिष्ठांचे सहकार्य लाभेल. मुलांकडून आनंददायी वार्ता मिळेल.',
    content_en: 'Spiritual upliftment and pilgrimage favor. Support from seniors and mentors.',
    lucky_number: 3,
    lucky_color: 'पीला (Yellow)',
    author_credit: 'दैनिक जगत समीक्षा ज्योतिष केंद्र',
    created_at: new Date().toISOString(),
  },
  {
    id: 'horo-capricorn',
    period: 'daily',
    date_for: new Date().toISOString().split('T')[0],
    sign: 'capricorn',
    content_hi: 'कठिन परिश्रम का यथेष्ट फल प्राप्त होगा। उद्योग एवं निर्माण कार्यों में प्रगति होगी। वरिष्ठ जनों का मार्गदर्शन उपयोगी रहेगा।',
    content_mr: 'कठोर परिश्रमाचे फळ मिळेल. उद्योग-व्यवसायात प्रगती. ज्येष्ठ व्यक्तींचे मार्गदर्शन लाभेल.',
    content_en: 'Hard work brings tangible financial and career rewards. Construction/industry advances.',
    lucky_number: 8,
    lucky_color: 'नीला (Navy Blue)',
    author_credit: 'दैनिक जगत समीक्षा ज्योतिष केंद्र',
    created_at: new Date().toISOString(),
  },
  {
    id: 'horo-aquarius',
    period: 'daily',
    date_for: new Date().toISOString().split('T')[0],
    sign: 'aquarius',
    content_hi: 'सामाजिक कार्यों में सक्रिय सहभागिता रहेगी। नए संपर्क भविष्य में अत्यंत लाभप्रद सिद्ध होंगे। आर्थिक स्थिति सुदृढ़ होगी।',
    content_mr: 'सामाजिक कार्यात सहभाग वाढेल. नवीन ओळखी भविष्यात फायदेशीर ठरतील.',
    content_en: 'Social network expands meaningfully. Innovative projects gain momentum.',
    lucky_number: 11,
    lucky_color: 'आसमानी (Sky Blue)',
    author_credit: 'दैनिक जगत समीक्षा ज्योतिष केंद्र',
    created_at: new Date().toISOString(),
  },
  {
    id: 'horo-pisces',
    period: 'daily',
    date_for: new Date().toISOString().split('T')[0],
    sign: 'pisces',
    content_hi: 'आध्यात्मिक शांति एवं रचनात्मक ऊर्जा का संचार होगा। विदेश से जुड़े मामलों में अप्रत्याशित सफलता के योग हैं।',
    content_mr: 'आध्यात्मिक समाधान लाभेल. परदेशाशी संबंधित कामात यश मिळेल. मन प्रसन्न राहील.',
    content_en: 'Spiritual peace and creative clarity. Cross-border and overseas initiatives flourish.',
    lucky_number: 12,
    lucky_color: 'केसरिया (Saffron)',
    author_credit: 'दैनिक जगत समीक्षा ज्योतिष केंद्र',
    created_at: new Date().toISOString(),
  },
];

export const INITIAL_SUPPLEMENTS: SupplementItem[] = [
  {
    id: 'sup-diwali-2026',
    slug: 'diwali-visheshank-2026',
    title_hi: 'दैनिक जगत समीक्षा: दीपावली महापर्व विशेषांक २०२६',
    title_mr: 'दैनिक जगत समीक्षा: दिवाळी महाविशेषांक २०२६',
    title_en: 'Dainik Jagat Sameeksha: Grand Diwali Special Edition 2026',
    cover_image_url: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=80',
    issue_date: '2026-10-25',
    description: 'भारतीय संस्कृति, दीपोत्सव का आध्यात्मिक दर्शन, महाराष्ट्र की आर्थिक समृद्धि और शीर्ष विचारकों के सारगर्भित आलेखों का रंगीन विशेषांक।',
    pdf_url: '/client-assets/DAINIK_JAGAT_SAMEEKSHA_26_AUGUST_2026.pdf',
    is_published: true,
    created_at: '2026-10-25T00:00:00Z',
  },
  {
    id: 'sup-krishi-2026',
    slug: 'krishi-samriddhi-visheshank',
    title_hi: 'कृषि समृद्धि विशेषांक: उन्नत तकनीक और किसान की प्रगति',
    title_mr: 'कृषी समृद्धी विशेषांक: प्रगत तंत्रज्ञान व बळीराजाची भरभराट',
    title_en: 'Agricultural Prosperity Special: Modern Agritech & Rural Empowerment',
    cover_image_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    issue_date: '2026-08-15',
    description: 'ड्रोन आधारित खेती, जैविक उर्वरक, ड्रिप सिंचाई और महाराष्ट्र के सफल किसान उत्पादक संगठनों (FPO) की प्रेरणादायी कहानियां।',
    pdf_url: '/client-assets/DAINIK_JAGAT_SAMEEKSHA_26_AUGUST_2026.pdf',
    is_published: true,
    created_at: '2026-08-15T00:00:00Z',
  },
];

export const INITIAL_NEWS_TIPS: NewsTip[] = [
  {
    id: 'tip-1',
    sender_name: 'राजेश शेलके',
    sender_phone: '+919822011234',
    sender_city: 'पुणे',
    message: 'पुणे-सोलापूर महामार्गावर हडपसर जवळ खड्ड्यांमुळे भीषण वाहतूक कोंडी. प्रशासनाचे दुर्लक्ष.',
    image_urls: ['https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80'],
    status: 'reviewed',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'tip-2',
    sender_name: 'अमित कुमार श्रीवास्तव',
    sender_phone: '+919871122334',
    sender_city: 'मुंबई',
    message: 'भांडुप पश्चिम स्टेशन रोड पर अवैध फेरीवालों के कारण पैदल यात्रियों को भारी असुविधा। फोटो संलग्न है।',
    image_urls: ['https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80'],
    status: 'new',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];

export const INITIAL_CMS_PAGES: CMSPage[] = [
  {
    slug: 'about-us',
    title_hi: 'हमारे बारे में (About Us) - दैनिक जगत समीक्षा',
    title_mr: 'आमच्याबद्दल (About Us) - दैनिक जगत समीक्षा',
    title_en: 'About Us - Dainik Jagat Sameeksha',
    meta_description: 'दैनिक जगत समीक्षा (RNI: MAHHIN/2014/57312) का इतिहास, संपादकीय नीति और निष्पक्ष पत्रकारिता का संकल्प।',
    body_hi: `
<h2>दैनिक जगत समीक्षा का परिचय</h2>
<p><strong>दैनिक जगत समीक्षा</strong> (Dainik Jagat Sameeksha) भारत का एक प्रतिष्ठित राष्ट्रीय एवं प्रादेशिक दैनिक समाचार पत्र है। भारत सरकार के समाचार पत्र पंजीयक (RNI) द्वारा पंजीकृत संख्या <strong>MAHHIN/2014/57312</strong> के तहत यह समाचार पत्र मुंबई एवं महाराष्ट्र से निरंतर प्रकाशित हो रहा है।</p>

<h3>संपादकीय दृष्टिकोण एवं नेतृत्व</h3>
<p>समाचार पत्र के संस्थापक एवं <strong>प्रधान संपादक श्री अरुण रमाकांत तिवारी</strong> (Arun Ramakant Tiwari) के सक्षम नेतृत्व में दैनिक जगत समीक्षा ने सदैव निष्पक्ष, निर्भीक और जनसरोकारों से जुड़ी पत्रकारिता के उच्चतम मानकों को स्थापित किया है।</p>

<h3>मुद्रण एवं प्रकाशन विवरण</h3>
<ul>
  <li><strong>समाचार पत्र का नाम:</strong> दैनिक जगत समीक्षा (Dainik Jagat Sameeksha)</li>
  <li><strong>RNI पंजीकरण संख्या:</strong> MAHHIN/2014/57312</li>
  <li><strong>प्रधान संपादक:</strong> अरुण रमाकांत तिवारी</li>
  <li><strong>मुद्रक एवं प्रकाशक:</strong> अरुण रमाकांत तिवारी</li>
  <li><strong>मुद्रण स्थल:</strong> मुंबई, महाराष्ट्र</li>
  <li><strong>कार्यालय पता:</strong> भांडुप (पश्चिम), मुंबई, महाराष्ट्र - ४०००७८</li>
  <li><strong>संपर्क दूरभाष:</strong> +91-8369517611, +91-7448193748</li>
  <li><strong>ईमेल:</strong> jagatsameeksha2014@gmail.com</li>
</ul>
    `.trim(),
    body_mr: `
<h2>दैनिक जगत समीक्षा ओळख व इतिहास</h2>
<p><strong>दैनिक जगत समीक्षा</strong> हे मुंबई व महाराष्ट्रातील अग्रगण्य राष्ट्रीय व प्रादेशिक वृत्तपत्र आहे. भारत सरकारच्या वृत्तपत्र निबंधक (RNI) कडे नोंदणी क्रमांक <strong>MAHHIN/2014/57312</strong> अन्वये नियमित प्रकाशित होत आहे.</p>

<h3>संपादकीय नेतृत्व</h3>
<p>वृत्तपत्राचे संस्थापक आणि <strong>मुख्य संपादक श्री. अरुण रमाकांत तिवारी</strong> यांच्या नेतृत्वाखाली निष्पक्ष व निर्भीक पत्रकारिता केली जाते.</p>
    `.trim(),
    body_en: `
<h2>About Dainik Jagat Sameeksha</h2>
<p><strong>Dainik Jagat Sameeksha</strong> is a respected Hindi daily broadsheet newspaper published from Mumbai, Maharashtra, under Registrar of Newspapers for India (RNI) registration number <strong>MAHHIN/2014/57312</strong>.</p>
<p>Founded and led by <strong>Chief Editor Arun Ramakant Tiwari</strong>, the publication delivers investigative journalism, governance analysis, and regional dispatches.</p>
    `.trim(),
    is_published: true,
    updated_at: '2026-10-28T00:00:00Z',
  },
  {
    slug: 'grievance',
    title_hi: 'शिकायत निवारण तंत्र (Grievance Redressal Mechanism)',
    title_mr: 'तक्रार निवारण प्रणाली (Grievance Redressal Mechanism)',
    title_en: 'Grievance Redressal Mechanism - IT Rules 2021 Compliance',
    meta_description: 'Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 के तहत दैनिक जगत समीक्षा का शिकायत निवारण अधिकारी विवरण।',
    body_hi: `
<h2>डिजिटल मीडिया आचार संहिता एवं शिकायत निवारण (IT Rules 2021 Compliance)</h2>
<p>सूचना प्रौद्योगिकी (मध्यवर्ती दिशानिर्देश और डिजिटल मीडिया आचार संहिता) नियम, २०२१ (Information Technology Rules, 2021) के नियम ११ के अनुपालन में <strong>दैनिक जगत समीक्षा</strong> द्वारा डिजिटल समाचार एवं समसामयिक विषयों के संबंध में शिकायत निवारण अधिकारी की नियुक्ति की गई है:</p>

<div class="p-4 border-2 border-crimson-800 bg-crimson-50 rounded-lg my-4">
  <h3 class="text-crimson-900 font-bold mb-2">शिकायत निवारण अधिकारी (Grievance Redressal Officer)</h3>
  <ul class="space-y-1 text-sm text-editorial-900">
    <li><strong>नाम:</strong> श्री अरुण रमाकांत तिवारी (Arun Ramakant Tiwari)</li>
    <li><strong>पदनाम:</strong> प्रधान संपादक एवं शिकायत निवारण अधिकारी</li>
    <li><strong>पंजीकरण संख्या (RNI):</strong> MAHHIN/2014/57312</li>
    <li><strong>कार्यालय पता:</strong> दैनिक जगत समीक्षा, भांडुप (पश्चिम), मुंबई, महाराष्ट्र - ४०००७८</li>
    <li><strong>ईमेल:</strong> <a href="mailto:jagatsameeksha2014@gmail.com" class="text-crimson-800 font-bold underline">jagatsameeksha2014@gmail.com</a></li>
    <li><strong>हेल्पलाइन दूरभाष:</strong> +91-8369517611 / +91-7448193748</li>
  </ul>
</div>

<h3>शिकायत दर्ज करने की प्रक्रिया</h3>
<ol class="list-decimal pl-5 space-y-2 text-sm text-editorial-800">
  <li>शिकायतकर्ता को संबंधित समाचार/सामग्री का यूआरएल (URL), प्रकाशन दिनांक एवं आपत्ति का स्पष्ट विवरण ईमेल द्वारा भेजना होगा।</li>
  <li>शिकायत प्राप्ति की पावती <strong>२४ घंटों</strong> के भीतर प्रेषक को ईमेल द्वारा प्रदान की जाएगी।</li>
  <li>नियमों के अनुसार शिकायत की निष्पक्ष जांच कर उसका निवारण <strong>१५ दिनों</strong> की समयसीमा के भीतर अनिवार्य रूप से किया जाएगा।</li>
</ol>
    `.trim(),
    body_mr: `
<h2>माहिती तंत्रज्ञान नियम २०२१ तक्रार निवारण अधिकारी</h2>
<p>माहिती तंत्रज्ञान (डिजिटल मीडिया आचारसंहिता) नियम २०२१ अंतर्गत दैनिक जगत समीक्षाचे तक्रार निवारण अधिकारी तपशील खालीलप्रमाणे:</p>
<ul>
  <li><strong>अधिकारी:</strong> श्री. अरुण रमाकांत तिवारी (मुख्य संपादक)</li>
  <li><strong>पत्ता:</strong> भांडुप (पश्चिम), मुंबई - ४०००७८</li>
  <li><strong>ईमेल:</strong> jagatsameeksha2014@gmail.com</li>
  <li><strong>दूरध्वनी:</strong> +91-8369517611</li>
</ul>
    `.trim(),
    body_en: `
<h2>Grievance Redressal Mechanism under Rule 11 of IT Rules, 2021</h2>
<p>In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the Grievance Redressal Officer for Dainik Jagat Sameeksha is:</p>
<ul>
  <li><strong>Name:</strong> Mr. Arun Ramakant Tiwari</li>
  <li><strong>Designation:</strong> Chief Editor & Grievance Officer</li>
  <li><strong>Address:</strong> Bhandup (West), Mumbai, Maharashtra - 400078</li>
  <li><strong>Email:</strong> jagatsameeksha2014@gmail.com</li>
  <li><strong>Phone:</strong> +91-8369517611</li>
  <li><strong>Resolution Window:</strong> Acknowledged within 24 hours; resolved within 15 days.</li>
</ul>
    `.trim(),
    is_published: true,
    updated_at: '2026-10-28T00:00:00Z',
  },
];

