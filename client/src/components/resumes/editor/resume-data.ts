import type { ResumeData } from "./types"

export const resumeTemplate = { id: "jake", name: "Classic (Jake’s Resume)" }

export function blankResume(id = ""): ResumeData {
  return {
    id,
    header: { fullName: "", email: "", phone: "", location: "", linkedIn: "", githubOrPortfolio: "" },
    education: [],
    experience: [],
    projects: [],
    skills: { languages: [], frameworks: [], tools: [], databases: [] },
  }
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
}

function strings(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []
}

function string(value: unknown) {
  return typeof value === "string" ? value : ""
}

function entries(value: unknown) {
  return Array.isArray(value) ? value.map(record) : []
}

export function readResume(content: unknown, id: string): ResumeData {
  const source = record(content)
  const header = record(source.header)
  const skills = record(source.skills)

  return {
    ...source,
    id,
    header: {
      ...header,
      fullName: string(header.fullName),
      email: string(header.email),
      phone: string(header.phone),
      location: string(header.location),
      linkedIn: string(header.linkedIn),
      githubOrPortfolio: string(header.githubOrPortfolio),
    },
    education: entries(source.education).map((entry, index) => ({
      ...entry,
      id: string(entry.id) || `education-${index}`,
      school: string(entry.school),
      degree: string(entry.degree),
      location: string(entry.location),
      graduationDate: string(entry.graduationDate),
      gpa: string(entry.gpa),
      coursework: string(entry.coursework),
    })),
    experience: entries(source.experience).map((entry, index) => ({
      ...entry,
      id: string(entry.id) || `experience-${index}`,
      company: string(entry.company),
      role: string(entry.role),
      dates: string(entry.dates),
      location: string(entry.location),
      bullets: strings(entry.bullets),
    })),
    projects: entries(source.projects).map((entry, index) => ({
      ...entry,
      id: string(entry.id) || `project-${index}`,
      projectName: string(entry.projectName),
      techStack: string(entry.techStack),
      dates: string(entry.dates),
      link: string(entry.link),
      bullets: strings(entry.bullets),
    })),
    skills: {
      ...skills,
      languages: strings(skills.languages),
      frameworks: strings(skills.frameworks),
      tools: strings(skills.tools),
      databases: strings(skills.databases),
      concepts: strings(skills.concepts),
    },
  }
}

function isWebLink(value: string) {
  if (!value.trim()) return true
  if (/[{}\\\s]/.test(value.trim())) return false
  try {
    const link = new URL(value.includes("://") ? value : `https://${value}`)
    return ["http:", "https:"].includes(link.protocol) && link.hostname.includes(".")
  } catch {
    return false
  }
}

const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]

function monthAndYear(value: string) {
  const [month, year] = value.trim().toLowerCase().split(/\s+/)
  const index = months.indexOf(month.slice(0, 3))
  if (index < 0 || !/^\d{4}$/.test(year ?? "")) return
  return Number(year) * 12 + index
}

export function resumeFieldErrors(resume: ResumeData): Record<string, string> {
  const errors: Record<string, string> = {}
  const { email, linkedIn, githubOrPortfolio } = resume.header
  if (email.trim() && !/^[^\s@{}\\]+@[^\s@{}\\]+\.[^\s@{}\\]+$/.test(email.trim())) {
    errors.email = "Enter a valid email address."
  }
  if (!isWebLink(linkedIn)) errors.linkedIn = "Enter a valid LinkedIn link."
  if (!isWebLink(githubOrPortfolio)) errors.githubOrPortfolio = "Enter a valid website link."
  for (const entry of resume.experience) {
    const range = entry.dates.split(/\s+-\s*|[–—]/)
    if (range.length !== 2) continue
    const [start, end] = range
    const from = monthAndYear(start)
    const to = monthAndYear(end)
    const key = `exp_${entry.id}_dates`
    if (!start.trim() || !end.trim()) errors[key] = "Enter both dates or use Present as the end date."
    else if (from !== undefined && to !== undefined && to < from) errors[key] = "The end date must be on or after the start date."
  }
  for (const project of resume.projects) {
    if (project.link && !isWebLink(project.link)) errors[`proj_${project.id}_link`] = "Enter a valid project link."
  }
  return errors
}

export function resumeDate(value?: string) {
  if (!value) return "—"
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date)
}

export function resumeForSubmission(resume: ResumeData): ResumeData {
  const skills = { ...resume.skills }
  for (const category of ["languages", "frameworks", "tools", "databases", "concepts"] as const) {
    skills[category] = (skills[category] ?? []).map((skill) => skill.trim()).filter(Boolean)
  }
  return { ...resume, skills }
}

export function prepareResumePdf(resume: ResumeData) {
  const content = resumeForSubmission(resume)
  const errors = resumeFieldErrors(content)
  const experience = content.experience
    .map((entry) => ({ ...entry, bullets: entry.bullets.map((bullet) => bullet.trim()).filter(Boolean) }))
    .filter(({ company, role, dates, location, bullets }) => company.trim() || role.trim() || dates.trim() || location.trim() || bullets.length)
  const projects = content.projects
    .map((entry) => ({ ...entry, bullets: entry.bullets.map((bullet) => bullet.trim()).filter(Boolean) }))
    .filter(({ projectName, techStack, dates, link, bullets }) => projectName.trim() || techStack.trim() || dates?.trim() || link?.trim() || bullets.length)

  const skills = Object.fromEntries(Object.entries(content.skills).filter(([, values]) =>
    Array.isArray(values) ? values.length > 0 : Boolean(values),
  ))

  return {
    errors,
    content: {
      ...content,
      experience,
      projects,
      education: content.education.filter(({ school, degree, location, graduationDate, gpa, coursework }) =>
        school.trim() || degree.trim() || location?.trim() || graduationDate.trim() || gpa?.trim() || coursework?.trim(),
      ),
      skills: Object.keys(skills).length ? skills : undefined,
    },
  }
}
