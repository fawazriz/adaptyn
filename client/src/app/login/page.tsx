"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Navbar } from "@/components/shared/Navbar"
import {
  IconArrowRight,
  IconBrandGoogle,
  IconCheck,
} from "@tabler/icons-react"

const FEATURES = [
  "Kanban board for every application",
  "Click-to-edit visual LaTeX resume",
  "Response rate analytics per version",
  "AI-powered recruiter finder",
]

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    // auth logic goes here
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      <Navbar />
      {/* Page body */}
      <div className="flex-1 grid lg:grid-cols-2">

        {/* Left — branding panel */}
        <div className="hidden lg:flex flex-col justify-between p-12 border-r border-border bg-muted/20">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 mt-5">
              Your job search, organized
            </p>
            <h2 className="text-2xl font-semibold text-foreground leading-snug mb-3">
              Pick up where you left off.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Every application, every resume version, every recruiter contact — exactly as you left them.
            </p>
          </div>

          <div className="space-y-2.5">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <IconCheck size={9} className="text-primary" />
                </div>
                {f}
              </div>
            ))}
          </div>

          {/* Social proof stat */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-2xl font-bold text-primary">Track what actually works</div>
            <div className="text-sm font-medium text-foreground mt-0.5">
              Measure callback rates across resume versions and iterate with real data.
            </div>
          </div>
        </div>

        {/* Right — login form */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-sm">

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-foreground mb-2">Welcome back.</h1>
              <p className="text-sm text-muted-foreground">
                No account?{" "}
                <a
                  href="/signup"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Sign up free →
                </a>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@gmail.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? "Signing in…" : "Sign in"}
                {!loading && <IconArrowRight size={14} />}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                or
              </span>
            </div>

            {/* OAuth */}
            <Button variant="outline" className="w-full gap-2">
              <IconBrandGoogle size={15} />
              Continue with Google
            </Button>

            {/* Footer note */}
            <p className="mt-6 text-center text-xs text-muted-foreground/60">
              By signing in you agree to our{" "}
              <a href="#" className="underline underline-offset-4 hover:text-muted-foreground">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="underline underline-offset-4 hover:text-muted-foreground">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}