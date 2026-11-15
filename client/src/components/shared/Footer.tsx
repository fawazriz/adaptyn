import Link from "next/link"
import { LandingBrand } from "@/components/sections/LandingNavigation"
import styles from "@/app/landing.module.css"

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} ${styles.footerContent}`}>
        <LandingBrand />
        <nav aria-label="Footer navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#tailoring">Tailoring</a>
          <a href="#faq">FAQ</a>
          <Link href="/login">Sign in</Link>
        </nav>
        <small>© {new Date().getFullYear()} Adaptyn</small>
      </div>
    </footer>
  )
}
