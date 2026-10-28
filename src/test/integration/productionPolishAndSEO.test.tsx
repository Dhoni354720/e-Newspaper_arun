import React from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fs from 'fs';
import path from 'path';
import { LanguageProvider } from '@/context/LanguageContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { AuthProvider } from '@/context/AuthContext';
import { SEOHead } from '@/components/common/SEOHead';
import { NotFoundPage } from '@/pages/StaticPages';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LanguageProvider>
    <AuthProvider>
      <SettingsProvider>
        <MemoryRouter>
          {children}
        </MemoryRouter>
      </SettingsProvider>
    </AuthProvider>
  </LanguageProvider>
);

describe('Production Polish, SEO, Feeds, and 404 Integration Tests', () => {
  afterEach(() => {
    cleanup();
  });

  // 1. DYNAMIC SEO & STRUCTURED DATA
  it('updates document.title, OpenGraph, and injects Schema.org JSON-LD structured data', () => {
    render(
      <TestWrapper>
        <SEOHead
          title="ताज़ा संपादकीय विचार"
          description="दैनिक जगत समीक्षा मुख्य संपादकीय आलेख"
          canonicalUrl="https://dainikjagatsameeksha.com/article/editorial-lead-2026"
          authorName="अरुण रमाकांत तिवारी (मुख्य संपादक)"
          articleType="article"
        />
      </TestWrapper>
    );

    expect(document.title).toContain('ताज़ा संपादकीय विचार');
    expect(document.title).toContain('दैनिक जगत समीक्षा');

    // Check OpenGraph meta
    const ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle?.getAttribute('content')).toContain('ताज़ा संपादकीय विचार');

    const ogSiteName = document.querySelector('meta[property="og:site_name"]');
    expect(ogSiteName?.getAttribute('content')).toBe('दैनिक जगत समीक्षा');

    // Check JSON-LD
    const script = document.getElementById('news-structured-data');
    expect(script).not.toBeNull();
    const jsonLd = JSON.parse(script?.textContent || '{}');
    expect(jsonLd['@type']).toBe('NewsArticle');
    expect(jsonLd.headline).toBe('ताज़ा संपादकीय विचार');
    expect(jsonLd.author[0].name).toContain('अरुण रमाकांत तिवारी');
    expect(jsonLd.publisher.name).toBe('दैनिक जगत समीक्षा');
  });

  // 2. SITEMAP.XML GENERATION & VALIDITY
  it('verifies that public/sitemap.xml exists and contains valid XML with essential routes', () => {
    const sitemapPath = path.resolve(__dirname, '../../../public/sitemap.xml');
    expect(fs.existsSync(sitemapPath)).toBe(true);

    const content = fs.readFileSync(sitemapPath, 'utf-8');
    expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(content).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(content).toContain('<loc>https://dainikjagatsameeksha.com/</loc>');
    expect(content).toContain('<loc>https://dainikjagatsameeksha.com/epaper</loc>');
    expect(content).toContain('<loc>https://dainikjagatsameeksha.com/category/mumbai</loc>');
    expect(content).toContain('<loc>https://dainikjagatsameeksha.com/top-news</loc>');
    expect(content).toContain('<priority>1.0</priority>');
  });

  // 3. GOOGLE NEWS SITEMAP
  it('verifies that public/news-sitemap.xml complies with Google News sitemap specifications', () => {
    const newsSitemapPath = path.resolve(__dirname, '../../../public/news-sitemap.xml');
    expect(fs.existsSync(newsSitemapPath)).toBe(true);

    const content = fs.readFileSync(newsSitemapPath, 'utf-8');
    expect(content).toContain('xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"');
    expect(content).toContain('<news:name>दैनिक जगत समीक्षा</news:name>');
    expect(content).toContain('<news:publication_date>');
    expect(content).toContain('<news:title>');
  });

  // 4. RSS 2.0 FEED SPECIFICATION
  it('verifies that public/rss.xml contains valid RSS 2.0 with editorial creator and headlines', () => {
    const rssPath = path.resolve(__dirname, '../../../public/rss.xml');
    expect(fs.existsSync(rssPath)).toBe(true);

    const content = fs.readFileSync(rssPath, 'utf-8');
    expect(content).toContain('<rss version="2.0"');
    expect(content).toContain('<title>दैनिक जगत समीक्षा (Dainik Jagat Sameeksha)</title>');
    expect(content).toContain('<managingEditor>jagatsameeksha2014@gmail.com');
    expect(content).toContain('<dc:creator>अरुण रमाकांत तिवारी (Chief Editor)</dc:creator>');
    expect(content).toContain('<item>');
    expect(content).toContain('<guid isPermaLink="true">');
  });

  // 5. 404 NOT FOUND PAGE
  it('renders customized 404 page with localized numerals and discoverability links', () => {
    render(
      <TestWrapper>
        <NotFoundPage />
      </TestWrapper>
    );

    // Devanagari numerals for 404 in Hindi/Marathi
    expect(screen.getByText('४०४')).toBeInTheDocument();
    expect(screen.getByText(/पृष्ठ आढळले नाही|पृष्ठ नहीं मिला|Page Not Found/i)).toBeInTheDocument();

    // Check navigation buttons to home, epaper, flash news, and search
    expect(screen.getByRole('link', { name: /होम पेज पर वापस जाएं|मुख्य पानावर परत या|Back to Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ई-पेपर पढ़ें|ई-पेपर वाचा|Read E-Paper/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /फ़्लैश न्यूज़|फ्लॅश न्यूज|Flash News/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /समाचार खोजें|बातम्या शोधा|Search News/i })).toBeInTheDocument();
  });

  // 6. VERCEL DEPLOYMENT CONFIGURATION & SECURITY HEADERS
  it('verifies that vercel.json contains required security and caching headers', () => {
    const vercelConfigPath = path.resolve(__dirname, '../../../vercel.json');
    expect(fs.existsSync(vercelConfigPath)).toBe(true);

    const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'));
    expect(config.rewrites).toBeDefined();
    expect(config.rewrites[0].destination).toBe('/index.html');

    // Check CSP and Security Headers
    const globalHeaders = config.headers.find((h: { source: string }) => h.source === '/(.*)');
    expect(globalHeaders).toBeDefined();

    const headersMap = new Map(globalHeaders.headers.map((h: { key: string; value: string }) => [h.key, h.value]));
    expect(headersMap.get('X-Frame-Options')).toBe('SAMEORIGIN');
    expect(headersMap.get('X-Content-Type-Options')).toBe('nosniff');
    expect(headersMap.get('Content-Security-Policy')).toContain('default-src');

    // Check E-Paper caching header
    const epaperHeader = config.headers.find((h: { source: string }) => h.source === '/epaper/(.*)');
    expect(epaperHeader).toBeDefined();
  });
});
