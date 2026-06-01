/**
 * Photos des candidats à l'élection présidentielle.
 * URLs récupérées via l'API Wikipedia (Wikimedia Commons).
 * Mise à jour : npm run build:photos (ou node scripts/fetch-candidate-photos.mjs)
 */
import photos from "./candidatePhotos.json";

export const CANDIDATE_PHOTOS: Record<string, string> = photos;

export function getCandidatePhotoUrl(prenom: string, nom: string): string | null {
  const key = `${prenom} ${nom.toUpperCase()}`;
  return CANDIDATE_PHOTOS[key] ?? null;
}
