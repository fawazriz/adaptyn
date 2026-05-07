"use client"

import { useMemo, useState } from "react"
import { IconDownload, IconFileTypePdf, IconLoader2 } from "@tabler/icons-react"
import type { ResumeData } from "@/components/resumes/editor/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

function formatLineParts(parts: Array<string | undefined | null>, sep = " • ") {
  return parts
    .map((p) => (p ?? "").trim())
    .filter(Boolean)
    .join(sep)
}

export function ResumePreview({ value }: { value: ResumeData }) {
  const [isCompiling, setIsCompiling] = useState(false)

  const contactLine = useMemo(() => {
    const emailPhone = formatLineParts([value.header.email, value.header.phone], " | ")
    const location = value.header.location?.trim()
    return formatLineParts([emailPhone, location], " | ")
  }, [value.header.email, value.header.phone, value.header.location])

  async function handleCompile() {
    if (isCompiling) return
    setIsCompiling(true)
    // UI-only stub:
    // Later, send structured `ResumeData` JSON -> backend generates LaTeX -> compiles PDF.
    await new Promise((r) => setTimeout(r, 900))
    console.log("[ResumeEditor] Compile PDF (UI-only stub).", value.id)
    setIsCompiling(false)
  }

  return (
    <div className="sticky top-4 self-start space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Live</Badge>
          <p className="text-sm font-semibold">Preview</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleCompile}
            disabled={isCompiling}
            className="gap-2"
          >
            {isCompiling ? <IconLoader2 size={16} className="animate-spin" /> : <IconFileTypePdf size={16} />}
            Compile PDF
          </Button>
          <Button size="sm" disabled className="gap-2">
            <IconDownload size={16} />
            Download PDF
          </Button>
        </div>
      </div>

      <Card className="border-zinc-200 bg-white text-zinc-900 shadow-none dark:border-zinc-200 dark:bg-white dark:text-zinc-900">
        <CardContent className="p-6">
          <div className="border-b border-zinc-200 pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold leading-tight">
                  {value.header.fullName}
                </h2>
                <p className="mt-1 text-[11px] leading-5 text-zinc-700">
                  {contactLine}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] leading-5 text-zinc-700">
                  {value.header.linkedIn}
                </p>
                <p className="text-[11px] leading-5 text-zinc-700">
                  {value.header.githubOrPortfolio}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {/* Education */}
            <section>
              <h3 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
                Education
              </h3>
              <div className="mt-2 space-y-2">
                {value.education.length === 0 ? (
                  <p className="text-[11px] text-zinc-600">Add an education item.</p>
                ) : (
                  value.education.map((edu) => (
                    <div key={edu.id} className="space-y-1">
                      <p className="text-[12px] font-medium leading-5">
                        {edu.degree} — {edu.school}
                      </p>
                      <p className="text-[11px] text-zinc-700 leading-5">
                        Graduation: {edu.graduationDate}
                      </p>
                      {edu.gpa ? (
                        <p className="text-[11px] text-zinc-700 leading-5">
                          GPA: {edu.gpa}
                        </p>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Experience */}
            <section>
              <h3 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
                Experience
              </h3>
              <div className="mt-2 space-y-3">
                {value.experience.length === 0 ? (
                  <p className="text-[11px] text-zinc-600">Add an experience item.</p>
                ) : (
                  value.experience.map((exp) => (
                    <div key={exp.id} className="space-y-2">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-[12px] font-medium leading-5">
                          {exp.role} — {exp.company}
                        </p>
                        <p className="text-[11px] text-zinc-700 leading-5">
                          {exp.dates}
                        </p>
                      </div>
                      <p className="text-[11px] text-zinc-700 leading-5">
                        {exp.location}
                      </p>
                      {exp.bullets.length > 0 ? (
                        <ul className="list-disc pl-4 space-y-1">
                          {exp.bullets
                            .map((b) => b.trim())
                            .filter(Boolean)
                            .map((b, idx) => (
                              <li key={`${exp.id}_b_${idx}`} className="text-[11px] leading-5 text-zinc-900">
                                {b}
                              </li>
                            ))}
                        </ul>
                      ) : (
                        <p className="text-[11px] text-zinc-600">
                          Add bullet points.
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Projects */}
            <section>
              <h3 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
                Projects
              </h3>
              <div className="mt-2 space-y-3">
                {value.projects.length === 0 ? (
                  <p className="text-[11px] text-zinc-600">Add a project item.</p>
                ) : (
                  value.projects.map((proj) => (
                    <div key={proj.id} className="space-y-2">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-[12px] font-medium leading-5">
                          {proj.projectName}
                        </p>
                        {proj.link?.trim() ? (
                          <p className="text-[11px] text-zinc-700 leading-5">
                            {proj.link}
                          </p>
                        ) : null}
                      </div>
                      <p className="text-[11px] text-zinc-700 leading-5">
                        Tech: {proj.techStack}
                      </p>
                      {proj.bullets.length > 0 ? (
                        <ul className="list-disc pl-4 space-y-1">
                          {proj.bullets
                            .map((b) => b.trim())
                            .filter(Boolean)
                            .map((b, idx) => (
                              <li key={`${proj.id}_b_${idx}`} className="text-[11px] leading-5 text-zinc-900">
                                {b}
                              </li>
                            ))}
                        </ul>
                      ) : (
                        <p className="text-[11px] text-zinc-600">
                          Add bullet points.
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Skills */}
            <section>
              <h3 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
                Skills
              </h3>
              <div className="mt-2 space-y-2">
                {(
                  [
                    ["Languages", value.skills.languages],
                    ["Frameworks", value.skills.frameworks],
                    ["Tools", value.skills.tools],
                    ["Databases", value.skills.databases],
                  ] as const
                ).map(([label, items]) => (
                  <div key={label} className="flex flex-wrap gap-x-3 gap-y-1">
                    <p className="w-[82px] text-[11px] font-medium text-zinc-600">
                      {label}
                    </p>
                    <p className="text-[11px] text-zinc-900">
                      {items.length === 0 ? "—" : items.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

