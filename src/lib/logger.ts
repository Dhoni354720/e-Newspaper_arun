/**
 * Redacting Logger:
 * Masks sensitive user and authentication data (passwords, tokens, emails, phone numbers)
 * in console outputs to prevent information leakage in production logs.
 */

const SENSITIVE_KEYS = new RegExp(
  '^(password|token|secret|authorization|cookie|jwt|anon_key|service_role|email|phone|access_token|refresh_token)$',
  'i'
);

function redactSensitive(data: unknown): unknown {
  if (data === null || data === undefined) return data;

  if (typeof data === 'string') {
    // Redact JWT tokens (eyJ...)
    if (/^eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/.test(data)) {
      return '[REDACTED_JWT]';
    }
    // Redact email addresses
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data)) {
      const [user, domain] = data.split('@');
      return `${user.slice(0, 2)}***@${domain}`;
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(redactSensitive);
  }

  if (typeof data === 'object') {
    const cleaned: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(data as Record<string, unknown>)) {
      if (SENSITIVE_KEYS.test(key)) {
        cleaned[key] = '[REDACTED]';
      } else {
        cleaned[key] = redactSensitive(val);
      }
    }
    return cleaned;
  }

  return data;
}

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.info(`[INFO] ${message}`, ...args.map(redactSensitive));
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[WARN] ${message}`, ...args.map(redactSensitive));
  },
  error: (message: string, ...args: unknown[]) => {
    // Redact error messages if they contain tokens/passwords
    const sanitizedArgs = args.map(arg => {
      if (arg instanceof Error) {
        return {
          name: arg.name,
          message: redactSensitive(arg.message),
        };
      }
      return redactSensitive(arg);
    });
    console.error(`[ERROR] ${message}`, ...sanitizedArgs);
  },
};
