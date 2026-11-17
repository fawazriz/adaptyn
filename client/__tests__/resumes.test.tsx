import "@testing-library/jest-dom"
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import ResumesPage from "../src/app/dashboard/resumes/page"
import { ResumeEditorShell } from "@/components/resumes/editor/ResumeEditorShell"
import { blankResume, prepareResumePdf, readResume, resumeForSubmission } from "@/components/resumes/editor/resume-data"

const mockPush = jest.fn()
jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard/resumes",
  useRouter: () => ({ push: mockPush }),
}))

const resume = {
  id: "resume-1",
  name: "Backend resume",
  content: {
    ...blankResume(),
    metadata: { notes: "Keep this note", template: "jake" },
  },
  status: "draft",
}

const originalFetch = globalThis.fetch
const fetchMock = jest.fn()
const json = (data: unknown) => ({ ok: true, json: async () => data })

beforeEach(() => { globalThis.fetch = fetchMock })
afterAll(() => { globalThis.fetch = originalFetch })

it("preserves inline bold markers through save, reopen, and PDF preparation", () => {
  const draft = blankResume("resume-bold")
  const bullet = "Developed a **Typer CLI** with **YAML/TOML**."
  draft.education.push({ id: "education", school: "Example University", degree: "BSc", location: "Guelph, ON", graduationDate: "2027", coursework: "Algorithms", gpa: "3.8" })
  draft.skills.concepts = ["Distributed Systems"]
  draft.experience.push({ id: "experience", company: "Example", role: "Developer", dates: "", location: "", bullets: [bullet] })
  draft.projects.push({ id: "project", projectName: "Example", techStack: "", dates: "May 2026", link: "https://example.com", bullets: [bullet] })

  const saved = JSON.parse(JSON.stringify(resumeForSubmission(draft)))
  const reopened = readResume(saved, draft.id)
  const prepared = prepareResumePdf(reopened)

  expect(prepared.errors).toEqual({})
  expect(prepared.content.education[0]).toEqual(draft.education[0])
  expect(prepared.content.skills?.concepts).toEqual(["Distributed Systems"])
  expect(prepared.content.experience[0].bullets).toEqual([bullet])
  expect(prepared.content.projects[0]).toEqual(draft.projects[0])
})

it("reports a library failure, then loads and filters actual records on retry", async () => {
  let available = false
  fetchMock.mockImplementation(async (url) => {
    if (String(url).endsWith("/resumes")) return available ? json([resume]) : { ok: false }
    if (String(url).endsWith("/applications")) return { ok: false }
    return json({ full_name: "Test User" })
  })

  render(<ResumesPage />)
  expect(await screen.findByRole("alert")).toHaveTextContent("Couldn’t load your resumes.")
  expect(screen.queryByRole("table")).not.toBeInTheDocument()

  available = true
  fireEvent.click(screen.getByRole("button", { name: "Retry" }))
  expect(await screen.findByRole("link", { name: resume.name })).toHaveAttribute("href", "/dashboard/resumes/resume-1")
  fireEvent.change(screen.getByRole("searchbox", { name: "Search resumes" }), { target: { value: "Frontend" } })
  expect(screen.getByText("No resumes match your search.")).toBeVisible()
  fireEvent.click(screen.getByRole("button", { name: "Clear filters" }))
  expect(screen.getByRole("link", { name: resume.name })).toBeVisible()
})

it("creates a blank draft through the existing API", async () => {
  fetchMock.mockImplementation(async (url, options) => {
    if (options?.method === "POST") return json(resume)
    if (/\/(resumes|applications)$/.test(String(url))) return json([])
    return json({ full_name: "Test User" })
  })
  render(<ResumesPage />)
  fireEvent.click(await screen.findByRole("button", { name: "New resume" }))
  const dialog = screen.getByRole("dialog", { name: "New resume" })
  fireEvent.click(within(dialog).getByRole("button", { name: "Import a resume" }))
  expect(within(dialog).getByText("Import is unavailable.")).toBeVisible()

  fireEvent.click(within(dialog).getByRole("button", { name: "Create a resume" }))
  fireEvent.change(within(dialog).getByLabelText("Resume name"), { target: { value: "My first resume" } })
  fireEvent.click(within(dialog).getByRole("button", { name: "Create and edit" }))
  await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/dashboard/resumes/resume-1"))
  const [, request] = fetchMock.mock.calls.find(([, options]) => options?.method === "POST")!
  expect(request.credentials).toBe("include")
  expect(JSON.parse(request.body)).toMatchObject({
    name: "My first resume",
    status: "draft",
    content: { ...blankResume(), metadata: { template: "jake" } },
  })
})

it("keeps newer edits dirty during a save and preserves previously stored metadata", async () => {
  let finishSave!: (value: ReturnType<typeof json>) => void
  fetchMock.mockImplementation(async (url, options) => {
    if (options?.method === "PUT") return new Promise((resolve) => { finishSave = resolve })
    return String(url).endsWith("/resume-1") ? json(resume) : json({ full_name: "Test User" })
  })
  render(<ResumeEditorShell resumeId={resume.id} />)
  const input = await screen.findByLabelText("Full name")
  expect(input).toHaveValue("")
  expect(fetchMock.mock.calls.some(([url]) => String(url).endsWith("/compile"))).toBe(false)

  fireEvent.change(input, { target: { value: "Taylor Smith" } })
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }))
  expect(screen.getByRole("status")).toHaveTextContent("Saving")
  fireEvent.change(input, { target: { value: "Taylor Morgan" } })
  await act(async () => { finishSave(json(resume)) })
  expect(screen.getByRole("status")).toHaveTextContent("Unsaved changes")
  expect(input).toHaveValue("Taylor Morgan")
  const [, request] = fetchMock.mock.calls.find(([, options]) => options?.method === "PUT")!
  expect(JSON.parse(request.body)).toMatchObject({
    content: { header: { fullName: "Taylor Smith" }, metadata: { notes: "Keep this note", template: "jake" } },
  })
})

it("uses the authenticated PDF endpoint and reuses a generated preview for download", async () => {
  const create = jest.fn(() => "blob:pdf-preview")
  const revoke = jest.fn()
  const previousCreate = URL.createObjectURL
  const previousRevoke = URL.revokeObjectURL
  URL.createObjectURL = create
  URL.revokeObjectURL = revoke
  const click = jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {})
  fetchMock.mockImplementation(async (url) => {
    if (String(url).endsWith("/compile")) {
      return { ok: true, blob: async () => new Blob(["%PDF-1.4"], { type: "application/pdf" }) }
    }
    return String(url).endsWith("/resume-1") ? json(resume) : json({ full_name: "Test User" })
  })

  try {
    const { unmount } = render(<ResumeEditorShell resumeId={resume.id} />)
    fireEvent.click(await screen.findByRole("button", { name: "Generate preview" }))
    expect(await screen.findByTitle(`PDF preview of ${resume.name}`)).toHaveAttribute("src", "blob:pdf-preview")
    fireEvent.click(screen.getByRole("button", { name: "Download PDF" }))
    await waitFor(() => expect(click).toHaveBeenCalledTimes(1))
    const requests = fetchMock.mock.calls.filter(([url]) => String(url).endsWith("/compile"))
    expect(requests).toHaveLength(1)
    expect(requests[0][1]).toMatchObject({ method: "POST", credentials: "include" })
    unmount()
    expect(revoke).toHaveBeenCalledWith("blob:pdf-preview")
  } finally {
    click.mockRestore()
    URL.createObjectURL = previousCreate
    URL.revokeObjectURL = previousRevoke
  }
})

it("keeps a resume on failed deletion and removes it after a confirmed successful request", async () => {
  let canDelete = false
  fetchMock.mockImplementation(async (url, options) => {
    if (options?.method === "DELETE") return { ok: canDelete, status: canDelete ? 204 : 400 }
    if (String(url).endsWith("/resumes")) return json([resume])
    if (String(url).endsWith("/applications")) return json([])
    return json({ full_name: "Test User" })
  })
  render(<ResumesPage />)
  fireEvent.keyDown(await screen.findByRole("button", { name: `More actions for ${resume.name}` }), { key: "Enter" })
  fireEvent.click(await screen.findByRole("menuitem", { name: "Delete" }))
  const dialog = await screen.findByRole("dialog", { name: "Delete resume?" })
  expect(fetchMock.mock.calls.some(([, options]) => options?.method === "DELETE")).toBe(false)

  const confirm = within(dialog).getByRole("button", { name: "Delete resume" })
  fireEvent.click(confirm)
  expect(await within(dialog).findByRole("alert")).toHaveTextContent("Couldn’t delete this resume.")
  canDelete = true
  fireEvent.click(confirm)
  expect(await screen.findByText("No resumes yet.")).toBeVisible()
  expect(fetchMock).toHaveBeenLastCalledWith(expect.stringMatching(/\/api\/resumes\/resume-1$/), {
    method: "DELETE",
    credentials: "include",
  })
})
