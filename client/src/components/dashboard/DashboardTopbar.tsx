"use client"

import {
  IconSearch,
  IconPlus,
  IconBell,
  IconChevronDown,
  IconUser,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/shared/ThemeToggle"

interface Props {
  onAddClick: () => void
}

export function DashboardTopbar({ onAddClick }: Props) {
  return (
    <div className="h-14 border-b border-border flex items-center gap-3 px-5 shrink-0 bg-card">
      {/* Page title */}
      <h1 className="text-sm font-semibold text-foreground shrink-0 mr-2">
        Application Tracker
      </h1>

      {/* Search */}
      <div className="relative max-w-xs w-full">
        <IconSearch
          size={13}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <Input
          placeholder="Search companies, roles…"
          className="pl-8 h-8 text-xs"
          aria-label="Search applications"
        />
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 relative"
          aria-label="Notifications"
        >
          <IconBell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
        </Button>

        {/* Add application */}
        <Button
          size="sm"
          onClick={onAddClick}
          className="gap-1.5 h-8 ml-1 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <IconPlus size={13} />
          Add application
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 rounded-md hover:bg-muted px-1.5 py-1 transition-colors ml-1">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-[9px] font-semibold text-primary select-none">AJ</span>
              </div>
              <IconChevronDown size={11} className="text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <div className="px-2 py-1.5">
              <p className="text-xs font-medium text-foreground">Alex Johnson</p>
              <p className="text-[11px] text-muted-foreground">alex@gatech.edu</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
              <IconUser size={12} />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
              <IconSettings size={12} />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-xs text-destructive focus:text-destructive cursor-pointer">
              <IconLogout size={12} />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}