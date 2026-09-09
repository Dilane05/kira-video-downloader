# Kira Video Downloader

A YouTube video/playlist downloader built on [yt-dlp](https://github.com/yt-dlp/yt-dlp), with Next.js 16 / React 19. Local, single-user tool — not intended as a multi-tenant deployment.

![CI](https://github.com/Dilane05/kira-video-downloader/actions/workflows/ci.yml/badge.svg)

## Features

- Fetch metadata for a video or playlist (title, thumbnail, duration, available formats)
- Download with real-time progress (SSE)
- Format selection (video resolution, audio-only)
- Works without `ffmpeg`: only offers progressive streams (video+audio in one file) when `ffmpeg` is absent, otherwise allows high-resolution merging

## Requirements

- [Node.js](https://nodejs.org) — version pinned in [`.nvmrc`](.nvmrc) (`nvm use`)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) installed on the system
- [ffmpeg](https://ffmpeg.org) *(optional)* — enables high-resolution video/audio merging; without it, only progressive formats are offered

Install yt-dlp (and, optionally, ffmpeg) for your OS:

| OS | yt-dlp | ffmpeg |
|---|---|---|
| macOS | `brew install yt-dlp` | `brew install ffmpeg` |
| Ubuntu / Debian | `sudo apt install yt-dlp` (or `pip install --user yt-dlp` for the latest release) | `sudo apt install ffmpeg` |
| Windows | `winget install yt-dlp` (or `choco install yt-dlp`) | `winget install ffmpeg` (or `choco install ffmpeg`) |

The app looks for both binaries at their common install locations for each OS, falling back to your `PATH` — no manual configuration needed as long as one of the commands above succeeds.

## Getting started

```bash
nvm use
npm install
npm run dev
```

The app is available at [http://localhost:4210](http://localhost:4210).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm run test` | Test suite (Vitest) |
| `npm run test:watch` | Tests in watch mode |

## Architecture

- `app/page.tsx` — main UI (Client Component), the whole downloader
- `app/api/info` (`GET ?url=`) — JSON metadata via `yt-dlp --dump-json`
- `app/api/download` (`POST {url, formatId}`) — runs yt-dlp, streams progress over SSE
- `app/api/file/[id]` (`GET`) — serves the downloaded file, then deletes it
- `lib/system-binaries.ts` — resolves `yt-dlp`/`ffmpeg` across macOS/Linux/Windows install locations, falling back to `PATH`

Full details (system dependencies, style conventions) are documented in [CLAUDE.md](CLAUDE.md).

## Roadmap

Prioritized by impact vs. effort, staying within the local/personal-tool scope (no multi-user architecture planned):

1. **ffmpeg support** — biggest gain for the least effort: unlocks real 1080p/4K merging and audio extraction. The download route already supports it; it's an install-only step.
2. **Local download history / queue** — nothing currently persists after a download (the `.ref` file is deleted once the file is served). A simple local JSON store would be enough — no database needed.
3. **Broader yt-dlp site support** — yt-dlp supports ~1800 sites; the code has no YouTube-specific checks, so extending the UI/docs beyond YouTube is close to free.
4. **Robustness** — no size/duration limits yet, and orphaned `.ref` files aren't cleaned up if a download fails before the file is fetched.

## Contributing

The project follows a GitFlow workflow (`main` / `develop` / `feature/*` / `release/*` / `hotfix/*`), with mandatory CI (lint + test + build) on protected branches. See [CONTRIBUTING.md](CONTRIBUTING.md) for details.
