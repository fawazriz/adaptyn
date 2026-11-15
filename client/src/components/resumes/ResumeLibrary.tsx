"use client"

import Link from "next/link"
import { useState } from "react"
import { IconDots, IconFileText, IconSearch } from "@tabler/icons-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { resumePath, type ResumeApiRow } from "@/lib/resume"
import type { LinkedApplication } from "./ResumeDetailPanel"
import { resumeDate, resumeTemplate } from "./editor/resume-data"
import styles from "./resumes.module.css"

export type ResumeAction = "preview" | "duplicate" | "rename" | "delete" | "details" | "archive"

export function ResumeLibrary({ resumes, applications, exporting, pdfBusy, onAction, onDownload }: {
  resumes: ResumeApiRow[]
  applications: LinkedApplication[] | null
  exporting: string | null
  pdfBusy: boolean
  onAction: (action: ResumeAction, resume: ResumeApiRow) => void
  onDownload: (resume: ResumeApiRow) => void
}) {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState("recent")
  const visible = resumes.filter(({ name }) => name.toLowerCase().includes(query.trim().toLowerCase()))
  visible.sort((a, b) => sort === "name"
    ? a.name.localeCompare(b.name)
    : (Date.parse(b.updated_at ?? b.created_at ?? "") || 0) - (Date.parse(a.updated_at ?? a.created_at ?? "") || 0))

  return (
    <section aria-label="Resume library">
      <div className={styles.toolbar}>
        <label className={styles.search}>
          <span className="sr-only">Search resumes</span><IconSearch size={16} aria-hidden="true" />
          <input type="search" placeholder="Search by resume name" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <label className={styles.sort}>Sort by
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="recent">Last modified</option>
            <option value="name">Name</option>
          </select>
        </label>
        <span className={styles.count} role="status">{visible.length} {visible.length === 1 ? "resume" : "resumes"}</span>
      </div>
      {visible.length === 0 ? (
        <div className={styles.empty}>
          <p>No resumes match your search.</p>
          <button type="button" className={styles.secondary} onClick={() => { setQuery(""); setSort("recent") }}>Clear filters</button>
        </div>
      ) : (
        <div className={styles.tableWrap} role="region" aria-label="Resume records" tabIndex={0}>
          <table>
            <thead><tr><th scope="col">Resume</th><th scope="col">Template</th><th scope="col">Last modified</th><th scope="col">Applications</th><th scope="col">Actions</th></tr></thead>
            <tbody>
              {visible.map((resume) => {
                const linked = applications?.filter((application) => application.resume_version_id === resume.id)
                const status = resume.status === "active" || resume.status === "archived" ? resume.status : "draft"
                return (
                  <tr key={resume.id}>
                    <th scope="row">
                      <div className={styles.document}>
                        <IconFileText size={21} aria-hidden="true" />
                        <div>
                          <Link href={resumePath(resume.id)}>{resume.name}</Link>
                          <div className={styles.documentMeta}>
                            <span className={styles.recordStatus} data-status={status}>{status}</span>
                            {resume.target_role && <span>{resume.target_role}</span>}
                          </div>
                        </div>
                      </div>
                    </th>
                    <td>{resumeTemplate.name}</td>
                    <td className={styles.date}>{resumeDate(resume.updated_at ?? resume.created_at)}</td>
                    <td>{linked?.length === 1 ? linked[0].company : linked?.length ? `${linked.length} linked` : "—"}</td>
                    <td>
                      <div className={styles.rowActions}>
                        <Link href={resumePath(resume.id)} aria-label={`Edit ${resume.name}`}>Edit</Link>
                        <button type="button" onClick={() => onAction("preview", resume)} aria-label={`Preview ${resume.name}`} disabled={pdfBusy || Boolean(exporting)}>Preview</button>
                        <button type="button" disabled={pdfBusy || Boolean(exporting)} onClick={() => onDownload(resume)} aria-label={`Download PDF for ${resume.name}`}>{exporting === resume.id ? "Generating…" : "Download PDF"}</button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><button type="button" className={styles.iconButton} aria-label={`More actions for ${resume.name}`}><IconDots size={17} aria-hidden="true" /></button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className={styles.menu}>
                            <DropdownMenuItem onSelect={() => onAction("rename", resume)}>Rename</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => onAction("duplicate", resume)}>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => onAction("details", resume)}>Version details</DropdownMenuItem>
                            {status !== "archived" && <DropdownMenuItem onSelect={() => onAction("archive", resume)}>Archive</DropdownMenuItem>}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onSelect={() => onAction("delete", resume)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
