import React, { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';
import { safeJsonStringify } from '@/lib/sanitize';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  articleCategory?: string;
  articleType?: 'article' | 'website';
  translations?: Array<{ language: string; url: string }>;
  jsonLd?: unknown;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  publishedTime,
  modifiedTime,
  authorName,
  articleCategory,
  articleType = 'website',
  translations = [],
  jsonLd: customJsonLd,
}) => {
  const { language } = useLanguage();
  const { publicationName, settings } = useSettings();

  // 1. Unique, concise Page Title with primary keywords without duplication
  let fullTitle: string;
  if (!title) {
    fullTitle = `${publicationName} — ${settings.tagline}`;
  } else if (
    title.includes(publicationName) ||
    title.includes('दैनिक जगत समीक्षा') ||
    title.includes('Dainik Jagat Sameeksha')
  ) {
    fullTitle = title;
  } else {
    fullTitle = `${title} | ${publicationName}`;
  }

  // 2. Meta Description: Brief summary under 160 characters (Google Search snippet standard)
  const cleanDescription = (rawText?: string, maxLen = 155): string => {
    if (!rawText) return '';
    const plain = rawText
      .replace(/<[^>]*>/g, '') // strip HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (plain.length <= maxLen) return plain;
    return plain.slice(0, maxLen).trim() + '...';
  };

  const metaDescription = cleanDescription(description || settings.tagline);
  const currentUrl = canonicalUrl || window.location.href;
  const shareImage = ogImage || `${window.location.origin}/images/logo.png`;

  // Default site-wide keywords
  const siteKeywords = keywords || (
    language === 'mr'
      ? 'दैनिक जगत समीक्षा, मराठी वृत्तपत्र, ई-पेपर, ताज्या बातम्या, महाराष्ट्र, मुंबई, कल्याण, निष्पक्ष पत्रकारिता, अरुण रमाकांत तिवारी'
      : language === 'en'
      ? 'Dainik Jagat Sameeksha, national daily newspaper, latest news, e-paper, Maharashtra, Mumbai, Kalyan, Hindi news, Arun Ramakant Tiwari'
      : 'दैनिक जगत समीक्षा, Dainik Jagat Sameeksha, राष्ट्रीय हिंदी दैनिक समाचार पत्र, ई-पेपर, ताज़ा खबर, मुंबई, कल्याण, महाराष्ट्र, उत्तर प्रदेश, अरुण रमाकांत तिवारी'
  );

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
    setMeta('keywords', siteKeywords);
    setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
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
        'name': authorName || 'अरुण रमाकांत तिवारी (मुख्य संपादक)',
      }],
      'publisher': {
        '@type': 'NewsMediaOrganization',
        'name': publicationName,
        'alternateName': 'Dainik Jagat Sameeksha',
        'url': window.location.origin,
        'logo': {
          '@type': 'ImageObject',
          'url': `${window.location.origin}/images/logo.png`,
        },
      },
      'articleSection': articleCategory || 'समाचार',
      'inLanguage': language,
    } : {
      '@context': 'https://schema.org',
      '@type': 'NewsMediaOrganization',
      'name': publicationName,
      'alternateName': 'Dainik Jagat Sameeksha',
      'url': window.location.origin,
      'logo': `${window.location.origin}/images/logo.png`,
      'description': settings.tagline,
      'foundingDate': '2014',
      'identifier': {
        '@type': 'PropertyValue',
        'name': 'RNI Registration',
        'value': 'MAHHIN/2014/57312',
      },
      'address': {
        '@type': 'PostalAddress',
        'streetAddress':
          !settings.office_address ||
          settings.office_address.includes('भांडुप') ||
          settings.office_address.toLowerCase().includes('bhandup') ||
          settings.office_address.includes('400078')
            ? 'कल्याण, महाराष्ट्र 421301'
            : settings.office_address,
        'addressLocality': 'कल्याण',
        'addressRegion': 'महाराष्ट्र',
        'postalCode': '421301',
        'addressCountry': 'IN',
      },
      'contactPoint': [
        {
          '@type': 'ContactPoint',
          'telephone': settings.contact_phone || '+91-8828812282',
          'contactType': 'editorial',
          'email': settings.contact_email || 'jagatsameeksha2014@gmail.com',
        },
        {
          '@type': 'ContactPoint',
          'telephone': '+91-8828812282',
          'contactType': 'membership',
        },
        {
          '@type': 'ContactPoint',
          'telephone': '+91-8369517611',
          'contactType': 'advertising',
        }
      ],
      'founder': {
        '@type': 'Person',
        'name': 'अरुण रमाकांत तिवारी',
        'jobTitle': 'Chief Editor (मुख्य संपादक)',
      },
    };

    const finalData = customJsonLd || jsonLd;
    script.textContent = safeJsonStringify(finalData);
  }, [fullTitle, metaDescription, siteKeywords, currentUrl, shareImage, articleType, publishedTime, modifiedTime, authorName, articleCategory, language, publicationName, settings, customJsonLd]);

  return null;
};
