"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
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
import { createResume } from "@/lib/resume"
import { sampleResume } from "@/components/resumes/editor/sampleResumeData"

export function CreateResumeDialog() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [targetRole, setTargetRole] = useState("")
  const [template, setTemplate] = useState("")
  const [notes, setNotes] = useState("")
  const [open, setOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const isDisabled =
    name.trim() === "" || targetRole.trim() === "" || template.trim() === "" || isCreating

  async function handleCreate() {
    setIsCreating(true)
    try {
      const content = {
        ...sampleResume,
        header: {
          ...sampleResume.header,
          fullName: name.trim(),
          // Keep editor demo data realistic; the modal doesn't collect email/phone yet.
          email: sampleResume.header.email,
          phone: sampleResume.header.phone,
        },
        // Store these for later backend compilation; editor UI can ignore them for now.
        template: template.trim(),
        notes: notes.trim(),
      }

      const newResume = await createResume({
        name: name.trim(),
        target_role: targetRole.trim(),
        content,
        latex_source: template.trim(),
        pdf_url: null,
        status: "draft",
      })

      router.push(`/dashboard/resumes/${newResume.id}`)
    } finally {
      setIsCreating(false)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            {isCreating ? "Creating…" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
