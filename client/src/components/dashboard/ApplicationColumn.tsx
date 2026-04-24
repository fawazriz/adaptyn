import { IconPlus } from "@tabler/icons-react"
import { ApplicationCard } from "./ApplicationCard"
import type { Application, ApplicationStatus } from "./types"

export interface ColumnConfig {
  id: ApplicationStatus
  label: string
  dotColor: string
  labelColor: string
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
    <div className="flex flex-col w-64 shrink-0 h-full min-h-0">
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 shrink-0 px-0.5">
        <div className={`w-2 h-2 rounded-full shrink-0 ${config.dotColor}`} />
        <span className={`text-xs font-semibold ${config.labelColor}`}>
          {config.label}
        </span>
        <span className="ml-auto text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5 tabular-nums min-w-[20px] text-center">
          {cards.length}
        </span>
      </div>

      {/* Scrollable cards area */}
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 pr-0.5">
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
        className="mt-2 shrink-0 w-full border border-dashed border-border rounded-lg py-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-muted/40 transition-all"
      >
        <IconPlus size={11} />
        Add role
      </button>
    </div>
  )
}