import crypto from 'crypto';

export interface FileValidationResult {
  valid: boolean;
  mimeType?: string;
  extension?: string;
  error?: string;
}

const ALLOWED_MIME_TYPES: Record<string, { ext: string; maxSize: number }> = {
  'image/jpeg': { ext: 'jpg', maxSize: 10 * 1024 * 1024 }, // 10MB
  'image/png': { ext: 'png', maxSize: 10 * 1024 * 1024 },  // 10MB
  'image/webp': { ext: 'webp', maxSize: 10 * 1024 * 1024 },// 10MB
  'application/pdf': { ext: 'pdf', maxSize: 50 * 1024 * 1024 }, // 50MB
};

/**
 * Validates file buffer against magic bytes signature to prevent spoofed MIME types/extensions.
 * Explicitly rejects SVG (image/svg+xml) to prevent embedded script / XSS vectors.
 */
export function validateFileMagicBytes(buffer: Buffer): FileValidationResult {
  if (!buffer || buffer.length < 12) {
    return { valid: false, error: 'फाइल रिकामी किंवा अवैध आहे (Empty or invalid file buffer)' };
  }

  // 1. JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, mimeType: 'image/jpeg', extension: 'jpg' };
  }

  // 2. PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, mimeType: 'image/png', extension: 'png' };
  }

  // 3. WebP: RIFF (bytes 0-3) and WEBP (bytes 8-11)
  const isRiff = buffer.toString('ascii', 0, 4) === 'RIFF';
  const isWebp = buffer.toString('ascii', 8, 12) === 'WEBP';
  if (isRiff && isWebp) {
    return { valid: true, mimeType: 'image/webp', extension: 'webp' };
  }

  // 4. PDF: %PDF (25 50 44 46)
  if (buffer.toString('ascii', 0, 4) === '%PDF') {
    return { valid: true, mimeType: 'application/pdf', extension: 'pdf' };
  }

  // 5. SVG check (reject explicitly)
  const headerPreview = buffer.toString('utf8', 0, Math.min(100, buffer.length)).toLowerCase();
  if (headerPreview.includes('<svg') || headerPreview.includes('<?xml')) {
    return {
      valid: false,
      error: 'सुरक्षा कारणामुळे SVG फाइल्स अपलोड करण्यास अनुमती नाही (SVG files are not permitted for security reasons).',
    };
  }

  return {
    valid: false,
    error: 'असमर्थित फाइल प्रकार. केवळ JPEG, PNG, WebP आणि PDF फाइल्स स्वीकारल्या जातात (Unsupported file type. Only JPEG, PNG, WebP, and PDF allowed).',
  };
}

const ALLOWED_FOLDERS = new Set(['media', 'epaper', 'articles', 'avatars', 'supplements']);

/**
 * Generates an unguessable, secure server-side storage path using UUID v4.
 * Strips all user-supplied paths, directory traversal sequences, and null bytes.
 * Restricts folder strictly to allowlisted storage directories.
 */
export function generateSafeStoragePath(folder: string, extension: string): string {
  const normalized = folder.toLowerCase().trim();
  const safeFolder = ALLOWED_FOLDERS.has(normalized) ? normalized : 'media';
  const cleanExt = extension.replace(/[^a-zA-Z0-9]/g, '');
  const uuid = crypto.randomUUID();
  return `${safeFolder}/${uuid}.${cleanExt}`;
}
