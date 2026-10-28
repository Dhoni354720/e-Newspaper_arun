import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

const SITE_URL = 'https://dainikjagatsameeksha.com';
const PUBLICATION_NAME = 'दैनिक जगत समीक्षा (Dainik Jagat Sameeksha)';
const PUBLICATION_LANG = 'hi';
const EDITOR_NAME = 'अरुण रमाकांत तिवारी (Chief Editor)';
const OFFICIAL_EMAIL = 'jagatsameeksha2014@gmail.com';

// 1. Static and Hub Routes
const CORE_ROUTES = [
  { url: '/', priority: '1.0', changefreq: 'hourly' },
  { url: '/top-news', priority: '0.9', changefreq: 'hourly' },
  { url: '/news', priority: '0.8', changefreq: 'hourly' },
  { url: '/epaper', priority: '0.9', changefreq: 'daily' },
  { url: '/epaper/e1000000-0000-0000-0000-000000000001', priority: '0.9', changefreq: 'daily' },
  { url: '/epaper/e1000000-0000-0000-0000-000000000002', priority: '0.9', changefreq: 'daily' },
  { url: '/flash', priority: '0.8', changefreq: 'hourly' },
  { url: '/videos', priority: '0.8', changefreq: 'daily' },
  { url: '/photos', priority: '0.7', changefreq: 'daily' },
  { url: '/rashifal', priority: '0.8', changefreq: 'daily' },
  { url: '/submit-news', priority: '0.6', changefreq: 'monthly' },
  { url: '/grievance', priority: '0.6', changefreq: 'monthly' },
  { url: '/about', priority: '0.5', changefreq: 'monthly' },
  { url: '/contact', priority: '0.5', changefreq: 'monthly' },
  { url: '/privacy-policy', priority: '0.4', changefreq: 'yearly' },
  { url: '/terms', priority: '0.4', changefreq: 'yearly' },
  { url: '/page/about-us', priority: '0.5', changefreq: 'monthly' },
  { url: '/page/editorial-policy', priority: '0.5', changefreq: 'monthly' },
  { url: '/author/arun-ramakant-tiwari', priority: '0.7', changefreq: 'weekly' },
  { url: '/supplement/shree-darshan-sunday', priority: '0.7', changefreq: 'weekly' },
  { url: '/supplement/vyapar-manch', priority: '0.7', changefreq: 'weekly' },
  { url: '/photos/mumbai-metro-line-3-trials', priority: '0.7', changefreq: 'weekly' },
  { url: '/photos/pune-ganesh-utsav-preparations', priority: '0.7', changefreq: 'weekly' },
];

// 2. Parse categories and articles from src/data/seedData.ts
function extractSeedData() {
  const seedFile = path.join(rootDir, 'src/data/seedData.ts');
  const content = fs.readFileSync(seedFile, 'utf-8');

  // Extract Category slugs
  const categorySlugs = new Set();
  const catSlugRegex = /slug:\s*'([a-z0-9-]+)'/g;
  let match;

  // Extract from category definitions
  const catSectionMatch = content.match(/export const INITIAL_CATEGORIES: Category\[\] = \[([\s\S]*?)\];/);
  if (catSectionMatch) {
    let catMatch;
    while ((catMatch = catSlugRegex.exec(catSectionMatch[1])) !== null) {
      categorySlugs.add(catMatch[1]);
    }
  }

  // Extract articles
  const articles = [];
  const articleBlocks = content.split(/\{\s*id:\s*'/).slice(1);

  for (const block of articleBlocks) {
    const slugMatch = block.match(/slug:\s*'([^']+)'/);
    const headlineMatch = block.match(/headline:\s*'([^']+)'/);
    const excerptMatch = block.match(/excerpt:\s*'([^']+)'/);
    const langMatch = block.match(/language:\s*'([^']+)'/);
    const publishedAtMatch = block.match(/published_at:\s*'([^']+)'/);
    const imageMatch = block.match(/featured_image_path:\s*'([^']+)'/);
    const isBreakingMatch = block.match(/is_breaking:\s*(true|false)/);

    if (slugMatch && headlineMatch) {
      articles.push({
        slug: slugMatch[1],
        headline: headlineMatch[1],
        excerpt: excerptMatch ? excerptMatch[1] : '',
        language: langMatch ? langMatch[1] : 'hi',
        published_at: publishedAtMatch ? publishedAtMatch[1] : new Date().toISOString(),
        image: imageMatch ? imageMatch[1] : `${SITE_URL}/images/logo.png`,
        is_breaking: isBreakingMatch ? isBreakingMatch[1] === 'true' : false,
      });
    }
  }

  return {
    categories: Array.from(categorySlugs),
    articles,
  };
}

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateStandardSitemap(categories, articles) {
  const now = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  // Core & Hub Routes
  for (const route of CORE_ROUTES) {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}${route.url}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  // Categories
  for (const slug of categories) {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}/category/${slug}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  // Published Articles
  for (const art of articles) {
    const artDate = art.published_at ? art.published_at.split('T')[0] : now;
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}/article/${escapeXml(art.slug)}</loc>\n`;
    xml += `    <lastmod>${artDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>${art.is_breaking ? '0.85' : '0.75'}</priority>\n`;
    if (art.image) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${escapeXml(art.image)}</image:loc>\n`;
      xml += `      <image:title>${escapeXml(art.headline)}</image:title>\n`;
      xml += `    </image:image>\n`;
    }
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;
  return xml;
}

function generateGoogleNewsSitemap(articles) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`;

  // News sitemap highlights recent news articles
  for (const art of articles) {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}/article/${escapeXml(art.slug)}</loc>\n`;
    xml += `    <news:news>\n`;
    xml += `      <news:publication>\n`;
    xml += `        <news:name>दैनिक जगत समीक्षा</news:name>\n`;
    xml += `        <news:language>${art.language || 'hi'}</news:language>\n`;
    xml += `      </news:publication>\n`;
    xml += `      <news:publication_date>${art.published_at}</news:publication_date>\n`;
    xml += `      <news:title>${escapeXml(art.headline)}</news:title>\n`;
    xml += `    </news:news>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;
  return xml;
}

function generateRssFeed(articles) {
  const buildDate = new Date().toUTCString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/">\n`;
  xml += `  <channel>\n`;
  xml += `    <title>${escapeXml(PUBLICATION_NAME)}</title>\n`;
  xml += `    <link>${SITE_URL}/</link>\n`;
  xml += `    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />\n`;
  xml += `    <description>दैनिक जगत समीक्षा — राष्ट्रीय एवं प्रादेशिक हिंदी दैनिक समाचार पत्र। मुख्य संपादक: ${escapeXml(EDITOR_NAME)}</description>\n`;
  xml += `    <language>${PUBLICATION_LANG}</language>\n`;
  xml += `    <managingEditor>${OFFICIAL_EMAIL} (${escapeXml(EDITOR_NAME)})</managingEditor>\n`;
  xml += `    <webMaster>${OFFICIAL_EMAIL} (Dainik Jagat Sameeksha Webmaster)</webMaster>\n`;
  xml += `    <lastBuildDate>${buildDate}</lastBuildDate>\n`;
  xml += `    <image>\n`;
  xml += `      <url>${SITE_URL}/images/logo.png</url>\n`;
  xml += `      <title>${escapeXml(PUBLICATION_NAME)}</title>\n`;
  xml += `      <link>${SITE_URL}/</link>\n`;
  xml += `    </image>\n`;

  for (const art of articles) {
    const itemDate = art.published_at ? new Date(art.published_at).toUTCString() : buildDate;
    xml += `    <item>\n`;
    xml += `      <title>${escapeXml(art.headline)}</title>\n`;
    xml += `      <link>${SITE_URL}/article/${escapeXml(art.slug)}</link>\n`;
    xml += `      <guid isPermaLink="true">${SITE_URL}/article/${escapeXml(art.slug)}</guid>\n`;
    xml += `      <description>${escapeXml(art.excerpt)}</description>\n`;
    xml += `      <dc:creator>${escapeXml(EDITOR_NAME)}</dc:creator>\n`;
    xml += `      <pubDate>${itemDate}</pubDate>\n`;
    if (art.image) {
      xml += `      <enclosure url="${escapeXml(art.image)}" type="image/jpeg" />\n`;
    }
    xml += `    </item>\n`;
  }

  xml += `  </channel>\n`;
  xml += `</rss>\n`;
  return xml;
}

function main() {
  console.log('Generating sitemaps and RSS feeds for Dainik Jagat Sameeksha...');

  const { categories, articles } = extractSeedData();
  console.log(`Found ${categories.length} categories and ${articles.length} articles.`);

  const sitemapXml = generateStandardSitemap(categories, articles);
  const newsSitemapXml = generateGoogleNewsSitemap(articles);
  const rssXml = generateRssFeed(articles);

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  console.log('Written: public/sitemap.xml');

  fs.writeFileSync(path.join(publicDir, 'news-sitemap.xml'), newsSitemapXml, 'utf-8');
  console.log('Written: public/news-sitemap.xml');

  fs.writeFileSync(path.join(publicDir, 'rss.xml'), rssXml, 'utf-8');
  console.log('Written: public/rss.xml');

  console.log('Feeds and sitemaps generated successfully!');
}

main();
