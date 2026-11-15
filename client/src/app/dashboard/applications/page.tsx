import type { Metadata } from "next"
import { DashboardWorkspace } from "@/components/dashboard/DashboardWorkspace"

export const metadata: Metadata = { title: "Applications | Adaptyn" }

export default function ApplicationsPage() {
  return <DashboardWorkspace showApplications />
}
