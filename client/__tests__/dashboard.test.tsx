import "@testing-library/jest-dom"
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import DashboardPage from "../src/app/dashboard/page"

jest.mock("next/navigation", () => ({ usePathname: () => "/dashboard" }))

const fetchMock = jest.fn()
const originalFetch = globalThis.fetch

beforeEach(() => {
  globalThis.fetch = fetchMock
  window.history.replaceState(null, "", "/dashboard")
})

afterAll(() => {
  globalThis.fetch = originalFetch
})

const createRecord = (id: string, company: string, status: string, created_at: string) => ({
  id,
  company,
  status,
  role: "Software Engineer",
  created_at,
  applied_date: null,
})

function respond(applications: object[]) {
  fetchMock.mockImplementation((url) => Promise.resolve({
    ok: true,
    json: async () => String(url).endsWith("/profiles")
      ? { full_name: "Test User", email: "test@example.com" }
      : applications,
  }))
}

it("summarizes API records, opens the existing application form, and keeps the board accessible", async () => {
  respond([
    createRecord("older", "Acme", "phone_screen", "2026-10-01T00:00:00Z"),
    createRecord("newer", "Example Corp", "interview", "2026-10-04T00:00:00Z"),
    createRecord("closed", "Northstar", "rejected", "2026-10-02T00:00:00Z"),
  ])
  render(<DashboardPage />)

  const recent = screen.getByRole("region", { name: "Recent applications" })
  const table = await within(recent).findByRole("table")
  expect(within(table).getAllByRole("rowheader").map((cell) => cell.textContent))
    .toEqual(["Example CorpSoftware Engineer", "NorthstarSoftware Engineer", "AcmeSoftware Engineer"])
  expect(screen.getByText("In progress").nextElementSibling).toHaveTextContent("2")
  expect(screen.getByText("Total applications").nextElementSibling).toHaveTextContent("3")
  expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/api\/applications$/), expect.objectContaining({ credentials: "include" }))
  expect(screen.getByText("Scheduling is unavailable.")).toBeVisible()

  const attention = screen.getByRole("region", { name: "Needs attention" })
  fireEvent.click(within(attention).getByRole("button", { name: /Prepare for interview at Example Corp/ }))
  const dialog = screen.getByRole("dialog", { name: "Edit application" })
  expect(within(dialog).getByLabelText(/Company/)).toHaveValue("Example Corp")
  expect(within(dialog).getByLabelText(/Date applied/)).toHaveValue("")
  fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }))

  expect(within(recent).getByRole("link", { name: /View all applications/ })).toHaveAttribute("href", "#applications")
  window.history.replaceState(null, "", "/dashboard#applications")
  fireEvent(window, new Event("hashchange"))
  expect(screen.getByRole("region", { name: "Application board" })).toBeVisible()
  expect(fetchMock.mock.calls.filter(([url]) => String(url).endsWith("/applications"))).toHaveLength(1)
})

it("keeps unavailable counts separate from zero and retries a failed request", async () => {
  fetchMock.mockImplementation((url) => Promise.resolve({
    ok: !String(url).endsWith("/applications"),
    json: async () => ({ full_name: "Test User" }),
  }))
  render(<DashboardPage />)

  expect(await screen.findByRole("alert")).toHaveTextContent("Couldn’t load your applications")
  expect(screen.getByText("Total applications").nextElementSibling).toHaveTextContent("—")
  expect(screen.queryByText("No applications yet.")).toBeNull()

  respond([])
  fireEvent.click(screen.getByRole("button", { name: "Retry" }))
  expect(await screen.findByText("No applications yet.")).toBeVisible()
  expect(screen.getByText("Total applications").nextElementSibling).toHaveTextContent("0")
})

it("updates totals only after the authenticated creation request succeeds", async () => {
  respond([])
  render(<DashboardPage />)
  fireEvent.click(await screen.findByRole("button", { name: "Add your first application" }))
  const dialog = screen.getByRole("dialog", { name: "Add application" })
  fireEvent.change(within(dialog).getByLabelText(/Company/), { target: { value: "Example Corp" } })
  fireEvent.change(within(dialog).getByLabelText(/Job title/), { target: { value: "Software Engineer" } })

  fetchMock.mockResolvedValueOnce({ ok: false })
  fireEvent.click(within(dialog).getByRole("button", { name: "Add application" }))
  expect(await within(dialog).findByRole("alert")).toHaveTextContent("Couldn’t add this application")
  expect(screen.getByText("Total applications").nextElementSibling).toHaveTextContent("0")

  fetchMock.mockResolvedValueOnce({
    ok: true,
    json: async () => createRecord("created", "Example Corp", "applied", "2026-10-05T00:00:00Z"),
  })
  fireEvent.click(within(dialog).getByRole("button", { name: "Add application" }))
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  expect(screen.getByText("Total applications").nextElementSibling).toHaveTextContent("1")
  expect(screen.getByRole("rowheader", { name: /Example Corp/ })).toBeInTheDocument()
  expect(fetchMock).toHaveBeenLastCalledWith(expect.stringMatching(/\/api\/applications$/), expect.objectContaining({
    credentials: "include",
    method: "POST",
  }))
})

it("filters the applications list and reflects an edit in the Kanban view", async () => {
  const application = {
    ...createRecord("first", "Acme", "saved", "2026-11-04T00:00:00Z"),
    location: "Toronto",
    applied_date: "2026-11-04",
  }
  respond([application, createRecord("second", "Northstar", "interview", "2026-11-05T00:00:00Z")])
  window.history.replaceState(null, "", "/dashboard#applications")
  render(<DashboardPage />)

  const board = await screen.findByRole("region", { name: "Application board" })
  expect(within(board).getByRole("region", { name: "Saved" })).toHaveTextContent("Acme")

  fireEvent.click(screen.getByRole("button", { name: "List" }))
  const list = screen.getByRole("region", { name: "Applications list" })
  const search = screen.getByRole("searchbox", { name: "Search applications" })
  fireEvent.change(search, { target: { value: "toronto" } })
  expect(within(list).getByText("Toronto")).toBeVisible()
  expect(within(list).getByText("Nov 4, 2026")).toBeVisible()
  expect(within(list).queryByText("Northstar")).toBeNull()

  fireEvent.change(screen.getByRole("combobox", { name: "Stage" }), { target: { value: "interview" } })
  expect(within(list).getByText("No applications match your filters.")).toBeVisible()
  fireEvent.change(screen.getByRole("combobox", { name: "Stage" }), { target: { value: "saved" } })
  fireEvent.click(within(list).getByRole("button", { name: /Edit Software Engineer at Acme/ }))

  const dialog = screen.getByRole("dialog", { name: "Edit application" })
  fireEvent.change(within(dialog).getByLabelText(/Status/), { target: { value: "applied" } })
  fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ ...application, status: "applied" }) })
  fireEvent.click(within(dialog).getByRole("button", { name: "Save changes" }))
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())

  fireEvent.click(screen.getByRole("button", { name: "Kanban" }))
  const updatedBoard = screen.getByRole("region", { name: "Application board" })
  expect(within(updatedBoard).getByRole("region", { name: "Applied" })).toHaveTextContent("Acme")
  expect(fetchMock.mock.calls.filter(([url]) => String(url).endsWith("/applications"))).toHaveLength(1)
})
