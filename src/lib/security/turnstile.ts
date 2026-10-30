/**
 * Server-side verification for Cloudflare Turnstile CAPTCHA.
 * Gracefully disabled with a logged warning if TURNSTILE_SECRET_KEY is omitted.
 */

export interface TurnstileVerificationResult {
  success: boolean;
  error?: string;
}

export async function verifyTurnstileToken(
  token: string | undefined | null,
  clientIp?: string
): Promise<TurnstileVerificationResult> {
  const secretKey = typeof process !== 'undefined' && process.env ? process.env.TURNSTILE_SECRET_KEY : undefined;
  const isProd = typeof process !== 'undefined' && process.env ? process.env.NODE_ENV === 'production' : false;

  if (!secretKey) {
    if (isProd) {
      console.warn('[Turnstile] WARNING: TURNSTILE_SECRET_KEY is not configured in production. Turnstile verification skipped.');
    }
    return { success: true };
  }

  if (!token) {
    return {
      success: false,
      error: 'कॅप्चा सत्यापन आवश्यक आहे (Turnstile CAPTCHA verification required).',
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (clientIp) {
      formData.append('remoteip', clientIp);
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json() as { success: boolean; 'error-codes'?: string[] };

    if (!data.success) {
      return {
        success: false,
        error: 'कॅप्चा सत्यापन अयशस्वी झाले (CAPTCHA verification failed).',
      };
    }

    return { success: true };
  } catch (err) {
    console.error('[Turnstile] Siteverify network error:', err);
    return {
      success: false,
      error: 'कॅप्चा सेवा अनुपलब्ध आहे (CAPTCHA service unavailable).',
    };
  }
}
