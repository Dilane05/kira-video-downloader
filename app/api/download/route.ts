import { NextRequest } from "next/server";
import { spawn } from "child_process";
import { randomUUID } from "crypto";
import path from "path";
import os from "os";
import fs from "fs";
import { binaryCommand, resolveBinary, binaryOnPath } from "@/lib/system-binaries";

const YTDLP     = binaryCommand("yt-dlp");
const BASE_DIR  = path.join(os.homedir(), "Documents", "kvd");

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PROGRESS_RE =
  /\[download\]\s+([\d.]+)%\s+of\s+~?([\d.]+\s*\S+)\s+at\s+([\d.]+\s*\S+\/s)\s+ETA\s+([\d:]+)/;

// Chemin absolu d'ffmpeg si connu (pour --ffmpeg-location), sinon un booléen
// s'il n'est trouvable que via PATH — auquel cas yt-dlp le résout lui-même.
function detectFfmpeg(): string | true | null {
  return resolveBinary("ffmpeg") ?? (binaryOnPath("ffmpeg") || null);
}

export function sanitizeName(name: string): string {
  return name
    .replace(/[/:\\*?"<>|]/g, "-")
    .replace(/\.{2,}/g, ".")
    .trim()
    .substring(0, 180);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { url, formatId, playlistTitle } = body as {
    url?: string;
    formatId?: string;
    playlistTitle?: string;
  };

  if (!url) {
    return new Response(JSON.stringify({ error: "url manquant" }), { status: 400 });
  }

  const ffmpegPath = detectFfmpeg();

  const targetDir = playlistTitle
    ? path.join(BASE_DIR, sanitizeName(playlistTitle))
    : BASE_DIR;

  fs.mkdirSync(targetDir, { recursive: true });

  const jobId          = randomUUID();
  const outputTemplate = path.join(targetDir, "%(title)s.%(ext)s");
  const refFile        = path.join(BASE_DIR, `${jobId}.ref`);

  const args: string[] = [
    "--no-playlist",
    "--no-warnings",
    "--progress",
    "--newline",
    "--restrict-filenames",
    "-o", outputTemplate,
  ];

  // Si ffmpeg est à un chemin connu, on l'indique explicitement à yt-dlp ;
  // s'il n'est trouvable que via PATH (ffmpegPath === true), yt-dlp le résout lui-même.
  if (typeof ffmpegPath === "string") {
    args.push("--ffmpeg-location", path.dirname(ffmpegPath));
  }

  if (formatId) {
    args.push("-f", formatId);
  } else if (ffmpegPath) {
    args.push("-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best");
  } else {
    args.push("-f", "best[ext=mp4]/best");
  }

  args.push(url);

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: object) => {
        try { controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`)); }
        catch { /* client déconnecté */ }
      };

      let capturedFile: string | null = null;

      const parseLine = (line: string) => {
        const t = line.trim();
        if (!t) return;

        // Capture le chemin réel du fichier téléchargé
        const destMatch = t.match(/^\[download\] Destination:\s+(.+)$/);
        if (destMatch) { capturedFile = destMatch[1].trim(); return; }

        const alreadyMatch = t.match(/^\[download\] (.+) has already been downloaded/);
        if (alreadyMatch) { capturedFile = alreadyMatch[1].trim(); return; }

        // Merge ffmpeg : le fichier final peut changer d'extension
        const mergeMatch = t.match(/^\[Merger\] Merging formats into "(.+)"$/);
        if (mergeMatch) { capturedFile = mergeMatch[1].trim(); return; }

        // Progression
        const m = PROGRESS_RE.exec(t);
        if (m) {
          send({ type: "progress", percent: parseFloat(m[1]), size: m[2].trim(), speed: m[3].trim(), eta: m[4].trim() });
        } else if (t.includes("[download] 100%")) {
          send({ type: "progress", percent: 100, speed: "", eta: "" });
        }
      };

      const proc = spawn(YTDLP, args);
      proc.stdout.on("data", (c: Buffer) => c.toString().split("\n").forEach(parseLine));
      proc.stderr.on("data", (c: Buffer) => c.toString().split("\n").forEach(parseLine));

      proc.on("close", (code) => {
        if (code === 0) {
          const filePath = capturedFile;
          if (filePath && fs.existsSync(filePath)) {
            fs.writeFileSync(refFile, JSON.stringify({ filePath }));
            send({ type: "done", jobId, filename: path.basename(filePath) });
          } else {
            // Fallback : fichier le plus récent dans targetDir
            try {
              const files = fs.readdirSync(targetDir)
                .map((f) => ({ name: f, mtime: fs.statSync(path.join(targetDir, f)).mtime.getTime() }))
                .sort((a, b) => b.mtime - a.mtime);
              if (files.length > 0) {
                const fp = path.join(targetDir, files[0].name);
                fs.writeFileSync(refFile, JSON.stringify({ filePath: fp }));
                send({ type: "done", jobId, filename: files[0].name });
              } else {
                send({ type: "error", message: "Fichier introuvable après téléchargement" });
              }
            } catch {
              send({ type: "error", message: "Fichier introuvable après téléchargement" });
            }
          }
        } else {
          send({ type: "error", message: `yt-dlp a échoué (code ${code})` });
        }
        controller.close();
      });

      proc.on("error", (err) => {
        send({ type: "error", message: `Impossible de lancer yt-dlp : ${err.message}` });
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection":    "keep-alive",
    },
  });
}
