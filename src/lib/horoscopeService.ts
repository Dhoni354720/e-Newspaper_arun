import { HoroscopeItem, HoroscopeSign } from '@/types/database';
import { ZODIAC_SIGNS } from '@/data/seedData';
import { repository } from '@/lib/repository';

// Planetary Rulers and Astrological Qualities for authentic Hindi/Marathi daily generation
const VEDIC_SIGN_LORE: Record<HoroscopeSign, {
  rulerHi: string;
  rulerMr: string;
  rulerEn: string;
  elementsHi: string[];
  elementsMr: string[];
  luckyColors: string[];
}> = {
  aries: {
    rulerHi: 'मंगल (Mars)',
    rulerMr: 'मंगळ (Mars)',
    rulerEn: 'Mars',
    elementsHi: [
      'आज मंगल के प्रभाव से आत्मविश्वास और ऊर्जा का स्तर उत्कृष्ट रहेगा। कार्यक्षेत्र में नेतृत्व क्षमता की सराहना होगी। आर्थिक मामलों में जल्दबाजी से बचें।',
      'पारिवारिक जीवन में सुख-शांति बनी रहेगी। नए उद्यम या योजना में निवेश के शुभ अवसर बनेंगे। शाम के समय किसी पुराने मित्र से सुखद भेंट संभव है।'
    ],
    elementsMr: [
      'आज मंगळाच्या शुभ प्रभावामुळे आत्मविश्वास व उत्साह द्विगुणित राहील. कामाच्या ठिकाणी आपल्या निर्णयक्षमतेचे कौतुक होईल. आर्थिक गुंतवणूक करताना घाई टाळा.',
      'कुटुंबातील वातावरण आनंदी राहील. नवीन प्रकल्पाची सुरुवात करण्यासाठी आजचा दिवस अनुकूल आहे. संध्याकाळी मित्रांसोबत सकारात्मक संवाद घडेल.'
    ],
    luckyColors: ['लाल (Red)', 'सिंदूरी (Crimson)', 'नारंगी (Orange)'],
  },
  taurus: {
    rulerHi: 'शुक्र (Venus)',
    rulerMr: 'शुक्र (Venus)',
    rulerEn: 'Venus',
    elementsHi: [
      'शुक्र के गोचर से आज भौतिक सुख-सुविधाओं और धन वृद्धि के योग हैं। व्यापार में साझेदारी से अपेक्षित लाभ प्राप्त होगा।',
      'रचनात्मक कार्यों में मन लगेगा। जीवनसाथी के साथ सामंजस्य मजबूत होगा। स्वास्थ्य के प्रति थोड़ी सावधानी अपेक्षित है।'
    ],
    elementsMr: [
      'शुक्राच्या शुभ भ्रमणामुळे आज भौतिक सुख-समृद्धी व आर्थिक लाभाचे उत्तम योग आहेत. व्यवसायात अपेक्षित प्रगती दिसून येईल.',
      'कौटुंबिक जीवनात सामंजस्य राहील. कला आणि सर्जनशील कामात यश लाभेल. आरोग्याची थोडी काळजी घेणे योग्य ठरेल.'
    ],
    luckyColors: ['पांढरा (White)', 'गुलाबी (Pink)', 'सोनेरी (Gold)'],
  },
  gemini: {
    rulerHi: 'बुध (Mercury)',
    rulerMr: 'बुध (Mercury)',
    rulerEn: 'Mercury',
    elementsHi: [
      'बुध ग्रह की स्थिति बौद्धिक कार्यों और संचार में विशेष सफलता दिलाएगी। विद्यार्थियों और संवाददाताओं के लिए दिन अत्यंत लाभकारी है।',
      'आर्थिक लेन-देन में सतर्कता बरतें। कार्यक्षेत्र में नई जिम्मेदारियां मिल सकती हैं जो भविष्य में उन्नति का मार्ग प्रशस्त करेंगी।'
    ],
    elementsMr: [
      'बुधाच्या प्रभावामुळे बौद्धिक कौशल्य आणि संवादाच्या क्षेत्रात विशेष प्रगती होईल. विद्यार्थी व व्यावसायिकांसाठी उत्तम दिवस.',
      'आर्थिक व्यवहारांमध्ये स्पष्टता ठेवा. कार्यालयात नवीन संधी किंवा महत्त्वाची जबाबदारी मिळण्याची शक्यता आहे.'
    ],
    luckyColors: ['हिरवा (Green)', 'आकाशी (Sky Blue)', 'पिवळा (Yellow)'],
  },
  cancer: {
    rulerHi: 'चंद्र (Moon)',
    rulerMr: 'चंद्र (Moon)',
    rulerEn: 'Moon',
    elementsHi: [
      'चंद्रमा के शुभ गोचर से मानसिक शांति और पारिवारिक सौहार्द में वृद्धि होगी। संपत्ति या वाहन संबंधी कार्यों में गति आएगी।',
      'भावनाओं पर नियंत्रण रखें और व्यावहारिक दृष्टिकोण अपनाएं। पुराने लंबित कार्यों का समाधान होने से मन प्रसन्न रहेगा।'
    ],
    elementsMr: [
      'चंद्राच्या शुभ भ्रमणामुळे मानसिक शांती व सकारात्मक विचार वाढीस लागतील. कौटुंबिक सौख्याचा आनंद मिळेल.',
      'घर किंवा मालमत्तेशी संबंधित कामात यश येईल. भावनांच्या आहारी न जाता व्यावहारिक निर्णय घेणे फायदेशीर ठरेल.'
    ],
    luckyColors: ['मोती पांढरा (Pearl White)', 'चांदेरी (Silver)', 'क्रीम (Cream)'],
  },
  leo: {
    rulerHi: 'सूर्य (Sun)',
    rulerMr: 'सूर्य (Sun)',
    rulerEn: 'Sun',
    elementsHi: [
      'सूर्य के प्रभाव से मान-सम्मान, पद-प्रतिष्ठा और सामाजिक प्रभाव में वृद्धि होगी। सरकारी या प्रशासनिक कार्यों में सफलता निश्चित है।',
      'अधीनस्थ कर्मचारियों का सहयोग मिलेगा। अपने आत्मविश्वास को अहंकार में न बदलने दें। आर्थिक स्थिति मजबूत रहेगी।'
    ],
    elementsMr: [
      'सूर्याच्या प्रखर प्रभावामुळे समाजात व कार्यक्षेत्रात मान-प्रतिष्ठा उंचावेल. प्रशासकीय कामांमध्ये यश संपादन होईल.',
      'सहकाऱ्यांचे उत्तम सहकार्य लाभेल. स्वतःच्या क्षमतेवर विश्वास ठेवा, आर्थिक स्थिती मजबूत राहण्याचे संकेत आहेत.'
    ],
    luckyColors: ['केशरी (Saffron)', 'सोनेरी पिवळा (Gold)', 'लाल (Ruby Red)'],
  },
  virgo: {
    rulerHi: 'बुध (Mercury)',
    rulerMr: 'बुध (Mercury)',
    rulerEn: 'Mercury',
    elementsHi: [
      'दैनिक कार्यों में अनुशासन और सूक्ष्म योजना सफलता का आधार बनेगी। कार्यक्षेत्र में आपकी कार्यकुशलता की प्रशंसा होगी।',
      'आर्थिक बचत की योजनाएं फलीभूत होंगी। परिवार में वरिष्ठों का मार्गदर्शन लाभप्रद सिद्ध होगा। स्वास्थ्य अनुकूल रहेगा।'
    ],
    elementsMr: [
      'कामातील शिस्तबद्धता व बारकावे आज यशाचा मार्ग दाखवतील. आपल्या कार्यक्षमतेमुळे वरिष्ठ अधिकारी समाधानी राहतील.',
      'आर्थिक नियोजनात यश लाभेल. कुटुंबातील ज्येष्ठ व्यक्तींचे मार्गदर्शन फायदेशीर ठरेल. आरोग्य उत्तम राहील.'
    ],
    luckyColors: ['हिरवा (Emerald Green)', 'खाकी (Khaki)', 'फिकट निळा (Light Blue)'],
  },
  libra: {
    rulerHi: 'शुक्र (Venus)',
    rulerMr: 'शुक्र (Venus)',
    rulerEn: 'Venus',
    elementsHi: [
      'व्यापारिक समझौतों और वैवाहिक संबंधों में मधुरता रहेगी। कला, साहित्य और मीडिया से जुड़े जातकों के लिए विशेष शुभ दिन है।',
      'अनावश्यक खर्चों पर नियंत्रण रखना श्रेयस्कर होगा। किसी महत्वपूर्ण निर्णय में मित्रों का रचनात्मक सहयोग मिलेगा।'
    ],
    elementsMr: [
      'व्यापारी भागीदारी आणि वैयक्तिक संबंधांमध्ये सुसंवाद राहील. कला, साहित्य व माध्यमांशी संबंधित लोकांसाठी उत्तम दिवस.',
      'अनावश्यक खर्चावर संयम ठेवणे आवश्यक आहे. मित्रांच्या सहकार्याने प्रलंबित कामे पूर्णत्वास जातील.'
    ],
    luckyColors: ['गुलाबी (Rose Pink)', 'पांढरा (White)', 'फिरोजी (Turquoise)'],
  },
  scorpio: {
    rulerHi: 'मंगल व केतु (Mars & Ketu)',
    rulerMr: 'मंगळ व केतू (Mars & Ketu)',
    rulerEn: 'Mars & Ketu',
    elementsHi: [
      'गूढ़ विद्या, अनुसंधान और तकनीकी कार्यों में अभूतपूर्व प्रगति संभव है। विरोधियों पर आपका प्रभाव स्थापित होगा।',
      'अपनी योजनाओं को गोपनीय रखें। अचानक धन लाभ के अवसर बन सकते हैं। आध्यात्मिक कार्यों में रुचि बढ़ेगी।'
    ],
    elementsMr: [
      'संशोधन, तंत्रज्ञान व विश्लेषणात्मक कामांमध्ये उल्लेखनीय प्रगती होईल. विरोधकांवर मात करण्यात यश मिळेल.',
      'आपल्या व्यावसायिक योजना गुप्त ठेवणे हिताचे ठरेल. आकस्मिक धनलाभाचे योग संभवतात. मन शांत राहील.'
    ],
    luckyColors: ['गर्द लाल (Maroon)', 'काळा-तपकिरी (Brown)', 'नारंगी (Orange)'],
  },
  sagittarius: {
    rulerHi: 'बृहस्पति (Jupiter)',
    rulerMr: 'गुरू (Jupiter)',
    rulerEn: 'Jupiter',
    elementsHi: [
      'गुरु की कृपा से ज्ञान, धर्म और उच्च शिक्षा में उन्नति के अवसर मिलेंगे। लंबी यात्रा या तीर्थाटन की योजना बन सकती है।',
      'भाग्य का पूर्ण सहयोग मिलेगा। सामाजिक कार्यों में भागीदारी बढ़ेगी। नए संपर्क भविष्य के लिए लाभकारी रहेंगे।'
    ],
    elementsMr: [
      'गुरूच्या आशीर्वादाने ज्ञान, अध्यात्म आणि शिक्षण क्षेत्रात भरघोस यश लाभेल. धार्मिक किंवा प्रवासाचे योग येतील.',
      'नशिबाची भक्कम साथ लाभेल. सामाजिक उपक्रमांमध्ये सहभाग वाढेल. नवीन ओळखी भविष्यात फायदेशीर ठरतील.'
    ],
    luckyColors: ['पिवळा (Bright Yellow)', 'केशरी (Saffron)', 'सोनेरी (Gold)'],
  },
  capricorn: {
    rulerHi: 'शनि (Saturn)',
    rulerMr: 'शनी (Saturn)',
    rulerEn: 'Saturn',
    elementsHi: [
      'शनि के प्रभाव से कर्मठता और धैर्य आज आपके सबसे बड़े अस्त्र साबित होंगे। आजीविका और करियर में स्थायित्व आएगा।',
      'जल्दबाजी के निर्णयों से बचें। पैतृक संपत्ति के मामलों में प्रगति होगी। स्वास्थ्य में हड्डियों या जोड़ों का ध्यान रखें।'
    ],
    elementsMr: [
      'शनीच्या प्रभावामुळे कष्टाचे चीज होईल. संयम आणि चिकाटीमुळे कामाच्या ठिकाणी स्थिरता व प्रगती साधता येईल.',
      'घाईगडबडीत निर्णय घेणे टाळा. वडिलोपार्जित कामांना गती मिळेल. आरोग्याची नियमित काळजी घ्या.'
    ],
    luckyColors: ['गडद निळा (Navy Blue)', 'राखाडी (Grey)', 'काळा (Black)'],
  },
  aquarius: {
    rulerHi: 'शनि (Saturn)',
    rulerMr: 'शनी (Saturn)',
    rulerEn: 'Saturn',
    elementsHi: [
      'नवाचार और आधुनिक तकनीक के प्रयोग से जटिल समस्याओं का समाधान निकलेगा। मित्रों और सामाजिक संगठनों से सहयोग मिलेगा।',
      'आर्थिक स्थिति में सुधार होगा। किसी नई सामाजिक या व्यावसायिक योजना का श्रीगणेश करने के लिए शुभ समय है।'
    ],
    elementsMr: [
      'नाविन्यपूर्ण विचार आणि आधुनिक तंत्रज्ञानाच्या साहाय्याने गुंतागुंतीचे प्रश्न सुटतील. मित्र परिवाराचे सहकार्य लाभेल.',
      'आर्थिक बाजू भक्कम राहील. नवीन सामाजिक किंवा व्यावसायिक योजना सुरू करण्यासाठी अनुकूल दिवस आहे.'
    ],
    luckyColors: ['आकाशी निळा (Electric Blue)', 'हिरवा (Cyan)', 'जांभळा (Purple)'],
  },
  pisces: {
    rulerHi: 'बृहस्पति (Jupiter)',
    rulerMr: 'गुरू (Jupiter)',
    rulerEn: 'Jupiter',
    elementsHi: [
      'गुरु की दृष्टि से रचनात्मकता, अध्यात्म और अंतर्ज्ञान उच्च स्तर पर रहेगा। परोपकार और सेवा कार्यों में संतोष मिलेगा।',
      'विदेशी संपर्कों या दूरस्थ स्थानों से शुभ समाचार की प्राप्ति होगी। आर्थिक निवेश से भविष्य में लाभ की संभावना है।'
    ],
    elementsMr: [
      'गुरूच्या कृपेने कल्पकता, अध्यात्म आणि आत्मिक समाधानात वृद्धी होईल. समाजोपयोगी कामांमध्ये सहभाग वाढेल.',
      'दूरच्या मित्रांकडून किंवा परदेशातून आनंदवार्ता मिळेल. भविष्यातील आर्थिक गुंतवणुकीसाठी योग्य विचार करा.'
    ],
    luckyColors: ['हळदी पिवळा (Golden Yellow)', 'समुद्री हिरवा (Sea Green)', 'पांढरा (White)'],
  },
};

/**
 * Deterministically generates lucky number and color derived from date and sign
 */
function getDailyLuckySeed(sign: HoroscopeSign, dateStr: string): { luckyNumber: number; luckyColor: string } {
  const dateHash = dateStr.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0);
  const signIndex = ZODIAC_SIGNS.findIndex(z => z.sign === sign);
  const luckyNumber = ((dateHash + signIndex * 3) % 9) + 1;

  const colors = VEDIC_SIGN_LORE[sign].luckyColors;
  const luckyColor = colors[(dateHash + signIndex) % colors.length];

  return { luckyNumber, luckyColor };
}

/**
 * Fetches live daily horoscope from internet API with seamless fallback to daily Vedic planetary transits
 */
export async function fetchLiveDailyHoroscope(forceRefresh: boolean = false): Promise<HoroscopeItem[]> {
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Check local cache first unless force refreshed
  if (!forceRefresh) {
    try {
      const existing = await repository.getHoroscopes('daily', todayStr);
      const matchesToday = existing.filter(h => h.date_for === todayStr);
      if (matchesToday.length === 12) {
        return matchesToday;
      }
    } catch {
      // Proceed to fetch fresh
    }
  }

  // 2. Fetch live data for each of the 12 signs in parallel
  const horoscopePromises = ZODIAC_SIGNS.map(async (zodiac) => {
    let liveEnglishText = '';
    const { luckyNumber, luckyColor } = getDailyLuckySeed(zodiac.sign, todayStr);

    try {
      // Connect to online live horoscope service
      const res = await fetch(`https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${zodiac.sign}&day=TODAY`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.data?.horoscope) {
          liveEnglishText = json.data.horoscope.trim();
        }
      }
    } catch (e) {
      // Non-blocking fallback if internet network is intermittent
      console.warn(`Internet horoscope fetch for ${zodiac.sign} fallback:`, e);
    }

    // Default Vedic astrological guidance for Hindi and Marathi
    const lore = VEDIC_SIGN_LORE[zodiac.sign];
    const dateNum = new Date(todayStr).getDate();
    const hiVariant = lore.elementsHi[dateNum % lore.elementsHi.length];
    const mrVariant = lore.elementsMr[dateNum % lore.elementsMr.length];

    const contentHi = liveEnglishText
      ? `${hiVariant} \n\n[लाइव दैनिक गोचर प्रभाव: ${liveEnglishText}]`
      : `${hiVariant} आज ग्रह गोचर आपके अनुकूल रहने से सभी महत्वपूर्ण कार्यों में सुगमता रहेगी।`;

    const contentMr = liveEnglishText
      ? `${mrVariant} \n\n[थेट दैनिक गोचर विश्लेषण: ${liveEnglishText}]`
      : `${mrVariant} आज ग्रहमानाची उत्तम साथ लाभल्यामुळे सर्व महत्त्वाची कामे सुरळीत पार पडतील.`;

    const contentEn = liveEnglishText || `${zodiac.en}: A productive day ahead under ${lore.rulerEn}'s transit. Focus on key priorities and collaborative work.`;

    const item: Partial<HoroscopeItem> & { sign: HoroscopeSign; period: 'daily' } = {
      sign: zodiac.sign,
      period: 'daily',
      date_for: todayStr,
      content_hi: contentHi,
      content_mr: contentMr,
      content_en: contentEn,
      lucky_number: luckyNumber,
      lucky_color: luckyColor,
      author_credit: 'दैनिक जगत समीक्षा लाइव ज्योतिष केंद्र (कल्याण, महाराष्ट्र)',
    };

    return item;
  });

  const liveResults = await Promise.all(horoscopePromises);

  // 3. Save batch to repository storage
  const saved = await repository.saveHoroscopesBatch(liveResults);
  try {
    localStorage.setItem('djs_horoscope_last_sync', new Date().toISOString());
  } catch {
    // Ignore storage quota
  }

  return saved;
}
