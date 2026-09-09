import { NextRequest, NextResponse } from "next/server";
import path from "path";
import os from "os";
import fs from "fs";

const BASE_DIR = path.join(os.homedir(), "Documents", "kvd");

const MIME: Record<string, string> = {
  mp4:  "video/mp4",
  webm: "video/webm",
  mkv:  "video/x-matroska",
  m4a:  "audio/mp4",
  mp3:  "audio/mpeg",
  opus: "audio/ogg",
  ogg:  "audio/ogg",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!/^[\w-]+$/.test(id)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  const refFile = path.join(BASE_DIR, `${id}.ref`);

  if (!fs.existsSync(refFile)) {
    return NextResponse.json({ error: "Référence introuvable" }, { status: 404 });
  }

  let filePath: string;
  try {
    const ref = JSON.parse(fs.readFileSync(refFile, "utf-8"));
    filePath = ref.filePath;
  } catch {
    return NextResponse.json({ error: "Fichier .ref corrompu" }, { status: 500 });
  }

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Fichier introuvable sur le disque" }, { status: 404 });
  }

  const filename = path.basename(filePath);
  const ext      = path.extname(filename).slice(1).toLowerCase();
  const stat     = fs.statSync(filePath);
  const stream   = fs.createReadStream(filePath);

  return new Response(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type":        MIME[ext] ?? "application/octet-stream",
      "Content-Length":      String(stat.size),
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "Cache-Control":       "no-store",
    },
  });
}
