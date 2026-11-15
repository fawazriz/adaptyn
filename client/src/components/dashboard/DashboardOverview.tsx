import { IconArrowRight, IconCalendar, IconPlus } from "@tabler/icons-react"
import Link from "next/link"
import type { Application, ApplicationStatus } from "./types"
import styles from "./dashboard.module.css"

const pipeline: { status: ApplicationStatus; label: string; active?: boolean }[] = [
  { status: "saved", label: "Saved", active: true },
  { status: "applied", label: "Applied", active: true },
  { status: "phone_screen", label: "Phone screen", active: true },
  { status: "interview", label: "Interview", active: true },
  { status: "offer", label: "Offer" },
  { status: "rejected", label: "Rejected" },
]

const reviewActions: Partial<Record<ApplicationStatus, string>> = {
  offer: "Review offer",
  interview: "Prepare for interview",
  phone_screen: "Prepare for phone screen",
}
const priority: ApplicationStatus[] = ["offer", "interview", "phone_screen"]
const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" })

function timestamp(date?: string) {
  const value = date ? Date.parse(date) : NaN
  return Number.isFinite(value) ? value : -Infinity
}

function ApplicationDate({ application }: { application: Application }) {
  const date = application.updatedAt || application.createdAt
  if (!date || timestamp(date) === -Infinity) return <span className={styles.muted}>Unavailable</span>
  return <time dateTime={date}>{dateFormatter.format(new Date(date))}</time>
}

function Status({ status }: { status: ApplicationStatus }) {
  return (
    <span className={styles.status}>
      <span className={styles.dot} data-status={status} aria-hidden="true" />
      {pipeline.find((stage) => stage.status === status)?.label ?? "Unknown"}
    </span>
  )
}

type OverviewProps = {
  applications: Application[]
  state: "loading" | "ready" | "error"
  onAdd: () => void
  onReview: (application: Application) => void
  onRetry: () => void
}

export function DashboardOverview({ applications, state, onAdd, onReview, onRetry }: OverviewProps) {
  const counts = new Map<ApplicationStatus, number>()
  for (const { status } of applications) counts.set(status, (counts.get(status) ?? 0) + 1)
  const metrics = [
    { title: "Total applications", count: applications.length },
    { title: "In progress", count: pipeline.reduce((sum, stage) => sum + (stage.active ? counts.get(stage.status) ?? 0 : 0), 0) },
    { title: "Interviews", count: counts.get("interview") ?? 0, note: "Applications in Interview" },
    { title: "Offers", count: counts.get("offer") ?? 0 },
  ]
  const sorted = [...applications].sort((a, b) => {
    const first = timestamp(a.updatedAt || a.createdAt)
    const second = timestamp(b.updatedAt || b.createdAt)
    return first === second ? 0 : second - first
  })
  const attention = priority.flatMap((status) => sorted.filter((app) => app.status === status))
  const ready = state === "ready"

  return (
    <main id="overview" className={styles.surface}>
      <div className={styles.content}>
        <header className={styles.heading}>
          <div>
            <h1>Overview</h1>
            <p>Your applications, deadlines, and next steps.</p>
          </div>
          <div className={styles.headerActions}>
            <Link href="/dashboard/resumes" className={styles.textLink}>Manage resumes</Link>
            <button type="button" className={styles.primary} onClick={onAdd} disabled={!ready}>
              <IconPlus size={17} aria-hidden="true" /> Add application
            </button>
          </div>
        </header>

        {state === "loading" && <p className={styles.srOnly} role="status">Loading applications…</p>}
        {state === "error" && (
          <div className={styles.notice}>
            <p role="alert">Couldn’t load your applications.</p>
            <button type="button" className={styles.textLink} onClick={onRetry}>Retry</button>
          </div>
        )}

        <dl className={styles.metrics} aria-label="Application statistics" aria-busy={state === "loading"}>
          {metrics.map(({ title, count, note }) => (
            <div key={title}>
              <dt>{title}</dt>
              <dd className={styles.metricNumber}>{ready ? count : "—"}</dd>
              {note && <dd className={styles.metricNote}>{note}</dd>}
            </div>
          ))}
        </dl>

        <div className={styles.workspace}>
          <section className={`${styles.panel} ${styles.attention}`} aria-labelledby="attention-heading">
            <header className={styles.panelHeader}>
              <h2 id="attention-heading">Needs attention</h2>
              <p>Suggested next steps based on your application stages.</p>
            </header>
            {ready && attention.length > 0 ? (
              <ul role="list" className={styles.attentionList}>
                {attention.slice(0, 4).map((app) => (
                  <li key={app.id}>
                    <div><strong>{app.company}</strong><p>{app.role}</p></div>
                    <button type="button" className={styles.textLink} onClick={() => onReview(app)} aria-label={`${reviewActions[app.status]} at ${app.company} for ${app.role}`}>
                      {reviewActions[app.status]} <IconArrowRight size={15} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.empty}>
                {ready ? "No applications in Screening, Interview, or Offer." : state === "loading" ? "Loading applications…" : "Application data unavailable."}
              </p>
            )}
          </section>

          <section className={`${styles.panel} ${styles.pipeline}`} aria-labelledby="pipeline-heading">
            <header className={styles.panelHeader}><h2 id="pipeline-heading">Application pipeline</h2></header>
            <dl className={styles.pipelineList}>
              {pipeline.map(({ status }) => (
                <div key={status}>
                  <dt><Status status={status} /></dt>
                  <dd>{ready ? counts.get(status) ?? 0 : "—"}</dd>
                </div>
              ))}
            </dl>
            <div className={styles.panelFooter}>
              <a href="#applications" className={styles.textLink}>View all applications <IconArrowRight size={15} aria-hidden="true" /></a>
            </div>
          </section>

          <section className={`${styles.panel} ${styles.upcoming}`} aria-labelledby="upcoming-heading">
            <header className={styles.panelHeader}><h2 id="upcoming-heading">Coming up</h2></header>
            <div className={styles.schedule}>
              <IconCalendar size={19} aria-hidden="true" />
              <div>
                <strong>Scheduling is unavailable.</strong>
                <p>Check individual application notes for dates you’ve recorded.</p>
              </div>
            </div>
          </section>
        </div>

        <section className={styles.panel} aria-labelledby="recent-heading">
          <header className={`${styles.panelHeader} ${styles.recentHeader}`}>
            <h2 id="recent-heading">Recent applications</h2>
            <a href="#applications" className={styles.textLink}>View all applications <IconArrowRight size={15} aria-hidden="true" /></a>
          </header>
          {ready && sorted.length > 0 ? (
            <div className={styles.tableScroll} tabIndex={0} role="region" aria-labelledby="recent-heading">
              <table>
                <thead><tr><th scope="col">Company / role</th><th scope="col">Status</th><th scope="col">Latest recorded date</th><th scope="col">Next action</th></tr></thead>
                <tbody>
                  {sorted.slice(0, 5).map((app) => (
                    <tr key={app.id}>
                      <th scope="row"><strong>{app.company}</strong><span>{app.role}</span></th>
                      <td><Status status={app.status} /></td>
                      <td><ApplicationDate application={app} /><span>{app.updatedAt ? "Updated" : app.createdAt ? "Added" : ""}</span></td>
                      <td><button type="button" className={styles.textLink} onClick={() => onReview(app)} aria-label={`${reviewActions[app.status] ?? "Review application"} at ${app.company} for ${app.role}`}>{reviewActions[app.status] ?? "Review application"}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : ready ? (
            <div className={styles.empty}>
              <h3>No applications yet.</h3>
              <p>Add a job you’ve applied to or want to keep track of.</p>
              <button type="button" className={styles.primary} onClick={onAdd}><IconPlus size={16} aria-hidden="true" /> Add your first application</button>
            </div>
          ) : (
            <p className={styles.empty}>{state === "loading" ? "Loading applications…" : "Application data unavailable."}</p>
          )}
        </section>
      </div>
    </main>
  )
}
