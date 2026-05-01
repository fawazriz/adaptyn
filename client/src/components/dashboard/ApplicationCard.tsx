"use client"

import { useState } from "react"
import {
  IconDots,
  IconPencil,
  IconArrowRight,
  IconArchive,
  IconExternalLink,
  IconBuilding,
  IconBriefcase,
  IconCalendar,
  IconCurrencyDollar,
  IconHash,
  IconMapPin,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  applied: "Applied",
  screening: "Screening",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
}

const STATUS_CLASSES: Record<ApplicationStatus, string> = {
  applied: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  screening: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
  interview: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  offer: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  rejected: "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
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

function workTypeLabel(w: string) {
  if (w === "in-person") return "In-person"
  return w.charAt(0).toUpperCase() + w.slice(1)
}

function workTypeClasses(w: string) {
  if (w === "remote")
    return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
  if (w === "hybrid")
    return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
  return "bg-muted text-muted-foreground border-border"
}

interface Props {
  app: Application
  onMoveNext: (id: string) => void
  onEdit: (app: Application) => void
  onArchive: (id: string) => void
}

export function ApplicationCard({ app, onMoveNext, onEdit, onArchive }: Props) {
  const [detailOpen, setDetailOpen] = useState(false)
  const currentIdx = STATUS_ORDER.indexOf(app.status)
  const canMoveNext = currentIdx < STATUS_ORDER.length - 1
  const nextLabel = NEXT_STAGE_LABEL[app.status]

  return (
    <>
      {/* Card */}
      <div
        className="bg-card border border-border rounded-lg p-3 hover:border-primary/30 hover:shadow-sm transition-all group cursor-pointer select-none"
        onClick={() => setDetailOpen(true)}
      >
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
                onClick={(e) => e.stopPropagation()}
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
              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${workTypeClasses(app.workType)}`}>
                {workTypeLabel(app.workType)}
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

      {/* Detail dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <div className="flex items-start justify-between gap-3 pr-6">
              <div className="min-w-0">
                <DialogTitle className="text-base font-semibold leading-tight">
                  {app.company}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-0.5">{app.role}</p>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full border shrink-0 mt-0.5 ${STATUS_CLASSES[app.status]}`}>
                {STATUS_LABEL[app.status]}
              </span>
            </div>
          </DialogHeader>

          <div className="space-y-4 mt-1">
            {/* Metadata grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <DetailField icon={<IconCalendar size={13} />} label="Date applied" value={app.dateApplied} />
              {app.workType && (
                <DetailField icon={<IconMapPin size={13} />} label="Work type" value={workTypeLabel(app.workType)} />
              )}
              {app.salary != null && (
                <DetailField icon={<IconCurrencyDollar size={13} />} label="Salary" value={`$${app.salary}k`} />
              )}
              {app.referenceNumber && (
                <DetailField icon={<IconHash size={13} />} label="Reference #" value={app.referenceNumber} mono />
              )}
              <DetailField icon={<IconBuilding size={13} />} label="Company" value={app.company} />
              <DetailField icon={<IconBriefcase size={13} />} label="Role" value={app.role} />
            </div>

            {/* URL */}
            <div className="pt-3 border-t border-border">
              <p className="text-[11px] text-muted-foreground mb-1">Job posting</p>
              {app.url ? (
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-primary hover:underline truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconExternalLink size={12} className="shrink-0" />
                  <span className="truncate">{app.url}</span>
                </a>
              ) : (
                <p className="text-xs text-muted-foreground">No URL provided</p>
              )}
            </div>

            {/* Status tag */}
            {app.statusTag && (
              <div className="pt-3 border-t border-border">
                <p className="text-[11px] text-muted-foreground mb-1.5">Status tag</p>
                <span className={`text-xs px-2 py-0.5 rounded border ${tagClasses(app.statusTag)}`}>
                  {app.statusTag}
                </span>
              </div>
            )}

            {/* Note */}
            {app.note && (
              <div className="pt-3 border-t border-border">
                <p className="text-[11px] text-muted-foreground mb-1">Notes</p>
                <p className="text-xs text-foreground leading-relaxed">{app.note}</p>
              </div>
            )}

            {/* Last activity */}
            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">Last activity</span>
              <span className="text-[11px] text-muted-foreground">{app.lastActivity}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function DetailField({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div>
      <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
        {icon}
        <span className="text-[11px]">{label}</span>
      </div>
      <p className={`text-xs text-foreground ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  )
}
