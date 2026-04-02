import FsgIllustrationRow from "../components/fsg/FsgIllustrationRow";
import styles from "../fusion-service-group/fusion-service-group.module.css";

export default function ServicesPage() {
  return (
    <section className={styles.services} style={{ paddingTop: 120 }}>
      <FsgIllustrationRow altPrefix="Services Fusion Service Group" />

        <div className={styles.servicesIntro}>
          <div>
            <div className={styles.sectionLabel}>Nos Services</div>
            <h1 className={styles.sectionTitle} style={{ fontFamily: "var(--font-fsg-display)" }}>
              Tout ce dont votre
              <br />
              business a besoin
            </h1>
          </div>
          <div className={styles.servicesIntroRight}>
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
          ].map((s) => (
            <div
              key={s.name}
              className={[
                styles.serviceCard,
                s.featured ? styles.serviceCardFeatured : "",
              ].join(" ")}
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
  );
}

