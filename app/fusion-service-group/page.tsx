"use client";

import Link from "next/link";
import { DM_Sans, Syne } from "next/font/google";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./fusion-service-group.module.css";

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

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function FusionServiceGroupPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const followerRef = useRef<HTMLDivElement | null>(null);

  const [submitted, setSubmitted] = useState(false);

  const fontClass = useMemo(() => `${dmSans.variable} ${syne.variable}`, []);

  useEffect(() => {
    const root = rootRef.current;
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!root || !cursor || !follower) return;

    let mx = 0;
    let my = 0;
    let fx = 0;
    let fy = 0;
    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = `${mx}px`;
      cursor.style.top = `${my}px`;
    };

    const animateFollower = () => {
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;
      follower.style.left = `${fx}px`;
      follower.style.top = `${fy}px`;
      rafId = window.requestAnimationFrame(animateFollower);
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId = window.requestAnimationFrame(animateFollower);

    const hoverTargets = root.querySelectorAll<HTMLElement>(
      "a, button, [data-hover-cursor='true']"
    );

    const onEnter = () => {
      cursor.style.width = "20px";
      cursor.style.height = "20px";
      follower.style.width = "56px";
      follower.style.height = "56px";
    };

    const onLeave = () => {
      cursor.style.width = "12px";
      cursor.style.height = "12px";
      follower.style.width = "36px";
      follower.style.height = "36px";
    };

    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      hoverTargets.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const revealEls = root.querySelectorAll<HTMLElement>("[data-reveal='true']");
    const statNums = root.querySelectorAll<HTMLElement>("[data-stat-target]");
    let statsAnimated = false;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add(styles.revealVisible);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    revealEls.forEach((el) => revealObserver.observe(el));

    const animateCounter = (el: HTMLElement) => {
      const target = Number.parseInt(el.getAttribute("data-stat-target") ?? "0", 10);
      const suffix = target === 100 ? "%" : target === 500 ? "+" : "";
      let current = 0;
      const increment = target / 60;
      const timer = window.setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          window.clearInterval(timer);
        }
        el.textContent = `${Math.floor(current)}${suffix}`;
      }, 25);
    };

    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          statNums.forEach((el) => animateCounter(el));
        }
      },
      { threshold: 0.5 }
    );

    const statsRoot = root.querySelector<HTMLElement>("[data-stats-root='true']");
    if (statsRoot) statsObserver.observe(statsRoot);

    return () => {
      revealObserver.disconnect();
      statsObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;

      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      const el = root.querySelector<HTMLElement>(href);
      if (!el) return;

      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    root.addEventListener("click", onAnchorClick);
    return () => root.removeEventListener("click", onAnchorClick);
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    window.setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div
      ref={rootRef}
      className={cx(styles.root, fontClass)}
      style={{
        fontFamily: "var(--font-fsg-body), system-ui, -apple-system, Segoe UI, Roboto, Arial",
      }}
    >
      {/* cursor */}
      <div ref={cursorRef} className={styles.cursor} />
      <div ref={followerRef} className={styles.cursorFollower} />

      {/* hero */}
      <section id="hero" className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroGrid} />
        <div className={cx(styles.floatElem, styles.float1)} />
        <div className={cx(styles.floatElem, styles.float2)} />
        <div className={cx(styles.floatElem, styles.float3)} />

        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>🌍 Afrique · Europe · Amérique</div>
          <h1 className={styles.heroTitle} style={{ fontFamily: "var(--font-fsg-display)" }}>
            <span className={styles.heroTitleLine1}>Votre Business,</span>
            <span className={styles.heroTitleLine2}>Sans Frontières.</span>
          </h1>
          <p className={styles.heroSub}>
            Fusion Service Group vous connecte aux opportunités du commerce international et du
            digital. Formez-vous, importez, vendez en ligne — tout en un seul endroit.
          </p>
          <div className={styles.heroActions}>
            <Link href="/formations" className={styles.btnPrimary}>
              Découvrir nos formations
            </Link>
            <Link href="/services" className={styles.btnSecondary}>
              Nos services
            </Link>
          </div>
        </div>

        <div className={styles.heroStats} data-stats-root="true">
          <div className={styles.statItem}>
            <span className={styles.statNum} data-stat-target="3">
              0
            </span>
            <span className={styles.statLabel}>Pays partenaires</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum} data-stat-target="9">
              0
            </span>
            <span className={styles.statLabel}>Formations disponibles</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum} data-stat-target="500">
              0
            </span>
            <span className={styles.statLabel}>Clients accompagnés</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum} data-stat-target="100">
              0
            </span>
            <span className={styles.statLabel}>% Satisfaction</span>
          </div>
        </div>

        <div className={styles.scrollIndicator}>
          <span>Scroll</span>
          <div className={styles.scrollLine} />
        </div>
      </section>

      {/* marquee */}
      <div className={styles.marqueeSection}>
        <div className={styles.marqueeTrack}>
          {[
            "Import Chine",
            "Marketing Digital",
            "Formation Business",
            "Commerce International",
            "Import Nigeria",
            "Publicité Facebook & TikTok",
            "Import Dubaï",
            "Community Management",
            "Transport Express",
            "Agence Voyage Business",
            "Import Chine",
            "Marketing Digital",
            "Formation Business",
            "Commerce International",
            "Import Nigeria",
            "Publicité Facebook & TikTok",
            "Import Dubaï",
            "Community Management",
            "Transport Express",
            "Agence Voyage Business",
          ].map((label, idx) => (
            <div key={`${label}-${idx}`} className={styles.marqueeItem}>
              {label} <span className={styles.marqueeDot} />
            </div>
          ))}
        </div>
      </div>

      {/* services */}
      <section id="services" className={styles.services}>
        <div className={styles.servicesIntro}>
          <div>
            <div className={cx(styles.sectionLabel, styles.reveal)} data-reveal="true">
              Nos Services
            </div>
            <h2
              className={cx(styles.sectionTitle, styles.reveal, styles.revealDelay1)}
              data-reveal="true"
              style={{ fontFamily: "var(--font-fsg-display)" }}
            >
              Tout ce dont votre
              <br />
              business a besoin
            </h2>
          </div>
          <div
            className={cx(styles.servicesIntroRight, styles.reveal, styles.revealDelay2)}
            data-reveal="true"
          >
            <p className={styles.sectionDesc}>
              Des services complets pensés pour les entrepreneurs africains qui veulent aller plus
              loin — en ligne et à l'international.
            </p>
          </div>
        </div>

        <div className={styles.servicesGrid}>
          {[
            {
              featured: true,
              icon: "🌐",
              tag: "Groupe Commande",
              name: "Importation Groupée",
              desc: "Commandez depuis la Chine, le Nigeria ou Dubaï sans vous déplacer. Vérification qualité incluse.",
              price: (
                <>
                  Dès <b>10 500F</b>
                  <small> / commande</small>
                </>
              ),
            },
            {
              icon: "✅",
              tag: "Contrôle Qualité",
              name: "Vérification Marchandise",
              desc: "Inspection de vos produits et fournisseurs sur place. Zéro mauvaise surprise à la livraison.",
              price: (
                <>
                  Dès <b>2 000F</b>
                  <small> / vérification</small>
                </>
              ),
            },
            {
              icon: "✈️",
              tag: "Logistique",
              name: "Transport Express Dubaï → Afrique",
              desc: "Livraison rapide et sécurisée de Dubaï vers le Cameroun et toute l'Afrique.",
              price: (
                <>
                  <b>10 000F</b>
                  <small>/Kg Cameroun</small>
                </>
              ),
            },
            {
              icon: "📱",
              tag: "Digital",
              name: "Agence Marketing",
              desc: "Gestion de pages, audit, stratégies, campagnes Facebook & TikTok pour booster vos ventes.",
              price: (
                <>
                  Dès <b>30 000F</b>
                  <small>/mois</small>
                </>
              ),
            },
            {
              icon: "🧳",
              tag: "Voyage",
              name: "Agence Voyage Business",
              desc: "Voyages d'affaires au Nigeria, Dubaï et Chine. Visa, billets, accompagnement terrain.",
              price: (
                <>
                  Nigeria <b>500 000F</b>
                </>
              ),
            },
            {
              icon: "💰",
              tag: "Investissement",
              name: "Micro Business & FinTech",
              desc: "Investissez dans des micro-business rentables. Paiement fournisseurs & transferts d'argent en Afrique.",
              price: (
                <>
                  Dès <b>25 000F</b>
                </>
              ),
            },
            {
              icon: "🎨",
              tag: "Infographie",
              name: "Création Visuelle",
              desc: "Flyers, logos, roll-ups, banderoles. Tout pour votre identité visuelle professionnelle.",
              price: (
                <>
                  Flyer <b>5 000F</b> · Logo <b>25 000F</b>
                </>
              ),
            },
            {
              icon: "📊",
              tag: "Fiscal",
              name: "Impôts & Déclarations",
              desc: "Déclarations fiscales, DSF et accompagnement administratif pour les entrepreneurs.",
              price: (
                <>
                  Décla. <b>15 000F</b> · DSF <b>45 000F</b>
                </>
              ),
            },
            {
              icon: "🏪",
              tag: "E-Commerce",
              name: "Boutique en Ligne Complète",
              desc: "Shopify, systèmes de vente, intégration TikTok & Facebook Shop pour vendre partout.",
              price: (
                <>
                  <b>290 000F</b>
                  <small> complet</small>
                </>
              ),
            },
          ].map((s, idx) => (
            <div
              key={s.name}
              className={cx(
                styles.serviceCard,
                s.featured && styles.serviceCardFeatured,
                styles.reveal,
                idx % 3 === 1 && styles.revealDelay1,
                idx % 3 === 2 && styles.revealDelay2
              )}
              data-reveal="true"
              data-hover-cursor="true"
            >
              <div className={styles.serviceIcon}>{s.icon}</div>
              <span className={styles.serviceTag}>{s.tag}</span>
              <div className={styles.serviceName} style={{ fontFamily: "var(--font-fsg-display)" }}>
                {s.name}
              </div>
              <div className={styles.serviceDesc}>{s.desc}</div>
              <div className={styles.servicePrice} style={{ fontFamily: "var(--font-fsg-display)" }}>
                {s.price}
              </div>
              <div className={styles.serviceArrow}>→</div>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.sectionDivider} />

      {/* formations */}
      <section id="formations" className={styles.formations}>
        <div className={styles.formationsHeader}>
          <div>
            <div className={cx(styles.sectionLabel, styles.reveal)} data-reveal="true">
              Formations
            </div>
            <h2
              className={cx(styles.sectionTitle, styles.reveal, styles.revealDelay1)}
              data-reveal="true"
              style={{ fontFamily: "var(--font-fsg-display)" }}
            >
              Apprenez les compétences
              <br />
              qui <em>rapportent</em> vraiment
            </h2>
          </div>
          <p className={cx(styles.sectionDesc, styles.reveal, styles.revealDelay2)} data-reveal="true">
            Présentiel ou en ligne. Débutant ou confirmé. Nos formations sont conçues pour passer
            directement à l'action.
          </p>
        </div>

        <div className={styles.formationsGrid}>
          {[
            {
              bar: styles.fcGold,
              level: cx(styles.formationLevel, styles.levelDebut),
              levelLabel: "Débutant",
              title: "Importation en Ligne",
              topics: [
                "Importer depuis la Chine",
                "Sourcing au Nigeria",
                "Commandes depuis Dubaï",
                "Éviter les arnaques fournisseurs",
              ],
              price: "25 000F",
              meta: "En ligne · Chine",
              delay: "",
            },
            {
              bar: styles.fcBlue,
              level: cx(styles.formationLevel, styles.levelAvance),
              levelLabel: "Intermédiaire",
              title: "Publicité Facebook & TikTok",
              topics: [
                "Gestionnaire de publicités Meta",
                "Campagnes TikTok Ads",
                "Ciblage & audiences avancées",
                "8 séances intensives en ligne",
              ],
              price: "50 000F",
              meta: "Accès illimité · En ligne",
              delay: styles.revealDelay1,
            },
            {
              bar: styles.fcCyan,
              level: cx(styles.formationLevel, styles.levelAvance),
              levelLabel: "Intermédiaire",
              title: "Community Management",
              topics: [
                "Gestion Facebook & Instagram",
                "TikTok & WhatsApp Business",
                "Créer & animer une communauté",
                "Monétisation des réseaux",
              ],
              price: "169 000F",
              meta: "Complet · En ligne",
              delay: styles.revealDelay2,
            },
            {
              bar: styles.fcRed,
              level: cx(styles.formationLevel, styles.levelExpert),
              levelLabel: "Expert",
              title: "Marketing Digital Complet",
              topics: [
                "Facebook · Photoshop · Instagram",
                "Alibaba · TikTok · Taobao",
                "Stratégie de contenu & vente",
                "Automatisation des campagnes",
              ],
              price: "200 000F",
              meta: "Complet · Présentiel + Ligne",
              delay: "",
            },
            {
              bar: styles.fcGold,
              level: cx(styles.formationLevel, styles.levelAvance),
              levelLabel: "Intermédiaire",
              title: "Designer Graphique (3 mois)",
              topics: [
                "Photoshop complet",
                "Illustrator professionnel",
                "Flyers, logos, visuels marketing",
                "Projets réels en cours",
              ],
              price: "189 000F",
              meta: "3 mois · Présentiel",
              delay: styles.revealDelay1,
            },
            {
              bar: styles.fcCyan,
              level: cx(styles.formationLevel, styles.levelExpert),
              levelLabel: "Expert",
              title: "E-Commerce 3.0 — Système Complet",
              topics: [
                "Importation Chine intégrée",
                "Shopify & You Can",
                "Facebook Shop & TikTok Shop",
                "Système de vente automatisé",
              ],
              price: "290 000F",
              meta: "Complet · Présentiel + Ligne",
              delay: styles.revealDelay2,
            },
          ].map((f, idx) => (
            <div
              key={f.title}
              className={cx(styles.formationCard, styles.reveal, f.delay)}
              data-reveal="true"
              data-hover-cursor="true"
            >
              <div className={cx(styles.formationHeaderBar, f.bar)} />
              <div className={styles.formationBody}>
                <span className={f.level}>{f.levelLabel}</span>
                <h3 className={styles.formationTitle} style={{ fontFamily: "var(--font-fsg-display)" }}>
                  {f.title}
                </h3>
                <ul className={styles.formationTopics}>
                  {f.topics.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <div className={styles.formationFooter}>
                  <div>
                    <div className={styles.formationPrice} style={{ fontFamily: "var(--font-fsg-display)" }}>
                      {f.price}
                    </div>
                    <small style={{ color: "var(--gray)", fontSize: "0.72rem" }}>{f.meta}</small>
                  </div>
                  <Link href="/contact" className={styles.btnEnroll}>
                    S'inscrire
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.sectionDivider} />

      {/* importation */}
      <section id="importation" className={styles.importation}>
        <div className={styles.importLayout}>
          <div className={styles.importVisual}>
            <div className={styles.globeContainer}>
              <div className={styles.globe} />
              <div className={styles.importCountry} data-hover-cursor="true">
                <span className={styles.importFlag}>🇨🇳</span>
                <div>
                  <div className={styles.importCountryName} style={{ fontFamily: "var(--font-fsg-display)" }}>
                    Chine
                  </div>
                  <div className={styles.importCountrySub}>Alibaba · Taobao · 1688</div>
                </div>
              </div>
              <div className={styles.importCountry} data-hover-cursor="true">
                <span className={styles.importFlag}>🇦🇪</span>
                <div>
                  <div className={styles.importCountryName} style={{ fontFamily: "var(--font-fsg-display)" }}>
                    Dubaï
                  </div>
                  <div className={styles.importCountrySub}>Transport Express</div>
                </div>
              </div>
              <div className={styles.importCountry} data-hover-cursor="true">
                <span className={styles.importFlag}>🇳🇬</span>
                <div>
                  <div className={styles.importCountryName} style={{ fontFamily: "var(--font-fsg-display)" }}>
                    Nigeria
                  </div>
                  <div className={styles.importCountrySub}>Alaba · Oshodi Market</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className={cx(styles.sectionLabel, styles.reveal)} data-reveal="true">
              Importation
            </div>
            <h2
              className={cx(styles.sectionTitle, styles.reveal, styles.revealDelay1)}
              data-reveal="true"
              style={{ fontFamily: "var(--font-fsg-display)" }}
            >
              Importez depuis
              <br />
              <em>3 marchés</em> clés
            </h2>
            <p
              className={cx(styles.sectionDesc, styles.reveal, styles.revealDelay2)}
              data-reveal="true"
              style={{ marginBottom: 40 }}
            >
              Nous vous connectons directement aux meilleurs fournisseurs de Chine, Nigeria et Dubaï.
              Vous achetez. Nous gérons le reste.
            </p>

            <div className={styles.importFeatures}>
              {[
                {
                  icon: "📦",
                  title: "Commande sans déplacement",
                  desc: "Commandez depuis chez vous. Nos agents sur place gèrent l'achat et la vérification à votre place.",
                  delay: styles.revealDelay1,
                },
                {
                  icon: "🔍",
                  title: "Vérification qualité garantie",
                  desc: "Chaque produit est inspecté avant expédition. Fournisseur testé, marchandise conforme.",
                  delay: styles.revealDelay2,
                },
                {
                  icon: "🚚",
                  title: "Livraison rapide en Afrique",
                  desc: "Transport express depuis Dubaï à 10 000F/Kg pour le Cameroun. Autres pays aussi disponibles.",
                  delay: styles.revealDelay3,
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className={cx(styles.importFeature, styles.reveal, f.delay)}
                  data-reveal="true"
                  data-hover-cursor="true"
                >
                  <div className={styles.importFeatureIcon}>{f.icon}</div>
                  <div>
                    <h4 style={{ fontFamily: "var(--font-fsg-display)" }}>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.priceTables}>
          {[
            {
              flag: "🇨🇳",
              title: "Chine",
              sub: "Alibaba · Taobao · 1688",
              rows: [
                ["Groupe commande", "Gratuit"],
                ["Importation présentielle", "50 000F"],
                ["Importation en ligne", "25 000F"],
                ["Vérification fournisseur", "dès 30 000F"],
              ],
              delay: "",
            },
            {
              flag: "🇳🇬",
              title: "Nigeria",
              sub: "Lagos · Alaba Market",
              rows: [
                ["Groupe commande", "10 500F"],
                ["Importation présentielle", "60 000F"],
                ["Importation en ligne", "50 000F"],
                ["Voyage business", "500 000F"],
              ],
              delay: styles.revealDelay1,
            },
            {
              flag: "🇦🇪",
              title: "Dubaï",
              sub: "Transport Express inclus",
              rows: [
                ["Groupe commande", "12 000F"],
                ["Importation présentielle", "50 000F"],
                ["Importation en ligne", "40 000F"],
                ["Transport Cameroun", "10 000F/Kg"],
              ],
              delay: styles.revealDelay2,
            },
          ].map((t) => (
            <div key={t.title} className={cx(styles.priceTable, styles.reveal, t.delay)} data-reveal="true">
              <div className={styles.priceTableHeader}>
                <span className="flag">{t.flag}</span>
                <div>
                  <h3 style={{ fontFamily: "var(--font-fsg-display)" }}>{t.title}</h3>
                  <small>{t.sub}</small>
                </div>
              </div>
              <div className={styles.priceTableBody}>
                {t.rows.map(([label, value]) => (
                  <div key={label} className={styles.priceRow}>
                    <span className="label">{label}</span>
                    <span className="value" style={{ fontFamily: "var(--font-fsg-display)" }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.sectionDivider} />

      {/* pourquoi */}
      <section id="pourquoi" className={styles.pourquoi}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div
            className={cx(styles.sectionLabel, styles.reveal)}
            data-reveal="true"
            style={{ justifyContent: "center" }}
          >
            Pourquoi nous choisir
          </div>
          <h2
            className={cx(styles.sectionTitle, styles.reveal, styles.revealDelay1)}
            data-reveal="true"
            style={{ textAlign: "center", fontFamily: "var(--font-fsg-display)" }}
          >
            Une structure <em>complète</em>
            <br />
            pour votre réussite
          </h2>
        </div>

        <div className={styles.whyGrid}>
          {[
            {
              num: "01",
              icon: "🎯",
              title: "Tout en un seul endroit",
              text: "Formation, importation, marketing, logistique, fiscal. Vous n'avez plus besoin de chercher ailleurs. Fusion Service Group couvre tous vos besoins business.",
              highlight: false,
              delay: "",
            },
            {
              num: "02",
              icon: "🌍",
              title: "Connecté à 3 marchés internationaux",
              text: "Chine, Nigeria, Dubaï. Des partenariats solides sur place pour vous donner accès aux meilleurs prix et aux meilleures opportunités.",
              highlight: true,
              delay: styles.revealDelay1,
            },
            {
              num: "03",
              icon: "📲",
              title: "Formation pour passer à l'action",
              text: "Nos formations ne sont pas théoriques. Elles sont conçues pour que vous génériez des revenus dès la fin du cours — même en partant de zéro.",
              highlight: false,
              delay: "",
            },
            {
              num: "04",
              icon: "🤝",
              title: "Accompagnement terrain réel",
              text: "Nos experts vous suivent pas à pas — que vous lanciez votre première importation ou votre première campagne publicitaire. Vous n'êtes jamais seul.",
              highlight: false,
              delay: styles.revealDelay1,
            },
          ].map((w) => (
            <div
              key={w.num}
              className={cx(styles.whyItem, w.highlight && styles.whyItemHighlight, styles.reveal, w.delay)}
              data-reveal="true"
              data-hover-cursor="true"
              data-num={w.num}
            >
              <div className={styles.whyItemIcon}>{w.icon}</div>
              <h3 style={{ fontFamily: "var(--font-fsg-display)" }}>{w.title}</h3>
              <p>{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* cta */}
      <section id="cta" className={styles.cta}>
        <div className={styles.ctaContent}>
          <div className={styles.ctaText}>
            <span className={styles.ctaLabel}>Prêt à commencer ?</span>
            <h2 className={styles.ctaTitle} style={{ fontFamily: "var(--font-fsg-display)" }}>
              Transformez vos idées
              <br />
              en revenus concrets.
            </h2>
            <p className={styles.ctaSub}>
              Rejoignez des centaines d'entrepreneurs qui ont déjà lancé leur business avec Fusion
              Service Group. Zéro excuses. Tout est là.
            </p>
          </div>
          <div className={styles.ctaActions}>
            <a href="https://wa.me/237691166735" className={styles.btnDark}>
              💬 WhatsApp maintenant
            </a>
            <Link href="/contact" className={styles.btnOutlineDark}>
              Envoyer un message
            </Link>
          </div>
        </div>
      </section>

      {/* temoignages */}
      <section id="temoignages" className={styles.temoignages}>
        <div className={styles.testiHeader}>
          <div className={cx(styles.sectionLabel, styles.reveal)} data-reveal="true" style={{ justifyContent: "center" }}>
            Témoignages
          </div>
          <h2
            className={cx(styles.sectionTitle, styles.reveal, styles.revealDelay1)}
            data-reveal="true"
            style={{ textAlign: "center", fontFamily: "var(--font-fsg-display)" }}
          >
            Ils ont transformé
            <br />
            leur <em>business</em>
          </h2>
        </div>

        <div className={styles.testiGrid}>
          {[
            {
              quote:
                "Grâce à la formation importation en ligne, j'ai passé ma première commande depuis la Chine en 2 semaines. Le suivi est vraiment top !",
              initials: "AK",
              name: "Arnaud K.",
              role: "Revendeur, Douala",
              stars: "★★★★★",
              delay: "",
              avatarBg: undefined,
            },
            {
              quote:
                "J'ai lancé ma boutique en ligne après la formation E-Commerce 3.0. En 3 mois, j'avais déjà rentabilisé l'investissement. Incroyable !",
              initials: "FM",
              name: "Fatou M.",
              role: "E-commerçante, Yaoundé",
              stars: "★★★★★",
              delay: styles.revealDelay1,
              avatarBg: "var(--cyan)",
            },
            {
              quote:
                "Le service marketing a multiplié mes ventes par 3 en un mois. Leurs campagnes Facebook sont vraiment efficaces et bien ciblées.",
              initials: "JB",
              name: "Jean-Baptiste O.",
              role: "Commerçant, Bafoussam",
              stars: "★★★★★",
              delay: styles.revealDelay2,
              avatarBg: "var(--blue)",
            },
          ].map((t) => (
            <div
              key={t.name}
              className={cx(styles.testiCard, styles.reveal, t.delay)}
              data-reveal="true"
              data-hover-cursor="true"
            >
              <div className={styles.testiQuote}>"</div>
              <p className={styles.testiText}>{t.quote}</p>
              <div className={styles.testiAuthor}>
                <div className={styles.testiAvatar} style={t.avatarBg ? { background: t.avatarBg } : undefined}>
                  {t.initials}
                </div>
                <div>
                  <div className={styles.testiStars}>{t.stars}</div>
                  <div className={styles.testiName} style={{ fontFamily: "var(--font-fsg-display)" }}>
                    {t.name}
                  </div>
                  <div className={styles.testiRole}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.sectionDivider} />

      {/* partenaires */}
      <section id="partenaires" className={styles.partenaires}>
        <div className={styles.partnersHeader}>
          <div className={styles.sectionLabel} style={{ justifyContent: "center" }}>
            Nos Partenaires
          </div>
        </div>
        <div className={styles.partnersRow}>
          {[
            "Business Importation",
            "GiselPay",
            "Sajor Company",
            "MConsult Agency",
            "CF Agency",
            "La Maison du Business",
            "Queen SMS",
          ].map((p) => (
            <div key={p} className={styles.partnerBadge} data-hover-cursor="true">
              {p}
            </div>
          ))}
        </div>
      </section>

      {/* contact */}
      <section id="contact" className={styles.contact}>
        <div className={styles.contactGrid}>
          <div>
            <div className={cx(styles.sectionLabel, styles.reveal)} data-reveal="true">
              Contact
            </div>
            <h2
              className={cx(styles.sectionTitle, styles.reveal, styles.revealDelay1)}
              data-reveal="true"
              style={{ fontFamily: "var(--font-fsg-display)" }}
            >
              Parlons de votre
              <br />
              <em>projet</em>
            </h2>
            <p
              className={cx(styles.sectionDesc, styles.reveal, styles.revealDelay2)}
              data-reveal="true"
              style={{ marginBottom: 50 }}
            >
              Que vous vouliez vous former, importer ou digitaliser votre business, on a une solution
              pour vous.
            </p>

            <div className={cx(styles.contactItem, styles.reveal, styles.revealDelay1)} data-reveal="true">
              <div className={styles.contactIcon}>📞</div>
              <div>
                <h4 style={{ fontFamily: "var(--font-fsg-display)" }}>Téléphone & WhatsApp</h4>
                <a href="tel:+237691166735">+237 691 16 67 35</a>
                <br />
                <a href="tel:+237672553784">+237 672 553 784</a>
              </div>
            </div>

            <div className={cx(styles.contactItem, styles.reveal, styles.revealDelay2)} data-reveal="true">
              <div className={styles.contactIcon}>✉️</div>
              <div>
                <h4 style={{ fontFamily: "var(--font-fsg-display)" }}>Email</h4>
                <a href="mailto:Touspreneur01@gmail.com">Touspreneur01@gmail.com</a>
              </div>
            </div>

            <div className={cx(styles.contactItem, styles.reveal, styles.revealDelay3)} data-reveal="true">
              <div className={styles.contactIcon}>📍</div>
              <div>
                <h4 style={{ fontFamily: "var(--font-fsg-display)" }}>Adresses</h4>
                <p>Makepe Bloc L, Douala</p>
                <p>Bocom Makepe — Rue du Marché Missoke</p>
              </div>
            </div>
          </div>

          <div className={cx(styles.reveal, styles.revealDelay2)} data-reveal="true">
            <form onSubmit={onSubmit}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Prénom</label>
                  <input type="text" placeholder="Votre prénom" required />
                </div>
                <div className={styles.formGroup}>
                  <label>Nom</label>
                  <input type="text" placeholder="Votre nom" />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Email / WhatsApp</label>
                <input type="text" placeholder="Email ou numéro WhatsApp" required />
              </div>

              <div className={styles.formGroup}>
                <label>Ce qui vous intéresse</label>
                <select defaultValue="">
                  <option value="">Choisir un service ou formation</option>
                  <option>Formation Importation</option>
                  <option>Formation Marketing Digital</option>
                  <option>Formation E-Commerce 3.0</option>
                  <option>Formation Community Management</option>
                  <option>Formation Designer Graphique</option>
                  <option>Formation Publicité Facebook/TikTok</option>
                  <option>Importation Chine</option>
                  <option>Importation Nigeria</option>
                  <option>Importation Dubaï</option>
                  <option>Transport Express</option>
                  <option>Agence Marketing</option>
                  <option>Voyage Business</option>
                  <option>Infographie</option>
                  <option>Impôts & Taxes</option>
                  <option>Autre</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Message (optionnel)</label>
                <textarea rows={4} placeholder="Décrivez brièvement votre besoin ou projet..." />
              </div>

              <button
                type="submit"
                className={styles.btnSubmit}
                style={
                  submitted
                    ? { background: "var(--cyan)" }
                    : undefined
                }
              >
                {submitted ? "✅ Demande envoyée !" : "Envoyer ma demande →"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

