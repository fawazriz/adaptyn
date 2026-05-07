"use client"

import { useEffect, useMemo, useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { CreateResumeDialog } from "@/components/resumes/CreateResumeDialog"
import { ResumeDetailPanel } from "@/components/resumes/ResumeDetailPanel"
import { ResumeLibrary } from "@/components/resumes/ResumeLibrary"
import { ResumesStats } from "@/components/resumes/ResumesStats"
import { readStoredResumes } from "@/components/resumes/resume-store"

export default function ResumesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [resumes, setResumes] = useState(() => readStoredResumes())
  const [selectedResumeId, setSelectedResumeId] = useState("")

  useEffect(() => {
    // Keep selection stable when the stored list changes.
    setResumes(readStoredResumes())
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
  const activeResumes = resumes.filter((resume) => resume.status === "active").length
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

            {selectedResume ? <ResumeDetailPanel resume={selectedResume} /> : null}
          </div>
        </main>
      </div>
    </div>
  )
}
