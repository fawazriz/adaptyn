"use client"

import type { Skills } from "./types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { IconTrash } from "@tabler/icons-react"
import styles from "../resumes.module.css"

const categories = [
  { key: "languages", label: "Languages" },
  { key: "frameworks", label: "Frameworks and libraries" },
  { key: "databases", label: "Databases" },
  { key: "tools", label: "Developer tools" },
  { key: "concepts", label: "Concepts" },
] as const

export function SkillsEditor({ value, onChange }: {
  value: Skills
  onChange: (next: Skills) => void
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground" id="resume-skills-help">Enter one skill per line.</p>
      {categories.map(({ key, label }) => (
        <div key={key} className={styles.field}>
          <div className="flex items-center justify-between gap-2">
            <label htmlFor={`resume-skills-${key}`}>{label}</label>
            <Button type="button" variant="ghost" size="icon" aria-label={`Clear ${label.toLowerCase()}`} onClick={() => onChange({ ...value, [key]: [] })}>
              <IconTrash size={16} aria-hidden="true" />
            </Button>
          </div>
          <Textarea id={`resume-skills-${key}`} aria-describedby="resume-skills-help" rows={3}
            value={(value[key] ?? []).join("\n")}
            onChange={(event) => onChange({ ...value, [key]: event.target.value.split("\n") })}
          />
        </div>
      ))}
    </div>
  )
}
