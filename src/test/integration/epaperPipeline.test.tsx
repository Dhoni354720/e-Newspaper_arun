import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { repository } from '@/lib/repository';
import { EpaperPage } from '@/pages/EpaperPage';
import { EpaperClipper } from '@/components/epaper/EpaperClipper';
import { AdminEpaperPage } from '@/pages/admin/AdminEpaperPage';

const TestWrapper: React.FC<{ initialEntries?: string[]; children: React.ReactNode }> = ({
  initialEntries = ['/epaper'],
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

describe('Phase 3 Digital E-Paper Pipeline & Interactive Clipping Integration', () => {
  it('loads real Dainik Jagat Sameeksha 26 August 2026 broadsheet edition with 4 pages', async () => {
    const res = await repository.getEpaperEditions();
    expect(res.editions.length).toBeGreaterThan(0);

    const edition = res.editions.find(e => e.edition_date === '2026-08-26');
    expect(edition).toBeDefined();
    expect(edition?.title).toContain('दैनिक जगत समीक्षा');
    expect(edition?.total_pages).toBe(4);
    expect(edition?.pdf_url).toContain('DAINIK_JAGAT_SAMEEKSHA_26_AUGUST_2026.pdf');

    // Verify all 4 broadsheet pages
    expect(edition?.pages?.length).toBe(4);
    const p1 = edition?.pages?.find(p => p.page_number === 1);
    const p4 = edition?.pages?.find(p => p.page_number === 4);
    expect(p1?.image_url).toContain('page-1.jpg');
    expect(p4?.image_url).toContain('page-4.jpg');
    expect(p1?.zoom_image_url).toContain('page-1-zoom.jpg');
  });

  it('filters editions by date and region (Mumbai / Maharashtra)', async () => {
    const mumbaiEd = await repository.getEpaperEditionByDate('2026-08-26', 'mumbai');
    expect(mumbaiEd).not.toBeNull();
    expect(mumbaiEd?.edition_region).toBe('mumbai');

    const stateEd = await repository.getEpaperEditionByDate('2026-08-26', 'maharashtra');
    expect(stateEd).not.toBeNull();
    expect(stateEd?.edition_region).toBe('maharashtra');
  });

  it('renders EpaperPage reader with page navigation and clipping tools', async () => {
    render(
      <TestWrapper initialEntries={['/epaper?date=2026-08-26&region=mumbai']}>
        <Routes>
          <Route path="/epaper" element={<EpaperPage />} />
          <Route path="/epaper/:editionId" element={<EpaperPage />} />
          <Route path="/epaper/:editionId/page/:pageNumber" element={<EpaperPage />} />
        </Routes>
      </TestWrapper>
    );

    await waitFor(() => {
      const editionHeadings = screen.getAllByText(/दैनिक जगत समीक्षा/i);
      expect(editionHeadings.length).toBeGreaterThan(0);
    }, { timeout: 10000 });

    // Verify presence of clipping buttons and page controls
    const clipButtons = screen.getAllByText(/कतरन काढा|Clip/i);
    expect(clipButtons.length).toBeGreaterThan(0);

    const downloadButtons = screen.getAllByText(/PDF.*डाउनलोड|Download/i);
    expect(downloadButtons.length).toBeGreaterThan(0);
  });

  it('supports direct parameterized routing for edition and page number', async () => {
    render(
      <TestWrapper initialEntries={['/epaper/ep-djs-20260826/page/3']}>
        <Routes>
          <Route path="/epaper/:editionId/page/:pageNumber" element={<EpaperPage />} />
        </Routes>
      </TestWrapper>
    );

    await waitFor(() => {
      // Should show Page 3 / 4 in viewer
      const pageInfo = screen.getAllByText(/3 \/ 4|पृष्ठ 3/i);
      expect(pageInfo.length).toBeGreaterThan(0);
    }, { timeout: 10000 });
  });

  it('renders interactive EpaperClipper tool and allows clipping flow', async () => {
    let closed = false;
    render(
      <TestWrapper>
        <EpaperClipper
          pageImageUrl="/epaper/2026-08-26/page-1.jpg"
          zoomImageUrl="/epaper/2026-08-26/page-1-zoom.jpg"
          pageNumber={1}
          editionTitle="दैनिक जगत समीक्षा"
          editionDate="26 अगस्त 2026"
          editionRegion="मुंबई"
          onClose={() => { closed = true; }}
        />
      </TestWrapper>
    );

    // Verify clipper header
    expect(screen.getByText(/वृत्त कतरन साधन/i)).toBeDefined();

    // Verify close action
    const closeBtn = screen.getByLabelText(/Close Clipper/i);
    fireEvent.click(closeBtn);
    expect(closed).toBe(true);
  });

  it('tracks view and download counts and supports saving article clips', async () => {
    const res = await repository.getEpaperEditions();
    const ed = res.editions[0];

    const initialViews = ed.views_count || 0;
    await repository.incrementEpaperViews(ed.id);

    const updated = await repository.getEpaperEditionById(ed.id);
    expect(updated?.views_count).toBeGreaterThanOrEqual(initialViews + 1);

    // Save clip
    const clip = await repository.saveEpaperClip({
      edition_id: ed.id,
      page_number: 1,
      title: 'मुंबई महानगर विकास विशेष वृत्त',
      clip_url: 'data:image/png;base64,sample-clip-data',
    });

    expect(clip.id).toBeDefined();
    expect(clip.share_count).toBe(1);
  });

  it('allows admin to manage epaper editions in AdminEpaperPage', async () => {
    render(
      <TestWrapper initialEntries={['/admin/epaper']}>
        <Routes>
          <Route path="/admin/epaper" element={<AdminEpaperPage />} />
        </Routes>
      </TestWrapper>
    );

    await waitFor(() => {
      const adminHeading = screen.getAllByText(/ई-वृत्तपत्र आवृत्त्या व्यवस्थापन|ई-वृत्तपत्र/i);
      expect(adminHeading.length).toBeGreaterThan(0);
    }, { timeout: 10000 });
  });
});
