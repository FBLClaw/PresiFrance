// API service for geo.api.gouv.fr — Commune search
// Dev: Vite proxies /api-geo → geo.api.gouv.fr. Prod: call the API directly (static hosts have no proxy).

export interface GeoCommune {
  nom: string;
  code: string; // code INSEE
  codesPostaux: string[];
  codeDepartement: string;
  codeRegion: string;
  population: number;
  departement?: { code: string; nom: string };
  region?: { code: string; nom: string };
}

const GEO_API_BASE = import.meta.env.DEV ? "/api-geo" : "https://geo.api.gouv.fr";

export async function searchCommunes(query: string, limit = 50): Promise<GeoCommune[]> {
  if (!query || query.length < 2) return [];

  const isPostalCode = /^\d{2,5}$/.test(query.trim());
  const params = new URLSearchParams({
    ...(isPostalCode ? { codePostal: query.trim() } : { nom: query.trim() }),
    boost: "population",
    limit: String(limit),
    fields: "nom,code,codesPostaux,codeDepartement,codeRegion,population",
  });

  const response = await fetch(`${GEO_API_BASE}/communes?${params}`);
  if (!response.ok) throw new Error(`Geo API error: ${response.status}`);
  return response.json();
}

export async function getCommuneByCode(code: string): Promise<GeoCommune | null> {
  const response = await fetch(
    `${GEO_API_BASE}/communes/${code}?fields=nom,code,codesPostaux,codeDepartement,codeRegion,population`
  );
  if (!response.ok) return null;
  return response.json();
}

export async function getDepartementName(code: string): Promise<string> {
  try {
    const response = await fetch(`${GEO_API_BASE}/departements/${code}`);
    if (!response.ok) return code;
    const data = await response.json();
    return `${data.nom} (${data.code})`;
  } catch {
    return code;
  }
}

export async function getRegionName(code: string): Promise<string> {
  try {
    const response = await fetch(`${GEO_API_BASE}/regions/${code}`);
    if (!response.ok) return code;
    const data = await response.json();
    return data.nom;
  } catch {
    return code;
  }
}

export interface GeoRegion {
  code: string;
  nom: string;
}

export async function getAllRegions(): Promise<GeoRegion[]> {
  try {
    const response = await fetch(`${GEO_API_BASE}/regions`);
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

export interface GeoCommuneWithCoords extends GeoCommune {
  centre?: { type: string; coordinates: [number, number] }; // [lon, lat]
}

export async function getCommuneWithCoords(code: string): Promise<GeoCommuneWithCoords | null> {
  const response = await fetch(
    `${GEO_API_BASE}/communes/${code}?fields=nom,code,codesPostaux,codeDepartement,codeRegion,population,centre`
  );
  if (!response.ok) return null;
  return response.json();
}

export async function getDepartmentCommunes(
  depCode: string
): Promise<GeoCommuneWithCoords[]> {
  const response = await fetch(
    `${GEO_API_BASE}/departements/${depCode}/communes?fields=nom,code,codesPostaux,codeDepartement,codeRegion,population,centre&limit=1000`
  );
  if (!response.ok) return [];
  const all: GeoCommuneWithCoords[] = await response.json();
  return all.filter((c) => c.centre?.coordinates);
}
