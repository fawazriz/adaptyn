"use client"

import Link from "next/link"
import { useEffect, useRef, useState, type MouseEvent } from "react"
import { IconArrowLeft, IconDownload } from "@tabler/icons-react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { fetchResumeById, resumesPath, updateResume } from "@/lib/resume"
import { ResumeWorkspace } from "../ResumeWorkspace"
import { ResumeTemplate } from "../ResumeTemplate"
import { downloadPdf, useResumePdf } from "../useResumePdf"
import { ResumeFormPanel } from "./ResumeFormPanel"
import { ResumePreview, ResumePreviewDialog } from "./ResumePreview"
import { prepareResumePdf, readResume, resumeFieldErrors, resumeForSubmission } from "./resume-data"
import type { ResumeData } from "./types"
import styles from "../resumes.module.css"

type Draft = { name: string; resume: ResumeData }

export function ResumeEditorShell({ resumeId }: { resumeId: string }) {
  const [saved, setSaved] = useState<Draft | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [loadError, setLoadError] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [pane, setPane] = useState<"edit" | "preview">("edit")
  const [expanded, setExpanded] = useState(false)
  const pending = useRef(false)
  const pdf = useResumePdf()
  const dirty = Boolean(saved && draft && (saved.name !== draft.name || saved.resume !== draft.resume))

  useEffect(() => {
    let ignore = false
    fetchResumeById(resumeId).then((row) => {
      if (ignore) return
      const initial = { name: row.name, resume: readResume(row.content, resumeId) }
      setDraft(initial)
      setSaved(initial)
    }).catch(() => {
      if (!ignore) setLoadError(true)
    })
    return () => { ignore = true }
  }, [resumeId, attempt])

  useEffect(() => {
    if (!dirty) return
    function warn(event: BeforeUnloadEvent) {
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [dirty])

  function confirmNavigation(event: MouseEvent<HTMLDivElement>) {
    if (!dirty || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const link = event.target instanceof Element ? event.target.closest("a[href]") : null
    if (!(link instanceof HTMLAnchorElement) || link.target || link.hasAttribute("download")) return
    if (link.origin === location.origin && link.pathname !== location.pathname &&
      !window.confirm("Leave this editor and discard unsaved changes?")) {
      event.preventDefault()
    }
  }

  function showValidation(problems: Record<string, string>) {
    setFieldErrors(problems)
    const first = Object.keys(problems)[0]
    if (!first) return true
    setError("Check the highlighted fields and try again.")
    setPane("edit")
    window.requestAnimationFrame(() => {
      const input = document.getElementById(first)
      const section = input?.closest("details")
      if (section) section.open = true
      input?.focus()
    })
    return false
  }

  async function save() {
    if (!draft || !saved || !dirty || pending.current) return
    setError("")
    const problems = resumeFieldErrors(draft.resume)
    if (!draft.name.trim()) problems["resume-title"] = "Enter a resume name."
    if (!showValidation(problems)) return
    const submitted = { ...draft, name: draft.name.trim() }
    pending.current = true
    setSaving(true)
    try {
      const row = await updateResume(resumeId, {
        ...(submitted.name !== saved.name && { name: submitted.name }),
        ...(submitted.resume !== saved.resume && { content: resumeForSubmission(submitted.resume) }),
      })
      const next = { ...submitted, name: row.name }
      setSaved(next)
      setDraft((current) => current === draft ? next : current)
    } catch {
      setError("Couldn’t save the resume. Your edits are still here. Try saving again.")
    } finally {
      pending.current = false
      setSaving(false)
    }
  }

  const previewKey = draft ? JSON.stringify(draft.resume) : ""

  async function generate(action: "preview" | "download" | "expand") {
    if (!draft || pdf.busy) return
    setError("")
    const prepared = prepareResumePdf(draft.resume)
    if (!showValidation(prepared.errors)) return
    if (action === "expand") setExpanded(true)
    if (action !== "download") setPane("preview")
    const url = await pdf.generate(resumeId, previewKey, prepared.content)
    if (url && action === "download") downloadPdf(url, draft.name)
  }

  const preview = {
    name: draft?.name || "Untitled resume",
    url: pdf.pdf?.url,
    stale: Boolean(pdf.pdf && pdf.pdf.key !== previewKey),
    busy: pdf.busy,
    error: pdf.error,
    onGenerate: () => void generate("preview"),
  }
  const backLink = <Link className={styles.back} href={resumesPath}><IconArrowLeft size={16} aria-hidden="true" /> Back to Resumes</Link>

  return (
    <ResumeWorkspace onClickCapture={confirmNavigation}>
      {!draft ? (
        <div className={styles.library}>
          {backLink}
          <div className={styles.empty}>
            {loadError ? (
              <>
                <p role="alert">Couldn’t load this resume. It may have been deleted or you may no longer have access.</p>
                <button type="button" className={styles.secondary} onClick={() => { setLoadError(false); setAttempt(attempt + 1) }}>Retry</button>
              </>
            ) : <p role="status">Loading resume…</p>}
          </div>
        </div>
      ) : (
        <div className={styles.editor}>
          <header className={styles.editorHeader}>
            <h1 className="sr-only">Resume editor</h1>
            {backLink}
            <div className={styles.editorHeading}>
              <div className={styles.editorName}>
                <label htmlFor="resume-title">Resume name</label>
                <input id="resume-title" value={draft.name} required
                  aria-invalid={Boolean(fieldErrors["resume-title"])} aria-describedby={fieldErrors["resume-title"] ? "resume-title-error" : undefined}
                  onChange={(event) => {
                    setDraft({ ...draft, name: event.target.value })
                    setFieldErrors((current) => ({ ...current, "resume-title": "" }))
                  }}
                />
                {fieldErrors["resume-title"] && <small id="resume-title-error" className={styles.error}>{fieldErrors["resume-title"]}</small>}
                <p className={styles.saveStatus} role="status">{saving ? "Saving…" : dirty ? "Unsaved changes" : "All changes saved"}</p>
              </div>
              <div className={styles.actions}>
                <Dialog>
                  <DialogTrigger asChild><button type="button" className={styles.secondary}>Template</button></DialogTrigger>
                  <DialogContent className={styles.dialog}>
                    <DialogHeader><DialogTitle>Resume template</DialogTitle><DialogDescription>The current LaTeX template is used for preview and export.</DialogDescription></DialogHeader>
                    <ResumeTemplate />
                    <DialogClose asChild><button type="button" className={styles.primary}>Use this template</button></DialogClose>
                  </DialogContent>
                </Dialog>
                <button type="button" className={styles.secondary} onClick={() => void generate("expand")} disabled={pdf.busy}>Preview PDF</button>
                <button type="button" className={styles.secondary} disabled={pdf.busy} onClick={() => void generate("download")}>
                  <IconDownload size={16} aria-hidden="true" /> {pdf.busy ? "Generating…" : "Download PDF"}
                </button>
                <button type="button" className={styles.primary} disabled={!dirty || saving} onClick={() => void save()}>{saving ? "Saving…" : "Save changes"}</button>
              </div>
            </div>
            {error && <p className={styles.error} role="alert">{error}</p>}
            {pdf.error && pane === "edit" && !expanded && <p className={styles.error} role="alert">{pdf.error}</p>}
          </header>
          <div className={`${styles.switch} ${styles.mobileSwitch}`} role="group" aria-label="Editor view">
            <button type="button" aria-pressed={pane === "edit"} onClick={() => setPane("edit")}>Edit</button>
            <button type="button" aria-pressed={pane === "preview"} onClick={() => setPane("preview")}>Preview</button>
          </div>
          <div className={styles.split} data-pane={pane}>
            <div className={styles.fieldsPane}>
              <ResumeFormPanel value={draft.resume} errors={fieldErrors} onChange={(resume) => {
                setDraft({ ...draft, resume })
                if (Object.keys(fieldErrors).length) {
                  setFieldErrors((current) => ({ ...(current["resume-title"] ? { "resume-title": current["resume-title"] } : {}), ...prepareResumePdf(resume).errors }))
                }
              }} />
            </div>
            <div className={styles.previewPane}>
              {!expanded && <ResumePreview {...preview} />}
            </div>
          </div>
          {expanded && (
            <ResumePreviewDialog
              {...preview}
              url={preview.stale ? undefined : preview.url}
              open
              onOpenChange={setExpanded}
              onEdit={<button type="button" className={styles.secondary} onClick={() => { setExpanded(false); setPane("edit") }}>Return to editor</button>}
            />
          )}
        </div>
      )}
    </ResumeWorkspace>
  )
}
