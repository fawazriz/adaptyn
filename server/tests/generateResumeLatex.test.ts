import { generateResumeLatex } from "../src/lib/latex/generateResumeLatex";

const fixture: Parameters<typeof generateResumeLatex>[0] = {
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

it("converts multiple bold spans in experience and project bullets", () => {
  const latex = generateResumeLatex(fixture);

  expect(latex).toContain(String.raw`\resumeItem{Developed a \textbf{Typer CLI} with \textbf{YAML/TOML} configuration support.}`);
  expect(latex).toContain(String.raw`\resumeItem{Supported \textbf{C\# \& \$100\_000 \{x\} 50\% \textasciitilde{} \textasciicircum{} C:\textbackslash{}tools}.}`);
});

it("renders pasted LaTeX and unmatched bold markers as ordinary text", () => {
  const latex = generateResumeLatex({
    ...fixture,
    experience: [{ ...fixture.experience[0], bullets: [
      String.raw`Avoid \input{secret} and **unfinished formatting.`,
      String.raw`Keep **\input{secret}** inert even when bold.`,
    ] }],
  });

  expect(latex).toContain(String.raw`\resumeItem{Avoid \textbackslash{}input\{secret\} and **unfinished formatting.}`);
  expect(latex).toContain(String.raw`\resumeItem{Keep \textbf{\textbackslash{}input\{secret\}} inert even when bold.}`);
});

it("keeps contact labels while rejecting unsafe hyperlink destinations", () => {
  const latex = generateResumeLatex(fixture);

  expect(latex).toContain(String.raw`\href{mailto:resume%2Bpdf@example.com}{\underline{resume+pdf@example.com}}`);
  expect(latex).toContain(String.raw`\href{https://linkedin.com/in/example_resume}{\underline{linkedin.com/in/example\_resume}}`);
  expect(latex).toContain(String.raw`\href{https://example.com/?repo=100%25#resume}{\underline{example.com/?repo=100\%25\#resume}}`);

  const unsafe = generateResumeLatex({
    ...fixture,
    header: {
      ...fixture.header,
      linkedIn: String.raw`https://example.com/}\input{secret}`,
      githubOrPortfolio: "javascript:alert(1)",
    },
  });

  expect(unsafe).not.toContain(String.raw`\href{https://example.com/}`);
  expect(unsafe).not.toContain(String.raw`\href{javascript:`);
  expect(unsafe).toContain(String.raw`\underline{https://example.com/\}\textbackslash{}input\{secret\}}`);
});

it("preserves the existing section order, degree-first education, coursework, and skill categories", () => {
  const latex = generateResumeLatex(fixture);
  const sections = [...latex.matchAll(/\\section\{([^}]+)\}/g)].map((match) => match[1]);

  expect(latex).toContain(String.raw`\usepackage{pdfpages}`);
  expect(sections).toEqual(["Education", "Skills", "Experience", "Projects"]);
  expect(latex).toMatch(/\\resumeSubheading\s+\{BSc \\& Honours\}\{\}\s+\{Example University\}\{2026\}/);
  expect(latex).toContain(String.raw`\resumeItem{\textbf{Relevant Coursework}: Data Structures \& Algorithms}`);
  expect(latex).toContain(String.raw`\textbf{Languages:} TypeScript, C\#`);
  expect(latex).toContain(String.raw`\textbf{Frameworks:} React`);
  expect(latex).toContain(String.raw`\textbf{Databases:} PostgreSQL`);
  expect(latex).toContain(String.raw`\textbf{Tools:} Docker`);
  expect(latex).toContain(String.raw`\textbf{Concepts:} Distributed Systems`);
  expect(latex).toContain(String.raw`{\textbf{Example Project} $|$ \emph{TypeScript}}{}`);
});

it("renders project dates only when present and accepts headings without bullets", () => {
  const latex = generateResumeLatex({
    ...fixture,
    experience: [{ ...fixture.experience[0], bullets: [] }],
    projects: [
      { ...fixture.projects[0], projectName: "Dated Project", dates: "May 2026 -- Aug 2026", bullets: [] },
      { ...fixture.projects[0], projectName: "Undated Project", dates: " ", techStack: "", bullets: [" "] },
    ],
  });

  expect(latex).toContain(String.raw`{\textbf{Dated Project} $|$ \emph{TypeScript}}{May 2026 -- Aug 2026}`);
  expect(latex).toContain(String.raw`{\textbf{Undated Project}}{}`);
  expect(latex).toMatch(/\\resumeSubheading\s+\{Software Engineer\}\{2025 -- Present\}\s+\{Example Company\}\{Toronto\}/);
  expect(latex).not.toMatch(/\\resumeItemListStart\s*\\resumeItemListEnd/);
});

it("omits empty sections and blank categories and leaves a valid page for an empty draft", () => {
  const empty = {
    ...fixture,
    header: { fullName: "", email: "", phone: "", location: "", linkedIn: "", githubOrPortfolio: "" },
    education: [{ id: "edu", school: "", degree: "", graduationDate: "", coursework: " " }],
    experience: [{ id: "exp", role: "", company: "", dates: "", bullets: ["  "] }],
    projects: [{ id: "proj", projectName: "", techStack: "", bullets: [] }],
    skills: { languages: [" "], frameworks: [], databases: [], tools: [] },
  };
  const latex = generateResumeLatex(empty);
  expect(latex).not.toMatch(/\\section\{/);
  expect(latex).toMatch(/\\begin\{document\}\s+\\null\s+\\end\{document\}/);

  const sparse = generateResumeLatex({ ...empty, skills: { ...empty.skills, tools: ["Docker"] } });
  expect(sparse).toContain(String.raw`\section{Skills}`);
  expect(sparse).toMatch(/\\textbf\{Tools:\} Docker\n\}\}/);
  expect(sparse).not.toContain(String.raw`\textbf{Languages:}`);
});
