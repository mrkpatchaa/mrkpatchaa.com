# Review notes — fix/digest-dispatch-hardening

Stage 4 verdict: SHIP (Codex gpt-6.1-sol, 19 Oct 2026). Open notes, not fixed in this branch:

- P2 (Codex) `scripts/add-link-to-week-digest.mjs:53`: the title fallback skips the 500-character description cut.
  A 501-character title with no description writes a 501-character description. Fix: cut after the fallback is
  chosen, entity-safe, without escaping the title twice.
- P3 (verifier) the 500-character cut can split a surrogate pair or a combining mark.
- P3 (verifier) `checkLink` accepts userinfo (`https://u:p@host/`) and normalizes an uppercase scheme. The spec
  forbids neither.
- P3 (verifier) a fetched 2xx page with an error-like `<title>` still becomes the entry.
- P3 (implementer) the duplicate check compares the encoded link. An entry written before this branch with a raw
  `(`, `)` or `*` in its link does not match a new dispatch of the same URL, so that URL is added a second time.
