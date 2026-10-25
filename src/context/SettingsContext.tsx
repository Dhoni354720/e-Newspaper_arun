import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings, SupportedLanguage } from '@/types/database';
import { DEFAULT_SITE_SETTINGS } from '@/config/site';
import { repository } from '@/lib/repository';
import { useLanguage } from './LanguageContext';

interface SettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
  publicationName: string;
  tagline: string;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();

  const loadSettings = async () => {
    try {
      const data = await repository.getSiteSettings();
      setSettings(data);
    } catch (e) {
      console.error('Failed to load settings:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const updated = await repository.updateSiteSettings(newSettings);
    setSettings(updated);
  };

  // Localized publication name according to selected language
  let publicationName = settings.publication_name;
  if (language === 'mr' && settings.publication_name_mr) {
    publicationName = settings.publication_name_mr;
  } else if (language === 'hi' && settings.publication_name_hi) {
    publicationName = settings.publication_name_hi;
  }

  // Localized publication tagline according to selected language
  let tagline = settings.tagline;
  if (language === 'mr' && settings.tagline_mr) {
    tagline = settings.tagline_mr;
  } else if (language === 'hi' && settings.tagline_hi) {
    tagline = settings.tagline_hi;
  } else if (language === 'en' && settings.tagline_en) {
    tagline = settings.tagline_en;
  }

  return (
    <SettingsContext.Provider value={{
      settings,
      isLoading,
      publicationName,
      tagline,
      updateSettings,
      refreshSettings: loadSettings,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
