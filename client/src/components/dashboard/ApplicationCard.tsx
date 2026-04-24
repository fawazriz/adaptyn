"use client"

import {
  IconDots,
  IconPencil,
  IconArrowRight,
  IconArchive,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Application, ApplicationStatus } from "./types"

const STATUS_ORDER: ApplicationStatus[] = [
  "applied",
  "screening",
  "interview",
  "offer",
  "rejected",
]

const NEXT_STAGE_LABEL: Partial<Record<ApplicationStatus, string>> = {
  applied: "Move to Screening",
  screening: "Move to Interview",
  interview: "Move to Offer",
  offer: "Move to Rejected",
}

function tagClasses(tag: string): string {
  const t = tag.toLowerCase()
  if (t.includes("follow"))
    return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
  if (t.includes("technical") || t.includes("onsite"))
    return "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20"
  if (t.includes("phone") || t.includes("screen") || t.includes("scheduled"))
    return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
  if (t.includes("offer") || t.includes("received"))
    return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
  if (t.includes("hr") || t.includes("done"))
    return "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
  return "bg-muted text-muted-foreground border-border"
}

interface Props {
  app: Application
  onMoveNext: (id: string) => void
  onEdit: (app: Application) => void
  onArchive: (id: string) => void
}

export function ApplicationCard({ app, onMoveNext, onEdit, onArchive }: Props) {
  const currentIdx = STATUS_ORDER.indexOf(app.status)
  const canMoveNext = currentIdx < STATUS_ORDER.length - 1
  const nextLabel = NEXT_STAGE_LABEL[app.status]

  return (
    <div className="bg-card border border-border rounded-lg p-3 hover:border-primary/30 hover:shadow-sm transition-all group cursor-default select-none">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate leading-tight">
            {app.company}
          </p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{app.role}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity -mr-1 -mt-0.5"
              aria-label="Card actions"
            >
              <IconDots size={13} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              className="gap-2 text-xs cursor-pointer"
              onClick={() => onEdit(app)}
            >
              <IconPencil size={12} />
              Edit
            </DropdownMenuItem>
            {canMoveNext && nextLabel && (
              <DropdownMenuItem
                className="gap-2 text-xs cursor-pointer"
                onClick={() => onMoveNext(app.id)}
              >
                <IconArrowRight size={12} />
                {nextLabel}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-xs text-destructive focus:text-destructive cursor-pointer"
              onClick={() => onArchive(app.id)}
            >
              <IconArchive size={12} />
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tags row */}
      {(app.workType || app.salary != null || app.statusTag || app.referenceNumber) && (
        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
          {app.referenceNumber && (
            <span className="text-[10px] font-mono bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border/60">
              {app.referenceNumber}
            </span>
          )}
          {app.workType && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
              app.workType === "remote"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                : app.workType === "hybrid"
                ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
                : "bg-muted text-muted-foreground border-border"
            }`}>
              {app.workType === "in-person" ? "In-person" : app.workType.charAt(0).toUpperCase() + app.workType.slice(1)}
            </span>
          )}
          {app.salary != null && (
            <span className="text-[10px] px-1.5 py-0.5 rounded border bg-muted text-muted-foreground border-border">
              ${app.salary}k
            </span>
          )}
          {app.statusTag && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${tagClasses(app.statusTag)}`}>
              {app.statusTag}
            </span>
          )}
        </div>
      )}

      {/* Note */}
      {app.note && (
        <p className="text-[11px] text-muted-foreground/70 mt-2 leading-relaxed line-clamp-2">
          {app.note}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
        <span className="text-[10px] text-muted-foreground/60">{app.dateApplied}</span>
        <span className="text-[10px] text-muted-foreground/60">{app.lastActivity}</span>
      </div>
    </div>
  )
}