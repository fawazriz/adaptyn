"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { AuthField } from "@/components/auth/AuthField"
import { AuthShell } from "@/components/auth/AuthShell"
import { authError } from "@/components/auth/auth-errors"
import styles from "@/components/auth/auth.module.css"

const features = [
  { title: "Keep your applications organized." },
  { title: "Create and manage resume versions." },
  { title: "Explore the AI tailoring preview.", description: "Try accepting or rejecting a sample edit on the public landing page." },
]

export default function SignupPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [passwordError, setPasswordError] = useState<{ field: "password" | "confirm-password"; message: string } | null>(null)
  const [confirmation, setConfirmation] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return

    const form = event.currentTarget
    const fields = new FormData(form)
    const password = fields.get("password")
    setError("")
    setPasswordError(null)

    if (password !== fields.get("confirm-password")) {
      setPasswordError({ field: "confirm-password", message: "Passwords do not match." })
      form.querySelector<HTMLInputElement>("#confirm-password")?.focus()
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: `${fields.get("first-name")} ${fields.get("last-name")}`,
          email: fields.get("email"),
          password,
        }),
      })

      const data = await response.json().catch(() => null)
      if (!response.ok) {
        const detail = typeof data?.error === "string" ? data.error : ""
        if (/^password should be at least \d+ characters\.?$/i.test(detail)) {
          setPasswordError({ field: "password", message: detail })
          form.querySelector<HTMLInputElement>("#password")?.focus()
        } else if (/^password should contain/i.test(detail)) {
          setPasswordError({ field: "password", message: "Choose a password with a mix of letters, numbers, and symbols." })
          form.querySelector<HTMLInputElement>("#password")?.focus()
        } else {
          setError(authError(response.status, detail, "signup"))
        }
        return
      }

      if (response.status !== 201 || typeof data?.message !== "string") {
        setError("We couldn’t confirm registration. Try again.")
        return
      }
      setConfirmation(true)
    } catch {
      setError("We couldn’t reach the authentication service. Check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Start your search here."
      description="Create a free account to keep applications and resumes organized."
      panelTitle={<>A place for<br /><em>every next step.</em></>}
      panelDescription="From your first saved job to your next interview, keep the details together."
      features={features}
    >
      {confirmation ? (
        <div className={styles.confirmation}>
          <div role="status">
            <h2>Check your inbox</h2>
            <p>If you receive a confirmation email, follow its link before signing in.</p>
          </div>
          <Link href="/login">Continue to sign in</Link>
        </div>
      ) : (
        <>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.nameFields}>
              <AuthField id="first-name" label="First name" autoComplete="given-name" required />
              <AuthField id="last-name" label="Last name" autoComplete="family-name" required />
            </div>
            <AuthField id="email" label="Email address" type="email" autoComplete="email" required />
            <AuthField
              id="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              error={passwordError?.field === "password" ? passwordError.message : undefined}
              onChange={() => setPasswordError(null)}
              required
            />
            <AuthField
              id="confirm-password"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              error={passwordError?.field === "confirm-password" ? passwordError.message : undefined}
              onChange={() => {
                if (passwordError?.field === "confirm-password") setPasswordError(null)
              }}
              required
            />
            {error && <p role="alert" className={styles.error}>{error}</p>}
            <button className={styles.submit} type="submit" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
          <p className={styles.accountPrompt}>Already have an account? <Link href="/login">Sign in</Link></p>
        </>
      )}
    </AuthShell>
  )
}
