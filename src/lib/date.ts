import { SupportedLanguage } from '@/types/database';

export const TIMEZONE = 'Asia/Kolkata';

// Marathi Month Names
const MARATHI_MONTHS = [
  'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
  'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
];

const MARATHI_DAYS = [
  'रविवार', 'सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'
];

// Hindi Month Names
const HINDI_MONTHS = [
  'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
];

const HINDI_DAYS = [
  'रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'
];

/**
 * Format a timestamp into Asia/Kolkata timezone with language-specific locale representation
 */
export function formatNewsDate(
  dateInput: string | Date | undefined | null,
  lang: SupportedLanguage = 'mr',
  options: { includeTime?: boolean; format?: 'short' | 'medium' | 'full' } = {}
): string {
  if (!dateInput) return '';

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '';

  // Get Kolkata time components
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  const parts = formatter.formatToParts(date);
  const partMap: Record<string, string> = {};
  for (const part of parts) {
    partMap[part.type] = part.value;
  }

  const day = parseInt(partMap.day || '1', 10);
  const monthIdx = parseInt(partMap.month || '1', 10) - 1;
  const year = partMap.year || '2026';
  const hour = partMap.hour || '12';
  const minute = (partMap.minute || '00').padStart(2, '0');
  const dayPeriod = (partMap.dayPeriod || 'AM').toUpperCase();
  const dayOfWeek = date.getDay();

  if (lang === 'mr') {
    const timeStr = options.includeTime 
      ? ` | ${dayPeriod === 'AM' ? 'सकाळी' : 'संध्याकाळी'} ${hour}:${minute}` 
      : '';
    if (options.format === 'short') {
      return `${day} ${MARATHI_MONTHS[monthIdx]} ${year}`;
    }
    return `${MARATHI_DAYS[dayOfWeek]}, ${day} ${MARATHI_MONTHS[monthIdx]} ${year}${timeStr}`;
  }

  if (lang === 'hi') {
    const timeStr = options.includeTime 
      ? ` | ${dayPeriod === 'AM' ? 'सुबह' : 'शाम'} ${hour}:${minute}` 
      : '';
    if (options.format === 'short') {
      return `${day} ${HINDI_MONTHS[monthIdx]} ${year}`;
    }
    return `${HINDI_DAYS[dayOfWeek]}, ${day} ${HINDI_MONTHS[monthIdx]} ${year}${timeStr}`;
  }

  // English fallback with Asia/Kolkata timezone
  const enDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const enMonthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const timeStr = options.includeTime ? `, ${hour}:${minute} ${dayPeriod} IST` : '';
  if (options.format === 'short') {
    return `${day} ${enMonthNames[monthIdx]} ${year}`;
  }
  return `${enDayNames[dayOfWeek]}, ${day} ${enMonthNames[monthIdx]} ${year}${timeStr}`;
}

/**
 * Returns formatted current date for newspaper masthead
 */
export function getCurrentMastheadDate(lang: SupportedLanguage = 'mr'): string {
  return formatNewsDate(new Date(), lang, { format: 'full' });
}

export const formatDate = formatNewsDate;

