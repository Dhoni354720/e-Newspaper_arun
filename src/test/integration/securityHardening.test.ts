import { describe, it, expect } from 'vitest';
import { sanitizeHtml, safeJsonStringify, safeUrl, validateVideoEmbedUrl, validateSafeRedirect } from '@/lib/sanitize';
import { checkObjectOwnership, AuthError } from '@/lib/auth/requireRole';
import { contactFormSchema, newsTipFormSchema } from '@/lib/validation/schemas';
import { validateFileMagicBytes, generateSafeStoragePath } from '@/lib/security/fileValidation';
import { hashClientIp } from '@/lib/security/ipHash';

describe('Security Hardening Test Suite (S1-S8)', () => {
  describe('S2 & S3: XSS Sanitization & Safe Encoders', () => {
    it('strips script tags and onerror event handlers from HTML content', () => {
      const maliciousPayload = '<p>Normal text</p><script>alert(1)</script><img src=x onerror=alert(1)>';
      const clean = sanitizeHtml(maliciousPayload);

      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('alert(1)');
      expect(clean).not.toContain('onerror');
      expect(clean).toContain('<p>Normal text</p>');
    });

    it('strips iframes, forms, and style attributes from user input', () => {
      const payload = '<iframe src="javascript:alert(1)"></iframe><form action="/steal"><input></form><span style="color:red;xss:expression(alert(1))">Text</span>';
      const clean = sanitizeHtml(payload);

      expect(clean).not.toContain('<iframe');
      expect(clean).not.toContain('<form');
      expect(clean).not.toContain('style=');
      expect(clean).not.toContain('expression');
    });

    it('safeJsonStringify escapes < and > to prevent </script> breakout in JSON-LD', () => {
      const data = {
        title: 'Article headline </script><script>alert(1)</script>',
      };
      const serialized = safeJsonStringify(data);

      expect(serialized).not.toContain('</script>');
      expect(serialized).toContain('\\u003c/script\\u003e');
      expect(serialized).toContain('\\u003cscript\\u003e');
    });

    it('safeUrl rejects javascript: and data: URIs and permits valid http(s)', () => {
      expect(safeUrl('javascript:alert(1)')).toBe('#');
      expect(safeUrl('data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==')).toBe('#');
      expect(safeUrl('https://dainikjagatsameeksha.com/article/1')).toBe('https://dainikjagatsameeksha.com/article/1');
      expect(safeUrl('/admin/articles')).toBe('/admin/articles');
    });

    it('validateVideoEmbedUrl strictly validates YouTube 11-char ID and Vimeo ID', () => {
      expect(validateVideoEmbedUrl('dQw4w9WgXcQ')).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1');
      expect(validateVideoEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1');
      expect(validateVideoEmbedUrl('12345678')).toBe('https://player.vimeo.com/video/12345678');
      expect(validateVideoEmbedUrl('javascript:alert(1)')).toBeNull();
      expect(validateVideoEmbedUrl('<script>alert(1)</script>')).toBeNull();
    });

    it('validateSafeRedirect blocks protocol-relative and backslash open redirect bypasses', () => {
      expect(validateSafeRedirect('/admin')).toBe('/admin');
      expect(validateSafeRedirect('//evil.com')).toBe('/admin');
      expect(validateSafeRedirect('/\\evil.com')).toBe('/admin');
      expect(validateSafeRedirect('https://evil.com')).toBe('/admin');
    });
  });

  describe('S2: IDOR and Role Ownership Authorization', () => {
    it('author can only touch their own object (IDOR blocked)', () => {
      expect(checkObjectOwnership('usr-author-01', 'usr-author-01', 'author')).toBe(true);
      expect(checkObjectOwnership('usr-author-02', 'usr-author-01', 'author')).toBe(false);
    });

    it('admin and editor can manage all objects regardless of author_id', () => {
      expect(checkObjectOwnership('usr-author-02', 'usr-admin-01', 'admin')).toBe(true);
      expect(checkObjectOwnership('usr-author-02', 'usr-editor-01', 'editor')).toBe(true);
    });
  });

  describe('S4: Zod Schema Validation & Honeypot Protection', () => {
    it('contactFormSchema rejects submissions with honeypot filled (bots)', () => {
      const botSubmission = {
        name: 'Spam Bot',
        email: 'spambot@example.com',
        phone: '9876543210',
        message: 'Buy cheap luxury goods now at spam site',
        honeypot: 'bot filled this input',
      };

      const result = contactFormSchema.safeParse(botSubmission);
      expect(result.success).toBe(false);
    });

    it('newsTipFormSchema validates phone format and minimum message length', () => {
      const invalidTip = {
        sender_name: 'A', // too short
        sender_phone: 'not-a-number',
        sender_city: 'Mumbai',
        message: 'short', // too short
      };

      const result = newsTipFormSchema.safeParse(invalidTip);
      expect(result.success).toBe(false);
    });

    it('hashClientIp generates deterministic 64-char hex SHA-256 and never exposes raw IP', () => {
      const ip = '203.0.113.195';
      const hash1 = hashClientIp(ip);
      const hash2 = hashClientIp(ip);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64);
      expect(hash1).not.toContain('203.0.113.195');
    });
  });

  describe('S5: File Magic Bytes & Safe Storage Paths', () => {
    it('rejects SVG files with embedded script tags', () => {
      const svgBuffer = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');
      const result = validateFileMagicBytes(svgBuffer);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('SVG');
    });

    it('rejects spoofed extension text file disguised as jpg', () => {
      const fakeJpgBuffer = Buffer.from('this is just a text file with normal ascii characters');
      const result = validateFileMagicBytes(fakeJpgBuffer);

      expect(result.valid).toBe(false);
    });

    it('accepts legitimate JPEG magic bytes FF D8 FF', () => {
      const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
      const result = validateFileMagicBytes(jpegBuffer);

      expect(result.valid).toBe(true);
      expect(result.mimeType).toBe('image/jpeg');
      expect(result.extension).toBe('jpg');
    });

    it('generateSafeStoragePath creates safe UUID paths and strips directory traversal sequences', () => {
      const safePath = generateSafeStoragePath('../../etc/passwd', 'jpg');

      expect(safePath).not.toContain('..');
      expect(safePath).not.toContain('passwd');
      expect(safePath).toMatch(/^media\/[0-9a-f-]{36}\.jpg$/);
    });
  });
});
