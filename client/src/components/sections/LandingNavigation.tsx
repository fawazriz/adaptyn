import Link from "next/link"
import Image from "next/image"
import { IconArrowRight } from "@tabler/icons-react"
import styles from "@/app/landing.module.css"

export function LandingBrand() {
  return (
    <Link href="/" className={styles.brand}>
      <Image
        src="/adaptyn-logo.svg"
        alt=""
        width={28}
        height={28}
        className={styles.brandMark}
      />
      Adaptyn
    </Link>
  )
}

export function LandingNavigation() {
  return (
    <header className={styles.header}>
      <nav className={`${styles.container} ${styles.navigation}`} aria-label="Main navigation">
        <LandingBrand />
        <div className={styles.sectionLinks}>
          <a href="#how-it-works">How it works</a>
          <a href="#tailoring">Tailoring</a>
        </div>
        <div className={styles.accountLinks}>
          <Link href="/login">Sign in</Link>
          <Link href="/signup" className={`${styles.button} ${styles.primary}`}>
            Start free <IconArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </nav>
    </header>
  )
}
