import { ResumeEditorShell } from "@/components/resumes/editor/ResumeEditorShell"

export default async function ResumeEditorRoutePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ResumeEditorShell key={id} resumeId={id} />
}
