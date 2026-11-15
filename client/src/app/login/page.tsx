"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthField } from "@/components/auth/AuthField"
import { AuthShell } from "@/components/auth/AuthShell"
import { authError } from "@/components/auth/auth-errors"
import styles from "@/components/auth/auth.module.css"

const features = [
  { title: "Track applications", description: "Know which roles you’ve saved, applied to, and heard back from." },
  { title: "Keep resume versions", description: "Keep your master resume and role-specific versions together." },
  { title: "Stay ahead of deadlines", description: "Record interview dates and follow-ups in your application notes." },
]

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return

    const fields = new FormData(event.currentTarget)
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fields.get("email"),
          password: fields.get("password"),
        }),
      })

      const data = await response.json().catch(() => null)
      if (!response.ok) {
        setError(authError(response.status, data?.error, "login"))
        return
      }
      if (typeof data?.accessToken !== "string" || !data.accessToken) {
        setError("We couldn’t start your session. Try signing in again.")
        return
      }

      document.cookie = `accessToken=${data.accessToken}; path=/; max-age=3600; SameSite=Lax`
      router.push("/dashboard")
    } catch {
      setError("We couldn’t reach the authentication service. Check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back."
      description="Sign in to pick up where you left off."
      panelTitle={<>Your search,<br /><em>all in one place.</em></>}
      panelDescription="Applications, resumes, and upcoming interviews organized so you can focus on what comes next."
      features={features}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <AuthField id="email" label="Email address" type="email" autoComplete="email" required />
        <AuthField id="password" label="Password" type="password" autoComplete="current-password" required />
        {error && <p role="alert" className={styles.error}>{error}</p>}
        <button className={styles.submit} type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className={styles.accountPrompt}>New to Adaptyn? <Link href="/signup">Create an account</Link></p>
    </AuthShell>
  )
}
