import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, Category } from '@/types/database';
import { UI_TRANSLATIONS, TranslationKey } from '@/config/site';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: TranslationKey) => string;
  getCategoryName: (category?: Category | null) => string;
  isDevanagari: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = (localStorage.getItem('djs_lang') || localStorage.getItem('janvani_lang')) as SupportedLanguage;
      if (saved && ['hi', 'mr', 'en'].includes(saved)) {
        return saved;
      }
    } catch {
      // LocalStorage access failure fallback
    }
    return 'hi'; // Default Hindi for Dainik Jagat Sameeksha
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('djs_lang', lang);
    } catch {
      // Ignore write errors
    }
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: TranslationKey): string => {
    const langDict = UI_TRANSLATIONS[language] || UI_TRANSLATIONS['hi'];
    return (langDict as Record<string, string>)[key] || (UI_TRANSLATIONS['hi'] as Record<string, string>)[key] || key;
  };

  const getCategoryName = (category?: Category | null): string => {
    if (!category) return '';
    if (category.translations && category.translations[language]?.name) {
      return category.translations[language].name;
    }
    // Fallback to Hindi name, then Marathi, then slug
    if (category.translations && category.translations['hi']?.name) {
      return category.translations['hi'].name;
    }
    if (category.translations && category.translations['mr']?.name) {
      return category.translations['mr'].name;
    }
    return category.slug.toUpperCase();
  };

  const isDevanagari = language === 'hi' || language === 'mr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getCategoryName, isDevanagari }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
