import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  syncDailyHoroscope,
  ZODIAC_SIGNS,
  getDailyLuckySeed,
  getTodayDateString,
} from '../../../scripts/sync-daily-horoscope.mjs';
import { getMsUntilNextScheduledRun } from '../../../scripts/scheduler.mjs';
import cronHandler from '../../../api/cron-horoscope';

describe('Daily Horoscope Automation & Sync Pipeline', () => {
  const jsonPath = path.resolve(process.cwd(), 'public/data/daily-horoscope.json');

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('defines all 12 zodiac signs accurately', () => {
    expect(ZODIAC_SIGNS).toHaveLength(12);
    const signNames = ZODIAC_SIGNS.map((z: any) => z.sign);
    expect(signNames).toContain('aries');
    expect(signNames).toContain('taurus');
    expect(signNames).toContain('gemini');
    expect(signNames).toContain('cancer');
    expect(signNames).toContain('leo');
    expect(signNames).toContain('virgo');
    expect(signNames).toContain('libra');
    expect(signNames).toContain('scorpio');
    expect(signNames).toContain('sagittarius');
    expect(signNames).toContain('capricorn');
    expect(signNames).toContain('aquarius');
    expect(signNames).toContain('pisces');
  });

  it('generates deterministic lucky numbers between 1 and 9 and valid colors', () => {
    const today = getTodayDateString();
    for (const sign of ZODIAC_SIGNS) {
      const seed = getDailyLuckySeed(sign.sign, today);
      expect(seed.luckyNumber).toBeGreaterThanOrEqual(1);
      expect(seed.luckyNumber).toBeLessThanOrEqual(9);
      expect(seed.luckyColor).toBeTypeOf('string');
      expect(seed.luckyColor.length).toBeGreaterThan(0);
    }
  });

  it('executes syncDailyHoroscope and writes valid JSON for all 12 signs to public/data/daily-horoscope.json', async () => {
    const result = await syncDailyHoroscope({ verbose: false });

    expect(result.success).toBe(true);
    expect(result.count).toBe(12);
    expect(result.items).toHaveLength(12);

    expect(fs.existsSync(jsonPath)).toBe(true);
    const content = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    expect(content.count).toBe(12);
    expect(content.period).toBe('daily');
    expect(content.date).toBe(result.date);
    expect(content.items).toHaveLength(12);

    const aries = content.items.find((i: any) => i.sign === 'aries');
    expect(aries).toBeDefined();
    expect(aries.content_hi).toBeTypeOf('string');
    expect(aries.content_mr).toBeTypeOf('string');
    expect(aries.content_en).toBeTypeOf('string');
    expect(aries.lucky_number).toBeGreaterThanOrEqual(1);
    expect(aries.lucky_color).toBeTypeOf('string');
    expect(aries.author_credit).toContain('ज्योतिष');
  }, 15000);

  it('calculates scheduler wait time between 0 and 24 hours', () => {
    const msUntilNext = getMsUntilNextScheduledRun();
    expect(msUntilNext).toBeGreaterThan(0);
    expect(msUntilNext).toBeLessThanOrEqual(24 * 60 * 60 * 1000);
  });

  it('handles /api/cron-horoscope request successfully and responds with JSON report', async () => {
    const req: any = {
      method: 'GET',
      headers: {},
    };

    let statusCode = 0;
    let responseData = '';
    const res: any = {
      statusCode: 200,
      setHeader: vi.fn(),
      end: vi.fn((data: string) => {
        responseData = data;
      }),
    };

    Object.defineProperty(res, 'statusCode', {
      set: (val: number) => {
        statusCode = val;
      },
      get: () => statusCode,
    });

    await cronHandler(req, res);

    expect(statusCode).toBe(200);
    const parsed = JSON.parse(responseData);
    expect(parsed.success).toBe(true);
    expect(parsed.count).toBe(12);
    expect(parsed.message).toContain('synchronized');
  }, 15000);

  it('enforces CRON_SECRET authorization when configured on /api/cron-horoscope', async () => {
    process.env.CRON_SECRET = 'super-secret-token-123';

    try {
      // 1. Without auth header -> 401
      const unauthReq: any = {
        method: 'POST',
        headers: {},
      };
      let unauthCode = 0;
      let unauthData = '';
      const unauthRes: any = {
        statusCode: 200,
        setHeader: vi.fn(),
        end: vi.fn((data: string) => {
          unauthData = data;
        }),
      };
      Object.defineProperty(unauthRes, 'statusCode', {
        set: (val: number) => {
          unauthCode = val;
        },
        get: () => unauthCode,
      });

      await cronHandler(unauthReq, unauthRes);
      expect(unauthCode).toBe(401);
      expect(JSON.parse(unauthData).error).toContain('Unauthorized');

      // 2. With valid Bearer token -> 200
      const authReq: any = {
        method: 'POST',
        headers: {
          authorization: 'Bearer super-secret-token-123',
        },
      };
      let authCode = 0;
      let authData = '';
      const authRes: any = {
        statusCode: 200,
        setHeader: vi.fn(),
        end: vi.fn((data: string) => {
          authData = data;
        }),
      };
      Object.defineProperty(authRes, 'statusCode', {
        set: (val: number) => {
          authCode = val;
        },
        get: () => authCode,
      });

      await cronHandler(authReq, authRes);
      expect(authCode).toBe(200);
      expect(JSON.parse(authData).success).toBe(true);
    } finally {
      delete process.env.CRON_SECRET;
    }
  }, 15000);
});

