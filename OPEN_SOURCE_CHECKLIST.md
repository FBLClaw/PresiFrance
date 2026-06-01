# Checklist de publication open source

## Pret dans le depot

- Licence du code : `LICENSE` ajoutee, MIT.
- Metadonnees npm : `license`, `repository`, `bugs`, `homepage` et `keywords` ajoutees.
- Documentation projet : `README.md` ajoute.
- Contribution : `CONTRIBUTING.md` ajoute.
- Securite : `SECURITY.md` ajoute.
- Code de conduite : `CODE_OF_CONDUCT.md` ajoute.
- Attributions : `ATTRIBUTIONS.md` ajoute.
- Secrets : `.env` et `.env.*` restent ignores, avec exception pour les exemples.
- Audit dependances : `npm audit` doit retourner 0 vulnerabilite avant publication.

## A verifier manuellement avant de rendre GitHub public

- Relire les informations personnelles deja presentes dans les pages legales du site.
- Decider si les portraits candidats sont conserves, remplaces ou regeneres avec attribution exacte fichier par fichier.
- Verifier que le nom de domaine, les emails de contact et les liens GitHub publics sont ceux souhaites.
- Verifier les issues/discussions GitHub a activer ou non au moment du passage en public.
- Passer la visibilite GitHub de `private` a `public` seulement apres validation finale.

## Commandes de validation

```bash
npm audit
npm run lint
npm test
npm run build
```
