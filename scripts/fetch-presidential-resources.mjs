/**
 * Fetch French presidential election resources from data.gouv.fr
 * and extract "subcom" TXT URLs for each year + round.
 *
 * Usage:
 *   node scripts/fetch-presidential-resources.mjs
 */

const API_BASE = "https://www.data.gouv.fr/api/1";

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function searchDatasets(q, pageSize = 20) {
  const url = `${API_BASE}/datasets/?q=${encodeURIComponent(q)}&page_size=${pageSize}`;
  const j = await fetchJson(url);
  return j.data || [];
}

function pickSubcomTxtUrl(resources, round) {
  const r = resources.find(
    (x) =>
      typeof x?.title === "string" &&
      x.title.includes(`resultats-par-niveau-subcom-t${round}`) &&
      String(x.format || "").toLowerCase() === "txt" &&
      typeof x.url === "string" &&
      x.url.includes("static.data.gouv.fr")
  );
  return r?.url || null;
}

function extractYear(s) {
  const m = String(s).match(/\b(19\d{2}|20\d{2})\b/);
  return m ? Number(m[1]) : null;
}

async function findDatasetFor(year, round) {
  const roundLabel = round === 1 ? "1er tour" : "2nd tour";
  const queries = [
    `election presidentielle ${year} resultats definitifs ${roundLabel}`,
    `élection présidentielle ${year} résultats définitifs ${roundLabel}`,
    `election presidentielle ${year} resultats ${roundLabel}`,
    `élection présidentielle ${year} résultats ${roundLabel}`,
    // fallback
    `election presidentielle ${year} resultats`,
  ];

  for (const q of queries) {
    const results = await searchDatasets(q, 25);
    const y = (d) => extractYear(d?.title) === year;
    const mi = (d) => d?.organization?.acronym === "MI";

    const hit =
      results.find((d) => mi(d) && y(d) && String(d?.title || "").toLowerCase().includes(roundLabel)) ||
      results.find((d) => y(d) && String(d?.title || "").toLowerCase().includes(roundLabel)) ||
      results.find((d) => mi(d) && y(d)) ||
      results.find((d) => y(d)) ||
      null;
    if (hit) return hit;
  }
  return null;
}

async function main() {
  // Known presidential election years (5th Republic) commonly available as open data
  const years = [1965, 1969, 1974, 1981, 1988, 1995, 2002, 2007, 2012, 2017, 2022];

  const out = {};

  for (const year of years) {
    const ds1 = await findDatasetFor(year, 1);
    const ds2 = await findDatasetFor(year, 2);

    const r1 = ds1?.resources || [];
    const r2 = ds2?.resources || [];

    out[year] = {
      t1: ds1 ? { dataset: { id: ds1.id, slug: ds1.slug, title: ds1.title }, subcom_txt: pickSubcomTxtUrl(r1, 1) } : null,
      t2: ds2 ? { dataset: { id: ds2.id, slug: ds2.slug, title: ds2.title }, subcom_txt: pickSubcomTxtUrl(r2, 2) } : null,
    };
  }

  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

