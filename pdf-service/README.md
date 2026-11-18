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

## ARM64 container

The image uses `node:24-bookworm-slim` for both build and runtime stages.
Docker selects the Linux ARM64 variant with `--platform linux/arm64`.
The runtime includes `latexmk`, `texlive-latex-base`,
`texlive-latex-recommended`, `texlive-latex-extra`,
`texlive-fonts-recommended`. These supply the
template's packages, including `pdfpages`, and `glyphtounicode.tex`.
`poppler-utils` provides `pdfinfo` and `pdftotext` for the container smoke test.

Run from the repository root.

```sh
docker build --platform linux/arm64 -t adaptyn-pdf-service:local pdf-service
docker image inspect adaptyn-pdf-service:local --format '{{.Os}}/{{.Architecture}}'
docker run --rm --platform linux/arm64 \
  --read-only --network none \
  --tmpfs /tmp:rw,nosuid,nodev,size=512m,mode=1777 \
  --cap-drop ALL --security-opt no-new-privileges \
  adaptyn-pdf-service:local
```

The default command runs `scripts/smoke-test.cjs`. It calls `generatePdf`
with a synthetic resume, checks every template dependency, uses Poppler to
verify the page count and resume text, and checks cleanup after successful and
failed compilation. The root filesystem is read-only and the only writable
mount is `/tmp`. The container runs as the unprivileged `node` user.

Run the existing integration tests inside the image to verify concurrent jobs
and cleanup with an arbitrary unprivileged UID.

```sh
docker run --rm --platform linux/arm64 \
  --read-only --network none --user 12345:12345 \
  --tmpfs /tmp:rw,nosuid,nodev,size=512m,mode=1777 \
  --cap-drop ALL --security-opt no-new-privileges \
  --mount "type=bind,source=$(pwd)/pdf-service/test,target=/app/test,readonly" \
  adaptyn-pdf-service:local node --test test/integration/pdf.test.cjs
```

To save a sample PDF for inspection, mount an output directory at `/tmp`.

```sh
mkdir -p /tmp/adaptyn-pdf-output
docker run --rm --platform linux/arm64 \
  --read-only --network none \
  --mount type=bind,source=/tmp/adaptyn-pdf-output,target=/tmp \
  --cap-drop ALL --security-opt no-new-privileges \
  adaptyn-pdf-service:local node scripts/smoke-test.cjs /tmp/resume.pdf
```

For AWS Lambda integration, use the `arm64` function architecture and this
single-architecture image. The handler and Node.js runtime interface client
will be added in Step 4. TeX cache and compilation paths already use `/tmp`.
When preparing the Lambda image, add `--provenance=false` to the build command
to disable the build attestation manifest, as specified in the
[AWS Node.js container instructions](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-image.html).
