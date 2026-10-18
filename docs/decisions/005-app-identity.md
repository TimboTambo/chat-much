# 005 – App identity: Chat Much, com.timlee.chatmuch

- **Date:** 2026-10-18
- **Status:** accepted

## Context

The project still used the Expo template identity: name and slug `todo`, scheme `todo`, and a placeholder bundle ID `com.anonymous.todo` added by `expo run:ios`. The bundle ID becomes permanent once the app is on the App Store, and the slug ties to an EAS project once one is linked. Nothing has shipped and no EAS project exists yet.

## Decision

- Display name **Chat Much**, slug `chat-much`, URL scheme `chatmuch`.
- iOS bundle ID and Android package **`com.timlee.chatmuch`**. It's a personal prefix because this is a personal app, not tied to an employer.

## Consequences

- Changing the bundle ID makes iOS treat the app as new. Local data from the old ID is not carried over, which is fine while it's only test data.
- After the first App Store submission or EAS link, changing the bundle ID or slug means a new app listing or project. Treat both as fixed from then on.
- Deep links use `chatmuch://`.
