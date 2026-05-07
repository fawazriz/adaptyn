"use client"

import { useEffect, useState } from "react"
import type { ResumeVersion } from "@/components/resumes/types"
import { readStoredResumes } from "@/components/resumes/resume-store"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { ResumeEditorPanel } from "@/components/resumes/ResumeEditorPanel"
import { ResumePreviewPanel } from "@/components/resumes/ResumePreviewPanel"
import { Card, CardContent } from "@/components/ui/card"

export default function ResumeEditorRoutePage({
  params,
}: {
  params: { id: string }
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [resume, setResume] = useState<ResumeVersion | null>(null)
  const [previewDraft, setPreviewDraft] = useState<{
    name: string
    version: string
    template?: string
  } | null>(null)

  useEffect(() => {
    const all = readStoredResumes()
    const found = all.find((r) => r.id === params.id) ?? null
    setResume(found)
    if (found) {
      setPreviewDraft({
        name: found.name,
        version: found.version,
        template: found.template,
      })
    } else {
      setPreviewDraft(null)
    }
  }, [params.id])

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
              Edit resume version and preview changes.
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {resume ? (
            <div className="grid h-[calc(100vh-64px)] grid-cols-1 gap-4 p-5 lg:grid-cols-[420px_1fr]">
              <ResumeEditorPanel
                resume={resume}
                onPreviewChange={(draft) => setPreviewDraft(draft)}
              />
              <ResumePreviewPanel
                resume={resume}
                previewName={previewDraft?.name}
                previewTemplate={previewDraft?.template}
              />
            </div>
          ) : (
            <div className="p-5">
              <Card className="border-border/70">
                <CardContent className="py-10">
                  <p className="text-sm font-medium text-foreground">
                    Resume not found
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    This mock editor expects the resume to exist in localStorage.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

