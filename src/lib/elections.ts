export type PresidentialYear =
  | 1965
  | 1969
  | 1974
  | 1981
  | 1988
  | 1995
  | 2002
  | 2007
  | 2012
  | 2017
  | 2022;

export type Round = 1 | 2;

export type ElectionSource =
  | { kind: "subcom_txt"; url: string }
  | { kind: "unavailable"; reason: string; datasetUrl?: string };

export type PresidentialElectionConfig = Record<PresidentialYear, Record<Round, ElectionSource>>;

export const PRESIDENTIAL_ELECTIONS: PresidentialElectionConfig = {
  1965: {
    1: { kind: "unavailable", reason: "Données communes indisponibles (dataset publié par département uniquement)." },
    2: { kind: "unavailable", reason: "Données communes indisponibles (dataset publié par département uniquement)." },
  },
  1969: {
    1: { kind: "unavailable", reason: "Données communes indisponibles (dataset publié par département uniquement)." },
    2: { kind: "unavailable", reason: "Données communes indisponibles (dataset publié par département uniquement)." },
  },
  1974: {
    1: { kind: "unavailable", reason: "Données communes indisponibles (dataset publié par département uniquement)." },
    2: { kind: "unavailable", reason: "Données communes indisponibles (dataset publié par département uniquement)." },
  },
  1981: {
    1: { kind: "unavailable", reason: "Données communes indisponibles (dataset publié par département uniquement)." },
    2: { kind: "unavailable", reason: "Données communes indisponibles (dataset publié par département uniquement)." },
  },
  1988: {
    1: { kind: "unavailable", reason: "Données communes indisponibles (dataset publié par département uniquement)." },
    2: { kind: "unavailable", reason: "Données communes indisponibles (dataset publié par département uniquement)." },
  },
  1995: {
    1: { kind: "unavailable", reason: "Données communes indisponibles dans la source actuelle (pas de fichier 'subcom' exploitable)." },
    2: { kind: "unavailable", reason: "Données communes indisponibles dans la source actuelle (pas de fichier 'subcom' exploitable)." },
  },
  2002: {
    1: { kind: "unavailable", reason: "Données communes indisponibles dans la source actuelle (pas de fichier 'subcom' exploitable)." },
    2: { kind: "unavailable", reason: "Données communes indisponibles dans la source actuelle (pas de fichier 'subcom' exploitable)." },
  },
  2007: {
    1: { kind: "unavailable", reason: "Données communes indisponibles dans la source actuelle (pas de fichier 'subcom' exploitable)." },
    2: { kind: "unavailable", reason: "Données communes indisponibles dans la source actuelle (pas de fichier 'subcom' exploitable)." },
  },
  2012: {
    1: { kind: "unavailable", reason: "Données communes indisponibles dans la source actuelle (pas de fichier 'subcom' exploitable)." },
    2: { kind: "unavailable", reason: "Données communes indisponibles dans la source actuelle (pas de fichier 'subcom' exploitable)." },
  },
  2017: {
    1: { kind: "unavailable", reason: "Données communes indisponibles dans la source actuelle (fichier XLS non parsé ici)." },
    2: { kind: "unavailable", reason: "Données communes indisponibles dans la source actuelle (fichier XLS non parsé ici)." },
  },
  2022: {
    1: {
      kind: "subcom_txt",
      url: "https://static.data.gouv.fr/resources/election-presidentielle-des-10-et-24-avril-2022-resultats-definitifs-du-1er-tour/20220414-152459/resultats-par-niveau-subcom-t1-france-entiere.txt",
    },
    2: {
      kind: "subcom_txt",
      url: "https://static.data.gouv.fr/resources/election-presidentielle-des-10-et-24-avril-2022-resultats-definitifs-du-2nd-tour/20220428-142333/resultats-par-niveau-subcom-t2-france-entiere.txt",
    },
  },
};

export const PRESIDENTIAL_YEARS_DESC: PresidentialYear[] = [2022, 2017, 2012, 2007, 2002, 1995, 1988, 1981, 1974, 1969, 1965];

export const DEFAULT_YEAR: PresidentialYear = 2022;

