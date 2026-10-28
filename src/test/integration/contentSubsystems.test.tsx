import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { repository } from '@/lib/repository';
import { PhotoGalleryPage } from '@/pages/PhotoGalleryPage';
import { VideoHubPage } from '@/pages/VideoHubPage';
import { FlashNewsPage } from '@/pages/FlashNewsPage';
import { RashifalPage } from '@/pages/RashifalPage';
import { DynamicPage } from '@/pages/DynamicPage';
import { SupplementDetailPage } from '@/pages/SupplementDetailPage';
import { WeatherWidget } from '@/components/common/WeatherWidget';

const TestWrapper: React.FC<{ initialEntries?: string[]; children: React.ReactNode }> = ({
  initialEntries = ['/'],
  children,
}) => (
  <MemoryRouter initialEntries={initialEntries}>
    <LanguageProvider>
      <AuthProvider>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </AuthProvider>
    </LanguageProvider>
  </MemoryRouter>
);

describe('Phase 2 Content Types and Subsystems Integration', () => {
  it('loads photo galleries and gallery detail with images and photographer credits', async () => {
    const galleries = await repository.getGalleries();
    expect(galleries.length).toBeGreaterThan(0);

    const firstGallery = galleries[0];
    expect(firstGallery.slug).toBeDefined();

    const detailed = await repository.getGalleryBySlug(firstGallery.slug);
    expect(detailed).not.toBeNull();
    expect(detailed?.images?.length).toBeGreaterThan(0);
    expect(detailed?.credit).toBeDefined();

    render(
      <TestWrapper initialEntries={['/photos']}>
        <Routes>
          <Route path="/photos" element={<PhotoGalleryPage />} />
        </Routes>
      </TestWrapper>
    );

    await waitFor(() => {
      const heading = screen.getAllByText(/फोटो गैलरी|गॅलरी|Gallery/i);
      expect(heading.length).toBeGreaterThan(0);
    }, { timeout: 10000 });
  }, 15000);

  it('loads video hub with privacy-conscious embeds and metadata', async () => {
    const videos = await repository.getVideos();
    expect(videos.length).toBeGreaterThan(0);

    const firstVideo = videos[0];
    expect(firstVideo.video_id_or_url).toBeDefined();
    expect(firstVideo.slug).toBeDefined();

    render(
      <TestWrapper initialEntries={['/videos']}>
        <Routes>
          <Route path="/videos" element={<VideoHubPage />} />
        </Routes>
      </TestWrapper>
    );

    await waitFor(() => {
      const videoElements = screen.getAllByText(/वीडियो हब|व्हिडिओ|Video/i);
      expect(videoElements.length).toBeGreaterThan(0);
    }, { timeout: 10000 });
  }, 15000);

  it('loads flash news (फटाफट खबरें) and supports adding new briefs', async () => {
    const initialBriefs = await repository.getBriefs();
    expect(initialBriefs.length).toBeGreaterThan(0);

    const testBrief = await repository.saveBrief({
      language: 'hi',
      content: 'परीक्षण फटाफट समाचार: मुंबई मेट्रो लाइन ३ चे नवीन वेळापत्रक जारी',
      is_published: true,
    });

    expect(testBrief.id).toBeDefined();
    expect(testBrief.content).toContain('परीक्षण फटाफट समाचार');

    const updatedBriefs = await repository.getBriefs();
    expect(updatedBriefs.some(b => b.id === testBrief.id)).toBe(true);

    render(
      <TestWrapper initialEntries={['/flash']}>
        <Routes>
          <Route path="/flash" element={<FlashNewsPage />} />
        </Routes>
      </TestWrapper>
    );

    await waitFor(() => {
      const flashItems = screen.getAllByText(/फटाफट खबरें|बातम्या|Flash/i);
      expect(flashItems.length).toBeGreaterThan(0);
    }, { timeout: 10000 });
  }, 15000);

  it('loads daily rashifal for all 12 signs with lucky numbers and colors', async () => {
    const horoscopes = await repository.getHoroscopes('daily');
    expect(horoscopes.length).toBe(12);

    const aries = horoscopes.find(h => h.sign === 'aries');
    expect(aries).toBeDefined();
    expect(aries?.lucky_number).toBeDefined();
    expect(aries?.lucky_color).toBeDefined();

    render(
      <TestWrapper initialEntries={['/rashifal']}>
        <Routes>
          <Route path="/rashifal" element={<RashifalPage />} />
        </Routes>
      </TestWrapper>
    );

    await waitFor(() => {
      const meshSign = screen.getAllByText(/मेष|Aries/i);
      expect(meshSign.length).toBeGreaterThan(0);
    }, { timeout: 10000 });
  }, 15000);

  it('handles citizen journalism news tips with honeypot rejection and legitimate submission', async () => {
    // 1. Honeypot bot rejection test
    const botResult = await repository.submitNewsTip({
      sender_name: 'Spam Bot',
      sender_phone: '9876543210',
      sender_city: 'Mumbai',
      message: 'Should fail immediately',
      honeypot: 'bot_filled_value',
    });
    expect(botResult.success).toBe(false);
    expect(botResult.error).toBeDefined();

    // 2. Legitimate citizen submission test
    const cleanTip = await repository.submitNewsTip({
      sender_name: 'रमेश पवार',
      sender_phone: '+91 9820098200',
      sender_city: 'मुंबई',
      message: 'गेल्या आठवड्यापासून खड्ड्यांमुळे वाहतूक कोंडी होत आहे.',
      actionKey: 'tip_legitimate_test',
    });

    expect(cleanTip.success).toBe(true);
    expect(cleanTip.id).toBeDefined();

    // 3. Admin can query and update tip status
    const allTips = await repository.getNewsTips();
    expect(allTips.some(t => t.id === cleanTip.id)).toBe(true);

    await repository.updateNewsTipStatus(cleanTip.id!, 'reviewed');
    const updatedTips = await repository.getNewsTips();
    const found = updatedTips.find(t => t.id === cleanTip.id);
    expect(found?.status).toBe('reviewed');
  }, 15000);

  it('loads statutory Grievance Officer compliance page according to IT Rules 2021', async () => {
    const grievancePage = await repository.getPage('grievance');
    expect(grievancePage).not.toBeNull();
    expect(grievancePage?.title_hi).toContain('शिकायत निवारण');
    expect(grievancePage?.body_hi).toContain('अरुण रमाकांत तिवारी');
    expect(grievancePage?.body_hi).toContain('MAHHIN/2014/57312');
    expect(grievancePage?.body_hi).toContain('jagatsameeksha2014@gmail.com');

    render(
      <TestWrapper initialEntries={['/page/grievance']}>
        <Routes>
          <Route path="/page/:slug" element={<DynamicPage />} />
        </Routes>
      </TestWrapper>
    );

    await waitFor(() => {
      const officerName = screen.getAllByText(/अरुण रमाकांत तिवारी/i);
      expect(officerName.length).toBeGreaterThan(0);
    }, { timeout: 10000 });
  }, 15000);

  it('fetches live weather data for supported cities with fallback cache', async () => {
    const weather = await repository.fetchCityWeather('mumbai');
    expect(weather).not.toBeNull();
    expect(weather.cityKey).toBe('mumbai');
    expect(typeof weather.temperature).toBe('number');
    expect(weather.condition_hi).toBeDefined();

    render(
      <TestWrapper>
        <WeatherWidget />
      </TestWrapper>
    );

    await waitFor(() => {
      const weatherText = screen.getAllByText(/मौसम|तापमान|Weather/i);
      expect(weatherText.length).toBeGreaterThan(0);
    }, { timeout: 10000 });
  }, 15000);

  it('loads thematic supplements with issue date and PDF link', async () => {
    const supplements = await repository.getSupplements();
    expect(supplements.length).toBeGreaterThan(0);

    const firstSupplement = supplements[0];
    expect(firstSupplement.slug).toBeDefined();
    expect(firstSupplement.pdf_url).toBeDefined();

    const detail = await repository.getSupplementBySlug(firstSupplement.slug);
    expect(detail).not.toBeNull();
    expect(detail?.title_hi).toBeDefined();

    render(
      <TestWrapper initialEntries={[`/supplement/${firstSupplement.slug}`]}>
        <Routes>
          <Route path="/supplement/:slug" element={<SupplementDetailPage />} />
        </Routes>
      </TestWrapper>
    );

    await waitFor(() => {
      const downloadButtons = screen.getAllByText(/डाउनलोड|PDF/i);
      expect(downloadButtons.length).toBeGreaterThan(0);
    }, { timeout: 10000 });
  }, 15000);
});
