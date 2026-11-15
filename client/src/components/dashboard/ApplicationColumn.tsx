import { IconPlus } from "@tabler/icons-react"
import { ApplicationCard } from "./ApplicationCard"
import type { Application, ApplicationStatus } from "./types"
import styles from "./dashboard.module.css"

export interface ColumnConfig {
  id: ApplicationStatus
  label: string
}

interface Props {
  config: ColumnConfig
  cards: Application[]
  onAddClick: () => void
  onMoveNext: (id: string) => void
  onEdit: (app: Application) => void
  onArchive: (id: string) => void
}

export function ApplicationColumn({
  config,
  cards,
  onAddClick,
  onMoveNext,
  onEdit,
  onArchive,
}: Props) {
  return (
    <section className={styles.boardColumn} aria-label={config.label}>
      <h2 className={styles.columnHeading}>
        <span className={styles.dot} data-status={config.id} aria-hidden="true" />
        {config.label}
        <span className={styles.columnCount}>{cards.length}</span>
      </h2>
      <div className={styles.columnCards}>
        {cards.map((app) => (
          <ApplicationCard
            key={app.id}
            app={app}
            onMoveNext={onMoveNext}
            onEdit={onEdit}
            onArchive={onArchive}
          />
        ))}
      </div>

      {/* Add role button */}
      <button
        onClick={onAddClick}
        className={styles.columnAdd}
        aria-label={`Add application to ${config.label}`}
      >
        <IconPlus size={11} />
        Add role
      </button>
    </section>
  )
}