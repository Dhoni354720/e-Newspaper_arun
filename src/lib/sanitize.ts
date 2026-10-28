import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks while preserving legitimate
 * rich-text formatting (headings, lists, blockquotes, images, links, tables, callouts).
 */
export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty) return '';

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote', 'cite',
      'a', 'img', 'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span', 'hr', 'code', 'pre', 'mark',
      'iframe',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'title',
      'src', 'alt', 'width', 'height', 'loading',
      'class', 'id', 'style',
      'allow', 'allowfullscreen', 'frameborder',
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    ADD_ATTR: ['target', 'rel'],
  });
}
