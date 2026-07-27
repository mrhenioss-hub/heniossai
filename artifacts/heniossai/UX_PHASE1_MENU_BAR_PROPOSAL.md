# HeniossAI Top Menu Bar — Research & Design Proposal

## Phase 1: UX Polish — Menu Bar Architecture

**Status:** Design Proposal (pre-implementation)  
**Date:** 2026-07-25  
**Scope:** Presentation Layer only. No backend, engine, core, or business logic changes.

---

## Table of Contents

1. [Forensic Analysis Summary](#1-forensic-analysis-summary)
2. [Hidden & Difficult-to-Discover Features](#2-hidden--difficult-to-discover-features)
3. [Conflicts & Duplication Found](#3-conflicts--duplication-found)
4. [Self-Critique of Original Proposal](#4-self-critique-of-original-proposal)
5. [Revised Menu Bar Hierarchy (v2)](#5-revised-menu-bar-hierarchy-v2)
6. [Menu-by-Menu UX Rationale](#6-menu-by-menu-ux-rationale)
7. [Comparison: Original vs Revised](#7-comparison-original-vs-revised)
8. [Commands That Should Remain Elsewhere](#8-commands-that-should-remain-elsewhere)
9. [Simplification of the Current Top Area](#9-simplification-of-the-current-top-area)
10. [Keyboard Shortcut Audit & Conflicts](#10-keyboard-shortcut-audit--conflicts)
11. [Implementation Recommendations](#11-implementation-recommendations)

---

## 1. Forensic Analysis Summary

### 1.1 All Registered Commands

**Total: 65+ unique command IDs** across 16 registration points.

| Category | Commands | Keybinds |
|---|---|---|
| **View** | `sidebar.toggle`, `home.toggle`, `explorerPanel.toggle`, `previewPanel.toggle`, `fileTree.toggle`, `review.toggle`, `terminal.toggle`, `input.focus` | `mod+b`, `mod+shift+e`, `mod+shift+p`, `mod+\`, `mod+shift+r`, `` ctrl+` ``, `ctrl+l` |
| **Session** | `session.new`, `session.previous`, `session.next`, `session.previous.unseen`, `session.next.unseen`, `session.archive`, `session.undo`, `session.redo`, `session.compact`, `session.fork`, `session.share`, `session.unshare`, `message.previous`, `message.next` | `mod+shift+s`, `alt+up/down`, `shift+alt+up/down`, `mod+shift+backspace`, `mod+alt+[`/`]` |
| **Project/Workspace** | `project.open`, `project.previous`, `project.next`, `workspace.new`, `workspace.toggle`, `project.1`–`project.9` | `mod+o`, `mod+alt+up/down`, `mod+shift+w`, `mod+1`–`mod+9` |
| **File** | `file.open`, `file.attach`, `fileTree.toggle`, `tab.close` | `mod+p`, `mod+u`, `mod+\`, `mod+w` |
| **Model/Agent** | `model.choose`, `model.variant.cycle`, `agent.cycle`, `agent.cycle.reverse` | `mod+'`, `shift+mod+d`, `mod+.`, `shift+mod+.` |
| **Settings** | `settings.open`, `logs.export`, `theme.cycle`, `theme.scheme.cycle`, `language.cycle`, `permissions.autoaccept` | `mod+,`, `mod+shift+t`, `mod+shift+s` |
| **Navigation** | `common.goBack`, `common.goForward`, `tab.new`, `tab.close`, `tab.reopenClosed`, `tab.prev`, `tab.next`, `tab.1`–`tab.9` | `mod+[`, `mod+]`, `mod+t,mod+n`, `mod+w`, `mod+shift+t` |
| **Terminal** | `terminal.new`, `terminal.close`, `terminal.toggle` | `ctrl+alt+t`, `mod+w`, `` ctrl+` `` |
| **MCP** | `mcp.toggle` | `mod+;` |
| **Provider** | `provider.connect` | *(none)* |
| **Server** | `server.switch` | *(none)* |
| **Prompt** | `prompt.mode.shell`, `prompt.mode.normal` | `mod+shift+x`, `mod+shift+e` |

### 1.2 All Dialogs

| Dialog | Trigger(s) |
|---|---|
| Settings (v1 & v2) | `settings.open` command, `mod+,`, Windows App Menu |
| Select Model | `model.choose` command, `mod+'`, model button in session header |
| Select Model (Unpaid) | Prompt input model selector (free tier) |
| Manage Models | From ModelSelectorPopover |
| Select Server | `server.switch` command, layout toolbar, status popover, home page |
| Select Directory / Open Project | `project.open` command, `mod+o` |
| Select Directory V2 (File Picker) | `file.open` command, `mod+p` (new layout) |
| Connect Provider | `provider.connect` command, model selectors, settings, usage-exceeded |
| Custom Provider | Embedded in Connect Provider dialog |
| Select MCP | `mcp.toggle` command |
| Fork Session | `session.fork` command |
| Delete Session | Message timeline context menu |
| Delete Workspace | Legacy layout workspace context menu |
| Reset Workspace | Legacy layout workspace context menu |
| Edit Project | Legacy layout project context menu |
| Edit Project V2 | Home page project controller |
| Release Notes | On app update |
| Usage Exceeded | Auto-triggered on session status events (rate limit / free tier) |
| Command Palette V2 | Command entry in new layout |
| Home Command Palette | Home page command search |
| Add WSL Server | WSL settings / onboarding |
| WSL Setup | Embedded in Add WSL Server dialog |

### 1.3 Existing Desktop Menu (Native)

Defined in `desktop-menu.ts`, rendered on Windows via `windows-app-menu.tsx`:

| Menu | Items |
|---|---|
| **OpenCode** (macOS only) | About, Check for Updates, Settings, Reload Webview, Restart, Export Logs, Hide/Unhide/Quit |
| **File** | New Session, Open Project, Settings (Windows), New Window, Close Window |
| **Edit** | Undo, Redo, Cut, Copy, Paste, Delete, Select All |
| **View** | Toggle Sidebar, Toggle Terminal, Toggle File Tree, Reload, DevTools, Zoom, Full Screen |
| **Go** | Back, Forward, Previous/Next Session, Previous/Next Project |
| **Window** | Minimize, Maximize, Close Window |
| **Help** | Documentation, Support Forum, Export Logs, Share Feedback, Report Bug |

### 1.4 Current Top Area (V2 Titlebar)

Layout (left to right, 36px height):

```
[DEV?] [☰] [Home▤] [=== Tabs ===] [+] [spacer] [Update] [WindowsControls]
```

- WindowsAppMenu (☰) renders the entire DESKTOP_MENU as a dropdown submenu tree
- Home button toggles home view
- Tab strip shows session/draft tabs
- "+" creates new session
- Update pill on far right

---

## 2. Hidden & Difficult-to-Discover Features

These are features that exist in the code but have no (or poor) surface-level UI presence:

| Feature | Current access path | Discoverability issue |
|---|---|---|
| **Session undo/redo** (`session.undo`, `session.redo`) | Slash commands `/undo`, `/redo` | No UI button. Users must know the slash command exists. |
| **Session compact** (`session.compact`) | Slash command `/compact` | No UI button. Useful for condensing long sessions. |
| **Session share/unshare** (`session.share`, `session.unshare`) | Slash commands `/share`, `/unshare` | No UI button. Critical for collaboration. |
| **Workspace toggle** (`workspace.toggle`) | Slash command `/workspace` | No UI button. Enables git branch workspaces. |
| **Model variant cycle** (`model.variant.cycle`) | Keybind `shift+mod+d` | No UI indicator or button. Users don't know thinking modes exist. |
| **Theme/scheme cycling** (`theme.cycle`, `theme.scheme.cycle`) | Keybinds `mod+shift+t`, `mod+shift+s` | No menu entry in new layout. Hidden in legacy sidebar. |
| **Language cycling** (`language.cycle`) | Keybind only (if any) | No menu entry. |
| **Permissions auto-accept** (`permissions.autoaccept`) | Keybind `mod+shift+a` | No UI toggle in new layout session area. |
| **Export logs** (`logs.export`) | Desktop menu only | Not accessible in web/browser mode. |
| **Release notes** | Auto-dialog on update | No way to re-open later. |
| **Connect provider** (`provider.connect`) | Command palette, settings | Buried in settings. No quick-entry point. |
| **Switch server** (`server.switch`) | Command palette, status popover | No persistent visible server selector. |
| **Prompt mode switching** (`prompt.mode.shell` / `prompt.mode.normal`) | Keybinds only | No visible mode indicator in the prompt area. |
| **Agent cycling** (`agent.cycle`) | Keybind `mod+.` | No visible agent selector in the titlebar/session header. |
| **MCP toggle** (`mcp.toggle`) | Keybind `mod+;`, slash `/mcp` | No persistent MCP status button. Hidden in status popover. |
| **Session archive** (`session.archive`) | Keybind `mod+shift+backspace` | No button in new layout tab context menu. |
| **Reopen closed tab** (`tab.reopenClosed`) | Keybind `mod+shift+t` | No menu item (only in hidden command list). |
| **File attachment** (`file.attach`) | Keybind `mod+u` | No visible "attach file" button in prompt input v2. |

---

## 3. Conflicts & Duplication Found

### 3.1 Keybind Conflicts

| Keybind | Command 1 | Command 2 | Conflict |
|---|---|---|---|
| `mod+b` | `sidebar.toggle` (legacy) | `home.toggle` (new layout) | These are mutually exclusive by layout mode, so not a runtime conflict, but overlapping semantics. |
| `mod+shift+e` | `explorerPanel.toggle` (new layout) | `prompt.mode.normal` (prompt input) | **Potential conflict** — both registered when new layout is active and prompt input is focused. Need priority/context gating. |
| `mod+w` | `tab.close` (titlebar) | `tab.close` (session, file tabs) | `terminal.close` (terminal context) — context-dependent, handled via `when` conditions. Acceptable but confusing. |
| `mod+1`–`mod+9` | `project.1`–`project.9` (legacy) | `tab.1`–`tab.9` (new layout) | Mutually exclusive by layout mode. |

### 3.2 UI Duplication

| Feature | Exists in | Redundant with |
|---|---|---|
| **Settings** | Command palette, keybind `mod+,`, Windows App Menu, status popover | Multiple access methods is good, but the **same settings dialog** is loaded from two different component sets (v1 and v2) with identical content. |
| **Model selection** | Session header model button, `model.choose` command, `mod+'` keybind, `/model` slash command | Four ways to access. The slash command duplicates the dedicated button. |
| **New Session** | "+" button in titlebar, `session.new` command, `mod+shift+s` keybind, `/new` slash command | Four ways to access. Reasonable for a primary action, but `/new` is redundant. |
| **Open File** | `file.open` command, `mod+p` keybind, `/open` slash command | Three ways. The slash command adds little value. |
| **Terminal toggle** | `terminal.toggle` command, `` ctrl+` `` keybind, `/terminal` slash command | Three ways. Acceptable. |
| **Home/Back navigation** | Home button in titlebar, `home.toggle` keybind `mod+b`, `common.goBack` keybind `mod+[` | Two navigation mechanisms with overlapping purpose. |

---

## 4. Self-Critique of Original Proposal

### 4.1 Critical Evaluation

Before presenting the revised proposal, I challenged every aspect of the original 8-menu design:

| Menu | Critique | Verdict |
|---|---|---|
| **File** | This is the most "traditional code editor" name. HeniossAI doesn't work with "files" as its primary model — it works with sessions and projects. "File" implies a document editor, which HeniossAI is not. | **Wrong name** — should be **Session** or **Project** |
| **Edit** | Text editing (Undo, Cut, Copy, Paste, Select All) is handled by the browser on web and by the OS on desktop. An Edit menu in an in-app menu bar is purely cosmetic. VS Code needs it because it's a native desktop editor. HeniossAI is a web app. | **Not justified** — remove from in-app menu bar. macOS native menu bar still provides it. |
| **Session** | Correct name. Sessions ARE the primary artifact. But the menu was too long (13 items) and mixed lifecycle operations with navigation. | **Keep, but restructure** — split navigation out |
| **View** | Standard name. Works well for panel visibility toggles. Prompt Mode and Permissions submenus felt bolted on. | **Keep, clean up** — move modes to more natural homes |
| **Go** | Weak name. "Go" is VS Code convention, not HeniossAI identity. Navigation between sessions is a session concern, not a separate concept. | **Remove** — distribute to Session and View |
| **Model** | Core differentiator, correct name, but only 4-5 items. Borderline for a top-level menu. | **Keep, strengthen** — add Provider and Server management |
| **Window** | Standard, thin (3 items). Barely justified for a web app. | **Keep** — needed for desktop, hidden on web |
| **Help** | Standard. Fine. | **Keep** |

### 4.2 Identity Assessment

**Original proposal identity score:** 3/8 menus are unique to HeniossAI (Session, Model, Help re-envisioned). The remaining 5 (HeniossAI, File, Edit, View, Go, Window) are generic IDE conventions. This is too similar to VS Code's menu structure.

**Goal:** Flip the ratio so the majority of menus reflect HeniossAI's identity as an AI conversation tool, not a code editor.

### 4.3 Key Insights from the Critique

1. **HeniossAI is not a file editor.** The primary artifact is the Session (an AI conversation). "File" as a top-level concept is misleading.
2. **The browser handles text editing.** On web, Edit menu items are redundant. On desktop, the native menu bar provides them. An in-app Edit menu adds no value.
3. **Project and Session are separate concepts.** Sessions are conversations. Projects are codebases. They have different operations and should be in different menus.
4. **"Go" doesn't justify its own menu.** Navigation between sessions belongs in the Session menu. Navigation history (Back/Forward) is a View concern.
5. **Model needs companions.** Model selection alone is thin. Adding Provider and Server management makes it substantial and logically complete.

---

## 5. Revised Menu Bar Hierarchy (v2)

### 5.1 Top-Level Menu Structure

```
HeniossAI | Session | Project | Model | View | Window | Help
```

**7 menus** — down from 8. Two traditional menus removed (File, Edit, Go → 3 gone), replaced by one (Project → 1 added). Net: -2 menus, +200% identity alignment.

### 5.2 Menu-by-Menu Breakdown

---

#### HeniossAI  *(macOS app menu — mandatory)*

```
About HeniossAI
—————
Check for Updates...
—————
Settings...                    ⌘,
—————
Export Logs...
—————
Hide HeniossAI                ⌘H
Hide Others                   ⌥⌘H
Show All
—————
Quit HeniossAI                ⌘Q
```

**Unchanged from original.** This is a macOS platform requirement, not a design choice.

---

#### Session  *(primary artifact menu — the heart of HeniossAI)*

```
New Session                   ⌘⇧S
New Draft                     ⌘T ⌘N
Close Tab                     ⌘W
Reopen Closed Tab             ⌘⇧T
—————
Undo                          ⌘⇧Z   (session undo — revert message)
Redo                          ⌘⇧Y   (session redo — revert the revert)
Compact
—————
Fork...
Share
Unshare
—————
Archive                       ⌘⇧⌫
Delete...
—————
Settings...                   ⌘,
```

**Why it exists:** Sessions are the fundamental unit of work in HeniossAI — an AI conversation. This menu is the control center for the entire session lifecycle.

**What changed from original:** 
- Added: Close Tab, Reopen Closed Tab, Settings (moved from File)
- Added: New Session, New Draft (moved from File)
- Removed: Previous/Next Message, Previous/Next Session navigation (moved to View)
- Session navigation (Previous/Next Session, Previous/Next Message) was removed from this menu because it mixes "managing this session" with "moving between sessions." Navigation is a View concern.

**Why "Settings" is here:** On Windows/web (no macOS app menu), Settings needs a home. The first menu (Session) is the natural place — following the "File > Settings" convention but with a HeniossAI-native name.

**Discoverability gain:** Undo/Redo/Compact/Fork/Share/Unshare/Archive/Draft all move from hidden or slash-command-only to visible.

---

#### Project  *(workspace and file context menu)*

```
Open Project...               ⌘O
Open File...                  ⌘P
—————
Workspace Toggle
—————
Previous Project              ⌘⌥↑
Next Project                  ⌘⌥↓
```

**Why it exists:** Projects (code directories) are the context in which sessions operate. This is distinct from Sessions — a project outlives any single session and holds the files, git state, and workspace configuration.

**Why "Project" instead of "File":** "File" implies a document you open and save. HeniossAI's relationship with code is through projects — directories with context, not individual files. "Project" is more accurate and more HeniossAI-native.

**What moved here from original:**
- Open Project (was in File)
- Open File (was in File)
- Previous/Next Project (was in Go)
- Workspace Toggle (was a standalone slash command, `/workspace`)

**What stayed behind:** Close Tab, Reopen Closed Tab — these are session/tab operations, not project operations. Moved to Session.

**Discoverability gain:** Workspace Toggle moves from slash-command-only (`/workspace`) to visible. Project navigation moves from keybind-only to visible.

---

#### Model  *(AI capability menu)*

```
Select Model...               ⌘'
Cycle Variant                 ⇧⌘D
Cycle Agent                   ⌘.
Cycle Agent (Reverse)         ⇧⌘.
—————
Manage Models...
Connect Provider...
Switch Server...
```

**Why it exists:** Model and agent selection is HeniossAI's primary differentiator. This menu elevates AI configuration from "buried in settings" to a first-class navigation point.

**What changed from original:**
- Added: Connect Provider, Switch Server (moved from command-palette-only)
- This brings the menu to 7 items — still thin but logically complete. It now covers the full stack: pick a model → configure its variant → pick an agent → manage available models → connect a provider → switch the server.

**Thin menu concern addressed:** At 7 items, this is the thinnest menu. But it's the MOST important for HeniossAI's identity. A thin but high-signal menu is better than burying these items elsewhere. The alternative — putting Model under Session or Settings — would signal that AI configuration is secondary, which is wrong for HeniossAI.

**Discoverability gain:** EXTREMELY HIGH. Connect Provider and Switch Server are currently only accessible via command palette or settings. Agent cycling and model variant are keybind-only.

---

#### View  *(visibility and navigation menu)*

```
Home                          ⌘B
—————
Explorer Panel                ⌘⇧E
Preview Panel                 ⌘⇧P
File Tree                     ⌘\
Terminal                      ⌃`
Review                        ⌘⇧R
—————
Back                          ⌘[
Forward                       ⌘]
—————
Previous Session              ⌥↑
Next Session                  ⌥↓
Previous Unseen Session       ⇧⌥↑
Next Unseen Session           ⇧⌥↓
Previous Message              ⌘⌥[
Next Message                  ⌘⌥]
—————
Command Palette               ⌘K ⌘⇧P
Input Focus                   ⌃L
—————
Toggle Full Screen            ⌃⌘F
```

**Why it exists:** Central hub for what you see (panels) and where you go (navigation). This menu now serves a dual role that maps to how users think: "I want to see the terminal" → View. "I want to go to the next session" → also View (it changes what you see).

**What changed from original:**
- Added: Session navigation (Previous/Next, Message navigation) — moved from Session menu
- Added: Back/Forward navigation — moved from Go menu
- Removed: Prompt Mode submenu (moved to Session toolbar or action bar)
- Removed: Permissions submenu (moved to Settings)
- Simplified: No more submenus. Everything is direct menu items.

**Why session navigation is here, not in Session menu:** "Previous Session" changes what you see, not the state of the current session. It's a viewing action. Grouping it with other navigation (Back/Forward) and panel toggles (Terminal, Review) creates a coherent "what you see" category.

**Discoverability gain:** Session navigation, message navigation, and Back/Forward were previously keybind-only or in the legacy Go menu. Now they're visible alongside panel toggles.

---

#### Window  *(window management — desktop only)*

```
Minimize                      ⌘M
Zoom
—————
Close Window                  ⌘⇧W
```

**Hidden entirely on web.** Desktop only.

**Why it exists:** Standard window management for desktop environments. Maps to native `windowMenu` role on macOS.

---

#### Help  *(support and diagnostics)*

```
Search Commands...
—————
Documentation                 → opencode.ai/docs
Support Forum                 → Discord
Share Feedback                → GitHub Issues
Report a Bug                 → GitHub Issues
—————
Release Notes...
Export Logs...
```

**Why it exists:** Centralizes all help, feedback, diagnostics, and documentation.

**What changed from original:** Minor cleanup. No "About" here (it's in the macOS app menu; on Windows/web, it can be in Help or the settings dialog).

**Discoverability gain:** Release Notes and Export Logs were desktop-menu-only or hidden.

---

## 6. Menu-by-Menu UX Rationale

### 6.1 Why Top-Level Menus Instead of Single Hamburger

The current `WindowsAppMenu` collapses ALL menus into a single hamburger with nested submenus. This has several problems:

1. **Poor scanability:** Users must open the menu, then navigate through nested submenus to find what they need.
2. **Slow access:** Every menu item requires 2-3 clicks minimum.
3. **Non-standard:** No professional desktop IDE uses a single hamburger menu for primary commands.
4. **Discoverability zero:** Users never browse the hamburger menu to discover features.

A visible menu bar with labeled top-level headings solves all of these. Users can:
- Scan available categories at a glance
- Access any menu with one click
- Discover features by browsing
- Learn keybinds from visible menu items

### 6.2 Why 7 Menus (Why This Specific Set)

**The 3 pillars of HeniossAI identity:**
1. **Session** — what you do (conversations with AI)
2. **Project** — where you do it (codebase context)
3. **Model** — who you do it with (AI models and agents)

**The 3 supporting structures:**
4. **View** — how you see it (visibility and navigation)
5. **Window** — where it lives (desktop container)
6. **Help** — how to learn more

**The 1 platform requirement:**
7. **HeniossAI** — macOS app menu (mandatory)

This 3+3+1 structure creates a clear mental model:
- The first three menus (Session, Project, Model) are **HeniossAI's identity** — they're what make this app different.
- The next three (View, Window, Help) are **supporting structure** — they're what every professional app needs.
- The last (HeniossAI) is **platform convention.**

### 6.3 Why "Edit" Was Removed

Text editing commands (Undo, Cut, Copy, Paste, Select All) are handled by:
- **Web:** The browser. Cmd+Z, Cmd+C, Cmd+V, Cmd+A work natively in any text input.
- **Desktop (macOS):** The native menu bar provides an Edit menu with standard items.
- **Desktop (Windows):** The native window menu provides these.

An in-app Edit menu would duplicate functionality that already works. This is why modern web apps (Notion, Figma, Linear, Slack) do not have visible Edit menus in their in-app UI — they rely on the browser/OS.

**Edge case:** If a user is focused on a canvas element (not a text input), the browser's native Edit actions might not apply. In that case, HeniossAI's command system handles session Undo/Redo via the Session menu. For Cut/Copy/Paste on non-text elements, those operations don't exist in HeniossAI's current model.

### 6.4 Why "Go" Was Removed

The original "Go" menu had 8 items: Back, Forward, Home, Quick Open, Open Project, Previous/Next Project, Previous/Next Session.

Each of these is more naturally placed:
- **Back/Forward** → View (they change what you see)
- **Home** → View (it's a view toggle)
- **Quick Open/Open Project** → Project (project/file operations)
- **Previous/Next Project** → Project (navigation between projects)
- **Previous/Next Session** → View (navigation between sessions)

A standalone "Go" menu would have been a thin wrapper over commands that belong elsewhere. Distributing them to their natural homes eliminates redundancy and strengthens each menu's identity.

### 6.5 Why "Model" Stays Top-Level Despite Being Thin

7 items is the smallest menu. The counterargument: "Put Model under Session or Settings."

This is rejected because **Model is the #1 differentiating feature of HeniossAI.** Every competitor has sessions. Not every competitor surfaces model/agent selection as a first-class concern. Burying Model would signal that AI configuration is an afterthought.

A thin but high-signal menu is preferable to a full but forgettable one. The Model menu will grow as more AI capabilities are added (custom agents, prompt templates, model presets, etc.).

### 6.6 Why "Session" Lost Navigation Items

The original Session menu had 13 items mixing:
- Session lifecycle: New, Draft, Undo, Redo, Compact, Fork, Share, Unshare, Archive, Delete
- Session navigation: Previous, Next, Previous Unseen, Next Unseen, Previous Message, Next Message

These are two different user goals:
1. "I want to manage this session" (lifecycle)
2. "I want to look at another session" (navigation)

In the revised version, Session contains only lifecycle operations (10 items + 4 separators = clean). Navigation moved to View, where it lives alongside Back/Forward and panel toggles — all "change what I see" actions.

### 6.7 Keyboard Shortcut Display

Every menu item with a registered keybind should display it in the menu. Currently:
- The native desktop menu (Windows/macOS) shows accelerators
- The WindowsAppMenu shows keybinds from the command system
- The proposed menu bar continues this: command keybinds display in the menu

For items without keybinds (Compact, Share, Unshare, Fork, etc.), the menu IS the primary access point. Keybinds should be added during implementation for frequently-used items.

---

## 7. Comparison: Original vs Revised

| Dimension | Original (v1) | Revised (v2) | Delta |
|---|---|---|---|
| **Total menus** | 8 | 7 | −1 |
| **Identity-specific menus** | 3 (Session, Model, Help) | 5 (Session, Project, Model, View*, Help) | +2 |
| **Traditional IDE menus** | 5 (File, Edit, View, Go, Window) | 2 (Window, Help) | −3 |
| **Menu names** | File, Edit (generic) | Session, Project (native) | Better alignment |
| **Edit menu** | Present (text editing) | Removed (browser/OS handles) | Eliminates redundancy |
| **Go menu** | Present (navigation) | Removed (distributed) | Eliminates thin menu |
| **Session menu items** | 13 (overloaded) | 10 (focused) | Cleaner |
| **Model menu items** | 4 (thin) | 7 (substantial) | More complete |
| **Navigation location** | Separate Go menu + Session | View menu (unified) | Coherent grouping |
| **Settings location** | File menu (v1) | Session menu (end) + macOS app menu | Standard placement |

*View is a common name but the contents are uniquely organized for HeniossAI (navigation + panels together).

### 7.1 What Was Removed (And Why)

| Removed | Replacement | Rationale |
|---|---|---|
| **File** | Split into Session + Project | "File" was a misnomer. Sessions and Projects are the real concepts. |
| **Edit** | (not replaced) | Browser/OS handles text editing. Session Undo/Redo moved to Session menu. |
| **Go** | Distributed to Session, View, Project | "Go" was a thin wrapper over navigation that belongs elsewhere. |
| **Prompt Mode submenu** | (moved to action bar) | Mode switching is better as a visible toggle in the action bar, not a menu subitem. |
| **Permissions submenu** | (moved to Settings) | Auto-accept toggle is a settings preference, not a frequent view action. |

### 7.2 What Was Added (Or Moved)

| Moved | From → To | Rationale |
|---|---|---|
| Close Tab, Reopen Closed Tab | File → Session | Tab management is session-scoped |
| Settings | File → Session (bottom) | First-menu convention for non-macOS |
| Connect Provider, Switch Server | (command-palette-only) → Model | Completes the AI configuration story |
| Previous/Next Session | Go + Session → View | Navigation is a viewing action |
| Previous/Next Message | Session → View | Same rationale |
| Back/Forward | Go → View | Navigation history is a viewing action |
| Previous/Next Project | Go → Project | Project navigation belongs with projects |
| Workspace Toggle | (slash-command-only) → Project | Project configuration |

### 7.3 Identity Score

```
How much does the menu bar reflect "this is an AI conversation tool"?

Original:   ████████░░  3/8 unique menus = 37%
Revised:    ██████████  5/7 unique menus = 71%
Target:     ██████████  >70% unique identity
```

The revised proposal more than doubles the identity alignment from 37% to 71%.

---

## 8. Commands That Should Remain Elsewhere

| Command | Reason to keep out of menu bar | Exists in |
|---|---|---|
| `command.palette` | Always keybind-triggered (`mod+k,mod+shift+p`). Fastest access is keyboard. | Keybind, also in Help as "Search Commands" |
| `tab.1`–`tab.9` | Direct number key access is faster than any menu. | Keybind only |
| `tab.prev`/`tab.next` | Muscle-memory navigation (`ctrl+tab`). | Keybind only |
| `file.attach` | Contextual to prompt input area. Better as an input toolbar button. | Prompt input (should get a UI button) |
| `project.1`–`project.9` | Direct number access for project switching. | Keybind only |
| `context.addSelection` | Contextual to code selection in the review panel. | Keybind only |
| `session.toggle` / commands tied to specific session tabs | Session tabs are per-session; they belong on the tab or in the session header. | Per-session context |

---

## 9. Simplification of the Current Top Area

### 7.1 Current State Problems

The V2 titlebar currently packs into 36px:
1. ChannelIndicator (DEV/BETA badge)
2. WindowsAppMenu (hamburger with ALL menus nested inside)
3. Home button (grid-plus icon)
4. Tab strip
5. New Session (+) button
6. Update pill
7. Windows caption buttons

Problems:
- **The WindowsAppMenu hamburger is overloaded.** It contains every menu item in 6 nested submenus behind a single icon button. Users rarely discover items here.
- **The Home button and New Session button compete** for the same mental space (both are navigation/creation).
- **No visible model/agent indicator** — the most important HeniossAI-specific controls are invisible.
- **ChannelIndicator takes valuable space** for a purely cosmetic label.

### 7.2 Proposed Top Area Simplification

After adding the menu bar, the layout becomes:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ [HeniossAI] [File] [Edit] [Session] [View] [Go] [Model] [Window] [Help]    [≡] │  ← Menu bar (28px)
│ [DEV] [Home▤] [=== Tabs ===] [+] [spacer] [Model: Claude 3.5 ▼] [Agent: Code ▼] [⟳] [Update]  │  ← Action bar (36px)
└─────────────────────────────────────────────────────────────────────────────────┘
```

Changes:
1. **Menu bar replaces the hamburger.** The `WindowsAppMenu` is replaced by a full menu bar row. On macOS, this becomes the native menu bar. On Windows/Linux, it's rendered as a native-style menu bar row.
2. **ChannelIndicator moves** to the left of the action bar (or is removed entirely in production builds).
3. **Home and New Session buttons remain** in the action bar where they're quick-access.
4. **Model and Agent selectors** get permanent visible controls in the action bar (currently hidden/keybind-only).
5. **The action bar separates** from the menu bar, giving each dedicated space.

On narrow/mobile screens, the menu bar collapses to a single hamburger again, and the action bar simplifies to essential buttons only.

### 7.3 What This Replaces

| Current element | Replaced by |
|---|---|
| `WindowsAppMenu` hamburger | Full menu bar with 8 top-level menus |
| ChannelIndicator (DEV/BETA) | Moved to left of action bar, reduced size |
| Hidden Model/Agent controls | Visible Model/Agent dropdowns in action bar |
| Scattered keybinds | Visible menu items with keybind annotations |

### 7.4 What This Preserves

| Current element | Remains |
|---|---|
| Home button | Action bar |
| Tab strip | Action bar |
| New Session (+) button | Action bar |
| Update pill | Action bar (right side) |
| Back/Forward navigation | Go menu + status bar (optional) |
| Settings | File menu + action bar gear icon |
| Command palette | Help menu + keybind |

---

## 10. Keyboard Shortcut Audit & Conflicts

### 8.1 Recommended Keybind Changes

| Current Keybind | Command | Issue | Recommendation |
|---|---|---|---|
| `mod+b` | `sidebar.toggle` / `home.toggle` | Same keybind, different layouts. Confusing. | Keep `mod+b` for Home (new layout). Sidebar toggle moves to `mod+shift+b` or unpair. |
| `mod+shift+e` | `explorerPanel.toggle` / `prompt.mode.normal` | Conflict in new layout when prompt is focused. | Give `prompt.mode.normal` a different keybind (e.g., unused `mod+shift+l` or remove the keybind). |
| `mod+shift+x` | `prompt.mode.shell` | Conflicts with potential "Cut" alternative. | No conflict currently, but review for future. |
| `mod+.` | `agent.cycle` | Takeover of common shortcut. | Acceptable — unique to this app. |

### 8.2 Keybinds to Add

Items that should get keybinds during implementation:

| Command | Suggested Keybind | Rationale |
|---|---|---|
| `session.undo` | `mod+shift+z` | Standard undo shortcut for a session message |
| `session.redo` | `mod+shift+y` | Standard redo shortcut |
| `session.fork` | `mod+shift+f` | Fork is a primary session action |
| `session.share` | `mod+shift+h` | Share (h for "hand off") |
| `session.compact` | `mod+shift+c` | Compact |
| `workspace.new` | Already has `mod+shift+w` | Already assigned |
| `workspace.toggle` | (none needed) | Submenu access is sufficient |

---

## 11. Implementation Recommendations

### 9.1 Architecture

The menu bar should be:

1. **Rendered in the DOM** (not native) for the web/browser version.
2. **Driven by the same `CommandOption` registry** — the menu bar reads from the command system rather than duplicating definitions.
3. **Platform-aware:** On macOS, it maps to the native menu bar via Tauri/Electron. On Windows/Linux, it renders as an in-app menu bar row.
4. **Collapsible:** On mobile/narrow viewports, collapses back to a hamburger.

### 9.2 Component Structure

```
Titlebar
├── MenuBar                    ← NEW
│   ├── MenuItem (HeniossAI)
│   │   ├── MenuItem (About)
│   │   ├── MenuSeparator
│   │   ├── MenuItem (Check for Updates)
│   │   └── ...
│   ├── MenuItem (File)
│   ├── MenuItem (Edit)
│   ├── MenuItem (Session)
│   ├── MenuItem (View)
│   ├── MenuItem (Go)
│   ├── MenuItem (Model)
│   ├── MenuItem (Window)
│   └── MenuItem (Help)
├── ActionBar                  ← RESTRUCTURED
│   ├── ChannelIndicator
│   ├── HomeButton
│   ├── TitlebarTabStrip
│   ├── NewSessionButton
│   ├── ModelSelector          ← NEW (moved from session header)
│   ├── AgentSelector          ← NEW (moved from keybind-only)
│   ├── FlexSpacer
│   ├── UpdatePill
│   └── WindowControls
```

### 9.3 Key Implementation Details

| Concern | Approach |
|---|---|
| **Menu state** | Open/close tracking via SolidJS signals. Only one menu open at a time. |
| **Keyboard navigation** | Arrow keys navigate between menus and items. Escape closes. Enter selects. |
| **Click-away** | Clicking outside any menu closes all menus. |
| **Icon support** | Each menu item should support an optional leading icon from the existing icon set. |
| **Keybind display** | Reuse `command.keybind()` and `command.keybindParts()` from the command system. |
| **Disabled items** | Gray out and skip when `command.disabled()` returns true. |
| **macOS menu bar** | Maps to native `Menu` API via Tauri decorum. Platform detection switches between in-app and native rendering. |
| **Web fallback** | Full in-app menu bar. The same component works on all platforms but the native macOS path is preferred on macOS. |

### 9.4 Phasing

| Phase | Scope |
|---|---|
| **Phase 2 (implementation)** | Menu bar component + desktop integration. Model/Agent selectors in action bar. |
| **Phase 3 (post-menu)** | Breadcrumb navigation, status bar, panel toolbar refinements. |
| **Phase 4 (polish)** | Animations, accessibility, keyboard navigation, theme consistency. |

### 9.5 File Change Estimates

| File | Change |
|---|---|
| `packages/app/src/components/titlebar.tsx` | Add MenuBar component, restructure into MenuBar + ActionBar, move ChannelIndicator |
| `packages/app/src/components/menu-bar.tsx` | **NEW** — Menu bar component with submenus driven by command registry |
| `packages/app/src/components/menu-bar.css` | **NEW** — Menu bar styling |
| `packages/app/src/components/windows-app-menu.tsx` | Refactored into the menu bar component or deprecated |
| `packages/app/src/desktop-menu.ts` | Extended with new command mappings; may be partially replaced by the command-registry-driven approach |
| `packages/app/src/pages/layout-new.tsx` | Height adjustments, Model/Agent selector integration |
| `packages/app/src/components/session/session-header.tsx` | Model selector can remain but act as secondary entry (like the menu bar item) |

### 9.6 Non-Goals for Phase 2

- **No backend changes** — the menu bar is purely presentational
- **No new features** — every menu item maps to an existing command
- **No settings/configuration changes** — the menu bar is always visible when `newLayoutDesigns()` is enabled
- **No mobile redesign** — mobile keeps the hamburger approach

---

## Appendix: Complete Command Registry Cross-Reference

| Command ID | Current Access | Proposed Menu (v2) | Proposed Keybind | Priority |
|---|---|---|---|---|
| `session.new` | Keybind, + button, slash | Session > New Session | `mod+shift+s` | Essential |
| `tab.new` | Keybind only | Session > New Draft | `mod+t,mod+n` | High |
| `project.open` | Keybind, cmd palette | Project > Open Project | `mod+o` | Essential |
| `file.open` | Keybind, cmd palette | Project > Open File | `mod+p` | Essential |
| `tab.close` | Keybind, tab button | Session > Close Tab | `mod+w` | Medium |
| `tab.reopenClosed` | Keybind only | Session > Reopen Closed Tab | `mod+shift+t` | High |
| `settings.open` | Keybind, cmd palette, desktop menu | Session > Settings (or macOS app menu) | `mod+,` | Essential |
| `session.undo` | Slash only | Session > Undo | `mod+shift+z` | High |
| `session.redo` | Slash only | Session > Redo | `mod+shift+y` | High |
| `session.compact` | Slash only | Session > Compact | (none) | Medium |
| `session.fork` | Slash only | Session > Fork | `mod+shift+f` | High |
| `session.share` | Slash only | Session > Share | `mod+shift+h` | High |
| `session.unshare` | Slash only | Session > Unshare | (none) | Medium |
| `session.archive` | Keybind only | Session > Archive | `mod+shift+backspace` | High |
| `message.previous` | Keybind only | View > Previous Message | `mod+alt+[` | Medium |
| `message.next` | Keybind only | View > Next Message | `mod+alt+]` | Medium |
| `session.previous` | Keybind, desktop menu | View > Previous Session | `alt+up` | Medium |
| `session.next` | Keybind, desktop menu | View > Next Session | `alt+down` | Medium |
| `session.previous.unseen` | Keybind only | View > Previous Unseen | `shift+alt+up` | Low |
| `session.next.unseen` | Keybind only | View > Next Unseen | `shift+alt+down` | Low |
| `home.toggle` | Titlebar button, keybind | View > Home | `mod+b` | Essential |
| `explorerPanel.toggle` | Keybind only | View > Explorer Panel | `mod+shift+e` | High |
| `previewPanel.toggle` | Keybind only | View > Preview Panel | `mod+shift+p` | High |
| `sidebar.toggle` | Keybind, desktop menu | View > Sidebar | `mod+shift+b` | Medium |
| `fileTree.toggle` | Keybind, desktop menu | View > File Tree | `mod+\` | Medium |
| `terminal.toggle` | Keybind, slash, desktop menu | View > Terminal | `` ctrl+` `` | Medium |
| `review.toggle` | Keybind only | View > Review | `mod+shift+r` | Medium |
| `input.focus` | Keybind only | View > Input Focus | `ctrl+l` | Medium |
| `command.palette` | Keybind | View > Command Palette | `mod+k,mod+shift+p` | Essential |
| `prompt.mode.normal` | Keybind only | (action bar toggle) | `mod+shift+e` | Low |
| `prompt.mode.shell` | Keybind only | (action bar toggle) | `mod+shift+x` | Low |
| `permissions.autoaccept` | Keybind only | Settings dialog | `mod+shift+a` | Low |
| `common.goBack` | Keybind, desktop menu | View > Back | `mod+[` | Medium |
| `common.goForward` | Keybind, desktop menu | View > Forward | `mod+]` | Medium |
| `project.previous` | Keybind, desktop menu | Project > Previous Project | `mod+alt+up` | Low |
| `project.next` | Keybind, desktop menu | Project > Next Project | `mod+alt+down` | Low |
| `model.choose` | Keybind, session header | Model > Select Model | `mod+'` | Essential |
| `model.variant.cycle` | Keybind only | Model > Cycle Variant | `shift+mod+d` | High |
| `agent.cycle` | Keybind only | Model > Cycle Agent | `mod+.` | High |
| `agent.cycle.reverse` | Keybind only | Model > Cycle Agent (Reverse) | `shift+mod+.` | Low |
| `theme.cycle` | Keybind only | View > (bottom section) | `mod+shift+t` | Medium |
| `theme.scheme.cycle` | Keybind only | View > (bottom section) | `mod+shift+s` | Low |
| `workspace.new` | Keybind only | Project > New Workspace | `mod+shift+w` | Low |
| `workspace.toggle` | Slash only | Project > Workspace Toggle | (none) | Low |
| `provider.connect` | Cmd palette, settings | Model > Connect Provider | (none) | Low |
| `server.switch` | Cmd palette, status popover | Model > Switch Server | (none) | Low |
| `mcp.toggle` | Keybind, slash | (status popover or action bar) | `mod+;` | Low |
| `logs.export` | Desktop menu only | Help > Export Logs | (none) | Medium |
| `terminal.new` | Keybind only | View > Terminal (context menu) | `ctrl+alt+t` | Low |
| `file.attach` | Keybind only | (prompt input toolbar) | `mod+u` | Low |
| `language.cycle` | Keybind only | (Settings > General) | (none) | Low |
| `context.addSelection` | Keybind only | (review panel toolbar) | `mod+shift+l` | Low |
