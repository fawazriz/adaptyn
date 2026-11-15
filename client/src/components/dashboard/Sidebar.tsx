"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  IconLayoutKanban,
  IconLayoutDashboard,
  IconFileText,
  IconChartBar,
  IconUsersGroup,
  IconSettings,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { fetchProfile, intiialsFromProfile } from "@/lib/profile"
import { Profile } from "./types"
import styles from "./dashboard.module.css"


const DASHBOARD_ITEMS = [
  { icon: IconLayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: IconLayoutKanban, label: "Applications", href: "/dashboard/applications" },
  { icon: IconFileText, label: "Resumes", href: "/dashboard/resumes" },
] as const

const NAV_ITEMS = [
  ...DASHBOARD_ITEMS,
  { icon: IconChartBar, label: "Analytics", href: "/dashboard/analytics" },
  { icon: IconUsersGroup, label: "Recruiters", href: "/dashboard/recruiters" },
] as const

const BOTTOM_ITEMS = [
  { icon: IconSettings, label: "Settings", href: "/dashboard/settings" },
] as const

interface Props {
  collapsed: boolean
  onToggle: () => void
  dashboardStyle?: boolean
}

export function Sidebar({ collapsed, onToggle, dashboardStyle }: Props) {
  const pathname = usePathname()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    fetchProfile().then(setProfile).catch(console.error)
  }, [])

  return (
    <aside
      className={cn(
        "flex flex-col h-screen border-r border-border bg-card shrink-0 transition-all duration-200 overflow-hidden",
        collapsed ? "w-14" : "w-56",
        dashboardStyle && styles.sidebar
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center h-14 border-b border-border shrink-0 px-4 gap-2.5",
          collapsed && "justify-center px-0",
          dashboardStyle && styles.sidebarBrand
        )}
      >
        {dashboardStyle ? (
          <Image src="/adaptyn-logo.svg" width={28} height={28} alt="" />
        ) : (
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground text-[11px] font-bold">A</span>
          </div>
        )}
        {(!collapsed || dashboardStyle) && (
          <span className={cn("font-semibold text-sm text-foreground tracking-tight", collapsed && (dashboardStyle ? styles.collapsedLabel : "sr-only"))}>Adaptyn</span>
        )}
      </div>

      {/* Primary nav */}
      <nav aria-label="Workspace" className={cn("flex-1 min-h-0 overflow-y-auto px-2 py-3 space-y-0.5", dashboardStyle && styles.sidebarNav)}>
        {(dashboardStyle ? DASHBOARD_ITEMS : NAV_ITEMS).map(({ icon: Icon, label, href }) => {
          const active = pathname === href || (href === "/dashboard/resumes" && pathname.startsWith(`${href}/`))
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors",
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
                collapsed && "justify-center px-0 w-full"
              )}
              title={collapsed ? label : undefined}
              aria-label={collapsed ? label : undefined}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={15} className="shrink-0" aria-hidden="true" />
              <span className={cn(collapsed && (dashboardStyle ? styles.collapsedLabel : "sr-only"))}>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className={cn("shrink-0 px-2 pb-3 space-y-0.5", dashboardStyle && styles.sidebarAccount)}>
        <Separator className="mb-2" />

        {!dashboardStyle && BOTTOM_ITEMS.map(({ icon: Icon, label, href }) => {
          const active = pathname === href
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors",
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
                collapsed && "justify-center px-0 w-full"
              )}
              title={collapsed ? label : undefined}
            >
              <Icon size={15} className="shrink-0" />
              {!collapsed && label}
            </Link>
          )
        })}

        {/* User row */}
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-2.5 py-2 mt-1">
            <div className={cn("w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0", dashboardStyle && styles.sidebarInitials)}>
              <span className="text-[9px] font-semibold text-primary">{intiialsFromProfile(profile)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground truncate">{profile?.full_name || "Profile"}</p>
              <p className="text-[10px] text-muted-foreground truncate">{profile?.email || (dashboardStyle ? "" : "email@example.com")}</p>
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className={cn(
            "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full",
            collapsed && "justify-center px-0"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <IconChevronRight size={14} />
          ) : (
            <>
              <IconChevronLeft size={14} />
              Collapse
            </>
          )}
        </button>
      </div>
    </aside>
  )
}