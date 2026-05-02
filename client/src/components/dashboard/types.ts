export type ApplicationStatus =
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected"

export type WorkType = "in-person" | "hybrid" | "remote"

export interface Application {
  id: string
  company: string
  referenceNumber?: string
  role: string
  workType?: WorkType
  salary?: number
  url: string
  dateApplied: string
  status: ApplicationStatus
  lastActivity: string
  statusTag?: string
  note?: string
}

export interface Profile {
  id?: string
  full_name: string
  email: string
}