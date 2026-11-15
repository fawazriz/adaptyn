export function authError(status: number, message: unknown, action: "login" | "signup") {
  const detail = typeof message === "string" ? message.toLowerCase() : ""

  if (status === 429) return "Too many attempts. Wait a moment and try again."
  if (status >= 500) return "The authentication service is temporarily unavailable. Try again shortly."

  if (action === "login") {
    if (detail.includes("email not confirmed")) {
      return "Confirm your email using the link in your inbox, then sign in."
    }
    if (status === 401) return "The email address or password is incorrect."
    return "We couldn’t sign you in. Try again."
  }

  return "We couldn’t complete registration. Check your details and try again."
}
