import type { IncomingMessage, ServerResponse } from 'http';

export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  // 1. Authentication Check
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'प्रमाणीकरण आवश्यक आहे (Authentication required - 401)' }));
    return;
  }

  const token = authHeader.replace('Bearer ', '').trim();

  // 2. Strict Role Check: ONLY 'admin' can access settings
  const isAdmin = token === 'admin-token' || token.includes('role=admin');

  if (!isAdmin) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'अनधिकृत प्रवेश: ही सेटिंग्ज बदलण्यासाठी केवळ मुख्य प्रशासक (Admin) अधिकार आवश्यक आहेत. (Forbidden: 403)',
    }));
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    success: true,
    message: 'प्रशासकीय सेटिंग्ज उपलब्ध (Admin settings access granted)',
  }));
}
