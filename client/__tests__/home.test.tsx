import '@testing-library/jest-dom'
// render mounts React components; screen searches the rendered page; within
// limits a search to one element; fireEvent dispatches browser events.
import { fireEvent, render, screen, within } from '@testing-library/react'
import Home from '../src/app/page'

// Jest does not run a Next.js router. Tell the Navbar that the current route
// is the home page so it renders its home-page navigation.
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// JSDOM has no viewport intersection API. Keep the real sections and fade-in
// components, but leave scroll-triggered animation outside these page tests.
// Save the original property, including its settings, so we can restore it later.
const originalIntersectionObserver = Object.getOwnPropertyDescriptor(
  globalThis,
  'IntersectionObserver',
)

// Run once before this file's tests. FadeUp needs to construct an observer when
// it mounts; these no-op methods let mounting and cleanup finish without errors.
beforeAll(() => {
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    // Allow the property to be restored or deleted after the tests.
    configurable: true,
    writable: true,
    // jest.fn creates a fake function. Here it stands in for the constructor
    // and returns the observer methods used by the components.
    value: jest.fn(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    })),
  })
})

// Undo our global change after this file's tests to avoid leaking test setup.
afterAll(() => {
  if (originalIntersectionObserver) {
    // Preserve an existing implementation if the environment supplied one.
    Object.defineProperty(globalThis, 'IntersectionObserver', originalIntersectionObserver)
  } else {
    // If it did not exist originally, remove the stub entirely.
    Reflect.deleteProperty(globalThis, 'IntersectionObserver')
  }
})

describe('Home page', () => {
  // Start every test with a fresh page. Testing Library automatically unmounts
  // it after each test, which also runs component effect cleanup.
  beforeEach(() => {
    render(<Home />)
  })

  it('renders the site header, main content, and footer', () => {
    // These accessibility roles correspond to the top-level header, main, and
    // footer elements. Role queries check the page's semantic structure.
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('introduces the platform with a single primary heading', () => {
    // Collect all h1 headings so an accidental duplicate also fails this test.
    const headings = screen.getAllByRole('heading', { level: 1 })

    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent(/The job hunting platform for/)
    // The description must appear inside the main content, not just elsewhere.
    expect(within(screen.getByRole('main')).getByText(
      /Track applications on a Kanban board/,
    )).toBeInTheDocument()
  })

  it('links the header brand back to the home page', () => {
    // Scope the query to the header because the footer also displays the brand.
    const header = within(screen.getByRole('banner'))

    expect(header.getByRole('link', { name: 'Adaptyn' })).toHaveAttribute('href', '/')
  })

  // it.each runs the same test for each row, substituting the link name and URL.
  // Verify the destinations without trying to navigate JSDOM to another page.
  it.each([
    ['Log in', '/login'],
    ['Sign up', '/signup'],
  ])('links %s to %s', (name, href) => {
    const header = within(screen.getByRole('banner'))

    expect(header.getByRole('link', { name })).toHaveAttribute('href', href)
  })

  // Hash links should point to real sections, not just contain the expected URL.
  it.each([
    ['Walkthrough', '#walkthrough'],
    ['Pricing', '#versioning'],
  ])('links %s to an existing section on the page', (name, href) => {
    const header = within(screen.getByRole('banner'))
    const link = header.getByRole('link', { name })

    expect(link).toHaveAttribute('href', href)
    // Remove the leading # to look up the target section's HTML id.
    expect(document.getElementById(href.slice(1))).toBeInTheDocument()
  })

  // Check that each major section is present as an h2 inside the main content.
  it.each([
    'Most students manage job applications the same broken way.',
    'Four tools. One workflow.',
    'Iterate your resume like you ship code.',
  ])('renders the section "%s" in the main content', (name) => {
    const main = within(screen.getByRole('main'))

    expect(main.getByRole('heading', { level: 2, name })).toBeInTheDocument()
  })

  it('opens the walkthrough on the application tracker', () => {
    // Check both the selected tab and its content: a highlighted tab alone
    // would not prove that the correct walkthrough panel is displayed.
    expect(screen.getAllByRole('tab')).toHaveLength(4)
    expect(screen.getByRole('tab', { name: 'Tracker' })).toHaveAttribute('aria-selected', 'true')
    expect(within(screen.getByRole('tabpanel', { name: 'Tracker' })).getByRole('heading', {
      name: 'Every application on one board.',
    })).toBeInTheDocument()
    // queryByRole returns null when absent; getByRole would throw before the
    // negative assertion could run. Inactive headings must not be accessible.
    expect(screen.queryByRole('heading', { name: 'Click the PDF. Edit the text.' }))
      .not.toBeInTheDocument()
  })

  // Exercise each alternate tab with the real walkthrough and tab components.
  it.each([
    ['Resume Editor', 'Click the PDF. Edit the text.'],
    ['Analytics', 'Stop guessing which resume works.'],
    ['Recruiter Finder', 'Find the right person, not the apply button.'],
  ])('shows the %s walkthrough when its tab is activated', (name, heading) => {
    const tab = screen.getByRole('tab', { name })

    // The tabs support Enter to activate a tab. Dispatch that keyboard event.
    fireEvent.keyDown(tab, { key: 'Enter' })

    // Selection and panel content must change together, and the previous
    // tracker's content must no longer be exposed as the active walkthrough.
    expect(tab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Tracker' })).toHaveAttribute('aria-selected', 'false')
    expect(within(screen.getByRole('tabpanel', { name })).getByRole('heading', {
      name: heading,
    })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Every application on one board.' }))
      .not.toBeInTheDocument()
  })

  it('can return to the tracker after viewing another tool', () => {
    // A second transition catches problems that only appear after changing tabs.
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Analytics' }), { key: 'Enter' })
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Tracker' }), { key: 'Enter' })

    expect(screen.getByRole('tab', { name: 'Tracker' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Analytics' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('tabpanel', { name: 'Tracker' })).toHaveTextContent(
      'Every application on one board.',
    )
    expect(screen.queryByRole('heading', { name: 'Stop guessing which resume works.' }))
      .not.toBeInTheDocument()
  })

  it('renders the footer description and accessible social links', () => {
    // Search only the footer. Social links are found by their accessible names,
    // which come from aria-label because their visible contents are icons.
    const footer = within(screen.getByRole('contentinfo'))

    expect(footer.getByText('The job search OS for CS students and new grads.')).toBeInTheDocument()
    expect(footer.getByRole('link', { name: 'GitHub' })).toBeInTheDocument()
    expect(footer.getByRole('link', { name: 'Twitter' })).toBeInTheDocument()
    expect(footer.getByText('Free for students during beta.')).toBeInTheDocument()
  })
})
