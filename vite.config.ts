/// <reference types="vitest" />
import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

function apiRoutesPlugin(): Plugin {
  return {
    name: 'api-routes-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];
        try {
          if (url === '/api/contact') {
            const handler = (await import('./api/contact')).default;
            return handler(req, res);
          }
          if (url === '/api/news-tips') {
            const handler = (await import('./api/news-tips')).default;
            return handler(req, res);
          }
          if (url === '/api/upload') {
            const handler = (await import('./api/upload')).default;
            return handler(req, res);
          }
          if (url === '/api/admin/articles') {
            const handler = (await import('./api/admin/articles')).default;
            return handler(req, res);
          }
          if (url === '/api/admin/settings') {
            const handler = (await import('./api/admin/settings')).default;
            return handler(req, res);
          }
        } catch (err) {
          console.error('[API Middleware Error]:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  define: {
    'process.env': {},
  },
  plugins: [react(), apiRoutesPlugin()],
  server: {
    host: true,
    port: 5173,
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; media-src 'self' blob: https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.open-meteo.com https://challenges.cloudflare.com; frame-src 'self' https://www.youtube-nocookie.com https://player.vimeo.com https://challenges.cloudflare.com; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self';",
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-editor': ['@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-image', '@tiptap/extension-link'],
          'vendor-icons': ['lucide-react'],
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
