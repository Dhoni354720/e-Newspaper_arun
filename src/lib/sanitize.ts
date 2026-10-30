import DOMPurify from 'dompurify';

// Hook to enforce rel="noopener noreferrer" and safe target on all links
if (typeof DOMPurify.addHook === 'function') {
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      node.setAttribute('rel', 'noopener noreferrer');
      if (node.getAttribute('target') === '_blank') {
        node.setAttribute('target', '_blank');
      }
    }
    // Remove any data: or javascript: URIs on images
    if (node.tagName === 'IMG') {
      const src = node.getAttribute('src');
      if (src && !/^(?:https?:|\/)/i.test(src)) {
        node.removeAttribute('src');
      }
    }
  });
}

/**
 * Strict HTML Sanitization for Articles, Briefs, Pages, and Descriptions.
 * Uses a strict allowlist (p, h2-h4, strong, em, ul, ol, li, a, blockquote, img, figure, figcaption, br).
 * Disallows scripts, iframes, styles, object/embed, and dangerous URI schemes.
 */
export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty) return '';

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'h2', 'h3', 'h4',
      'strong', 'em', 'b', 'i',
      'ul', 'ol', 'li',
      'blockquote',
      'a', 'img', 'figure', 'figcaption',
      'br'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'title',
      'src', 'alt', 'width', 'height', 'loading',
      'class'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|\/)/i,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'textarea'],
    FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick', 'onmouseover', 'onfocus'],
  });
}

/**
 * Safe JSON Serializer for JSON-LD Structured Data:
 * Escapes '<', '>', and '&' to prevent </script> tag breakout attacks in HTML.
 */
export function safeJsonStringify(data: unknown): string {
  const json = JSON.stringify(data);
  return json
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

/**
 * Validates URLs against an allowlist of protocols.
 * Rejects javascript:, data:, vbscript:, and file: schemes.
 */
export function safeUrl(url: string | null | undefined, fallback: string = '#'): string {
  if (!url || typeof url !== 'string') return fallback;

  const trimmed = url.trim();

  // Reject dangerous pseudo-protocols
  if (/^(?:javascript|data|vbscript|file):/i.test(trimmed)) {
    return fallback;
  }

  // Allow relative URLs starting with / (excluding // to prevent protocol-relative open redirect)
  if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.startsWith('/\\')) {
    return trimmed;
  }

  // Allow only http: and https: protocols
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return parsed.toString();
      }
    } catch {
      return fallback;
    }
  }

  // Allow tel: and mailto:
  if (/^(?:tel|mailto):/i.test(trimmed)) {
    return trimmed;
  }

  return fallback;
}

/**
 * YouTube / Vimeo ID and Embed URL Validator:
 * Prevents arbitrary iframes or stored XSS in video embed fields.
 */
export function validateVideoEmbedUrl(rawInput: string | null | undefined): string | null {
  if (!rawInput) return null;

  let input = rawInput.trim();

  // 1. YouTube validation
  let youtubeId: string | null = null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    youtubeId = input;
  } else if (input.includes('youtube.com/watch') || input.includes('youtube.com/embed') || input.includes('youtu.be/')) {
    const ytMatch = input.match(/(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch && ytMatch[1]) {
      youtubeId = ytMatch[1];
    }
  }

  if (youtubeId && /^[a-zA-Z0-9_-]{11}$/.test(youtubeId)) {
    return `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`;
  }

  // 2. Vimeo validation
  let vimeoId: string | null = null;
  if (/^[0-9]{6,12}$/.test(input)) {
    vimeoId = input;
  } else if (input.includes('vimeo.com/')) {
    const vimeoMatch = input.match(/vimeo\.com\/(?:video\/)?([0-9]{6,12})/);
    if (vimeoMatch && vimeoMatch[1]) {
      vimeoId = vimeoMatch[1];
    }
  }

  if (vimeoId && /^[0-9]{6,12}$/.test(vimeoId)) {
    return `https://player.vimeo.com/video/${vimeoId}`;
  }

  return null;
}

/**
 * Open Redirect Protection:
 * Ensures any redirect / next / returnTo parameter is strictly internal to this origin.
 */
export function validateSafeRedirect(url: string | null | undefined, fallback: string = '/admin'): string {
  if (!url || typeof url !== 'string') return fallback;

  const trimmed = url.trim();

  // Must begin with single forward slash, and NOT // or /\ which bypass standard origin checks
  if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.startsWith('/\\')) {
    return trimmed;
  }

  return fallback;
}
