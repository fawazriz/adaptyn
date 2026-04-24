export type ApplicationStatus =
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected"

export interface Application {
  id: string
  company: string
  role: string
  status: ApplicationStatus
  resumeVersion: string
  lastActivity: string
  statusTag?: string
  note?: string
}