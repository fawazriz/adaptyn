const assert = require("node:assert/strict");
const { describe, it, afterEach, beforeEach, mock } = require("node:test");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs/promises");
const { generatePdf, compileLatexToPdf } = require("../..");
const { full } = require("../fixtures/resumes.cjs");

const available = spawnSync("latexmk", ["-v"], { timeout: 5000 }).status === 0;

describe("real latexmk compilation", {
  skip: available ? false : "latexmk is not installed or is not on PATH",
}, () => {
  let directories;
  beforeEach(() => {
    directories = [];
    const mkdtemp = fs.mkdtemp;
    mock.method(fs, "mkdtemp", async (...args) => {
      const directory = await mkdtemp(...args);
      directories.push(directory);
      return directory;
    });
  });
  afterEach(async () => {
    mock.restoreAll();
    for (const directory of directories) {
      await assert.rejects(fs.access(directory), { code: "ENOENT" });
    }
  });

  it("generates a valid resume PDF with the existing template", async () => {
    const result = await generatePdf(full);
    assert.ok(Buffer.isBuffer(result));
    assert.ok(result.length > 100);
    assert.equal(result.subarray(0, 5).toString(), "%PDF-");
    assert.match(result.subarray(-1024).toString("latin1"), /%%EOF\s*$/);
    assert.equal(directories.length, 1);
  });

  it("rejects invalid LaTeX and cleans partial compilation files", async () => {
    await assert.rejects(compileLatexToPdf(
      String.raw`\documentclass{article}\begin{document}\unknownCommand\end{document}`,
    ), /LaTeX compilation failed/);
    assert.equal(directories.length, 1);
  });

  it("compiles concurrent resumes in isolated temporary directories", async () => {
    const results = await Promise.all([generatePdf(full), generatePdf(full)]);
    assert.equal(new Set(directories).size, 2);
    for (const result of results) assert.equal(result.subarray(0, 5).toString(), "%PDF-");
  });
});
