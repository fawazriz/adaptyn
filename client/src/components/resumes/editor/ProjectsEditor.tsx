"use client"

import { IconLink, IconPlus, IconTrash } from "@tabler/icons-react"
import type { ProjectItem } from "@/components/resumes/editor/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID()
  return `proj_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

export function ProjectsEditor({
  value,
  onChange,
}: {
  value: ProjectItem[]
  onChange: (next: ProjectItem[]) => void
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Projects</h3>
          <p className="text-xs text-muted-foreground">
            Add projects, tech stack, optional links, and bullet points.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() =>
            onChange([
              ...value,
              {
                id: makeId(),
                projectName: "",
                techStack: "",
                link: "",
                bullets: [],
              },
            ])
          }
        >
          <IconPlus size={16} />
          Add project
        </Button>
      </div>

      {value.length === 0 ? (
        <p className="text-xs text-muted-foreground">No project items yet.</p>
      ) : (
        value.map((item, itemIndex) => (
          <div key={item.id} className="space-y-3">
            <Card>
              <CardContent className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm font-medium">Item {itemIndex + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Remove project"
                    onClick={() => onChange(value.filter((x) => x.id !== item.id))}
                    className="text-destructive hover:text-destructive"
                  >
                    <IconTrash size={16} />
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor={`proj_${item.id}_name`}>Project name</Label>
                    <Input
                      id={`proj_${item.id}_name`}
                      value={item.projectName}
                      onChange={(e) =>
                        onChange(
                          value.map((x) =>
                            x.id === item.id
                              ? { ...x, projectName: e.target.value }
                              : x
                          )
                        )
                      }
                      placeholder="Resume Builder"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`proj_${item.id}_stack`}>Tech stack</Label>
                    <Input
                      id={`proj_${item.id}_stack`}
                      value={item.techStack}
                      onChange={(e) =>
                        onChange(
                          value.map((x) =>
                            x.id === item.id
                              ? { ...x, techStack: e.target.value }
                              : x
                          )
                        )
                      }
                      placeholder="Next.js, TypeScript, Tailwind"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`proj_${item.id}_link`}>Link (optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id={`proj_${item.id}_link`}
                      value={item.link ?? ""}
                      onChange={(e) =>
                        onChange(
                          value.map((x) =>
                            x.id === item.id ? { ...x, link: e.target.value } : x
                          )
                        )
                      }
                      placeholder="github.com/your-handle/project"
                    />
                    <div className="text-muted-foreground">
                      <IconLink size={16} />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <h5 className="text-sm font-medium">Bullet points</h5>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() =>
                        onChange(
                          value.map((x) =>
                            x.id === item.id
                              ? { ...x, bullets: [...x.bullets, ""] }
                              : x
                          )
                        )
                      }
                    >
                      <IconPlus size={16} />
                      Add bullet
                    </Button>
                  </div>

                  {item.bullets.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No bullets yet for this project.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {item.bullets.map((bullet, bulletIndex) => (
                        <div key={`${item.id}_b_${bulletIndex}`} className="flex gap-2">
                          <Textarea
                            value={bullet}
                            rows={2}
                            onChange={(e) => {
                              const nextBullets = item.bullets.map((b, idx) =>
                                idx === bulletIndex ? e.target.value : b
                              )
                              onChange(
                                value.map((x) =>
                                  x.id === item.id ? { ...x, bullets: nextBullets } : x
                                )
                              )
                            }}
                            placeholder={`Bullet ${bulletIndex + 1}`}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Remove bullet"
                            onClick={() => {
                              const nextBullets = item.bullets.filter(
                                (_, idx) => idx !== bulletIndex
                              )
                              onChange(
                                value.map((x) =>
                                  x.id === item.id ? { ...x, bullets: nextBullets } : x
                                )
                              )
                            }}
                            className="text-destructive hover:text-destructive"
                          >
                            <IconTrash size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {itemIndex < value.length - 1 && <Separator />}
          </div>
        ))
      )}
    </div>
  )
}

