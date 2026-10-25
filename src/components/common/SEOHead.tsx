import React, { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  articleCategory?: string;
  articleType?: 'article' | 'website';
  translations?: Array<{ language: string; url: string }>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalUrl,
  ogImage,
  publishedTime,
  modifiedTime,
  authorName,
  articleCategory,
  articleType = 'website',
  translations = [],
}) => {
  const { language } = useLanguage();
  const { publicationName, settings } = useSettings();

  const fullTitle = title 
    ? `${title} | ${publicationName}` 
    : `${publicationName} — ${settings.tagline}`;
  const metaDescription = description || settings.tagline;
  const currentUrl = canonicalUrl || window.location.href;
  const shareImage = ogImage || `${window.location.origin}/favicon.svg`;

  useEffect(() => {
    // Set document title
    document.title = fullTitle;

    // Helper to set or create meta tag
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMeta('description', metaDescription);
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', metaDescription, true);
    setMeta('og:type', articleType, true);
    setMeta('og:url', currentUrl, true);
    setMeta('og:image', shareImage, true);
    setMeta('og:site_name', publicationName, true);
    setMeta('og:locale', language === 'mr' ? 'mr_IN' : language === 'hi' ? 'hi_IN' : 'en_US', true);

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', metaDescription);
    setMeta('twitter:image', shareImage);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // Schema.org JSON-LD Structured Data
    const scriptId = 'news-structured-data';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const jsonLd = articleType === 'article' ? {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      'headline': title,
      'description': metaDescription,
      'image': [shareImage],
      'datePublished': publishedTime,
      'dateModified': modifiedTime || publishedTime,
      'author': [{
        '@type': 'Person',
        'name': authorName || 'Editorial Bureau',
      }],
      'publisher': {
        '@type': 'NewsMediaOrganization',
        'name': publicationName,
        'url': window.location.origin,
        'logo': {
          '@type': 'ImageObject',
          'url': `${window.location.origin}/favicon.svg`,
        },
      },
      'articleSection': articleCategory || 'News',
      'inLanguage': language,
    } : {
      '@context': 'https://schema.org',
      '@type': 'NewsMediaOrganization',
      'name': publicationName,
      'url': window.location.origin,
      'logo': `${window.location.origin}/favicon.svg`,
      'description': settings.tagline,
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': settings.office_address,
        'addressCountry': 'IN',
      },
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': settings.contact_phone,
        'contactType': 'customer support',
        'email': settings.contact_email,
      },
    };

    script.textContent = JSON.stringify(jsonLd);
  }, [fullTitle, metaDescription, currentUrl, shareImage, articleType, publishedTime, modifiedTime, authorName, articleCategory, language, publicationName, settings]);

  return null;
};
