const rid = "79b5cac4-4957-486b-bbda-322d80868224";
const base = `https://tabular-api.data.gouv.fr/api/resources/${rid}/data/?`;

let page = 1;
const pageSize = 200;
const seen = new Set();
let total = 0;

while (true) {
  const params = new URLSearchParams({
    "Code du département__exact": "44",
    "Code de la commune__exact": "109",
    page: String(page),
    page_size: String(pageSize),
  });

  const res = await fetch(base + params);
  if (!res.ok) {
    console.error("HTTP", res.status, await res.text());
    process.exit(1);
  }
  const j = await res.json();
  const data = j.data || [];

  total += data.length;
  for (const r of data) {
    const nom = r["Nom"];
    const prenom = r["Prénom"];
    if (nom) seen.add(`${prenom ?? ""} ${nom}`.trim());
  }

  if (data.length < pageSize || !j.links?.next) break;
  page++;
  if (page > 200) break;
}

console.log(
  JSON.stringify(
    { pages: page, totalRows: total, uniqueCandidates: seen.size, sample: [...seen].slice(0, 30) },
    null,
    2
  )
);

