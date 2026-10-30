import dns from 'dns/promises';
import { URL } from 'url';

const DISALLOWED_HOSTNAMES = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '169.254.169.254', // AWS/cloud metadata service
  'metadata.google.internal', // GCP metadata
]);

/**
 * Checks if an IPv4 address belongs to private or link-local ranges.
 */
function isPrivateIp(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(isNaN)) return true;

  // 10.0.0.0/8
  if (parts[0] === 10) return true;
  // 127.0.0.0/8 (loopback)
  if (parts[0] === 127) return true;
  // 172.16.0.0/12
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  // 192.168.0.0/16
  if (parts[0] === 192 && parts[1] === 168) return true;
  // 169.254.0.0/16 (link-local)
  if (parts[0] === 169 && parts[1] === 254) return true;
  // 0.0.0.0/8
  if (parts[0] === 0) return true;

  return false;
}

/**
 * SSRF-Safe Fetch:
 * Validates target URL against private IP addresses and cloud metadata services.
 * Enforces timeout and maximum payload limits.
 */
export async function safeOutboundFetch(
  targetUrl: string,
  options: { timeoutMs?: number; maxBytes?: number; allowedHosts?: string[] } = {}
): Promise<Response> {
  const timeoutMs = options.timeoutMs || 5000;
  const maxBytes = options.maxBytes || 5 * 1024 * 1024; // 5MB

  let parsed: URL;
  try {
    parsed = new URL(targetUrl);
  } catch {
    throw new Error('Invalid URL format');
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Only HTTP and HTTPS protocols are allowed');
  }

  const hostname = parsed.hostname.toLowerCase();

  if (DISALLOWED_HOSTNAMES.has(hostname)) {
    throw new Error(`SSRF Block: Hostname '${hostname}' is restricted.`);
  }

  if (options.allowedHosts && !options.allowedHosts.includes(hostname)) {
    throw new Error(`SSRF Block: Hostname '${hostname}' is not in the allowed host list.`);
  }

  // Resolve hostname and verify resolved IPs are not in private ranges
  try {
    const lookupResults = await dns.lookup(hostname, { all: true });
    for (const record of lookupResults) {
      if (isPrivateIp(record.address)) {
        throw new Error(`SSRF Block: Resolved IP '${record.address}' belongs to private/restricted network.`);
      }
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.message.startsWith('SSRF Block')) {
      throw err;
    }
    // DNS resolution failure or network error
    throw new Error(`DNS resolution failed for host '${hostname}'`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(parsed.toString(), {
      signal: controller.signal,
      redirect: 'error', // Disable automatic redirect following to prevent redirect-based SSRF bypasses
    });

    // Content length verification
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > maxBytes) {
      throw new Error(`Response size exceeds limit of ${maxBytes} bytes`);
    }

    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}
