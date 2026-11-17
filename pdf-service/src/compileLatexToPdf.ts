import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const maximumPdfBytes = 20 * 1024 * 1024;

export async function compileLatexToPdf(
  latexSource: string,
  { timeoutMs = 30_000 }: { timeoutMs?: number } = {},
): Promise<Buffer> {
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs <= 0) {
    throw new Error("Compilation timeout must be a positive integer");
  }

  const workDir = await mkdtemp(join(tmpdir(), "adaptyn-pdf-"));
  try {
    await writeFile(join(workDir, "resume.tex"), latexSource, "utf8");
    await new Promise<void>((resolve, reject) => {
      // A separate process group lets a timeout stop latexmk and its TeX children.
      const child = spawn("latexmk", [
        "-norc",
        "-pdf",
        "-no-shell-escape",
        "-interaction=nonstopmode",
        "-halt-on-error",
        "-file-line-error",
        "resume.tex",
      ], {
        cwd: workDir,
        detached: process.platform !== "win32",
        stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, openin_any: "p", openout_any: "p" },
      });
      let diagnostic = "";
      let timedOut = false;
      const collect = (chunk: Buffer) => {
        diagnostic = (diagnostic + chunk.toString("utf8")).slice(-8192);
      };
      child.stdout.on("data", collect);
      child.stderr.on("data", collect);

      const timer = setTimeout(() => {
        timedOut = true;
        if (process.platform !== "win32" && child.pid) {
          try {
            process.kill(-child.pid, "SIGKILL");
          } catch {
            child.kill("SIGKILL");
          }
        } else {
          child.kill("SIGKILL");
        }
      }, timeoutMs);

      child.once("error", (error: NodeJS.ErrnoException) => {
        clearTimeout(timer);
        reject(new Error(error.code === "ENOENT"
          ? "latexmk is not installed or is not on PATH"
          : `Unable to start latexmk: ${error.message}`));
      });
      child.once("close", (code, signal) => {
        clearTimeout(timer);
        if (timedOut) {
          reject(new Error(`LaTeX compilation timed out after ${timeoutMs}ms`));
        } else if (code !== 0) {
          reject(new Error(`LaTeX compilation failed (${signal ?? code}): ${diagnostic.trim()}`));
        } else {
          resolve();
        }
      });
    });

    const pdfPath = join(workDir, "resume.pdf");
    let pdfSize: number;
    try {
      const output = await stat(pdfPath);
      pdfSize = output.isFile() ? output.size : 0;
    } catch {
      throw new Error("LaTeX compilation did not produce resume.pdf");
    }
    if (pdfSize === 0 || pdfSize > maximumPdfBytes) {
      throw new Error("Generated PDF is empty or exceeds the 20 MiB size limit");
    }
    const pdf = await readFile(pdfPath);
    if (!pdf.subarray(0, 5).equals(Buffer.from("%PDF-"))
      || !/%%EOF\s*$/.test(pdf.subarray(-1024).toString("latin1"))) {
      throw new Error("Generated file is not a complete PDF");
    }
    return pdf;
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}
