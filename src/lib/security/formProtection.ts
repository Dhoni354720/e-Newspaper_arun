/**
 * Form security utilities: Honeypot spam filtering, rate limiting, and captcha validation.
 */

// Simple in-memory rate limiting map keyed by form identifier + client fingerprint
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export interface FormSecurityCheckResult {
  allowed: boolean;
  error?: string;
}

/**
 * Check if the submission violates honeypot or rate limits.
 *
 * @param formId Identifier for the form (e.g., 'contact', 'news_tips')
 * @param honeypotValue Value of the hidden honeypot field. Must be empty.
 * @param maxRequests Maximum requests allowed within the window. Default 3.
 * @param windowMs Time window in milliseconds. Default 10 minutes (600,000 ms).
 */
export function validateFormSecurity(
  formId: string,
  honeypotValue: string | undefined | null,
  maxRequests: number = 3,
  windowMs: number = 600000
): FormSecurityCheckResult {
  // 1. Honeypot check: Bots fill hidden inputs; humans do not.
  if (honeypotValue && honeypotValue.trim().length > 0) {
    return {
      allowed: false,
      error: 'स्पैम प्रविष्टि अस्वीकृत (Spam detected).',
    };
  }

  // 2. Client-side session / fingerprint rate limiting
  const now = Date.now();
  const entry = rateLimitStore.get(formId);

  if (entry) {
    if (now < entry.resetAt) {
      if (entry.count >= maxRequests) {
        const remainingMinutes = Math.ceil((entry.resetAt - now) / 60000);
        return {
          allowed: false,
          error: `कृपया प्रतीक्षा करें। आप ${remainingMinutes} मिनट बाद पुनः प्रयास कर सकते हैं। (Rate limit exceeded)`,
        };
      }
      entry.count += 1;
    } else {
      // Window expired, reset
      rateLimitStore.set(formId, { count: 1, resetAt: now + windowMs });
    }
  } else {
    rateLimitStore.set(formId, { count: 1, resetAt: now + windowMs });
  }

  return { allowed: true };
}

/**
 * Reset rate limit (useful in testing)
 */
export function resetFormRateLimit(formId?: string): void {
  if (formId) {
    rateLimitStore.delete(formId);
  } else {
    rateLimitStore.clear();
  }
}
