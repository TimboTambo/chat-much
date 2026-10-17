# Chat Much (product)

## Vision

A personal app that helps me keep in touch with friends often enough. I decide how often I want to talk to each friend; the app tells me who's overdue and nudges me once a day.

## Who it's for

Me. A single user on one iPhone, tracking about 30–100 friends.

## Core concepts (glossary)

- **Friend:** a person I want to keep in touch with, picked from my phone contacts.
- **Interval:** how often I want to be in touch with a friend, e.g. every 2 weeks. Set per friend.
- **Catch-up:** a record that I was in touch with a friend on a given date. Logged manually.
- **Last catch-up:** the most recent catch-up date for a friend. When adding a friend I can say when we last spoke; this defaults to today.
- **Due date:** last catch-up + interval.
- **Overdue:** today is after the due date. *How overdue* = days past the due date.
- **Daily digest:** one notification a day, at a time I choose, listing overdue friends. Not sent if nobody is overdue.

## Principles

1. **One glance, one tap.** Opening the app shows who to contact; logging a catch-up takes one tap.
2. **Low noise.** At most one notification a day, and only when it's useful.
3. **Private by default.** All data stays on the device. No accounts, no backend.
4. **No guilt trips.** Neutral language and visuals: "3 days overdue", not red alarms or scores.
5. **iOS first.** Built and tested for iPhone. Keep code cross-platform where it's free, but don't spend effort polishing Android or web.

## Non-goals

- Social or sharing features (no other users, no sharing my list).
- Auto-detecting contact from calls, messages or other apps (not possible on iOS anyway).
- Gamification: streaks, points, scores.
- Cloud sync and multiple devices (for now).

Possible later, not ruled out: birthdays and richer friend details, call/text shortcuts, data export.

## MVP scope

| Spec | Feature |
| --- | --- |
| 001 | Add friends from phone contacts, with an interval and "last spoke" date; edit and remove friends |
| 002 | Home list sorted by most overdue, with one-tap catch-up logging |
| 003 | Per-friend catch-up history: view, edit and delete entries |
| 004 | Daily digest notification |

## Key decisions

See [decisions/](decisions/).
