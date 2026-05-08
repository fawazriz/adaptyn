export interface EducationItem {
  id: string
  school: string
  degree: string
  graduationDate: string
  gpa?: string
}

export interface ExperienceItem {
  id: string
  company: string
  role: string
  dates: string
  location: string
  bullets: string[]
}

export interface ProjectItem {
  id: string
  projectName: string
  techStack: string
  link?: string
  bullets: string[]
}

export interface Skills {
  languages: string[]
  frameworks: string[]
  tools: string[]
  databases: string[]
}

export interface ResumeHeader {
  fullName: string
  email: string
  phone: string
  location: string
  linkedIn: string
  githubOrPortfolio: string
}

export interface ResumeData {
  id: string
  header: ResumeHeader
  education: EducationItem[]
  experience: ExperienceItem[]
  projects: ProjectItem[]
  skills: Skills
}

