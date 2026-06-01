#!/usr/bin/env node
/**
 * Télécharge les photos des candidats et les enregistre localement.
 * Usage: node scripts/fetch-candidate-photos.mjs
 */
import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../public/images/candidates");

const CANDIDATES = [
  { key: "Emmanuel MACRON", wiki: "Emmanuel_Macron" },
  { key: "Marine LE PEN", wiki: "Marine_Le_Pen" },
  { key: "Jean-Luc MÉLENCHON", wiki: "Jean-Luc_M%C3%A9lenchon" },
  { key: "Éric ZEMMOUR", wiki: "%C3%89ric_Zemmour" },
  { key: "Valérie PÉCRESSE", wiki: "Val%C3%A9rie_P%C3%A9cresse" },
  { key: "Yannick JADOT", wiki: "Yannick_Jadot" },
  { key: "Jean LASSALLE", wiki: "Jean_Lassalle" },
  { key: "Fabien ROUSSEL", wiki: "Fabien_Roussel" },
  { key: "Nicolas DUPONT-AIGNAN", wiki: "Nicolas_Dupont-Aignan" },
  { key: "Anne HIDALGO", wiki: "Anne_Hidalgo" },
  { key: "Philippe POUTOU", wiki: "Philippe_Poutou" },
  { key: "Nathalie ARTHAUD", wiki: "Nathalie_Arthaud" },
  { key: "François FILLON", wiki: "Fran%C3%A7ois_Fillon" },
  { key: "Benoît HAMON", wiki: "Beno%C3%AEt_Hamon" },
  { key: "François HOLLANDE", wiki: "Fran%C3%A7ois_Hollande" },
  { key: "Nicolas SARKOZY", wiki: "Nicolas_Sarkozy" },
  { key: "François BAYROU", wiki: "Fran%C3%A7ois_Bayrou" },
  { key: "Eva JOLY", wiki: "Eva_Joly" },
  { key: "Ségolène ROYAL", wiki: "S%C3%A9gol%C3%A8ne_Royal" },
  { key: "Jean-Marie LE PEN", wiki: "Jean-Marie_Le_Pen" },
  { key: "Jacques CHIRAC", wiki: "Jacques_Chirac" },
  { key: "Lionel JOSPIN", wiki: "Lionel_Jospin" },
];

function slug(key) {
  return key
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

async function fetchThumbnail(wikiTitle) {
  const url = `https://fr.wikipedia.org/api/rest_v1/page/summary/${wikiTitle}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "PresiFrance/1.0 (https://presifrance.fr)" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.thumbnail?.source ?? null;
}

async function downloadImage(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "PresiFrance/1.0 (https://presifrance.fr)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const photos = {};

  for (const { key, wiki } of CANDIDATES) {
    try {
      const url = await fetchThumbnail(wiki);
      if (url) {
        const ext = url.includes(".png") ? "png" : "jpg";
        const localPath = `/images/candidates/${slug(key)}.${ext}`;
        const outPath = join(__dirname, "..", "public", "images", "candidates", `${slug(key)}.${ext}`);

        console.log(`Downloading ${key}...`);
        const buf = await downloadImage(url);
        await writeFile(outPath, buf);
        photos[key] = localPath;
        console.log(`  -> ${localPath}`);
      } else {
        console.log(`✗ ${key} (no thumbnail)`);
      }
    } catch (err) {
      console.error(`✗ ${key}: ${err.message}`);
    }
    await new Promise((r) => setTimeout(r, 1500));
  }

  const jsonPath = join(__dirname, "../src/lib/candidatePhotos.json");
  await writeFile(jsonPath, JSON.stringify(photos, null, 2));
  console.log(`\nWrote ${Object.keys(photos).length} URLs to ${jsonPath}`);
}

main();
