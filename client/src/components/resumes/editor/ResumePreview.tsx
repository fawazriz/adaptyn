"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { resumeTemplate } from "./resume-data"
import { downloadPdf } from "../useResumePdf"
import styles from "../resumes.module.css"

type PreviewProps = {
  name: string
  url?: string
  busy: boolean
  error: string
  stale?: boolean
  onGenerate: () => void
}

export function ResumePreview({ name, url, busy, error, stale, onGenerate }: PreviewProps) {
  return (
    <section className={styles.preview} aria-label="PDF preview" aria-busy={busy}>
      <div className={styles.previewToolbar}>
        <span>{resumeTemplate.name}</span>
        {url && <a href={url} target="_blank" rel="noopener noreferrer">Open PDF in new tab</a>}
      </div>
      {error && <p className={styles.error} role="alert">{error}</p>}
      {busy && <p className={styles.previewStatus} role="status">Generating PDF…</p>}
      {stale && !busy && <p className={styles.previewStatus}>Your edits aren’t in this preview yet.</p>}
      {url ? (
        <iframe title={`PDF preview of ${name}`} src={url} className={styles.pdf} />
      ) : (
        <div className={styles.previewEmpty}>
          <p>Generate a PDF to see the document and its page breaks.</p>
          <button type="button" className={styles.secondary} onClick={onGenerate} disabled={busy}>{error ? "Retry preview" : "Generate preview"}</button>
        </div>
      )}
      {url && stale && <button type="button" className={styles.secondary} onClick={onGenerate} disabled={busy}>Refresh preview</button>}
    </section>
  )
}

export function ResumePreviewDialog({ open, onOpenChange, onEdit, ...preview }: PreviewProps & {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: React.ReactNode
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${styles.dialog} ${styles.previewDialog}`}>
        <DialogHeader>
          <DialogTitle>{preview.name}</DialogTitle>
          <DialogDescription>Resume preview</DialogDescription>
        </DialogHeader>
        <div className={styles.actions}>
          {onEdit}
          <button type="button" className={styles.primary} disabled={!preview.url || preview.busy} onClick={() => {
            if (preview.url) downloadPdf(preview.url, preview.name)
          }}>Download PDF</button>
        </div>
        <ResumePreview {...preview} />
      </DialogContent>
    </Dialog>
  )
}
