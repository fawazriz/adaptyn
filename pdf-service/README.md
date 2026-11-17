# PDF generation

`generatePdf(resume)` returns a `Promise<Buffer>`. The package also exports
`generateResumeLatex(resume)`, `compileLatexToPdf(latexSource)`, and the
`ResumeData` TypeScript type.

```ts
import { generatePdf, type ResumeData } from "pdf-service";

const pdf = await generatePdf(resumeData);
```

The runtime needs `latexmk`, `pdflatex`, and the TeX packages used by
`src/generateResumeLatex.ts` on PATH. The existing backend uses the
`leplusorg/latex` Docker image. The standalone compiler runs `latexmk` directly
in a unique directory under the operating system's temporary directory.

Compilation has a 30-second timeout, an 8 KiB diagnostic buffer, and a 20 MiB
PDF limit. The compiler checks the PDF header and final EOF marker before
returning its bytes. Temporary files are removed on success and failure.
On POSIX, a timeout kills the job's process group, including TeX child processes.
Call `compileLatexToPdf(source, { timeoutMs: 60_000 })` to set a different timeout.

Run these commands from `pdf-service/`.

```sh
npm ci
npm run build
npm test
npm run test:integration
```

Unit tests mock process execution and use real temporary files. Integration tests
invoke the installed TeX tools and skip when `latexmk -v` is unavailable.
