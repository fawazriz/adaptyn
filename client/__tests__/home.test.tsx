import "@testing-library/jest-dom"
import { fireEvent, render, screen, within } from "@testing-library/react"
import Home from "../src/app/page"

describe("Home page", () => {
  beforeEach(() => {
    render(<Home />)
  })

  it("renders the header, main content, and footer", () => {
    expect(screen.getByRole("banner")).toBeInTheDocument()
    expect(screen.getByRole("main")).toBeInTheDocument()
    expect(screen.getByRole("contentinfo")).toBeInTheDocument()
  })

  it("introduces the platform with a single primary heading", () => {
    const headings = screen.getAllByRole("heading", { level: 1 })

    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveAccessibleName("Every application, in order.")
  })

  it("links to the existing home, login, and signup routes", () => {
    const header = within(screen.getByRole("banner"))

    expect(header.getByRole("link", { name: "Adaptyn" })).toHaveAttribute("href", "/")
    expect(header.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/login")

    const signupLinks = screen.getAllByRole("link", { name: "Start free" })
    expect(signupLinks).toHaveLength(3)
    signupLinks.forEach((link) => expect(link).toHaveAttribute("href", "/signup"))
  })

  it.each([
    ["How it works", "#how-it-works"],
    ["Tailoring", "#tailoring"],
  ])("links %s to an existing section", (name, href) => {
    const header = within(screen.getByRole("banner"))

    expect(header.getByRole("link", { name })).toHaveAttribute("href", href)
    expect(document.getElementById(href.slice(1))).toBeInTheDocument()
  })

  it("shows four sample applications and all five columns", () => {
    const table = screen.getByRole("table", { description: "Example records" })

    expect(within(table).getAllByRole("columnheader").map((cell) => cell.textContent))
      .toEqual(["Role", "Company", "Location", "Stage", "Next action"])
    expect(within(table).getAllByRole("rowheader")).toHaveLength(4)
  })

  it("keeps tailoring decisions inside the preview", () => {
    const accept = screen.getByRole("button", { name: "Accept" })
    const reject = screen.getByRole("button", { name: "Reject" })

    fireEvent.click(accept)
    expect(accept).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByRole("status")).toHaveTextContent("Suggestion accepted.")

    fireEvent.click(reject)
    expect(accept).toHaveAttribute("aria-pressed", "false")
    expect(reject).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByRole("status")).toHaveTextContent("Original wording kept.")
    expect(screen.getByRole("status")).toHaveTextContent("Changes apply to this preview only.")
  })
})
