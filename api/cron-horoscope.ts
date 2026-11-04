import type { IncomingMessage, ServerResponse } from 'http';
import { syncDailyHoroscope } from '../scripts/sync-daily-horoscope.mjs';

/**
 * Vercel Serverless / Cloud Cron Handler: /api/cron-horoscope
 * 
 * Scheduled to run automatically every 24 hours via vercel.json crons.
 * Can also be triggered via HTTP GET / POST from external webhooks or local dev server.
 */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Allow GET and POST for healthcheck / webhook triggers
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  // Optional: Verify Vercel Cron Secret if configured in production
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = req.headers['authorization'];
    if (authHeader !== `Bearer ${cronSecret}`) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Unauthorized: Invalid CRON_SECRET' }));
      return;
    }
  }

  try {
    const result = await syncDailyHoroscope({ verbose: false });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: true,
        message: 'Daily horoscope synchronized successfully',
        date: result.date,
        count: result.count,
        durationMs: result.durationMs,
        supabaseSynced: result.supabaseSynced,
        supabaseMessage: result.supabaseMessage,
        timestamp: new Date().toISOString(),
      })
    );
  } catch (err: any) {
    console.error('[API Cron Horoscope Error]:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: false,
        error: 'Failed to synchronize horoscope',
        details: err?.message || String(err),
      })
    );
  }
}

