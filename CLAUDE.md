# CLAUDE.md

## Projet : Kira Video Downloader

Téléchargeur de vidéos et playlists YouTube basé sur **yt-dlp**, construit avec Next.js 16.2.2 / React 19.2.4.

> Avant d'écrire du code Next.js ou React, vérifier `node_modules/next/dist/docs/` pour les APIs à jour.

## Commandes

```bash
npm run dev      # Serveur de développement (http://localhost:3000)
npm run build    # Build production
npm run start    # Serveur production
npm run lint     # ESLint (pas de --fix par défaut)
```

Pas de suite de tests configurée.

## Architecture

### Pages
- `app/page.tsx` — UI principale (Client Component `"use client"`), tout le téléchargeur

### API Routes
| Route | Méthode | Rôle |
|---|---|---|
| `/api/info` | GET `?url=` | `yt-dlp --dump-json --flat-playlist` → métadonnées JSON |
| `/api/download` | POST `{url, formatId}` | Lance yt-dlp, streame la progression via **SSE** |
| `/api/file/[id]` | GET | Sert le fichier depuis `/tmp/kira-downloads/`, puis le supprime |

### Dépendances système (non npm)
- **yt-dlp** : `/opt/homebrew/bin/yt-dlp` (installé via Homebrew)
- **ffmpeg** : **non disponible** — les formats sélectionnés doivent être des flux progressifs (vidéo+audio dans un seul fichier, sans muxing)

### Styling
- Thème dark minimal via CSS custom properties dans `app/globals.css`
- Tailwind CSS v4 via `postcss.config.mjs` (`@tailwindcss/postcss`) — pas de `tailwind.config.js`
- Utilitaires Tailwind pour le layout uniquement, classes custom pour les composants

### Images
- Vignettes YouTube depuis `i.ytimg.com` — domaine autorisé dans `next.config.ts`
- Toujours utiliser `<Image>` Next.js avec `fill` + `sizes`
