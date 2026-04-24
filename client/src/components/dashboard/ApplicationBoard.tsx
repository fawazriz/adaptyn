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
import type { Application, ApplicationStatus, WorkType } from "./types"

// ─── Column config ────────────────────────────────────────────────────────────

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

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED: Application[] = [
  {
    id: "1",
    company: "Stripe",
    role: "Backend Engineer Intern",
    status: "applied",
    url: "https://stripe.com/jobs",
    dateApplied: "2024-09-13",
    lastActivity: "2d ago",
    statusTag: "Follow-up due",
    note: "Referral from CS3511 TA",
    workType: "hybrid",
    salary: 65,
  },
  {
    id: "2",
    company: "Vercel",
    role: "Platform Engineering Intern",
    status: "applied",
    url: "https://vercel.com/careers",
    dateApplied: "2024-09-10",
    lastActivity: "5d ago",
    workType: "remote",
    salary: 60,
  },
  {
    id: "3",
    company: "Ramp",
    role: "Software Engineer Intern",
    status: "applied",
    url: "https://ramp.com/careers",
    dateApplied: "2024-09-08",
    lastActivity: "1w ago",
    workType: "in-person",
    referenceNumber: "REQ-4821",
  },
  {
    id: "4",
    company: "GitHub",
    role: "SWE Intern · Fall 2025",
    status: "applied",
    url: "https://github.com/about/careers",
    dateApplied: "2024-09-12",
    lastActivity: "3d ago",
    statusTag: "Follow-up due",
    workType: "remote",
    salary: 70,
  },
  {
    id: "5",
    company: "Linear",
    role: "Frontend Engineer",
    status: "screening",
    url: "https://linear.app/careers",
    dateApplied: "2024-09-05",
    lastActivity: "Yesterday",
    statusTag: "Phone call Thu 3pm",
    workType: "remote",
    salary: 95,
  },
  {
    id: "6",
    company: "Notion",
    role: "Full Stack Intern",
    status: "screening",
    url: "https://notion.com/careers",
    dateApplied: "2024-09-03",
    lastActivity: "2d ago",
    note: "Applied through campus recruiting",
    workType: "hybrid",
  },
  {
    id: "7",
    company: "Anthropic",
    role: "AI Safety Engineer",
    status: "interview",
    url: "https://anthropic.com/careers",
    dateApplied: "2024-08-28",
    lastActivity: "Today",
    statusTag: "Technical · Mon 2pm",
    note: "Prep: systems design + ML fundamentals",
    workType: "hybrid",
    salary: 120,
    referenceNumber: "ANT-2024-SWE",
  },
  {
    id: "8",
    company: "Scale AI",
    role: "Software Engineer",
    status: "interview",
    url: "https://scale.com/careers",
    dateApplied: "2024-08-30",
    lastActivity: "Today",
    statusTag: "HR screen done",
    workType: "in-person",
    salary: 110,
  },
  {
    id: "9",
    company: "Meta",
    role: "Software Engineer",
    status: "rejected",
    url: "https://metacareers.com",
    dateApplied: "2024-08-10",
    lastActivity: "3w ago",
    workType: "hybrid",
  },
  {
    id: "10",
    company: "Google",
    role: "SWE L3 — New Grad",
    status: "rejected",
    url: "https://careers.google.com",
    dateApplied: "2024-08-05",
    lastActivity: "2w ago",
    note: "No feedback provided",
    workType: "hybrid",
    salary: 130,
  },
]

// ─── Form helpers ─────────────────────────────────────────────────────────────

const selectCls =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"

function today() {
  return new Date().toISOString().split("T")[0]
}

const EMPTY_FORM = {
  company: "",
  referenceNumber: "",
  role: "",
  workType: "" as WorkType | "",
  salary: "",
  url: "",
  dateApplied: today(),
  status: "applied" as ApplicationStatus,
}

type FormState = typeof EMPTY_FORM

// ─── Reusable form fields ─────────────────────────────────────────────────────

function ApplicationForm({
  form,
  onChange,
}: {
  form: FormState
  onChange: (patch: Partial<FormState>) => void
}) {
  return (
    <div className="space-y-4 py-1">
      {/* Company + Reference # */}
      <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
        <div className="space-y-1.5">
          <Label htmlFor="f-company">
            Company <span className="text-destructive">*</span>
          </Label>
          <Input
            id="f-company"
            placeholder="Stripe"
            value={form.company}
            onChange={(e) => onChange({ company: e.target.value })}
            autoFocus
          />
        </div>
        <div className="space-y-1.5 w-36">
          <Label htmlFor="f-ref" className="text-muted-foreground">
            Reference #
          </Label>
          <Input
            id="f-ref"
            placeholder="REQ-1234"
            value={form.referenceNumber}
            onChange={(e) => onChange({ referenceNumber: e.target.value })}
          />
        </div>
      </div>

      {/* Job title */}
      <div className="space-y-1.5">
        <Label htmlFor="f-role">
          Job title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="f-role"
          placeholder="Software Engineer Intern"
          value={form.role}
          onChange={(e) => onChange({ role: e.target.value })}
        />
      </div>

      {/* Work type + Salary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="f-worktype" className="text-muted-foreground">
            Work type
          </Label>
          <select
            id="f-worktype"
            className={selectCls}
            value={form.workType}
            onChange={(e) => onChange({ workType: e.target.value as WorkType | "" })}
          >
            <option value="">Not specified</option>
            <option value="in-person">In-person</option>
            <option value="hybrid">Hybrid</option>
            <option value="remote">Remote</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-salary" className="text-muted-foreground">
            Salary (k)
          </Label>
          <div className="relative">
            <Input
              id="f-salary"
              type="number"
              placeholder="95"
              min={0}
              value={form.salary}
              onChange={(e) => onChange({ salary: e.target.value })}
              className="pr-6"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
              k
            </span>
          </div>
        </div>
      </div>

      {/* URL */}
      <div className="space-y-1.5">
        <Label htmlFor="f-url">
          URL <span className="text-destructive">*</span>
        </Label>
        <Input
          id="f-url"
          type="url"
          placeholder="https://company.com/jobs/..."
          value={form.url}
          onChange={(e) => onChange({ url: e.target.value })}
        />
      </div>

      {/* Date applied + Status */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="f-date">
            Date applied <span className="text-destructive">*</span>
          </Label>
          <Input
            id="f-date"
            type="date"
            value={form.dateApplied}
            onChange={(e) => onChange({ dateApplied: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-status">
            Status <span className="text-destructive">*</span>
          </Label>
          <select
            id="f-status"
            className={selectCls}
            value={form.status}
            onChange={(e) => onChange({ status: e.target.value as ApplicationStatus })}
          >
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

function isFormValid(form: FormState) {
  return (
    form.company.trim() !== "" &&
    form.role.trim() !== "" &&
    form.url.trim() !== "" &&
    form.dateApplied !== ""
  )
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
  const [addForm, setAddForm] = useState<FormState>(EMPTY_FORM)

  const [editOpen, setEditOpen] = useState(false)
  const [editingApp, setEditingApp] = useState<Application | null>(null)
  const [editForm, setEditForm] = useState<FormState>(EMPTY_FORM)

  useEffect(() => {
    if (addOpen) {
      setAddForm({ ...EMPTY_FORM, status: addDefaultStatus, dateApplied: today() })
    }
  }, [addOpen, addDefaultStatus])

  function handleAdd() {
    if (!isFormValid(addForm)) return
    const next: Application = {
      id: Date.now().toString(),
      company: addForm.company.trim(),
      referenceNumber: addForm.referenceNumber.trim() || undefined,
      role: addForm.role.trim(),
      workType: (addForm.workType as WorkType) || undefined,
      salary: addForm.salary ? Number(addForm.salary) : undefined,
      url: addForm.url.trim(),
      dateApplied: addForm.dateApplied,
      status: addForm.status,
      lastActivity: "Just now",
    }
    setApplications((prev) => [...prev, next])
    onAddOpenChange(false)
  }

  function handleEdit(app: Application) {
    setEditingApp(app)
    setEditForm({
      company: app.company,
      referenceNumber: app.referenceNumber ?? "",
      role: app.role,
      workType: app.workType ?? "",
      salary: app.salary?.toString() ?? "",
      url: app.url,
      dateApplied: app.dateApplied,
      status: app.status,
    })
    setEditOpen(true)
  }

  function handleSaveEdit() {
    if (!editingApp || !isFormValid(editForm)) return
    setApplications((prev) =>
      prev.map((a) =>
        a.id === editingApp.id
          ? {
              ...a,
              company: editForm.company.trim(),
              referenceNumber: editForm.referenceNumber.trim() || undefined,
              role: editForm.role.trim(),
              workType: (editForm.workType as WorkType) || undefined,
              salary: editForm.salary ? Number(editForm.salary) : undefined,
              url: editForm.url.trim(),
              dateApplied: editForm.dateApplied,
              status: editForm.status,
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

      {/* ── Add Dialog ── */}
      <Dialog open={addOpen} onOpenChange={onAddOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add application</DialogTitle>
            <DialogDescription>
              Track a new role.{" "}
              <span className="text-destructive">*</span> Required.
            </DialogDescription>
          </DialogHeader>
          <ApplicationForm
            form={addForm}
            onChange={(patch) => setAddForm((f) => ({ ...f, ...patch }))}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => onAddOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!isFormValid(addForm)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Add application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Dialog ── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit application</DialogTitle>
            <DialogDescription>
              Update the details for this role.{" "}
              <span className="text-destructive">*</span> Required.
            </DialogDescription>
          </DialogHeader>
          <ApplicationForm
            form={editForm}
            onChange={(patch) => setEditForm((f) => ({ ...f, ...patch }))}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={!isFormValid(editForm)}
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
