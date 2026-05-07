"use client"

import Link from "next/link"
import { IconCalendarClock, IconDotsVertical, IconUsers } from "@tabler/icons-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { ResumeStatus, ResumeVersion } from "@/components/resumes/types"

interface ResumeLibraryProps {
  resumes: ResumeVersion[]
  selectedResumeId: string
  onSelectResume: (resumeId: string) => void
}

const statusStyles: Record<ResumeStatus, string> = {
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  archived: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  draft: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
}

export function ResumeLibrary({
  resumes,
  selectedResumeId,
  onSelectResume,
}: ResumeLibraryProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Resume library</h2>
        <p className="text-xs text-muted-foreground">{resumes.length} versions tracked</p>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        {resumes.map((resume) => (
          <Link
            key={resume.id}
            href={`/dashboard/resumes/${resume.id}`}
            className="block"
            onMouseEnter={() => onSelectResume(resume.id)}
            onFocus={() => onSelectResume(resume.id)}
          >
            <Card
              className={cn(
                "border border-border/70 transition-colors hover:border-primary/40",
                selectedResumeId === resume.id && "border-primary/70 bg-primary/5"
              )}
            >
              <CardHeader className="pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">{resume.name}</CardTitle>
                    <CardDescription className="mt-1 text-xs">
                      {resume.targetRole} • {resume.version}
                    </CardDescription>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                        }}
                        aria-label="Resume actions"
                      >
                        <IconDotsVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        onSelect={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                        }}
                      >
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                        }}
                      >
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onSelect={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <IconCalendarClock size={14} />
                    Updated {resume.updatedAt}
                  </span>
                  <Badge
                    className={cn("capitalize", statusStyles[resume.status])}
                  >
                    {resume.status}
                  </Badge>
                </div>

                <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <IconUsers size={14} />
                  {resume.applicationsCount} applications using this version
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
