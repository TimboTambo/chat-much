# 002 – iOS first

- **Date:** 2026-10-17
- **Status:** accepted

## Context

The only user has an iPhone.

## Decision

Target and test on iOS only. Use cross-platform Expo APIs where they exist, but don't build or polish Android- or web-specific behaviour. Native modules (contacts, notifications) mean we use a development build rather than Expo Go.

## Consequences

- Faster iteration and less testing.
- Android support later would need a test pass and possibly UI fixes.
