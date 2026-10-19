# SPEC — Week digest workflow: safe inputs, queued runs, no duplicates

Status: **approved by the owner on 19 Oct 2026.** Revised on 19 Oct in `/ai:loop` Stage 1 (see 5) and Stage 2
(see 6). Lane: one small `/ai:loop` run in `mrkpatchaa.com`. Branch `fix/digest-dispatch-hardening` from `main`.
Why: from now on, HomeOS sends links to this workflow from a hub workflow (hub
`home/docs/specs/SPEC-homeos-bookmarks-v1.md`, 4.6). Titles then come from other people's posts, not only from the
owner's Chrome extension. The hub sends up to 20 dispatches back to back in one run.

## 1. Today (read on 19 Oct)

`.github/workflows/add-link-to-week-digest.yml`, `scripts/create-week-digest.mjs` and
`scripts/add-link-to-week-digest.mjs`:

1. **Inputs in a shell line.** `echo TITLE="${{ github.event.inputs.title }}" >> .env` (and `LINK`, `DESCRIPTION`).
   A title with a `"` or `$(…)` breaks the step or runs a command in a job that holds `secrets.GH_TOKEN`.
2. **Runs cancel each other.** `concurrency: { group: ${{ github.ref }}, cancel-in-progress: true }`. Two links sent
   within a minute: the first run is cancelled and its link is lost.
3. **No duplicate check.** The same link sent twice appears twice in the week's issue.
4. **Errors exit 0.** Both scripts log errors and end green, so the sender cannot retry.
5. **The issue number travels in `.env`.** `create-week-digest.mjs` appends `ISSUE_NUMBER=<n>` to `./.env`.
   `add-link-to-week-digest.mjs` reads it through `import 'dotenv/config'`.
6. **The blog renders raw HTML.** `lib/markdownToHtml.ts` uses `remark-html` with `sanitize: false`, and
   `components/post-body.tsx` sets the result as HTML. A `<script>` or `<img onerror=…>` in a digest title or
   description runs on the published site. `lib/api.ts` also cuts the metadata block with a greedy
   `/(\/\*----)([\s\S]*)(----\*\/)/`, so a `----*/` in a digest line moves text into the metadata.

## 2. Changes

Files: `.github/workflows/add-link-to-week-digest.yml`, `scripts/add-link-to-week-digest.mjs`,
`scripts/create-week-digest.mjs`, and a new `scripts/digest-link.mjs`. Nothing else.

1. **Inputs through `env:` only.** Delete the step "create env file". The step "Add link" gets
   `env: { GH_TOKEN: ${{ secrets.GH_TOKEN }}, LINK: ${{ inputs.link }}, TITLE: ${{ inputs.title }}, DESCRIPTION:
   ${{ inputs.description }} }`. The step "Make sure issue for current week is created" gets `GH_TOKEN` and `LINK`
   the same way. No other step gets `GH_TOKEN`, so `pnpm install` never sees it. No `run:` line holds `${{ … }}`.
   The `ISSUE_NUMBER` handoff through `./.env` stays as it is (`appendFileSync` creates the file).
2. **Runs queue.** Move `concurrency` to the workflow level:
   `concurrency: { group: add-link-to-week-digest, cancel-in-progress: false, queue: max }`. Remove the job-level
   block. Reason: with the default `queue: single`, a group keeps one waiting run and a new run cancels it, so a burst
   of 20 keeps 2. `queue: max` keeps up to 100 waiting runs (GitHub docs, "Control workflow concurrency").
   `queue: max` with `cancel-in-progress: true` is a validation error. The order in which queued links land is not
   guaranteed, and the digest does not need it.
3. **Link check, before any GitHub call in either script.** New `scripts/digest-link.mjs` exports
   `checkLink(raw)`: parse with `new URL(raw)`, accept only protocol `https:` or `http:` and a raw length of at most
   2,000 characters, else throw with the reason. It returns `url.href` with `(` and `)` replaced by `%28` and `%29`.
   `create-week-digest.mjs` calls it first when `LINK` is set (a bad link creates no issue). `add-link-…` calls it
   first and always. A throw → log the reason, exit 1. From here on, "the link" means the returned value.
   `checkLink` also encodes `*` as `%2A`, so no link can hold `----*/` (verify round, finding 3).
4. **Duplicate check, before the page fetch.** Read the issue. A heading line matches
   `/^### \[.*\]\(<the link, regex-escaped>\)$/m` → log `already in the digest`, exit 0, no update. A link that
   appears only inside an earlier description is not a duplicate (verify round, finding 4).
5. **Clean the text.** Clean `TITLE` and `DESCRIPTION` first, and clean fetched text the same way:
   - Both, in this order: each run of `\r` or `\n` → one space. `\` → `\\` (first of the escapes, verify round,
     finding 1). `&` → `&amp;`, `<` → `&lt;`, `>` → `&gt;`. `` ` `` → `` \` ``.
   - Title: then remove `[`, `]`, `(`, `)`.
   - Description: then `[` → `\[` and `]` → `\]`.
   - Both, last: remove every `/*----` and `----*/`, repeating until none is left (after the bracket removal, verify
     round, finding 2). Trim. Then cut the description at 500 characters, never inside an entity or after a lone `\`.
   - Nothing else changes. `a"; echo pwned; "b` holds none of these characters, so it lands verbatim. Do not strip
     quotes: the fix for the injection is item 1.
6. **Page fetch, on the cleaned values.** Cleaned title and cleaned description both empty → fetch the page with a
   10-second timeout (`AbortSignal.timeout(10_000)`), take `<title>` and the meta description, and clean them. A fetch
   error, a timeout or a non-2xx status → exit 1. Then, as today, an empty description takes the title. Both still empty → exit 1. Title
   empty but description set → the title is the link's hostname.
7. **Failures exit 1.** In `add-link-to-week-digest.mjs`: a bad link, no `ISSUE_NUMBER`, an empty issue body, a
   GitHub error, a fetch error, or no text after item 6. In `create-week-digest.mjs`: a bad link, a list, create or
   `.env` append error. Use `process.exitCode = 1` (or a top-level `catch` that sets it), not a bare `return`.
8. **The Chrome extension keeps working:** same file, same workflow `name`, same three inputs, same `### [title](link)`
   + description format with the invisible-space line.

Patterns to copy: keep the Octokit calls and the body format of the current `add-link-to-week-digest.mjs`. Keep the
two-script, two-step shape. No new dependency. The verifier's `node --test` files in `scripts/__tests__/` (node:test,
no dependency) are the offline checks for items 3 to 7: `node --test scripts/__tests__/*.test.mjs` must pass.

No nested `AGENTS.md` applies (only the root one exists).

## 3. Done means

Live checks run on the pushed branch with `gh workflow run add-link-to-week-digest.yml --ref
fix/digest-dispatch-hardening -f …`. They write into the current week's issue. Test links are
`https://example.com/digest-test-<n>`. After the checks, remove only the test lines from the issue body. No push to
`main` happens in between, so no deploy publishes them (owner's ok, 19 Oct).

The two user-visible checks (e2e, live dispatch):

- **Burst:** three dispatches within 10 seconds, three different links → all three runs green, all three links in
  the issue, each once.
- **Duplicate:** the same link dispatched twice → once in the issue, the second run green with the log line
  `already in the digest`.

Other checks:

- A dispatch with title `a"; echo pwned; "b` → the issue gets `### [a"; echo pwned; "b](<link>)`. No log line of the
  run is exactly `pwned`.
- A dispatch with title `<img src=x onerror=alert(1)>` and description `[x](https://evil.example) ----*/` → the issue
  holds `&lt;img src=x onerror=alert1&gt;` and `\[x\](https://evil.example)` with no `----*/`. Then
  `node -e` through `lib/markdownToHtml.ts`'s pipeline (`remark().use(html, { sanitize: false })`) on that line shows
  no `<img` and no `<a href="https://evil.example"`.
- A dispatch with `link` = `javascript:alert(1)` → the run fails at the step "Make sure issue…", the issue is
  unchanged, and no new issue exists.
- A dispatch with `link` = `https://example.com/a_(b)` → the issue holds `](https://example.com/a_%28b%29)`.
- A dispatch with a link only (no title, no description) to a page with a `<title>` → the line uses that title.
- A dispatch with title `[]()` and no description → the page is fetched (or the run fails), never a blank entry.
- `grep -nE '\$\{\{ *(github\.event\.)?inputs' .github/workflows/add-link-to-week-digest.yml` → only `env:` lines.
- `grep -n 'secrets.GH_TOKEN' .github/workflows/add-link-to-week-digest.yml` → only in the two script steps' `env:`.
- `node --check` passes on the three scripts, and `pnpm exec eslint scripts/` reports no errors.

## 4. Out of scope (suggestions only)

- `deploy.yml` writes `secrets.GH_TOKEN` in a `run:` line and uses the same `${{ github.ref }}` cancel group.
- `lib/markdownToHtml.ts` renders posts with `sanitize: false`. This spec escapes digest lines at write time only.
  Older digest lines and normal posts are not cleaned.
- The hub retry when a run fails after a good dispatch (see 6, P0). That belongs to the hub spec.

## 5. Stage 1 revisions (19 Oct)

- Item 2 of the first version (`cancel-in-progress: false` alone) would drop 18 of the hub's 20 dispatches: the
  default queue keeps one waiting run. Added `queue: max`. The burst check now sends three, not two.
- The first version said to remove `.env` "if nothing else needs it". `create-week-digest.mjs` needs it for
  `ISSUE_NUMBER`. The file stays, written by that script only.
- `create-week-digest.mjs` also exits 0 on errors. It now exits 1, so a run fails at the right step.
- `GH_TOKEN` now reaches only the two script steps.

## 6. Stage 2 review (19 Oct, Codex `gpt-6-luna`, REVISE)

Folded:

- P1 order: the FIFO claim is gone. Queued links may land in any order, which the digest allows.
- P1 link check before issue creation: `scripts/digest-link.mjs`, called first by both scripts.
- P2 Markdown and link escaping: item 5 and the `%28`/`%29` link. Raised to a must: the blog renders raw HTML
  (1.6), so an unescaped title is stored XSS on the published site.
- P2 text empty after cleaning: item 6 checks the cleaned values.

Not folded:

- P0 the hub moves a bookmark to `Digest sent` before dispatch, so a run that fails later strands it. This spec
  makes the failure visible (exit 1). The retry is hub work: proposed for hub spec 4.6, on the owner's yes.
- P3 pass `ISSUE_NUMBER` as a step output instead of `.env`: the `.env` handoff works and lets the scripts run
  locally. Not worth the change here.
