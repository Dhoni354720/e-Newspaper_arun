-- ==============================================================================
-- JANVANI NEWS (जनवाणी न्यूज) — SEED DATA
-- Default Categories, Translations, Initial Site Settings & Demo Editorial Content
-- ==============================================================================

-- 1. Site Settings Default Record
INSERT INTO public.site_settings (
  id,
  publication_name,
  publication_name_mr,
  publication_name_hi,
  tagline,
  default_language,
  supported_languages,
  contact_email,
  contact_phone,
  office_address,
  social_links,
  theme_settings
) VALUES (
  'default',
  'JANVANI NEWS',
  'जनवाणी न्यूज',
  'जनवाणी न्यूज़',
  'सत्य, निष्पक्ष आणि निर्भीक वृत्तपत्र',
  'mr',
  ARRAY['mr', 'hi', 'en'],
  'editorial@janvaninews.com',
  '+91 20 2550 0000',
  'Janvani Bhavan, FC Road, Shivaji Nagar, Pune, Maharashtra 411005',
  '{"twitter": "https://twitter.com/janvaninews", "facebook": "https://facebook.com/janvaninews", "youtube": "https://youtube.com/@janvaninews", "telegram": "https://t.me/janvaninews"}'::jsonb,
  '{"accentColor": "#991b1b", "mastheadStyle": "classic", "enableBreakingTicker": true}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  publication_name = EXCLUDED.publication_name,
  publication_name_mr = EXCLUDED.publication_name_mr,
  publication_name_hi = EXCLUDED.publication_name_hi;

-- 2. Initial Categories (UUIDs explicitly specified for clean relational linking)
INSERT INTO public.categories (id, slug, sort_order, is_active) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'maharashtra', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'mumbai', 2, true),
  ('c1000000-0000-0000-0000-000000000003', 'pune', 3, true),
  ('c1000000-0000-0000-0000-000000000004', 'india', 4, true),
  ('c1000000-0000-0000-0000-000000000005', 'politics', 5, true),
  ('c1000000-0000-0000-0000-000000000006', 'business', 6, true),
  ('c1000000-0000-0000-0000-000000000007', 'technology', 7, true),
  ('c1000000-0000-0000-0000-000000000008', 'education', 8, true),
  ('c1000000-0000-0000-0000-000000000009', 'sports', 9, true),
  ('c1000000-0000-0000-0000-000000000010', 'entertainment', 10, true),
  ('c1000000-0000-0000-0000-000000000011', 'health', 11, true),
  ('c1000000-0000-0000-0000-000000000012', 'agriculture', 12, true),
  ('c1000000-0000-0000-0000-000000000013', 'breaking-news', 13, true)
ON CONFLICT (id) DO NOTHING;

-- 3. Category Translations (Marathi, Hindi, English)
INSERT INTO public.category_translations (category_id, language, name, description) VALUES
  -- Maharashtra
  ('c1000000-0000-0000-0000-000000000001', 'mr', 'महाराष्ट्र', 'महाराष्ट्रातील ताज्या घडामोडी, विकासकामे आणि प्रादेशिक वृत्त'),
  ('c1000000-0000-0000-0000-000000000001', 'hi', 'महाराष्ट्र', 'महाराष्ट्र की ताज़ा खबरें, विकास कार्य और प्रादेशिक समाचार'),
  ('c1000000-0000-0000-0000-000000000001', 'en', 'Maharashtra', 'Latest news, developments and regional reporting from Maharashtra'),

  -- Mumbai
  ('c1000000-0000-0000-0000-000000000002', 'mr', 'मुंबई', 'मुंबई महानगर, स्थानिक प्रश्न आणि घडामोडी'),
  ('c1000000-0000-0000-0000-000000000002', 'hi', 'मुंबई', 'मुंबई महानगर, स्थानीय मुद्दे और शहर की हलचल'),
  ('c1000000-0000-0000-0000-000000000002', 'en', 'Mumbai', 'Mumbai metropolitan news, civic issues, and city developments'),

  -- Pune
  ('c1000000-0000-0000-0000-000000000003', 'mr', 'पुणे', 'पुणे शहर, पिंपरी चिंचवड आणि जिल्ह्यातील महत्त्वाच्या घडामोडी'),
  ('c1000000-0000-0000-0000-000000000003', 'hi', 'पुणे', 'पुणे शहर, पिंपरी चिंचवड और जिले के प्रमुख समाचार'),
  ('c1000000-0000-0000-0000-000000000003', 'en', 'Pune', 'Pune city, PCMC and district news and events'),

  -- India
  ('c1000000-0000-0000-0000-000000000004', 'mr', 'देश', 'राष्ट्रीय घडामोडी आणि देशभरातील बातम्या'),
  ('c1000000-0000-0000-0000-000000000004', 'hi', 'देश', 'राष्ट्रीय घटनाक्रम और देश भर के समाचार'),
  ('c1000000-0000-0000-0000-000000000004', 'en', 'India', 'National news, central policies, and nationwide coverage'),

  -- Politics
  ('c1000000-0000-0000-0000-000000000005', 'mr', 'राजकारण', 'राजकीय विश्लेषण, निवडणुका आणि सत्ताकारणातील घडामोडी'),
  ('c1000000-0000-0000-0000-000000000005', 'hi', 'राजनीति', 'राजनीतिक विश्लेषण, चुनाव और सत्ता गलियारों की हलचल'),
  ('c1000000-0000-0000-0000-000000000005', 'en', 'Politics', 'Political analysis, governance, elections and policy decisions'),

  -- Business
  ('c1000000-0000-0000-0000-000000000006', 'mr', 'अर्थकारण', 'शेअर बाजार, उद्योग, अर्थव्यवस्था आणि अर्थसंकल्प'),
  ('c1000000-0000-0000-0000-000000000006', 'hi', 'व्यापार', 'शेयर बाजार, उद्योग, व्यापार और अर्थव्यवस्था'),
  ('c1000000-0000-0000-0000-000000000006', 'en', 'Business', 'Markets, economy, enterprise, startups and personal finance'),

  -- Technology
  ('c1000000-0000-0000-0000-000000000007', 'mr', 'तंत्रज्ञान', 'टेक जगतातील क्रांती, सायबर सुरक्षा आणि नवनवीन गॅजेट्स'),
  ('c1000000-0000-0000-0000-000000000007', 'hi', 'तकनीक', 'तकनीकी दुनिया, एआई, गैजेट्स और डिजिटल बदलाव'),
  ('c1000000-0000-0000-0000-000000000007', 'en', 'Technology', 'AI advancements, digital innovation, cybersecurity and gadgets'),

  -- Education
  ('c1000000-0000-0000-0000-000000000008', 'mr', 'शिक्षण', 'शालेय व उच्च शिक्षण, परीक्षा निकाल आणि करिअर मार्गदर्शन'),
  ('c1000000-0000-0000-0000-000000000008', 'hi', 'शिक्षा', 'शिक्षा, बोर्ड परीक्षाएं, परिणाम और करियर मार्गदर्शन'),
  ('c1000000-0000-0000-0000-000000000008', 'en', 'Education', 'School and higher education, exam results and career guidance'),

  -- Sports
  ('c1000000-0000-0000-0000-000000000009', 'mr', 'क्रीडा', 'क्रिकेट, फुटबॉल, कुस्ती आणि ऑलिम्पिक क्रीडा वार्ता'),
  ('c1000000-0000-0000-0000-000000000009', 'hi', 'खेल', 'क्रिकेट, फुटबॉल और प्रमुख राष्ट्रीय व अंतरराष्ट्रीय खेल'),
  ('c1000000-0000-0000-0000-000000000009', 'en', 'Sports', 'Cricket, football, athletics, wrestling and sporting tournaments'),

  -- Entertainment
  ('c1000000-0000-0000-0000-000000000010', 'mr', 'मनोरंजन', 'मराठी चित्रपट, बॉलिवूड, नाटक आणि ओटीटी समीक्षा'),
  ('c1000000-0000-0000-0000-000000000010', 'hi', 'मनोरंजन', 'बॉलीवुड, सिनेमा, वेब सीरीज और मनोरंजन जगत की खबरें'),
  ('c1000000-0000-0000-0000-000000000010', 'en', 'Entertainment', 'Regional cinema, Bollywood, theater, and OTT streaming reviews'),

  -- Health
  ('c1000000-0000-0000-0000-000000000011', 'mr', 'आरोग्य', 'आरोग्य सल्ला, वैद्यकीय संशोधन आणि निरोगी जीवनशैली'),
  ('c1000000-0000-0000-0000-000000000011', 'hi', 'स्वास्थ्य', 'स्वास्थ्य परामर्श, मेडिकल रिसर्च और सेहतमंद जीवनशैली'),
  ('c1000000-0000-0000-0000-000000000011', 'en', 'Health', 'Wellness, medical research, public healthcare and nutrition'),

  -- Agriculture
  ('c1000000-0000-0000-0000-000000000012', 'mr', 'कृषी', 'शेती तंत्रज्ञान, बाजारभाव, हवामान अंदाज आणि शेतकरी योजना'),
  ('c1000000-0000-0000-0000-000000000012', 'hi', 'कृषि', 'कृषि तकनीक, मंडी भाव, मौसम पूर्वानुमान और किसान कल्याण'),
  ('c1000000-0000-0000-0000-000000000012', 'en', 'Agriculture', 'Agritech, mandi rates, monsoon updates and farmer policies'),

  -- Breaking News
  ('c1000000-0000-0000-0000-000000000013', 'mr', 'महत्त्वाच्या घडामोडी', 'अति-महत्त्वाच्या आणि ब्रेकिंग घडामोडींचे तात्काळ कव्हरेज'),
  ('c1000000-0000-0000-0000-000000000013', 'hi', 'ब्रेकिंग न्यूज़', 'तात्कालिक एवं अत्यंत महत्वपूर्ण राष्ट्रीय व प्रादेशिक समाचार'),
  ('c1000000-0000-0000-0000-000000000013', 'en', 'Breaking News', 'Live alerts, high-priority developments and breaking bulletins')
ON CONFLICT (category_id, language) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;
