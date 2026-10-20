# SPEC — Week digest: close the open review notes

Status: **questions answered by the owner on 19 Oct 2026 (both recommendations accepted).** Lane: one small `/ai:loop` run in `mrkpatchaa.com`.
Branch `fix/digest-cleanup-notes` from `main`.
Source: `docs/archive/fix-digest-dispatch-hardening.md` (one P2, four P3), left open when
`docs/archive/SPEC-digest-dispatch-hardening.md` shipped in PR #277.

## 1. Today (read on 19 Oct)

`scripts/digest-link.mjs` and `scripts/add-link-to-week-digest.mjs`:

1. **P2.** `cleanDescription` cuts at 500 characters. Then `add-link-to-week-digest.mjs` runs
   `description = description || title`. `cleanTitle` has no cut, so a title over 500 characters becomes a
   description over 500 characters.
2. **P3, cut.** The cut is `text.slice(0, 500)` on UTF-16 code units. It can split a surrogate pair (an emoji) or
   leave a combining mark without its base letter.
3. **P3, userinfo.** `checkLink` accepts `https://user:pass@host/` and `https://google.com@evil.example/`.
4. **P3, error title.** A 2xx page with an error-like `<title>` becomes the entry. Owner's decision: no change.
5. **P3, raw links.** The duplicate check compares the encoded link, so a pre-#277 entry with a raw `(`, `)` or `*`
   is not matched. The check reads only the current week's issue. No week issue written by the old code is open
   (#276 was closed on 19 Oct), so no current issue can hold such an entry. Owner's decision: no change.

## 2. Changes

Files: `scripts/digest-link.mjs`, `scripts/add-link-to-week-digest.mjs`, `scripts/__tests__/digest-link.test.mjs`,
`scripts/__tests__/digest-scripts.test.mjs`, `docs/archive/fix-digest-dispatch-hardening.md`. Nothing else.

1. **One cut function.** In `scripts/digest-link.mjs`, move the cut out of `cleanDescription` into an exported
   `cutDescription(text)`. It keeps the two rules of today (never end inside `&amp;`/`&lt;`/`&gt;`, never end on the
   lone `\` of a split escape) and adds a third: cut on grapheme boundaries with
   `new Intl.Segmenter(undefined, { granularity: 'grapheme' })`. The result is at most 500 UTF-16 code units, made of
   whole graphemes, then trimmed. Text of 500 code units or fewer is returned unchanged.
   `cleanDescription` = clean, then `cutDescription`.
2. **Cut after the fallback.** In `add-link-to-week-digest.mjs`: `description = description || cutDescription(title)`.
   The title is already clean, so it is not escaped a second time. The title itself keeps no length limit (out of
   scope).
3. **No userinfo.** `checkLink` throws `link must not contain a username or password` when `url.username` or
   `url.password` is not empty. Uppercase schemes stay accepted (`new URL` normalizes them). An empty userinfo
   (`https://@evil.example/`) is accepted: `new URL` drops the `@`, so the written link is `https://evil.example/`.
4. **Review notes.** In `docs/archive/fix-digest-dispatch-hardening.md`, tick the five boxes. Add after each
   one: `fixed in fix/digest-cleanup-notes` (P2, cut, userinfo) or `closed, owner's decision 19 Oct: <one-line
   reason from 1.4 or 1.5>` (error title, raw links). When `/ai:ship` sees no open finding, it archives the file.

Patterns to copy: the entity and backslash rules already in `cleanDescription`, and the test style of the existing
cases in the two test files (child process + `fake-github.mjs` for the script, direct import for `digest-link.mjs`).

Root `AGENTS.md` gotcha applies: any write to an issue body must keep the escaping, and
`node --test scripts/__tests__/*.test.mjs` is the check.

## 3. Done means

The two user-visible checks (integration, through the real script with `fake-github.mjs`, in
`digest-scripts.test.mjs`):

- **Long title, no description:** TITLE of 600 characters, no DESCRIPTION → the written description line is at most
  500 characters and the title line holds the full title. Fails on today's code.
- **Userinfo link:** LINK `https://google.com@evil.example/` → exit 1, no GitHub call, no update. Fails on today's
  code.

Unit checks (in `digest-link.test.mjs`, each fails on today's code):

- `cutDescription` on 499 `a` + `👍🏽` (a 4-code-unit emoji with a skin-tone modifier) → 499 `a`, no lone surrogate.
- `cutDescription` on 499 `a` + `e` + `́` → 499 `a` (the `é` is not split into `e` and a lone accent).
- `cutDescription` on 500 `a` → unchanged. On 501 `a` → the first 500.
- `checkLink('https://user:pass@example.com/')` throws. `checkLink('HTTPS://example.com/')` returns
  `https://example.com/`. `checkLink('https://@example.com/')` returns `https://example.com/`.

Gates:

- `node --test scripts/__tests__/*.test.mjs` → all pass (17 today, plus the new cases).
- `pnpm exec eslint scripts/` and `pnpm typecheck` exit 0.
- `grep -c '\- \[ \]' docs/archive/fix-digest-dispatch-hardening.md` → `0`.

No live dispatch: the integration tests run the real script, and the workflow file does not change.

## 4. Out of scope

- A title length limit. The hub cuts titles at 120 characters, and the Chrome extension sends page titles.
- Detecting error pages behind a 2xx status (1.4).

## 5. Stage 2 review (19 Oct, Codex `gpt-6-luna`, REVISE)

- P1 date: fixed to 19 Oct. The two "no change" notes are the owner's answers of 19 Oct to questions 1 and 2, so
  they stay closed. This branch ticks their boxes.
- P2 empty userinfo `https://@evil.example/`: not rejected. `new URL` drops the `@`, and the script writes
  `url.href`. A unit check pins that.
- P2 boundary checks: added 500 unchanged and 501 cut to 500.
