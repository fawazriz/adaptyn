import type { ResumeData } from "@/components/resumes/editor/types"

export const sampleResume: ResumeData = {
  id: "resume_editor_sample_cs",
  header: {
    fullName: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    linkedIn: "linkedin.com/in/alexjohnson",
    githubOrPortfolio: "github.com/alexjohnson",
  },
  education: [
    {
      id: "edu_1",
      school: "Carnegie Mellon University",
      degree: "B.S. Computer Science",
      graduationDate: "May 2025",
      gpa: "3.8",
    },
  ],
  experience: [
    {
      id: "exp_1",
      company: "TechNova",
      role: "Software Engineer Intern",
      dates: "Jun 2024 - Aug 2024",
      location: "Remote",
      bullets: [
        "Developed features in a TypeScript services codebase with focus on reliability and maintainability.",
        "Collaborated with teammates on code reviews, testing improvements, and incremental performance tuning.",
        "Implemented integrations that improved internal workflows and reduced manual steps for the team.",
      ],
    },
  ],
  projects: [
    {
      id: "proj_1",
      projectName: "Resume Builder",
      techStack: "Next.js, TypeScript, Tailwind",
      link: "github.com/alexjohnson/resume-builder",
      bullets: [
        "Designed a multi-step resume creation flow with structured inputs for consistent outputs.",
        "Built a template system to generate different resume layouts from shared field definitions.",
        "Added validation and usability improvements to support faster iteration.",
      ],
    },
    {
      id: "proj_2",
      projectName: "Campus Study Planner",
      techStack: "React, Node.js, PostgreSQL",
      link: "github.com/alexjohnson/study-planner",
      bullets: [
        "Created an interactive scheduling UI for planning study sessions and tracking progress.",
        "Implemented backend endpoints and data models for storing plans and session history.",
        "Improved query performance through targeted indexing and query refactors.",
      ],
    },
  ],
  skills: {
    languages: ["TypeScript", "Java", "Python"],
    frameworks: ["React", "Next.js"],
    tools: ["Git", "Testing", "REST APIs"],
    databases: ["PostgreSQL", "SQL"],
  },
}

