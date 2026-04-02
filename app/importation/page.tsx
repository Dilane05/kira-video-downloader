import Image from "next/image";
import Link from "next/link";

import FsgIllustrationRow from "../components/fsg/FsgIllustrationRow";
import styles from "../fusion-service-group/fusion-service-group.module.css";

export default function ImportationPage() {
  return (
    <>
      <section className={styles.importation} style={{ paddingTop: 120 }}>
        <FsgIllustrationRow altPrefix="Importation FSG" />

        <div className={styles.importLayout}>
          <div className={styles.importVisual}>
            <div className={styles.globeContainer}>
              <div className={styles.globe} />
              <div className={styles.importCountry}>
                <span className={styles.importFlag}>🇨🇳</span>
                <div>
                  <div className={styles.importCountryName} style={{ fontFamily: "var(--font-fsg-display)" }}>
                    Chine
                  </div>
                  <div className={styles.importCountrySub}>Alibaba · Taobao · 1688</div>
                </div>
              </div>
              <div className={styles.importCountry}>
                <span className={styles.importFlag}>🇦🇪</span>
                <div>
                  <div className={styles.importCountryName} style={{ fontFamily: "var(--font-fsg-display)" }}>
                    Dubaï
                  </div>
                  <div className={styles.importCountrySub}>Transport Express</div>
                </div>
              </div>
              <div className={styles.importCountry}>
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
            <div className={styles.sectionLabel}>Importation</div>
            <h1 className={styles.sectionTitle} style={{ fontFamily: "var(--font-fsg-display)" }}>
              Importez depuis
              <br />
              <em>3 marchés</em> clés
            </h1>
            <p className={styles.sectionDesc} style={{ marginBottom: 40 }}>
              Nous vous connectons directement aux meilleurs fournisseurs de Chine, Nigeria et Dubaï.
              Vous achetez. Nous gérons le reste.
            </p>

            <div className={styles.importFeatures}>
              {[
                {
                  icon: "📦",
                  title: "Commande sans déplacement",
                  desc: "Commandez depuis chez vous. Nos agents sur place gèrent l'achat et la vérification à votre place.",
                },
                {
                  icon: "🔍",
                  title: "Vérification qualité garantie",
                  desc: "Chaque produit est inspecté avant expédition. Fournisseur testé, marchandise conforme.",
                },
                {
                  icon: "🚚",
                  title: "Livraison rapide en Afrique",
                  desc: "Transport express depuis Dubaï à 10 000F/Kg pour le Cameroun. Autres pays aussi disponibles.",
                },
              ].map((f) => (
                <div key={f.title} className={styles.importFeature}>
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

        <div style={{ marginTop: 32, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(245,166,35,0.15)" }}>
          <div style={{ position: "relative", width: "100%", aspectRatio: "21 / 9", minHeight: 200 }}>
            <Image
              src="/img/illustration-3.jpeg"
              alt="Importation — équipe et opérations"
              fill
              sizes="100vw"
              style={{ objectFit: "cover" }}
              priority
            />
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
            },
          ].map((t) => (
            <div key={t.title} className={styles.priceTable}>
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

        <div style={{ marginTop: 48, textAlign: "center" }}>
          <Link href="/contact" className={styles.btnPrimary}>
            Demander un devis import
          </Link>
        </div>
      </section>
    </>
  );
}
