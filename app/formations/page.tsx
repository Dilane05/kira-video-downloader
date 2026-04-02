import Link from "next/link";

import FsgIllustrationRow from "../components/fsg/FsgIllustrationRow";
import styles from "../fusion-service-group/fusion-service-group.module.css";

export default function FormationsPage() {
  return (
    <section className={styles.formations} style={{ paddingTop: 120 }}>
      <FsgIllustrationRow altPrefix="Formations Fusion Service Group" />

        <div className={styles.formationsHeader}>
          <div>
            <div className={styles.sectionLabel}>Formations</div>
            <h1 className={styles.sectionTitle} style={{ fontFamily: "var(--font-fsg-display)" }}>
              Apprenez les compétences
              <br />
              qui <em>rapportent</em> vraiment
            </h1>
          </div>
          <p className={styles.sectionDesc}>
            Présentiel ou en ligne. Débutant ou confirmé. Nos formations sont conçues pour passer
            directement à l'action.
          </p>
        </div>

        <div className={styles.formationsGrid}>
          {[
            {
              bar: styles.fcGold,
              level: `${styles.formationLevel} ${styles.levelDebut}`,
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
            },
            {
              bar: styles.fcBlue,
              level: `${styles.formationLevel} ${styles.levelAvance}`,
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
            },
            {
              bar: styles.fcCyan,
              level: `${styles.formationLevel} ${styles.levelAvance}`,
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
            },
            {
              bar: styles.fcRed,
              level: `${styles.formationLevel} ${styles.levelExpert}`,
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
            },
            {
              bar: styles.fcGold,
              level: `${styles.formationLevel} ${styles.levelAvance}`,
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
            },
            {
              bar: styles.fcCyan,
              level: `${styles.formationLevel} ${styles.levelExpert}`,
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
            },
          ].map((f) => (
            <div key={f.title} className={styles.formationCard}>
              <div className={`${styles.formationHeaderBar} ${f.bar}`} />
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
  );
}

