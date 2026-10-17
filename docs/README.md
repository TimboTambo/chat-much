# Docs

Source of truth for what the app should do. Code follows the specs, not the other way round.

- [product.md](product.md): vision, principles, non-goals, glossary
- [specs/](specs/): one file per feature, numbered (`NNN-short-name.md`), based on [specs/_template.md](specs/_template.md)
- [decisions/](decisions/): short records of significant choices (`NNN-short-name.md`), based on [decisions/_template.md](decisions/_template.md)

## Workflow

1. Brain dump the idea.
2. `/spec <idea>`: Claude interviews you, then drafts or updates the spec.
3. Review, edit, and set the spec's status to `approved`. Commit it.
4. New session in plan mode: "Implement spec NNN". Review the plan, then build.
5. Set the status to `done` when the acceptance criteria pass. Anything learned while building goes back into a spec.

## Spec statuses

`draft` → `approved` → `in-progress` → `done` (or `superseded`)

A spec with open questions stays `draft`. Only `approved` specs get implemented.
