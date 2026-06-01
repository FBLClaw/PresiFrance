import { GeoCommune } from "@/lib/api/geoApi";

const STORAGE_KEY = "depenses-publiques-history";
const MAX_ITEMS = 8;

export interface HistoryEntry {
  code: string;
  nom: string;
  codeDepartement: string;
  population: number;
  visitedAt: number;
}

export function getSearchHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function addToSearchHistory(commune: GeoCommune): void {
  try {
    const history = getSearchHistory().filter(h => h.code !== commune.code);
    history.unshift({
      code: commune.code,
      nom: commune.nom,
      codeDepartement: commune.codeDepartement,
      population: commune.population,
      visitedAt: Date.now(),
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_ITEMS)));
  } catch {
    // Silently fail
  }
}

export function clearSearchHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
