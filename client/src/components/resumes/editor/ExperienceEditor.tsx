"use client"

import { IconPlus, IconTrash } from "@tabler/icons-react"
import type { ExperienceItem } from "@/components/resumes/editor/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID()
  return `exp_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

export function ExperienceEditor({
  value,
  onChange,
}: {
  value: ExperienceItem[]
  onChange: (next: ExperienceItem[]) => void
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Experience</h3>
          <p className="text-xs text-muted-foreground">
            Add roles and bullet points.
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
                company: "",
                role: "",
                dates: "",
                location: "",
                bullets: [],
              },
            ])
          }
        >
          <IconPlus size={16} />
          Add experience
        </Button>
      </div>

      {value.length === 0 ? (
        <p className="text-xs text-muted-foreground">No experience items yet.</p>
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
                    aria-label="Remove experience"
                    onClick={() => onChange(value.filter((x) => x.id !== item.id))}
                    className="text-destructive hover:text-destructive"
                  >
                    <IconTrash size={16} />
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor={`exp_${item.id}_company`}>Company</Label>
                    <Input
                      id={`exp_${item.id}_company`}
                      value={item.company}
                      onChange={(e) =>
                        onChange(
                          value.map((x) =>
                            x.id === item.id ? { ...x, company: e.target.value } : x
                          )
                        )
                      }
                      placeholder="Company Name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`exp_${item.id}_role`}>Role</Label>
                    <Input
                      id={`exp_${item.id}_role`}
                      value={item.role}
                      onChange={(e) =>
                        onChange(
                          value.map((x) =>
                            x.id === item.id ? { ...x, role: e.target.value } : x
                          )
                        )
                      }
                      placeholder="Software Engineer Intern"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor={`exp_${item.id}_dates`}>Dates</Label>
                    <Input
                      id={`exp_${item.id}_dates`}
                      value={item.dates}
                      onChange={(e) =>
                        onChange(
                          value.map((x) =>
                            x.id === item.id ? { ...x, dates: e.target.value } : x
                          )
                        )
                      }
                      placeholder="Jun 2024 - Aug 2024"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`exp_${item.id}_location`}>Location</Label>
                    <Input
                      id={`exp_${item.id}_location`}
                      value={item.location}
                      onChange={(e) =>
                        onChange(
                          value.map((x) =>
                            x.id === item.id
                              ? { ...x, location: e.target.value }
                              : x
                          )
                        )
                      }
                      placeholder="Remote"
                    />
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
                      No bullets yet for this role.
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

