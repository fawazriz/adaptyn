const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { readdir, writeFile } = require("node:fs/promises");
const { tmpdir } = require("node:os");
const { generatePdf, compileLatexToPdf } = require("..");

const resume = {
  header: {
    fullName: "Adaptyn Container Test",
    email: "resume@example.com",
    phone: "555-555-0100",
    linkedIn: "linkedin.com/in/example",
    githubOrPortfolio: "https://example.com",
  },
  education: [{
    degree: "BSc in Computer Science",
    school: "Example University",
    graduationDate: "2026",
    coursework: "Data Structures & Algorithms",
  }],
  skills: { languages: ["TypeScript"], tools: ["Docker"], concepts: ["Distributed Systems"] },
  experience: [{
    role: "Software Engineer",
    company: "Example Company",
    dates: "2025 -- Present",
    bullets: ["Built **PDF generation** with 100% automated tests."],
  }],
  projects: [{
    projectName: "Resume Builder",
    techStack: "Node.js",
    bullets: ["Preserved the customized LaTeX layout."],
  }],
};

async function jobDirectories() {
  return (await readdir(tmpdir())).filter((name) => name.startsWith("adaptyn-pdf-")).sort();
}

async function main() {
  assert.equal(process.platform, "linux");
  assert.equal(process.arch, "arm64");
  assert.equal(tmpdir(), "/tmp");

  execFileSync("latexmk", ["-v"], { stdio: "pipe" });
  execFileSync("pdflatex", ["--version"], { stdio: "pipe" });
  const requiredFiles = [
    "article.cls", "latexsym.sty", "fullpage.sty", "titlesec.sty", "marvosym.sty",
    "color.sty", "verbatim.sty", "enumitem.sty", "hyperref.sty", "fancyhdr.sty",
    "babel.sty", "english.ldf", "tabularx.sty", "pdfpages.sty", "glyphtounicode.tex",
  ];
  for (const file of requiredFiles) {
    assert.ok(execFileSync("kpsewhich", [file], { encoding: "utf8" }).trim(), file);
  }

  const before = await jobDirectories();
  const pdf = await generatePdf(resume);
  assert.ok(Buffer.isBuffer(pdf) && pdf.length > 0);
  assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
  const info = execFileSync("pdfinfo", ["-"], { input: pdf, encoding: "utf8" });
  const pages = Number(info.match(/^Pages:\s+(\d+)/m)?.[1]);
  assert.ok(pages >= 1, info);
  assert.deepEqual(await jobDirectories(), before, "Compilation left temporary job directories");

  const text = execFileSync("pdftotext", ["-", "-"], { input: pdf, encoding: "utf8" });
  for (const label of ["Adaptyn Container Test", "Education", "Skills", "Experience", "Projects"]) {
    assert.ok(text.includes(label), `PDF text missing ${label}`);
  }

  await assert.rejects(compileLatexToPdf(
    String.raw`\documentclass{article}\begin{document}\unknownCommand\end{document}`,
  ), /LaTeX compilation failed/);
  assert.deepEqual(await jobDirectories(), before, "Failed compilation left temporary job directories");

  if (process.argv[2]) await writeFile(process.argv[2], pdf);
  console.log(JSON.stringify({
    architecture: process.arch,
    bytes: pdf.length,
    pages,
    requiredFiles: requiredFiles.length,
    temporaryJobsCleaned: true,
    invalidLatexRejected: true,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
