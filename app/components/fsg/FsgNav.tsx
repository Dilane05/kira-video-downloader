"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "../../fusion-service-group/fusion-service-group.module.css";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function FsgNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const nav = document.querySelector<HTMLElement>("[data-fsg-navbar='true']");
    if (!nav) return;

    const onScroll = () => {
      nav.classList.toggle(styles.navScrolled, window.scrollY > 50);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className={styles.nav} data-fsg-navbar="true">
        <Link href="/" className={styles.navLogo}>
          <div className={styles.logoIcon}>FSG</div>
          <span style={{ fontFamily: "var(--font-fsg-display)" }}>
            Fusion <span>Service</span>
          </span>
        </Link>

        <ul className={styles.navLinks}>
          <li>
            <Link href="/services">Services</Link>
          </li>
          <li>
            <Link href="/formations">Formations</Link>
          </li>
          <li>
            <Link href="/importation">Importation</Link>
          </li>
          <li>
            <Link href="/pourquoi-nous">Pourquoi nous</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>

        <Link href="/contact" className={styles.navCta}>
          <span>Commencer →</span>
        </Link>

        <button
          type="button"
          className={styles.navHamburger}
          onClick={() => setMobileOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div className={cx(styles.mobileMenu, mobileOpen && styles.mobileMenuOpen)}>
        <button
          type="button"
          className={styles.mobileClose}
          onClick={() => setMobileOpen(false)}
          aria-label="Fermer le menu"
        >
          ✕
        </button>
        <Link href="/services" style={{ fontFamily: "var(--font-fsg-display)" }}>
          Services
        </Link>
        <Link href="/formations" style={{ fontFamily: "var(--font-fsg-display)" }}>
          Formations
        </Link>
        <Link href="/importation" style={{ fontFamily: "var(--font-fsg-display)" }}>
          Importation
        </Link>
        <Link href="/pourquoi-nous" style={{ fontFamily: "var(--font-fsg-display)" }}>
          Pourquoi nous
        </Link>
        <Link href="/contact" style={{ fontFamily: "var(--font-fsg-display)" }}>
          Contact
        </Link>
      </div>
    </>
  );
}
