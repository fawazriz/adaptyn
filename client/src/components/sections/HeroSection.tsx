"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import AnimatedTextCycle from "@/components/ui/animated-text-cycle"
import { FadeUp } from "@/components/shared/FadeUp"
import {
  IconLayoutKanban,
  IconFileText,
  IconChartBar,
  IconUsersGroup,
  IconArrowRight,
  IconCheck,
} from "@tabler/icons-react"

function KanbanPreview() {
  const cols = [
    {
      label: "Applied",
      count: 14,
      dot: "bg-slate-400 dark:bg-slate-500",
      textColor: "text-slate-500 dark:text-slate-400",
      cards: [
        { co: "Stripe", role: "Backend Intern", tag: "New" },
        { co: "Vercel", role: "Platform Eng", tag: "2d ago" },
      ],
    },
    {
      label: "Screening",
      count: 3,
      dot: "bg-blue-500",
      textColor: "text-blue-600 dark:text-blue-400",
      cards: [{ co: "Linear", role: "Frontend Eng", tag: "Scheduled" }],
    },
    {
      label: "Interview",
      count: 2,
      dot: "bg-violet-500",
      textColor: "text-violet-600 dark:text-violet-400",
      cards: [{ co: "Figma", role: "SWE Intern", tag: "Today 2pm" }],
    },
    {
      label: "Offer",
      count: 1,
      dot: "bg-emerald-500",
      textColor: "text-emerald-600 dark:text-emerald-400",
      cards: [{ co: "Anthropic", role: "AI Eng", tag: "Received" }],
    },
  ]

  return (
    <div className="rounded-xl border border-border bg-card shadow-md overflow-hidden">
      {/* Browser bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/40">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-2 bg-background rounded px-2 py-0.5 text-[10px] text-muted-foreground font-mono truncate">
          app.adaptyn.co/tracker
        </div>
      </div>

      <div className="flex" style={{ height: 320 }}>
        {/* Sidebar */}
        <div className="w-10 border-r border-border bg-muted/20 flex flex-col items-center pt-3 gap-2.5">
          {[IconLayoutKanban, IconFileText, IconChartBar, IconUsersGroup].map((Icon, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded-md flex items-center justify-center ${
                i === 0
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground/50 hover:bg-muted"
              }`}
            >
              <Icon size={12} />
            </div>
          ))}
        </div>

        {/* Board */}
        <div className="flex-1 p-3 overflow-x-auto">
          <div className="flex gap-2.5 h-full min-w-max">
            {cols.map((col) => (
              <div key={col.label} className="w-38 shrink-0">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
                  <span className={`text-[10px] font-semibold ${col.textColor}`}>
                    {col.label}
                  </span>
                  <span className="text-[9px] text-muted-foreground ml-auto">{col.count}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {col.cards.map((card) => (
                    <div
                      key={card.co}
                      className="bg-background border border-border rounded-lg p-2.5 hover:border-primary/30 cursor-pointer transition-colors"
                    >
                      <div className="text-[10px] font-semibold text-foreground">{card.co}</div>
                      <div className="text-[9px] text-muted-foreground mt-0.5">{card.role}</div>
                      <div className="mt-1.5">
                        <span className="text-[8px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                          {card.tag}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="border border-dashed border-border rounded-lg p-2 flex items-center justify-center cursor-pointer hover:bg-muted/40 transition-colors">
                    <span className="text-[9px] text-muted-foreground">+ Add role</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="px-3 py-2 border-t border-border bg-muted/20 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">20 applications tracked</span>
        <span className="text-[10px] text-primary font-medium">3 follow-ups due this week</span>
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-5 grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">
        {/* Copy */}
        <div>

          <FadeUp delay={60}>
            <h1 className="text-4xl lg:text-[2.8rem] font-semibold leading-[1.1] tracking-tight text-foreground mb-4">
              The job hunting platform for{" "}
              <AnimatedTextCycle
                words={["CS students", "new grads", "interns", "co-ops"]}
                interval={2800}
                className="text-primary"
              />
            </h1>
          </FadeUp>

          <FadeUp delay={120}>
            <p className="text-base text-muted-foreground leading-relaxed mb-7 max-w-lg">
              Track applications on a Kanban board, edit your LaTeX resume by clicking directly on
              the PDF, measure which version actually gets callbacks, and find recruiter contacts at
              target companies — all connected in one place.
            </p>
          </FadeUp>

          <FadeUp delay={180}>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button size="default" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                Sign Up Now
                <IconArrowRight size={15} />
              </Button>
              <Button size="default" variant="outline" className="gap-2">
                See how it works
              </Button>
            </div>
          </FadeUp>

          <FadeUp delay={240}>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {[
                "Kanban tracker",
                "Visual LaTeX editor",
                "Resume analytics",
                "Recruiter finder",
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <IconCheck size={12} className="text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </FadeUp>
        </div>

        {/* Dashboard preview */}
        <FadeUp delay={100}>
          <KanbanPreview />
        </FadeUp>
      </div>
    </section>
  )
}
