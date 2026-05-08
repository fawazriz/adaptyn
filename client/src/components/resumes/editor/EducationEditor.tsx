"use client"

import { IconPlus, IconTrash } from "@tabler/icons-react"
import type { EducationItem } from "@/components/resumes/editor/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID()
  return `edu_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

export function EducationEditor({
  value,
  onChange,
}: {
  value: EducationItem[]
  onChange: (next: EducationItem[]) => void
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Education</h3>
          <p className="text-xs text-muted-foreground">
            Add schools and degrees. GPA is optional.
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
                school: "",
                degree: "",
                graduationDate: "",
                gpa: "",
              },
            ])
          }
        >
          <IconPlus size={16} />
          Add education
        </Button>
      </div>

      {value.length === 0 ? (
        <p className="text-xs text-muted-foreground">No education items yet.</p>
      ) : (
        value.map((item, index) => (
          <div key={item.id} className="space-y-3">
            <Card>
              <CardContent className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm font-medium">Item {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Remove education"
                    onClick={() => onChange(value.filter((x) => x.id !== item.id))}
                    className="text-destructive hover:text-destructive"
                  >
                    <IconTrash size={16} />
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor={`edu_${item.id}_school`}>School</Label>
                    <Input
                      id={`edu_${item.id}_school`}
                      value={item.school}
                      onChange={(e) =>
                        onChange(
                          value.map((x) =>
                            x.id === item.id ? { ...x, school: e.target.value } : x
                          )
                        )
                      }
                      placeholder="University Name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`edu_${item.id}_degree`}>Degree</Label>
                    <Input
                      id={`edu_${item.id}_degree`}
                      value={item.degree}
                      onChange={(e) =>
                        onChange(
                          value.map((x) =>
                            x.id === item.id ? { ...x, degree: e.target.value } : x
                          )
                        )
                      }
                      placeholder="B.S. Computer Science"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor={`edu_${item.id}_grad`}>Graduation date</Label>
                    <Input
                      id={`edu_${item.id}_grad`}
                      value={item.graduationDate}
                      onChange={(e) =>
                        onChange(
                          value.map((x) =>
                            x.id === item.id
                              ? { ...x, graduationDate: e.target.value }
                              : x
                          )
                        )
                      }
                      placeholder="May 2025"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`edu_${item.id}_gpa`}>GPA (optional)</Label>
                    <Input
                      id={`edu_${item.id}_gpa`}
                      value={item.gpa ?? ""}
                      onChange={(e) =>
                        onChange(
                          value.map((x) =>
                            x.id === item.id
                              ? { ...x, gpa: e.target.value }
                              : x
                          )
                        )
                      }
                      placeholder="3.8"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {index < value.length - 1 && <Separator />}
          </div>
        ))
      )}
    </div>
  )
}

