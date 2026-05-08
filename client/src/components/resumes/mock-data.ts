import type { ResumeVersion } from "@/components/resumes/types"

export const mockResumes: ResumeVersion[] = [
  {
    id: "resume-1",
    name: "Software Intern Resume",
    version: "v1.2",
    targetRole: "Software Engineer Intern",
    status: "active",
    updatedAt: "May 2, 2026",
    applicationsCount: 14,
    notes:
      "Updated projects section and moved backend internship to highlight API experience.",
    versionHistory: [
      {
        id: "h-1",
        version: "v1.2",
        updatedAt: "May 2, 2026",
        summary: "Refined project bullet points for distributed systems roles.",
      },
      {
        id: "h-2",
        version: "v1.1",
        updatedAt: "Apr 18, 2026",
        summary: "Added metrics for internship accomplishments.",
      },
    ],
    linkedApplications: [
      {
        id: "a-1",
        company: "Stripe",
        role: "Software Engineer Intern",
        stage: "Interview",
        appliedAt: "Apr 20, 2026",
      },
      {
        id: "a-2",
        company: "Figma",
        role: "Backend Intern",
        stage: "Applied",
        appliedAt: "Apr 24, 2026",
      },
    ],
  },
  {
    id: "resume-2",
    name: "Fullstack Resume",
    version: "v2.0",
    targetRole: "Fullstack Developer",
    status: "active",
    updatedAt: "Apr 29, 2026",
    applicationsCount: 9,
    notes:
      "More balanced frontend/backend bullets and shorter objective statement.",
    versionHistory: [
      {
        id: "h-3",
        version: "v2.0",
        updatedAt: "Apr 29, 2026",
        summary: "Introduced new architecture case study section.",
      },
      {
        id: "h-4",
        version: "v1.7",
        updatedAt: "Apr 11, 2026",
        summary: "Reordered experience entries by relevance.",
      },
    ],
    linkedApplications: [
      {
        id: "a-3",
        company: "Notion",
        role: "Fullstack Engineer",
        stage: "Phone screen",
        appliedAt: "Apr 23, 2026",
      },
    ],
  },
  {
    id: "resume-3",
    name: "Data-Focused Resume",
    version: "v0.9",
    targetRole: "Data Analyst Intern",
    status: "draft",
    updatedAt: "May 5, 2026",
    applicationsCount: 0,
    notes: "Still polishing SQL and dashboard project bullets before using.",
    versionHistory: [
      {
        id: "h-5",
        version: "v0.9",
        updatedAt: "May 5, 2026",
        summary: "Drafted skills matrix and analytics project summaries.",
      },
    ],
    linkedApplications: [],
  },
  {
    id: "resume-4",
    name: "Legacy Resume",
    version: "v1.0",
    targetRole: "General SWE",
    status: "archived",
    updatedAt: "Mar 30, 2026",
    applicationsCount: 5,
    notes: "Archived after switching to role-specific resume variants.",
    versionHistory: [
      {
        id: "h-6",
        version: "v1.0",
        updatedAt: "Mar 30, 2026",
        summary: "Final archived snapshot for historical reference.",
      },
    ],
    linkedApplications: [
      {
        id: "a-4",
        company: "Atlassian",
        role: "Software Engineer Intern",
        stage: "Rejected",
        appliedAt: "Mar 2, 2026",
      },
    ],
  },
]