import { resumeTemplate } from "./editor/resume-data"
import styles from "./resumes.module.css"

export function ResumeTemplate() {
  return (
    <div className={styles.template}>
      <div className={styles.templatePaper} aria-hidden="true">
        <i /><i /><i /><i /><i /><i /><i />
      </div>
      <div>
        <strong>{resumeTemplate.name}</strong>
        <p>Single-column LaTeX layout with restrained typography.</p>
        <span className={styles.selected}>Selected template</span>
      </div>
    </div>
  )
}
