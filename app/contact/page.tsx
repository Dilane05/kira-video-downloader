"use client";

import Image from "next/image";

import styles from "../fusion-service-group/fusion-service-group.module.css";

export default function ContactPage() {
  return (
    <section className={styles.contact} style={{ paddingTop: 120 }}>
      <div style={{ marginBottom: 40, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(245,166,35,0.15)" }}>
        <div style={{ position: "relative", width: "100%", aspectRatio: "2 / 1", minHeight: 200 }}>
          <Image
            src="/img/illustration-1.jpeg"
            alt="Contact Fusion Service Group"
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </div>

      <div className={styles.contactGrid}>
          <div>
            <div className={styles.sectionLabel}>Contact</div>
            <h1 className={styles.sectionTitle} style={{ fontFamily: "var(--font-fsg-display)" }}>
              Parlons de votre
              <br />
              <em>projet</em>
            </h1>
            <p className={styles.sectionDesc} style={{ marginBottom: 50 }}>
              Que vous vouliez vous former, importer ou digitaliser votre business, on a une solution
              pour vous.
            </p>

            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>📞</div>
              <div>
                <h4 style={{ fontFamily: "var(--font-fsg-display)" }}>Téléphone & WhatsApp</h4>
                <a href="tel:+237691166735">+237 691 16 67 35</a>
                <br />
                <a href="tel:+237672553784">+237 672 553 784</a>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>✉️</div>
              <div>
                <h4 style={{ fontFamily: "var(--font-fsg-display)" }}>Email</h4>
                <a href="mailto:Touspreneur01@gmail.com">Touspreneur01@gmail.com</a>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>📍</div>
              <div>
                <h4 style={{ fontFamily: "var(--font-fsg-display)" }}>Adresses</h4>
                <p>Makepe Bloc L, Douala</p>
                <p>Bocom Makepe — Rue du Marché Missoke</p>
              </div>
            </div>
          </div>

          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // placeholder: wiring to email/CRM will come next
                alert("Demande envoyée (démo).");
              }}
            >
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

              <button type="submit" className={styles.btnSubmit}>
                Envoyer ma demande →
              </button>
            </form>
          </div>
        </div>
    </section>
  );
}

