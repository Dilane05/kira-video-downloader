import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kira Downloader — YouTube Video & Playlist",
  description: "Télécharge des vidéos et playlists YouTube facilement avec yt-dlp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
