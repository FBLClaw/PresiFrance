# Contribuer

Merci de votre interet pour PresiFrance.

## Demarrer

```bash
npm install
npm run dev
```

## Avant une pull request

Lancez les controles locaux :

```bash
npm run lint
npm test
npm run build
```

## Regles de contribution

- Garder les changements aussi scopes que possible.
- Lire le code existant avant d'introduire une nouvelle abstraction.
- Ne pas commiter de `.env`, secret, token ou fichier personnel.
- Documenter toute nouvelle source de donnees dans `ATTRIBUTIONS.md`.
- Ajouter ou adapter des tests quand le comportement change.
- Ne pas supprimer de fichiers de donnees ou d'assets sans expliquer pourquoi dans la pull request.

## Donnees et assets

Les donnees et images tierces ne sont pas automatiquement sous licence MIT. Toute contribution ajoutant des donnees, images, cartes, logos ou contenus externes doit inclure :

- l'URL source ;
- la licence ;
- les obligations d'attribution ;
- la date de consultation si elle est utile.
