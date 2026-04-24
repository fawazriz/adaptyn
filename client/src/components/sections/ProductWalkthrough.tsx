"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { FadeUp } from "@/components/shared/FadeUp"
import { IconCheck } from "@tabler/icons-react"

// ─── Tab mocks ────────────────────────────────────────────────────────────────

function TrackerMock() {
  const cols = [
    {
      label: "Applied",
      dot: "bg-slate-400",
      cards: [
        { co: "Stripe", role: "Backend Intern · Fall 2025", tag: "5d ago" },
        { co: "Figma", role: "SWE Intern · Full-time", tag: "1w ago" },
      ],
    },
    {
      label: "Screening",
      dot: "bg-blue-500",
      cards: [{ co: "Linear", role: "Frontend Eng · New Grad", tag: "Phone call Thu" }],
    },
    {
      label: "Offer",
      dot: "bg-emerald-500",
      cards: [{ co: "Anthropic", role: "AI Eng · New Grad", tag: "🎉 Offer received" }],
    },
  ]

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/40">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <div className="w-2 h-2 rounded-full bg-green-400" />
        </div>
        <span className="text-[10px] text-muted-foreground font-mono ml-1">tracker</span>
      </div>
      <div className="p-3 overflow-x-auto">
        <div className="flex gap-2.5 min-w-max">
          {cols.map((col) => (
            <div key={col.label} className="w-44 shrink-0">
              <div className="flex items-center gap-1.5 mb-2">
                <div className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
                <span className="text-[10px] font-semibold text-muted-foreground">{col.label}</span>
                <span className="text-[9px] text-muted-foreground/60 ml-auto">{col.cards.length}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {col.cards.map((card) => (
                  <div
                    key={card.co}
                    className="bg-background border border-border rounded-lg p-2.5 cursor-pointer hover:border-primary/30 transition-colors"
                  >
                    <div className="text-[10px] font-semibold text-foreground">{card.co}</div>
                    <div className="text-[9px] text-muted-foreground mt-0.5 leading-relaxed">{card.role}</div>
                    <div className="mt-1.5 text-[8px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded inline-block">
                      {card.tag}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function EditorMock() {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/40">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <div className="w-2 h-2 rounded-full bg-green-400" />
        </div>
        <span className="text-[10px] text-muted-foreground font-mono ml-1">resume / editor</span>
      </div>
      <div className="flex" style={{ height: 260 }}>
        {/* PDF pane */}
        <div className="flex-1 p-4 border-r border-border bg-background overflow-y-auto">
          <div className="text-[9px] text-muted-foreground uppercase tracking-widest mb-3">PDF Preview</div>
          <div className="text-sm font-bold text-foreground">Alex Johnson</div>
          <div className="text-[11px] text-muted-foreground mb-4">SWE · alex@gatech.edu · github.com/alexj</div>

          <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Experience</div>

          <div className="border-2 border-primary/40 bg-primary/5 rounded-lg p-2.5 mb-2 cursor-pointer">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] font-semibold text-foreground">Software Engineer Intern · Stripe</div>
              <Badge className="text-[8px] h-4 px-1.5 bg-primary text-primary-foreground hover:bg-primary/90">Editing</Badge>
            </div>
            <div className="text-[9px] text-muted-foreground">Jun–Aug 2024</div>
            <div className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
              Built internal tooling that reduced deploy time by 40%.
            </div>
          </div>

          {["Software Engineer · Vercel · Jan 2024", "TA · CS 3511 Algorithms · Fall 2023"].map((line) => (
            <div key={line} className="text-[10px] text-muted-foreground px-2 py-1.5 rounded hover:bg-muted cursor-pointer transition-colors">
              {line}
            </div>
          ))}
        </div>

        {/* Edit panel */}
        <div className="w-48 bg-muted/20 p-3 flex flex-col gap-2.5">
          <div className="text-[9px] text-primary font-semibold uppercase tracking-widest">Edit Block</div>
          {[
            { label: "Role", value: "Software Engineer Intern", active: true },
            { label: "Company", value: "Stripe", active: false },
          ].map((f) => (
            <div key={f.label}>
              <div className="text-[9px] text-muted-foreground mb-1">{f.label}</div>
              <div
                className={`bg-card rounded px-2 py-1.5 text-[10px] border ${
                  f.active ? "border-primary/50 text-foreground ring-1 ring-primary/20" : "border-border text-muted-foreground"
                }`}
              >
                {f.value}
              </div>
            </div>
          ))}
          <div>
            <div className="text-[9px] text-muted-foreground mb-1">Bullet</div>
            <div className="bg-card border border-border rounded px-2 py-2 text-[9px] text-muted-foreground leading-relaxed min-h-[48px]">
              Built internal tooling that reduced deploy time by 40%.
            </div>
          </div>
          <button className="mt-auto w-full bg-primary text-primary-foreground text-[10px] font-medium py-1.5 rounded transition-colors hover:bg-primary/90">
            Save &amp; recompile
          </button>
        </div>
      </div>
    </div>
  )
}

function AnalyticsMock() {
  const bars = [8, 12, 11, 16, 14, 21, 19, 26, 24, 31, 31]
  const max = Math.max(...bars)
  const versions = [
    { v: "v1.0", rate: "12%", apps: 22, cos: "Amazon, Meta, Google" },
    { v: "v2.0", rate: "18%", apps: 14, cos: "Stripe, Vercel, Notion" },
    { v: "v3.2", rate: "31%", apps: 8, cos: "Anthropic, OpenAI, Scale", current: true },
  ]

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/40">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <div className="w-2 h-2 rounded-full bg-green-400" />
        </div>
        <span className="text-[10px] text-muted-foreground font-mono ml-1">analytics</span>
      </div>
      <div className="p-4">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: "Applications", val: "44", sub: "+8 this week" },
            { label: "Response rate", val: "31%", sub: "↑ vs 12% baseline", hi: true },
            { label: "Interviews", val: "5", sub: "2 pending" },
          ].map((s) => (
            <div
              key={s.label}
              className={`rounded-lg p-2.5 ${s.hi ? "bg-primary/8 border border-primary/20" : "bg-muted/40 border border-border"}`}
            >
              <div className={`text-lg font-bold ${s.hi ? "text-primary" : "text-foreground"}`}>{s.val}</div>
              <div className="text-[9px] text-muted-foreground mt-0.5">{s.label}</div>
              <div className={`text-[9px] mt-1 ${s.hi ? "text-primary" : "text-emerald-600 dark:text-emerald-400"}`}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div className="bg-background border border-border rounded-lg p-3 mb-3">
          <div className="text-[9px] font-medium text-foreground mb-2">Callback rate over time</div>
          <div className="flex items-end gap-1 h-14">
            {bars.map((val, i) => (
              <div key={i} className="flex-1 flex items-end h-full">
                <div
                  className="w-full rounded-t-sm"
                  style={{
                    height: `${(val / max) * 100}%`,
                    backgroundColor: i >= 8 ? "var(--color-primary)" : "color-mix(in oklch, var(--color-primary) 25%, transparent)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Version table */}
        <div className="space-y-1">
          {versions.map((v) => (
            <div
              key={v.v}
              className={`flex items-center gap-3 rounded-md px-2.5 py-1.5 text-[10px] ${
                v.current ? "bg-primary/8 border border-primary/20" : "bg-muted/30"
              }`}
            >
              <span className={`font-mono font-semibold w-8 ${v.current ? "text-primary" : "text-muted-foreground"}`}>
                {v.v}
              </span>
              <span className={`font-medium w-8 ${v.current ? "text-primary" : "text-foreground"}`}>{v.rate}</span>
              <span className="text-muted-foreground flex-1 truncate">{v.cos}</span>
              <span className="text-muted-foreground/60">{v.apps} apps</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RecruiterMock() {
  const recruiters = [
    { name: "Sarah Chen", title: "Technical Recruiter · Stripe", school: "MIT '21", mutual: 3 },
    { name: "Marcus Webb", title: "University Recruiting · Stripe", school: "CMU '20", mutual: 1 },
    { name: "Priya Nair", title: "Engineering Talent · Stripe", school: "Stanford '22", mutual: 5 },
  ]

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/40">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <div className="w-2 h-2 rounded-full bg-green-400" />
        </div>
        <span className="text-[10px] text-muted-foreground font-mono ml-1">recruiter finder</span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2 mb-4">
          <span className="text-[10px] text-muted-foreground">🔍</span>
          <span className="text-[10px] text-foreground font-medium">Stripe</span>
          <span className="text-[10px] text-muted-foreground">·</span>
          <span className="text-[10px] text-muted-foreground">Software Engineer Intern</span>
          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-auto">3 found</span>
        </div>

        <div className="space-y-2">
          {recruiters.map((r) => (
            <div key={r.name} className="flex items-start justify-between border border-border rounded-lg p-2.5 hover:border-primary/30 hover:bg-muted/20 transition-colors cursor-pointer">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-[9px] font-semibold text-primary">
                  {r.name[0]}
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-foreground">{r.name}</div>
                  <div className="text-[9px] text-muted-foreground">{r.title}</div>
                  <div className="text-[9px] text-muted-foreground/60 mt-0.5">{r.mutual} mutual connections</div>
                </div>
              </div>
              <button className="text-[8px] bg-primary/10 text-primary px-1.5 py-1 rounded shrink-0 hover:bg-primary/20 transition-colors">
                Draft email
              </button>
            </div>
          ))}
        </div>

        <div className="mt-3 px-2.5 py-2 bg-muted/30 rounded-lg border border-border">
          <div className="text-[9px] text-muted-foreground">✉️ Cold email template pre-written · Click to customize before sending</div>
        </div>
      </div>
    </div>
  )
}

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  {
    id: "tracker",
    label: "Tracker",
    heading: "Every application on one board.",
    body: "Drag roles between stages, log notes after every interview, and set follow-up reminders. Filter by company size, role type, or status. Never lose track of where you stand.",
    points: [
      "Applied → Screening → Interview → Offer pipeline",
      "Notes and attachments per application",
      "Follow-up due date reminders",
      "Filter by role type: SWE, PM, Research, Data",
    ],
    mock: <TrackerMock />,
  },
  {
    id: "editor",
    label: "Resume Editor",
    heading: "Click the PDF. Edit the text.",
    body: "Your resume renders as a live PDF. Click any section — experience, education, skills — to open an inline editor. Adaptyn patches the LaTeX source and recompiles in under 2 seconds. No LaTeX knowledge needed.",
    points: [
      "Click-to-edit any PDF element",
      "Automatic LaTeX source patching",
      "Recompile in under 2 seconds",
      "Every version saved with full diff history",
    ],
    mock: <EditorMock />,
  },
  {
    id: "analytics",
    label: "Analytics",
    heading: "Stop guessing which resume works.",
    body: "Every application is logged against the resume version you used. Adaptyn tracks callback rates per version, broken down by role type and company — so you can iterate your resume like a real engineering problem.",
    points: [
      "Response rate per resume version",
      "Breakdown by company size and role type",
      "Side-by-side version diff viewer",
      "Weekly callback trend chart",
    ],
    mock: <AnalyticsMock />,
  },
  {
    id: "recruiters",
    label: "Recruiter Finder",
    heading: "Find the right person, not the apply button.",
    body: "Enter a target company and role. Adaptyn surfaces relevant recruiters and hiring managers, sorted by mutual connections and relevance. A personalized cold-email draft is generated — ready for you to review and send.",
    points: [
      "AI-powered recruiter search by company + role",
      "Sorted by mutual connections",
      "Pre-written cold email template per contact",
      "Export contacts to clipboard or CSV",
    ],
    mock: <RecruiterMock />,
  },
]

export function ProductWalkthrough() {
  return (
    <section className="py-20 border-t border-border" id="walkthrough">
      <div className="max-w-6xl mx-auto px-5">
        <FadeUp>
          <div className="mb-10">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Product walkthrough
            </p>
            <h2 className="text-3xl font-semibold text-foreground tracking-tight max-w-xl">
              Four tools. One workflow.
            </h2>
          </div>
        </FadeUp>

        <FadeUp delay={80}>
          <Tabs defaultValue="tracker">
            <TabsList className="h-9 mb-8 bg-muted/50 border border-border p-0.5">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="text-xs h-8 px-4 data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {TABS.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                <div className="grid lg:grid-cols-[1fr_1.3fr] gap-10 items-start">
                  {/* Text */}
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3 leading-snug">
                      {tab.heading}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                      {tab.body}
                    </p>
                    <ul className="space-y-2.5">
                      {tab.points.map((point) => (
                        <li key={point} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <IconCheck size={9} className="text-primary" />
                          </div>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Mock */}
                  <div>{tab.mock}</div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </FadeUp>
      </div>
    </section>
  )
}
