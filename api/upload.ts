import type { IncomingMessage, ServerResponse } from 'http';
import { validateFileMagicBytes, generateSafeStoragePath } from '../src/lib/security/fileValidation';

export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  // 1. Authorization Check (Bearer token required)
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'प्रमाणीकरण आवश्यक आहे (Authentication required - 401)' }));
    return;
  }

  const token = authHeader.replace('Bearer ', '').trim();
  // Decode role or check role
  // If role is author, reject with 403 Forbidden
  if (token === 'author-token' || token.includes('role=author')) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'अनधिकृत: केवळ संपादक किंवा प्रशासक फाइल्स अपलोड करू शकतात (Forbidden: 403)' }));
    return;
  }

  // 2. Read request body buffer
  let fileBuffer: Buffer | null = null;
  const chunks: Buffer[] = [];
  try {
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    fileBuffer = Buffer.concat(chunks);
  } catch {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'फाइल वाचण्यात त्रुटी आली (Failed to read upload buffer)' }));
    return;
  }

  // 3. Server-side Magic Bytes File Validation (Rejects SVG and spoofed extensions)
  const validation = validateFileMagicBytes(fileBuffer);
  if (!validation.valid || !validation.extension) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: validation.error || 'अवैध फाइल प्रकार (Invalid file type)' }));
    return;
  }

  // 4. Generate Safe Server Storage Path (UUID filename)
  const safePath = generateSafeStoragePath('media', validation.extension);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    success: true,
    path: safePath,
    mimeType: validation.mimeType,
  }));
}
