# Review notes: fix/digest-dispatch-hardening

Open findings from the last Codex review (2026-10-19 23:11, ship, SHIP). Written by codex-review after each review; `review-notes --write` rebuilds it
from ~/.local/state/ai-loop/findings.jsonl and `review-notes --recheck` checks them against the code. Tick a box when handled.

- [x] [P2] `scripts/add-link-to-week-digest.mjs:53` — [P2] NOT FIXED — [scripts/add-link-to-week-digest.mjs:53]: `description = description || title` can assign an untruncated title as the description. A title over 500 characters still exceeds the limit. Apply entity-safe truncation after selecting the fallback, without escaping the cleaned title twice. No new P0 or P1 findings. The requested tree diff changes only `AGENTS.md`, so it contains no new — fixed in fix/digest-cleanup-notes  <!-- e461b217f774 -->

## Other open notes (verifier and implementer, 19 Oct)

- [x] [P3] The 500-character cut can split a surrogate pair or a combining mark. — fixed in fix/digest-cleanup-notes
- [x] [P3] `checkLink` accepts userinfo (`https://u:p@host/`) and normalizes an uppercase scheme. The spec forbids neither. — fixed in fix/digest-cleanup-notes
- [x] [P3] A fetched 2xx page with an error-like `<title>` still becomes the entry. — closed, owner's decision 19 Oct: no change, detecting error pages behind a 2xx status is out of scope.
- [x] [P3] The duplicate check compares the encoded link. An entry written before this branch with a raw `(`, `)` or `*` in its link does not match a new dispatch of the same URL, so that URL is added a second time. — closed, owner's decision 19 Oct: no change, no open week issue holds an entry written by the old code (#276 closed on 19 Oct).
