"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreateResumeDialog } from "@/components/resumes/CreateResumeDialog"
import { ResumeDetailPanel, type LinkedApplication } from "@/components/resumes/ResumeDetailPanel"
import { ResumeLibrary, type ResumeAction } from "@/components/resumes/ResumeLibrary"
import { ResumeWorkspace } from "@/components/resumes/ResumeWorkspace"
import { prepareResumePdf, readResume } from "@/components/resumes/editor/resume-data"
import { ResumePreviewDialog } from "@/components/resumes/editor/ResumePreview"
import { downloadPdf, useResumePdf } from "@/components/resumes/useResumePdf"
import { createResume, deleteResume, fetchResumes, resumePath, updateResume, type ResumeApiRow } from "@/lib/resume"
import styles from "@/components/resumes/resumes.module.css"

const actionTitles = {
  rename: "Rename resume",
  duplicate: "Duplicate resume",
  delete: "Delete resume?",
  archive: "Archive resume?",
  details: "Version details",
}

export default function ResumesPage() {
  const router = useRouter()
  const [resumes, setResumes] = useState<ResumeApiRow[]>([])
  const [applications, setApplications] = useState<LinkedApplication[] | null>(null)
  const [load, setLoad] = useState<"loading" | "ready" | "error">("loading")
  const [attempt, setAttempt] = useState(0)
  const [dialog, setDialog] = useState<{ action: ResumeAction; resume: ResumeApiRow } | null>(null)
  const [error, setError] = useState("")
  const [mutating, setMutating] = useState(false)
  const pending = useRef(false)
  const [exporting, setExporting] = useState<string | null>(null)
  const pdf = useResumePdf()

  useEffect(() => {
    let ignore = false
    fetchResumes().then((rows) => {
      if (ignore) return
      setResumes(rows)
      setLoad("ready")
    }).catch(() => {
      if (!ignore) setLoad("error")
    })
    return () => { ignore = true }
  }, [attempt])

  useEffect(() => {
    const controller = new AbortController()
    fetch("/api/applications", {
      credentials: "include",
      cache: "no-store",
      signal: controller.signal,
    }).then(async (response) => {
      if (!response.ok) return
      const rows: LinkedApplication[] = await response.json()
      if (!controller.signal.aborted) setApplications(rows)
    }).catch(() => {})
    return () => controller.abort()
  }, [])

  function generate(resume: ResumeApiRow) {
    const prepared = prepareResumePdf(readResume(resume.content, resume.id))
    const issue = Object.values(prepared.errors)[0]
    setError(issue ? `${issue} Open the editor to make changes.` : "")
    if (!issue) return pdf.generate(resume.id, resume.id, prepared.content)
  }

  function open(action: ResumeAction, resume: ResumeApiRow) {
    if (action === "preview" && pdf.busy) return
    setError("")
    setDialog({ action, resume })
    if (action === "preview") void generate(resume)
  }

  async function download(resume: ResumeApiRow) {
    if (pdf.busy) return
    setExporting(resume.id)
    try {
      const url = await generate(resume)
      if (url) downloadPdf(url, resume.name)
    } finally {
      setExporting(null)
    }
  }

  async function commit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!dialog || pending.current) return
    const { resume, action } = dialog
    const name = String(new FormData(event.currentTarget).get("name") ?? "").trim()
    if ((action === "rename" || action === "duplicate") && !name) {
      setError("Enter a resume name.")
      return
    }

    pending.current = true
    setMutating(true)
    setError("")
    try {
      if (action === "delete") {
        await deleteResume(resume.id)
        setResumes((rows) => rows.filter(({ id }) => id !== resume.id))
      } else if (action === "duplicate") {
        const copy = await createResume({ name, content: resume.content, target_role: resume.target_role ?? "" })
        setResumes((rows) => [...rows, copy])
        setDialog(null)
        router.push(resumePath(copy.id))
        return
      } else if (action === "rename" || action === "archive") {
        const saved = await updateResume(resume.id, action === "archive" ? { status: "archived" } : { name })
        setResumes((rows) => rows.map((row) => row.id === saved.id ? saved : row))
      }
      setDialog(null)
    } catch {
      setError(`Couldn’t ${action} this resume. Try again.`)
    } finally {
      pending.current = false
      setMutating(false)
    }
  }

  return (
    <ResumeWorkspace>
      <div className={styles.library}>
        <header className={styles.heading}>
          <div><h1>Resumes</h1><p>Create, edit, and manage your resume versions.</p></div>
          <CreateResumeDialog />
        </header>
        {load === "loading" && <div className={styles.empty} role="status">Loading resumes…</div>}
        {load === "error" && (
          <div className={styles.empty}>
            <p role="alert">Couldn’t load your resumes.</p>
            <button type="button" className={styles.secondary} onClick={() => { setLoad("loading"); setAttempt(attempt + 1) }}>Retry</button>
          </div>
        )}
        {load === "ready" && (resumes.length ? (
          <ResumeLibrary resumes={resumes} applications={applications} exporting={exporting} pdfBusy={pdf.busy} onAction={open} onDownload={download} />
        ) : (
          <div className={styles.empty}>
            <h2>No resumes yet.</h2>
            <p>Create a resume from scratch to get started.</p>
            <CreateResumeDialog label="Create resume" />
          </div>
        ))}
        {(error || pdf.error) && !dialog && <p className={styles.error} role="alert">{error || pdf.error}</p>}

        {dialog?.action === "preview" && (
          <ResumePreviewDialog
            open
            onOpenChange={(open) => { if (!open) setDialog(null) }}
            name={dialog.resume.name}
            url={pdf.pdf?.key === dialog.resume.id ? pdf.pdf.url : undefined}
            busy={pdf.busy}
            error={error || pdf.error}
            onGenerate={() => void generate(dialog.resume)}
            onEdit={<Link className={styles.secondary} href={resumePath(dialog.resume.id)}>Open editor</Link>}
          />
        )}
        {dialog && dialog.action !== "preview" && (
          <Dialog open onOpenChange={(open) => { if (!open && !pending.current) setDialog(null) }}>
            <DialogContent className={styles.dialog}>
              <DialogHeader>
                <DialogTitle>{actionTitles[dialog.action]}</DialogTitle>
                <DialogDescription>{dialog.resume.name}</DialogDescription>
              </DialogHeader>
              {dialog.action === "details" ? <ResumeDetailPanel resume={dialog.resume} applications={applications} /> : (
                <form className={styles.form} onSubmit={commit}>
                  {(dialog.action === "rename" || dialog.action === "duplicate") && (
                    <label>Resume name<input name="name" required defaultValue={dialog.action === "duplicate" ? `${dialog.resume.name} (copy)` : dialog.resume.name} /></label>
                  )}
                  {dialog.action === "duplicate" && <p className={styles.muted}>The copy starts as a draft with its own edits and no linked applications.</p>}
                  {dialog.action === "delete" && <p>Deleting this resume permanently removes its saved content.</p>}
                  {dialog.action === "archive" && <p>The resume will stay in the library with an archived status.</p>}
                  {error && <p className={styles.error} role="alert">{error}</p>}
                  <DialogFooter>
                    <button type="button" className={styles.secondary} onClick={() => setDialog(null)} disabled={mutating}>Cancel</button>
                    <button type="submit" className={dialog.action === "delete" ? styles.destructive : styles.primary} disabled={mutating}>
                      {mutating ? "Working…" : { rename: "Save name", duplicate: "Duplicate and edit", delete: "Delete resume", archive: "Archive resume" }[dialog.action]}
                    </button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </ResumeWorkspace>
  )
}
