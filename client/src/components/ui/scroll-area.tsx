import * as React from "react"

import { cn } from "@/lib/utils"

type ScrollAreaProps = {
  className?: string
  children: React.ReactNode
  orientation?: "horizontal" | "vertical"
}

// Simple shadcn-style ScrollArea fallback.
// For now we rely on native overflow; can be swapped to Radix ScrollArea later.
function ScrollArea({ className, children }: ScrollAreaProps) {
  return (
    <div
      data-slot="scroll-area"
      className={cn("relative overflow-auto", className)}
    >
      {children}
    </div>
  )
}

export { ScrollArea }

