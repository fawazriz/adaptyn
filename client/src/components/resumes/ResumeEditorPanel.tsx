"use client"

import { useEffect, useMemo, useState } from "react"
import { IconDeviceFloppy } from "@tabler/icons-react"
import type { ResumeVersion } from "@/components/resumes/types"
import { updateMockResume } from "@/components/resumes/resume-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

function todayLabel() {
  return new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID()
  return `h_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

export function ResumeEditorPanel({
  resume,
  onPreviewChange,
}: {
  resume: ResumeVersion
  onPreviewChange?: (preview: { name: string; version: string; template?: string }) => void
}) {
  const initial = useMemo(() => resume, [resume])

  const [name, setName] = useState(initial.name)
  const [targetRole, setTargetRole] = useState(initial.targetRole)
  const [template, setTemplate] = useState(initial.template ?? "")
  const [notes, setNotes] = useState(initial.notes)

  const isDirty =
    name !== initial.name ||
    targetRole !== initial.targetRole ||
    template !== (initial.template ?? "") ||
    notes !== initial.notes

  const canSave = name.trim() !== "" && targetRole.trim() !== "" && isDirty

  function handleSave() {
    const now = todayLabel()
    const historyItem = {
      id: makeId(),
      version: initial.version,
      updatedAt: now,
      summary: "Updated fields in the editor.",
    }

    updateMockResume({
      id: initial.id,
      patch: {
        name: name.trim(),
        targetRole: targetRole.trim(),
        template: template.trim(),
        notes: notes.trim(),
        versionHistory: [...initial.versionHistory, historyItem],
      },
    })
  }

  useEffect(() => {
    onPreviewChange?.({
      name,
      version: initial.version,
      template,
    })
  }, [name, template, initial.version, onPreviewChange])

  return (
    <Card className="border-border/70">
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-sm">Edit resume</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              {initial.version} • Updated {initial.updatedAt}
            </p>
          </div>
          <Badge
            className="capitalize"
            variant={initial.status === "active" ? "default" : "secondary"}
          >
            {initial.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="edit-name" className="text-sm font-medium text-foreground">
            Resume name
          </label>
          <Input
            id="edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-target-role" className="text-sm font-medium text-foreground">
            Target role
          </label>
          <Input
            id="edit-target-role"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-template" className="text-sm font-medium text-foreground">
            Template
          </label>
          <Input
            id="edit-template"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            placeholder="Standard ATS"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-notes" className="text-sm font-medium text-foreground">
            Notes
          </label>
          <Textarea
            id="edit-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Internal notes for this version."
            className="min-h-28"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            Changes are saved to mock storage (localStorage).
          </p>
          <Button
            onClick={handleSave}
            disabled={!canSave}
            className="gap-2"
          >
            <IconDeviceFloppy size={16} />
            Save changes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

