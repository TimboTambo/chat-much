# 002 – Home list and one-tap catch-up logging

- **Status:** approved
- **Depends on:** 001 (friends, catch-ups, storage)

## Problem / why

Opening the app should show me who to contact, and logging that I caught up with someone should take one tap. I'm forgetful, so I also want to jot down how we talked and what we discussed while it's fresh. That must never slow down the tap itself.

## User stories

- As me, I want to see at a glance who's overdue, most overdue first, so I know who to contact.
- As me, I want to see who's coming up soon, so I can get ahead of it.
- As me, I want to log "caught up today" with one tap, so logging is effortless.
- As me, I want to optionally note how we caught up and what we talked about straight after the tap, so I don't forget.
- As me, I want to undo a mis-tap.

## Behaviour

### Sections and sorting

The home screen (replacing spec 001's basic list) groups friends into sections. Empty sections are hidden.

| Section      | Rule                              | Sort                                                         |
| ------------ | --------------------------------- | ------------------------------------------------------------ |
| **Overdue**  | today > due date                  | Most days overdue first; ties by name A–Z (case-insensitive) |
| **Due soon** | today ≤ due date ≤ today + 7 days | Due date ascending; ties by name                             |
| **Later**    | due date > today + 7 days         | Due date ascending; ties by name                             |

- Due date = last catch-up + interval (spec 001 arithmetic: calendar months, clamped).
- If no one is overdue but there are friends, a neutral line reads "Nobody's overdue" above the other sections.
- With no friends, the spec 001 empty state stays ("No friends yet").
- A friend with no catch-ups shouldn't exist (spec 001 always creates one). If one does, treat them as due today.

### Status text (neutral, no colour alarms)

- Overdue: "1 day overdue", "N days overdue". Always in days.
- Due today: "due today". Due tomorrow: "due tomorrow".
- Due within the next 7 days (excluding today and tomorrow): "due Thu" (short weekday name).
- Later: "due 14 Nov" (adding the year if it isn't this year), using spec 001's date format.
- Status text uses the secondary label colour in every section. No red, no badges, no counts in the tab or icon.

### One-tap logging

- Each row has a circular check button on the right. The rest of the row opens **Edit friend** (spec 003 will change that to the friend's history screen).
- Tapping the check:
  1. Immediately saves a `CatchUp` for today with `type = null` and `note = null`.
  2. Plays a light haptic.
  3. Re-sorts the list. The friend moves to their new section with an animated layout change.
  4. Opens the **catch-up details sheet** for that new catch-up.
- **Same-day repeat:** if the friend already has a catch-up dated today, tapping the check doesn't create another one. It reopens the details sheet for today's catch-up. A friend whose latest catch-up is today shows a filled check.

### Catch-up details sheet

- A native half-height sheet titled "Caught up with Sam".
- **Type**: a single choice of Call, Message, In person or Other. Optional. Tapping the selected type again clears it.
- **Note**: a multi-line text field, optional, up to 500 characters, trimmed. Blank saves as null.
- **Done** saves the type and note to the catch-up and closes the sheet.
- **Swiping the sheet down** saves whatever has been entered (type and note) and closes it, the same as Done. Nothing typed is lost.
- **Undo** deletes the catch-up created by this tap and closes the sheet. The friend returns to their previous section. Undo only appears when the sheet was opened by a new tap, not for a same-day reopen. Undo is gone once the sheet closes.
- The sheet doesn't change the date (always today). Backdating and editing past entries belong to spec 003.

### Day change

- The sections recompute on app launch and whenever the app returns to the foreground, so status text and sections are correct after midnight without a restart.

## UI notes

- **Home:** large title "Friends", "+" in the header (spec 001), and grouped section headers ("OVERDUE", "DUE SOON", "LATER"). Rows show the name, status text below it, and the check button on the right (44 pt tap target, accessibility label "Log catch-up with Sam today").
- **Details sheet:** an expo-router route presented as `formSheet` with `sheetAllowedDetents` (about half height, expandable to full when the keyboard is up). Type uses a segmented control or chips. Done goes on the trailing side, Undo on the leading side.
- **Haptics:** `expo-haptics` light impact on the check tap. New dependency, installed with `npx expo install`.
- No swipe actions or context menus in this spec.

## Data

`CatchUp` gains two nullable fields (Drizzle migration; existing rows get null):

```
CatchUp
  ...existing fields (spec 001)
  type   'call' | 'message' | 'in_person' | 'other' | null
  note   string | null    // ≤ 500 chars, trimmed, blank → null
```

- No changes to `Friend`.
- "Last catch-up" is still the latest `CatchUp.date` (spec 001).

## Acceptance criteria

- [ ] Given friends with due dates 12 days ago, 3 days ago, today, in 4 days and in 30 days, when I open the app, then I see **Overdue** (12 days, then 3 days), **Due soon** (today, then 4 days) and **Later** (30 days), in that order.
- [ ] Given two friends equally overdue, then they're sorted by name A–Z.
- [ ] Given nobody is overdue, then the Overdue section is hidden and "Nobody's overdue" shows.
- [ ] Status text reads exactly "1 day overdue", "12 days overdue", "due today", "due tomorrow", "due <weekday>" within the week, and "due 14 Nov" beyond it.
- [ ] Given Sam is 12 days overdue, when I tap Sam's check, then a catch-up dated today is saved straight away, Sam moves out of Overdue, and the details sheet opens titled "Caught up with Sam".
- [ ] Given the details sheet is open, when I swipe it down without entering anything, then the catch-up stays with no type and no note.
- [ ] Given I pick "In person", type "Talked about her new job", and tap **Done**, then the catch-up has `type = in_person` and that note, and both survive an app restart.
- [ ] Given I typed a note, when I swipe the sheet down instead of tapping Done, then the note is saved.
- [ ] Given I tap **Undo**, then the new catch-up is deleted and Sam is back in Overdue with "12 days overdue".
- [ ] Given Sam already has a catch-up today, when I tap Sam's check again, then no second catch-up is created, the sheet shows today's type and note, and there's no Undo.
- [ ] Given the app was in the background over midnight, when I bring it to the foreground, then sections and status text reflect the new date.
- [ ] Tapping a row (not the check) opens Edit friend.
- [ ] Typecheck and lint pass.

## Out of scope

- Viewing, editing or deleting past catch-ups, and backdating (spec 003).
- Notifications and the daily digest (spec 004).
- Swipe actions, context menus, and call/text shortcuts.
- Search, filters, or custom sort orders on the home list.
- Streaks, scores, colours or badges for overdue friends (product non-goals).
- Android and web polish (decision 002).

## Open questions

- None.
