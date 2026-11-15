import type { ResumeApiRow } from "@/lib/resume"
import { resumeDate, resumeTemplate } from "./editor/resume-data"
import styles from "./resumes.module.css"

export type LinkedApplication = { id: string; company: string; role: string; resume_version_id?: string | null }

export function ResumeDetailPanel({ resume, applications }: {
  resume: ResumeApiRow
  applications: LinkedApplication[] | null
}) {
  const linked = applications?.filter((application) => application.resume_version_id === resume.id)
  const content = resume.content as { metadata?: { notes?: string }; notes?: string } | null
  const notes = content?.metadata?.notes ?? content?.notes

  return (
    <div className={styles.details}>
      <dl>
        <dt>Template</dt><dd>{resumeTemplate.name}</dd>
        <dt>Created</dt><dd>{resumeDate(resume.created_at)}</dd>
        <dt>Last modified</dt><dd>{resumeDate(resume.updated_at ?? resume.created_at)}</dd>
      </dl>
      <section>
        <h3>Linked applications</h3>
        {linked?.length ? (
          <ul>{linked.map(({ id, company, role }) => <li key={id}>{company} · {role}</li>)}</ul>
        ) : (
          <p>{linked ? "No applications are linked to this resume." : "Linked applications are unavailable."}</p>
        )}
      </section>
      {typeof notes === "string" && notes.trim() && <section><h3>Notes</h3><p className={styles.notes}>{notes}</p></section>}
      <section>
        <h3>Version history</h3>
        <p>This resume has no stored revisions. Duplicate it to keep a separate copy before making changes.</p>
      </section>
    </div>
  )
}
