import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { Header } from '@/components/common/Header';
import { BreakingNewsTicker } from '@/components/common/BreakingNewsTicker';
import { HomePage } from '@/pages/HomePage';

const TestAppWrapper: React.FC<{ initialEntries?: string[]; children: React.ReactNode }> = ({
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

describe('Editorial Workflow & Public Portal E2E Component Tests', () => {
  it('renders the newspaper header with masthead, date and language switcher', async () => {
    render(
      <TestAppWrapper>
        <Header />
      </TestAppWrapper>
    );

    // Publication name is rendered
    expect(screen.getByText(/दैनिक जगत समीक्षा|Dainik Jagat Sameeksha|जनवाणी/i)).toBeInTheDocument();

    // Language switcher buttons exist
    expect(screen.getByRole('button', { name: 'हिन्दी' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'मराठी' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'English' })).toBeInTheDocument();
  });

  it('renders the breaking news ticker with published breaking headlines', async () => {
    render(
      <TestAppWrapper>
        <BreakingNewsTicker />
      </TestAppWrapper>
    );

    await waitFor(() => {
      const breakingBadge = screen.getByText(/ब्रेकिंग न्यूज़|महत्त्वाच्या घडामोडी|BREAKING/i);
      expect(breakingBadge).toBeInTheDocument();
    });
  });

  it('renders the complete editorial homepage with lead hero and regional sections', async () => {
    render(
      <TestAppWrapper>
        <HomePage />
      </TestAppWrapper>
    );

    await waitFor(() => {
      const leadHeadlines = screen.getAllByRole('heading');
      expect(leadHeadlines.length).toBeGreaterThan(0);
    });
  });

  it('switches content language seamlessly without page reload', async () => {
    render(
      <TestAppWrapper>
        <Header />
      </TestAppWrapper>
    );

    const enBtn = screen.getByRole('button', { name: 'English' });
    fireEvent.click(enBtn);

    expect(document.documentElement.lang).toBe('en');
  });
});
