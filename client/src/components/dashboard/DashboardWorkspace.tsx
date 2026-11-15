"use client"

import { useState } from "react"
import { Instrument_Serif } from "next/font/google"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { ApplicationBoard } from "@/components/dashboard/ApplicationBoard"
import type { ApplicationStatus } from "@/components/dashboard/types"
import styles from "@/components/dashboard/dashboard.module.css"

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dashboard-serif",
})

export function DashboardWorkspace({ showApplications = false }: { showApplications?: boolean }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [addDefaultStatus, setAddDefaultStatus] = useState<ApplicationStatus>("applied")

  function openAdd(status: ApplicationStatus = "applied") {
    setAddDefaultStatus(status)
    setAddOpen(true)
  }

  return (
    <div className={`${styles.dashboard} ${instrumentSerif.variable}`}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
        dashboardStyle
      />
      <ApplicationBoard
        showApplications={showApplications}
        addOpen={addOpen}
        addDefaultStatus={addDefaultStatus}
        onAddOpenChange={setAddOpen}
        onColumnAddClick={openAdd}
      />
    </div>
  )
}
