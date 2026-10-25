import { describe, it, expect } from 'vitest';
import { formatNewsDate } from '@/lib/date';

describe('Date & Time Formatting Unit Tests (Asia/Kolkata)', () => {
  it('formats Marathi date correctly', () => {
    const dateStr = '2026-02-21T06:30:00Z';
    const formatted = formatNewsDate(dateStr, 'mr', { format: 'short' });
    expect(formatted).toContain('21');
    expect(formatted).toContain('फेब्रुवारी');
    expect(formatted).toContain('2026');
  });

  it('formats Hindi date correctly', () => {
    const dateStr = '2026-02-21T06:30:00Z';
    const formatted = formatNewsDate(dateStr, 'hi', { format: 'short' });
    expect(formatted).toContain('21');
    expect(formatted).toContain('फ़रवरी');
    expect(formatted).toContain('2026');
  });

  it('formats English date correctly with Asia/Kolkata context', () => {
    const dateStr = '2026-02-21T06:30:00Z';
    const formatted = formatNewsDate(dateStr, 'en', { format: 'short' });
    expect(formatted).toContain('21');
    expect(formatted).toContain('February');
    expect(formatted).toContain('2026');
  });

  it('handles invalid or empty dates gracefully', () => {
    expect(formatNewsDate(null, 'mr')).toBe('');
    expect(formatNewsDate('', 'mr')).toBe('');
    expect(formatNewsDate('invalid-date', 'mr')).toBe('');
  });
});
