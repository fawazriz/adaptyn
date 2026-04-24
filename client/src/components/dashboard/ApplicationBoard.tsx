"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ApplicationColumn, type ColumnConfig } from "./ApplicationColumn"
import type { Application, ApplicationStatus } from "./types"

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_ORDER: ApplicationStatus[] = [
  "applied",
  "screening",
  "interview",
  "offer",
  "rejected",
]

const COLUMNS: ColumnConfig[] = [
  {
    id: "applied",
    label: "Applied",
    dotColor: "bg-slate-400 dark:bg-slate-500",
    labelColor: "text-slate-600 dark:text-slate-400",
  },
  {
    id: "screening",
    label: "Screening",
    dotColor: "bg-blue-500",
    labelColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "interview",
    label: "Interview",
    dotColor: "bg-violet-500",
    labelColor: "text-violet-600 dark:text-violet-400",
  },
  {
    id: "offer",
    label: "Offer",
    dotColor: "bg-emerald-500",
    labelColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "rejected",
    label: "Rejected",
    dotColor: "bg-red-400",
    labelColor: "text-red-600 dark:text-red-400",
  },
]

const SEED: Application[] = [
  {
    id: "1",
    company: "Stripe",
    role: "Backend Engineer Intern",
    status: "applied",
    resumeVersion: "v2.1",
    lastActivity: "2d ago",
    statusTag: "Follow-up due",
    note: "Referral from CS3511 TA",
  },
  {
    id: "2",
    company: "Vercel",
    role: "Platform Engineering Intern",
    status: "applied",
    resumeVersion: "v2.1",
    lastActivity: "5d ago",
  },
  {
    id: "3",
    company: "Ramp",
    role: "Software Engineer Intern",
    status: "applied",
    resumeVersion: "v2.0",
    lastActivity: "1w ago",
  },
  {
    id: "4",
    company: "GitHub",
    role: "SWE Intern · Fall 2025",
    status: "applied",
    resumeVersion: "v2.1",
    lastActivity: "3d ago",
    statusTag: "Follow-up due",
  },
  {
    id: "5",
    company: "Linear",
    role: "Frontend Engineer",
    status: "screening",
    resumeVersion: "v3.0",
    lastActivity: "Yesterday",
    statusTag: "Phone call Thu 3pm",
  },
  {
    id: "6",
    company: "Notion",
    role: "Full Stack Intern",
    status: "screening",
    resumeVersion: "v3.0",
    lastActivity: "2d ago",
    note: "Applied through campus recruiting",
  },
  {
    id: "7",
    company: "Anthropic",
    role: "AI Safety Engineer",
    status: "interview",
    resumeVersion: "v3.2",
    lastActivity: "Today",
    statusTag: "Technical · Mon 2pm",
    note: "Prep: systems design + ML fundamentals",
  },
  {
    id: "8",
    company: "Scale AI",
    role: "Software Engineer",
    status: "interview",
    resumeVersion: "v3.2",
    lastActivity: "Today",
    statusTag: "HR screen done",
  },
  {
    id: "9",
    company: "Meta",
    role: "Software Engineer",
    status: "rejected",
    resumeVersion: "v1.0",
    lastActivity: "3w ago",
  },
  {
    id: "10",
    company: "Google",
    role: "SWE L3 — New Grad",
    status: "rejected",
    resumeVersion: "v2.0",
    lastActivity: "2w ago",
    note: "No feedback provided",
  },
]

// ─── Select styles (matches Input appearance) ─────────────────────────────────

const selectCls =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"

// ─── Form helpers ─────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  company: "",
  role: "",
  status: "applied" as ApplicationStatus,
  resumeVersion: "v3.2",
  note: "",
}

// ─── Component ───────────────────────────────────────────────────────────────

interface Props {
  addOpen: boolean
  addDefaultStatus: ApplicationStatus
  onAddOpenChange: (open: boolean) => void
  onColumnAddClick: (status: ApplicationStatus) => void
}

export function ApplicationBoard({
  addOpen,
  addDefaultStatus,
  onAddOpenChange,
  onColumnAddClick,
}: Props) {
  const [applications, setApplications] = useState<Application[]>(SEED)
  const [addForm, setAddForm] = useState(EMPTY_FORM)

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false)
  const [editingApp, setEditingApp] = useState<Application | null>(null)
  const [editForm, setEditForm] = useState(EMPTY_FORM)

  // Reset add form when dialog opens with (potentially new) default status
  useEffect(() => {
    if (addOpen) {
      setAddForm({ ...EMPTY_FORM, status: addDefaultStatus })
    }
  }, [addOpen, addDefaultStatus])

  function handleAdd() {
    if (!addForm.company.trim() || !addForm.role.trim()) return
    const next: Application = {
      id: Date.now().toString(),
      company: addForm.company.trim(),
      role: addForm.role.trim(),
      status: addForm.status,
      resumeVersion: addForm.resumeVersion.trim() || "v3.2",
      lastActivity: "Just now",
      note: addForm.note.trim() || undefined,
    }
    setApplications((prev) => [...prev, next])
    onAddOpenChange(false)
  }

  function handleEdit(app: Application) {
    setEditingApp(app)
    setEditForm({
      company: app.company,
      role: app.role,
      status: app.status,
      resumeVersion: app.resumeVersion,
      note: app.note ?? "",
    })
    setEditOpen(true)
  }

  function handleSaveEdit() {
    if (!editingApp || !editForm.company.trim() || !editForm.role.trim()) return
    setApplications((prev) =>
      prev.map((a) =>
        a.id === editingApp.id
          ? {
              ...a,
              company: editForm.company.trim(),
              role: editForm.role.trim(),
              status: editForm.status,
              resumeVersion: editForm.resumeVersion.trim() || a.resumeVersion,
              note: editForm.note.trim() || undefined,
              lastActivity: "Just now",
            }
          : a
      )
    )
    setEditOpen(false)
    setEditingApp(null)
  }

  function handleMoveNext(id: string) {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app
        const idx = STATUS_ORDER.indexOf(app.status)
        if (idx >= STATUS_ORDER.length - 1) return app
        return { ...app, status: STATUS_ORDER[idx + 1], lastActivity: "Just now" }
      })
    )
  }

  function handleArchive(id: string) {
    setApplications((prev) => prev.filter((a) => a.id !== id))
  }

  // Status bar counts
  const followUps = applications.filter((a) =>
    a.statusTag?.toLowerCase().includes("follow")
  ).length
  const interviews = applications.filter((a) => a.status === "interview").length

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Board */}
      <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-3 p-5 h-full min-w-max">
          {COLUMNS.map((col) => (
            <ApplicationColumn
              key={col.id}
              config={col}
              cards={applications.filter((a) => a.status === col.id)}
              onAddClick={() => onColumnAddClick(col.id)}
              onMoveNext={handleMoveNext}
              onEdit={handleEdit}
              onArchive={handleArchive}
            />
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div className="shrink-0 h-9 border-t border-border bg-muted/20 px-5 flex items-center justify-between">
        <div className="flex items-center gap-5 text-xs text-muted-foreground">
          <span>{applications.length} applications tracked</span>
          {followUps > 0 && (
            <span className="text-amber-600 dark:text-amber-400">
              {followUps} follow-up{followUps > 1 ? "s" : ""} due
            </span>
          )}
          {interviews > 0 && (
            <span className="text-violet-600 dark:text-violet-400">
              {interviews} interview{interviews > 1 ? "s" : ""} active
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground/50">Last synced: just now</span>
      </div>

      {/* ── Add Application Dialog ── */}
      <Dialog open={addOpen} onOpenChange={onAddOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add application</DialogTitle>
            <DialogDescription>Track a new role in your job search.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1">
            <div className="space-y-1.5">
              <Label htmlFor="add-company">Company</Label>
              <Input
                id="add-company"
                placeholder="Stripe"
                value={addForm.company}
                onChange={(e) => setAddForm((f) => ({ ...f, company: e.target.value }))}
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="add-role">Role</Label>
              <Input
                id="add-role"
                placeholder="Software Engineer Intern"
                value={addForm.role}
                onChange={(e) => setAddForm((f) => ({ ...f, role: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="add-status">Status</Label>
                <select
                  id="add-status"
                  className={selectCls}
                  value={addForm.status}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, status: e.target.value as ApplicationStatus }))
                  }
                >
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="add-resume">Resume version</Label>
                <Input
                  id="add-resume"
                  placeholder="v3.2"
                  value={addForm.resumeVersion}
                  onChange={(e) => setAddForm((f) => ({ ...f, resumeVersion: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="add-note">
                Note{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Input
                id="add-note"
                placeholder="Referral from…"
                value={addForm.note}
                onChange={(e) => setAddForm((f) => ({ ...f, note: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onAddOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!addForm.company.trim() || !addForm.role.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Add application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Application Dialog ── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit application</DialogTitle>
            <DialogDescription>Update the details for this role.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1">
            <div className="space-y-1.5">
              <Label htmlFor="edit-company">Company</Label>
              <Input
                id="edit-company"
                value={editForm.company}
                onChange={(e) => setEditForm((f) => ({ ...f, company: e.target.value }))}
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-role">Role</Label>
              <Input
                id="edit-role"
                value={editForm.role}
                onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-status">Status</Label>
                <select
                  id="edit-status"
                  className={selectCls}
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, status: e.target.value as ApplicationStatus }))
                  }
                >
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-resume">Resume version</Label>
                <Input
                  id="edit-resume"
                  value={editForm.resumeVersion}
                  onChange={(e) => setEditForm((f) => ({ ...f, resumeVersion: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-note">
                Note{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Input
                id="edit-note"
                placeholder="Add a note…"
                value={editForm.note}
                onChange={(e) => setEditForm((f) => ({ ...f, note: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={!editForm.company.trim() || !editForm.role.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}