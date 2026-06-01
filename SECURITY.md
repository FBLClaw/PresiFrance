# Politique de securite

## Signaler une vulnerabilite

Merci de ne pas ouvrir d'issue publique pour une faille exploitable.

Envoyez un signalement a `contact@fbldigital.fr` avec :

- une description claire du probleme ;
- les etapes de reproduction ;
- l'impact estime ;
- toute correction ou mitigation suggeree.

Nous accuserons reception des que possible et coordonnerons la publication du correctif avant toute divulgation publique.

## Perimetre

Le projet est une application front-end statique. Les points sensibles principaux sont :

- dependances npm ;
- generation de donnees depuis des sources tierces ;
- configuration de deploiement ;
- exposition accidentelle de secrets dans l'historique Git.

Les fichiers `.env` ne doivent jamais etre commits.
