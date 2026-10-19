# Review notes: fix/digest-dispatch-hardening

Open findings from the last Codex review (2026-10-19 22:31, loop, SHIP). Written by codex-review after each review; `review-notes --write` rebuilds it
from ~/.local/state/ai-loop/findings.jsonl and `review-notes --recheck` checks them against the code. Tick a box when handled.

- [ ] [P2] `scripts/add-link-to-week-digest.mjs:53` — [P2] `scripts/add-link-to-week-digest.mjs:53` — The title fallback bypasses the 500-character description limit. A 501-character title with no description writes a 501-character description. Confirmed through the real script with GitHub requests replaced. Apply entity-safe truncation after selecting the fallback, without escaping the cleaned title twice. Syntax checks, ESLint, and both rendering t <!-- 1bfe7f499d77 -->
