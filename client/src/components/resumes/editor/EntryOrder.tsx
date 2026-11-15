import { IconArrowDown, IconArrowUp } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export function EntryOrder<T>({ entries, index, label, onChange }: {
  entries: T[]
  index: number
  label: string
  onChange: (entries: T[]) => void
}) {
  function move(offset: number) {
    const next = [...entries]
    const target = index + offset
    const entry = next[index]
    next[index] = next[target]
    next[target] = entry
    onChange(next)
  }

  return (
    <>
      <Button type="button" size="icon" variant="ghost" aria-label={`Move ${label} up`} disabled={index === 0} onClick={() => move(-1)}>
        <IconArrowUp size={16} aria-hidden="true" />
      </Button>
      <Button type="button" size="icon" variant="ghost" aria-label={`Move ${label} down`} disabled={index === entries.length - 1} onClick={() => move(1)}>
        <IconArrowDown size={16} aria-hidden="true" />
      </Button>
    </>
  )
}
