"use client"

import { useRouter } from "next/navigation"
import { useRef, useState, type FormEvent } from "react"
import { IconPlus } from "@tabler/icons-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createResume, resumePath } from "@/lib/resume"
import { blankResume, resumeTemplate } from "./editor/resume-data"
import { ResumeTemplate } from "./ResumeTemplate"
import styles from "./resumes.module.css"

export function CreateResumeDialog({ label = "New resume" }: { label?: string }) {
  const router = useRouter()
  const pending = useRef(false)
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<"create" | "import">("create")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending.current) return
    const fields = new FormData(event.currentTarget)
    const name = String(fields.get("name") ?? "").trim()
    const targetRole = String(fields.get("targetRole") ?? "").trim()
    const notes = String(fields.get("notes") ?? "").trim()
    if (!name) {
      setError("Enter a resume name.")
      return
    }
    pending.current = true
    setBusy(true)
    setError("")
    try {
      const resume = await createResume({
        name,
        target_role: targetRole,
        content: {
          ...blankResume(),
          metadata: { template: resumeTemplate.id, notes, targetRole },
        },
      })
      setOpen(false)
      router.push(resumePath(resume.id))
    } catch {
      setError("Couldn’t create the resume. Try again.")
    } finally {
      pending.current = false
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => {
      if (pending.current) return
      setOpen(next)
      if (next) { setError(""); setMode("create") }
    }}>
      <DialogTrigger asChild>
        <button type="button" className={styles.primary}><IconPlus size={17} aria-hidden="true" />{label}</button>
      </DialogTrigger>
      <DialogContent className={styles.dialog}>
        <DialogHeader>
          <DialogTitle>New resume</DialogTitle>
          <DialogDescription>Choose how to start.</DialogDescription>
        </DialogHeader>
        <div className={styles.switch} role="group" aria-label="Resume starting point">
          <button type="button" aria-pressed={mode === "create"} disabled={busy} onClick={() => setMode("create")}>Create a resume</button>
          <button type="button" aria-pressed={mode === "import"} disabled={busy} onClick={() => setMode("import")}>Import a resume</button>
        </div>
        <form className={styles.form} onSubmit={handleCreate} hidden={mode !== "create"}>
          <label>Resume name<input name="name" placeholder="Software engineer resume" required /></label>
          <label>Target role <span>(optional)</span><input name="targetRole" placeholder="Software engineer" /></label>
          <label>Notes <span>(optional)</span><textarea name="notes" rows={2} /></label>
          <ResumeTemplate />
          {error && <p className={styles.error} role="alert">{error}</p>}
          <DialogFooter>
            <button type="submit" className={styles.primary} disabled={busy}>{busy ? "Creating…" : "Create and edit"}</button>
          </DialogFooter>
        </form>
        {mode === "import" && (
          <div className={styles.notice}>
            <strong>Import is unavailable.</strong>
            <p>PDF and DOCX upload and parsing aren’t supported. You can create a blank resume and copy your details into the editor.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
