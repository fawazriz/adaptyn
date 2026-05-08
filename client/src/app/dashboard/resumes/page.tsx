"use client"

import { useEffect, useMemo, useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { CreateResumeDialog } from "@/components/resumes/CreateResumeDialog"
import { ResumeDetailPanel } from "@/components/resumes/ResumeDetailPanel"
import { ResumeLibrary } from "@/components/resumes/ResumeLibrary"
import { ResumesStats } from "@/components/resumes/ResumesStats"
import type { ResumeVersion } from "@/components/resumes/types"
import { mockResumes } from "@/components/resumes/mock-data"
import { fetchResumes } from "@/lib/resume"
import type { ApplicationStatus } from "@/components/dashboard/types"

export default function ResumesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [resumes, setResumes] = useState<ResumeVersion[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  type ApplicationApiRow = {
    id: string
    company: string
    role: string
    job_url?: string | null
    status: ApplicationStatus | string
    applied_date?: string | null
    resume_version_id?: string | null
  }

  function formatShortDate(input?: string | null) {
    if (!input) return "—"
    const d = new Date(input)
    if (Number.isNaN(d.getTime())) return "—"
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setIsLoading(true)
        const [resumeRows, applications] = await Promise.all([
          fetchResumes(),
          (async () => {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/applications`,
              {
                method: "GET",
                credentials: "include",
                cache: "no-store",
              }
            )
            if (!res.ok) {
              throw new Error("Failed to fetch applications")
            }
            return res.json()
          })() as Promise<ApplicationApiRow[]>,
        ])

        const mapped: ResumeVersion[] = resumeRows.map((r) => {
          const linked = applications.filter(
            (a) => a.resume_version_id && a.resume_version_id === r.id
          )

          const content = r.content as unknown
          const notes =
            typeof content === "object" &&
            content !== null &&
            "notes" in (content as Record<string, unknown>) &&
            typeof (content as Record<string, unknown>).notes === "string"
              ? (content as Record<string, unknown>).notes
              : ""

          const updatedAt = formatShortDate(r.updated_at ?? r.created_at)

          return {
            id: String(r.id),
            name: String(r.name ?? "Untitled resume"),
            version: "current",
            targetRole: String(r.target_role ?? ""),
            status: (r.status === "active" || r.status === "archived" || r.status === "draft"
              ? r.status
              : "draft") as ResumeVersion["status"],
            updatedAt,
            applicationsCount: linked.length,
            notes: String(notes ?? ""),
            versionHistory: [
              {
                id: `${r.id}_current`,
                version: "current",
                updatedAt,
                summary: "Current snapshot (stored in backend).",
              },
            ],
            linkedApplications: linked.map((app) => ({
              id: app.id,
              company: app.company,
              role: app.role,
              stage: String(app.status),
              appliedAt: formatShortDate(app.applied_date),
            })),
          }
        })

        if (cancelled) return
        setResumes(mapped)
        setSelectedResumeId((prev) => {
          if (prev && mapped.some((m) => m.id === prev)) return prev
          return mapped[0]?.id ?? ""
        })
      } catch {
        if (cancelled) return
        // If the API is unreachable (e.g. auth/cookie not present), keep the UI usable.
        setResumes(mockResumes)
        setSelectedResumeId(mockResumes[0]?.id ?? "")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!selectedResumeId && resumes[0]?.id) setSelectedResumeId(resumes[0].id)
    if (selectedResumeId && !resumes.some((r) => r.id === selectedResumeId)) {
      setSelectedResumeId(resumes[0]?.id ?? "")
    }
  }, [resumes, selectedResumeId])

  const selectedResume = useMemo(
    () => resumes.find((resume) => resume.id === selectedResumeId) ?? resumes[0],
    [resumes, selectedResumeId]
  )

  const totalResumes = resumes.length
  const activeResumes = Array.isArray(resumes)
    ? resumes.filter((resume) => resume.status === "active").length
    : 0
  const linkedApplications = resumes.reduce(
    (sum, resume) => sum + resume.applicationsCount,
    0
  )

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-5">
          <div>
            <h1 className="text-sm font-semibold text-foreground">Resumes</h1>
            <p className="text-xs text-muted-foreground">
              Manage versions, track usage, and see which resumes get responses.
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <CreateResumeDialog />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="grid gap-4 p-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <section className="space-y-4">
              <ResumesStats
                totalResumes={totalResumes}
                activeResumes={activeResumes}
                linkedApplications={linkedApplications}
              />
              <ResumeLibrary
                resumes={resumes}
                selectedResumeId={selectedResume?.id ?? ""}
                onSelectResume={setSelectedResumeId}
              />
            </section>

            {isLoading ? null : selectedResume ? (
              <ResumeDetailPanel resume={selectedResume} />
            ) : null}
          </div>
        </main>
      </div>
    </div>
  )
}
