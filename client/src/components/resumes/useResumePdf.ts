"use client"

import { useEffect, useRef, useState } from "react"
import { compileResumePdf } from "@/lib/resume"

export function useResumePdf() {
  const request = useRef<AbortController | null>(null)
  const current = useRef<{ key: string; url: string } | null>(null)
  const [pdf, setPdf] = useState(current.current)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => () => {
    request.current?.abort()
    if (current.current) URL.revokeObjectURL(current.current.url)
  }, [])

  async function generate(id: string, key: string, content?: unknown) {
    if (request.current) return
    setError("")
    if (current.current?.key === key) return current.current.url

    const controller = new AbortController()
    request.current = controller
    setBusy(true)
    try {
      const blob = await compileResumePdf(id, content, controller.signal)
      if (controller.signal.aborted) return
      const url = URL.createObjectURL(blob)
      if (current.current) URL.revokeObjectURL(current.current.url)
      current.current = { key, url }
      setPdf(current.current)
      return url
    } catch (error) {
      if (!controller.signal.aborted) setError(error instanceof Error ? error.message : "Couldn’t generate the PDF. Try again.")
    } finally {
      request.current = null
      if (!controller.signal.aborted) setBusy(false)
    }
  }

  return { pdf, busy, error, generate }
}

export function downloadPdf(url: string, name: string) {
  const file = document.createElement("a")
  file.href = url
  file.download = `${name.trim().replace(/[^\p{L}\p{N}-]+/gu, "_").replace(/^_+|_+$/g, "") || "Resume"}.pdf`
  file.click()
}
