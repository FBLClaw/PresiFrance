export type PromiseStatus = "tenu" | "partiel" | "non_tenu" | "en_cours" | "non_evalue";

export interface MacronPromiseSource {
  label: string;
  url: string;
}

export interface MacronPromiseItem {
  id: string;
  theme: string;
  promise: string;
  status: PromiseStatus;
  note: string;
  sources: MacronPromiseSource[];
}

export interface ReferenceTally {
  id: string;
  label: string;
  url: string;
  scope: string;
  counts: {
    tenu: number;
    partiel: number;
    non_tenu: number;
    /** Ex. promesses « inévaluables » dans la grille Lui Président */
    non_evalue?: number;
  };
}

export interface MacronPromisesBilan {
  meta: {
    title: string;
    scope: string;
    disclaimer: string;
    methodologyNote: string;
  };
  /** Bilans publiés par des médias (effectifs réels), distincts du fichier `items`. */
  referenceTallies?: ReferenceTally[];
  globalReferences: MacronPromiseSource[];
  items: MacronPromiseItem[];
}

export async function getMacronPromisesBilan(): Promise<MacronPromisesBilan> {
  const res = await fetch("/data/presidential/macron-promises-bilan.json");
  if (!res.ok) throw new Error("Impossible de charger le comparatif promesses / bilan.");
  return res.json() as Promise<MacronPromisesBilan>;
}
