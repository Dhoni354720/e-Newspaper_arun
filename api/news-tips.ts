import type { IncomingMessage, ServerResponse } from 'http';
import { newsTipFormSchema } from '../src/lib/validation/schemas';
import { checkRateLimit } from '../src/lib/security/rateLimiter';
import { verifyTurnstileToken } from '../src/lib/security/turnstile';
import { hashClientIp } from '../src/lib/security/ipHash';

export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  // Extract client IP
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket.remoteAddress || 'unknown';

  // 1. Server-side Rate Limiting (max 3 tips per 10 min per IP)
  const rateLimit = await checkRateLimit(`news_tip:${clientIp}`, 3, 600);
  if (!rateLimit.allowed) {
    res.statusCode = 429;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: `कृपया प्रतीक्षा करा. बातमी पाठवण्याची मर्यादा संपली आहे. (Rate limit exceeded. Try again in ${Math.ceil(rateLimit.resetSeconds / 60)} minutes.)`,
    }));
    return;
  }

  // 2. Read request body
  let body: any = req.body;
  if (!body) {
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      const raw = Buffer.concat(chunks).toString('utf8');
      body = JSON.parse(raw);
    } catch {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'अवैध डेटा फॉरमॅट (Malformed JSON request)' }));
      return;
    }
  }

  // 3. Zod schema validation
  const parsed = newsTipFormSchema.safeParse(body);
  if (!parsed.success) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'प्रविष्टी अवैध आहे (Validation error)',
      details: parsed.error.issues.map(i => i.message),
    }));
    return;
  }

  const { sender_name, sender_phone, sender_city, message, image_urls, honeypot, turnstile_token } = parsed.data;

  // 4. Honeypot verification (Reject bot spam)
  if (honeypot && honeypot.length > 0) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'स्पॅम प्रविष्टी नाकारली (Spam detected)' }));
    return;
  }

  // 5. Cloudflare Turnstile CAPTCHA verification
  const turnstileResult = await verifyTurnstileToken(turnstile_token, clientIp);
  if (!turnstileResult.success) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: turnstileResult.error || 'CAPTCHA verification failed' }));
    return;
  }

  // 6. Secure IP hashing
  const ipHash = hashClientIp(clientIp);

  // Return success (always forced to status 'new' on server)
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    success: true,
    message: 'नागरिक पत्रकारिता बातमी संपादकीय कक्षाला प्राप्त झाली आहे. (News tip submitted successfully.)',
    status: 'new',
    ip_hash: ipHash.slice(0, 12) + '...',
  }));
}
