import { getDepartmentName } from "@/lib/departments";

export function getDepartmentIntro(code?: string): string {
  const name = getDepartmentName(code);
  return `Cette page regroupe les communes du département ${name} pour accéder rapidement aux résultats des élections présidentielles. Sélectionnez une commune afin de consulter les scores des candidats, la participation, l'abstention et les données disponibles par année. PrésiFrance s'appuie sur des données officielles en open data pour faciliter la comparaison locale et replacer chaque commune dans son contexte départemental.`;
}
