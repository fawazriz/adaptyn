"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconLayoutKanban,
  IconFileText,
  IconChartBar,
  IconUsersGroup,
  IconSettings,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

const NAV_ITEMS = [
  { icon: IconLayoutKanban, label: "Tracker", href: "/dashboard" },
  { icon: IconFileText, label: "Resumes", href: "/dashboard/resumes" },
  { icon: IconChartBar, label: "Analytics", href: "/dashboard/analytics" },
  { icon: IconUsersGroup, label: "Recruiters", href: "/dashboard/recruiters" },
] as const

const BOTTOM_ITEMS = [
  { icon: IconSettings, label: "Settings", href: "/dashboard/settings" },
] as const

interface Props {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: Props) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "flex flex-col h-screen border-r border-border bg-card shrink-0 transition-all duration-200 overflow-hidden",
        collapsed ? "w-14" : "w-56"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center h-14 border-b border-border shrink-0 px-4 gap-2.5",
          collapsed && "justify-center px-0"
        )}
      >
        <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center shrink-0">
          <span className="text-primary-foreground text-[11px] font-bold">A</span>
        </div>
        {!collapsed && (
          <span className="font-semibold text-sm text-foreground tracking-tight">Adaptyn</span>
        )}
      </div>

      {/* Primary nav */}
      <nav className="flex-1 min-h-0 overflow-y-auto px-2 py-3 space-y-0.5">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
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
      </nav>

      {/* Bottom section */}
      <div className="shrink-0 px-2 pb-3 space-y-0.5">
        <Separator className="mb-2" />

        {BOTTOM_ITEMS.map(({ icon: Icon, label, href }) => {
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
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-[9px] font-semibold text-primary">AJ</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground truncate">Alex Johnson</p>
              <p className="text-[10px] text-muted-foreground truncate">alex@gatech.edu</p>
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