"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FadeUp } from "@/components/shared/FadeUp"
import { IconGitCommit, IconTrendingUp, IconTrendingDown, IconMinus } from "@tabler/icons-react"

const VERSIONS = [
  {
    version: "v1.0",
    label: "Baseline",
    date: "Sep 12, 2024",
    callbackRate: 12,
    prevRate: null,
    applications: 22,
    companies: ["Amazon", "Meta", "Google", "Microsoft", "Apple"],
    changes: "Initial resume · Generic bullets from internship descriptions",
    status: "archived",
  },
  {
    version: "v2.0",
    label: "Revised bullets",
    date: "Oct 3, 2024",
    callbackRate: 18,
    prevRate: 12,
    applications: 14,
    companies: ["Stripe", "Vercel", "Notion", "Figma"],
    changes: "Rewrote experience bullets with metrics · Added side projects section",
    status: "archived",
  },
  {
    version: "v2.4",
    label: "ATS keywords",
    date: "Oct 28, 2024",
    callbackRate: 21,
    prevRate: 18,
    applications: 11,
    companies: ["Airbnb", "Lyft", "Databricks", "Snowflake"],
    changes: "Added ATS-friendly keywords · Trimmed education section",
    status: "archived",
  },
  {
    version: "v3.2",
    label: "Current",
    date: "Nov 14, 2024",
    callbackRate: 31,
    prevRate: 21,
    applications: 8,
    companies: ["Anthropic", "OpenAI", "Scale AI", "Cohere"],
    changes: "Quantified all bullet points · Tailored skills for ML-adjacent roles",
    status: "current",
  },
]

function TrendIcon({ current, prev }: { current: number; prev: number | null }) {
  if (prev === null) return <IconMinus size={12} className="text-muted-foreground" />
  const delta = current - prev
  if (delta > 0) return <IconTrendingUp size={12} className="text-emerald-600 dark:text-emerald-400" />
  if (delta < 0) return <IconTrendingDown size={12} className="text-red-500" />
  return <IconMinus size={12} className="text-muted-foreground" />
}

function DeltaBadge({ current, prev }: { current: number; prev: number | null }) {
  if (prev === null) return <span className="text-[10px] text-muted-foreground">baseline</span>
  const delta = current - prev
  const sign = delta > 0 ? "+" : ""
  const color =
    delta > 0
      ? "text-emerald-600 dark:text-emerald-400"
      : delta < 0
      ? "text-red-500"
      : "text-muted-foreground"
  return <span className={`text-[10px] font-medium ${color}`}>{sign}{delta}pp</span>
}

export function ResumeVersioningSection() {
  return (
    <section className="py-20 border-t border-border" id="versioning">
      <div className="max-w-6xl mx-auto px-5">
        <FadeUp>
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-16 items-start">
            <div className="lg:sticky lg:top-24">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Resume versioning
              </p>
              <h2 className="text-3xl font-semibold text-foreground tracking-tight mb-4">
                Iterate your resume like you ship code.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Every time you save a new version of your resume, Adaptyn records which applications
                used it. Over time you build a data set: callback rate per version, companies
                reached, and exactly what changed between versions.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                No more guessing whether that rewrite helped. The data tells you.
              </p>

            </div>

            {/* Version timeline */}
            <div>
              <div className="space-y-0">
                {VERSIONS.map((v, i) => (
                  <FadeUp key={v.version} delay={i * 80}>
                    <div className="relative flex gap-4">
                      {/* Timeline line */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${
                            v.status === "current"
                              ? "border-primary bg-primary/10"
                              : "border-border bg-card"
                          }`}
                        >
                          <IconGitCommit
                            size={12}
                            className={v.status === "current" ? "text-primary" : "text-muted-foreground"}
                          />
                        </div>
                        {i < VERSIONS.length - 1 && (
                          <div className="w-px flex-1 bg-border my-1" style={{ minHeight: 16 }} />
                        )}
                      </div>

                      {/* Card */}
                      <div className={`flex-1 mb-4 rounded-lg border p-4 ${
                        v.status === "current" ? "border-primary/30 bg-primary/5" : "border-border bg-card"
                      }`}>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-sm font-semibold text-foreground">{v.version}</span>
                            <Badge
                              variant={v.status === "current" ? "default" : "secondary"}
                              className={`text-[10px] h-5 px-1.5 ${
                                v.status === "current"
                                  ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/10"
                                  : ""
                              }`}
                            >
                              {v.label}
                            </Badge>
                          </div>
                          <span className="text-[10px] text-muted-foreground shrink-0">{v.date}</span>
                        </div>

                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{v.changes}</p>

                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1.5">
                            <TrendIcon current={v.callbackRate} prev={v.prevRate} />
                            <span className="text-lg font-bold text-foreground">{v.callbackRate}%</span>
                            <span className="text-[10px] text-muted-foreground">callback rate</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DeltaBadge current={v.callbackRate} prev={v.prevRate} />
                          </div>
                          <div className="ml-auto text-[10px] text-muted-foreground">
                            {v.applications} applications
                          </div>
                        </div>

                        <Separator className="mb-3" />

                        <div className="flex flex-wrap gap-1">
                          {v.companies.map((co) => (
                            <span
                              key={co}
                              className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
                            >
                              {co}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
