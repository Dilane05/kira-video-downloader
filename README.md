# Kira Video Downloader

Téléchargeur de vidéos et playlists YouTube basé sur [yt-dlp](https://github.com/yt-dlp/yt-dlp), construit avec Next.js 16 / React 19.

![CI](https://github.com/Dilane05/kira-video-downloader/actions/workflows/ci.yml/badge.svg)

## Fonctionnalités

- Récupération des métadonnées d'une vidéo ou d'une playlist YouTube (titre, miniature, durée, formats disponibles)
- Téléchargement avec suivi de progression en temps réel (SSE)
- Sélection du format (résolution vidéo, audio seul)
- Fonctionne sans `ffmpeg` : ne propose que des flux progressifs (vidéo+audio dans un seul fichier) si `ffmpeg` est absent, sinon permet le merge haute résolution

## Prérequis

- [Node.js](https://nodejs.org) — version fixée dans [`.nvmrc`](.nvmrc) (`nvm use`)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) installé sur le système (`brew install yt-dlp`)
- [ffmpeg](https://ffmpeg.org) *(optionnel)* — permet le merge vidéo/audio haute résolution ; sans lui, seuls les formats progressifs sont proposés

## Démarrage

```bash
nvm use
npm install
npm run dev
```

L'application est disponible sur [http://localhost:4210](http://localhost:4210).

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build production |
| `npm run start` | Serveur production |
| `npm run lint` | ESLint |
| `npm run test` | Suite de tests (Vitest) |
| `npm run test:watch` | Tests en mode watch |

## Architecture

- `app/page.tsx` — UI principale (Client Component), tout le téléchargeur
- `app/api/info` (`GET ?url=`) — métadonnées JSON via `yt-dlp --dump-json`
- `app/api/download` (`POST {url, formatId}`) — lance yt-dlp, streame la progression en SSE
- `app/api/file/[id]` (`GET`) — sert le fichier téléchargé puis le supprime

Le détail complet (dépendances système, conventions de style) est documenté dans [CLAUDE.md](CLAUDE.md).

## Contribuer

Le projet suit un workflow GitFlow (`main` / `develop` / `feature/*` / `release/*` / `hotfix/*`), avec CI obligatoire (lint + test + build) sur les branches protégées. Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les détails.
