# 004 – expo-sqlite with Drizzle ORM

- **Date:** 2026-10-17
- **Status:** accepted

## Context

Decision 001 keeps all data on the device and leaves the library to the first spec that needs persistence (spec 001). The data is relational: friends have many catch-ups, removing a friend deletes their catch-ups, and the home list (spec 002) sorts by a value derived from each friend's latest catch-up.

## Decision

Use `expo-sqlite` with Drizzle ORM (`drizzle-orm/expo-sqlite`):

- The schema lives in `src/db/schema.ts`. Migrations are generated with `npx drizzle-kit generate` into `drizzle/`, committed, and applied at startup with `useMigrations` in the root layout.
- Foreign keys are on (`PRAGMA foreign_keys = ON`), and `catch_ups.friend_id` uses `ON DELETE CASCADE`.
- Reads that must stay live use `useLiveData` (`src/db/use-live-data.ts`), which re-runs on `expo-sqlite` change events for every table it watches. Drizzle's own `useLiveQuery` only watches the query's base table, so it misses changes to joined tables.
- Dates are stored as `YYYY-MM-DD` text and datetimes as ISO text.

## Consequences

- Typed schema and queries, with versioned migrations ready for specs 002 and 003, which add catch-up fields.
- Extra build setup: `babel-plugin-inline-import` (in `babel.config.js`) and `sql` in Metro's `sourceExts` (in `metro.config.js`) so the `.sql` migrations bundle.
- Schema changes need a `drizzle-kit generate` step. Hand-editing generated migrations is off-limits.
