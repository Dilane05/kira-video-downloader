import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import { binaryAvailable, binaryCommand } from "@/lib/system-binaries";

const execFileAsync = promisify(execFile);
const YTDLP = binaryCommand("yt-dlp");

// Détecte si ffmpeg est disponible sur le système (chemin connu ou PATH)
function detectFfmpeg(): boolean {
  return binaryAvailable("ffmpeg");
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Paramètre url manquant" }, { status: 400 });
  }

  const ffmpegAvailable = detectFfmpeg();

  // Détermine si l'URL est une playlist (pas de paramètre v= mais list= présent)
  let isPlaylistUrl = false;
  try {
    const u = new URL(url);
    isPlaylistUrl = u.searchParams.has("list") && !u.searchParams.has("v");
  } catch { /* URL non parseable, on essaie en mode vidéo */ }

  try {
    if (isPlaylistUrl) {
      // ── Playlist : listing rapide ──────────────────────────────────────
      const { stdout } = await execFileAsync(YTDLP, [
        "--dump-json", "--flat-playlist", "--no-warnings", url,
      ], { maxBuffer: 50 * 1024 * 1024 });

      const lines   = stdout.trim().split("\n").filter(Boolean);
      const entries = lines.map((l) => JSON.parse(l));

      return NextResponse.json({
        type:           "playlist",
        ffmpegAvailable,
        title:          entries[0]?.playlist_title ?? entries[0]?.playlist ?? "Playlist",
        count:          entries.length,
        entries: entries.map((e) => ({
          id:        e.id,
          title:     e.title,
          duration:  e.duration ?? null,
          thumbnail: e.thumbnail ?? `https://i.ytimg.com/vi/${e.id}/mqdefault.jpg`,
          url:       e.url ?? e.webpage_url ?? `https://www.youtube.com/watch?v=${e.id}`,
        })),
      });

    } else {
      // ── Vidéo unique : dump complet avec formats ───────────────────────
      const { stdout } = await execFileAsync(YTDLP, [
        "--dump-json", "--no-playlist", "--no-warnings", url,
      ], { maxBuffer: 50 * 1024 * 1024 });

      const v = JSON.parse(stdout.trim());

      return NextResponse.json({
        type:           "video",
        ffmpegAvailable,
        id:             v.id,
        title:          v.title,
        uploader:       v.uploader ?? v.channel ?? "",
        duration:       v.duration ?? 0,
        thumbnail:      v.thumbnail ?? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
        formats:        buildFormats(v.formats ?? [], ffmpegAvailable),
      });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/info]", msg);
    return NextResponse.json(
      { error: "Impossible de récupérer les informations. Vérifiez l'URL." },
      { status: 422 },
    );
  }
}

// ── Types internes ─────────────────────────────────────────────────────────

type RawFormat = {
  format_id: string;
  ext: string;
  vcodec?: string;
  acodec?: string;
  height?: number;
  width?: number;
  abr?: number;
  vbr?: number;
  tbr?: number;
  fps?: number;
  filesize?: number;
  filesize_approx?: number;
  format_note?: string;
  protocol?: string;
};

export type Format = {
  id: string;          // format_id yt-dlp (ex: "137", "22")
  selector: string;    // sélecteur yt-dlp à passer à -f
  label: string;       // "1080p", "720p", "Audio 128k"…
  ext: string;
  height: number | null;
  abr: number | null;
  fps: number | null;
  size: number | null;
  hasVideo: boolean;
  hasAudio: boolean;
  needsMerge: boolean; // vrai si ce format nécessite ffmpeg pour merger
  isHdr: boolean;
};

// Retourne la taille en octets d'un format (filesize ou approx)
function fsize(f: RawFormat): number {
  return f.filesize ?? f.filesize_approx ?? 0;
}

export function buildFormats(raw: RawFormat[], ffmpegAvailable: boolean): Format[] {
  const out: Format[] = [];
  const seenLabel = new Set<string>();

  // Meilleur audio-only pour estimer la taille des formats merge
  const audioOnly = raw.filter(
    (f) => (!f.vcodec || f.vcodec === "none") && f.acodec && f.acodec !== "none",
  ).sort((a, b) => (b.abr ?? b.tbr ?? 0) - (a.abr ?? a.tbr ?? 0));
  const bestAudioSize = audioOnly.length > 0 ? fsize(audioOnly[0]) : 0;

  // ── Formats progressifs (vidéo+audio dans un seul fichier) ────────────
  const progressive = raw.filter(
    (f) =>
      f.vcodec && f.vcodec !== "none" &&
      f.acodec && f.acodec !== "none" &&
      f.height != null &&
      !["m3u8", "m3u8_native", "dash"].includes(f.protocol ?? ""),
  );

  for (const f of progressive) {
    const label = `${f.height}p`;
    if (seenLabel.has(label)) continue;
    seenLabel.add(label);
    out.push({
      id:         f.format_id,
      selector:   f.format_id,
      label,
      ext:        f.ext,
      height:     f.height ?? null,
      abr:        null,
      fps:        f.fps ?? null,
      size:       fsize(f) || null,
      hasVideo:   true,
      hasAudio:   true,
      needsMerge: false,
      isHdr:      false,
    });
  }

  // ── Formats haute résolution via merge video+audio ─────────────────────
  const videoOnly = raw.filter(
    (f) =>
      f.vcodec && f.vcodec !== "none" &&
      (!f.acodec || f.acodec === "none") &&
      f.height != null,
  );
  const heights = [...new Set(videoOnly.map((f) => f.height!))].sort((a, b) => b - a);

  for (const h of heights) {
    const label = `${h}p`;
    if (seenLabel.has(label)) continue;
    seenLabel.add(label);

    // Meilleur flux vidéo-only à cette hauteur pour estimer la taille
    const bestVid = videoOnly
      .filter((f) => f.height === h)
      .sort((a, b) => (b.vbr ?? b.tbr ?? 0) - (a.vbr ?? a.tbr ?? 0))[0];
    const vidSize  = bestVid ? fsize(bestVid) : 0;
    const totalSize = vidSize && bestAudioSize ? vidSize + bestAudioSize : null;

    const isHdr = videoOnly.some(
      (f) => f.height === h && (f.format_note ?? "").toLowerCase().includes("hdr"),
    );
    const bestFps = Math.max(
      ...videoOnly.filter((f) => f.height === h).map((f) => f.fps ?? 0),
    ) || null;

    out.push({
      id:         `merge-${h}`,
      selector:   ffmpegAvailable
        ? `bestvideo[height<=${h}][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=${h}]+bestaudio/best[height<=${h}]`
        : `bestvideo[height<=${h}]+bestaudio/best[height<=${h}]`,
      label,
      ext:        "mp4",
      height:     h,
      abr:        null,
      fps:        bestFps,
      size:       totalSize,
      hasVideo:   true,
      hasAudio:   true,
      needsMerge: true,
      isHdr,
    });
  }

  // ── Audio uniquement ───────────────────────────────────────────────────
  const seen128 = new Set<string>();
  for (const f of audioOnly.slice(0, 3)) {
    const kbps  = Math.round(f.abr ?? f.tbr ?? 0);
    const label = `Audio ${kbps ? kbps + "k" : f.ext}`;
    if (seen128.has(label)) continue;
    seen128.add(label);
    out.push({
      id:         f.format_id,
      selector:   f.format_id,
      label,
      ext:        f.ext,
      height:     null,
      abr:        kbps || null,
      fps:        null,
      size:       f.filesize ?? f.filesize_approx ?? null,
      hasVideo:   false,
      hasAudio:   true,
      needsMerge: false,
      isHdr:      false,
    });
  }

  // Trie : haute résolution d'abord, audio à la fin
  return out.sort((a, b) => {
    if (a.height !== null && b.height !== null) return b.height - a.height;
    if (a.height !== null) return -1;
    if (b.height !== null) return 1;
    return (b.abr ?? 0) - (a.abr ?? 0);
  });
}
