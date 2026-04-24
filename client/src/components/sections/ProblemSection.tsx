"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FadeUp } from "@/components/shared/FadeUp"
import { IconArrowRight, IconX, IconCheck } from "@tabler/icons-react"

const CHAOS_ITEMS = [
  {
    icon: "📊",
    name: "applications_tracker_v7_FINAL.xlsx",
    detail: "47 rows · last edited 11 days ago",
    note: "Is row 23 Stripe or Stripe (second time)?",
  },
  {
    icon: "📄",
    name: "resume_FINAL_real_v3_edits_2.pdf",
    detail: "Also: resume_v2_old.pdf, resume_NEW.pdf, resume_copy.pdf",
    note: "No idea which one was sent where",
  },
  {
    icon: "📧",
    name: "\"Following up on my application\"",
    detail: "Sent 3 of these this week. Two wrong companies.",
    note: "Recruiter's name was in a different tab",
  },
  {
    icon: "🗂️",
    name: "23 open browser tabs",
    detail: "LinkedIn, Greenhouse, Workday, company careers pages…",
    note: "\"I think I applied to Netflix?\"",
  },
]

const ADAPTYN_ITEMS = [
  { label: "Every application tracked", sub: "Status, notes, follow-up date — on one board" },
  { label: "Resume versions tied to applications", sub: "Know exactly which PDF got which callback" },
  { label: "Response rates per version", sub: "v3.2 has a 31% callback rate vs 12% for v1.0" },
  { label: "Recruiter contacts organized", sub: "AI finds the right person, pre-writes the email" },
]

export function ProblemSection() {
  return (
    <section className="py-20 border-t border-border">
      <div className="max-w-6xl mx-auto px-5">
        <FadeUp>
          <div className="mb-12">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              The problem
            </p>
            <h2 className="text-3xl font-semibold text-foreground tracking-tight max-w-xl">
              Most students manage job applications the same broken way.
            </h2>
          </div>
        </FadeUp>

        <div className="grid lg:grid-cols-[1.1fr_auto_1fr] gap-6 lg:gap-8 items-start">
          {/* Chaos side */}
          <FadeUp delay={80}>
            <Card className="border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">The current workflow</span>
                <Badge variant="destructive" className="text-[10px] h-5 px-1.5">Painful</Badge>
              </div>
              <div className="divide-y divide-border">
                {CHAOS_ITEMS.map((item) => (
                  <div key={item.name} className="px-4 py-3.5">
                    <div className="flex items-start gap-2.5">
                      <span className="text-base mt-0.5 shrink-0">{item.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground font-mono truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{item.detail}</p>
                        <div className="flex items-center gap-1 mt-1.5">
                          <IconX size={10} className="text-red-500 shrink-0" />
                          <p className="text-[11px] text-red-600 dark:text-red-400 italic">
                            {item.note}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </FadeUp>

          {/* Arrow */}
          <FadeUp delay={160} className="hidden lg:flex items-center justify-center pt-32">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <IconArrowRight size={14} className="text-primary" />
              </div>
            </div>
          </FadeUp>

          {/* Solution side */}
          <FadeUp delay={200}>
            <Card className="border-primary/20 overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-primary/5 flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">With Adaptyn</span>
                <Badge className="text-[10px] h-5 px-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                  Organized
                </Badge>
              </div>

              <div className="px-4 py-4 space-y-4">
                {ADAPTYN_ITEMS.map((item, i) => (
                  <div key={item.label} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <IconCheck size={10} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{item.label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.sub}</p>
                    </div>
                    {i < ADAPTYN_ITEMS.length - 1 && (
                      <div className="absolute" />
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              <div className="px-4 py-3 bg-muted/20">
                <p className="text-[11px] text-muted-foreground">
                  Everything tied together — applications, resumes, analytics, and recruiter contacts in one command center.
                </p>
              </div>
            </Card>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
