"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Navbar } from "@/components/shared/Navbar"
import { IconArrowRight, IconBrandGoogle, IconCheck } from "@tabler/icons-react"

const FEATURES = [
  "Kanban board for every application",
  "Click-to-edit visual LaTeX resume",
  "Response rate analytics per version",
  "AI-powered recruiter finder",
]

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // auth logic goes here
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: `${firstName} ${lastName}`,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      // Go somewhere after signup
      document.cookie = `accessToken=${data.accessToken}; path=/; max-age=3600; SameSite=Lax`;
      router.push("/dashboard");
    } catch (err: any) {
      setError("Failed to create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Page body */}
      <div className="flex-1 grid lg:grid-cols-2">

        {/* Left — branding panel */}
        <div className="hidden lg:flex flex-col justify-between p-12 border-r border-border bg-muted/20 mt-7">
          <div>
            <h2 className="text-2xl font-semibold text-foreground leading-snug mb-3">
              Stop juggling spreadsheets and PDF files.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Adaptyn gives CS students and new grads one place for everything in their job search - from first application to signed offer.
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

        {/* Right — signup form */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-sm">

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-foreground mb-2">Create your account.</h1>
              <p className="text-sm text-muted-foreground">
                Already have one?{" "}
                <a href="/login" className="text-primary underline-offset-4 hover:underline">
                  Log in →
                </a>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    id="first-name"
                    type="text"
                    placeholder="Alex"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    id="last-name"
                    type="text"
                    placeholder="Johnson"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@gmail.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? "Creating account…" : "Create account"}
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

            {/* Footer note */}
            <p className="mt-6 text-center text-xs text-muted-foreground/60">
              By signing up you agree to our{" "}
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