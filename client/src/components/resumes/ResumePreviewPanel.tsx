"use client"

import { IconFileTypePdf } from "@tabler/icons-react"
import type { ResumeVersion } from "@/components/resumes/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ResumePreviewPanel({
  resume,
  previewName,
  previewTemplate,
}: {
  resume: ResumeVersion
  previewName?: string
  previewTemplate?: string
}) {
  const name = previewName ?? resume.name
  const template = previewTemplate ?? resume.template

  return (
    <Card className="h-full border-border/70">
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-sm">PDF preview</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">{name} • {resume.version}</p>
          </div>
          {/* Placeholder for future preview controls */}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid h-full min-h-[320px] place-content-center rounded-lg border border-dashed border-border bg-background text-center">
          <IconFileTypePdf size={30} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-xs font-medium text-muted-foreground">
            PDF preview placeholder
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Template: {template ?? "—"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

