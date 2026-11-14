"use client"

import { useState } from "react"
import { IconCheck, IconFileText, IconX } from "@tabler/icons-react"
import styles from "@/app/landing.module.css"

type Decision = "accepted" | "rejected" | null

export function TailoringPreview() {
  const [decision, setDecision] = useState<Decision>(null)

  return (
    <figure className={styles.panel}>
      <figcaption className={styles.panelHeader}>
        <span className={styles.panelTitle}>
          <IconFileText size={19} aria-hidden="true" />
          Review a suggestion
        </span>
        <span className={styles.panelMeta}>Interactive preview</span>
      </figcaption>
      <div className={styles.suggestionBody}>
        <dl className={styles.comparison}>
          <div>
            <dt>Original</dt>
            <dd><del>Built APIs using Node.js.</del></dd>
          </div>
          <div>
            <dt>Suggested</dt>
            <dd><span className={decision === "accepted" ? styles.acceptedText : undefined}>Developed APIs with Node.js.</span></dd>
          </div>
        </dl>
        <p className={styles.rationale}>
          <strong>Why this edit?</strong> Uses a resume-style action verb and keeps the same technical details.
        </p>
        <div className={styles.reviewActions}>
          <button type="button" className={`${styles.button} ${styles.primary}`} aria-pressed={decision === "accepted"} onClick={() => setDecision("accepted")}>
            <IconCheck size={16} aria-hidden="true" /> Accept
          </button>
          <button type="button" className={`${styles.button} ${styles.outline}`} aria-pressed={decision === "rejected"} onClick={() => setDecision("rejected")}>
            <IconX size={16} aria-hidden="true" /> Reject
          </button>
        </div>
        <p className={styles.reviewStatus} role="status">
          {decision === "accepted" && "Suggestion accepted. "}
          {decision === "rejected" && "Original wording kept. "}
          Changes apply to this preview only.
        </p>
      </div>
    </figure>
  )
}
