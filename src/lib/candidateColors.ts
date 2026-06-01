/**
 * Couleurs par candidat (clé = nom complet ou nom seul selon les jeux de données).
 * Construit via `Map` : en cas de clés répétées entre années, la dernière occurrence l’emporte (comme un littéral d’objet JS).
 */
const CANDIDATE_COLOR_ENTRIES: [string, string][] = [
  // 2022
  ["Emmanuel MACRON", "#0091ff"],
  ["Marine LE PEN", "#004494"],
  ["Jean-Luc MÉLENCHON", "#cc2443"],
  ["Éric ZEMMOUR", "#404040"],
  ["Valérie PÉCRESSE", "#0066cc"],
  ["Yannick JADOT", "#00c000"],
  ["Jean LASSALLE", "#0091ff"],
  ["Fabien ROUSSEL", "#dd0000"],
  ["Nicolas DUPONT-AIGNAN", "#0082c4"],
  ["Anne HIDALGO", "#ff4000"],
  ["Philippe POUTOU", "#bb0000"],
  ["Nathalie ARTHAUD", "#8b0000"],
  // 2017
  ["François FILLON", "#0066cc"],
  ["Benoît HAMON", "#ff6b35"],
  // 1974 (CDSP circ, NOM only)
  ["GISCARD D'ESTAING", "#0066cc"],
  ["MITTERRAND", "#cc2443"],
  ["CHABAN-DELMAS", "#0066cc"],
  ["ROYER", "#404040"],
  ["LAGUILLER", "#8b0000"],
  ["DUMONT", "#00c000"],
  ["LE PEN", "#004494"],
  ["MULLER", "#cc2443"],
  ["KRIVINE", "#dd0000"],
  ["RENOUVIN", "#666666"],
  ["SEBAG", "#666666"],
  ["HERAUD", "#666666"],
  // 1969 (CDSP circ)
  ["POHER", "#0066cc"],
  ["DE GAULLE", "#0066cc"],
  ["DUCLOS", "#dd0000"],
  ["ROCHER", "#404040"],
  // 1965 (CDSP circ)
  ["DE GAULLE", "#0066cc"],
  ["MITTERRAND", "#cc2443"],
  ["LECANUET", "#0066cc"],
  ["MARCILHACY", "#404040"],
  ["TIXIER-VIGNANCOUR", "#004494"],
  ["BARBU", "#666666"],
  // 1981 (CDSP commp9000, NOM only)
  ["MITTERRAND", "#cc2443"],
  ["GISCARD D'ESTAING", "#0066cc"],
  ["MARCHAIS", "#dd0000"],
  ["LALONDE", "#00c000"],
  ["CREPEAU", "#cc2443"],
  ["CHIRAC", "#0066cc"],
  ["LAGUILLER", "#8b0000"],
  ["BOUCHARDEAU", "#cc2443"],
  ["DEBRE", "#0066cc"],
  ["GARAUD", "#404040"],
  // 1988 (CDSP uses NOM only)
  ["MITTERRAND", "#cc2443"],
  ["CHIRAC", "#0066cc"],
  ["BARRE", "#0066cc"],
  ["LE PEN", "#004494"],
  ["LAJOINIE", "#dd0000"],
  ["WAECHTER", "#00c000"],
  ["JUQUIN", "#dd0000"],
  ["LAGUILLER", "#8b0000"],
  ["BOUSSEL", "#8b0000"],
  // 1995
  ["Jacques CHIRAC", "#0066cc"],
  ["Lionel JOSPIN", "#cc2443"],
  ["Édouard BALLADUR", "#0066cc"],
  ["Jean-Marie LE PEN", "#004494"],
  ["Arlette LAGUILLER", "#8b0000"],
  ["Robert HUE", "#dd0000"],
  ["Dominique VOYNET", "#00c000"],
  ["Philippe de VILLIERS", "#0066cc"],
  ["Jacques CHEVENEMENT", "#cc2443"],
  ["Edouard BALLADUR", "#0066cc"],
  // 2002
  ["Jacques CHIRAC", "#0066cc"],
  ["Jean-Marie LE PEN", "#004494"],
  ["Lionel JOSPIN", "#cc2443"],
  ["François BAYROU", "#ffcc00"],
  ["Arlette LAGUILLER", "#8b0000"],
  ["Jean-Pierre CHEVÈNEMENT", "#cc2443"],
  ["Noël MAMÈRE", "#00c000"],
  ["Olivier BESANCENOT", "#dd0000"],
  ["Jean SAINT-JOSSE", "#404040"],
  ["Alain MADELIN", "#0066cc"],
  ["Robert HUE", "#dd0000"],
  ["Bruno MÉGRET", "#004494"],
  ["Christiane TAUBIRA", "#cc2443"],
  ["Corinne LEPAGE", "#00c000"],
  ["Christine BOUTIN", "#0066cc"],
  ["Daniel GLUCKSTEIN", "#8b0000"],
  // 2007
  ["Nicolas SARKOZY", "#0066cc"],
  ["Ségolène ROYAL", "#cc2443"],
  ["François BAYROU", "#ffcc00"],
  ["Jean-Marie LE PEN", "#004494"],
  ["Olivier BESANCENOT", "#dd0000"],
  ["Philippe de VILLIERS", "#0066cc"],
  ["Marie-George BUFFET", "#dd0000"],
  ["Dominique VOYNET", "#00c000"],
  ["Arlette LAGUILLER", "#8b0000"],
  ["José BOVÉ", "#00c000"],
  ["Frédéric NIHOUS", "#404040"],
  ["Gérard SCHIVARDI", "#666666"],
  // 2012
  ["Nicolas SARKOZY", "#0066cc"],
  ["François HOLLANDE", "#cc2443"],
  ["Marine LE PEN", "#004494"],
  ["Jean-Luc MÉLENCHON", "#cc2443"],
  ["François BAYROU", "#ffcc00"],
  ["Eva JOLY", "#00c000"],
  ["Nathalie ARTHAUD", "#8b0000"],
  ["Philippe POUTOU", "#bb0000"],
  ["Jacques CHEMINADE", "#666666"],
  ["Nicolas DUPONT-AIGNAN", "#0082c4"],
];

export const CANDIDATE_COLORS: Record<string, string> = Object.fromEntries(new Map(CANDIDATE_COLOR_ENTRIES));

const FALLBACK_PALETTE = [
  "#0091ff",
  "#cc2443",
  "#004494",
  "#00c000",
  "#ff6b35",
  "#8b0000",
  "#0066cc",
  "#404040",
  "#0082c4",
  "#ffcc00",
  "#666666",
  "#ff4000",
  "#bb0000",
];

export function getCandidateColor(prenom: string, nom: string, index: number): string {
  const full = `${prenom} ${nom.toUpperCase()}`;
  const nomOnly = nom.toUpperCase();
  const exact = CANDIDATE_COLORS[full] ?? CANDIDATE_COLORS[nomOnly];
  if (exact) return exact;
  const key = Object.keys(CANDIDATE_COLORS).find((k) => k.toUpperCase() === full.toUpperCase());
  return (key ? CANDIDATE_COLORS[key] : null) ?? FALLBACK_PALETTE[index % FALLBACK_PALETTE.length];
}
