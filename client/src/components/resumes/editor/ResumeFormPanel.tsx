"use client"

import type { ResumeData, ResumeHeader } from "./types"
import { Input } from "@/components/ui/input"
import { EducationEditor } from "./EducationEditor"
import { ExperienceEditor } from "./ExperienceEditor"
import { ProjectsEditor } from "./ProjectsEditor"
import { SkillsEditor } from "./SkillsEditor"
import styles from "../resumes.module.css"

const contactFields: { name: keyof ResumeHeader; label: string; type?: string; autoComplete?: string }[] = [
  { name: "fullName", label: "Full name", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "location", label: "Location" },
  { name: "linkedIn", label: "LinkedIn" },
  { name: "githubOrPortfolio", label: "GitHub or portfolio" },
]

export function ResumeFormPanel({ value, onChange, errors }: {
  value: ResumeData
  onChange: (next: ResumeData) => void
  errors: Record<string, string>
}) {
  return (
    <section className={styles.formPanel} aria-label="Resume fields">
      <details open>
        <summary>Personal information</summary>
        <div className={`${styles.fieldSection} ${styles.contactFields}`}>
          {contactFields.map(({ name, label, type, autoComplete }) => (
            <label key={name} className={styles.field}>
              {label}
              <Input id={name} value={value.header[name]} type={type ?? "text"} autoComplete={autoComplete}
                aria-invalid={errors[name] ? true : undefined} aria-describedby={errors[name] ? `${name}-error` : undefined}
                onChange={(event) => onChange({ ...value, header: { ...value.header, [name]: event.target.value } })}
              />
              {errors[name] && <small id={`${name}-error`} className={styles.error}>{errors[name]}</small>}
            </label>
          ))}
        </div>
      </details>
      <details>
        <summary>Work experience <span>{value.experience.length}</span></summary>
        <div className={styles.fieldSection}><ExperienceEditor errors={errors} value={value.experience} onChange={(experience) => onChange({ ...value, experience })} /></div>
      </details>
      <details>
        <summary>Education <span>{value.education.length}</span></summary>
        <div className={styles.fieldSection}><EducationEditor value={value.education} onChange={(education) => onChange({ ...value, education })} /></div>
      </details>
      <details>
        <summary>Projects <span>{value.projects.length}</span></summary>
        <div className={styles.fieldSection}><ProjectsEditor value={value.projects} onChange={(projects) => onChange({ ...value, projects })} errors={errors} /></div>
      </details>
      <details>
        <summary>Technical skills</summary>
        <div className={styles.fieldSection}><SkillsEditor value={value.skills} onChange={(skills) => onChange({ ...value, skills })} /></div>
      </details>
    </section>
  )
}
