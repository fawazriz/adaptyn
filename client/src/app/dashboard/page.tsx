// ─── Client-side component for the main dashboard page ───────────────────────
"use client"

// ─── Imports ──────────────────────────────────────────────────────────────────
import { useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar"
import { ApplicationBoard } from "@/components/dashboard/ApplicationBoard"
import type { ApplicationStatus } from "@/components/dashboard/types"

/**
 * DashboardPage
 *
 * Main dashboard layout component. Manages the application add dialog state
 * and coordinates between the sidebar, topbar, and main application board.
 *
 * Layout:
 * - Sidebar (left): Navigation and quick actions
 * - Topbar (top-right): Search, settings, add button
 * - ApplicationBoard (center): Kanban board with job applications by status
 */
export default function DashboardPage() {
  // ─── State for sidebar collapse/expand toggle ──────────────────────────────
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // ─── State for "Add Application" dialog open/close ────────────────────────── 
  const [addOpen, setAddOpen] = useState(false)

  // ─── State for which column status the new application should start in ──────
  // Defaults to "applied", but can be set to any status when adding from a column
  const [addDefaultStatus, setAddDefaultStatus] = useState<ApplicationStatus>("applied")

  /**
   * openAdd
   *
   * Opens the "Add Application" dialog, optionally with a pre-selected status.
   * Called from:
   * - Topbar "Add" button (uses default "applied" status)
   * - Column "Add" button (passes specific column status)
   *
   * @param status - Status column to pre-select in the dialog (default: "applied")
   */
  function openAdd(status: ApplicationStatus = "applied") {
    setAddDefaultStatus(status)
    setAddOpen(true)
  }

  return (
    // ─── Main dashboard container: full screen, flexbox layout ─────────────────
    <div className="flex h-screen bg-background overflow-hidden">
      
      {/* ─── Sidebar: navigation, menu, toggleable collapse ─────────────────── */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      {/* ─── Right side: topbar + application board ──────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        
        {/* ─── Topbar: add button, search, settings ──────────────────────────── */}
        <DashboardTopbar onAddClick={() => openAdd()} />
        
        {/* ─── Application board: Kanban columns with job application cards ──── */}
        <ApplicationBoard
          addOpen={addOpen}                              // Dialog open state
          addDefaultStatus={addDefaultStatus}            // Pre-selected column status
          onAddOpenChange={setAddOpen}                   // Close/open dialog callback
          onColumnAddClick={openAdd}                     // Column "Add" button callback
        />
      </div>
    </div>
  )
}
