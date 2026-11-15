import type { ReactNode } from "react"
import { Instrument_Serif } from "next/font/google"
import { LandingBrand } from "@/components/sections/LandingNavigation"
import styles from "./auth.module.css"

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-auth-serif",
})

type AuthShellProps = {
  title: string
  description: string
  panelTitle: ReactNode
  panelDescription: string
  features: { title: string; description?: string }[]
  children: ReactNode
}

export function AuthShell({
  title,
  description,
  panelTitle,
  panelDescription,
  features,
  children,
}: AuthShellProps) {
  return (
    <main className={`${styles.page} ${instrumentSerif.variable}`}>
      <div className={styles.formSide}>
        <header className={styles.brand}>
          <LandingBrand />
        </header>
        <section className={styles.formContent} aria-labelledby="auth-heading">
          <h1 id="auth-heading" className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
          {children}
        </section>
      </div>
      <aside className={styles.panel} aria-labelledby="auth-panel-heading">
        <div className={styles.panelContent}>
          <h2 id="auth-panel-heading" className={styles.title}>{panelTitle}</h2>
          <p className={styles.panelDescription}>{panelDescription}</p>
          <ul className={styles.features} role="list">
            {features.map(({ title, description }) => (
              <li key={title}>
                <span className={styles.featureMark} aria-hidden="true" />
                <div>
                  <strong>{title}</strong>
                  {description && <p>{description}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </main>
  )
}
