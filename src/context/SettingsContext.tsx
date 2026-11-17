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

const sanitizeSettings = (raw: SiteSettings): SiteSettings => {
  const s = { ...raw };
  const addr = s.office_address || '';
  if (
    addr.includes('भांडुप') ||
    addr.toLowerCase().includes('bhandup') ||
    addr.includes('400078') ||
    (!addr.includes('कल्याण') && !addr.toLowerCase().includes('kalyan'))
  ) {
    s.office_address = 'कल्याण, महाराष्ट्र 421301';
  }
  const phone = s.contact_phone || '';
  if (!phone.includes('8828812282')) {
    s.contact_phone = '+91 8828812282, +91 8369517611';
  } else if (phone.includes('7448193748')) {
    s.contact_phone = phone
      .split(',')
      .map((p) => p.trim())
      .filter((p) => {
        const cleaned = p.replace(/^\+?91[\s-]*/, '').trim();
        return !cleaned.startsWith('7');
      })
      .join(', ');
  }

  // Ensure publication tagline is strictly in Hindi ("सत्य, निष्पक्ष एवं निर्भीक समाचार पत्र") and not Marathi
  const rawTagline = s.tagline || '';
  if (
    !rawTagline ||
    rawTagline.includes('वृत्तपत्र') ||
    rawTagline.includes('आणि') ||
    rawTagline.includes('सत्य, निष्पक्ष आणि निर्भीक')
  ) {
    s.tagline = 'सत्य, निष्पक्ष एवं निर्भीक समाचार पत्र';
  }
  s.tagline_hi = 'सत्य, निष्पक्ष एवं निर्भीक समाचार पत्र';
  s.tagline_mr = 'सत्य, निष्पक्ष एवं निर्भीक समाचार पत्र';
  return s;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(() => sanitizeSettings(DEFAULT_SITE_SETTINGS));
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();

  const loadSettings = async () => {
    try {
      const data = await repository.getSiteSettings();
      setSettings(sanitizeSettings(data));
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
    setSettings(sanitizeSettings(updated));
  };

  // Localized publication name according to selected language
  let publicationName = settings.publication_name;
  if (language === 'mr' && settings.publication_name_mr) {
    publicationName = settings.publication_name_mr;
  } else if (language === 'hi' && settings.publication_name_hi) {
    publicationName = settings.publication_name_hi;
  }

  // Publication tagline: strictly Hindi motto only (not Marathi) as requested
  let tagline = settings.tagline || 'सत्य, निष्पक्ष एवं निर्भीक समाचार पत्र';
  if (tagline.includes('वृत्तपत्र') || tagline.includes('आणि')) {
    tagline = 'सत्य, निष्पक्ष एवं निर्भीक समाचार पत्र';
  }
  if (language === 'hi' && settings.tagline_hi) {
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
