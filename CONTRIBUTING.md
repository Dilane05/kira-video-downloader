# Contribuer à Kira Video Downloader

## Workflow (GitFlow simplifié)

- **`main`** : toujours déployable, reflète la production. Protégée — pas de push direct.
- **`develop`** : branche d'intégration, base de toutes les nouvelles branches. Protégée — pas de push direct.
- **`feature/<nom>`** : une fonctionnalité ou un fix, part de `develop`, PR vers `develop`.
- **`release/<version>`** : stabilisation avant une mise en production, part de `develop`, PR vers `main` **et** `develop`.
- **`hotfix/<nom>`** : correctif urgent en production, part de `main`, PR vers `main` **et** `develop`.

```bash
git checkout develop
git pull
git checkout -b feature/mon-changement
# ... commits ...
git push -u origin feature/mon-changement
# ouvrir une PR vers develop
```

## Avant d'ouvrir une PR

```bash
npm run lint
npm run test
npm run build
```

Les mêmes vérifications tournent en CI (GitHub Actions) et doivent passer avant qu'une PR puisse être mergée.

## Rôles des collaborateurs

`main` et `develop` exigent 1 review approuvée avant merge. GitHub compte comme valide toute approbation venant d'un accès **Write ou supérieur** — il n'existe pas de réglage natif pour restreindre ça à un rôle plus élevé.

Pour que seuls les rôles **Maintain** et **Admin** puissent valider une PR : **n'invitez jamais de collaborateur en rôle "Write"** (ni "Triage"/"Read", qui ne peuvent de toute façon pas merger). Tout collaborateur ajouté au repo doit recevoir directement le rôle `Maintain` ou `Admin` — jamais `Write`.

## Convention de commit

Préfixe court + description à l'impératif :

```
feat: ajoute le support des sous-titres
fix: corrige le calcul de taille des formats mergés
chore: met à jour les dépendances de test
```

## Setup local

```bash
nvm use          # utilise la version Node définie dans .nvmrc
npm install
npm run dev       # http://localhost:4210
```

Dépendances système requises (non gérées par npm) : `yt-dlp` (Homebrew). Voir [CLAUDE.md](CLAUDE.md) pour le détail de l'architecture.
