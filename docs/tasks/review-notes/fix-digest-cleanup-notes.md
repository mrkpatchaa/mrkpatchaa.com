# Review notes: fix/digest-cleanup-notes

Open findings from the last Codex review (2026-10-19 23:53, loop, SHIP). Written by codex-review after each review; `review-notes --write` rebuilds it
from ~/.local/state/ai-loop/findings.jsonl and `review-notes --recheck` checks them against the code. Tick a box when handled.

- [ ] [P2] `scripts/digest-link.mjs:58` — [P2] `scripts/digest-link.mjs:58` — Entity cleanup can undo the grapheme-safe cut. Reproduced with `'a'.repeat(498) + '\u0600&amp;'`: output ends at index 499, inside the `\u0600&` grapheme. After entity and escape cleanup, retreat to a valid grapheme boundary. Add this regression case. <!-- a14710c5f273 -->
- [x] [P2] `scripts/__tests__/digest-link.test.mjs:138` — [P2] `scripts/__tests__/digest-link.test.mjs:138` — The credential rejection repeats the broader userinfo test at line 185. Fix: delete it, moving its scheme and empty-userinfo assertions into the broader test. Six helper tests passed. Direct ESLint and TypeScript checks passed. Integration tests could not run because the sandbox blocks ports and temporary files. Reviewed against the spec and `AGE — fixed: merged into the broader userinfo test. <!-- 6746a6421e24 -->
