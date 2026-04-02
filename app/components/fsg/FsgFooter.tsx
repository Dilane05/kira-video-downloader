import Link from "next/link";

import styles from "../../fusion-service-group/fusion-service-group.module.css";

export default function FsgFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div className={styles.footerBrand}>
          <Link href="/" className={styles.navLogo}>
            <div className={styles.logoIcon}>FSG</div>
            <span style={{ fontFamily: "var(--font-fsg-display)" }}>
              Fusion <span>Service</span>
            </span>
          </Link>
          <p className={styles.footerDesc}>
            Les services interliés pour vous offrir des solutions complètes, simples et rentables.
            Votre partenaire pour le digital et le commerce international.
          </p>
          <div className={styles.footerSocials}>
            <a href="https://wa.me/237691166735" className={styles.socialBtn} aria-label="WhatsApp">
              📱
            </a>
            <a href="#" className={styles.socialBtn} aria-label="Facebook">
              f
            </a>
            <a href="#" className={styles.socialBtn} aria-label="YouTube">
              ▶
            </a>
            <a href="mailto:Touspreneur01@gmail.com" className={styles.socialBtn} aria-label="Email">
              ✉
            </a>
          </div>
        </div>

        <div className={styles.footerCol}>
          <h4 style={{ fontFamily: "var(--font-fsg-display)" }}>Services</h4>
          <ul>
            {[
              "Importation groupée",
              "Transport Express",
              "Agence Marketing",
              "Agence Voyage",
              "FinTech",
              "Infographie",
              "Impôts & Taxes",
            ].map((s) => (
              <li key={s}>
                <Link href="/services">{s}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.footerCol}>
          <h4 style={{ fontFamily: "var(--font-fsg-display)" }}>Formations</h4>
          <ul>
            {[
              "Importation en ligne",
              "Publicité Facebook/TikTok",
              "Community Management",
              "Marketing Digital",
              "Designer Graphique",
              "E-Commerce 3.0",
              "MA Stratégie",
            ].map((s) => (
              <li key={s}>
                <Link href="/formations">{s}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.footerCol}>
          <h4 style={{ fontFamily: "var(--font-fsg-display)" }}>Contact</h4>
          <ul>
            <li>
              <a href="tel:+237691166735">+237 691 16 67 35</a>
            </li>
            <li>
              <a href="tel:+237672553784">+237 672 553 784</a>
            </li>
            <li>
              <a href="mailto:Touspreneur01@gmail.com">Touspreneur01@gmail.com</a>
            </li>
            <li>
              <Link href="/contact">Makepe Bloc L, Douala</Link>
            </li>
            <li>
              <Link href="/contact">Bocom Makepe — Marché Missoke</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>
          © 2025 <span>Fusion Service Group SARL</span>. Tous droits réservés.
        </p>
        <p className={styles.rccm}>RCCM: CM-DLA-01-2025-B12-00819 · NIU: M062517808592Y</p>
      </div>
    </footer>
  );
}
