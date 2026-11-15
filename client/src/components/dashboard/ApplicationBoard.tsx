"use client"

import { useEffect, useRef, useState } from "react"
import { IconLayoutKanban, IconListDetails, IconPlus } from "@tabler/icons-react"
import { ApplicationList } from "./ApplicationList"
import { DashboardOverview } from "./DashboardOverview"
import styles from "./dashboard.module.css"
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

const COLUMNS: ColumnConfig[] = [
  { id: "saved", label: "Saved" },
  { id: "applied", label: "Applied" },
  { id: "phone_screen", label: "Phone screen" },
  { id: "interview", label: "Interview" },
  { id: "offer", label: "Offer" },
  { id: "rejected", label: "Rejected" },
]

interface ApiApplication {
  id: string
  company: string
  role: string
  status: ApplicationStatus
  job_url: string | null
  location?: string | null
  applied_date: string | null
  salary_min: number | null
  notes: string | null
  created_at: string | null
  updated_at?: string | null
}

const applicationsUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/applications`

function toApplication(app: ApiApplication): Application {
  return {
    id: app.id,
    company: app.company,
    role: app.role,
    status: app.status,
    dateApplied: app.applied_date ?? "",
    url: app.job_url ?? "",
    location: app.location ?? undefined,
    salary: app.salary_min ?? undefined,
    note: app.notes ?? undefined,
    createdAt: app.created_at ?? undefined,
    updatedAt: app.updated_at ?? undefined,
    lastActivity: app.updated_at ?? app.created_at ?? "",
  }
}

async function fetchApplications(signal: AbortSignal): Promise<Application[]> {
  const res = await fetch(applicationsUrl, { credentials: "include", signal })
  if (!res.ok) throw new Error("Failed to fetch applications")
  const data: ApiApplication[] = await res.json()
  return data.map(toApplication)
}

// ─── Form helpers ─────────────────────────────────────────────────────────────

// Utility CSS class for select inputs to maintain consistent styling across the form
const selectCls =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"

// Utility to get today's date in YYYY-MM-DD format for default date values in forms
function today() {
  return new Date().toISOString().split("T")[0]
}

// Form data structure for both adding and editing applications. This allows us to reuse the same form component for both actions.
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

/**
 * ApplicationForm
 *
 * Reusable form component for adding or editing job applications.
 * Renders form fields for company, role, work type, salary, URL, date applied, and status.
 * Used in both the "Add Application" and "Edit Application" dialogs.
 *
 * @param form - Current form state object
 * @param onChange - Callback fired when any field changes (receives partial update)
 */
function ApplicationForm({
  form,
  onChange,
  dateRequired = true,
}: {
  form: FormState
  dateRequired?: boolean
  onChange: (patch: Partial<FormState>) => void
}) {
  return (
    <div className="space-y-4 py-1">
      {/* Company + Reference # */}
      <div className="grid grid-cols-2 sm:grid-cols-[minmax(0,1fr)_9rem] gap-3 items-end">
        <div className="space-y-1.5">
          <Label htmlFor="f-company">
            Company <span className="text-destructive">*</span>
          </Label>
          <Input
            id="f-company"
            placeholder="Stripe"
            value={form.company}
            onChange={(e) => onChange({ company: e.target.value })}
          />
        </div>
        <div className="space-y-1.5 min-w-0">
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
        <Label htmlFor="f-url">URL</Label>
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
            Date applied {dateRequired && <span className="text-destructive">*</span>}
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
            {COLUMNS.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}


function isFormValid(form: FormState, dateRequired = true) {
  return Boolean(form.company.trim() && form.role.trim() && (!dateRequired || form.dateApplied))
}

// ─── Component ───────────────────────────────────────────────────────────────

// Props for the ApplicationBoard component, which manages the state and interactions for the main application board. This includes the open state of the add dialog, the default status for new applications, and callbacks for opening the add dialog from columns.
interface Props {
  showApplications: boolean
  addOpen: boolean
  addDefaultStatus: ApplicationStatus
  onAddOpenChange: (open: boolean) => void
  onColumnAddClick: (status: ApplicationStatus) => void
}

export function ApplicationBoard({
  showApplications,
  addOpen,
  addDefaultStatus,
  onAddOpenChange,
  onColumnAddClick,
}: Props) {
  const [view, setView] = useState<"board" | "list">("board")
  const [applications, setApplications] = useState<Application[]>([])
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading")
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [hiddenIds, setHiddenIds] = useState<string[]>([])
  const [addForm, setAddForm] = useState<FormState>(EMPTY_FORM)
  const [editingApp, setEditingApp] = useState<Application | null>(null)
  const [editForm, setEditForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [dialogError, setDialogError] = useState("")
  const [boardError, setBoardError] = useState("")
  const savingRef = useRef(false)
  const dialogTrigger = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetchApplications(controller.signal).then((records) => {
      if (controller.signal.aborted) return
      setApplications(records)
      setLoadState("ready")
    }).catch(() => {
      if (!controller.signal.aborted) setLoadState("error")
    })
    return () => controller.abort()
  }, [loadAttempt])

  useEffect(() => {
    if (addOpen) {
      setDialogError("")
      setAddForm({ ...EMPTY_FORM, status: addDefaultStatus, dateApplied: today() })
    }
  }, [addOpen, addDefaultStatus])

  function retry() {
    setLoadState("loading")
    setLoadAttempt((attempt) => attempt + 1)
  }

  async function saveApplication(
    payload: Record<string, unknown>,
    id?: string,
  ) {
    if (loadState !== "ready" || savingRef.current) return false
    savingRef.current = true
    setSaving(true)
    try {
      const res = await fetch(id ? `${applicationsUrl}/${encodeURIComponent(id)}` : applicationsUrl, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (!res.ok) return false
      const app = toApplication(await res.json())
      setApplications((records) => id
        ? records.map((record) => record.id === id ? app : record)
        : [...records, app])
      return true
    } catch {
      return false
    } finally {
      savingRef.current = false
      setSaving(false)
    }
  }

  async function saveForm(form: FormState, id?: string) {
    if (!isFormValid(form, !id) || savingRef.current) return
    setDialogError("")
    const saved = await saveApplication({
      company: form.company.trim(),
      role: form.role.trim(),
      job_url: form.url.trim() || null,
      status: form.status,
      applied_date: form.dateApplied || null,
      salary_min: form.salary ? Number(form.salary) : null,
    }, id)
    if (!saved) {
      setDialogError(id ? "Couldn’t save your changes. Try again." : "Couldn’t add this application. Try again.")
    } else if (id) {
      setEditingApp(null)
    } else {
      onAddOpenChange(false)
    }
  }

  function handleEdit(app: Application) {
    if (savingRef.current) return
    setDialogError("")
    setEditForm({
      company: app.company,
      referenceNumber: app.referenceNumber ?? "",
      role: app.role,
      workType: app.workType ?? "",
      salary: app.salary?.toString() ?? "",
      url: app.url ?? "",
      dateApplied: app.dateApplied,
      status: app.status,
    })
    setEditingApp(app)
  }

  async function handleMoveNext(id: string) {
    const app = applications.find((record) => record.id === id)
    if (!app || savingRef.current) return
    const index = COLUMNS.findIndex(({ id }) => id === app.status)
    const status = COLUMNS[index + 1]?.id
    if (index < 0 || !status) return

    setBoardError("")
    if (!await saveApplication({ status }, id)) {
      setBoardError("Couldn’t move this application. Try again.")
    }
  }

  function rememberTrigger() {
    dialogTrigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
  }

  function restoreFocus(event: Event) {
    if (!dialogTrigger.current?.isConnected) return
    event.preventDefault()
    dialogTrigger.current.focus()
  }

  const visibleApplications = applications.filter(({ id }) => !hiddenIds.includes(id))

  return (
    <>
      {showApplications ? (
        <main id="applications" className={styles.surface}>
          <div className={styles.content}>
            <header className={styles.heading}>
              <div className={styles.applicationsTitle}>
                <h1>{view === "board" ? "Kanban board" : "Applications list"}</h1>
                {loadState === "ready" && (
                  <p>{visibleApplications.length} {visibleApplications.length === 1 ? "application" : "applications"}</p>
                )}
              </div>
              <button type="button" className={styles.primary} onClick={() => onColumnAddClick("applied")} disabled={loadState !== "ready" || saving}>
                <IconPlus size={17} aria-hidden="true" /> Add application
              </button>
            </header>
            <div className={styles.viewSwitch} role="group" aria-label="Applications view">
              <button type="button" aria-pressed={view === "board"} onClick={() => setView("board")}>
                <IconLayoutKanban size={16} aria-hidden="true" /> Kanban
              </button>
              <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")}>
                <IconListDetails size={16} aria-hidden="true" /> List
              </button>
            </div>
            {boardError && <p role="alert" className={styles.notice}>{boardError}</p>}
            {loadState === "error" && (
              <div className={styles.notice}>
                <p role="alert">Couldn’t load your applications.</p>
                <button type="button" className={styles.textLink} onClick={retry}>Retry</button>
              </div>
            )}
            {loadState === "loading" && <p role="status">Loading applications…</p>}
            {loadState === "ready" && view === "board" && (
              <div className={styles.boardScroll} role="region" aria-label="Application board" tabIndex={0}>
                {COLUMNS.map((column) => (
                  <ApplicationColumn
                    key={column.id}
                    config={column}
                    cards={visibleApplications.filter(({ status }) => status === column.id)}
                    onAddClick={() => {
                      if (!savingRef.current) onColumnAddClick(column.id)
                    }}
                    onMoveNext={handleMoveNext}
                    onEdit={handleEdit}
                    onArchive={(id) => setHiddenIds((ids) => [...ids, id])}
                  />
                ))}
              </div>
            )}
            {loadState === "ready" && view === "list" && (
              <ApplicationList applications={visibleApplications} stages={COLUMNS} onReview={handleEdit} />
            )}
          </div>
        </main>
      ) : (
        <DashboardOverview
          applications={applications}
          state={loadState}
          onAdd={() => {
            if (!savingRef.current) onColumnAddClick("applied")
          }}
          onReview={handleEdit}
          onRetry={retry}
        />
      )}

      {/* ── Add Dialog ── */}
      <Dialog open={addOpen} onOpenChange={(open) => {
        if (!savingRef.current) onAddOpenChange(open)
      }}>
        <DialogContent className={styles.dialog} onOpenAutoFocus={rememberTrigger} onCloseAutoFocus={restoreFocus}>
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
          {dialogError && <p role="alert" className={styles.dialogError}>{dialogError}</p>}
          <DialogFooter>
            <Button variant="outline" disabled={saving} onClick={() => onAddOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => saveForm(addForm)}
              disabled={saving || !isFormValid(addForm)}
              className={styles.primary}
            >
              {saving ? "Adding…" : "Add application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Dialog ── */}
      <Dialog open={Boolean(editingApp)} onOpenChange={(open) => {
        if (!open && !savingRef.current) setEditingApp(null)
      }}>
        <DialogContent className={styles.dialog} onOpenAutoFocus={rememberTrigger} onCloseAutoFocus={restoreFocus}>
          <DialogHeader>
            <DialogTitle>Edit application</DialogTitle>
            <DialogDescription>
              Update the details for this role.{" "}
              <span className="text-destructive">*</span> Required.
            </DialogDescription>
          </DialogHeader>
          <ApplicationForm
            form={editForm}
            dateRequired={false}
            onChange={(patch) => setEditForm((f) => ({ ...f, ...patch }))}
          />
          {editingApp?.note && (
            <div className={styles.applicationNote}>
              <strong>Application notes</strong>
              <p>{editingApp.note}</p>
            </div>
          )}
          {dialogError && <p role="alert" className={styles.dialogError}>{dialogError}</p>}
          <DialogFooter>
            <Button variant="outline" disabled={saving} onClick={() => setEditingApp(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingApp) void saveForm(editForm, editingApp.id)
              }}
              disabled={saving || !isFormValid(editForm, false)}
              className={styles.primary}
            >
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
