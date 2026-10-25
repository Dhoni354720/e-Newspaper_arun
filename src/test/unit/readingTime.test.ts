import { describe, it, expect } from 'vitest';
import { calculateReadingTime } from '@/lib/readingTime';

describe('Reading Time Calculation Unit Tests', () => {
  it('calculates minimum 1 minute for short articles', () => {
    const text = '<p>लहान बातमी मथळा आणि माहिती.</p>';
    expect(calculateReadingTime(text)).toBe(1);
  });

  it('strips HTML tags and calculates realistic reading duration for longer editorial', () => {
    // Generate ~350 words in Devanagari
    const longText = Array(70).fill('<p>महाराष्ट्रातील विकासकामे आणि शेती क्षेत्रातील आधुनिक तंत्रज्ञान.</p>').join('\n');
    const minutes = calculateReadingTime(longText, true);
    expect(minutes).toBeGreaterThanOrEqual(2);
  });
});
