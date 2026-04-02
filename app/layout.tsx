import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";

import FsgFooter from "./components/fsg/FsgFooter";
import FsgNav from "./components/fsg/FsgNav";
import FsgWhatsappFloat from "./components/fsg/FsgWhatsappFloat";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-fsg-body",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-fsg-display",
});

export const metadata: Metadata = {
  title: "Fusion Service Group – Digital & Commerce International",
  description:
    "Formation, importation, marketing digital et commerce international — Fusion Service Group.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${dmSans.variable} ${syne.variable} h-full`}>
      <body className="fsg-body min-h-full flex flex-col antialiased">
        <FsgNav />
        <main className="flex min-h-0 w-full min-w-0 flex-1 flex-col">{children}</main>
        <FsgFooter />
        <FsgWhatsappFloat />
      </body>
    </html>
  );
}
