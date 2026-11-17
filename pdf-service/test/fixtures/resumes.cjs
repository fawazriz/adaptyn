const full = {
  id: "audit",
  header: {
    fullName: "Template Fixture",
    email: "resume+pdf@example.com",
    phone: "555-555-0100",
    location: "",
    linkedIn: "linkedin.com/in/example_resume",
    githubOrPortfolio: "https://example.com/?repo=100%25#resume",
  },
  education: [{ id: "edu", degree: "BSc & Honours", school: "Example University", graduationDate: "2026", coursework: "Data Structures & Algorithms" }],
  skills: {
    languages: ["TypeScript", "C#"],
    frameworks: ["React"],
    databases: ["PostgreSQL"],
    tools: ["Docker"],
    concepts: ["Distributed Systems"],
  },
  experience: [{
    id: "exp",
    role: "Software Engineer",
    company: "Example Company",
    location: "Toronto",
    dates: "2025 -- Present",
    bullets: ["Developed a **Typer CLI** with **YAML/TOML** configuration support."],
  }],
  projects: [{
    id: "proj",
    projectName: "Example Project",
    techStack: "TypeScript",
    bullets: [String.raw`Supported **C# & $100_000 {x} 50% ~ ^ C:\tools**.`],
  }],
};

const empty = {
  ...full,
  header: { fullName: "", email: "", phone: "", location: "", linkedIn: "", githubOrPortfolio: "" },
  education: [{ id: "edu", school: "", degree: "", graduationDate: "", coursework: " " }],
  experience: [{ id: "exp", role: "", company: "", dates: "", bullets: ["  "] }],
  projects: [{ id: "proj", projectName: "", techStack: "", bullets: [] }],
  skills: { languages: [" "], frameworks: [], databases: [], tools: [] },
};
const sparse = {
  ...empty,
  header: {
    ...empty.header,
    githubOrPortfolio: "javascript:alert(1)",
  },
  skills: { tools: ["Docker"] },
  projects: [
    { projectName: "Dated Project", techStack: "TypeScript", dates: " May 2026 -- Aug 2026 ", bullets: [] },
  ],
};

module.exports = { full, empty, sparse };
