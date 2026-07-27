# HeniossAI Menu Bar — Final Wireframe & Design Validation

**Phase:** 1 — Final UX Review  
**Status:** Pre-implementation design validation  
**Date:** 2026-07-25

---

## Deliverable 1: Complete Top Bar Wireframe

### Desktop (Windows/Linux — in-app menu bar)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  HeniossAI │ Session │ Project │ Model │ View │ Window │ Help                                       (win) │  ← Menu bar (28px)
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  DEV  │  ⌂ Home  │  [Session Tab 1]  [Session Tab 2]  [+]  │  Claude 3.5 Opus ▼  │  Agent: Code ▼  │  ↑⬦  │  ← Action bar (36px)
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Desktop (macOS — native menu bar + action bar)

```
      HeniossAI  Session  Project  Model  View  Window  Help                                    ← Native macOS menu bar
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  DEV  │  ⌂ Home  │  [Session Tab 1]  [Session Tab 2]  [+]  │  Claude 3.5 Opus ▼  │  Agent: Code ▼  │  ↑⬦  │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Web / Narrow viewport (collapsed menu bar)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  ☰  │  DEV  │  ⌂ Home  │  [Session Tab 1]  [Session Tab 2]  [+]  │  Claude 3.5 ▼  │  Agent ▼  │  ↑⬦  │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Notes on the action bar:**
- **DEV** — Channel indicator (DEV/BETA). Only shown on non-production channels. On production builds, this space is empty or replaced by a small application icon.
- **⌂ Home** — Toggles the Home view. Tooltip shows `⌘B`.
- **[Tabs]** — Draggable session/draft tab strip.
- **+** — New Session button. Tooltip shows `⌘⇧S`.
- **Claude 3.5 Opus ▼** — Model selector dropdown. Shows current model name. Click opens a dropdown to switch models quickly without opening the full Model menu. This is a convenience shortcut; the full Model menu has all options.
- **Agent: Code ▼** — Agent selector dropdown. Same pattern — quick-switch without opening the menu.
- **↑⬦** — Update pill. Only shown when an update is available.

---

## Deliverable 2: Every Menu Rendered

### HeniossAI *(macOS native — NOT rendered in-app)*

On macOS, this is the native application menu:

```
HeniossAI                     About HeniossAI
                              ──────────────
                              Check for Updates...
                              ──────────────
                              Settings...                    ⌘,
                              ──────────────
                              Export Logs...
                              ──────────────
                              Hide HeniossAI                 ⌘H
                              Hide Others                    ⌥⌘H
                              Show All
                              ──────────────
                              Quit HeniossAI                 ⌘Q
```

On Windows/Linux, the Settings item appears at the bottom of the Session menu instead. The remaining items (About, Check for Updates, Export Logs, Quit) are shown in a collapsed "HeniossAI" submenu of the first menu item or in the Help menu.

**Visual statistics:** 8 items + 4 separators. Standard macOS app menu. No changes from convention.

---

### Session

```
Session                       New Session                    ⌘⇧S
                              New Draft                      ⌘T ⌘N
                              Close Tab                      ⌘W
                              Reopen Closed Tab              ⌘⇧T
                              ──────────────
                              Undo                           ⌘⇧Z
                              Redo                           ⌘⇧Y
                              Compact
                              ──────────────
                              Fork...
                              Share
                              Unshare
                              ──────────────
                              Archive                        ⌘⇧⌫
                              Delete...
                              ──────────────
                              Settings...                    ⌘,
```

**Visual statistics:** 13 items + 5 separators = 6 groups.

**Group structure:**
1. **Create/Manage tabs** — New Session, New Draft, Close Tab, Reopen Closed Tab (4)
2. **Session history** — Undo, Redo, Compact (3)
3. **Collaboration** — Fork, Share, Unshare (3)
4. **Destructive** — Archive, Delete (2)
5. **Configuration** — Settings (1)

**Keybind display note:** `⌘⇧Z` and `⌘⇧Y` for Undo/Redo are chosen to avoid collision with text Undo (`⌘Z`). The text and session undo systems are independent.

**Critical review:** 13 items is within the comfortable range (10-15). The 5 separators create clear, scannable groups. No group has more than 4 items, preventing cognitive overload within any single section. Settings at the bottom is a well-established convention (File > Settings in most apps).

---

### Project

```
Project                       Open Project...                 ⌘O
                              Open File...                    ⌘P
                              ──────────────
                              Workspace Toggle
                              ──────────────
                              Previous Project                ⌘⌥↑
                              Next Project                    ⌘⌥↓
```

**Visual statistics:** 5 items + 2 separators = 3 groups.

**Group structure:**
1. **Open** — Open Project, Open File (2)
2. **Workspace** — Workspace Toggle (1)
3. **Navigation** — Previous Project, Next Project (2)

**Critical review:** At 5 items, this is a compact but complete menu. Every item is meaningful and distinct. The Workspace Toggle sits alone in its group because it's a configuration toggle, distinct from "opening" and "navigating." This could feel sparse, but the three-group structure is logical. If additional project-level features are added later (Manage Repositories, Project Settings, etc.), they slot naturally into the "Open" or a new "Configure" group.

---

### Model

```
Model                         Select Model...                 ⌘'
                              Cycle Variant                  ⇧⌘D
                              Cycle Agent                     ⌘.
                              Cycle Agent (Reverse)          ⇧⌘.
                              ──────────────
                              Manage Models...
                              Connect Provider...
                              Switch Server...
```

**Visual statistics:** 7 items + 1 separator = 2 groups.

**Group structure:**
1. **Selection & cycling** — Select Model, Cycle Variant, Cycle Agent, Cycle Agent (Reverse) (4)
2. **Configuration** — Manage Models, Connect Provider, Switch Server (3)

**Critical review:** 7 items is the shortest menu (tied with Window at 3-5 items). This is intentional and correct. The menu represents HeniossAI's core differentiator, not its largest surface area. Two clear groups: "pick your AI" and "configure your AI stack." The thinness is acceptable because:
- These items have the highest per-item value of any menu
- The menu will grow as AI capabilities expand (custom agents, model presets, etc.)
- A short, focused menu is more scannable than a long one with filler

---

### View

```
View                          Home                           ⌘B
                              ──────────────
                              Explorer Panel                 ⌘⇧E
                              Preview Panel                  ⌘⇧P
                              File Tree                      ⌘\
                              Terminal                       ⌃`
                              Review                         ⌘⇧R
                              ──────────────
                              Back                           ⌘[
                              Forward                        ⌘]
                              ──────────────
                              Previous Session               ⌥↑
                              Next Session                   ⌥↓
                              Previous Unseen Session       ⇧⌥↑
                              Next Unseen Session           ⇧⌥↓
                              Previous Message               ⌘⌥[
                              Next Message                   ⌘⌥]
                              ──────────────
                              Command Palette                ⌘K ⌘⇧P
                              Input Focus                    ⌃L
                              ──────────────
                              Toggle Full Screen             ⌃⌘F
```

**Visual statistics:** 16 items + 6 separators = 7 groups.

**Group structure:**
1. **Home** — Home (1)
2. **Panels** — Explorer Panel, Preview Panel, File Tree, Terminal, Review (5)
3. **History** — Back, Forward (2)
4. **Session navigation** — Previous/Next Session, Unseen, Previous/Next Message (6)
5. **Commands** — Command Palette, Input Focus (2)
6. **Display** — Full Screen (1)

**Critical review:** 16 items is the longest menu. This is the most crowded menu in the bar. The question is whether this menu needs to be split.

**Could View be split?** Possibilities:
- Split navigation (groups 3 + 4) into a new "Navigate" menu → restores the original `Go` menu I removed. This would reduce View to 9 items.
- Split panels (group 2) into a new "Panel" or "Window" menu → Over-fragmentation. 5 panel toggles do not justify their own menu.

**Recommendation:** Keep View at 16 items. The 6 separators create 7 clearly visible groups. Users scanning the menu can visually skip to the section they need (e.g., "I want Back" → third group, "I want Terminal" → second group). The grouping is logical and hierarchical. Splitting would require creating a thin "Navigate" menu (8 items) that would feel like the old `Go` menu which was removed for good reason.

**If during implementation user testing shows the View menu feels too long**, the navigation section (groups 3 + 4, 8 items) can be extracted into a "Navigate" menu as a contingency. This is a one-line change in the menu definition.

---

### Window *(Desktop only)*

```
Window                        Minimize                       ⌘M
                              Zoom
                              ──────────────
                              Close Window                   ⌘⇧W
```

**Visual statistics:** 3 items + 1 separator = 2 groups.

**Group structure:**
1. **Sizing** — Minimize, Zoom (2)
2. **Closing** — Close Window (1)

**Critical review:** The thinnest menu. Acceptable — this is a platform convention menu, not a content menu. On macOS, it maps to the native `windowMenu` role. On Windows/Linux, it provides essential window operations. Hidden entirely in web mode.

On macOS, by convention, the Window menu also lists open windows at the bottom. The native framework handles this automatically.

---

### Help

```
Help                          Search Commands...              ⌘K ⌘⇧P
                              ──────────────
                              Documentation
                              Support Forum
                              Share Feedback
                              Report a Bug
                              ──────────────
                              Release Notes...
                              Export Logs...
```

**Visual statistics:** 7 items + 2 separators = 3 groups.

**Group structure:**
1. **Search** — Search Commands (1) — opens command palette
2. **External resources** — Documentation, Support Forum, Share Feedback, Report a Bug (4) — HTTP links
3. **App diagnostics** — Release Notes, Export Logs (2)

**Critical review:** Well-balanced. Three clear groups: "find a command," "get help," "app diagnostics." External links are clearly identified as such (no keybinds, no ellipsis). Release Notes and Export Logs move from "only in the desktop menu" to discoverable.

**Note:** Documentation/Support Forum/Feedback/Bug Report are links that open in the user's browser. They should display either no keybind or a subtle "↗" icon indicating external navigation.

---

## Deliverable 3: Visual Balance Review

### Menu length comparison

```
Menu         Items    Separators    Groups    Assessment
─────────────────────────────────────────────────────────────
HeniossAI      8         4           5        Standard macOS; no change
Session       13         5           6        Comfortable range
Project        5         2           3        Compact; correct
Model          7         1           2        Short; correct by design
View          16         6           7        Longest; acceptable
Window         3         1           2        Thin; platform convention
Help           7         2           3        Well-balanced
```

### Balance assessment

**Is any menu too long?** View at 16 items is the longest. 7 clear groups keep it scannable. If user testing finds it overwhelming, extract navigation (groups 3-4, Back/Forward + session nav, 8 items) into a "Navigate" menu. This is a low-risk contingency.

**Is any menu too short?** Window at 3 items. This is acceptable because it's a platform convention menu, not a content menu. Model at 7 items is the shortest "content" menu — justified because these are the highest-signal items for HeniossAI's identity.

**Are separators well placed?** Yes. Every separator creates a logically coherent group. No group mixes unrelated items. No group has more than 6 items (View's session navigation group has 6 — borderline but acceptable because they form a clear visual unit).

**Is visual weight balanced?** Session (13 items) and View (16 items) carry the bulk of functionality. Project (5), Model (7), and Help (7) are lighter. This distribution is correct:
- Session is the primary artifact — it should be the largest menu
- View controls the workspace experience — it should be the second largest
- Project, Model, and Help are focused, targeted menus

**Are menu names concise?** All 7 names are single words. No hyphenation, no compounding. 4-9 characters each:
- Session (7)
- Project (7)
- Model (5)
- View (4)
- Window (6)
- Help (4)
- HeniossAI (9) — only on macOS; required by convention

**Are related commands grouped naturally?** Yes. Each menu's groups are internally consistent:
- Session: create, manipulate, collaborate, destroy, configure
- Project: open, configure, navigate
- Model: select, configure
- View: home, panels, history, navigate, commands, display
- Window: sizing, closing
- Help: search, resources, diagnostics

**Does it feel like a professional desktop application rather than an IDE clone?** Yes. The removal of "File," "Edit," and "Go" eliminates the three most generic IDE conventions. Their replacements — "Session," "Project," "Model" — are HeniossAI-native concepts. The resulting menu bar reads as a tool for AI-assisted software development, not a general-purpose code editor.

### What would a user who knows VS Code see?

| VS Code Menu | HeniossAI Menu | Same? |
|---|---|---|
| File | (removed) | No |
| Edit | (removed) | No |
| Selection | (removed) | No |
| View | View | Same name, different contents |
| Go | (removed) | No |
| Run | (removed) | No |
| Terminal | (removed) | No |
| Help | Help | Same |

The only shared menu name is **View** (which is nearly universal across all software) and **Help** (ditto). This is strong evidence that the menu bar does not imitate VS Code.

---

## Deliverable 4: Future Scalability Review

### How the hierarchy accommodates new concepts

```
Current:    Session │ Project │ Model │ View │ Window │ Help
```

#### Mission (future)

A "Mission" is a long-running AI task spanning multiple sessions (e.g., "implement user authentication," "fix all TypeScript errors").

**Natural home:** New top-level menu between Session and Project, or a submenu within Session.

```
Session │ Mission │ Project │ Model │ View │ Window │ Help
```

If Missions become a first-class concept with their own UI (status dashboard, timeline, logs), they justify a top-level menu. If they are lightweight session groupings, they fit as a Session submenu.

**Scalability assessment:** The hierarchy naturally extends. Session is the "active conversation" menu; Mission would be the "orchestrated work" menu. The gap between Session and Project is the right insertion point.

#### Reviews

HeniossAI already has a Review panel (git diff review, inline comments). The `review.toggle` command exists in View.

**Natural home:** Review could remain in View's Panels group. If Reviews grow into a full workflow (assign reviewers, approve/reject, track review history), they justify a top-level menu.

```
Session │ Project │ Review │ Model │ View │ Window │ Help
```

**Scalability assessment:** No change needed today. Review stays in View. The hierarchy can promote it to top-level when the feature complexity warrants it.

#### Knowledge

A "Knowledge" concept (project-wide context, documentation index, learned patterns, custom rules).

**Natural home:** Submenu within Project, or a new top-level menu if Knowledge becomes a standalone feature with its own editor/browser.

```
Session │ Project │ Knowledge │ Model │ View │ Window │ Help
```

**Scalability assessment:** Knowledge naturally associates with Project (it's project-scoped knowledge). Starting as a Project submenu is appropriate. Promotion to top-level is possible if Knowledge becomes a rich browser/editor.

#### Domains

A "Domain" is a collection of related projects or a bounded context (e.g., "frontend," "backend," "microservice-a").

**Natural home:** A persistent dropdown in the action bar (like the Model and Agent selectors), or a new section at the top of the Project menu.

**Scalability assessment:** Domains are essentially a grouping layer above Projects. They would most naturally appear in the Project menu ("Open Domain >") or as a selector in the action bar. No top-level menu needed.

#### Memory

"Memory" is persistent context that the AI retains across sessions (user preferences, learned patterns, project conventions).

**Natural home:** Submenu within Model (it's an AI capability), or a new section in Settings.

**Scalability assessment:** Memory is an AI configuration concern, which places it under Model. If Memory grows to include a rich browser/editor (view, search, edit stored memories), it could justify its own top-level menu:

```
Session │ Project │ Model │ Memory │ View │ Window │ Help
```

### Long-term capacity

The current hierarchy has **6 content menus** (excluding the macOS app menu). This gives HeniossAI room to grow to approximately **9-10 top-level menus** before the bar becomes overwhelming.

New top-level menus would be added at these natural insertion points:

```
  Session │ [Mission] │ Project │ [Review] │ [Knowledge] │ Model │ [Memory] │ View │ Window │ Help
```

This provides 3-4 slots for future major features without exceeding the comfortable maximum of 10 menus.

### Backward compatibility

When a new feature graduates from submenu to top-level menu:
- The old submenu path continues to work (backward compatible)
- Users discover the new top-level menu naturally
- Keyboard shortcuts remain unchanged
- The action bar can optionally show quick-access toggles

### Classification of future concepts

| Concept | Initial home | Top-level trigger | Timeline |
|---|---|---|---|
| Mission | Session submenu | When Missions get their own UI (dashboard, logs) | Medium-term (6-12 months) |
| Reviews | View panel toggle | When Reviews get a full workflow (assign, approve) | Already partially exists |
| Knowledge | Project submenu | When Knowledge gets a browser/editor | Long-term (12-24 months) |
| Domains | Action bar dropdown | When Domain management UI is built | Long-term |
| Memory | Model submenu | When Memory gets a browser/editor | Long-term |

### Verdict on scalability

The proposed 7-menu hierarchy can comfortably accommodate all foreseeable feature growth for the next 2-3 years without requiring a restructuring. The menu bar is designed with natural insertion points and a clear promotion path from submenu to top-level.

---

## Implementation-Ready Specification

All design validation is complete. The menu bar is ready for implementation as Phase 2.

Summary of final architecture:

```
7 menus     HeniossAI (macOS) │ Session │ Project │ Model │ View │ Window │ Help
Total items 56                (8)      (13)       (5)      (7)    (16)     (3)    (7)
Total separators: 21
Average items per menu: 8
Shortest menu: Window (3)
Longest menu: View (16)
```

No submenus. Every item is a direct menu entry. Every item maps to an existing command. No invented features. No backend changes required.
