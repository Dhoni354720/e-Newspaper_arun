/**
 * Dainik Jagat Sameeksha (दैनिक जगत समीक्षा)
 * Internal 24-Hour Horoscope Scheduler Service
 * 
 * Runs as a lightweight standalone Node.js background worker / daemon.
 * Automatically runs once every 24 hours at the target hour (default 00:05 AM IST / midnight)
 * and keeps the daily horoscope fresh without requiring third-party cron services.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { syncDailyHoroscope, getTodayDateString } from './sync-daily-horoscope.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let timerId = null;
let isRunning = false;

// Configurable target hour and minute in IST (UTC+5:30)
const TARGET_HOUR_IST = parseInt(process.env.HOROSCOPE_SYNC_HOUR_IST || '0', 10); // 0 = Midnight
const TARGET_MINUTE_IST = parseInt(process.env.HOROSCOPE_SYNC_MINUTE_IST || '5', 10); // 5 minutes past hour

/**
 * Calculates milliseconds until next target time in Asia/Kolkata
 */
function getMsUntilNextScheduledRun() {
  const now = new Date();
  
  // Calculate current time in IST
  const istFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });
  
  const parts = istFormatter.formatToParts(now);
  const istVals = {};
  for (const p of parts) {
    if (p.type !== 'literal') istVals[p.type] = parseInt(p.value, 10);
  }

  // Determine current IST Date components
  const istHour = istVals.hour % 24;
  const istMin = istVals.minute;
  const istSec = istVals.second;

  const currentSecondsInDay = istHour * 3600 + istMin * 60 + istSec;
  const targetSecondsInDay = TARGET_HOUR_IST * 3600 + TARGET_MINUTE_IST * 60;

  let secondsUntilTarget = targetSecondsInDay - currentSecondsInDay;
  if (secondsUntilTarget <= 0) {
    // Already passed today, schedule for next day (24 hours ahead)
    secondsUntilTarget += 24 * 3600;
  }

  return secondsUntilTarget * 1000;
}

/**
 * Checks if the existing payload in public/data/daily-horoscope.json is outdated
 */
function isPayloadOutdated() {
  const jsonPath = path.join(rootDir, 'public', 'data', 'daily-horoscope.json');
  if (!fs.existsSync(jsonPath)) return true;

  try {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const today = getTodayDateString();
    return data.date !== today || !Array.isArray(data.items) || data.items.length < 12;
  } catch {
    return true;
  }
}

/**
 * Executes a sync cycle and schedules the next one
 */
async function executeSyncCycle() {
  if (isRunning) return;
  isRunning = true;

  console.log(`\n[Scheduler] ⏰ Triggering scheduled horoscope sync at ${new Date().toISOString()}...`);
  try {
    await syncDailyHoroscope({ verbose: true });
  } catch (err) {
    console.error('[Scheduler] ❌ Scheduled sync error:', err);
  } finally {
    isRunning = false;
    scheduleNext();
  }
}

/**
 * Schedules next run
 */
function scheduleNext() {
  const msUntilNext = getMsUntilNextScheduledRun();
  const hoursUntil = (msUntilNext / (1000 * 3600)).toFixed(2);
  const nextDate = new Date(Date.now() + msUntilNext);

  console.log(`[Scheduler] 💤 Next automated 24-hour sync scheduled in ${hoursUntil} hours (at ${nextDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST).`);

  if (timerId) clearTimeout(timerId);
  timerId = setTimeout(() => {
    executeSyncCycle();
  }, msUntilNext);
}

/**
 * Starts the scheduler daemon
 */
async function startScheduler() {
  console.log(`===============================================================`);
  console.log(`🪐 DAINIK JAGAT SAMEEKSHA - 24-HOUR HOROSCOPE SCHEDULER`);
  console.log(`🕒 Schedule Target: Daily at ${String(TARGET_HOUR_IST).padStart(2, '0')}:${String(TARGET_MINUTE_IST).padStart(2, '0')} AM IST`);
  console.log(`===============================================================`);

  // If today's payload is missing or outdated, run immediately
  if (isPayloadOutdated()) {
    console.log(`[Scheduler] 📌 Daily payload is missing or outdated for today. Running initial sync...`);
    await executeSyncCycle();
  } else {
    console.log(`[Scheduler] ✅ Daily payload is already up-to-date for today.`);
    scheduleNext();
  }
}

// Handle termination signals
process.on('SIGINT', () => {
  console.log('\n[Scheduler] Received SIGINT. Shutting down gracefully...');
  if (timerId) clearTimeout(timerId);
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n[Scheduler] Received SIGTERM. Shutting down gracefully...');
  if (timerId) clearTimeout(timerId);
  process.exit(0);
});

// Run if called directly
const isMain = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isMain) {
  startScheduler();
}

export { startScheduler, getMsUntilNextScheduledRun };
