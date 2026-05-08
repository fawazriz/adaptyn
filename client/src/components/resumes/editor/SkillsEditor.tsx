"use client"

import type { Skills } from "@/components/resumes/editor/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { IconSparkles, IconTrash } from "@tabler/icons-react"

function linesToArray(value: string) {
  return value
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean)
}

function arrayToLines(values: string[]) {
  return values.join("\n")
}

export function SkillsEditor({
  value,
  onChange,
}: {
  value: Skills
  onChange: (next: Skills) => void
}) {
  const languages = arrayToLines(value.languages)
  const frameworks = arrayToLines(value.frameworks)
  const tools = arrayToLines(value.tools)
  const databases = arrayToLines(value.databases)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Skills</h3>
          <p className="text-xs text-muted-foreground">
            One item per line for each category.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label>Languages</Label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Clear languages"
                className="text-destructive hover:text-destructive"
                onClick={() => onChange({ ...value, languages: [] })}
              >
                <IconTrash size={16} />
              </Button>
            </div>
            <Textarea
              value={languages}
              rows={3}
              onChange={(e) =>
                onChange({ ...value, languages: linesToArray(e.target.value) })
              }
              placeholder="TypeScript\nJava\nPython"
              className="font-mono text-[12px]"
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label>Frameworks</Label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Clear frameworks"
                className="text-destructive hover:text-destructive"
                onClick={() => onChange({ ...value, frameworks: [] })}
              >
                <IconTrash size={16} />
              </Button>
            </div>
            <Textarea
              value={frameworks}
              rows={3}
              onChange={(e) =>
                onChange({ ...value, frameworks: linesToArray(e.target.value) })
              }
              placeholder="React\nNext.js"
              className="font-mono text-[12px]"
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label>Tools</Label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Clear tools"
                className="text-destructive hover:text-destructive"
                onClick={() => onChange({ ...value, tools: [] })}
              >
                <IconTrash size={16} />
              </Button>
            </div>
            <Textarea
              value={tools}
              rows={3}
              onChange={(e) =>
                onChange({ ...value, tools: linesToArray(e.target.value) })
              }
              placeholder="Git\nTesting\nREST APIs"
              className="font-mono text-[12px]"
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label>Databases</Label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Clear databases"
                className="text-destructive hover:text-destructive"
                onClick={() => onChange({ ...value, databases: [] })}
              >
                <IconTrash size={16} />
              </Button>
            </div>
            <Textarea
              value={databases}
              rows={3}
              onChange={(e) =>
                onChange({
                  ...value,
                  databases: linesToArray(e.target.value),
                })
              }
              placeholder="PostgreSQL\nSQL"
              className="font-mono text-[12px]"
            />
          </div>

          <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
            <div className="flex items-start gap-2">
              <IconSparkles size={16} className="text-muted-foreground mt-0.5" />
              <p className="text-xs text-muted-foreground leading-5">
                Tip: Keep skills concise; the preview card will wrap lines
                automatically.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

