import Header from "@/components/Header";
import styles from "./page.module.css";

export default function ServicesPage() {
  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.content}>
        <h1 className={styles.title}>Our Services</h1>
        <p className={styles.subtitle}>Curated excellence for the modern equestrian.</p>
      </div>
    </main>
  );
}
