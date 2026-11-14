import type { Metadata } from "next"
import { Instrument_Serif } from "next/font/google"
import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"
import { LandingNavigation } from "@/components/sections/LandingNavigation"
import { Footer } from "@/components/shared/Footer"
import { HeroSection } from "@/components/sections/HeroSection"
import { ProductFacts } from "@/components/sections/ProductFacts"
import { ProductWalkthrough } from "@/components/sections/ProductWalkthrough"
import { ResumeTailoringSection } from "@/components/sections/ResumeTailoringSection"
import styles from "./landing.module.css"

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-landing-serif",
})

export const metadata: Metadata = {
  title: "Adaptyn — Job Application Tracker and Resume Builder",
  description: "Track job applications, organize resume versions, and build PDF resumes in one free job search workspace.",
}

const faqs = [
  {
    question: "Is Adaptyn free?",
    answer: "Yes. You can create a free account to track applications and create and manage resumes.",
  },
  {
    question: "Does Adaptyn apply to jobs for me?",
    answer: "You submit applications directly with each employer. Adaptyn helps you organize the roles you’re pursuing and keep track of what happens next.",
  },
  {
    question: "Are the example jobs real?",
    answer: "The sample applications use familiar company names to show how a tracker could look. They’re illustrative records rather than verified openings.",
  },
]

export default function Home() {
  return (
    <div className={`${styles.page} ${instrumentSerif.variable}`}>
      <a href="#main-content" className={styles.skipLink}>Skip to content</a>
      <LandingNavigation />
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <ProductFacts />
        <ProductWalkthrough />
        <ResumeTailoringSection />
        <section id="faq" className={styles.faq} aria-labelledby="faq-heading">
          <div className={`${styles.container} ${styles.editorialGrid}`}>
            <h2 id="faq-heading" className={styles.sectionTitle}>Frequently asked<br />questions.</h2>
            <div className={styles.questions}>
              {faqs.map(({ question, answer }) => (
                <details key={question}>
                  <summary>{question}<span className={styles.disclosureIcon} aria-hidden="true" /></summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section className={styles.closing} aria-labelledby="closing-heading">
          <div className={styles.container}>
            <div>
              <h2 id="closing-heading" className={styles.sectionTitle}>Give your job search a home.</h2>
              <p>Save the roles you’re pursuing and keep the right resume within reach.</p>
            </div>
            <Link href="/signup" className={`${styles.button} ${styles.citron}`}>
              Start free <IconArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
