"use client"

import { useMemo } from "react"
import type { ResumeData, ResumeHeader } from "@/components/resumes/editor/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import type {
  EducationItem,
  ExperienceItem,
  ProjectItem,
  Skills,
} from "@/components/resumes/editor/types"
import { EducationEditor } from "@/components/resumes/editor/EducationEditor"
import { ExperienceEditor } from "@/components/resumes/editor/ExperienceEditor"
import { ProjectsEditor } from "@/components/resumes/editor/ProjectsEditor"
import { SkillsEditor } from "@/components/resumes/editor/SkillsEditor"

function HeaderField({
  label,
  id,
  value,
  onChange,
  placeholder,
}: {
  label: string
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

export function ResumeFormPanel({
  value,
  onChange,
}: {
  value: ResumeData
  onChange: (next: ResumeData) => void
}) {
  const header: ResumeHeader = value.header

  const form = useMemo(() => value, [value])

  return (
    <Card className="border-border/70">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-sm">Resume fields</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Update sections on the left; preview updates live.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-64px-2.5rem)]">
          <div className="p-4">
            <Tabs defaultValue="header">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="header">Header</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
              </TabsList>

              <TabsContent value="header" className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <HeaderField
                      label="Full name"
                      id="fullName"
                      value={header.fullName}
                      onChange={(fullName) =>
                        onChange({ ...form, header: { ...header, fullName } })
                      }
                      placeholder="Alex Johnson"
                    />
                    <HeaderField
                      label="Email"
                      id="email"
                      value={header.email}
                      onChange={(email) =>
                        onChange({ ...form, header: { ...header, email } })
                      }
                      placeholder="alex@email.com"
                    />
                    <HeaderField
                      label="Phone"
                      id="phone"
                      value={header.phone}
                      onChange={(phone) =>
                        onChange({ ...form, header: { ...header, phone } })
                      }
                      placeholder="(555) 123-4567"
                    />
                    <HeaderField
                      label="Location"
                      id="location"
                      value={header.location}
                      onChange={(location) =>
                        onChange({ ...form, header: { ...header, location } })
                      }
                      placeholder="San Francisco, CA"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <HeaderField
                      label="LinkedIn"
                      id="linkedIn"
                      value={header.linkedIn}
                      onChange={(linkedIn) =>
                        onChange({ ...form, header: { ...header, linkedIn } })
                      }
                      placeholder="linkedin.com/in/your-handle"
                    />
                    <HeaderField
                      label="GitHub / Portfolio"
                      id="githubOrPortfolio"
                      value={header.githubOrPortfolio}
                      onChange={(githubOrPortfolio) =>
                        onChange({
                          ...form,
                          header: { ...header, githubOrPortfolio },
                        })
                      }
                      placeholder="github.com/your-handle"
                    />
                  </div>

                  <Separator />
                </div>
              </TabsContent>

              <TabsContent value="education" className="space-y-4">
                <EducationEditor
                  value={value.education}
                  onChange={(education: EducationItem[]) =>
                    onChange({ ...form, education })
                  }
                />
              </TabsContent>

              <TabsContent value="experience" className="space-y-4">
                <ExperienceEditor
                  value={value.experience}
                  onChange={(experience: ExperienceItem[]) =>
                    onChange({ ...form, experience })
                  }
                />
              </TabsContent>

              <TabsContent value="projects" className="space-y-4">
                <ProjectsEditor
                  value={value.projects}
                  onChange={(projects: ProjectItem[]) =>
                    onChange({ ...form, projects })
                  }
                />
              </TabsContent>

              <TabsContent value="skills" className="space-y-4">
                <SkillsEditor
                  value={value.skills as Skills}
                  onChange={(skills: Skills) => onChange({ ...form, skills })}
                />
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

