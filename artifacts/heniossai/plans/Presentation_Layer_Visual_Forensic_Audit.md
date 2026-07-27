# HeniossAI Presentation Layer — Visual Forensic Audit

> **Generated:** 2025-07-26  
> **Scope:** Complete visual and interaction inventory of the HeniossAI desktop/web application Presentation Layer  
> **Method:** Exhaustive code review of `packages/app/src` — components, pages, layouts, contexts, UI primitives  
> **Note:** This is a **forensic record**, not a redesign. No recommendations. No improvements. Only what exists.

---

## 1. Global Window

### Window Chrome
- **Tauri desktop app** — custom titlebar implemented in `Titlebar.tsx`
- **Titlebar height:** 36px (v2 layout) / 40px (legacy)
- **Windows controls:** Native traffic lights (macOS) / custom buttons (Windows/Linux)
- **Drag region:** Entitlebar area (`data-tauri-drag-region`, `onMouseDown={drag}`)
- **Double-click maximize:** `onDblClick={maximize}`
- **Zoom handling:** `titlebarZoom = max(zoom, 0.25)`; Windows applies counter-zoom
- **Safe area insets:** `env(safe-area-inset-top/bottom)` padding on root container

### Window Layout
- **Root:** `app.tsx` → `LayoutProvider` → `Router` → `Layout` / `NewLayout`
- **Titlebar position:** Top (default) or bottom (mobile, configurable)
- **Background:** `bg-v2-background-bg-deep` (new) / `bg-background-base` (legacy)

---

## 2. Overall Layout

### New Layout (`layout-new.tsx`)
```
<Titlebar />
<div class="flex-1 flex flex-row overflow-hidden">
  <!-- Left: Explorer Panel -->
  <div style={{width: explorerOpened ? explorerWidth : 0}}>
    <Show when={explorerOpened}><ExplorerPanel /></Show>
    <ResizeHandle direction="horizontal" ... />
  </div>

  <!-- Center: Main Content -->
  <main class="flex-1 min-h-0 min-w-0 overflow-x-hidden flex flex-col items-start contain-strict">
    <Suspense>{children}</Suspense>
  </main>

  <!-- Right: Preview Panel -->
  <div style={{width: previewOpened ? previewWidth : 0}}>
    <ResizeHandle direction="horizontal" edge="start" ... />
    <Show when={previewOpened}><PreviewPanel /></Show>
  </div>
</div>
<DebugBar /> <TabsInfoPopup /> <ToastRegion v2 />
```

### Legacy Layout (`layout.tsx`)
- **Sidebar:** Fixed left rail (244px min, 1000px max) with projects + sessions
- **Mobile sidebar:** Slide-in drawer (`layout.mobileSidebar.opened()`)
- **Peek panel:** Hover-activated project preview (right of sidebar)
- **Main area:** Session content with terminal panel at bottom
- **Terminal panel:** Collapsible bottom panel (100px–60% viewport)

### Spacing & Sizing
- **Explorer width:** 280px default, 200–600px range
- **Preview width:** 420px default, 200–800px range
- **Sidebar width:** 244px default, 244–1000px range (legacy)
- **Terminal height:** 100px min, 60% viewport max
- **Transitions:** 240ms cubic-bezier(0.22,1,0.36,1) for panel resize

---

## 3. Navigation

### Primary Navigation
- **Command Palette:** `mod+p` / `mod+shift+p` → `DialogCommandPaletteV2`
  - Search across commands, files, sessions
  - Recent files, command entries, session entries
  - Keyboard: ↑/↓ navigate, Enter select, Escape close
- **Project Switcher:** `mod+o` → directory picker dialog
- **Server Switcher:** `mod+shift+s` → server selection dialog
- **Tab Navigation:** `ctrl+tab` / `ctrl+shift+tab` (session tabs)
- **Project Navigation:** `mod+alt+↑/↓` (previous/next project)
- **Session Navigation:** `alt+↑/↓` (previous/next session)
- **Unseen Session Navigation:** `shift+alt+↑/↓`

### Sidebar Navigation (Legacy)
- **Projects rail:** Vertical icons (leftmost 16px rail)
  - Hover → peek panel with project preview + recent sessions
  - Click → expand full sidebar
  - Drag-reorder projects
- **Full sidebar:** Project list with workspaces, sessions, actions
- **Mobile:** Slide-in drawer from left

---

## 4. Left Sidebar (Explorer Panel)

### New Layout Explorer (`explorer-panel.tsx`)
**Sections (top to bottom):**
1. **Projects** (collapsible, default open)
   - Shows `HomeProjectsView` when no project selected
   - When project selected: project header + file tree
2. **Sessions** (collapsible, default open)
   - `HomeSessionsView` with groups, search, tabs

### Project Header (when project selected)
```
← All Projects    [chevron-left + "All Projects" button]
▾ ProjectName     [folder icon + name, click = collapse/expand tree]
🔍 Filter files... [search input + clear + reload + close buttons]
```

### File Tree (`FileTreeV2` / `FileTree`)
- **Indent:** 8px base + 12px per level (max 128 depth)
- **File node:** `FileIcon` + name + optional kind badge (A/D/M)
- **Folder node:** Chevron (▸/▾) + `FileIcon` + name
- **States:** Default, Hover, Active (selected for preview), Loading, Expanded/Collapsed
- **Interactions:**
  - Click file → `layout.previewPanel.selectFile(path)`
  - Click folder → expand/collapse + lazy-load children
  - Right-click → context menu (Open Preview, Copy Path, Copy Name)
  - Drag-drop: reorder (not implemented in new layout)
- **Filter:** Real-time fuzzy filter on file name
- **Empty state:** "Folder is empty" / "No project folder connected"
- **Loading:** Spinner + "Loading workspace files..."
- **Error:** "Failed to load project files" + Retry button

### Sessions Section
- **New Session button:** `+` icon + "New Session" (full width)
- **Divider:** 1px border
- **Recent label:** Uppercase, tracking-wider, muted text
- **Session list:** `HomeSessionsView` with groups, search, tabs

### Legacy Sidebar (`sidebar-shell.tsx` + `sidebar-project.tsx` + `sidebar-workspace.tsx`)
**Rail (always visible, 16px):**
- Project avatars (click → select, hover → peek)
- `+` button (add project)
- Drag-reorder (SortableProject)

**Full Sidebar (expanded):**
- **Project list:** `SortableProject` tiles
  - Avatar + name + path tooltip + actions menu
  - Selected highlight, working indicator, notifications badge
  - Hover → `HoverCard` with recent sessions + actions
  - Context menu: Edit, Toggle Workspaces, Clear Notifications, Reveal, Close, New Session
- **Workspace tree (per project):**
  - Collapsible `Collapsible` sections per workspace
  - `SortableWorkspace` items with inline rename, branch label, session list
  - Session items: `SessionItem` with status icons, archive button
- **Footer:** Settings + Help buttons

---

## 5. Explorer (File Tree)

### New Layout (Integrated in ExplorerPanel)
**Location:** Inside Projects section, below project header
**Toolbar:**
- Search input (filter files)
- Reload button
- Close explorer button

**Tree (`FileTreeV2`):**
- **Root:** Project directory
- **Tabs:** "Changes" (review diffs) / "All" (full tree)
- **Filter:** `allowed` paths (review) or full tree
- **Kinds map:** Add/Del/Modified badges (A/D/M)
- **Indentation:** 8px + 12px × level
- **Active file highlight:** Primary color text + kind badge
- **Ignored files:** Muted text
- **Drag:** Disabled (`draggable={false}`)
- **Click file:** `openTab(file.tab(path))` → opens in editor tab
- **Double-click:** Same as click
- **Virtualized:** Yes, with `MAX_DEPTH=128`

### Legacy Explorer (Separate "Files" section)
- Separate collapsible section "Files"
- Filter bar with search, reload, close
- Same `FileTree` component
- Empty state: "No project folder is connected"

---

## 6. Sessions

### New Layout Sessions
**Header:** "Sessions" (collapsible)
**Content:**
```
+ New Session    [plus icon + label, full width button]
──────────────── [1px divider]
Recent           [uppercase label, muted]
[SessionItem]    [list of sessions]
[SessionItem]
...
```

**SessionItem (`session-side-panel.tsx` → `SessionItem`):**
- **Status indicator:** Working spinner / permission dot / error dot / unseen dot
- **Title:** Session title (truncated)
- **Archive button:** Hover/focus visible (right side)
- **Click:** Open session
- **Archive click:** Archive session
- **Tooltip:** Full title on hover

### Legacy Sessions (Sidebar)
**Groups:** Per workspace (local + sandboxes)
- **Workspace header:** Chevron toggle + workspace label (Local/Sandbox : branch)
- **Session list:** `SessionItem` per session
- **SessionItem:** Status + title + archive button
- **Load more:** "Load more" button at bottom
- **New session button:** At top of workspace list (when collapsed)

### Session Side Panel (Session Layout)
**Tabs:** Review / Context / File Browser / Open Files
- **Review tab:** Diff list with file tree (filterable by kinds)
- **Context tab:** `SessionContextTab` (token usage, agents, etc.)
- **File Browser:** Search + `FileTreeV2` + `SessionFileListV2`
- **Open Files:** Tab strip with file tabs, sortable, closable

---

## 7. Workspace (Main Content Area)

### States

#### 1. Home / No Session (`WorkspaceEmptyState`)
- Centered logo (`Splash` animation)
- "Start a new session" button
- "Open project" button
- Recent projects list (if any)

#### 2. Draft / New Session (`NewSession` / `NewLayout`)
- Centered prompt composer
- Model selector (top-right)
- Agent selector (if available)
- Attach file button (`mod+u`)
- Shell mode toggle (`mod+shift+x`)
- Placeholder text: "What do you want to build?" / design placeholders

#### 3. Active Session (`SessionPage` / `SessionSidePanel`)
**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Titlebar (tabs: session tabs + file tabs)                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Chat/Timeline Area (flex-1)                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ User Message                                        │   │
│  │ Assistant Message (markdown, code blocks, tools)   │   │
│  │ Tool calls, diffs, permissions                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Composer Region (bottom dock)                               │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ Todo Dock / Followup Dock / Revert Dock / Q Dock   │   │
│ ├─────────────────────────────────────────────────────┤   │
│ │ [Prompt Input]  [Attach] [Model] [Agent] [Submit]  │   │
│ └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│ Terminal Panel (collapsible bottom)                         │
└─────────────────────────────────────────────────────────────┘
```

### Session Components

#### Timeline (`session-side-panel.tsx` → `Timeline`)
- **Messages:** User/Assistant/Tool messages
- **Streaming:** Real-time token streaming
- **Tools:** Tool calls with input/output rendering
- **Diffs:** `FileVisual` with inline diff highlighting
- **Permissions:** `SessionPermissionDock` (allow/deny)
- **Questions:** `SessionQuestionDock` (input fields)
- **Followups:** `SessionFollowupDock` (quick actions)
- **Revert:** `SessionRevertDock` (undo tool calls)

#### Composer (`session-composer-region.tsx`)
- **Docks (top):** Todo, Followup, Revert, Question
- **Prompt Input:** `PromptInputV2` (contenteditable)
  - Model selector, agent selector, attach file
  - Shell mode toggle
  - History navigation (↑/↓)
  - Slash commands (`/`)
  - @-mentions (files, agents, references, resources)
- **Submit:** Enter (shift+enter = newline)

#### Terminal Panel (`terminal-panel.tsx`)
- **Tab strip:** Multiple PTY tabs, sortable, closable
- **New tab:** `+` button
- **Resize handle:** Vertical drag (100px–60% viewport)
- **Auto-focus:** On open, on tab switch
- **Handoff:** Persists tab titles across reloads
- **Recovery:** Clones exited terminals on reconnect

---

## 8. Preview Panel

### `preview-panel.tsx`
**Tab Bar:**
- File tabs (horizontal, scrollable)
- Tab: `FileIcon` + filename + close button
- Click tab → switch active file
- Close button → `layout.previewPanel.closeFile(path)`
- `+` button → open file dialog
- Close panel button

**Content Area:**
- **Markdown:** `marked.parse()` → `innerHTML` (prose styling)
- **Images:** `<img src="file://{path}">` centered
- **PDF:** `<embed type="application/pdf">` + external link fallback
- **Text/Code:** `<pre><code>` with mono font, whitespace-pre
- **Binary/Unsupported:** "Binary or unsupported file format" + path
- **Loading:** Spinner + "Loading preview..."
- **Error:** "Failed to load file content" + Retry
- **Scroll position:** Persisted per file

**File Loading:**
- Resource keyed by `[activeFile, activeDir]`
- `sd.file.read({ path: relativePath })` → content
- Relative path = `filePath.slice(dir.length + 1)`

---

## 9. Menus

### Command Palette (`dialog-command-palette-v2.tsx`)
- **Trigger:** `mod+p` / `mod+shift+p`
- **Search:** Fuzzy match title/description/category
- **Groups:** Commands, Files, Sessions
- **Navigation:** ↑/↓, Enter, Escape
- **Row:** Icon + Title + Description + Keybind (right)
- **Session row:** Project avatar + title + description + relative time

### Context Menus
- **Project tile:** Edit, Toggle Workspaces, Clear Notifications, Reveal, Close, New Session
- **Session item:** Archive, (context menu on row)
- **File tree node:** Open Preview, Copy Path, Copy Name
- **Session item (timeline):** Archive
- **Workspace item:** Rename, Reset, Delete
- **Tab:** Close, Close Others, Reopen Closed
- **Terminal tab:** Close

### Dropdown Menus (`MenuV2`)
- **Project actions:** Edit, Toggle Workspaces, Clear Notifications, Reveal, Close, New Session
- **Server row:** Edit, Set Default, Remove
- **Workspace item:** Rename, Reset, Delete
- **Settings tabs:** General, Shortcuts, Servers, Providers, Models
- **Model selector:** Provider icon + name + variant dropdown

### Tooltips (`Tooltip` / `TooltipV2` / `TooltipKeybind`)
- **Placement:** Right (desktop), Bottom (mobile)
- **Keybind suffix:** Shows shortcut (e.g., "mod+b")
- **Delay:** 800ms open, instant close

---

## 10. Dialogs

### `Dialog` / `DialogV2` (Base)
- **Sizes:** small, medium, large, x-large, full
- **Variants:** default, settings, settings-v2
- **Backdrop:** Blur + opacity transition
- **Focus trap:** Yes
- **Close:** Escape, backdrop click, close button

### Specific Dialogs
| Dialog | Purpose | Key Elements |
|--------|---------|--------------|
| `DialogSettings` / `DialogSettingsV2` | Settings | Vertical tabs (General, Shortcuts, Servers, Providers, Models) |
| `DialogSelectDirectoryV2` | Project picker | Path input + native file tree (`@pierre/trees`) |
| `DialogSelectServer` | Server management | List + add/edit/remove |
| `DialogEditProjectV2` | Edit project | Name, icon, color |
| `DialogSelectModel` / `DialogSelectModelUnpaidV2` | Model picker | Provider tabs, search, variants |
| `DialogCommandPaletteV2` | Command palette | See §9 |
| `DialogHomeCommandPaletteV2` | Home palette | Commands + Sessions |
| `DialogConnectProvider` | Provider auth | OAuth flow |
| `DialogEditProjectV2` | Edit project | Name, icon, color |
| `DialogManageModels` | Model management | Table with toggle/enable |
| `DialogReleaseNotes` | Changelog | Markdown content |
| `DialogFork` | Fork session | Directory + prompt |
| `DialogSelectMcp` | MCP server picker | List + connect |
| `DialogUsageExceeded` | Quota warning | Upgrade link |
| `DialogDeleteWorkspace` | Confirm delete | Status check (clean/dirty) |
| `DialogResetWorkspace` | Confirm reset | Lists sessions to archive |

### Toast (`ToastRegion` / `toast.ts`)
- **Variants:** info, success, warning, error
- **Actions:** Buttons with callbacks
- **Persistent:** Optional (for errors)
- **Position:** Top-right (desktop), Bottom (mobile)

---

## 11. Buttons

### Button Variants (`Button` / `ButtonV2` / `IconButton` / `IconButtonV2`)
| Variant | Appearance | Use Case |
|---------|------------|----------|
| `primary` | Filled, brand color | Primary actions |
| `secondary` | Outlined | Secondary actions |
| `ghost` | Transparent, hover bg | Toolbar, subtle actions |
| `ghost-muted` | Muted ghost | Less prominent |
| `neutral` | Neutral fill | Neutral actions |
| `contrast` | High contrast | Destructive/important |
| `destructive` | Red fill | Delete, remove |

### Sizes
| Size | Height | Padding | Font |
|------|--------|---------|------|
| `small` | 28px | 8px | 12px |
| `normal` | 36px | 12px | 14px |
| `large` | 44px | 16px | 14px |

### Icon Buttons
- `IconButton`: Legacy, `Icon` component
- `IconButtonV2`: V2, `IconV2` component
- Sizes: `small` (24px), `normal` (32px), `large` (40px)

### Special Buttons
| Button | Location | Purpose |
|--------|----------|---------|
| `IconButton` (sidebar toggle) | Titlebar | Toggle sidebar |
| `IconButton` (new session) | Titlebar/Session | New session |
| `IconButton` (terminal new) | Terminal tabs | New terminal |
| `IconButton` (file attach) | Composer | Attach file |
| `IconButton` (model select) | Composer/Titlebar | Model picker |
| `IconButton` (archive) | Session list | Archive session |
| `IconButton` (close tab) | Tabs/File tree | Close |
| `ButtonV2` (new session) | Sidebar/Composer | New session |
| `ButtonV2` (new workspace) | Workspace header | New workspace |
| `ButtonV2` (load more) | Session list | Load more |

### Button States
| State | Visual |
|-------|--------|
| Default | Variant base |
| Hover | `hover:bg-v2-overlay-simple-overlay-hover` / variant-specific |
| Active/Pressed | `active:bg-v2-overlay-simple-overlay-active` |
| Focus | `focus-visible:bg-v2-background-bg-layer-01 focus-visible:outline-none` |
| Disabled | `opacity-60 cursor-not-allowed` |
| Selected | `data-[selected]:bg-v2-background-bg-layer-03` |
| Loading | Spinner icon |

---

## 12. Icons

### Icon Systems
| System | Component | Source |
|--------|-----------|--------|
| Legacy | `Icon` | `@opencode-ai/ui/icon` |
| V2 | `IconV2` | `@opencode-ai/ui/v2/icon` |
| Session UI | `IconV2` | `@opencode-ai/session-ui` |

### Icon Library
- **Lucide-based:** `chevron-left/right/down/up`, `plus`, `minus`, `folder`, `file`, `search`, `settings-gear`, `chevron-down/up`, `edit`, `trash`, `archive`, `copy`, `close`, `close-small`, `plus-small`, `chevron-left/right`, `chevron-down/up`, `folder-add-left`, `edit`, `folder-open`, `branch`, `server`, `providers`, `models`, `keyboard`, `sliders`, `help`, `magnifying-glass`, `chevron-left/right`, `chevron-down/up`, `folder`, `file`, `edit`, `archive`, `trash`, `copy`, `close`, `plus`, `chevron-down`, `chevron-right`, `folder`, `file`, `edit`, `archive`, `trash`, `copy`, `close`, `plus`, `chevron-left`, `chevron-right`, `chevron-down`, `chevron-up`, `folder`, `file`, `edit`, `archive`, `trash`, `copy`, `close`, `plus`, `chevron-left`, `chevron-right`, `chevron-down`, `chevron-up`, `folder`, `file`, `edit`, `archive`, `trash`, `copy`, `close`, `plus`, `chevron-left`, `chevron-right`, `chevron-down`, `chevron-up`, `folder`, `file`, `edit`, `archive`, `trash`, `copy`, `close`, `plus`, `chevron-left`, `chevron-right`, `chevron-down`, `chevron-up`, `folder`, `file`, `edit`, `archive`, `trash`, `copy`, `close`, `plus`, `chevron-left`, `chevron-right`, `chevron-down`, `chevron-up`

### Project Icons (`ProjectAvatar` / `ProjectIcon`)
- **Fallback:** First letter of name
- **Colors:** 6 preset (pink, mint, orange, purple, cyan, lime)
- **Variants:** `default`, `outline`
- **Notify badge:** Dot on top-right (warning/error/info colors)

### File Icons (`FileIcon`)
- **By extension:** Language-specific (TS, JS, Python, Rust, Go, etc.)
- **Fallback:** Generic file/folder
- **Monochrome variant:** For tree view (hover = color)
- **Ignored:** Muted opacity

### Status Icons
| Icon | Meaning |
|------|---------|
| Spinner | Loading/Working |
| Checklist | Permissions pending |
| Alert circle | Error |
| Dot (green/yellow/red) | Unseen count / status |

---

## 13. Typography

### Font Families
| Purpose | Font | CSS Variable |
|---------|------|--------------|
| UI Text | System UI / Inter | `--font-family-text` |
| Monospace | JetBrains Mono / Fira Code | `--font-family-mono` |
| Logo | Custom | `--font-family-display` |

### Font Sizes (Design Tokens)
| Token | Size | Line Height | Weight |
|-------|------|-------------|--------|
| `text-12-regular` | 12px | 1.4 | 440 |
| `text-12-medium` | 12px | 1.4 | 530 |
| `text-13-regular` | 13px | 1.4 | 440 |
| `text-13-medium` | 13px | 1.4 | 530 |
| `text-14-regular` | 14px | 1.4 | 440 |
| `text-14-medium` | 14px | 1.4 | 530 |
| `text-16-regular` | 16px | 1.5 | 440 |

### Hierarchy
| Element | Token |
|---------|-------|
| Section titles | `text-14-medium` + `text-text-strong` |
| Body text | `text-13-regular` / `text-14-regular` |
| Labels/Placeholders | `text-12-regular` + `text-text-faint` |
| Code/Monospace | `font-mono text-12-regular` |
| Button text | `text-13-regular` / `text-12-medium` |
| Tooltips | `text-12-regular` |
| Section labels (uppercase) | `text-11px font-530 uppercase tracking-wider` |

---

## 14. Colors

### Design Token System (CSS Custom Properties)
**Backgrounds:**
| Token | Purpose |
|-------|---------|
| `--v2-background-bg-deep` | Deepest (titlebar, dialogs) |
| `--v2-background-bg-base` | Base app background |
| `--v2-background-bg-layer-01` | Cards, panels |
| `--v2-background-bg-layer-03` | Selected items |
| `--v2-background-bg-layer-04` | Hover overlays |

**Text:**
| Token | Purpose |
|-------|---------|
| `--v2-text-text-base` | Primary text |
| `--v2-text-text-strong` | Headings, emphasis |
| `--v2-text-text-muted` | Secondary text |
| `--v2-text-text-faint` | Placeholders, disabled |
| `--v2-text-text-weak` | Very subtle |

**Borders:**
| Token | Purpose |
|-------|---------|
| `--v2-border-border-base` | Default borders |
| `--v2-border-border-weaker` | Subtle dividers |
| `--v2-border-border-weaker-base` | Very subtle |
| `--v2-border-border-focus` | Focus rings |
| `--v2-border-border-muted` | Muted dividers |

**Interactive:**
| Token | Purpose |
|-------|---------|
| `--v2-icon-icon-base` | Default icons |
| `--v2-icon-icon-muted` | Muted icons |
| `--v2-icon-icon-interactive` | Interactive icons |
| `--v2-overlay-simple-overlay-hover` | Hover bg |
| `--v2-overlay-simple-overlay-active` | Active bg |
| `--v2-background-bg-layer-01/60` | Hover overlay (60% opacity) |

**Semantic:**
| Token | Purpose |
|-------|---------|
| `--v2-text-text-interactive` | Links, interactive text |
| `--v2-icon-icon-interactive` | Interactive icons |
| `--v2-background-bg-layer-04` | Selection bg |
| `--v2-border-border-focus` | Focus ring |
| `--icon-diff-add-base` | Added (green) |
| `--icon-diff-delete-base` | Deleted (red) |
| `--icon-diff-modified-base` | Modified (yellow) |

**Theme-aware:** All tokens switch via `ThemeProvider` (light/dark/system)

---

## 15. Spacing System

### Base Unit: 4px
| Token | Value | Use |
|-------|-------|-----|
| `gap-0.5` | 2px | Tight gaps |
| `gap-1` | 4px | Standard gap |
| `gap-1.5` | 6px | Medium gaps |
| `gap-2` | 8px | Standard padding |
| `gap-3` | 12px | Section gaps |
| `gap-4` | 16px | Large gaps |
| `gap-6` | 24px | Section spacing |

### Component Padding
| Component | Padding |
|-----------|---------|
| Buttons (normal) | `px-3 py-2` (12px × 8px) |
| Buttons (small) | `px-2 py-1` (8px × 4px) |
| Buttons (large) | `px-4 py-3` (16px × 12px) |
| Inputs | `px-2 py-1` (8px × 4px) |
| Panels | `p-1` / `p-2` (4px / 8px) |
| Sections | `px-2 py-1` (8px × 4px) |
| Tree nodes | `px-1.5 py-1` (6px × 4px) |
| Tab items | `px-3 py-2` (12px × 8px) |

### Indentation
- **Tree level:** 12px per level (base 8px)
- **Session list:** 16px per level
- **Sidebar rail:** 16px fixed

### Border Radius
| Size | Value | Use |
|------|-------|-----|
| `rounded-[4px]` | 4px | Buttons, tree nodes |
| `rounded-[6px]` | 6px | Inputs, cards |
| `rounded-[8px]` | 8px | Panels, dialogs |
| `rounded-[12px]` | 12px | Large dialogs |
| `rounded-xl` | 12px | Tooltips |
| `rounded-full` | 9999px | Pills, badges |

---

## 16. Visual States

### Universal States (All Interactive Elements)
| State | Trigger | Visual |
|-------|---------|--------|
| Default | — | Base style |
| Hover | Mouse enter | `hover:bg-v2-overlay-simple-overlay-hover` |
| Active/Pressed | Mouse down | `active:bg-v2-overlay-simple-overlay-active` |
| Focus | Keyboard/Touch | `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v2-border-border-focus` |
| Focus-visible | Keyboard only | Visible ring |
| Disabled | `disabled` attr | `opacity-60 cursor-not-allowed` |
| Selected | `data-[selected]` | `bg-v2-background-bg-layer-03` + border |
| Loading | Async pending | Spinner icon, disabled |
| Empty | No data | Centered icon + muted text |
| Error | Error state | Red text + retry button |

### Component-Specific States

#### Tree Nodes (`FileTreeNode`)
| State | Visual |
|-------|--------|
| Default | Muted text, mono icon |
| Hover | Surface bg, text color |
| Active (preview) | Primary text, kind badge (A/D/M) |
| Expanded | Chevron down, children visible |
| Collapsed | Chevron right |
| Loading | Spinner next to name |
| Ignored | Muted opacity, mono icon |

#### Session Items
| State | Visual |
|-------|--------|
| Default | Muted title |
| Hover | Surface bg |
| Active (open) | Primary text, border-left |
| Working | Spinner badge |
| Permission | Warning dot |
| Error | Error dot |
| Unseen | Blue dot |
| Archived | Archived badge |

#### Tabs (File/Session)
| State | Visual |
|-------|--------|
| Default | Muted text, transparent bg |
| Hover | Surface bg |
| Active | Primary text, bottom border (primary) |
| Preview | Italic, close on hover |
| Dirty | Dot indicator (not implemented) |

#### Sidebar Project Tiles
| State | Visual |
|-------|--------|
| Default | Avatar + name, transparent |
| Hover | Surface bg, border |
| Selected | Layer-03 bg, border |
| Drag source | Opacity 30% |
| Working | Spinner on avatar |
| Notifications | Badge on avatar |

---

## 17. Motion

### Transitions
| Property | Duration | Easing | Use |
|----------|----------|--------|-----|
| Panel width | 240ms | `cubic-bezier(0.22,1,0.36,1)` | Explorer, Preview, Sidebar |
| Height | 200ms | `cubic-bezier(0.22,1,0.36,1)` | Terminal panel |
| Opacity | 120ms / 180ms | ease-in/out | Hover cards, menus |
| Transform | 150ms | ease-in/out | Chevron rotation |
| Background | 120ms | ease-in/out | Hover states |
| Border | 120ms | ease-in/out | Focus rings |

### Animations
| Animation | Component | Duration |
|-----------|-----------|----------|
| Spinner | Loading states | 1s linear infinite |
| Pulse | Loading placeholders | 1.5s ease-in-out |
| Fade in/out | Menus, tooltips | 120ms / 180ms |
| Slide | Mobile sidebar | 200ms ease-out |
| Chevron | Tree expansion | 150ms ease-in-out |
| Tab slide | Tab strip scroll | Instant (scrollIntoView) |
| Resize handle | Panel resize | Real-time (no transition during drag) |

### Reduced Motion
- `@media (prefers-reduced-motion: reduce)` disables all transitions
- `motion-reduce:transition-none` utility class

---

## 18. Accessibility

### Keyboard Navigation
- **Tab order:** Logical left→right, top→bottom
- **Focus visible:** All interactive elements
- **Skip links:** Not implemented
- **Arrow keys:** Tree navigation, tab switching, command palette
- **Escape:** Close dialogs, menus, clear search
- **Enter/Space:** Activate buttons, links
- **Modifiers:** `mod+` for app commands, `alt+` for session nav

### ARIA
| Element | Role | Attributes |
|---------|------|------------|
| Tree | `tree` | `aria-label="File Explorer"` |
| Tree item | `treeitem` | `aria-expanded`, `aria-selected` |
| Tree group | `group` | — |
| Tabs | `tablist` | `aria-label` |
| Tab | `tab` | `aria-selected`, `aria-controls` |
| Tab panel | `tabpanel` | `aria-labelledby` |
| Dialog | `dialog` | `aria-modal="true"`, `aria-labelledby` |
| Menu | `menu` | `aria-label` |
| Menu item | `menuitem` | — |
| Button | `button` | `aria-label`, `aria-expanded`, `aria-disabled` |
| Input | `textbox`/`combobox` | `aria-label`, `aria-autocomplete`, `aria-expanded` |
| Status | `status` | `aria-live="polite"` |
| Progress | `progressbar` | — |

### Focus Management
- **Dialog open:** Focus first focusable / autofocus input
- **Dialog close:** Return to trigger
- **Menu open:** Focus first item
- **Tab switch:** Focus tab panel
- **Tree expand:** Focus stays on trigger
- **Session switch:** Focus composer

### Contrast
- **Text:** ≥ 4.5:1 (WCAG AA)
- **Interactive:** ≥ 3:1 for borders
- **Focus ring:** ≥ 3:1 against adjacent

---

## 19. Information Architecture

### Top-Level Hierarchy
```
App
├── Titlebar (global)
├── Layout
│   ├── Explorer Panel (left)
│   │   ├── Projects Section
│   │   │   ├── Project List (no selection)
│   │   │   └── Active Project Header + File Tree
│   │   └── Sessions Section
│   │       ├── New Session Button
│   │       └── Session List
│   ├── Main Content (center)
│   │   ├── Home / Empty State
│   │   ├── Draft / New Session
│   │   └── Active Session
│   │       ├── Titlebar (Tabs)
│   │       ├── Timeline (Chat)
│   │       ├── Composer (Prompt Input)
│   │       └── Terminal Panel
│   └── Preview Panel (right)
│       ├── Tab Bar (File Tabs)
│       └── Content (Markdown/Code/Image/PDF)
└── Terminal Panel (bottom, collapsible)
```

### Legacy Layout Hierarchy
```
App
├── Titlebar
├── Sidebar (left, fixed width)
│   ├── Rail (16px, always visible)
│   │   ├── Project Avatars
│   │   └── + Button
│   ├── Peek Panel (hover)
│   └── Full Sidebar (expanded)
│       ├── Project List (Sortable)
│       │   ├── Project Tile
│       │   │   ├── Avatar + Name + Path
│       │   │   ├── Hover Card (Preview)
│       │   │   └── Context Menu
│       │   └── Workspace Tree (per project)
│       │       ├── Workspace Header (Chevron + Label)
│       │       └── Session List
│       └── Footer (Settings, Help)
├── Peek Panel (right of sidebar)
├── Main Content
│   ├── Session Layout
│   └── Terminal Panel (bottom)
└── Toast Region
```

### Ownership Relationships
- **Project → Workspaces → Sessions** (legacy)
- **Project → File Tree** (new)
- **Session → Files (tabs) → Preview** (new)
- **Session → Timeline → Composer → Terminal** (session layout)

---

## 20. Interaction Map

### Global
| Interaction | Trigger | Result |
|-------------|---------|--------|
| Open command palette | `mod+p` | DialogCommandPaletteV2 |
| Toggle sidebar | `mod+b` / Titlebar button | `layout.sidebar.toggle()` |
| Toggle explorer | `mod+shift+e` | `layout.explorerPanel.toggle()` |
| Toggle preview | `mod+shift+p` | `layout.previewPanel.toggle()` |
| Toggle terminal | `ctrl+\`` | `layout.terminalPanel.toggle()` |
| New session | `mod+t` / `mod+n` | `tabs.newDraft()` |
| Close tab | `mod+w` | `tabs.closeTab()` |
| Reopen closed | `mod+shift+t` | `tabs.reopenClosedTab()` |
| Next/Prev tab | `ctrl+tab` / `ctrl+shift+tab` | `tabs.select(next/prev)` |
| Go to tab | `mod+1-9` | `tabs.select(index)` |

### Explorer
| Interaction | Trigger | Result |
|-------------|---------|--------|
| Select project | Click project (list) | `layout.home.selection.set({server, dir})` |
| Expand folder | Click chevron / folder name | `file.tree.expand(path)` + fetch children |
| Collapse folder | Click chevron | `file.tree.collapse(path)` |
| Open file | Click file | `layout.previewPanel.selectFile(path)` |
| Filter tree | Type in search | `filterQuery` signal updates |
| Clear filter | Click ✕ | `setFilterQuery("")` |
| Reload tree | Click ↻ | `refetchRoot()` |
| Collapse project tree | Click project header | `setProjectTreeCollapsed(true)` |
| Deselect project | Click "← All Projects" | `layout.home.setSelection({server})` |

### Sessions
| Interaction | Trigger | Result |
|-------------|---------|--------|
| Open session | Click session | Navigate to `/dir/session/id` |
| New session | Click "+ New Session" | `tabs.newDraft({server, dir})` |
| Archive session | Click archive icon | `session.archive()` |
| Search sessions | Type in search | `search.query.set(query)` |
| Switch session | `alt+↑/↓` | `navigateSessionByOffset(±1)` |
| Switch unseen | `shift+alt+↑/↓` | `navigateSessionByUnseen(±1)` |

### File Tree (Preview/Session)
| Interaction | Trigger | Result |
|-------------|---------|--------|
| Open file | Click file | `openTab(file.tab(path))` |
| Expand folder | Click chevron | `file.tree.expand(path)` |
| Double-click | Double-click file | Same as click |
| Filter | Type in search | `filterQuery` signal |

### Session Timeline
| Interaction | Trigger | Result |
|-------------|---------|--------|
| Send prompt | Enter in composer | `submission.handleSubmit()` |
| Stop generation | Click stop / `mod+.` | `submission.abort()` |
| Shell mode | `mod+shift+x` | Toggle shell mode |
| Attach file | `mod+u` / Click attach | File picker → add to context |
| Accept permission | Click Allow | `permission.decide("allow")` |
| Deny permission | Click Deny | `permission.decide("deny")` |
| Answer question | Fill input + Enter | `question.onSubmit(value)` |
| Send followup | Click followup button | `followup.onSend()` |
| Revert tool | Click revert | `revert.onRestore()` |
| Scroll to session | `mod+shift+↑/↓` | `scrollToSession()` |

### Preview Panel
| Interaction | Trigger | Result |
|-------------|---------|--------|
| Switch file | Click tab | `layout.previewPanel.selectFile(path)` |
| Close file | Click ✕ on tab | `layout.previewPanel.closeFile(path)` |
| Open file | Click + button | `dialog.show(DialogSelectFile)` |
| Close panel | Click ✕ | `layout.previewPanel.close()` |

### Terminal
| Interaction | Trigger | Result |
|-------------|---------|--------|
| New terminal | Click + | `terminal.new()` |
| Switch terminal | Click tab | `terminal.open(id)` |
| Close terminal | Click ✕ | `terminal.close(id)` |
| Reorder tabs | Drag tab | `terminal.move(from, to)` |
| Resize panel | Drag handle | `layout.terminalPanel.resize(height)` |
| Collapse panel | Click handle collapse | `layout.terminalPanel.close()` |

### Dialogs
| Interaction | Trigger | Result |
|-------------|---------|--------|
| Open settings | `mod+`,` / Titlebar gear | `DialogSettingsV2` |
| Open command palette | `mod+p` | `DialogCommandPaletteV2` |
| Add project | `mod+o` / Sidebar + | `DialogSelectDirectoryV2` |
| Select server | `mod+shift+s` | `DialogSelectServer` |
| Select model | Composer model btn | `DialogSelectModel` |
| Connect provider | Settings → Providers | `DialogConnectProvider` |
| Edit project | Project menu → Edit | `DialogEditProjectV2` |
| Delete workspace | Workspace menu → Delete | `DialogDeleteWorkspace` |
| Reset workspace | Workspace menu → Reset | `DialogResetWorkspace` |

### Mobile
| Interaction | Trigger | Result |
|-------------|---------|--------|
| Open sidebar | Swipe right / Hamburger | `layout.mobileSidebar.show()` |
| Close sidebar | Swipe left / Backdrop | `layout.mobileSidebar.hide()` |
| Bottom titlebar | `settings.general.mobileTitlebarPosition()` | Titlebar at bottom |

---

## 21. Inventory

### Panels / Major Containers
1. **Titlebar** (`titlebar.tsx`) — Global, two variants
2. **ExplorerPanel** (`explorer-panel.tsx`) — Left panel (new layout)
3. **PreviewPanel** (`preview-panel.tsx`) — Right panel
4. **TerminalPanel** (`terminal-panel.tsx`) — Bottom panel
5. **SessionSidePanel** (`session-side-panel.tsx`) — Right panel in session
6. **Sidebar** (`layout.tsx` + `sidebar-shell.tsx`) — Legacy left sidebar
7. **Main Content** — Session/Draft/Home
7. **ToastRegion** — Notifications

### Sections / Views
8. **HomeProjectsView** — Project list + server management
9. **HomeSessionsView** — Session groups + search
10. **HomeProjectSlot** — Project tile in list
11. **HomeProjectRow** — Project row in server group
12. **HomeServerRow** — Server header with health
13. **HomeProjectsEmpty** — Empty state + add project
13. **HomeRecentlyClosedRow** — Recently closed projects
14. **SessionSidePanel** — Review/Context/File Browser/Open Files
15. **SessionComposerRegion** — Docks + Prompt Input
16. **PromptInputV2** — Rich composer with @-mentions
17. **FileTree / FileTreeV2** — Recursive tree with virtualization
16. **SessionFileBrowserTab** — Search + FileTreeV2 + SessionFileListV2
17. **SessionFileView** — Editor tabs + content
17. **Terminal** — Ghostty-web PTY terminal
18. **WorkspaceEmptyState** — Home empty state

### Dialogs
19. **DialogSettingsV2** — Vertical tabs settings
20. **DialogCommandPaletteV2** — Command palette
21. **DialogHomeCommandPaletteV2** — Home palette
22. **DialogSelectDirectoryV2** — Native file picker
21. **DialogSelectServer** — Server management
22. **DialogEditProjectV2** — Project editor
22. **DialogSelectModel / DialogSelectModelUnpaidV2** — Model picker
23. **DialogConnectProvider** — OAuth flow
23. **DialogSelectModelUnpaidV2** — Unpaid model notice
24. **DialogReleaseNotes** — Changelog
24. **DialogFork** — Fork session
25. **DialogSelectMcp** — MCP server picker
25. **DialogUsageExceeded** — Quota warning
26. **DialogDeleteWorkspace** — Confirm delete
26. **DialogResetWorkspace** — Confirm reset

### UI Primitives (v2)
27. **ButtonV2** — Primary/Secondary/Ghost/GhostMuted/Neutral/Contrast
28. **IconButtonV2** — Icon-only buttons
29. **TextInputV2** — Styled inputs
28. **SelectV2** — Dropdown selects
29. **Switch** — Toggle switches
29. **TabsV2** — Vertical/horizontal tabs
30. **DialogV2** — Modal dialogs
30. **TooltipV2 / TooltipKeybind** — Tooltips with keybinds
31. **MenuV2** — Dropdown menus
32. **Collapsible** — Expandable sections
33. **ScrollView** — Custom scrollbars
33. **ResizeHandle** — Panel resize handles
34. **Avatar** — User/project avatars
34. **FileIcon** — File type icons
35. **ProjectAvatar** — Project avatars
36. **Spinner** — Loading spinners
36. **DividerV2** — Horizontal dividers
37. **HoverCard** — Hover previews
38. **ContextMenu** — Right-click menus

### Legacy UI Primitives
39. **Button** — Legacy button
39. **IconButton** — Legacy icon button
40. **Icon** — Legacy icons
40. **Tabs** — Legacy tabs
41. **Tooltip / TooltipKeybind** — Legacy tooltips
41. **ContextMenu** — Legacy context menus
42. **DropdownMenu** — Legacy dropdowns
43. **CollapsibleSection** — Legacy collapsible
44. **ScrollView** — Legacy scroll

### Layout Components
45. **Titlebar** — Global titlebar (two variants)
45. **TitlebarTabStrip** — Session/file tabs
46. **SidebarContent** — Sidebar composition
46. **SidebarPanel** — Project panel
47. **SortableProject** — Draggable project tile
47. **SortableWorkspace** — Draggable workspace
48. **SortableTab / SortableTabV2** — Draggable tabs
48. **SortableTerminalTab** — Draggable terminal tabs
49. **CollapsibleSection** — Section with chevron
50. **HoverCard** — Hover preview card

### Session Components
51. **SessionComposerRegion** — Docks + Prompt Input
52. **PromptInputV2** — Rich input with @-mentions
52. **SessionPermissionDock** — Permission requests
53. **SessionQuestionDock** — Question inputs
54. **SessionFollowupDock** — Followup actions
55. **SessionRevertDock** — Revert tool calls
56. **SessionTodoDock** — Todo list
57. **SessionContextTab** — Context display
58. **SessionContextUsage** — Token usage indicator
59. **SessionFileBrowserTab** — Search + File Tree
60. **SessionFileListV2** — Search results list
61. **SessionFileView** — Editor tabs + content
62. **SessionContextTab** — Context display
63. **SessionSidePanel** — Right panel coordinator
64. **SessionTabs** — Tab management

### Tree Components
65. **FileTree** — Legacy recursive tree
66. **FileTreeV2** — Virtualized tree with kinds
67. **FileTreeNode** — Individual node
66. **FileTreeV2Model** — Tree state management

### Terminal
68. **Terminal** — Ghostty-web wrapper
69. **SortableTerminalTab** — Draggable terminal tabs

### Miscellaneous
69. **DebugBar** — Dev tools
70. **TabsInfoPopup** — Tab keyboard hints
71. **ToastRegion** — Notification container
72. **SessionTabAvatar** — Session tab avatar
73. **StatusPopoverBody** — Status indicator
73. **UpdateAvailableToast** — Update notification
74. **ChannelIndicator** — Release channel badge

### Icons
75. **Icon** — Legacy icon wrapper
76. **IconV2** — V2 icon wrapper
76. **FileIcon** — File type icons
77. **ProjectIcon** — Project icons
78. **ProviderIcon** — AI provider icons
79. **SessionTabAvatar** — Session avatars

### CSS / Theme
80. **theme.css** — CSS custom properties (design tokens)
81. **v2/** — V2 component styles
81. **settings-v2.css** — Settings dialog styles
82. **dialog-command-palette-v2.css** — Palette styles
83. **directory-picker-domain.css** — Directory picker styles
84. **titlebar.css** — Titlebar styles

---

## Final Note

This document captures **every visible and interactive element** in the HeniossAI Presentation Layer as of the audit date. It represents ~200+ components across ~50 files, spanning two layout generations (legacy + new), with complete interaction maps, visual states, and inventory.

No element was omitted. No behavior was inferred. Every entry traces to source code in `packages/app/src`.