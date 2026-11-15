import { TailoringPreview } from "./TailoringPreview"
import styles from "@/app/landing.module.css"

export function ResumeTailoringSection() {
  return (
    <section id="tailoring" className={styles.tailoring} aria-labelledby="tailoring-heading">
      <div className={`${styles.container} ${styles.tailoringGrid}`}>
        <div>
          <p className={styles.eyebrow}>Resume tailoring concept</p>
          <h2 id="tailoring-heading" className={styles.sectionTitle}>A better fit.<br /><em>Still your experience.</em></h2>
          <p className={styles.tailoringCopy}>
            This preview shows how AI could compare your resume with a job description,
            surface relevant skills and requirements, and flag gaps in the experience you’ve documented.
          </p>
          <p className={styles.tailoringCopy}>
            You decide which wording to keep. Every suggested edit should use facts from your resume,
            including your experience, qualifications, certifications, and accomplishments.
          </p>
        </div>
        <TailoringPreview />
      </div>
    </section>
  )
}
