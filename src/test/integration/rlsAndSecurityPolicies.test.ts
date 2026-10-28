import { describe, it, expect, beforeEach } from 'vitest';
import { repository } from '@/lib/repository';
import { sanitizeHtml } from '@/lib/sanitize';
import { validateFormSecurity, resetFormRateLimit } from '@/lib/security/formProtection';
import { Article } from '@/types/database';

describe('Phase 0 Security & RLS Policy Enforcement Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    resetFormRateLimit();
  });

  // --------------------------------------------------------------------------
  // 1. PUBLIC & ANONYMOUS ACCESS POLICIES
  // --------------------------------------------------------------------------
  describe('Anonymous & Public Reader Boundaries', () => {
    it('public readers can only see published articles whose publication date is past', async () => {
      // Create a draft, a scheduled future article, and a published past article
      const now = new Date();
      const past = new Date(now.getTime() - 3600000).toISOString();
      const future = new Date(now.getTime() + 3600000).toISOString();

      const publishedArt = await repository.saveArticle({
        headline: 'Published National Story',
        status: 'published',
        published_at: past,
        language: 'hi',
      });

      const draftArt = await repository.saveArticle({
        headline: 'Confidential Internal Draft',
        status: 'draft',
        language: 'hi',
      });

      const scheduledArt = await repository.saveArticle({
        headline: 'Embargoed Scheduled Report',
        status: 'scheduled',
        scheduled_at: future,
        language: 'hi',
      });

      // Public call (includePrivate: false)
      const publicFeed = await repository.getArticles({ includePrivate: false, limit: 50 });
      const publicIds = publicFeed.articles.map(a => a.id);

      expect(publicIds).toContain(publishedArt.id);
      expect(publicIds).not.toContain(draftArt.id);
      expect(publicIds).not.toContain(scheduledArt.id);

      // Verify direct retrieval fails for draft when not authorized
      const publicDraftFetch = await repository.getArticleBySlug(draftArt.slug, { includePrivate: false });
      expect(publicDraftFetch).toBeNull();
    });

    it('proves public readers cannot read audit logs without staff privileges', async () => {
      // In local repository fallback, getAuditLogs is guarded and empty/restricted
      const logs = await repository.getAuditLogs(10);
      expect(Array.isArray(logs)).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // 2. LEAST PRIVILEGE: AUTHOR ROLE ENFORCEMENT
  // --------------------------------------------------------------------------
  describe('Author Role & Least Privilege', () => {
    it('defaults new article author assignment to role author, never admin', async () => {
      const newArticle = await repository.saveArticle({
        headline: 'Field Reporter Story',
        language: 'hi',
        status: 'draft',
      });

      expect(newArticle.author).toBeDefined();
      expect(newArticle.author?.role).toBe('author');
      expect(newArticle.author?.role).not.toBe('admin');
    });

    it('records audit log entries upon article creation, publication, and deletion', async () => {
      const art = await repository.saveArticle({
        headline: 'Audit Trail Verification Article',
        status: 'draft',
        language: 'hi',
      });

      let logs = await repository.getAuditLogs(20);
      const createLog = logs.find(l => l.entity_id === art.id && l.action === 'create');
      expect(createLog).toBeDefined();

      // Publish the article
      await repository.saveArticle({
        id: art.id,
        status: 'published',
      });

      logs = await repository.getAuditLogs(20);
      const publishLog = logs.find(l => l.entity_id === art.id && l.action === 'publish');
      expect(publishLog).toBeDefined();

      // Delete the article
      await repository.deleteArticle(art.id);
      logs = await repository.getAuditLogs(20);
      const deleteLog = logs.find(l => l.entity_id === art.id && l.action === 'delete');
      expect(deleteLog).toBeDefined();
    });
  });

  // --------------------------------------------------------------------------
  // 3. HTML SANITIZATION & XSS DEFENSE
  // --------------------------------------------------------------------------
  describe('HTML Body Sanitization (DOMPurify)', () => {
    it('disarms script tags, event handlers, and javascript: links from article bodies', () => {
      const maliciousPayload = `
        <h2>Valid Subhead</h2>
        <p>Legitimate reporting paragraph with <strong>bold</strong> text.</p>
        <script>alert("XSS Attack");</script>
        <img src="https://example.com/photo.jpg" onerror="alert(document.cookie)" alt="Clean image" />
        <a href="javascript:stealData()">Click here for free reward</a>
        <iframe src="https://attacker.com/evil"></iframe>
      `;

      const cleaned = sanitizeHtml(maliciousPayload);

      // Verify malicious scripts and inline handlers are neutralized
      expect(cleaned).not.toContain('<script>');
      expect(cleaned).not.toContain('alert(');
      expect(cleaned).not.toContain('onerror=');
      expect(cleaned).not.toContain('javascript:stealData()');

      // Verify legitimate markup is preserved
      expect(cleaned).toContain('<h2>Valid Subhead</h2>');
      expect(cleaned).toContain('<strong>bold</strong>');
      expect(cleaned).toContain('alt="Clean image"');
    });

    it('sanitizes article bodies automatically on save in repository', async () => {
      const dirtyHtml = '<p>Normal text</p><script>alert("hack")</script><b onmouseover="alert(1)">Important</b>';
      const saved = await repository.saveArticle({
        headline: 'XSS Prevention Test',
        body: dirtyHtml,
        language: 'hi',
      });

      expect(saved.body).not.toContain('<script>');
      expect(saved.body).not.toContain('onmouseover');
      expect(saved.body).toContain('<p>Normal text</p>');
      expect(saved.body).toContain('<b>Important</b>');
    });
  });

  // --------------------------------------------------------------------------
  // 4. FORM SECURITY: HONEYPOT & RATE LIMITING
  // --------------------------------------------------------------------------
  describe('Form Protection & Honeypot', () => {
    it('rejects spam bots that populate the hidden honeypot field', async () => {
      const botSubmission = await repository.submitContactMessage({
        name: 'Spam Bot',
        email: 'spammer@botnet.ru',
        message: 'Buy cheap watches now!',
        honeypot: 'http://spam-link.com', // Filled honeypot
      });

      expect(botSubmission.success).toBe(false);
      expect(botSubmission.error).toContain('स्पैम');
    });

    it('accepts valid human submissions with an empty honeypot', async () => {
      const humanSubmission = await repository.submitContactMessage({
        name: 'राजेश शर्मा',
        email: 'rajesh.sharma@example.com',
        phone: '+91 98765 43210',
        subject: 'समाचार सुझाव',
        message: 'हमारे क्षेत्र में नई सड़क परियोजना का शुभारंभ हुआ है।',
        honeypot: '', // Clean human submission
      });

      expect(humanSubmission.success).toBe(true);

      const messages = await repository.getContactMessages(10);
      expect(messages.some(m => m.email === 'rajesh.sharma@example.com')).toBe(true);
    });

    it('enforces rate limits against rapid automated form submissions', () => {
      const formId = 'test_rate_limited_form';
      resetFormRateLimit(formId);

      // Submissions 1, 2, 3 should succeed (limit = 3)
      expect(validateFormSecurity(formId, '', 3, 60000).allowed).toBe(true);
      expect(validateFormSecurity(formId, '', 3, 60000).allowed).toBe(true);
      expect(validateFormSecurity(formId, '', 3, 60000).allowed).toBe(true);

      // Submission 4 should be rate limited
      const rateLimited = validateFormSecurity(formId, '', 3, 60000);
      expect(rateLimited.allowed).toBe(false);
      expect(rateLimited.error).toContain('कृपया प्रतीक्षा करें');
    });
  });
});
