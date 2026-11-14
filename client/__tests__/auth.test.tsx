import "@testing-library/jest-dom"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import LoginPage from "../src/app/login/page"
import SignupPage from "../src/app/signup/page"

const mockPush = jest.fn()
const mockFetch = jest.fn()

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}))

const originalFetch = globalThis.fetch

beforeEach(() => {
  globalThis.fetch = mockFetch
  document.cookie = "accessToken=; path=/; max-age=0"
})

afterAll(() => {
  globalThis.fetch = originalFetch
})

function enter(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label, { exact: true }), { target: { value } })
}

function fillSignup(confirmPassword = "example-password") {
  enter("First name", "Taylor")
  enter("Last name", "Case")
  enter("Email address", "taylor@example.com")
  enter("Password", "example-password")
  enter("Confirm password", confirmPassword)
}

it("uses the existing routes and creates the session only after login returns a token", async () => {
  mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ accessToken: "test-token" }) })
  render(<LoginPage />)

  expect(screen.getByRole("link", { name: "Adaptyn" })).toHaveAttribute("href", "/")
  expect(screen.getByRole("link", { name: "Create an account" })).toHaveAttribute("href", "/signup")
  enter("Email address", "taylor@example.com")
  enter("Password", "example-password")
  fireEvent.click(screen.getByRole("button", { name: "Show password" }))
  expect(screen.getByLabelText("Password", { exact: true })).toHaveAttribute("type", "text")
  fireEvent.click(screen.getByRole("button", { name: "Sign in" }))

  await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/dashboard"))
  expect(document.cookie).toContain("accessToken=test-token")
})

it("announces an unconfirmed email without navigating", async () => {
  mockFetch.mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({ error: "Email not confirmed" }) })
  render(<LoginPage />)
  enter("Email address", "taylor@example.com")
  enter("Password", "example-password")

  fireEvent.click(screen.getByRole("button", { name: "Sign in" }))

  expect(await screen.findByRole("alert")).toHaveTextContent("Confirm your email")
  expect(mockPush).not.toHaveBeenCalled()
})

it("shows the sign-in next step from the real registration response shape without setting a session", async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    status: 201,
    json: async () => ({ message: "User registered successfully" }),
  })
  render(<SignupPage />)
  fillSignup()

  fireEvent.click(screen.getByRole("button", { name: "Create account" }))

  expect(await screen.findByRole("status")).toHaveTextContent("Check your inbox")
  expect(screen.getByRole("link", { name: "Continue to sign in" })).toHaveAttribute("href", "/login")
  expect(mockFetch).toHaveBeenCalledWith(expect.stringMatching(/\/api\/auth\/register$/), expect.objectContaining({
    method: "POST",
    body: JSON.stringify({ fullName: "Taylor Case", email: "taylor@example.com", password: "example-password" }),
  }))
  expect(document.cookie).not.toContain("accessToken")
})

it("keeps a password mismatch on the confirmation field and skips the API call", () => {
  render(<SignupPage />)
  fillSignup("different-password")

  fireEvent.click(screen.getByRole("button", { name: "Create account" }))

  expect(screen.getByLabelText("Confirm password", { exact: true }))
    .toHaveAccessibleDescription("Passwords do not match.")
  expect(mockFetch).not.toHaveBeenCalled()
})
