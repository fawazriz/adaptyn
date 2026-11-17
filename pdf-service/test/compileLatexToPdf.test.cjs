const assert = require("node:assert/strict");
const { afterEach, beforeEach, it, mock } = require("node:test");
const { EventEmitter } = require("node:events");
const { PassThrough } = require("node:stream");
const childProcess = require("node:child_process");
const fs = require("node:fs/promises");
const { join } = require("node:path");
const { compileLatexToPdf, generatePdf, generateResumeLatex } = require("..");
const { full } = require("./fixtures/resumes.cjs");

const pdf = Buffer.from("%PDF-1.4\n1 0 obj\n<<>>\nendobj\n%%EOF\n");
let jobs;
let directories;
let behavior;

beforeEach(() => {
  jobs = [];
  directories = [];
  const mkdtemp = fs.mkdtemp;
  mock.method(fs, "mkdtemp", async (...args) => {
    const directory = await mkdtemp(...args);
    directories.push(directory);
    return directory;
  });
  behavior = async (job) => {
    await fs.writeFile(join(job.directory, "resume.pdf"), pdf);
    job.child.emit("close", 0, null);
  };
  mock.method(childProcess, "spawn", (command, args, options) => {
    const child = new EventEmitter();
    child.stdout = new PassThrough();
    child.stderr = new PassThrough();
    child.kill = mock.fn(() => {
      setImmediate(() => child.emit("close", null, "SIGKILL"));
      return true;
    });
    const job = { command, args, options, directory: options.cwd, child };
    jobs.push(job);
    setImmediate(() => {
      Promise.resolve(behavior(job)).catch((error) => child.emit("error", error));
    });
    return child;
  });
});

afterEach(async () => {
  mock.restoreAll();
  for (const directory of directories) {
    await assert.rejects(fs.access(directory), { code: "ENOENT" });
  }
});

it("returns PDF bytes and uses direct, noninteractive, shell-disabled compilation", async () => {
  const source = "\\documentclass{article}";
  behavior = async (job) => {
    assert.equal(await fs.readFile(join(job.directory, "resume.tex"), "utf8"), source);
    await fs.writeFile(join(job.directory, "resume.pdf"), pdf);
    job.child.emit("close", 0, null);
  };
  assert.deepEqual(await compileLatexToPdf(source), pdf);
  assert.equal(jobs[0].command, "latexmk");
  assert.deepEqual(jobs[0].args, [
    "-norc", "-pdf", "-no-shell-escape", "-interaction=nonstopmode",
    "-halt-on-error", "-file-line-error", "resume.tex",
  ]);
  assert.equal(jobs[0].options.shell, undefined);
  assert.deepEqual(jobs[0].options.stdio, ["ignore", "pipe", "pipe"]);
  assert.equal(jobs[0].options.env.openin_any, "p");
  assert.equal(jobs[0].options.env.openout_any, "p");
});

it("orchestrates the existing generator and returns a PDF buffer", async () => {
  behavior = async (job) => {
    assert.equal(await fs.readFile(join(job.directory, "resume.tex"), "utf8"), generateResumeLatex(full));
    await fs.writeFile(join(job.directory, "resume.pdf"), pdf);
    job.child.emit("close", 0, null);
  };
  const result = await generatePdf(full);
  assert.ok(Buffer.isBuffer(result));
  assert.equal(result.subarray(0, 5).toString(), "%PDF-");
});

it("isolates concurrent jobs and cleans up both directories", async () => {
  behavior = async (job) => {
    const source = await fs.readFile(join(job.directory, "resume.tex"), "utf8");
    await fs.writeFile(join(job.directory, "resume.pdf"), Buffer.from("%PDF-1.4\n" + source + "\n%%EOF"));
    job.child.emit("close", 0, null);
  };
  const results = await Promise.all(["first", "second"].map((source) => compileLatexToPdf(source)));
  assert.notEqual(jobs[0].directory, jobs[1].directory);
  assert.ok(results[0].includes("first"));
  assert.ok(results[1].includes("second"));
});

it("reports compilation errors and cleans partial output", async () => {
  behavior = async (job) => {
    await fs.writeFile(join(job.directory, "resume.aux"), "partial");
    job.child.stderr.emit("data", Buffer.from("Undefined control sequence"));
    job.child.emit("close", 1, null);
  };
  await assert.rejects(compileLatexToPdf("invalid"), /LaTeX compilation failed.*Undefined control sequence/);
});

it("limits captured compiler diagnostics", async () => {
  behavior = async (job) => {
    job.child.stdout.emit("data", Buffer.from("x".repeat(100_000) + "last error"));
    job.child.emit("close", 1, null);
  };
  await assert.rejects(compileLatexToPdf("invalid"), (error) => {
    assert.ok(error.message.length < 8300);
    assert.match(error.message, /last error$/);
    return true;
  });
});

it("reports a missing latexmk executable and cleans up", async () => {
  behavior = (job) => {
    job.child.emit("error", Object.assign(new Error("spawn failed"), { code: "ENOENT" }));
    job.child.emit("close", -2, null);
  };
  await assert.rejects(compileLatexToPdf("source"), /latexmk is not installed/);
});

it("times out compilation and waits for process termination before cleanup", async () => {
  behavior = () => {};
  await assert.rejects(compileLatexToPdf("source", { timeoutMs: 10 }), /timed out after 10ms/);
  assert.equal(jobs[0].child.kill.mock.calls[0].arguments[0], "SIGKILL");
});

it("terminates the entire process group on POSIX when a job times out", {
  skip: process.platform === "win32",
}, async () => {
  behavior = (job) => {
    job.child.pid = 123456;
    mock.method(process, "kill", (pid, signal) => {
      assert.equal(pid, -123456);
      assert.equal(signal, "SIGKILL");
      assert.equal(job.options.detached, true);
      setImmediate(() => job.child.emit("close", null, "SIGKILL"));
      return true;
    });
  };
  await assert.rejects(compileLatexToPdf("source", { timeoutMs: 10 }), /timed out/);
  assert.equal(process.kill.mock.callCount(), 1);
});

it("rejects missing output", async () => {
  behavior = (job) => job.child.emit("close", 0, null);
  await assert.rejects(compileLatexToPdf("source"), /did not produce resume.pdf/);
});

for (const [label, content] of [
  ["empty", Buffer.alloc(0)],
  ["incorrect header", Buffer.from("invalid\n%%EOF")],
  ["truncated", Buffer.from("%PDF-1.4\ntruncated")],
]) {
  it("rejects " + label + " PDF output and cleans up", async () => {
    behavior = async (job) => {
      await fs.writeFile(join(job.directory, "resume.pdf"), content);
      job.child.emit("close", 0, null);
    };
    await assert.rejects(compileLatexToPdf("source"), /Generated (PDF is empty|file is not a complete PDF)/);
  });
}

it("rejects oversized output before reading the PDF into memory", async () => {
  behavior = async (job) => {
    const file = await fs.open(join(job.directory, "resume.pdf"), "w");
    await file.truncate(20 * 1024 * 1024 + 1);
    await file.close();
    job.child.emit("close", 0, null);
  };
  await assert.rejects(compileLatexToPdf("source"), /20 MiB size limit/);
});

it("cleans up when writing the source fails", async () => {
  await assert.rejects(compileLatexToPdf(null), /string|Buffer/);
  assert.equal(jobs.length, 0);
  assert.equal(directories.length, 1);
});

it("rejects invalid timeout settings before creating a job", async () => {
  for (const timeoutMs of [0, -1, NaN, Infinity, 0.5]) {
    await assert.rejects(compileLatexToPdf("source", { timeoutMs }), /positive integer/);
  }
  assert.equal(jobs.length, 0);
  assert.equal(directories.length, 0);
});
