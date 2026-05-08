"use client"

import { ResumeEditorShell } from "@/components/resumes/editor/ResumeEditorShell"

export default function ResumeEditorRoutePage({
  params,
}: {
  params: { id: string }
}) {
  return <ResumeEditorShell resumeId={params.id} />
}

