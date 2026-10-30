import crypto from 'crypto';

/**
 * Anonymously hash client IP with a server-side salt before storing in database.
 * Preserves privacy (India DPDP Act compliance) while allowing anti-abuse grouping.
 * Never stores raw IP addresses.
 */
export function hashClientIp(ip: string | undefined | null): string {
  if (!ip || ip === 'unknown') {
    return '0000000000000000000000000000000000000000000000000000000000000000';
  }

  const salt = (typeof process !== 'undefined' && process.env ? process.env.IP_HASH_SALT : undefined) || 'fallback-dev-salt-replace-in-production-env';
  return crypto.createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}
