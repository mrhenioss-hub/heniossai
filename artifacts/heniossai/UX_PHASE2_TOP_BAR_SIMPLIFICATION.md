# Top Bar Simplification — UX Proposal

**Phase:** 2 — Top Bar Redesign (post-Menu-Bar pause)  
**Status:** Design proposal — do not implement  
**Date:** 2026-07-25  
**Design Principle:** The best Top Bar is not the one with the most features. It is the one where every remaining element earns its place.

---

## Design Constraints

1. **Single Row Only** — One line, no stacking.
2. **Remove Everything Not Essential** — Every element must justify its existence.
3. **Daily Usage Rule** — If an average user does not use it many times every day, it does not belong here.
4. **Hide Development Elements** — No DEV/BETA badges in the normal interface.
5. **Eliminate Ambiguous Controls** — No buttons that require a tooltip to understand.
6. **Prioritize Workspace** — The Top Bar should visually disappear while remaining useful.

---

## Deliverable 1: New One-Line Top Bar Wireframe

### Desktop (Windows/Linux)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ ◉     [chat-1] [chat-2] [debug-api]     +     │     Sonnet                          (win) │  36px
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Desktop (macOS)

```
             [chat-1] [chat-2] [debug-api]     +     │     Sonnet                               │
```

Native macOS traffic lights are on the left (system-provided). The native menu bar handles app-level menus. No app icon is shown in the titlebar because the macOS app menu is always accessible from the top of the screen.

### Web / Narrow Viewport

```
┌─────────────────────────────────────────────────────┐
│ ☰     [chat-1] [debug-api]     +     │  Sonnet      │
└─────────────────────────────────────────────────────┘
```

On narrow viewports, the tabs collapse to a dropdown selector (existing behavior). The app icon becomes a hamburger that opens a mobile menu.

---

## Deliverable 2: Element-by-Element Justification

### 1. ◉ App Icon / App Menu
**Platform:** Windows, Linux, Web only (not on macOS)

**What it does:** A small circular app icon (or "H" monogram) at the left edge of the titlebar. Clicking opens a compact dropdown:

```
About HeniossAI
──────────────
Settings...                    ⌘,
Check for Updates
Release Notes
Export Logs...
──────────────
Docs & Support
Report a Bug
──────────────
Quit                           ⌘Q
```

**Why it deserves to stay:**
- Replaces 3 separate controls: the hamburger menu, the update pill, and the DEV badge.
- Provides a unified anchor for everything that is NOT a daily action.
- Follows the pattern of every well-designed desktop app (Linear, Figma, Slack, CleanShot X).

**Frequency:** Used infrequently (once per session or less). That is by design — it is a safety net, not a daily driver. All daily actions are placed in the Top Bar directly.

**Why it cannot live somewhere else:**
- Non-macOS platforms need a discoverable way to access Settings, Quit, and Help.
- The Windows system menu is insufficient and not customizable.
- No other location is always visible and always clickable.

---

### 2. [TitlebarTabStrip] — Session Tabs
**Platform:** All

**What it does:** Shows open sessions and drafts as draggable tabs. Users click to switch, close to dismiss, drag to reorder.

**Why it deserves to stay:**
- Primary navigation mechanism. Users commonly have 2–5 sessions open simultaneously.
- Removing this would require users to navigate sessions through the command palette or menus — unacceptable friction for a daily action.
- Tabbed navigation is universally understood and requires zero learning.

**Frequency:** Used dozens of times per day. Every session switch is a tab click.

**Why it cannot live somewhere else:**
- No alternative offers single-click access to any open session.
- The command palette (`session.previous`/`session.next`) exists but is slower for navigating between active sessions.

---

### 3. + — New Session Button
**Platform:** All

**What it does:** Creates a new session or draft. Keyboard shortcut `⌘⇧S` or `⌘T ⌘N`.

**Why it deserves to stay:**
- Starting a new conversation is a core workflow action, used many times daily.
- The button provides a clear, unambiguous affordance. Every messaging/chat application has a "compose" or "new" button.
- A persistent button is faster than navigating a menu or remembering a shortcut (though shortcuts are available for power users).

**Frequency:** Used multiple times per day.

**Why it cannot live somewhere else:**
- Could theoretically live in a menu or command palette, but the friction of navigating away from the current session to start a new one is unacceptable.
- Universal convention across chat applications (Slack, Discord, Messages) places "new conversation" in the top bar.

---

### 4. Sonnet — Model Indicator
**Platform:** All

**What it does:** Displays the currently selected model name as compact text. Clicking opens the model selector dialog (`command.trigger("model.choose")`).

```
Sonnet ▶
```

No separate model/agent dropdowns. No arrow icon (the text itself is the trigger). A small downward chevron may be shown on hover for discoverability.

**Why it deserves to stay:**
- Model awareness is essential for an AI-native tool. Users need to know which model is working at a glance.
- Model switching is a daily action — users change models based on task complexity (quick question → Haiku, coding → Sonnet, analysis → Opus).
- Single compact element replaces two separate dropdowns (Model + Agent).

**Frequency:** Used multiple times per day. Reading the current model is constant passive use. Changing models is active.

**Why it cannot live somewhere else:**
- The model is a real-time state of the active session. It belongs where the user can see it without navigating away.
- Model awareness is primary information, not secondary (settings).
- The command palette provides model switching but no current-model indicator.

---

## Deliverable 3: Everything Removed

### Removed: Menu Bar (second row)
- **My addition.** A full second row with 6 dropdown menus (Session, Project, Model, View, Window, Help).
- **Why removed:** Violates Single Row Only principle. Consumes 28px of vertical space permanently. Too heavy for an AI-native tool.
- **Where users access the functionality:** Keyboard shortcuts for common actions. App icon dropdown for infrequent actions (Settings, Help). For the remaining menu structure, see the Menu Bar note below.

### Removed: ChannelIndicator (DEV/BETA badge)
- **What it was:** A permanent "DEV" or "BETA" text badge in the top bar.
- **Why removed:** Violates "Hide Development Elements" principle. Non-production indicators belong in the titlebar metadata (window title) or the About panel — not in the primary interface.
- **Where users can access it:** In the About dialog (via app icon > About HeniossAI). On dev builds, the window title or status bar can show the channel.

### Removed: WindowsAppMenu (hamburger)
- **What it was:** A `☰` button on Windows/Linux showing the legacy desktop menu (File, Edit, View, Go, Window, Help).
- **Why removed:** Redundant with the App Icon dropdown. Two separate menu buttons confuse users. The hamburger showed IDE-style menus (File, Edit, Go) that were designed for the old VS Code-like layout.
- **Where users can access it:** Replaced by the App Icon ◉ dropdown, which provides a cleaner, app-native menu structure. Any functionality from the old desktop menu that is still needed maps to either: (a) the App Icon dropdown, (b) a keyboard shortcut, or (c) the command palette.

### Removed: Home button (grid-plus icon)
- **What it was:** A button to toggle the Home view (project grid). Keyboard shortcut `⌘B`.
- **Why removed:** Fails the Daily Usage Rule. Most users open the home view once per work session (to pick a project) and do not return until they switch contexts. It is not a multi-daily action.
- **Where users can access it:** 
  - Keyboard shortcut `⌘B`
  - Close all tabs → Home view shown automatically
  - App Icon dropdown → "Home" option
  - Command palette → "Home"

### Removed: Update Pill (TitlebarUpdateIconButton)
- **What it was:** A circular button that expands to a pill ("Update") when an update is available.
- **Why removed:** Fails the Daily Usage Rule. Updates happen weekly at most. A persistent control in the top bar should not be dedicated to an infrequent action.
- **Where users can access it:** A small dot/badge on the App Icon when an update is available. Click the App Icon → "Update Available" shown at the top of the dropdown. The command palette also lists "Check for Updates".

### Removed: ModelAgentQuickSelectors (two separate dropdowns)
- **What it was:** Two side-by-side dropdown buttons showing "Model" and "Agent".
- **Why removed:** Consumes too much horizontal space. Agent switching is not a daily action for most users (once you pick an agent, you usually stick with it). Two separate controls for one concept (AI configuration) adds weight.
- **Where users can access it:** Condensed into the single Model Indicator (see above). Agent switching moves to: (a) the model selector dialog, (b) keyboard shortcut `⌘.`, (c) the Session context menu within a session.

### Removed: TitlebarV2Right extension slot (`#opencode-titlebar-right`)
- **What it was:** An empty div for extensions to mount controls.
- **Why removed:** No extensions currently use it. If the need arises, extensions can inject into the App Icon dropdown or use the notification system.
- **Note:** Remove the DOM node and the `useTitlebarRightMount` function. If a future extension needs a surface, a dedicated extension point can be designed then (YAGNI).

---

## Deliverable 4: Every Control Challenged

### Initial Challenge (before this proposal)

| Control | Current Status | Passes Daily Rule? | Passes Single Row? | Passes Self-Explanatory? | Verdict |
|---|---|---|---|---|---|
| Menu Bar (second row) | Added in Phase 1 | No | No | N/A | **REMOVE** |
| DEV/BETA badge | Existed before | No | N/A | Yes | **REMOVE** |
| WindowsAppMenu hamburger | Existed before | No | Yes | No | **REMOVE** (replaced) |
| Home button | Existed before | No | Yes | No | **REMOVE** |
| Session tabs | Existed before | **Yes** | Yes | Yes | **KEEP** |
| New Session (+) | Existed before | **Yes** | Yes | Yes | **KEEP** |
| Update pill | Existed before | No | Yes | No | **REMOVE** |
| Model dropdown | Added in Phase 1 | **Yes** | Yes | Yes | **REPLACE** (condense) |
| Agent dropdown | Added in Phase 1 | No | Yes | No | **REMOVE** (merged) |
| App Icon / App Menu | New proposal | N/A (safety net) | Yes | Yes | **ADD** |

### Second Challenge (for kept/added elements)

**Session Tabs:**
- Q: Why not use a dropdown instead of tabs? A: Tabs provide at-a-glance visibility of all open sessions. A dropdown hides the information behind a click. For an action used dozens of times daily, tabs are superior.
- Q: Could tabs be thinner? A: Yes. The current tab height (36px row) can potentially be reduced to ~32px without affecting readability.
- Q: Could tabs be moved to a sidebar? A: Sidebar navigation adds horizontal space consumption and covers content. Tabs in the top bar are the industry standard for multi-document interfaces.

**New Session (+):**
- Q: Why not just `⌘⇧S`? A: Keyboard shortcuts exclude new users and non-power-users. A visible button provides discoverability. Power users can use the shortcut.
- Q: Could it be a smaller icon? A: Yes. The current `IconButtonV2` with `size="large"` is 36px × 36px. A standard `size="medium"` (32px × 32px) or even smaller would be sufficient.

**Model Indicator:**
- Q: Why not just use the keyboard shortcut `⌘'`? A: Because the user needs to *know* which model is active at all times. The indicator is primarily display (awareness) and secondarily action (changing). A shortcut provides only the action.
- Q: Could the model name be shown in the session tab instead? A: Potentially. A small monospace label on the active tab like `[debug-api · Sonnet]` would work. However, this loses the "click anywhere on the model to change" affordance and makes it harder to switch models for the active session.
- Q: Is "Sonnet" self-explanatory? A: For existing users, yes. For new users, hovering shows a tooltip "Claude 3.5 Sonnet — Click to change model". This is acceptable — the model name is a display element first.

**App Icon / App Menu:**
- Q: Is an app icon truly needed on non-macOS? A: Yes. Without a native menu bar, non-macOS platforms have no standard way to access Settings, Quit, and About. The app icon is the convention (used by Linear, Figma, Slack, Discord, CleanShot X).
- Q: Why not a simple text "HeniossAI" instead of an icon? A: An icon is smaller and more visually neutral. The wordmark adds horizontal width without benefit. The icon communicates "this is the app" without competing with session content.
- Q: Does this violate the "Remove Everything" principle? A: No. It replaces 3 previous controls (hamburger, update pill, DEV badge) with one. Net reduction of 2 controls.

---

## Visual Specification

### Height
- **Single row:** 36px (`h-9`)
- Same as the current action bar height. No menu bar row above it.

### Platform Differences

| Element | macOS | Windows | Linux | Web |
|---|---|---|---|---|
| App Icon | Hidden | Shown | Shown | Shown |
| Session Tabs | Shown | Shown | Shown | Shown |
| New Session (+) | Shown | Shown | Shown | Shown |
| Model Indicator | Shown | Shown | Shown | Shown |
| Native traffic lights | System (72px pad) | N/A | N/A | N/A |
| Window controls | N/A | Tauri/Electron | N/A | N/A |

### macOS Padding
- `padding-left: 72px` for native traffic lights (same as current).
- No app icon — the native menu bar provides About, Settings, Quit.

### Color
- Background: `var(--v2-background-bg-deep)` (same as current v2 titlebar)
- Text: `var(--v2-text-text-secondary)` for secondary elements, `var(--v2-text-text-primary)` for active/primary
- No borders, no shadows. The content area should visually "float" beneath the titlebar.

### Hover Behavior
- Tabs: Highlight with `var(--v2-overlay-simple-overlay-hover)`
- + button: Same hover as current `IconButtonV2`
- Model indicator: Subtle background highlight on hover to indicate clickability
- App icon: No hover effect (to avoid drawing attention to an infrequent action)

---

## Edge Cases

1. **No sessions open (home view):** The tab strip shows empty. The + button creates a new session from the home context. The model indicator shows the default model. The app icon works normally.

2. **Single session:** Tab strip shows one tab. All controls remain visible. No change in layout.

3. **Many sessions (overflow):** Tabs scroll horizontally (existing behavior). The model indicator and + button remain pinned at their positions. The app icon is always accessible.

4. **Update available:** A small red/orange dot appears on the App Icon. The dot is 6px × 6px, positioned at the top-right of the icon. No text, no pill. Clicking the icon reveals "Update Available" at the top of the dropdown.

5. **Dev build:** The About dialog shows the channel name. The window title includes `[DEV]` suffix. No badge in the top bar.

6. **macOS full-screen:** Standard macOS full-screen behavior. The menu bar hides with the content. The app icon is not needed since the native menu is available in the menu bar.

7. **Touch / narrow viewport:** The app icon becomes a hamburger. Tabs collapse to a selector. The model indicator shrinks to abbreviated name. The + button remains.

---

## Migration Path

1. **Remove** the second row (MenuBar component, `v2MenuBarHeight`, `flex-col` layout — revert to `flex-row`)
2. **Remove** `ChannelIndicator` from the top bar
3. **Remove** `WindowsAppMenu` from the action bar
4. **Remove** `HomeButton` from the action bar
5. **Remove** `ModelAgentQuickSelectors` (two dropdowns)
6. **Remove** `TitlebarUpdateIconButton` and its container from the top bar
7. **Remove** `#opencode-titlebar-right` extension slot
8. **Add** single App Icon with dropdown menu at the left edge
9. **Add** single Model Indicator at the right side (before window controls)
10. **Revert** header layout from `flex-col` back to `flex-row h-9`

---

## Comparison: Before vs After

### Before (current state with Phase 1 changes)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ Session │ Project │ Model │ View │ Window │ Help                                       (win) │  28px
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ DEV │ ☰ │ ⌂  │ [Session Tab 1] [Session Tab 2]  [+]  │  Model ▼ │  Agent ▼ │  ↑⬦        (win) │  36px
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Element count:** 8 interactive elements + 1 second row + 6 menu labels = 15 controls
**Height consumed:** 64px

### After (this proposal)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ ◉     [Session Tab 1] [Session Tab 2]     +     │     Sonnet                        (win) │  36px
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

**Element count:** 4 interactive elements + tabs
**Height consumed:** 36px
**Reduction:** 44% height, 73% controls
