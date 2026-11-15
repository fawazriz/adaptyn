import { useState } from "react"
import { IconSearch } from "@tabler/icons-react"
import type { ColumnConfig } from "./ApplicationColumn"
import type { Application, ApplicationStatus } from "./types"
import styles from "./dashboard.module.css"

const suggestions: Partial<Record<ApplicationStatus, string>> = {
  saved: "Review job posting",
  phone_screen: "Prepare for phone screen",
  interview: "Prepare for interview",
  offer: "Review offer",
}

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" })

function AppliedDate({ value }: { value: string }) {
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return "—"
  return <time dateTime={value}>{dateFormatter.format(date)}</time>
}

type Props = {
  applications: Application[]
  stages: ColumnConfig[]
  onReview: (application: Application) => void
}

export function ApplicationList({ applications, stages, onReview }: Props) {
  const [query, setQuery] = useState("")
  const [stage, setStage] = useState("")
  const search = query.trim().toLowerCase()
  const results = applications.filter((app) =>
    (!stage || app.status === stage) &&
    [app.role, app.company, app.location].some((value) => value?.toLowerCase().includes(search)),
  )

  return (
    <>
      <div className={styles.listFilters}>
        <label className={styles.listSearch}>
          <span className={styles.srOnly}>Search applications</span>
          <IconSearch size={17} aria-hidden="true" />
          <input type="search" placeholder="Search role, company, or location" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <label className={styles.stageFilter}>
          <span>Stage</span>
          <select value={stage} onChange={(event) => setStage(event.target.value)}>
            <option value="">All stages</option>
            {stages.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
          </select>
        </label>
      </div>
      <div className={`${styles.tableScroll} ${styles.applicationsTable}`} role="region" aria-label="Applications list" tabIndex={0}>
        <table>
          <thead>
            <tr>
              <th scope="col">Role</th>
              <th scope="col">Company</th>
              <th scope="col">Location</th>
              <th scope="col">Stage</th>
              <th scope="col">Applied</th>
              <th scope="col">Suggested next action</th>
            </tr>
          </thead>
          <tbody>
            {results.map((app) => (
              <tr key={app.id}>
                <th scope="row">
                  <button type="button" className={styles.listRole} onClick={() => onReview(app)} aria-label={`Edit ${app.role} at ${app.company}`}>
                    {app.role}
                  </button>
                </th>
                <td>{app.company}</td>
                <td>{app.location || "—"}</td>
                <td>
                  <span className={styles.status}>
                    <span className={styles.dot} data-status={app.status} aria-hidden="true" />
                    {stages.find(({ id }) => id === app.status)?.label ?? "Unknown"}
                  </span>
                </td>
                <td><AppliedDate value={app.dateApplied} /></td>
                <td>{suggestions[app.status] ?? "—"}</td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr><td colSpan={6}>{applications.length ? "No applications match your filters." : "No applications yet."}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
