"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar"
import { ApplicationBoard } from "@/components/dashboard/ApplicationBoard"
import type { ApplicationStatus } from "@/components/dashboard/types"

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [addDefaultStatus, setAddDefaultStatus] = useState<ApplicationStatus>("applied")

  function openAdd(status: ApplicationStatus = "applied") {
    setAddDefaultStatus(status)
    setAddOpen(true)
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardTopbar onAddClick={() => openAdd()} />
        <ApplicationBoard
          addOpen={addOpen}
          addDefaultStatus={addDefaultStatus}
          onAddOpenChange={setAddOpen}
          onColumnAddClick={openAdd}
        />
      </div>
    </div>
  )
}
