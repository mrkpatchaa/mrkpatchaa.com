# Review notes: fix/digest-cleanup-notes

Open findings from the last Codex review (2026-10-20 00:04, loop, SHIP). Written by codex-review after each review; `review-notes --write` rebuilds it
from ~/.local/state/ai-loop/findings.jsonl and `review-notes --recheck` checks them against the code. Tick a box when handled.

- [ ] [P2] `scripts/digest-link.mjs:58` — [P2] NOT FIXED — [scripts/digest-link.mjs]. Entity cleanup can still split a grapheme. A targeted probe with 498 `a` characters followed by U+0600 and `&amp;` returns a string ending in U+0600, which is not a boundary in the source. Choose the final cut from source grapheme boundaries while preserving the entity and escape rules, and add this regression case. <!-- bb82f67d164b -->
