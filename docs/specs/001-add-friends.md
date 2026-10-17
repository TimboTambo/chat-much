# 001 – Add, edit and remove friends

- **Status:** approved
- **Depends on:** none (introduces persistence, see decision 001)

## Problem / why

Before the app can tell me who's overdue, it needs to know my friends, how often I want to talk to each one, and when we last spoke. With 30–100 friends, setup has to be quick, so I pick many people from my contacts at once.

## User stories

- As me, I want to select several people from my contacts in one go so that initial setup is fast.
- As me, I want to set each friend's interval and when we last spoke before saving so that the list is accurate from day one.
- As me, I want to add someone by name if contacts access isn't available.
- As me, I want to edit a friend's name, interval or note, and remove a friend.

## Behaviour

### Contacts access

- Tapping **Add friends** checks contacts permission:
  - **Not yet asked:** request it. The usage description reads "Chat Much uses your contacts so you can choose which friends to keep in touch with." It is set with the `expo-contacts` config plugin `contactsPermission` in `app.json`.
  - **Full access:** show the contact selection list.
  - **Limited access (iOS 18+):** show only the shared contacts, plus the iOS contact access button (`ContactAccessButton`) so I can share more without leaving the app.
  - **Denied:** show a short explanation, an **Open Settings** button, and an **Add by name** button.
- **Add by name** is always available from the add flow (a secondary action), not only when access is denied.

### Contact selection list

- Shows all contacts that have a display name, sorted alphabetically (A–Z, case-insensitive). Contacts with no name are hidden.
- A search field filters by name as I type (case-insensitive substring match).
- Tapping a row toggles selection. A counter shows how many are selected, e.g. "Next (4)".
- Contacts who are already friends (matched by contact id) show as checked and disabled with the label "Added".
- **Next** is disabled when nothing is selected.

### Review step

- Lists each selected person with editable fields:
  - **Interval:** default **1 month**. Presets: 1 week, 2 weeks, 1 month, 3 months, 6 months, or custom "every N days / weeks / months", where N is 1–365 for days, 1–52 for weeks and 1–24 for months.
  - **Last spoke:** default **Today**. Quick options:
    - Today
    - About a week ago: today − 7 days
    - About a month ago: today − 1 calendar month
    - A while ago: today − interval, so they show as due today
    - Pick a date: date picker, no future dates
- **Remove from batch** (swipe or ×) drops a person without going back.
- **Save** creates all the friends in one go and returns to the home screen. **Back** returns to the selection list and keeps the selections.

### Add by name

- A form with **Name** (required, trimmed, 1–60 characters), **Interval**, **Last spoke** and **Note**. Interval and last spoke work as in the review step.
- Duplicate names are allowed. People can share a name.

### Edit friend

- From a friend's screen (the full friend detail screen comes in spec 003; for 001 a simple edit screen is enough):
  - Edit **name**, **interval** and **note** (optional, up to 500 characters).
  - Last-spoke dates are edited through catch-up history (spec 003), not here.
- Changing the interval immediately changes the due date (last catch-up + new interval).

### Remove friend

- **Remove friend** asks for confirmation: "Remove Sam? Their catch-up history will be deleted." Confirming deletes the friend and all their catch-ups.

### Due-date arithmetic

- Intervals are stored as `{count, unit}`. Week = 7 days. Month = calendar month, so Jan 31 + 1 month = Feb 28/29 (clamped to the end of the month).
- Dates are local calendar dates with no time of day.

### Contact link

- The display name is copied into the app when the friend is added. Later changes in Contacts are **not** synced (see Out of scope).
- The contact id is stored when available, for duplicate detection and future features such as photos and call/text shortcuts. Friends added by name have no contact id.

## UI notes

- **Entry point:** a "+" button in the home screen header. Spec 002 defines the home list. Until then a basic list of friend names is fine, as long as it can reach edit.
- **Screens:**
  - Select contacts
  - Review
  - Add by name
  - Edit friend
  - Permission-denied state, inside the select screen
- Interval and last-spoke pickers are shared components, because spec 003 reuses them.
- Use native iOS feel: large titles, standard list rows, the native date picker.

## Data

```
Friend
  id            string (uuid)
  name          string
  contactId     string | null    // expo-contacts id
  intervalCount int
  intervalUnit  'day' | 'week' | 'month'
  note          string | null
  createdAt     datetime

CatchUp
  id            string (uuid)
  friendId      string → Friend (cascade delete)
  date          date (local, YYYY-MM-DD)
  createdAt     datetime
```

- "Last spoke" on add creates one initial `CatchUp` with that date. This keeps "last catch-up = latest CatchUp.date" as the single rule.
- Spec 002 adds fields to `CatchUp` (type, note).

## Acceptance criteria

- [ ] Given contacts access has never been requested, when I tap **Add friends**, then iOS asks for permission with the Chat Much usage text.
- [ ] Given full access, when the selection list opens, then it shows named contacts A–Z, and typing "pri" shows only contacts whose names contain "pri" (any case).
- [ ] Given Sam is already a friend, when I open the selection list, then Sam shows as checked, disabled and labelled "Added".
- [ ] Given I select 3 contacts and tap **Next**, then the review step lists all 3, each defaulting to 1 month and Today.
- [ ] Given I set one friend to "A while ago" with a 2-week interval and save, then their due date is today.
- [ ] Given I set "About a month ago" on 31 March, then their last catch-up is 28 February (29 in a leap year).
- [ ] Given I tap **Save** on the review step, then all reviewed friends persist across an app restart.
- [ ] Given access is denied, when I tap **Add friends**, then I see an explanation, **Open Settings** (which opens the app's iOS Settings page) and **Add by name**.
- [ ] Given limited access, then only the shared contacts appear, and the iOS contact access button lets me share more, which then appear in the list.
- [ ] Given **Add by name**, when the name is blank or only spaces, then **Save** is disabled.
- [ ] Given I change a friend's interval from 1 month to 1 week, then their due date updates to last catch-up + 7 days.
- [ ] Given I confirm **Remove friend**, then the friend and their catch-ups are gone, and they can be selected again in the contacts list.
- [ ] Typecheck and lint pass.

## Out of scope

- Syncing name or photo changes from Contacts after adding.
- Contact photos and avatars.
- Call, text or WhatsApp shortcuts.
- Groups, tags, tiers.
- Birthdays.
- Importing from anything other than iOS Contacts.
- Android and web behaviour (decision 002).
- The overdue-sorted home list and one-tap logging (spec 002).
- Catch-up history UI (spec 003).
- Notifications (spec 004).

## Open questions

- [ ] **Storage library:** `expo-sqlite` (with or without a query helper such as Drizzle) vs a simple key-value store. To decide in plan mode, and record as a decision when chosen.
- [ ] **Check the defaults I chose:** remove deletes history; duplicate names are allowed; no Contacts syncing; the interval ranges; "About a month ago" = 1 calendar month.
