"use client"

import { useState, useSyncExternalStore } from "react"
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

function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange)
  return () => window.removeEventListener("hashchange", onChange)
}

export default function DashboardPage() {
  const showBoard = useSyncExternalStore(
    subscribeToHash,
    () => window.location.hash === "#applications",
    () => false,
  )
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
        dashboardView={showBoard ? "applications" : "overview"}
      />
      <ApplicationBoard
        showBoard={showBoard}
        addOpen={addOpen}
        addDefaultStatus={addDefaultStatus}
        onAddOpenChange={setAddOpen}
        onColumnAddClick={openAdd}
      />
    </div>
  )
}
