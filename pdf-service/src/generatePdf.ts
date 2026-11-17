import { compileLatexToPdf } from "./compileLatexToPdf";
import { generateResumeLatex, type ResumeData } from "./generateResumeLatex";

export async function generatePdf(resume: ResumeData): Promise<Buffer> {
  return compileLatexToPdf(generateResumeLatex(resume));
}
