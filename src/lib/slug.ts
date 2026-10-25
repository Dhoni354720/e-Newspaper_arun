/**
 * Transliteration dictionary for common Devanagari characters
 * to provide human-readable, safe ASCII slugs while preserving meaning
 */
const DEVANAGARI_TRANSLIT: Record<string, string> = {
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ri',
  'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'am', 'अः': 'ah',
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
  'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
  'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
  'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
  'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
  'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
  'ळ': 'l', 'क्ष': 'ksh', 'ज्ञ': 'dny',
  'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'ृ': 'ri',
  'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'm', '्': '',
};

/**
 * Generate a clean, URL-safe slug from a title/headline
 */
export function generateSlug(text: string, options: { transliterate?: boolean } = { transliterate: true }): string {
  if (!text) return '';

  let processed = text.trim();

  // If transliterate is enabled, convert Devanagari characters to phonetic ASCII
  if (options.transliterate) {
    let transliterated = '';
    for (const char of processed) {
      if (DEVANAGARI_TRANSLIT[char] !== undefined) {
        transliterated += DEVANAGARI_TRANSLIT[char];
      } else {
        transliterated += char;
      }
    }
    processed = transliterated;
  }

  // Convert to lowercase and replace non-alphanumeric (except hyphen) with hyphen
  let slug = processed
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // remove special symbols
    .replace(/[\s_]+/g, '-')   // replace spaces & underscores with hyphen
    .replace(/^-+|-+$/g, '');  // trim leading/trailing hyphens

  // If slug is empty (e.g. if non-transliterated foreign characters were completely stripped)
  if (!slug) {
    slug = 'news-' + Math.random().toString(36).substring(2, 9);
  }

  return slug;
}

/**
 * Ensure a slug is unique by checking against an existing list of slugs
 */
export function ensureUniqueSlug(desiredSlug: string, existingSlugs: string[], currentArticleId?: string): string {
  const baseSlug = desiredSlug.replace(/-\d+$/, '');
  let counter = 1;
  let candidate = desiredSlug;

  while (existingSlugs.includes(candidate)) {
    counter++;
    candidate = `${baseSlug}-${counter}`;
  }

  return candidate;
}
