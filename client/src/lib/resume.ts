
export interface ResumeApiRow {
  id: string
  user_id?: string
  name: string
  target_role?: string
  content: unknown
  latex_source?: string | null
  pdf_url?: string | null
  status?: "draft" | "active" | "archived" | string
  created_at?: string
  updated_at?: string
}

export async function fetchResumes(): Promise<ResumeApiRow[]> {
  const res = await fetch("/api/resumes", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch resumes")
  }

  return res.json()
}

export async function fetchResumeById(id: string): Promise<ResumeApiRow> {
  const res = await fetch(
    `/api/resumes/${encodeURIComponent(id)}`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    }
  )

  if (!res.ok) {
    throw new Error("Failed to fetch resume")
  }

  return res.json()
}

export async function createResume(params: {
  name: string
  target_role: string
  content: unknown
  latex_source?: string | null
  pdf_url?: string | null
  status?: "draft" | "active" | "archived"
}): Promise<ResumeApiRow> {
  const res = await fetch("/api/resumes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
    body: JSON.stringify({
      name: params.name,
      target_role: params.target_role,
      content: params.content,

      // generated later during compilation
      latex_source: params.latex_source ?? null,

      // generated after compile
      pdf_url: params.pdf_url ?? null,

      status: params.status ?? "draft",
    }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)

    throw new Error(data?.error || "Failed to create resume")
  }

  return res.json()
}

export const resumesPath = "/dashboard/resumes"

export function resumePath(id: string) {
  return `${resumesPath}/${encodeURIComponent(id)}`
}

function resumeApiPath(id: string) {
  return `/api/resumes/${encodeURIComponent(id)}`
}

export async function updateResume(
  id: string,
  changes: Partial<Pick<ResumeApiRow, "name" | "content" | "status">>,
): Promise<ResumeApiRow> {
  const response = await fetch(resumeApiPath(id), {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  })
  if (!response.ok) throw new Error("Couldn’t save the resume. Try again.")
  return response.json()
}

export async function deleteResume(id: string) {
  const response = await fetch(resumeApiPath(id), { method: "DELETE", credentials: "include" })
  if (!response.ok) throw new Error("Couldn’t delete the resume. Try again.")
}

export async function compileResumePdf(id: string, content?: unknown, signal?: AbortSignal) {
  const response = await fetch(`${resumeApiPath(id)}/compile`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
    signal,
  })
  if (!response.ok) throw new Error("Couldn’t generate the PDF. Try again.")
  const pdf = await response.blob()
  if (!pdf.size || pdf.type !== "application/pdf") throw new Error("The PDF service returned an invalid document.")
  return pdf
}
