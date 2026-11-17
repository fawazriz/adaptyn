const assert = require("node:assert/strict");
const { it } = require("node:test");
const { generateResumeLatex } = require("..");
const { full: fixture, empty, sparse } = require("./fixtures/resumes.cjs");
const expectedLatex = require("./fixtures/expected-latex.json");

// Captured from the Express generator before extraction, including whitespace.
for (const [name, resume] of Object.entries({ full: fixture, empty, sparse })) {
  it(`matches the pre-extraction output byte for byte for the ${name} fixture`, () => {
    assert.equal(generateResumeLatex(resume), expectedLatex[name].join("\n"));
  });
}

it("converts multiple bold spans in experience and project bullets", () => {
  const latex = generateResumeLatex(fixture);

  assert.ok(latex.includes(String.raw`\resumeItem{Developed a \textbf{Typer CLI} with \textbf{YAML/TOML} configuration support.}`));
  assert.ok(latex.includes(String.raw`\resumeItem{Supported \textbf{C\# \& \$100\_000 \{x\} 50\% \textasciitilde{} \textasciicircum{} C:\textbackslash{}tools}.}`));
});

it("renders pasted LaTeX and unmatched bold markers as ordinary text", () => {
  const latex = generateResumeLatex({
    ...fixture,
    experience: [{ ...fixture.experience[0], bullets: [
      String.raw`Avoid \input{secret} and **unfinished formatting.`,
      String.raw`Keep **\input{secret}** inert even when bold.`,
    ] }],
  });

  assert.ok(latex.includes(String.raw`\resumeItem{Avoid \textbackslash{}input\{secret\} and **unfinished formatting.}`));
  assert.ok(latex.includes(String.raw`\resumeItem{Keep \textbf{\textbackslash{}input\{secret\}} inert even when bold.}`));
});

it("keeps contact labels while rejecting unsafe hyperlink destinations", () => {
  const latex = generateResumeLatex(fixture);

  assert.ok(latex.includes(String.raw`\href{mailto:resume%2Bpdf@example.com}{\underline{resume+pdf@example.com}}`));
  assert.ok(latex.includes(String.raw`\href{https://linkedin.com/in/example_resume}{\underline{linkedin.com/in/example\_resume}}`));
  assert.ok(latex.includes(String.raw`\href{https://example.com/?repo=100%25#resume}{\underline{example.com/?repo=100\%25\#resume}}`));

  const unsafe = generateResumeLatex({
    ...fixture,
    header: {
      ...fixture.header,
      linkedIn: String.raw`https://example.com/}\input{secret}`,
      githubOrPortfolio: "javascript:alert(1)",
    },
  });

  assert.ok(!unsafe.includes(String.raw`\href{https://example.com/}`));
  assert.ok(!unsafe.includes(String.raw`\href{javascript:`));
  assert.ok(unsafe.includes(String.raw`\underline{https://example.com/\}\textbackslash{}input\{secret\}}`));
});

it("preserves the existing section order, degree-first education, coursework, and skill categories", () => {
  const latex = generateResumeLatex(fixture);
  const sections = [...latex.matchAll(/\\section\{([^}]+)\}/g)].map((match) => match[1]);

  assert.ok(latex.includes(String.raw`\usepackage{pdfpages}`));
  assert.deepEqual(sections, ["Education", "Skills", "Experience", "Projects"]);
  assert.match(latex, /\\resumeSubheading\s+\{BSc \\& Honours\}\{\}\s+\{Example University\}\{2026\}/);
  assert.ok(latex.includes(String.raw`\resumeItem{\textbf{Relevant Coursework}: Data Structures \& Algorithms}`));
  assert.ok(latex.includes(String.raw`\textbf{Languages:} TypeScript, C\#`));
  assert.ok(latex.includes(String.raw`\textbf{Frameworks:} React`));
  assert.ok(latex.includes(String.raw`\textbf{Databases:} PostgreSQL`));
  assert.ok(latex.includes(String.raw`\textbf{Tools:} Docker`));
  assert.ok(latex.includes(String.raw`\textbf{Concepts:} Distributed Systems`));
  assert.ok(latex.includes(String.raw`{\textbf{Example Project} $|$ \emph{TypeScript}}{}`));
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

  assert.ok(latex.includes(String.raw`{\textbf{Dated Project} $|$ \emph{TypeScript}}{May 2026 -- Aug 2026}`));
  assert.ok(latex.includes(String.raw`{\textbf{Undated Project}}{}`));
  assert.match(latex, /\\resumeSubheading\s+\{Software Engineer\}\{2025 -- Present\}\s+\{Example Company\}\{Toronto\}/);
  assert.doesNotMatch(latex, /\\resumeItemListStart\s*\\resumeItemListEnd/);
});

it("omits empty sections and blank categories and leaves a valid page for an empty draft", () => {
  const latex = generateResumeLatex(empty);
  assert.doesNotMatch(latex, /\\section\{/);
  assert.match(latex, /\\begin\{document\}\s+\\null\s+\\end\{document\}/);

  const sparse = generateResumeLatex({ ...empty, skills: { ...empty.skills, tools: ["Docker"] } });
  assert.ok(sparse.includes(String.raw`\section{Skills}`));
  assert.match(sparse, /\\textbf\{Tools:\} Docker\n\}\}/);
  assert.ok(!sparse.includes(String.raw`\textbf{Languages:}`));
});
