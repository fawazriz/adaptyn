export type ApplicationStatus =
  | "saved"
  | "applied"
  | "phone_screen"
  | "interview"
  | "offer"
  | "rejected";

export type WorkType = "in-person" | "hybrid" | "remote"

export interface Application {
  id: string
  company: string
  referenceNumber?: string
  role: string
  location?: string
  workType?: WorkType
  salary?: number
  url: string
  dateApplied: string
  status: ApplicationStatus
  lastActivity: string
  createdAt?: string
  updatedAt?: string
  statusTag?: string
  note?: string
}

export interface Profile {
  id?: string
  full_name: string
  email: string
}