import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { departmentRoutes, staticRoutes } from "./seo-routes.mjs";

const distDir = path.resolve(process.cwd(), "dist");

// Configure with: SITE_URL="https://presifrance.fr" npm run build
const siteUrl = String(process.env.SITE_URL || "https://presifrance.fr").replace(/\/+$/, "");

export function isoDate(d = new Date()) {
  return d.toISOString().replace(/\.\d{3}Z$/, "Z");
}

export function escapeXml(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

const lastmod = isoDate();
const allRoutes = [
  ...staticRoutes.map(r => ({ loc: `${siteUrl}${r}`, priority: "1.0" })),
  ...departmentRoutes.map(r => ({ loc: `${siteUrl}${r}`, priority: "0.8" })),
];

// Helper to split into chunks of 50k (Google limit)
export function chunkSitemap(routes, chunkSize = 45000) {
  const chunks = [];
  for (let i = 0; i < routes.length; i += chunkSize) {
    chunks.push(routes.slice(i, i + chunkSize));
  }
  return chunks;
}

const sitemapChunks = chunkSitemap(allRoutes);

export async function generateSitemaps() {
  await mkdir(distDir, { recursive: true });

  if (sitemapChunks.length === 1) {
    // Single sitemap
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      sitemapChunks[0].map(r => `  <url>\n    <loc>${escapeXml(r.loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`).join("\n") +
      `\n</urlset>\n`;
    await writeFile(path.join(distDir, "sitemap.xml"), xml, "utf8");
  } else {
    // Sitemap Index
    const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      sitemapChunks.map((_, i) => `  <sitemap>\n    <loc>${siteUrl}/sitemap-${i}.xml</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`).join("\n") +
      `\n</sitemapindex>\n`;
    await writeFile(path.join(distDir, "sitemap.xml"), sitemapIndexXml, "utf8");

    for (let i = 0; i < sitemapChunks.length; i++) {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        sitemapChunks[i].map(r => `  <url>\n    <loc>${escapeXml(r.loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`).join("\n") +
        `\n</urlset>\n`;
      await writeFile(path.join(distDir, `sitemap-${i}.xml`), xml, "utf8");
    }
  }

  const robotsTxt = `User-agent: *\nAllow: /\nDisallow: /data/\nDisallow: /assets/\n\nUser-agent: GPTBot\nDisallow: /\n\nUser-agent: CCBot\nDisallow: /\n\nUser-agent: ClaudeBot\nDisallow: /\n\nUser-agent: PerplexityBot\nDisallow: /\n\nUser-agent: Amazonbot\nDisallow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
  await writeFile(path.join(distDir, "robots.txt"), robotsTxt, "utf8");
  
  console.log(`[sitemap] wrote ${allRoutes.length} URLs across ${sitemapChunks.length} file(s) (SITE_URL=${siteUrl})`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await generateSitemaps();
}
