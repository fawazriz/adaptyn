export type ResumeStatus = "active" | "archived" | "draft"

export interface VersionHistoryItem {
  id: string
  version: string
  updatedAt: string
  summary: string
}

export interface LinkedApplication {
  id: string
  company: string
  role: string
  stage: string
  appliedAt: string
}

export interface ResumeVersion {
  id: string
  name: string
  version: string
  targetRole: string
  template?: string
  status: ResumeStatus
  updatedAt: string
  applicationsCount: number
  notes: string
  versionHistory: VersionHistoryItem[]
  linkedApplications: LinkedApplication[]
}
