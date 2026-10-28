import { describe, it, expect } from 'vitest';
import { UI_TRANSLATIONS } from '@/config/site';

describe('i18n Completeness and Parity Test', () => {
  const hindiKeys = Object.keys(UI_TRANSLATIONS.hi);
  const marathiKeys = Object.keys(UI_TRANSLATIONS.mr);
  const englishKeys = Object.keys(UI_TRANSLATIONS.en);

  it('contains an identical set of keys across Hindi, Marathi, and English', () => {
    const missingInMarathi = hindiKeys.filter(key => !(key in UI_TRANSLATIONS.mr));
    const missingInEnglish = hindiKeys.filter(key => !(key in UI_TRANSLATIONS.en));

    expect(missingInMarathi, `Keys missing in Marathi translations: ${missingInMarathi.join(', ')}`).toEqual([]);
    expect(missingInEnglish, `Keys missing in English translations: ${missingInEnglish.join(', ')}`).toEqual([]);

    expect(marathiKeys.length).toBe(hindiKeys.length);
    expect(englishKeys.length).toBe(hindiKeys.length);
  });

  it('has no empty translation values in any language', () => {
    for (const [lang, dict] of Object.entries(UI_TRANSLATIONS)) {
      for (const [key, val] of Object.entries(dict)) {
        expect(typeof val === 'string' && val.trim().length > 0, `Empty translation found in ${lang} for key "${key}"`).toBe(true);
      }
    }
  });
});
