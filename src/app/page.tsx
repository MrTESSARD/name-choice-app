"use client"; // Indiquer explicitement que ce composant est côté client


import Image from "next/image";
import styles from "./page.module.css";
// import FiltreTableau from "./components/Filtre";
import dynamic from "next/dynamic";

// Dynamique importation avec SSR désactivé
const FiltreTableau = dynamic(() => import("./components/Filtre"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Name choice app</h1>

        <div>
          <FiltreTableau />
        </div>
      </main>
      <footer className={styles.footer}>
        <a href="https://tessard.pro" target="_blank" rel="noopener noreferrer">
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to TESSARD page →
        </a>
      </footer>
    </div>
  );
}
