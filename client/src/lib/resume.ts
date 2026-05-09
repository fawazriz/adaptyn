
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
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resumes`, {
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
    `${process.env.NEXT_PUBLIC_API_URL}/api/resumes/${encodeURIComponent(id)}`,
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
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resumes`, {
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