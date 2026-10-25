import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, Category } from '@/types/database';
import { UI_TRANSLATIONS, LANGUAGE_LABELS } from '@/config/site';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: keyof typeof UI_TRANSLATIONS['mr']) => string;
  getCategoryName: (category?: Category | null) => string;
  isDevanagari: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('janvani_lang') as SupportedLanguage;
    if (saved && ['mr', 'hi', 'en'].includes(saved)) {
      return saved;
    }
    return 'mr'; // Default Marathi
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('janvani_lang', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: keyof typeof UI_TRANSLATIONS['mr']): string => {
    const langDict = UI_TRANSLATIONS[language] || UI_TRANSLATIONS['mr'];
    return langDict[key] || UI_TRANSLATIONS['mr'][key] || key;
  };

  const getCategoryName = (category?: Category | null): string => {
    if (!category) return '';
    if (category.translations && category.translations[language]?.name) {
      return category.translations[language].name;
    }
    // Fallback to Marathi name or slug
    if (category.translations && category.translations['mr']?.name) {
      return category.translations['mr'].name;
    }
    return category.slug.toUpperCase();
  };

  const isDevanagari = language === 'mr' || language === 'hi';

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
