"use client"

import { useEffect, useMemo, useState } from "react"
import type { ResumeData } from "@/components/resumes/editor/types"
import { sampleResume } from "@/components/resumes/editor/sampleResumeData"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { ResumeFormPanel } from "@/components/resumes/editor/ResumeFormPanel"
import { ResumePreview } from "@/components/resumes/editor/ResumePreview"
import { fetchResumeById } from "@/lib/resume"

function safeString(v: unknown): string {
  return typeof v === "string" ? v : ""
}

function safeStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return []
  return v.filter((x) => typeof x === "string") as string[]
}

function parseResumeData(content: unknown): ResumeData | null {
  if (!content || typeof content !== "object") return null
  const rec = content as Record<string, unknown>

  const header = rec.header as Record<string, unknown> | undefined
  const education = rec.education
  const experience = rec.experience
  const projects = rec.projects
  const skills = rec.skills as Record<string, unknown> | undefined

  if (!header || typeof header !== "object") return null
  if (!Array.isArray(education) || !Array.isArray(experience) || !Array.isArray(projects)) return null
  if (!skills || typeof skills !== "object") return null

  const parsed: ResumeData = {
    id: safeString(rec.id) || sampleResume.id,
    header: {
      fullName: safeString(header.fullName),
      email: safeString(header.email),
      phone: safeString(header.phone),
      location: safeString(header.location),
      linkedIn: safeString(header.linkedIn),
      githubOrPortfolio: safeString(header.githubOrPortfolio),
    },
    education: education.map((e) => {
      const r = e as Record<string, unknown>
      return {
        id: safeString(r.id) || `edu_${Math.random().toString(16).slice(2)}`,
        school: safeString(r.school),
        degree: safeString(r.degree),
        graduationDate: safeString(r.graduationDate),
        gpa: r.gpa === undefined ? undefined : safeString(r.gpa),
      }
    }),
    experience: experience.map((e) => {
      const r = e as Record<string, unknown>
      return {
        id: safeString(r.id) || `exp_${Math.random().toString(16).slice(2)}`,
        company: safeString(r.company),
        role: safeString(r.role),
        dates: safeString(r.dates),
        location: safeString(r.location),
        bullets: safeStringArray(r.bullets),
      }
    }),
    projects: projects.map((p) => {
      const r = p as Record<string, unknown>
      return {
        id: safeString(r.id) || `proj_${Math.random().toString(16).slice(2)}`,
        projectName: safeString(r.projectName),
        techStack: safeString(r.techStack),
        link: r.link === undefined ? undefined : safeString(r.link),
        bullets: safeStringArray(r.bullets),
      }
    }),
    skills: {
      languages: safeStringArray(skills.languages),
      frameworks: safeStringArray(skills.frameworks),
      tools: safeStringArray(skills.tools),
      databases: safeStringArray(skills.databases),
    },
  }

  // Ensure the editor has at least something sensible.
  if (!parsed.header.fullName) return null

  return parsed
}

export function ResumeEditorShell({ resumeId }: { resumeId: string }) {
  const initial = useMemo<ResumeData>(() => {
    // UI-only fallback: seed with a realistic CS new-grad resume.
    return { ...sampleResume, id: resumeId }
  }, [resumeId])

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [resume, setResume] = useState<ResumeData>(initial)
  const [pdfUrl, setPdfUrl] = useState("")
  const [isCompiling, setIsCompiling] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const row = await fetchResumeById(resumeId)
        const parsed = parseResumeData(row.content)
        if (cancelled) return
        if (parsed) {
          setResume({ ...parsed, id: resumeId })
        } else {
          setResume(initial)
        }
      } catch {
        if (cancelled) return
        setResume(initial)
      }
    }

    load()
    compilePdf()
    return () => {
      cancelled = true
    }
  }, [resumeId, initial])

  async function compilePdf() {
    try {
      setIsCompiling(true)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/resumes/${resumeId}/compile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ content: resume }),
        }
      )

      if (!res.ok) {
        throw new Error("Failed to compile PDF")
      }

      const blob = await res.blob()

      const url = URL.createObjectURL(blob)

      setPdfUrl(url)
    } catch (err) {
      console.error(err)
    } finally {
      setIsCompiling(false)
    }
  }

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
            <ResumePreview
              value={resume}
              pdfUrl={pdfUrl}
              onCompile={compilePdf}
              isCompiling={isCompiling}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

