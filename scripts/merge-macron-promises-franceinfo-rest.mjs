/**
 * One-shot merge: append franceinfo "tenu" + "partiel" rows (not already in base JSON)
 * so total counts match referenceTallies 47 / 28 / 25 on 100 lines.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, "../public/data/presidential/macron-promises-bilan.json");

const FI =
  "https://www.franceinfo.fr/elections/presidentielle/bilan-macron-on-a-verifie-100-promesses-phares-programme-2017-combien-en-a-t-il-tenues.html";
const DECODEURS =
  "https://www.lemonde.fr/les-decodeurs/article/2022/03/12/emmanuel-macron-a-t-il-tenu-ses-400-promesses-de-campagne_6117218_4355770.html";

const extraItems = [
  // —— 35 × tenu (franceinfo, mars 2022) — complètent le socle déjà présent (12 tenu) → 47
  {
    id: "fi-t-assurance-chomage-tous",
    theme: "Économie & emploi",
    promise: "Permettre à tous les travailleurs (y compris indépendants) d’accéder à l’assurance-chômage.",
    status: "tenu",
    note: "franceinfo : loi « avenir professionnel » ; périmètre et conditions encore débattus mais promesse classée tenue dans leur barème.",
    sources: [
      { label: "franceinfo — 100 mesures (tenue)", url: FI },
      { label: "Les Décodeurs", url: DECODEURS },
    ],
  },
  {
    id: "fi-t-droit-oubli",
    theme: "Santé",
    promise: "Renforcer le droit à l’oubli des malades (cancer, hépatite C) pour l’assurance-emprunt.",
    status: "tenu",
    note: "Texte adopté en 2022 ; délais et extensions discutés mais objectif principal jugé atteint par franceinfo.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-procedure-dematerialisee",
    theme: "Justice",
    promise: "Créer une procédure judiciaire dématérialisée pour les petits litiges de la vie quotidienne.",
    status: "tenu",
    note: "franceinfo : loi de programmation de la justice (2019), plafond relevé à 5 000 €.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-camera-pieton",
    theme: "Sécurité",
    promise: "Généraliser les caméras-piétons pour les contrôles d’identité.",
    status: "tenu",
    note: "franceinfo : déploiement massif annoncé puis chiffré en cours de mandat ; promesse tenue dans leur analyse.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-service-sanitaire",
    theme: "Santé & formation",
    promise: "Créer un service sanitaire de trois mois pour les étudiants en santé (prévention, dépendance…).",
    status: "tenu",
    note: "franceinfo : dispositif en place ; durée réelle plus courte (semaines) mais engagement tenu.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-individualisation-ir",
    theme: "Fiscalité",
    promise: "Permettre l’individualisation du taux de prélèvement à la source pour les couples.",
    status: "tenu",
    note: "franceinfo : mécanisme disponible depuis le prélèvement à la source.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-lutte-separatisme",
    theme: "Sécurité & religion",
    promise: "Combattre l’idéologie jihadiste (fermetures de lieux, dissolutions d’associations…).",
    status: "tenu",
    note: "franceinfo : fermetures et loi « séparatisme » ; bilan sociologique discuté.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-tribunal-judiciaire",
    theme: "Justice",
    promise: "Fusionner les tribunaux d’instance et de grande instance en tribunal judiciaire par département.",
    status: "tenu",
    note: "franceinfo : réforme effective au 1er janvier 2020.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-francais-b1",
    theme: "Intégration",
    promise: "Renforcer la formation linguistique des étrangers en situation régulière (visée niveau B1).",
    status: "tenu",
    note: "franceinfo : loi asile-immigration 2018 et hausse des heures de français.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-frontex",
    theme: "Europe & migration",
    promise: "Renforcer le contingent et les moyens de Frontex aux frontières extérieures de l’UE.",
    status: "tenu",
    note: "franceinfo : règlement européen et montée en puissance des effectifs au-delà de l’objectif initial.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-aah-900",
    theme: "Handicap",
    promise: "Revaloriser l’AAH au-delà de 900 € pour une personne seule.",
    status: "tenu",
    note: "franceinfo : revalorisation puis évolutions du mode de calcul pour les couples.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-cantines-50",
    theme: "Alimentation",
    promise: "Imposer aux cantines scolaires et restauration collective un fort quota de produits durables / bio.",
    status: "tenu",
    note: "franceinfo : décret Egalim complémentaire au 1er janvier 2022.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-ega",
    theme: "Agriculture",
    promise: "Organiser les États généraux de l’alimentation et en tirer une loi (Egalim).",
    status: "tenu",
    note: "franceinfo : consultation 2017 puis lois Egalim 1 et 2.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-pic",
    theme: "Emploi & formation",
    promise: "Investir massivement dans les compétences (PIC, Garantie jeunes / parcours jeunes…).",
    status: "tenu",
    note: "franceinfo : volumes de personnes formées au-delà des objectifs annoncés.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-fonds-culture",
    theme: "Culture",
    promise: "Créer un fonds d’investissement de 200 M€ pour les industries culturelles françaises.",
    status: "tenu",
    note: "franceinfo : annonce puis enveloppe légèrement supérieure (225 M€).",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-pass-culture",
    theme: "Culture",
    promise: "Généraliser le Pass culture pour les jeunes (montants et tranches d’âge réajustés).",
    status: "tenu",
    note: "franceinfo : dispositif étendu avec évolution des montants (300 € puis parcours scolaire).",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-prime-activite",
    theme: "Pouvoir d’achat",
    promise: "Augmenter fortement la prime d’activité pour les salariés au SMIC (ordre de +80 € / mois).",
    status: "tenu",
    note: "franceinfo : revalorisations successives, proche de la promesse pour le profil SMIC.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-islam-1905",
    theme: "Laïcité",
    promise: "Aider à restructurer l’islam de France (statut cultuel, financement des lieux…).",
    status: "tenu",
    note: "franceinfo : évolutions législatives (séparatisme) et instances (Forif) ; bilan qualitatif mitigé.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-outrage-sexiste",
    theme: "Égalité femmes-hommes",
    promise: "Durcir les sanctions contre le harcèlement sexiste dans l’espace public.",
    status: "tenu",
    note: "franceinfo : loi Schiappa, infraction « outrage sexiste ».",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-telephone-danger",
    theme: "Violences faites aux femmes",
    promise: "Accélérer la généralisation du téléphone grave danger.",
    status: "tenu",
    note: "franceinfo : hausse du nombre d’appareils ; généralisation encore incomplète.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-inclusion-numerique",
    theme: "Numérique",
    promise: "Lancer une stratégie d’inclusion numérique (accompagnement, formations, pass numérique…).",
    status: "tenu",
    note: "franceinfo : plans successifs et relance Covid.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-pilotage-chomage-etat",
    theme: "Emploi",
    promise: "Confier à l’État le pilotage du régime d’assurance-chômage (dernier mot en cas de blocage).",
    status: "tenu",
    note: "franceinfo : évolution après décret de carence et négociations ; reclassement ultérieur « tenu » dans leur grille.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-chomage-demission",
    theme: "Emploi",
    promise: "Ouvrir l’assurance-chômage aux démissionnaires dans des cas encadrés.",
    status: "tenu",
    note: "franceinfo : dispositif existant mais critères restrictifs et volumétrie faible.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-don-rtt",
    theme: "Vie en entreprise",
    promise: "Autoriser le don de RTT à un collègue aidant un proche handicapé ou dépendant.",
    status: "tenu",
    note: "franceinfo : loi 2018 puis extension au public.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-loi-hulot-hydro",
    theme: "Énergie",
    promise: "Interdire le gaz de schiste et ne plus délivrer de nouveaux permis d’exploration d’hydrocarbures.",
    status: "tenu",
    note: "franceinfo : loi « Hulot » ; exploitation existante jusqu’à échéances longues.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-renov-batiments-publics",
    theme: "Climat & bâtiments",
    promise: "Lancer un plan de rénovation énergétique des bâtiments publics (4 milliards d’euros).",
    status: "tenu",
    note: "franceinfo : enveloppe France Relance et suivi des projets.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-prime-casse",
    theme: "Mobilité",
    promise: "Instaurer ou généraliser une prime à la conversion automobile pour les véhicules polluants.",
    status: "tenu",
    note: "franceinfo : extension et pérennisation du dispositif.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-procedure-acceleree",
    theme: "Parlement",
    promise: "Faire de la procédure accélérée le mode d’examen par défaut des textes au Parlement.",
    status: "tenu",
    note: "franceinfo : usage massif de la procédure accélérée sous le quinquennat.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-bac",
    theme: "Éducation",
    promise: "Réformer le baccalauréat (spécialités, contrôle continu, épreuves finales).",
    status: "tenu",
    note: "franceinfo : réforme mise en œuvre pour les cohortes concernées.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-portables-ecole",
    theme: "Éducation",
    promise: "Interdire l’usage des téléphones portables à l’école primaire et au collège.",
    status: "tenu",
    note: "franceinfo : loi 2018 ; efficacité perçue diverse sur le terrain.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-stages-vacances",
    theme: "Éducation",
    promise: "Proposer des stages de remise à niveau en fin d’été (lutte contre la déperdition des savoirs).",
    status: "tenu",
    note: "franceinfo : dispositifs « réussite » et forte mobilisation post-Covid.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-fonction-publique-transfo",
    theme: "Fonction publique",
    promise: "Moderniser le statut des fonctionnaires et refondre les « grands corps » (administrateurs de l’État, INSP…).",
    status: "tenu",
    note: "franceinfo : loi de transformation et décrets 2021-2022.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-associations",
    theme: "Économie sociale",
    promise: "Réformer le droit des associations pour renforcer l’autonomie des structures subventionnées.",
    status: "tenu",
    note: "franceinfo : lois 2021 sur l’engagement associatif et la trésorerie.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-cse",
    theme: "Travail",
    promise: "Fusionner délégués du personnel, CE et CHSCT en un Comité social et économique (CSE).",
    status: "tenu",
    note: "franceinfo : échéance 2020 respectée pour la plupart des entreprises.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },
  {
    id: "fi-t-rsi",
    theme: "Protection sociale",
    promise: "Rattacher les indépendants au régime général de Sécurité sociale (fin du RSI).",
    status: "tenu",
    note: "franceinfo : bascule effective au 1er janvier 2020 après phase SSI.",
    sources: [{ label: "franceinfo — 100 mesures (tenue)", url: FI }],
  },

  // —— 18 × partiel → avec les 10 déjà dans le fichier = 28
  {
    id: "fi-p-zones-blanches",
    theme: "Numérique",
    promise: "Éliminer les « zones blanches » de couverture mobile.",
    status: "partiel",
    note: "franceinfo : progrès mais chantier incomplet et dépendant des engagements opérateurs.",
    sources: [{ label: "franceinfo — 100 mesures (partielle)", url: FI }],
  },
  {
    id: "fi-p-imams-france",
    theme: "Laïcité",
    promise: "Former des imams en France aux valeurs républicaines (diplômes universitaires…).",
    status: "partiel",
    note: "franceinfo : initiatives mais couverture limitée et divisions des représentations musulmanes.",
    sources: [{ label: "franceinfo — 100 mesures (partielle)", url: FI }],
  },
  {
    id: "fi-p-aspa",
    theme: "Retraites & pauvreté",
    promise: "Revaloriser le minimum vieillesse et réduire la pauvreté des personnes âgées.",
    status: "partiel",
    note: "franceinfo : montant ASPA au-delà de 900 € mais indicateurs de pauvreté des +65 ans dégradés avant Covid.",
    sources: [{ label: "franceinfo — 100 mesures (partielle)", url: FI }],
  },
  {
    id: "fi-p-index-egalite",
    theme: "Entreprises",
    promise: "Publier les noms des entreprises en retard sur l’égalité salariale femmes-hommes.",
    status: "partiel",
    note: "franceinfo : index obligatoire et public mais autre mécanisme que « liste de honte » initiale.",
    sources: [{ label: "franceinfo — 100 mesures (partielle)", url: FI }],
  },
  {
    id: "fi-p-gafam",
    theme: "Europe & numérique",
    promise: "Porter la régulation des GAFAM au niveau européen (agence, loyauté, fiscalité).",
    status: "partiel",
    note: "franceinfo : taxe services numériques et négociations DMA/DSA ; pas l’agence unique promise en 2017.",
    sources: [{ label: "franceinfo — 100 mesures (partielle)", url: FI }],
  },
  {
    id: "fi-p-demarches-ligne",
    theme: "Services publics",
    promise: "Rendre la quasi-totalité des démarches administratives accessibles en ligne d’ici 2022.",
    status: "partiel",
    note: "franceinfo : forte progression mais 100 % des « essentielles » non atteint selon leurs critères.",
    sources: [{ label: "franceinfo — 100 mesures (partielle)", url: FI }],
  },
  {
    id: "fi-p-msp",
    theme: "Santé des territoires",
    promise: "Doubler le nombre de maisons pluridisciplinaires de santé.",
    status: "partiel",
    note: "franceinfo : très proche du doublement ; incertitude sur le décompte final à l’échéance exacte.",
    sources: [{ label: "franceinfo — 100 mesures (partielle)", url: FI }],
  },
  {
    id: "fi-p-peines-courtes",
    theme: "Justice",
    promise: "Incarcérer les condamnés jusqu’à deux ans de prison ferme avant d’envisager un aménagement de peine.",
    status: "partiel",
    note: "franceinfo : loi 2019 mais seuils et exceptions différents de la promesse littérale.",
    sources: [{ label: "franceinfo — 100 mesures (partielle)", url: FI }],
  },
  {
    id: "fi-p-medecins-prevention",
    theme: "Santé",
    promise: "Revaloriser la médecine de ville pour la prévention (dont lutte contre le tabac).",
    status: "partiel",
    note: "franceinfo : quelques revalorisations ciblées ; consultation générique stable ; objectif « génération sans tabac » non acquis.",
    sources: [{ label: "franceinfo — 100 mesures (partielle)", url: FI }],
  },
  {
    id: "fi-p-deradicalisation",
    theme: "Sécurité",
    promise: "Créer des centres de déradicalisation fermés pour les personnes radicalisées.",
    status: "partiel",
    note: "franceinfo : échec du centre de Pontourny ; dispositifs en milieu ouvert (Pairs) à la place.",
    sources: [{ label: "franceinfo — 100 mesures (partielle)", url: FI }],
  },
  {
    id: "fi-p-logements-jeunes",
    theme: "Logement",
    promise: "Créer 30 000 logements « jeunes » dans le parc social (baux courts, sans caution…).",
    status: "partiel",
    note: "franceinfo : cadre légal tardif ; peu de chiffrage effectif à la fin du mandat.",
    sources: [{ label: "franceinfo — 100 mesures (partielle)", url: FI }],
  },
  {
    id: "fi-p-100-sante",
    theme: "Santé",
    promise: "100 % de prise en charge lunettes / dentaire / audio sans augmenter le coût des mutuelles.",
    status: "partiel",
    note: "franceinfo : réforme « 100 % santé » effective mais hausses de cotisations mutuelles signalées par les fédérations.",
    sources: [{ label: "franceinfo — 100 mesures (partielle)", url: FI }],
  },
  {
    id: "fi-p-micro-entreprise",
    theme: "Économie",
    promise: "Supprimer les charges la première année et doubler les plafonds de la micro-entreprise.",
    status: "partiel",
    note: "franceinfo : plafonds relevés ; charges allégées mais pas supprimées (Acre conditionnelle).",
    sources: [{ label: "franceinfo — 100 mesures (partielle)", url: FI }],
  },
  {
    id: "fi-p-sportifs-haut-niveau",
    theme: "Sport",
    promise: "Que tous les sportifs de haut niveau soient en formation ou sous contrat avec une entreprise.",
    status: "partiel",
    note: "franceinfo : définition du « haut niveau » élargie ; objectif global non atteint sur la liste complète.",
    sources: [{ label: "franceinfo — 100 mesures (partielle)", url: FI }],
  },
  {
    id: "fi-p-cotisations-patronales-smic",
    theme: "Coût du travail",
    promise: "Atteindre zéro cotisation patronale « générale » au niveau du SMIC.",
    status: "partiel",
    note: "franceinfo : réductions importantes mais reste une cotisation résiduelle selon simulateurs.",
    sources: [{ label: "franceinfo — 100 mesures (partielle)", url: FI }],
  },
  {
    id: "fi-p-uni-recrutement",
    theme: "Enseignement supérieur",
    promise: "Permettre aux universités de recruter elles-mêmes leurs enseignants-chercheurs (hors CNU).",
    status: "partiel",
    note: "franceinfo : expérimentation jusqu’en 2024-2030, pas généralisation pleine.",
    sources: [{ label: "franceinfo — 100 mesures (partielle)", url: FI }],
  },
  {
    id: "fi-p-numerus-apertus",
    theme: "Santé",
    promise: "Supprimer le numerus clausus et ouvrir davantage les études de santé.",
    status: "partiel",
    note: "franceinfo : numerus apertus conditionné aux capacités d’accueil ; effet sur le nombre de médecins à long terme.",
    sources: [{ label: "franceinfo — 100 mesures (partielle)", url: FI }],
  },
  {
    id: "fi-p-pret-agri",
    theme: "Agriculture",
    promise: "Instaurer un prêt d’honneur jusqu’à 50 000 € pour les jeunes agriculteurs (sans garantie).",
    status: "partiel",
    note: "franceinfo : dispositifs régionaux hétérogènes, montants souvent inférieurs au plafond national annoncé.",
    sources: [{ label: "franceinfo — 100 mesures (partielle)", url: FI }],
  },
];

const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const existingIds = new Set(data.items.map((i) => i.id));
const toAdd = extraItems.filter((i) => !existingIds.has(i.id));
if (toAdd.length !== extraItems.length) {
  console.warn("Some ids already exist, skipped:", extraItems.filter((i) => existingIds.has(i.id)).map((i) => i.id));
}
data.items.push(...toAdd);

function countStatus(items) {
  const c = { tenu: 0, partiel: 0, non_tenu: 0, en_cours: 0, non_evalue: 0 };
  for (const i of items) c[i.status] = (c[i.status] || 0) + 1;
  return c;
}

const c = countStatus(data.items);
console.log("Total items:", data.items.length, "counts:", c);

const ref = data.referenceTallies?.[0]?.counts;
if (ref && (c.tenu !== ref.tenu || c.partiel !== ref.partiel || c.non_tenu !== ref.non_tenu)) {
  console.warn("Mismatch vs referenceTallies:", ref, "got:", { tenu: c.tenu, partiel: c.partiel, non_tenu: c.non_tenu });
  process.exitCode = 1;
}

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log("Wrote", jsonPath);
