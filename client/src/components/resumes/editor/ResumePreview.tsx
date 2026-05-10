"use client"

import { useMemo } from "react"
import { IconCheck, IconDownload, IconFileTypePdf, IconLoader2 } from "@tabler/icons-react"
import type { ResumeData } from "@/components/resumes/editor/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { resume } from "react-dom/server"

function formatLineParts(parts: Array<string | undefined | null>, sep = " • ") {
  return parts
    .map((p) => (p ?? "").trim())
    .filter(Boolean)
    .join(sep)
}

async function save(resumeId: string, content: ResumeData) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/resumes/${resumeId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        content,
      }),
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || "Failed to save resume")
  }

  return data
}

export function ResumePreview({
  value,
  pdfUrl,
  onCompile,
  isCompiling,
}: {
  value: ResumeData
  pdfUrl: string
  onCompile: () => void
  isCompiling: boolean
}) {

  const contactLine = useMemo(() => {
    const emailPhone = formatLineParts([value.header.email, value.header.phone], " | ")
    const location = value.header.location?.trim()
    return formatLineParts([emailPhone, location], " | ")
  }, [value.header.email, value.header.phone, value.header.location])


  return (
    <div className="sticky top-4 self-start space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Live</Badge>
          <p className="text-sm font-semibold">Preview</p>
        </div>

        <div className="flex items-center gap-2">

          <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700" onClick={() => save(value.id, value)}>
            <IconCheck size={16} />
            Save
          </Button>

          <Button
            size="sm"
            onClick={onCompile}
            disabled={isCompiling}
            className="gap-2"
          >
            {isCompiling ? (
              <IconLoader2 size={16} className="animate-spin" />
            ) : (
              <IconFileTypePdf size={16} />
            )}
            {isCompiling ? "Compiling..." : "Compile PDF"}
          </Button>
          <Button size="sm" disabled className="gap-2">
            <IconDownload size={16} />
            Download PDF
          </Button>
        </div>
      </div>

      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          className="h-[calc(100vh-150px)] w-full rounded-xl border bg-white"
        />
      ) : (
        <Card className="border-zinc-200 bg-white text-zinc-900 shadow-none dark:border-zinc-200 dark:bg-white dark:text-zinc-900">
          <CardContent className="p-6">
            {/* keep your existing HTML preview content here */}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

