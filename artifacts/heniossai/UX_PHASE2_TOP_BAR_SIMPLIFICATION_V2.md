# Absolute Minimum Viable Top Bar — Revised Proposal

**Phase:** 2 — Second Simplification Pass  
**Status:** Design proposal — do not implement  
**Date:** 2026-07-25  
**Motto:** Every remaining element must defend its existence one final time.

---

## Deliverable 1: The Absolute Minimum

### Desktop (Windows / Linux / Web)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ ◉    [debug · Claude Sonnet] [chat-2 · GPT-5]  +               │
└──────────────────────────────────────────────────────────────────────────┘
```

### Desktop (macOS)

```
          [debug · Claude Sonnet] [chat-2 · GPT-5]  +                      │
```

(No app icon. The native macOS menu provides Settings, About, Quit.)

### Web / Narrow viewport

```
┌────────────────────────────────────────────────┐
│ ☰    [debug · Claude Sonnet]  +                │
└────────────────────────────────────────────────┘
```

(App icon becomes a hamburger. Tabs become scrollable or collapse to a dropdown.)

### Count

**2 interactive zones** (icon + tab strip). **3 interactive elements** (icon, tabs, +).

---

## Deliverable 2: Final Challenge — Every Remaining Element

### 1. Tab Strip (with integrated model display and +)

**What it is:** A single composite element combining three previously separate concerns — session navigation, model awareness, and session creation.

| Previous separate elements | Now handled by |
|---|---|
| Session tabs | Tab strip (existing) |
| + New Session button | Last element of tab strip (browser pattern) |
| Model Indicator | Label within each tab: `[name · model]` |

**Final challenge — why it stays:**

- **Session switching is the highest-frequency action in the Top Bar.** Used dozens of times daily. No alternative (dropdown, sidebar, command palette) offers lower friction.
- **Model awareness is primary information.** Removing the model from the Top Bar entirely would force users to look at the conversation header to know which AI is responding — friction for a daily concern. By integrating model into the tab label, the information is always visible on the active tab.
- **The + is the second-highest-frequency action after tab switching.** Integrating it as the last tab element follows the browser convention (Chrome, Safari, Firefox, Arc all do this). It is always pinned, never scrolls away.

**Could it be smaller?** Yes. The current tab height can reduce from 36px to ~32px. Tab labels could truncate aggressively when space is constrained (CSS `text-overflow: ellipsis`).

**Could it be removed entirely?** Only if the product is redesigned as single-session (like a chat app with no tab switching). This is not viable for a professional tool where users manage multiple simultaneous AI-assisted tasks.

---

### 2. App Icon (Settings anchor)

**What it is:** A single small icon at the left edge. Clicking opens Settings (`⌘,`). Right-clicking shows Quit. That is all.

```
Left-click → command.trigger("settings.open")
Right-click → [About, Quit]
```

**Final challenge — why it stays:**

- **Platform requirement on non-macOS.** Windows and Linux have no native app menu. Without an anchor, new users cannot discover Settings.
- **Settings access is not daily, but it is essential.** Without a visible anchor, first-time users who need to configure a provider or change preferences would be lost.
- **Single action, no dropdown.** This is not a "large hidden menu." It is a one-action button with a right-click fallback for rarely-used items.

**Why not remove it entirely?**
- One 20×20px icon is the minimum possible footprint for any visual affordance.
- Keyboard-only (`⌘,`) excludes new and non-power users.
- The macOS native menu handles this for Mac users, so the icon conditionally disappears.

**What about the menu bar concept from Phase 1?** Abandoned. The old 6-menu concept (Session, Project, Model, View, Window, Help) violated Single Row. The app icon does not replace those menus — it is not a menu system. It is simply a Settings button with a right-click safety net for Quit. Users access all other functionality via:
- Keyboard shortcuts
- Command palette
- In-session controls
- The tab strip itself

---

## Deliverable 3: Everything Removed — Final List

| Removed in V1 | Why |
|---|---|
| Menu Bar (second row) | Violated Single Row |
| DEV/BETA badge | Development elements hidden |
| WindowsAppMenu hamburger | Replaced by app icon |
| Home button | Keyboard shortcut + automatic on close-all-tabs |
| Update pill | 6px dot on app icon + in Settings |
| Model + Agent dropdowns | Condensed into tab label |
| `#opencode-titlebar-right` slot | Unused |

| Removed in V2 (this pass) | Why |
|---|---|
| Dedicated + button | Integrated into tab strip (last element) |
| Separate Model Indicator | Integrated into tab label |
| App menu dropdown (About, Docs, Report Bug, etc.) | Left-click → Settings directly. Right-click → minimal context menu. No dropdown. |
| Check for Updates from menu | Settings handles this |
| Release Notes from menu | Settings handles this |
| Export Logs from menu | Command palette handles this |
| Docs & Support from menu | In-app help button or Settings |
| Report a Bug from menu | Settings → Support section |

### Migration of removed items

| Action | How to access now |
|---|---|
| Switch session | Click a tab |
| New session | Click + at end of tab strip |
| See active model | Read the tab label: `[name · model]` |
| Change model | Click the model name in the active tab (opens model selector), or `⌘'` |
| Open Settings | Click the app icon ◉, or `⌘,` |
| Quit | Right-click app icon → Quit, or `⌘Q`, or close window |
| See version / About | Settings page header |
| Update | Automatic notification in Settings; 6px dot on app icon |
| Command palette | `⌘K` |
| Docs / Support | Help button in Settings |
| Export Logs | Command palette → "Export Logs" |

---

## Deliverable 4: Model Naming

The user requirement: "Never display a label that could become unclear as the product evolves."

### Tab label format

```
[session-name · provider-model]
```

Examples:

| In the tab strip | Reason |
|---|---|
| `debug · Claude Sonnet` | Clear: Anthropic's Claude, Sonnet tier |
| `chat-2 · GPT-5` | Clear: OpenAI's GPT-5 |
| `analysis · Gemini 2.5 Pro` | Clear: Google's Gemini 2.5, Pro tier |
| `quick · DeepSeek V4` | Clear: DeepSeek V4 |

### Edge cases

| Scenario | Display |
|---|---|
| Custom / local model | `debug · ollama/llama3` |
| Model name equals session name | `analysis · Claude Opus` (still shown — session and model are different concepts) |
| Very long model name | Truncated with ellipsis: `Gemini 2.5 Pr…`. Tooltip on hover or full name in session header. |
| No active session (home view) | Empty tab strip. App icon + empty space. No model shown. |

### Visual treatment in the tab

```
[debug · Claude Sonnet]
         ^^^^^^^^^^^^^ secondary weight, smaller, muted color vs session name
```

The model name appears slightly smaller and lower-contrast than the session name, so the eye reads the session name first and the model name on demand.

---

## Deliverable 5: Visual Specification

### Layout (Windows/Linux)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ ◉    [debug · Claude Sonnet]                 [chat-2 · GPT-5]      +    │
│ ^    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^    │
│ │    │                                                              │    │
│ │    └─ Tab strip (scrollable, flex-shrink)                         │    │
│ │       Each tab: session name (primary) + model (secondary)        │    │
│ │       Last tab: + button (always pinned)                          │    │
│ │                                                                   │    │
│ └─ App icon (20×20px)                                               │    │
│    Left-click: Settings                                              │    │
│    Right-click: [About, Quit]                                       │    │
│    macOS: hidden (native menu)                                      │    │
└──────────────────────────────────────────────────────────────────────────┘
```

### macOS Layout

```
          [debug · Claude Sonnet]                 [chat-2 · GPT-5]      +    │
          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^     │
          │                                                          │       │
          └─ Same tab strip, no app icon. Native menu handles        │       │
             Settings (⌘,), About, Quit.                             │       │
```

### Dimensions

| Element | Size |
|---|---|
| Row height | 34px (reduced from current 36px) |
| App icon | 20×20px, centered vertically |
| Tab height | 26px |
| Tab padding | 6px horizontal, 2px vertical |
| + button | 20×20px within a 26×26px touch target |
| Tab label max-width | 200px (before truncation) |

### Platform differences

| Aspect | macOS | Windows | Linux | Web |
|---|---|---|---|---|
| App icon | Hidden | Shown | Shown | Shown |
| Native traffic lights | 72px left pad | N/A | N/A | N/A |
| Window controls | System | Tauri/Electron + OS | OS | N/A |
| Right-click → Quit | Not needed (native) | Available | Available | N/A |

### States

| State | Appearance |
|---|---|
| Normal | Light background. Tabs in neutral. Active tab highlighted. |
| Hover on tab | Subtle background overlay. Model name fully opaque. |
| Hover on model name in tab | Model name gets underline/pointer cursor → indicates clickable |
| Active session | Tab has active indicator (underline or filling). |
| Update available | 6px dot top-right of app icon. Orange (#E95420). |
| Dev build | No visible indicator. Version string in Settings → About. |
| Overflow (many tabs) | Tab strip scrolls horizontally. + stays pinned. App icon stays fixed. |

---

## Deliverable 6: Process — How We Got Here

Three phases of reduction:

```
Phase 0 (before any changes):      DEV │ ☰ │ ⌂  │ [tabs] │ +  │ update    36px
                                   
Phase 1 (Menu Bar experiment):     Session │ Project │ Model │ View │ Window │ Help   28px
                                   DEV │ ☰ │ ⌂  │ [tabs] │ +  │ Model ▼ │ Agent ▼ │ ⬦  36px
                                   Total: 64px

V1 simplification (first pass):    ◉  │ [tabs] │ +  │ Model               36px
                                   
V2 (absolute minimum):             ◉  │ [tabs + model + integrated +]     34px
```

**Total reduction from Phase 1:** 64px → 34px. **47% height reduction.** 15 controls → 3 interactive zones. **80% control reduction.**

---

## Summary

The absolute minimum viable Top Bar has exactly **3 interactive elements**:

1. **App Icon** (20px) — Settings access. Right-click for About/Quit. Hidden on macOS.
2. **Tab Strip** — Session navigation with integrated `[name · model]` labeling.
3. **+** — Integrated as the last pinned element of the tab strip.

Everything else — DEV badge, home button, hamburger menu, model dropdown, agent dropdown, update pill, menu bar, extension slot — is gone.

Every remaining element passes the Daily Usage Rule. Every remaining element is self-explanatory. Nothing remains because it "already existed."

The Top Bar is 34px. It contains no chrome. It is the minimum possible interface to manage multiple AI sessions at once.
