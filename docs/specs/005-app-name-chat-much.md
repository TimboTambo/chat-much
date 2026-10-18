# 005 – Rename the app to Chat Much

- **Status:** approved
- **Depends on:** none (see decision 005)

## Problem / why

The app is still called "todo", the name from the Expo template. The product is Chat Much. iOS shows the app's name under its icon and in system prompts ("Allow 'todo' to access your contacts?"), so the template name is visible every day. Nothing has shipped and no EAS project is linked yet, so this is the cheapest moment to fix the whole identity, not just the label.

## User stories

- As me, I want the app to be called Chat Much on my home screen and in iOS prompts, so it looks like my app and not a template.
- As me, I want the internal identifiers (bundle ID, slug, URL scheme) to match the name, so I don't carry a placeholder into EAS and the App Store.

## Behaviour

All values are set in `app.json` (and `package.json`). `ios/` and `android/` are regenerated, never edited by hand.

| Setting                     | From                 | To                    |
| --------------------------- | -------------------- | --------------------- |
| `expo.name` (display name)  | `todo`               | `Chat Much`           |
| `expo.slug`                 | `todo`               | `chat-much`           |
| `expo.scheme`               | `todo`               | `chatmuch`            |
| `expo.ios.bundleIdentifier` | `com.anonymous.todo` | `com.timlee.chatmuch` |
| `expo.android.package`      | (unset)              | `com.timlee.chatmuch` |
| `package.json` `name`       | `todo`               | `chat-much`           |

- The home-screen label is "Chat Much". If iOS truncates it on a small icon grid, that's acceptable. No separate short name.
- The contacts usage text (spec 001) already says "Chat Much…" and doesn't change.
- Deep links use `chatmuch://`. The old `todo://` scheme stops working. Nothing uses it today.
- **Data reset:** iOS treats a new bundle ID as a different app. The old `com.anonymous.todo` install and its local database (decision 001) are left behind. That holds only test data and is accepted. The old app should be deleted from the simulator.
- Native projects are regenerated with `npx expo prebuild --clean` so the Xcode project and target pick up the new name. iOS scene support (`expo-build-properties` → `ios.enableSceneSupport`) must stay enabled, or the app crashes at launch on iOS 27.

## UI notes

- No screen changes. The visible changes are the home-screen label, the app switcher, Settings → Apps, and system permission prompts.

## Data

- No schema changes.
- On-device data doesn't carry over from the old bundle ID (see Behaviour).

## Acceptance criteria

- [ ] `app.json` and `package.json` contain exactly the values in the table above.
- [ ] Given a fresh build on the iOS simulator, the home-screen icon is labelled "Chat Much".
- [ ] Given contacts access has never been requested, when I tap **Add friends**, then the iOS prompt reads "Allow 'Chat Much' to access your contacts?" with the existing usage text.
- [ ] Given the app is installed, when I open `chatmuch://` (e.g. `xcrun simctl openurl booted chatmuch://`), then Chat Much opens.
- [ ] The app launches on the iOS 27 simulator without crashing (scene support still active).
- [ ] Settings → Apps shows "Chat Much", and its bundle ID is `com.timlee.chatmuch`.
- [ ] No source file or config (outside `docs/` history and generated folders) still refers to `com.anonymous.todo` or the `todo://` scheme.
- [ ] Typecheck and lint pass.

## Out of scope

- A new app icon or splash screen. The Expo placeholder artwork stays.
- Renaming the repository or the local `todo` folder.
- Linking an EAS project, or App Store / TestFlight setup.
- Migrating data from the old `com.anonymous.todo` install.
- Android-specific testing (decision 002). `android.package` is set but not verified.

## Open questions

- None.
