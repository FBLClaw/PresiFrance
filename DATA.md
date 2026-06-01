# Donnees

Ce projet versionne les donnees generees dans `public/data` pour que le site puisse fonctionner sans backend. Au 1er juin 2026, ce dossier contient environ 2 231 fichiers pour environ 536 Mo.

Les donnees et assets tiers ne sont pas couverts par la licence MIT du code source. Consultez aussi [ATTRIBUTIONS.md](ATTRIBUTIONS.md) avant toute reutilisation.

## Sources principales

- Resultats presidentiels : Ministere de l'Interieur et ressources publiees via data.gouv.fr.
- Parrainages : Conseil constitutionnel via data.gouv.fr.
- Geographie des communes : geo.api.gouv.fr.
- Sondages 2022 : tableau Wikipedia exploite par `scripts/build-polls-2022-round1.mjs`, avec prudence sur les sources primaires des instituts.
- Promesses / bilan : sources presse et institutionnelles referencees dans `public/data/presidential/macron-promises-bilan.json`.

## Points d'entree

- `public/data/presidential/manifest.json`
- `public/data/presidential/national-results.json`
- `public/data/presidential/polls-2022-round1.json`
- `public/data/presidential/macron-promises-bilan.json`
- `public/data/parrainages/manifest.json`
- `public/data/parrainages/2017.json`
- `public/data/parrainages/2022.json`

## Regeneration

Les scripts principaux sont :

```bash
npm run build:data
npm run build:parrainages
npm run build:photos
```

`npm run build:data` reconstruit les donnees presidentielles dans `public/data/presidential`.

`npm run build:parrainages` reconstruit les fichiers de parrainages dans `public/data/parrainages`. Les CSV sources locaux `parrainages*.csv` sont ignores par Git.

`npm run build:photos` telecharge les portraits candidats depuis Wikipedia/Wikimedia. Les portraits doivent etre verifies fichier par fichier avant toute redistribution publique ou commerciale.

## Regles de contribution

- Documenter toute nouvelle source dans [ATTRIBUTIONS.md](ATTRIBUTIONS.md).
- Garder dans la pull request l'URL source, la licence, les obligations d'attribution et, si utile, la date de consultation.
- Ne pas supprimer de donnees ou d'assets sans expliquer l'impact fonctionnel et la source de remplacement.
- Verifier les changements avec `npm test`, `npm run typecheck` et `npm run build`.

## Strategie de taille

Le depot est volontairement autonome, mais `public/data` represente la grande majorite des fichiers suivis. Si la taille devient bloquante, les options a etudier dans cet ordre sont :

1. compresser les fichiers publics servis en production ;
2. decouper les donnees les plus consultees des archives completes ;
3. publier les donnees volumineuses en GitHub Releases ;
4. separer les donnees dans un depot ou package dedie ;
5. utiliser Git LFS seulement si le flux contributeur reste simple.
