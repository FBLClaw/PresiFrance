/**
 * Rend transparents les pixels très sombres (fond noir exporté à la place du canal alpha).
 * Usage : node scripts/logo-remove-black-bg.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const inputPath = path.join(root, "public", "logo.png");

async function main() {
  let sharp;
  try {
    ({ default: sharp } = await import("sharp"));
  } catch {
    console.error("Installe sharp : npm install -D sharp");
    process.exit(1);
  }

  const buf = fs.readFileSync(inputPath);
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const out = Buffer.from(data);

  // Pixels quasi noirs (fond) -> alpha 0. On évite d'effacer le bleu marine du logo (souvent B plus élevé).
  for (let i = 0; i < out.length; i += 4) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    // Fond noir / gris très foncé uniforme
    const isNearBlack = max < 38 && max - min < 15;
    if (isNearBlack) {
      out[i + 3] = 0;
    }
  }

  await sharp(out, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(inputPath);

  console.log("[logo-remove-black-bg] OK ->", inputPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
