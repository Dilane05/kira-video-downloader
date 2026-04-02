import Image from "next/image";
import Link from "next/link";

import FsgIllustrationRow from "../components/fsg/FsgIllustrationRow";
import styles from "../fusion-service-group/fusion-service-group.module.css";

export default function PourquoiNousPage() {
  return (
    <section className={styles.pourquoi} style={{ paddingTop: 120 }}>
      <FsgIllustrationRow altPrefix="Pourquoi Fusion Service Group" />

      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <div className={styles.sectionLabel} style={{ justifyContent: "center" }}>
          Pourquoi nous choisir
        </div>
        <h1 className={styles.sectionTitle} style={{ textAlign: "center", fontFamily: "var(--font-fsg-display)" }}>
          Une structure <em>complète</em>
          <br />
          pour votre réussite
        </h1>
      </div>

      <div style={{ marginBottom: 48, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(245,166,35,0.15)" }}>
        <div style={{ position: "relative", width: "100%", aspectRatio: "2 / 1", minHeight: 220 }}>
          <Image
            src="/img/illustration-2.jpeg"
            alt="Accompagnement entrepreneurs Fusion Service Group"
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </div>

      <div className={styles.whyGrid}>
        {[
          {
            num: "01",
            icon: "🎯",
            title: "Tout en un seul endroit",
            text: "Formation, importation, marketing, logistique, fiscal. Vous n'avez plus besoin de chercher ailleurs. Fusion Service Group couvre tous vos besoins business.",
            highlight: false,
          },
          {
            num: "02",
            icon: "🌍",
            title: "Connecté à 3 marchés internationaux",
            text: "Chine, Nigeria, Dubaï. Des partenariats solides sur place pour vous donner accès aux meilleurs prix et aux meilleures opportunités.",
            highlight: true,
          },
          {
            num: "03",
            icon: "📲",
            title: "Formation pour passer à l'action",
            text: "Nos formations ne sont pas théoriques. Elles sont conçues pour que vous génériez des revenus dès la fin du cours — même en partant de zéro.",
            highlight: false,
          },
          {
            num: "04",
            icon: "🤝",
            title: "Accompagnement terrain réel",
            text: "Nos experts vous suivent pas à pas — que vous lanciez votre première importation ou votre première campagne publicitaire. Vous n'êtes jamais seul.",
            highlight: false,
          },
        ].map((w) => (
          <div
            key={w.num}
            className={[styles.whyItem, w.highlight ? styles.whyItemHighlight : ""].filter(Boolean).join(" ")}
            data-num={w.num}
          >
            <div className={styles.whyItemIcon}>{w.icon}</div>
            <h3 style={{ fontFamily: "var(--font-fsg-display)" }}>{w.title}</h3>
            <p>{w.text}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 48, textAlign: "center" }}>
        <Link href="/contact" className={styles.btnPrimary}>
          Parler à un conseiller
        </Link>
      </div>
    </section>
  );
}
