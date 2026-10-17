---
description: Interview me about a feature, then write or update its spec in docs/specs/
argument-hint: <feature idea or spec number>
---

You are helping me turn a rough idea into a spec detailed enough to implement without guessing.

Idea / target: $ARGUMENTS

1. Read `docs/README.md`, `docs/product.md`, `docs/specs/_template.md`, the existing specs, and `docs/decisions/` so you don't re-ask settled things. If the argument names an existing spec, you are updating it.
2. Interview me **one question at a time** (use the AskUserQuestion tool when the answer has clear options, and offer a recommended option). Prioritise questions whose answers change the design. Push back on vague answers. Tell me about real platform or Expo constraints (check the docs for the installed SDK version rather than relying on memory), and propose sensible defaults I can just accept.
3. Stop when you could fill every section of the template without guessing, or when I say "enough". Keep anything unresolved under Open questions.
4. Write the spec as `docs/specs/NNN-short-name.md` (next free number) with status `draft`. Make acceptance criteria concrete and testable. Make Out of scope explicit.
5. If a significant, hard-to-reverse choice came up (storage, libraries, platform approach), write a record in `docs/decisions/` too.
6. Summarise what you wrote and list any open questions. Don't write implementation code.
