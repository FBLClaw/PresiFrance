/**
 * Regénère public/data/presidential/polls-2022-round1.json depuis la page Wikipédia EN
 * (table « Official campaign » — 1er tour, liste officielle des candidats).
 *
 * Usage : placer .tmp-wiki-polls.json (réponse API parse) à la racine, ou le script le télécharge.
 *   node scripts/build-polls-2022-round1.mjs
 */
import fs from "fs";
import https from "https";

const OUT = "public/data/presidential/polls-2022-round1.json";
const TMP = ".tmp-wiki-polls.json";
const WIKI_API =
  "https://en.wikipedia.org/w/api.php?action=parse&page=Opinion_polling_for_the_2022_French_presidential_election&prop=text&format=json";

const MONTH = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

const KEYS = [
  "arthaud",
  "poutou",
  "roussel",
  "melenchon",
  "hidalgo",
  "jadot",
  "macron",
  "pecresse",
  "lassalle",
  "dupont_aignan",
  "le_pen",
  "zemmour",
];

function fetchWiki() {
  return new Promise((resolve, reject) => {
    https
      .get(WIKI_API, { headers: { "User-Agent": "PresiFrance/1.0 (build script)" } }, (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      })
      .on("error", reject);
  });
}

function stripTags(s) {
  return s
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseFieldworkEnd(cellHtml) {
  const text = stripTags(cellHtml).replace(/\[\d+\]/g, "");
  const normalized = text.replace(/\u2013/g, "-").replace(/\u2014/g, "-");
  const lastPart = normalized.split("-").pop().trim();
  const re = /(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/;
  const m = lastPart.match(re) || normalized.match(re);
  if (!m) return null;
  const d = Number(m[1]);
  const mon = MONTH[m[2]];
  const y = Number(m[3]);
  if (mon === undefined || !y) return null;
  const iso = new Date(Date.UTC(y, mon, d)).toISOString().slice(0, 10);
  return iso;
}

function parseSample(cellHtml) {
  const t = stripTags(cellHtml).replace(/,/g, "");
  if (t === "-" || t === "–" || t === "") return null;
  const n = parseInt(t, 10);
  return Number.isFinite(n) ? n : null;
}

function parsePct(cellHtml) {
  const t = stripTags(cellHtml);
  if (!t || t === "–" || t === "—" || t === "?") return null;
  if (/^<\s*1/i.test(t) || /^<\s*0[,.]5/i.test(t)) return 0.25;
  const m = t.match(/(\d+(?:\.\d+)?)\s*%/);
  if (!m) return null;
  return Number(m[1]);
}

function extractCells(trHtml) {
  const cells = [];
  const re = /<(t[dh])[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = re.exec(trHtml)) !== null) {
    cells.push(m[2]);
  }
  return cells;
}

async function main() {
  let raw;
  if (fs.existsSync(TMP)) {
    raw = fs.readFileSync(TMP, "utf8");
  } else {
    raw = await fetchWiki();
    fs.writeFileSync(TMP, raw);
  }
  const json = JSON.parse(raw);
  const html = json.parse.text["*"];

  const start = html.indexOf("This table below lists polls completed since");
  if (start === -1) throw new Error("Marker not found");
  const ts = html.indexOf('<table class="wikitable', start);
  const te = html.indexOf("</table>", ts);
  if (ts === -1 || te === -1) throw new Error("Table not found");
  const tableHtml = html.slice(ts, te + 8);

  const trs = tableHtml.split(/<tr[^>]*>/i).slice(1);
  const polls = [];

  for (const tr of trs) {
    const cells = extractCells(tr);
    if (cells.length < 3 + KEYS.length) continue;

    const pollster = stripTags(cells[0]);
    const fw = cells[1];
    const sampleCell = cells[2];
    const end = parseFieldworkEnd(fw);
    if (!end) continue;

    const sampleSize = parseSample(sampleCell);
    const scoreCells = cells.slice(3, 3 + KEYS.length);
    if (scoreCells.length < KEYS.length) continue;

    const scores = {};
    let any = false;
    KEYS.forEach((k, i) => {
      const v = parsePct(scoreCells[i]);
      if (v !== null) {
        scores[k] = v;
        any = true;
      }
    });
    if (!any) continue;

    if (/2022 election/i.test(pollster) || pollster.includes("Election")) {
      continue;
    }

    polls.push({
      pollster,
      fieldworkEnd: end,
      sampleSize,
      scores,
    });
  }

  polls.sort((a, b) => a.fieldworkEnd.localeCompare(b.fieldworkEnd));

  const payload = {
    meta: {
      electionYear: 2022,
      round: 1,
      electionDate: "2022-04-10",
      tableNote:
        "Intentions de vote 1er tour, sondages après publication de la liste officielle des candidats (7 mars 2022).",
      sources: [
        {
          label: "Wikipédia (en) — Opinion polling for the 2022 French presidential election",
          url: "https://en.wikipedia.org/wiki/Opinion_polling_for_the_2022_French_presidential_election",
          license: "Texte Wikipédia sous CC BY-SA ; vérifier les notices des instituts pour réutilisation commerciale.",
        },
      ],
    },
    candidates: [
      { id: "macron", label: "Emmanuel Macron" },
      { id: "le_pen", label: "Marine Le Pen" },
      { id: "melenchon", label: "Jean-Luc Mélenchon" },
      { id: "zemmour", label: "Éric Zemmour" },
      { id: "pecresse", label: "Valérie Pécresse" },
      { id: "jadot", label: "Yannick Jadot" },
      { id: "hidalgo", label: "Anne Hidalgo" },
      { id: "dupont_aignan", label: "Nicolas Dupont-Aignan" },
      { id: "lassalle", label: "Jean Lassalle" },
      { id: "roussel", label: "Fabien Roussel" },
      { id: "poutou", label: "Philippe Poutou" },
      { id: "arthaud", label: "Nathalie Arthaud" },
    ],
    polls,
  };

  fs.mkdirSync("public/data/presidential", { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2), "utf8");
  console.log(`Wrote ${polls.length} polls to ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
