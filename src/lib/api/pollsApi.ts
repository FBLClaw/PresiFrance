export interface PollMetaSource {
  label: string;
  url: string;
  license?: string;
}

export interface PollsMeta {
  electionYear: number;
  round: number;
  electionDate: string;
  tableNote?: string;
  sources: PollMetaSource[];
}

export interface PollCandidateRef {
  id: string;
  label: string;
}

export interface PollEntry {
  pollster: string;
  fieldworkEnd: string;
  sampleSize: number | null;
  scores: Record<string, number>;
}

export interface PollsDataset {
  meta: PollsMeta;
  candidates: PollCandidateRef[];
  polls: PollEntry[];
}

export type PollChartRow = { date: string; labelShort: string } & Record<string, number | string | undefined>;

export async function getPolls2022Round1(): Promise<PollsDataset> {
  const res = await fetch("/data/presidential/polls-2022-round1.json");
  if (!res.ok) throw new Error("Impossible de charger les sondages.");
  return res.json() as Promise<PollsDataset>;
}

function addDaysIso(iso: string, delta: number): string {
  const base = new Date(`${iso}T12:00:00.000Z`);
  base.setUTCDate(base.getUTCDate() + delta);
  return base.toISOString().slice(0, 10);
}

/** Moyenne pondérée (taille d’échantillon) des sondages dont la fin de terrain tombe dans la fenêtre glissante. */
export function buildSmoothedPollTrend(
  dataset: PollsDataset,
  candidateIds: readonly string[],
  windowDays: number,
): PollChartRow[] {
  const { polls, meta } = dataset;
  if (polls.length === 0) return [];

  const start = polls[0].fieldworkEnd;
  const end = meta.electionDate;
  const rows: PollChartRow[] = [];

  for (let d = start; d <= end; d = addDaysIso(d, 1)) {
    const lo = addDaysIso(d, -(windowDays - 1));
    const inWindow = polls.filter((p) => p.fieldworkEnd >= lo && p.fieldworkEnd <= d);

    const row: PollChartRow = {
      date: d,
      labelShort: new Date(`${d}T12:00:00.000Z`).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      }),
    };

    for (const id of candidateIds) {
      let num = 0;
      let den = 0;
      for (const p of inWindow) {
        const v = p.scores[id];
        if (v === undefined) continue;
        const w = p.sampleSize != null && p.sampleSize > 0 ? p.sampleSize : 1;
        num += v * w;
        den += w;
      }
      if (den > 0) row[id] = Math.round((num / den) * 10) / 10;
    }

    rows.push(row);
  }

  return rows;
}
