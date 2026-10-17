# 001 – On-device storage only

- **Date:** 2026-10-17
- **Status:** accepted

## Context

This is a single-user personal app. Sync, accounts and a backend would add a lot of work and privacy surface for little benefit.

## Decision

Store all data on the device (a local database such as `expo-sqlite`; the exact library gets chosen in the first spec that needs persistence). No accounts, no network calls for app data.

## Consequences

- Simple and private, and works offline.
- Data is lost if the phone is lost or the app is deleted, unless device backup covers it. An export feature can be added later.
- Cloud sync would need a migration later. We accept that.
