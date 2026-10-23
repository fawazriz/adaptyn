# Backend tests

Run from `server/`, using the existing installed dependencies:

```sh
npm test
npm test -- --coverage
npm test -- --runInBand --detectOpenHandles
./node_modules/.bin/tsc --noEmit -p tsconfig.json
./node_modules/.bin/tsc -p tests/tsconfig.json
npm run build
```

API tests use Jest and Supertest against the Express app. Supertest opens ephemeral
localhost sockets and closes them after requests. The startup test mocks `listen`
so it never starts a persistent server. Running inside a sandbox requires local
socket permission. No package installation is needed.

## External dependency isolation

`test-utils.ts` mocks the Supabase client before importing the app. It never
constructs a production client or connects to a database. The client configuration
test separately mocks both the SDK's `createClient` and dotenv configuration.

The in-memory query fake applies only the filters supplied by production code;
it does not automatically enforce ownership. It supports select, insert, update,
delete, eq, single, maybeSingle, and awaiting a query. Mutations return rows only
when `.select()` is requested. Missing and multiple-row singular results follow
the appropriate cardinality rules. Results are detached snapshots and each query
executes at most once. Tables, IDs, injected errors, mock implementations, pending
one-time overrides, and call histories reset before every API test.

This is a query-level fake, not a PostgreSQL emulator. Tests inject database errors
explicitly and verify that the API propagates them without mutation. Constraint
error tests verify controller behavior; they do not prove SQL constraints or RLS
policies. Registration and login tests similarly exercise provider error handling,
not Supabase's own credential validation.

## Temporary LaTeX coverage exclusion

`jest.config.cjs` includes all executable `src/**/*.ts` production files, including
startup and database configuration, and excludes `src/lib/latex/**`. Declaration
files have no executable code and are excluded. Tests, mocks, generated build
output, and configuration files are outside the production coverage glob.

The `compileResume` function in `src/controllers/resumesController.ts` also has a
temporary `istanbul ignore next` annotation because it is the LaTeX/PDF endpoint.
Its implementation is unchanged and no test calls it. When compilation work is
scheduled, remove **both** that annotation and the `src/lib/latex/**` exclusion,
and add the separate generation/compilation tests. Resume CRUD remains included;
the stored source field is treated only as opaque database text.

## Results — October 23, 2026

The original suite passed **16 tests in 5 suites**. The expanded suite passes
**127 tests in 7 suites**, a net increase of **111 test cases**.

Both sides of this comparison include all executable backend source and exclude
LaTeX library code and the compilation endpoint:

| Scope / metric | Before | After |
| --- | ---: | ---: |
| All source: statements | 53.93% (96/178) | 100% (180/180) |
| All source: branches | 42.98% (49/114) | 100% (114/114) |
| All source: functions | 57.89% (11/19) | 100% (19/19) |
| All source: lines | 57.05% (93/163) | 100% (165/165) |
| Controllers: statements | 42.96% (55/128) | 100% (128/128) |
| Controllers: branches | 43.87% (43/98) | 100% (98/98) |
| Controllers: functions | 56.25% (9/16) | 100% (16/16) |
| Controllers: lines | 46.01% (52/113) | 100% (113/113) |

The baseline was captured before editing with Jest's `collectCoverageFrom` set to
all `src/**/*.ts`, excluding declarations and `src/lib/latex/**`. The original
`coverage-final.json` was then normalized to also omit `compileResume` and its
nested callback, statements, and branches. Line coverage uses each statement's
starting line with the maximum hit count on that line, matching Istanbul. This
makes the baseline comparable to the final temporary exclusions. The originally
reported percentages differ because they included compilation and did not include
all unimported production files. The two additional statements/lines in the final
all-source denominator come from authentication rejection handling.

There are **no uncovered non-LaTeX controller lines or branches**. Coverage output
is available in `server/coverage/`, including text, LCOV/HTML, and JSON summaries.

Verification passed:

- `npm test -- --coverage` (all 127 tests, 100% across all four metrics).
- Complete suite with `--runInBand --detectOpenHandles` (all 127 tests, clean exit,
  no open handles reported, no force-exit flag).
- Production and test TypeScript checks.
- Backend build.
- ESLint on all test TypeScript files.

## Production fixes and existing contract limitations

Small production fixes with regression tests:

- Resume retrieval by ID now filters by authenticated `user_id`.
- Application category retrieval now filters by authenticated `user_id`.
- Profile updates and deletes request returned rows with `.select("*")` before
  `.maybeSingle()`. Without it, Supabase returns null even after a successful
  mutation, causing the controller to incorrectly report 404.
- Authentication middleware forwards rejected `getUser` promises to Express's
  error handler. Express 4 otherwise leaves that rejection unhandled; the test
  verifies a completed 500 response and no database access or mutation.

Existing behavior preserved and tested includes idempotent 204 deletion of
missing/foreign applications and resumes, 200/null for a missing profile on GET,
falsy update fields being ignored, and the current `Application not found` wording
for missing resumes. Required-field checks use the implementation's truthiness
rules; additional schema validation was not invented.

The checked-in application migration has **no category column**, despite the
existing category query. Its success tests exercise that query contract using
category fixtures and verify the ownership filter, but do not establish that the
endpoint works against the deployed schema. The checked-in profile migration also
contains `full_name`, not the controller's `name`, `headline`, `location`, and `bio`
fields. Schema reconciliation needs a separate decision based on the deployed
database. No speculative schema or endpoint changes were made.

## Files changed in this task

Expanded:

- `server/tests/applications.test.ts`
- `server/tests/auth.test.ts`
- `server/tests/profiles.test.ts`
- `server/tests/resumes.test.ts`
- `server/tests/test-utils.ts`

Added:

- `server/tests/startup.test.ts`
- `server/tests/supabase-client.test.ts`
- `server/tests/README.md`

Updated:

- `server/jest.config.cjs` — production coverage collection and report formats.
- `server/.gitignore` — ignore generated `dist/` output from build verification.
- `server/src/controllers/applicationsController.ts` — category user isolation.
- `server/src/controllers/profilesController.ts` — mutation return selection.
- `server/src/controllers/resumesController.ts` — read user isolation and the
  temporary compilation coverage annotation.
- `server/src/middleware/auth.ts` — rejected authentication lookup handling.

The existing health test is unchanged. Existing user changes in package files,
Babel/TypeScript/ESLint configuration, app extraction, startup, and application
by-ID isolation were preserved. No package commands or dependency additions were
performed, and no files in `src/lib/latex/` were changed.
