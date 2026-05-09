import fs from "fs/promises";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";

const execFileAsync = promisify(execFile);

export async function compileLatexToPdf(latexSource: string): Promise<string> {
  const jobId = uuidv4();

  const workDir = path.join(process.cwd(), "tmp", "latex-builds", jobId);
  await fs.mkdir(workDir, { recursive: true });

  const texPath = path.join(workDir, "resume.tex");
  const pdfPath = path.join(workDir, "resume.pdf");

  await fs.writeFile(texPath, latexSource, "utf8");

  await execFileAsync("docker", [
    "run",
    "--rm",
    "--network",
    "none",
    "-v",
    `${workDir}:/work`,
    "-w",
    "/work",
    "leplusorg/latex",
    "latexmk",
    "-pdf",
    "-interaction=nonstopmode",
    "-halt-on-error",
    "resume.tex",
  ]);

  try {
    await fs.access(pdfPath);
  } catch {
    throw new Error("PDF was not generated");
  }

  return pdfPath;
}