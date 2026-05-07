"use client"

import { useEffect, useMemo, useState } from "react"
import type { ResumeData } from "@/components/resumes/editor/types"
import { sampleResume } from "@/components/resumes/editor/sampleResumeData"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { ResumeFormPanel } from "@/components/resumes/editor/ResumeFormPanel"
import { ResumePreview } from "@/components/resumes/editor/ResumePreview"

const STORAGE_PREFIX = "adaptyn_resume_editor_data_v1"

function storageKey(resumeId: string) {
  return `${STORAGE_PREFIX}:${resumeId}`
}

function safeParse(json: string): unknown {
  try {
    return JSON.parse(json) as unknown
  } catch {
    return null
  }
}

export function ResumeEditorShell({ resumeId }: { resumeId: string }) {
  const initial = useMemo<ResumeData>(() => {
    // UI-only: seed with a realistic CS new-grad resume.
    // Later: backend will hydrate structured data for resumeId.
    return { ...sampleResume, id: resumeId }
  }, [resumeId])

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [resume, setResume] = useState<ResumeData>(initial)

  useEffect(() => {
    if (typeof window === "undefined") return
    const raw = window.localStorage.getItem(storageKey(resumeId))
    if (!raw) return
    const parsed = safeParse(raw)
    if (parsed && typeof parsed === "object") {
      setResume(parsed as ResumeData)
    }
  }, [resumeId])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(storageKey(resumeId), JSON.stringify(resume))
  }, [resume, resumeId])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-5">
          <div>
            <h1 className="text-sm font-semibold text-foreground">Resume Editor</h1>
            <p className="text-xs text-muted-foreground">
              Edit structured fields and preview the output.
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="grid h-[calc(100vh-64px)] grid-cols-1 gap-4 p-5 lg:grid-cols-[420px_1fr] lg:gap-6">
            <ResumeFormPanel value={resume} onChange={setResume} />
            <ResumePreview value={resume} />
          </div>
        </main>
      </div>
    </div>
  )
}

