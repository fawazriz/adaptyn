"use client"

import type { ResumeVersion } from "@/components/resumes/types"
import { mockResumes } from "@/components/resumes/mock-data"

const STORAGE_KEY = "adaptyn_resume_versions_mock_v1"

function safeParse(json: string): unknown {
  try {
    return JSON.parse(json) as unknown
  } catch {
    return null
  }
}

function todayLabel() {
  // Keep stable formatting for the UI.
  return new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function makeId() {
  // Prefer crypto.randomUUID when available.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID()
  return `resume_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

export function readStoredResumes(): ResumeVersion[] {
  if (typeof window === "undefined") return mockResumes

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return mockResumes

  const parsed = safeParse(raw)
  if (!Array.isArray(parsed)) return mockResumes

  // Best-effort validation; we still fall back to mock on shape mismatch.
  if (parsed.every((r) => r && typeof r === "object" && "id" in (r as any) && "name" in (r as any))) {
    return parsed as ResumeVersion[]
  }

  return mockResumes
}

export function writeStoredResumes(resumes: ResumeVersion[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes))
}

export function createMockResume(params: {
  name: string
  targetRole: string
  template: string
  notes: string
}): ResumeVersion {
  const existing = readStoredResumes()

  const now = todayLabel()
  const newResume: ResumeVersion = {
    id: makeId(),
    name: params.name.trim(),
    version: "v1.0",
    targetRole: params.targetRole.trim(),
    template: params.template.trim(),
    status: "draft",
    updatedAt: now,
    applicationsCount: 0,
    notes: params.notes.trim(),
    versionHistory: [
      {
        id: makeId(),
        version: "v1.0",
        updatedAt: now,
        summary: "Created from template.",
      },
    ],
    linkedApplications: [],
  }

  const updated = [newResume, ...existing]
  writeStoredResumes(updated)
  return newResume
}

export function updateMockResume(params: { id: string; patch: Partial<ResumeVersion> }) {
  const existing = readStoredResumes()
  const idx = existing.findIndex((r) => r.id === params.id)
  if (idx === -1) return

  const now = todayLabel()
  const updated = [...existing]
  updated[idx] = {
    ...updated[idx],
    ...params.patch,
    updatedAt: now,
  }

  writeStoredResumes(updated)
}

