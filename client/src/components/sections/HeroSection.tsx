import Link from "next/link"
import { IconArrowRight, IconListDetails } from "@tabler/icons-react"
import styles from "@/app/landing.module.css"

const applications = [
  { role: "Frontend Engineer", company: "Figma", location: "New York, NY", stage: "Interview", tone: "warning", action: "Prepare portfolio" },
  { role: "Backend Engineer", company: "Stripe", location: "Toronto, ON", stage: "Applied", tone: "info", action: "Send follow-up" },
  { role: "Platform Engineer", company: "Shopify", location: "Remote", stage: "Saved", tone: "neutral", action: "Review job brief" },
  { role: "Software Engineer", company: "Microsoft", location: "Redmond, WA", stage: "Offer", tone: "success", action: "Review offer" },
]

function ApplicationsPreview() {
  return (
    <figure className={styles.panel}>
      <figcaption className={styles.panelHeader}>
        <span className={styles.panelTitle}>
          <IconListDetails size={19} aria-hidden="true" />
          Applications
        </span>
        <span id="example-records" className={styles.panelMeta}>Example records</span>
      </figcaption>
      <div className={styles.tableScroll} role="region" aria-label="Sample applications table" tabIndex={0}>
        <table aria-describedby="example-records">
          <thead>
            <tr>
              {["Role", "Company", "Location", "Stage", "Next action"].map((column) => (
                <th scope="col" key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applications.map(({ role, company, location, stage, tone, action }) => (
              <tr key={company}>
                <th scope="row">{role}</th>
                <td>{company}</td>
                <td>{location}</td>
                <td><span className={styles.stage}><i data-tone={tone} />{stage}</span></td>
                <td>{action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={styles.tableFooter}>4 sample applications <span>Scroll to see all columns →</span></p>
    </figure>
  )
}

export function HeroSection() {
  return (
    <section className={`${styles.container} ${styles.hero}`} aria-labelledby="hero-heading">
      <div>
        <p className={styles.eyebrow}>Job tracker &amp; resume builder</p>
        <h1 id="hero-heading" className={styles.heroTitle}>Every application,<br /><em>in order.</em></h1>
        <p className={styles.heroCopy}>
          Track job applications and manage resume versions in one place.
          Preview how AI could help tailor a resume to the job description.
        </p>
        <div className={styles.heroActions}>
          <Link href="/signup" className={`${styles.button} ${styles.primary}`}>
            Start free <IconArrowRight size={17} aria-hidden="true" />
          </Link>
          <a href="#how-it-works" className={`${styles.button} ${styles.outline}`}>See how it works</a>
        </div>
        <p className={styles.freeNote}>Free to track applications and build resumes.</p>
      </div>
      <ApplicationsPreview />
    </section>
  )
}
