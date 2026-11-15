import styles from "@/app/landing.module.css"

const steps = [
  {
    title: "Track every stage",
    description: "Move roles from Saved to Applied, Screening or Interview. Record offers and rejections on the same board.",
  },
  {
    title: "Keep your resume versions",
    description: "Keep a master resume and create separate versions for different roles. Export the version you want to send as a PDF.",
  },
  {
    title: "Tailor with your approval",
    description: "Try a preview of how AI could suggest edits grounded in your resume and the job description, with each change up for review.",
  },
  {
    title: "Follow up on time",
    description: "Record interview dates, application deadlines, and follow-up plans in your application notes.",
  },
]

export function ProductWalkthrough() {
  return (
    <section id="how-it-works" className={styles.workflow} aria-labelledby="workflow-heading">
      <div className={`${styles.container} ${styles.editorialGrid}`}>
        <h2 id="workflow-heading" className={styles.sectionTitle}>How it works.</h2>
        <ol className={styles.steps} role="list">
          {steps.map(({ title, description }, index) => (
            <li key={title}>
              <span className={styles.stepNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
