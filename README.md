# Adaptyn

Adaptyn is a job search workspace for tracking applications and managing resume versions. See which applications need attention, organize roles in a Kanban board or searchable list, and build resumes you can preview and download as PDFs.

<img width="1468" height="767" alt="revamp_ss_adaptyn" src="https://github.com/user-attachments/assets/c7670680-1fef-4ce9-af96-fbf2dda9a60f" />


## Features

- **Dashboard** — See application totals, interviews, offers, and suggested next steps based on each application’s current stage.
- **Application tracker** — Switch between Kanban and List views, search by role, company, or location, and filter by stage.
- **Resume library** — Create blank resumes, search and sort saved records, and rename, duplicate, archive, or delete them.
- **Resume editor** — Edit contact information, work experience, education, projects, and technical skills. Reorder experience and project entries and save changes explicitly.
- **PDF preview and download** — Generate a preview or download a PDF using the built-in Classic LaTeX template.
- **Accounts** — Sign up and sign in with Supabase Auth. The API scopes application and resume records to the signed-in user.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, REST API |
| Database and authentication | Supabase PostgreSQL and Supabase Auth |
| PDF generation | LaTeX and `latexmk`, run in Docker |
| Testing | Jest, React Testing Library, Supertest |

## Getting Started

### 1. Clone the repository and install dependencies

You’ll need Git, Node.js 24 with npm, and a Supabase project. Install and start Docker if you want to preview or download resume PDFs locally.

```bash
git clone https://github.com/fawazriz/adaptyn.git
cd adaptyn
npm --prefix client ci
npm --prefix server ci
```

### 2. Configure environment variables

Create `server/.env`:

```env
PORT=8000
FRONT_END_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Create `client/.env.local`:

```env
API_URL=http://localhost:8000
```

Next.js proxies browser requests on `/api` to Express at `API_URL`, so the browser receives Express's session cookie on the frontend hostname. The existing `NEXT_PUBLIC_API_URL` also works as a fallback. Set `API_URL` for both the Next.js build and runtime, and set Express's `FRONT_END_URL` to the exact browser-facing origin. Production requires HTTPS for the session cookie. Keep local environment files out of Git.

### 3. Set up Supabase

In your Supabase project’s SQL Editor, run the files in `server/src/db/migrations` in order from `001` through `005`. For an existing database already on `004`, apply `005_enable_owner_rls.sql` alongside the updated API so owner-only access and request-scoped database credentials take effect together.

### 4. Start both servers

From the repository root, start the API:

```bash
npm --prefix server run dev
```

In a second terminal, start the frontend:

```bash
npm --prefix client run dev
```

Open Adaptyn locally. Keep Docker running while using PDF preview or export. The Express server invokes the LaTeX container during PDF generation.

## Architecture

```text
Next.js client
    │
    │ REST API with session cookie
    ▼
Express API
    ├── Supabase Auth
    ├── Supabase PostgreSQL
    └── Docker / LaTeX → PDF
```

The client calculates dashboard counts from the signed-in user’s application records. Express verifies the session, scopes data requests to that user, and handles PDF compilation. It imports the LaTeX generator from the local `pdf-service` package, which the server's dev, build, and test scripts compile automatically.

To build and test the generator on its own, run `npm --prefix pdf-service ci` and `npm --prefix pdf-service test`. Build the Express image from the repository root with `docker build -f server/dockerfile --target production .` so Docker can include both packages.

## Project Status

Adaptyn is under active development. Application tracking, dashboard summaries, resume editing, and LaTeX PDF export are implemented. Resume versions are managed as separate saved copies. The landing page includes an interactive AI tailoring demo. Editable PDF and DOCX import, revision history, and calendar scheduling are currently unavailable.

## Author

**Fawaz Rizwan**
