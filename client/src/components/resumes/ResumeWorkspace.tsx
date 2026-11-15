"use client"

import { useState, type MouseEventHandler, type ReactNode } from "react"
import { Instrument_Serif } from "next/font/google"
import { Sidebar } from "@/components/dashboard/Sidebar"
import dashboard from "@/components/dashboard/dashboard.module.css"
import styles from "./resumes.module.css"

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-resume-serif",
})

export function ResumeWorkspace({ children, onClickCapture }: {
  children: ReactNode
  onClickCapture?: MouseEventHandler<HTMLDivElement>
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={`${dashboard.dashboard} ${styles.workspace} ${instrumentSerif.variable}`} onClickCapture={onClickCapture}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} dashboardStyle />
      <main className={styles.main}>{children}</main>
    </div>
  )
}
