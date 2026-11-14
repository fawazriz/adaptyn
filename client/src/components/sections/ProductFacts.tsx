import styles from "@/app/landing.module.css"

const facts = [
  { number: "6", label: "Application stages" },
  { number: "1", label: "Board for every role" },
  { number: "1", label: "Library for your resumes" },
  { number: "$0", label: "To get started" },
]

export function ProductFacts() {
  return (
    <section className={styles.facts} aria-label="Adaptyn at a glance">
      <dl className={`${styles.container} ${styles.factsGrid}`}>
        {facts.map(({ number, label }) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{number}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
