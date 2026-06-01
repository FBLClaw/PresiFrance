import { PRESIDENTIAL_YEARS_DESC, PresidentialYear } from "@/lib/elections";

export interface PresidentialYearSummary {
  year: PresidentialYear;
  winner: string;
  runnerUp: string;
  angle: string;
}

export const PRESIDENTIAL_YEAR_SUMMARIES: PresidentialYearSummary[] = [
  { year: 2022, winner: "Emmanuel Macron", runnerUp: "Marine Le Pen", angle: "résultats par commune, participation et second tour" },
  { year: 2017, winner: "Emmanuel Macron", runnerUp: "Marine Le Pen", angle: "recomposition politique et résultats locaux" },
  { year: 2012, winner: "François Hollande", runnerUp: "Nicolas Sarkozy", angle: "alternance nationale et cartes locales" },
  { year: 2007, winner: "Nicolas Sarkozy", runnerUp: "Ségolène Royal", angle: "participation élevée et duel droite-gauche" },
  { year: 2002, winner: "Jacques Chirac", runnerUp: "Jean-Marie Le Pen", angle: "séisme électoral et second tour atypique" },
  { year: 1995, winner: "Jacques Chirac", runnerUp: "Lionel Jospin", angle: "résultats historiques de la présidentielle" },
  { year: 1988, winner: "François Mitterrand", runnerUp: "Jacques Chirac", angle: "réélection et rapports de force locaux" },
  { year: 1981, winner: "François Mitterrand", runnerUp: "Valéry Giscard d'Estaing", angle: "première alternance de la Ve République" },
  { year: 1974, winner: "Valéry Giscard d'Estaing", runnerUp: "François Mitterrand", angle: "scrutin serré et recomposition du centre" },
  { year: 1969, winner: "Georges Pompidou", runnerUp: "Alain Poher", angle: "après De Gaulle, nouvelle majorité présidentielle" },
  { year: 1965, winner: "Charles de Gaulle", runnerUp: "François Mitterrand", angle: "première présidentielle au suffrage universel direct" },
];

export function getPresidentialYearSummary(year: number): PresidentialYearSummary | undefined {
  return PRESIDENTIAL_YEAR_SUMMARIES.find((summary) => summary.year === year);
}

export function isPresidentialYear(year: number): year is PresidentialYear {
  return PRESIDENTIAL_YEARS_DESC.includes(year as PresidentialYear);
}
