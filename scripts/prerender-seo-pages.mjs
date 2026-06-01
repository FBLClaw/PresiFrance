import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { seoPrerenderRoutes } from "./seo-routes.mjs";

const distDir = path.resolve(process.cwd(), "dist");
const siteUrl = String(process.env.SITE_URL || "https://presifrance.fr").replace(/\/+$/, "");

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function upsertMeta(html, selector, tag) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`<meta\\s+${escapedSelector}[^>]*>`, "i");
  if (re.test(html)) return html.replace(re, tag);
  return html.replace("</head>", `  ${tag}\n</head>`);
}

function upsertCanonical(html, href) {
  const tag = `<link rel="canonical" href="${escapeHtml(href)}" />`;
  if (/<link\s+rel="canonical"[^>]*>/i.test(html)) {
    return html.replace(/<link\s+rel="canonical"[^>]*>/i, tag);
  }
  return html.replace("</head>", `  ${tag}\n</head>`);
}

function renderRouteHtml(baseHtml, route) {
  const url = `${siteUrl}${route.path === "/" ? "/" : route.path}`;
  let html = baseHtml;
  html = html.replace(/<title>.*?<\/title>/is, `<title>${escapeHtml(route.title)}</title>`);
  html = upsertMeta(html, 'name="description"', `<meta name="description" content="${escapeHtml(route.description)}" />`);
  html = upsertMeta(html, 'property="og:title"', `<meta property="og:title" content="${escapeHtml(route.title)}" />`);
  html = upsertMeta(html, 'property="og:description"', `<meta property="og:description" content="${escapeHtml(route.description)}" />`);
  html = upsertMeta(html, 'property="og:url"', `<meta property="og:url" content="${escapeHtml(url)}" />`);
  html = upsertMeta(html, 'name="twitter:title"', `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`);
  html = upsertMeta(html, 'name="twitter:description"', `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`);
  html = upsertCanonical(html, url);
  return html;
}

function routeOutputPath(routePath) {
  if (routePath === "/") return path.join(distDir, "index.html");
  return path.join(distDir, routePath.replace(/^\/+/, ""), "index.html");
}

const baseHtml = await readFile(path.join(distDir, "index.html"), "utf8");

for (const route of seoPrerenderRoutes) {
  const filePath = routeOutputPath(route.path);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, renderRouteHtml(baseHtml, route), "utf8");
}

console.log(`[prerender] wrote ${seoPrerenderRoutes.length} SEO HTML routes`);
