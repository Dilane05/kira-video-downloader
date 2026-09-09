"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

// ── Types ──────────────────────────────────────────────────────────────────

type Format = {
  id: string;
  selector: string;
  label: string;
  ext: string;
  height: number | null;
  abr: number | null;
  fps: number | null;
  size: number | null;
  hasVideo: boolean;
  hasAudio: boolean;
  needsMerge: boolean;
  isHdr: boolean;
};

type VideoInfo = {
  type: "video";
  ffmpegAvailable: boolean;
  id: string;
  title: string;
  uploader: string;
  duration: number;
  thumbnail: string;
  formats: Format[];
};

type PlaylistEntry = {
  id: string;
  title: string;
  duration: number | null;
  thumbnail: string;
  url: string;
};

type PlaylistInfo = {
  type: "playlist";
  ffmpegAvailable: boolean;
  title: string;
  count: number;
  entries: PlaylistEntry[];
};

type Info = VideoInfo | PlaylistInfo;

type DlStatus = "idle" | "downloading" | "done" | "error";

type DownloadState = {
  status: DlStatus;
  percent: number;
  speed: string;
  eta: string;
  totalSize: string | null;   // ex. "245.3MiB" — total reçu par yt-dlp
  jobId: string | null;
  filename: string | null;
  error: string | null;
};

// ── Presets playlist (sans/avec ffmpeg) ────────────────────────────────────

type Preset = { id: string; label: string; selector: string; needsFfmpeg: boolean };

const PRESETS_BASE: Preset[] = [
  { id: "best",   label: "Meilleure qualité", selector: "best[ext=mp4]/best",                                    needsFfmpeg: false },
  { id: "720p",   label: "720p",              selector: "best[height<=720][ext=mp4]/best[height<=720]",           needsFfmpeg: false },
  { id: "480p",   label: "480p",              selector: "best[height<=480][ext=mp4]/best[height<=480]",           needsFfmpeg: false },
  { id: "360p",   label: "360p",              selector: "best[height<=360][ext=mp4]/best[height<=360]",           needsFfmpeg: false },
  { id: "audio",  label: "Audio seul",        selector: "bestaudio[ext=m4a]/bestaudio",                          needsFfmpeg: false },
];

const PRESETS_FFMPEG: Preset[] = [
  { id: "4k",     label: "4K",                selector: "bestvideo[height<=2160]+bestaudio/best[height<=2160]",  needsFfmpeg: true },
  { id: "1440p",  label: "1440p",             selector: "bestvideo[height<=1440]+bestaudio/best[height<=1440]",  needsFfmpeg: true },
  { id: "1080p",  label: "1080p",             selector: "bestvideo[height<=1080]+bestaudio/best[height<=1080]",  needsFfmpeg: true },
  { id: "720pf",  label: "720p",              selector: "bestvideo[height<=720]+bestaudio/best[height<=720]",    needsFfmpeg: true },
  { id: "480pf",  label: "480p",              selector: "bestvideo[height<=480]+bestaudio/best[height<=480]",    needsFfmpeg: true },
  { id: "360pf",  label: "360p",              selector: "bestvideo[height<=360]+bestaudio/best[height<=360]",    needsFfmpeg: true },
  { id: "audiof", label: "Audio seul",        selector: "bestaudio[ext=m4a]/bestaudio",                          needsFfmpeg: false },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function fmtDuration(sec: number | null): string {
  if (!sec) return "";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}

function fmtSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}

const initDl = (): DownloadState => ({
  status: "idle", percent: 0, speed: "", eta: "", totalSize: null, jobId: null, filename: null, error: null,
});

// Convertit une chaîne yt-dlp ("245.3MiB", "1.20GiB") en Mo lisibles
function parseSizeStr(s: string | null): string {
  if (!s) return "";
  const n = parseFloat(s);
  if (isNaN(n)) return s;
  const lo = s.toLowerCase();
  let bytes = n;
  if (lo.includes("gib") || lo.includes("gb")) bytes = n * 1024 * 1024 * 1024;
  else if (lo.includes("mib") || lo.includes("mb")) bytes = n * 1024 * 1024;
  else if (lo.includes("kib") || lo.includes("kb")) bytes = n * 1024;
  const mb = bytes / 1024 / 1024;
  if (mb >= 1000) return `${(mb / 1024).toFixed(2)} Go`;
  if (mb >= 1)    return `${mb.toFixed(1)} Mo`;
  return `${(bytes / 1024).toFixed(0)} Ko`;
}

// ── Skeleton loader ────────────────────────────────────────────────────────

function SkeletonVideo() {
  return (
    <div className="card fade-in" style={{ display: "flex", gap: "1rem" }}>
      <div className="skeleton" style={{ width: 180, aspectRatio: "16/9", borderRadius: 8, flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: ".6rem", paddingTop: ".25rem" }}>
        <div className="skeleton" style={{ height: 18, width: "80%" }} />
        <div className="skeleton" style={{ height: 14, width: "40%" }} />
        <div className="skeleton" style={{ height: 14, width: "25%" }} />
      </div>
    </div>
  );
}

function SkeletonFormats() {
  return (
    <div className="card fade-in" style={{ marginTop: "1rem" }}>
      <div className="skeleton" style={{ height: 16, width: 140, marginBottom: ".85rem" }} />
      <div className="format-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 58, borderRadius: 10 }} />
        ))}
      </div>
    </div>
  );
}

function SkeletonPlaylist() {
  return (
    <div className="card fade-in" style={{ padding: 0 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="playlist-item">
          <div className="skeleton" style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0 }} />
          <div className="skeleton" style={{ width: 100, aspectRatio: "16/9", borderRadius: 8, flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: ".4rem" }}>
            <div className="skeleton" style={{ height: 14, width: "70%" }} />
            <div className="skeleton" style={{ height: 11, width: "25%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Page principale ────────────────────────────────────────────────────────

export default function Home() {
  const [url, setUrl]           = useState("");
  const [loading, setLoading]   = useState(false);
  const [info, setInfo]         = useState<Info | null>(null);
  const [infoError, setInfoErr] = useState<string | null>(null);

  const [videoFmtId, setVideoFmtId]       = useState<string | null>(null);
  const [playlistPreset, setPlaylistPreset] = useState<string>("best");

  const [dlState, setDlState] = useState<Record<string, DownloadState>>({});
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const abortMap = useRef<Map<string, AbortController>>(new Map());

  // ── Analyse ─────────────────────────────────────────────────────────────

  const handleAnalyze = useCallback(async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setLoading(true);
    setInfo(null);
    setInfoErr(null);
    setDlState({});
    setSelected(new Set());

    try {
      const res  = await fetch(`/api/info?url=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur inconnue");
      setInfo(data);
      if (data.type === "video" && data.formats.length > 0) {
        // Sélectionne par défaut le meilleur format disponible (premier = meilleure résolution)
        setVideoFmtId(data.formats[0].id);
      }
      if (data.type === "playlist") {
        // Sélectionne toutes les entrées par défaut
        setSelected(new Set(data.entries.map((_: PlaylistEntry, i: number) => i)));
        setPlaylistPreset(data.ffmpegAvailable ? "1080p" : "best");
      }
    } catch (e: unknown) {
      setInfoErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [url]);

  // ── Téléchargement SSE ───────────────────────────────────────────────────

  const startDownload = useCallback(async (
    videoUrl: string,
    key: string,
    formatSelector?: string,
    playlistTitle?: string,
  ) => {
    abortMap.current.get(key)?.abort();
    const ctrl = new AbortController();
    abortMap.current.set(key, ctrl);

    setDlState((prev) => ({ ...prev, [key]: { ...initDl(), status: "downloading" } }));

    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: videoUrl, formatId: formatSelector, playlistTitle }),
        signal: ctrl.signal,
      });

      if (!res.ok || !res.body) throw new Error("Échec connexion SSE");

      const reader = res.body.getReader();
      const dec    = new TextDecoder();
      let   buf    = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop() ?? "";
        for (const part of parts) {
          const line = part.replace(/^data: /, "").trim();
          if (!line) continue;
          const ev = JSON.parse(line);
          if (ev.type === "progress") {
            setDlState((p) => ({
              ...p,
              [key]: {
                ...p[key],
                percent:   ev.percent,
                speed:     ev.speed ?? "",
                eta:       ev.eta ?? "",
                totalSize: ev.size ?? p[key]?.totalSize ?? null,
              },
            }));
          } else if (ev.type === "done") {
            setDlState((p) => ({
              ...p,
              [key]: { ...p[key], status: "done", jobId: ev.jobId, filename: ev.filename, percent: 100 },
            }));
          } else if (ev.type === "error") {
            setDlState((p) => ({
              ...p,
              [key]: { ...p[key], status: "error", error: ev.message },
            }));
          }
        }
      }
    } catch (e: unknown) {
      if ((e as Error).name === "AbortError") return;
      setDlState((p) => ({
        ...p,
        [key]: { ...p[key], status: "error", error: (e as Error).message },
      }));
    }
  }, []);

  // ── Téléchargement groupé ────────────────────────────────────────────────

  const downloadSelected = useCallback(async (
    entries: PlaylistEntry[],
    presetSelector: string,
    playlistTitle: string,
  ) => {
    const idxs    = Array.from(selected).sort((a, b) => a - b);
    const CONCURR = 2;
    let   cursor  = 0;

    async function runNext(): Promise<void> {
      const idx = cursor++;
      if (idx >= idxs.length) return;
      const entry = entries[idxs[idx]];
      await startDownload(entry.url, `pl-${idxs[idx]}`, presetSelector, playlistTitle);
      return runNext();
    }

    await Promise.all(Array.from({ length: Math.min(CONCURR, idxs.length) }, runNext));
  }, [selected, startDownload]);

  // ── Rendu ────────────────────────────────────────────────────────────────

  const ffmpegAvailable = info?.ffmpegAvailable ?? false;
  const presets = ffmpegAvailable ? PRESETS_FFMPEG : PRESETS_BASE;

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <header style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: ".9rem 1.5rem" }}>
        <div style={{ maxWidth: 920, margin: "0 auto", display: "flex", alignItems: "center", gap: ".75rem" }}>
          <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>▶</span>
          <div>
            <h1 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--accent)", lineHeight: 1 }}>
              Kira Downloader
            </h1>
            <p style={{ fontSize: ".7rem", color: "var(--muted)", marginTop: 2 }}>
              YouTube Video &amp; Playlist — yt-dlp · Sauvegarde dans <code style={{ color: "var(--text)" }}>~/Documents/kvd/</code>
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, padding: "1.75rem 1.25rem", maxWidth: 920, margin: "0 auto", width: "100%" }}>

        {/* URL input */}
        <div className="card" style={{ marginBottom: "1.4rem" }}>
          <label style={{ display: "block", fontWeight: 700, marginBottom: ".55rem" }}>URL YouTube</label>
          <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
            <input
              className="url-input"
              style={{ flex: 1, minWidth: 220 }}
              type="url"
              placeholder="https://www.youtube.com/watch?v=...   ou   playlist?list=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleAnalyze()}
            />
            <button
              className="btn btn-primary"
              onClick={handleAnalyze}
              disabled={loading || !url.trim()}
              style={{ minWidth: 110 }}
            >
              {loading ? <><span className="spinner" /> Analyse…</> : "Analyser"}
            </button>
            {info && (
              <button className="btn btn-ghost" onClick={() => { setInfo(null); setUrl(""); setDlState({}); }}>
                Réinitialiser
              </button>
            )}
          </div>
          {infoError && (
            <p style={{ marginTop: ".7rem", color: "var(--accent)", fontSize: ".85rem" }}>
              ⚠ {infoError}
            </p>
          )}
        </div>

        {/* Skeleton pendant le chargement */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <SkeletonVideo />
            <SkeletonFormats />
          </div>
        )}

        {/* Résultat vidéo unique */}
        {!loading && info?.type === "video" && (
          <VideoPanel
            info={info}
            selectedFmtId={videoFmtId}
            onSelectFmt={setVideoFmtId}
            dl={dlState["video"] ?? initDl()}
            onDownload={(selector) => startDownload(url.trim(), "video", selector)}
          />
        )}

        {/* Résultat playlist */}
        {!loading && info?.type === "playlist" && (
          <PlaylistPanel
            info={info}
            selected={selected}
            onToggle={(idx) => setSelected((prev) => {
              const next = new Set(prev);
              next.has(idx) ? next.delete(idx) : next.add(idx);
              return next;
            })}
            onSelectAll={() => setSelected(new Set(info.entries.map((_, i) => i)))}
            onDeselectAll={() => setSelected(new Set())}
            presets={presets}
            preset={playlistPreset}
            onPreset={setPlaylistPreset}
            dlState={dlState}
            onDownloadSelected={() => {
              const sel = presets.find((p) => p.id === playlistPreset)!.selector;
              downloadSelected(info.entries, sel, info.title);
            }}
            onDownloadOne={(entry, idx) => {
              const sel = presets.find((p) => p.id === playlistPreset)!.selector;
              startDownload(entry.url, `pl-${idx}`, sel, info.title);
            }}
          />
        )}

        {/* Skeleton playlist pendant le chargement */}
        {loading && (
          <div style={{ marginTop: "1rem" }}>
            <SkeletonPlaylist />
          </div>
        )}
      </main>

      <footer style={{ textAlign: "center", padding: ".85rem", color: "var(--muted)", fontSize: ".7rem", borderTop: "1px solid var(--border)" }}>
        Kira Downloader — usage personnel uniquement
      </footer>
    </div>
  );
}

// ── VideoPanel ─────────────────────────────────────────────────────────────

function VideoPanel({
  info, selectedFmtId, onSelectFmt, dl, onDownload,
}: {
  info: VideoInfo;
  selectedFmtId: string | null;
  onSelectFmt: (id: string) => void;
  dl: DownloadState;
  onDownload: (selector: string) => void;
}) {
  const selectedFmt = info.formats.find((f) => f.id === selectedFmtId) ?? null;

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

      {/* Banner ffmpeg si absent */}
      {!info.ffmpegAvailable && (
        <div className="ffmpeg-banner">
          <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>⚠</span>
          <span>
            <strong>ffmpeg non détecté</strong> — les formats en pointillés (1080p, 4K…) sont indisponibles.
            Installez-le pour débloquer toutes les qualités :{" "}
            <code style={{ background: "rgba(255,255,255,.1)", padding: ".1rem .35rem", borderRadius: 4 }}>
              brew install ffmpeg
            </code>
          </span>
        </div>
      )}

      {/* Méta */}
      <div className="card">
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {info.thumbnail && (
            <div className="thumb-wrap">
              <Image src={info.thumbnail} alt={info.title} fill sizes="180px" />
            </div>
          )}
          <div style={{ flex: 1, minWidth: 160 }}>
            <p style={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1.4, marginBottom: ".3rem" }}>
              {info.title}
            </p>
            <p style={{ color: "var(--muted)", fontSize: ".82rem" }}>{info.uploader}</p>
            {info.duration > 0 && (
              <p style={{ color: "var(--muted)", fontSize: ".82rem" }}>
                Durée : {fmtDuration(info.duration)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Formats */}
      {info.formats.length > 0 && (
        <div className="card">
          <p style={{ fontWeight: 700, marginBottom: ".65rem" }}>
            Format / Qualité
            <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: ".8rem", marginLeft: ".5rem" }}>
              ({info.formats.length} disponibles)
            </span>
          </p>
          <div className="format-grid">
            {info.formats.map((f) => {
              const disabled = f.needsMerge && !info.ffmpegAvailable;
              return (
                <button
                  key={f.id}
                  className={`format-option${selectedFmtId === f.id ? " selected" : ""}${f.needsMerge ? " needs-ffmpeg" : ""}`}
                  onClick={() => !disabled && onSelectFmt(f.id)}
                  disabled={disabled}
                  title={disabled ? "Nécessite ffmpeg — brew install ffmpeg" : undefined}
                >
                  <p className="fmt-label">
                    {f.hasVideo ? "🎬" : "🎵"} {f.label}
                    {f.fps && f.fps >= 50 && (
                      <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: ".72rem" }}> {f.fps}fps</span>
                    )}
                    {f.isHdr && <span className="fmt-badge badge-ffmpeg">HDR</span>}
                    <span className={`fmt-badge badge-${f.ext}`}>{f.ext.toUpperCase()}</span>
                    {f.needsMerge && <span className="fmt-badge badge-ffmpeg">ffmpeg</span>}
                  </p>
                  <p className="fmt-detail">
                    {f.hasVideo && f.hasAudio ? "Vidéo + Audio" : f.hasAudio ? "Audio" : "Vidéo seule"}
                    {f.size ? ` · ${fmtSize(f.size)}` : ""}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Progression + action */}
      <DownloadBlock
        dl={dl}
        disabled={!selectedFmt || (selectedFmt.needsMerge && !info.ffmpegAvailable)}
        onDownload={() => selectedFmt && onDownload(selectedFmt.selector)}
      />
    </div>
  );
}

// ── PlaylistPanel ──────────────────────────────────────────────────────────

function PlaylistPanel({
  info, selected, onToggle, onSelectAll, onDeselectAll,
  presets, preset, onPreset, dlState, onDownloadSelected, onDownloadOne,
}: {
  info: PlaylistInfo;
  selected: Set<number>;
  onToggle: (idx: number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  presets: Preset[];
  preset: string;
  onPreset: (id: string) => void;
  dlState: Record<string, DownloadState>;
  onDownloadSelected: () => void;
  onDownloadOne: (entry: PlaylistEntry, idx: number) => void;
}) {
  const anyDownloading = Object.values(dlState).some((d) => d.status === "downloading");

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

      {/* Banner ffmpeg */}
      {!info.ffmpegAvailable && (
        <div className="ffmpeg-banner">
          <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>⚠</span>
          <span>
            <strong>ffmpeg non détecté</strong> — qualité limitée à 720p max.{" "}
            <code style={{ background: "rgba(255,255,255,.1)", padding: ".1rem .35rem", borderRadius: 4 }}>
              brew install ffmpeg
            </code>
          </span>
        </div>
      )}

      {/* Barre de contrôle */}
      <div className="card" style={{ display: "flex", flexWrap: "wrap", gap: ".75rem", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <p style={{ fontWeight: 700 }}>{info.title}</p>
          <p style={{ color: "var(--muted)", fontSize: ".8rem" }}>
            {info.count} vidéo{info.count > 1 ? "s" : ""}
            {selected.size > 0 && (
              <span style={{ color: "var(--text)" }}>
                {" "}· <strong>{selected.size}</strong> sélectionnée{selected.size > 1 ? "s" : ""}
              </span>
            )}
          </p>
        </div>

        {/* Presets qualité */}
        <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
          {presets.map((p) => (
            <button
              key={p.id}
              className={`btn${preset === p.id ? " btn-primary" : " btn-ghost"}`}
              style={{ fontSize: ".77rem", padding: ".38rem .7rem" }}
              onClick={() => onPreset(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Actions sélection */}
        <div style={{ display: "flex", gap: ".45rem", flexWrap: "wrap" }}>
          <button className="btn btn-ghost"   style={{ fontSize: ".8rem" }} onClick={onSelectAll}>
            Tout sélectionner
          </button>
          <button className="btn btn-ghost"   style={{ fontSize: ".8rem" }} onClick={onDeselectAll} disabled={selected.size === 0}>
            Tout désélectionner
          </button>
          <button
            className="btn btn-primary"
            style={{ fontSize: ".82rem" }}
            disabled={selected.size === 0 || anyDownloading}
            onClick={onDownloadSelected}
          >
            ▼ Télécharger ({selected.size})
          </button>
        </div>
      </div>

      {/* Liste */}
      <div className="card" style={{ padding: 0 }}>
        {info.entries.map((entry, idx) => {
          const key     = `pl-${idx}`;
          const dl      = dlState[key] ?? initDl();
          const checked = selected.has(idx);

          return (
            <div key={idx} className="playlist-item">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(idx)}
                style={{ width: 16, height: 16, accentColor: "var(--accent)", flexShrink: 0, cursor: "pointer" }}
              />
              {entry.thumbnail && (
                <div className="thumb-wrap" style={{ width: 100 }}>
                  <Image src={entry.thumbnail} alt={entry.title} fill sizes="100px" />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{ fontWeight: 600, fontSize: ".87rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer" }}
                  onClick={() => onToggle(idx)}
                >
                  {idx + 1}. {entry.title}
                </p>
                {entry.duration && (
                  <p style={{ color: "var(--muted)", fontSize: ".74rem" }}>{fmtDuration(entry.duration)}</p>
                )}

                {dl.status === "downloading" && (() => {
                  const total = parseSizeStr(dl.totalSize);
                  const downloaded = dl.totalSize && dl.percent > 0
                    ? parseSizeStr(`${(parseFloat(dl.totalSize) * dl.percent / 100).toFixed(2)}${dl.totalSize.replace(/[\d.]/g, "").trim()}`)
                    : null;
                  return (
                    <div style={{ marginTop: ".35rem" }}>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${dl.percent}%` }} />
                      </div>
                      <p style={{ color: "var(--muted)", fontSize: ".72rem", marginTop: ".2rem" }}>
                        {dl.percent.toFixed(1)}%
                        {downloaded && total && <> · <span style={{ color: "var(--text)" }}>{downloaded}</span>/{total}</>}
                        {" "}· {dl.speed} · ETA {dl.eta}
                      </p>
                    </div>
                  );
                })()}

                {dl.status === "done" && dl.jobId && (
                  <div style={{ display: "flex", alignItems: "center", gap: ".45rem", marginTop: ".3rem" }}>
                    <span style={{ color: "var(--success)", fontSize: ".76rem", fontWeight: 700 }}>✓ Enregistré</span>
                    <a href={`/api/file/${dl.jobId}`} download className="btn btn-success"
                      style={{ fontSize: ".73rem", padding: ".28rem .6rem" }}>
                      ⬇ Sauvegarder
                    </a>
                  </div>
                )}

                {dl.status === "error" && (
                  <p style={{ color: "var(--accent)", fontSize: ".74rem", marginTop: ".25rem" }}>⚠ {dl.error}</p>
                )}
              </div>

              <button
                className="btn btn-ghost"
                style={{ flexShrink: 0, fontSize: ".78rem", padding: ".42rem .8rem" }}
                disabled={dl.status === "downloading"}
                onClick={() => onDownloadOne(entry, idx)}
                title="Télécharger cette vidéo"
              >
                {dl.status === "downloading" ? <span className="spinner" /> : "▼"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── DownloadBlock ──────────────────────────────────────────────────────────

function DownloadBlock({ dl, onDownload, disabled }: {
  dl: DownloadState;
  onDownload: () => void;
  disabled: boolean;
}) {
  if (dl.status === "downloading") {
    const total     = parseSizeStr(dl.totalSize);
    const downloaded = dl.totalSize && dl.percent > 0
      ? parseSizeStr(`${(parseFloat(dl.totalSize) * dl.percent / 100).toFixed(2)}${dl.totalSize.replace(/[\d.]/g, "").trim()}`)
      : null;

    return (
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: ".65rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: ".5rem" }}>
            <span className="spinner" /> Téléchargement…
          </span>
          <span style={{ fontWeight: 700 }}>{dl.percent.toFixed(1)}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${dl.percent}%` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)", fontSize: ".83rem", flexWrap: "wrap", gap: ".3rem" }}>
          <span>
            {downloaded && total
              ? <><span style={{ color: "var(--text)", fontWeight: 600 }}>{downloaded}</span> / {total}</>
              : total || "…"
            }
          </span>
          <span>{dl.speed} &nbsp;·&nbsp; ETA {dl.eta}</span>
        </div>
      </div>
    );
  }

  if (dl.status === "done") {
    return (
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
        <p style={{ color: "var(--success)", fontWeight: 700 }}>
          ✓ Enregistré dans <code style={{ fontSize: ".88em" }}>~/Documents/kvd/</code>
        </p>
        <div style={{ display: "flex", gap: ".55rem", flexWrap: "wrap" }}>
          <a href={`/api/file/${dl.jobId}`} download className="btn btn-success">
            ⬇ Sauvegarder via le navigateur
          </a>
          <button className="btn btn-ghost" onClick={onDownload}>
            ↺ Re-télécharger
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: ".55rem" }}>
      <button
        className="btn btn-primary"
        style={{ alignSelf: "flex-start" }}
        onClick={onDownload}
        disabled={disabled}
      >
        ▼ &nbsp;Télécharger
      </button>
      {dl.status === "error" && (
        <p style={{ color: "var(--accent)", fontSize: ".87rem" }}>⚠ {dl.error}</p>
      )}
    </div>
  );
}
