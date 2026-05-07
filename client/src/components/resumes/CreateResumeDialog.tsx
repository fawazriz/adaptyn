"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createMockResume } from "@/components/resumes/resume-store"

export function CreateResumeDialog() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [targetRole, setTargetRole] = useState("")
  const [template, setTemplate] = useState("")
  const [notes, setNotes] = useState("")

  const isDisabled =
    name.trim() === "" || targetRole.trim() === "" || template.trim() === ""

  function handleCreate() {
    const newResume = createMockResume({
      name,
      targetRole,
      template,
      notes,
    })

    router.push(`/dashboard/resumes/${newResume.id}`)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          Create resume
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create resume version</DialogTitle>
          <DialogDescription>
            Add a resume record now. API upload handling can replace this mock flow later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="resume-name" className="text-sm font-medium text-foreground">
              Resume name
            </label>
            <Input
              id="resume-name"
              placeholder="Software Intern Resume"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="target-role" className="text-sm font-medium text-foreground">
              Target role
            </label>
            <Input
              id="target-role"
              placeholder="Software Engineer Intern"
              value={targetRole}
              onChange={(event) => setTargetRole(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="template" className="text-sm font-medium text-foreground">
              Template
            </label>
            <Input
              id="template"
              placeholder="Standard ATS"
              value={template}
              onChange={(event) => setTemplate(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="resume-notes" className="text-sm font-medium text-foreground">
              Notes
            </label>
            <Textarea
              id="resume-notes"
              placeholder="Any context for this resume version?"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button disabled={isDisabled} onClick={handleCreate}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
