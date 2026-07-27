# HeniossAI Presentation Layer — Runtime Behavior Blueprint V4

> **Generated:** 2026-07-27  
> **V4 expansions (§51–§70):** Complete Runtime Architecture, Reactive Graph, State Ownership Map, Event Flow Atlas, Rendering Lifecycle, Component Lifecycle Atlas, Navigation Runtime, Runtime Interaction Pipeline, Runtime Provider Graph, Overlay Lifecycle, Session Runtime, Explorer Runtime, Preview Runtime, Composer Runtime, Terminal Runtime, Animation Runtime, Focus Management, Runtime Error Recovery, Runtime Performance Behavior, Final Runtime Blueprint  
> **Scope:** Every runtime behavior across `packages/app/src` — startup, rendering, reactivity, events, navigation, sessions, overlays, focus, performance  
> **Method:** Exhaustive source code review. No modifications. No recommendations. No improvements. Only what exists.

---

## Table of Contents

51. [Complete Runtime Architecture](#51-complete-runtime-architecture)
52. [Reactive Graph](#52-reactive-graph)
53. [State Ownership Map](#53-state-ownership-map)
54. [Event Flow Atlas](#54-event-flow-atlas)
55. [Rendering Lifecycle](#55-rendering-lifecycle)
56. [Component Lifecycle Atlas](#56-component-lifecycle-atlas)
57. [Navigation Runtime](#57-navigation-runtime)
58. [Runtime Interaction Pipeline](#58-runtime-interaction-pipeline)
59. [Runtime Provider Graph](#59-runtime-provider-graph)
60. [Overlay Lifecycle](#60-overlay-lifecycle)
61. [Session Runtime](#61-session-runtime)
62. [Explorer Runtime](#62-explorer-runtime)
63. [Preview Runtime](#63-preview-runtime)
64. [Composer Runtime](#64-composer-runtime)
65. [Terminal Runtime](#65-terminal-runtime)
66. [Animation Runtime](#66-animation-runtime)
67. [Focus Management](#67-focus-management)
68. [Runtime Error Recovery](#68-runtime-error-recovery)
69. [Runtime Performance Behavior](#69-runtime-performance-behavior)
70. [Final Runtime Blueprint](#70-final-runtime-blueprint)

---

## 51. Complete Runtime Architecture

### Application Entry Point

**Source:** `packages/app/src/entry.tsx` (182 lines)

The application starts at `entry.tsx` which:

1. **Detects locale** from `navigator.languages` — supports `"en"` and `"zh"` (Simplified Chinese)
2. **Reads default server URL** from `localStorage` key `"opencode.settings.dat:defaultServerUrl"`
3. **Creates Platform object** defining: `platform: "web"`, `version`, `openLink`, `back`, `forward`, `restart`, `notify`, `getDefaultServer`, `setDefaultServer`
4. **Initializes Sentry** if `VITE_SENTRY_DSN` is configured — filters out `Breadcrumbs` integration and `GlobalHandlers` in production
5. **Extracts auth token** from URL `?auth_token=` param, clears it from URL via `history.replaceState`
6. **Creates initial server connection** as `ServerConnection.Http` with `type: "http"`, `authToken` boolean, and current URL
7. **Renders** into `#root` element:
   ```
   <PlatformProvider>
     <AppBaseProviders>
       <AppInterface
         defaultServer={ServerConnection.Key.make(url)}
         canonicalLocalServer={key(server)}
         servers={[server]}
         disableHealthCheck
       />
     </AppBaseProviders>
   </PlatformProvider>
   ```

### Bootstrap Sequence

The bootstrap follows a strict order:

```
1. PlatformProvider        — Injects platform singleton (web functions)
2. MetaProvider            — <head> meta tag management
3. Font                    — Loads Inter and JetBrainsMono CSS
4. ThemeProvider           — Applies theme, calls window.api.setTitlebar on change
5. LanguageProvider        — i18n locale (en/zh)
6. UiI18nBridge            — Bridges language context to @opencode-ai/ui I18nProvider
7. ErrorBoundary           — Top-level catch-all, renders ErrorPage on failure
8. QueryProvider           — TanStack QueryClient (no auto-refetch)
9. WslServersProvider      — WSL-specific server state (Windows only)
10. DialogProvider         — Centralized dialog management
11. MarkedProvider         — Markdown renderer context
12. FileComponentProvider  — File renderer component injection
13. ServerProvider         — Server connection list + active server state
14. GlobalProvider         — Per-server SDK/sync/query context factory
15. SettingsProvider       — Persisted user settings
16. ConnectionGate         — Health check, splash screen, connection error UI
17. TabsProvider           — Window-scoped tab state
18. PermissionProvider     — Permission auto-respond rules
19. NotificationProvider   — Session notifications
20. CommandProvider        — Keyboard command registration/dispatch
21. HighlightsProvider     — Release highlights
22. LayoutProvider         — Panel dimensions, view state, scroll positions
23. ModelsProvider         — Available models + visibility
24. Router                 — @solidjs/router with route definitions
```

### Provider Initialization Order (detailed)

Within `AppInterface` (`app.tsx:573-606`):

```
ServerProvider
  → GlobalProvider
    → SettingsProvider
      → ConnectionGate
        → Dynamic(component=Router, root=TabsProvider + PermissionProvider + NotificationProvider + ServerShell)
          → TabsProvider           (persisted tab state, async load from localStorage)
          → PermissionProvider     (persisted auto-accept rules, async load)
          → NotificationProvider   (persisted notification list, async load)
          → ServerShell
            → QueryProvider
              → SharedProviders
                → BodyDesignClass    (syncs newLayoutDesigns to <body> attributes)
                → CommandProvider    (global keydown listener, command catalog)
                  → DesktopCommands  (registers desktop-specific commands)
                  → HighlightsProvider
                    → Layout gate (newLayoutDesigns ? NewAppLayout : LegacyServerScopedShell)
                      → NewAppLayout
                        → SelectedServerProviders
                          → ServerKey
                            → ServerSDKProvider
                              → ServerSyncProvider
                                → LayoutProvider
                                  → NewLayout
                        → Route content (children)
```

### Route Initialization

Routes are defined in `app.tsx:609-635`:

```
Legacy Layout routes (when !newLayoutDesigns):
  /server/:serverKey/session/:id  → LegacyTargetSessionRoute → redirect
  /:dir/session/:id               → SessionRoute → SessionPage

New Layout routes (when newLayoutDesigns):
  /                              → WorkspaceEmptyState
  /:dir/session/:id              → NewLayoutLegacySessionRedirect
  /server/:serverKey/session/:id → TargetSessionRoute
  /new-session                   → DraftRoute → NewSession

Always available:
  /new-session                   → DraftRoute
```

### Layout Initialization

**New Layout** (`layout-new.tsx`):
1. Creates `isDesktop` media query (`min-width: 768px`)
2. Registers keyboard commands for panel toggle (`mod+shift+e`, `mod+shift+p`)
3. Auto-closes Explorer/Preview panels below 768px
4. Renders: Titlebar → 3-panel flex row (Explorer | Main | Preview) → DebugBar (dev) → TabsInfoPopup → ToastRegion

**Legacy Layout** (`layout.tsx`):
1. Renders fixed sidebar (244px+) + main area + resizable terminal panel
2. Drawer for mobile sidebar navigation

### View Mounting

1. Router resolves route component based on URL path + search params
2. Route content renders inside `<Suspense>` in `layout-new.tsx:102`
3. Session page wraps in `SessionRouteErrorBoundary` + `SessionProviders` + keyboard listener
4. Draft route (new session) renders inside `ResolvedDraftRoute` with directory-scoped providers
5. Lazy-loaded `NewSession` component triggers on `/new-session` route navigation

### Component Mounting Order (per page)

**SessionPage:**
```
SessionRouteErrorBoundary
  → SessionProviders (file, prompt, comments, terminal)
    → Page
      → useSessionLayout (derives session/workspace keys)
      → SessionPanelFrame (panel layout)
        → MessageTimeline (virtualized message list)
        → SessionComposerRegion
          → Session*Dock (permission/question/todo/revert/followup)
          → PromptInputV2Composer
        → SessionSidePanel (review/context/files tabs)
        → TerminalPanel (bottom panel)
```

**NewSession (DraftRoute):**
```
ResolvedDraftRoute
  → ServerSDKProvider + ServerSyncProvider
    → ModelsProvider + SDKProvider + DirectoryDataProvider
      → DraftProviders (file + prompt + comments)
        → NewSession
          → NewSessionDesignView
            → PromptInputV2Composer
            → PromptProjectAddButton / PromptProjectSelector
```

### Cleanup / Dispose / Unmount

Each component cleans up via `onCleanup`:

| Component | Cleans Up |
|-----------|-----------|
| MessageTimeline | Saves timeline cache (measurements, toolOpen), caps at 16 entries, cancels RAFs, clears callbacks |
| Session Page | Cancels all animation frames (reviewFrame, todoFrame, diffFrame, scrollStateFrame, fillFrame), clears timeouts, unsubscribes SDK events |
| Terminal | Disposes cached PTY sessions, removes cache from global set |
| File | Unsubscribes from SDK watcher events, clears view cache |
| Command | Auto-unregisters command registrations |
| Tabs | Disposes tab-memory reactive roots |
| Prompt | Disposes all cached prompt sessions |
| Global | Disposes all server contexts when servers are removed |
| Notification/Permission | Disposes per-server state roots |
| ErrorPage | Disables force-focus mode (if enabled) |

**Portal unmount:** Portal content unmounts when parent component unmounts or when `Show` condition becomes false. Menu/Dropdown portals clean up on close. Dialog portals clean up on dialog dismiss.

---

## 52. Reactive Graph

### Reactive Primitives Used

The codebase uses SolidJS reactive primitives extensively:

| Primitive | Usage | Prevalence |
|-----------|-------|------------|
| `createSignal` | Simple state values (booleans, strings, numbers) | Very High |
| `createStore` | Complex state objects (nested reactive objects) | Very High |
| `createMemo` | Derived/computed values | Very High |
| `createEffect` | Side effects responding to reactive changes | Very High |
| `createResource` | Async data fetching with Suspense support | High |
| `createRenderEffect` | Synchronous DOM-side effects | Low |
| `createRoot` | Isolated reactive scopes for disposability | Moderate |
| `batch` | Coalesce multiple reactive updates into single notification | Moderate |

### Reactive Node Catalog

#### Top-Level Application Signals
**Owner:** `AppInterface` / `app.tsx`

| Signal/Store | Type | Created By | Consumers | Dependencies |
|-------------|------|-----------|-----------|--------------|
| `settings.current` | Store | SettingsProvider | All components | localStorage |
| `settings.general.newLayoutDesigns` | Memo | SettingsProvider | Router, layout selection, all V2/V1 gating | store.general.newLayoutDesigns, layoutUpgrade, sunset |
| `server.current` | Memo | ServerProvider | ConnectionGate, GlobalProvider, LayoutProvider, all route components | allServers, state.active |
| `server.allServers` | Memo | ServerProvider | global.ensureServerCtx | store.list, props.servers |
| `tabs.store` | Store | TabsProvider | Titlebar, session routing, SessionPage | localStorage |
| `layout.explorerPanel.width` | Signal | LayoutProvider | layout-new.tsx panel width style | persisted store |
| `layout.previewPanel.width` | Signal | LayoutProvider | layout-new.tsx panel width style | persisted store |
| `prompt.session` | Memo | PromptProvider | PromptInputV2, composer, docks | URL params, SDK, scope |

#### Session Page Signals
**Owner:** `Page()` in `session.tsx`

| Signal/Store | Type | Lines | Consumers |
|-------------|------|-------|-----------|
| `ui.scroll` | Store | 389 | Timeline, jump-to-bottom button |
| `ui.pendingMessage` | Store | 389 | New message state |
| `store.messageId` | Store | 599 | Message display |
| `store.mobileTab` | Store | 599 | Mobile tab selection |
| `followup` | Store | 605 | Persisted followup drafts |
| `tree.reviewScroll` | Store | 1110 | Review panel scroll |
| `sessionKey()` | Memo | session-layout.ts | All session-specific state |
| `timeline()` | Memo | 547 | Timeline projection model |
| `composer` | Signal | Composer state | Dock visibility, responding state |

#### MessageTimeline Signals
**Owner:** `MessageTimeline()` in `message-timeline.tsx`

| Signal/Store | Type | Lines | Consumers |
|-------------|------|-------|-----------|
| `listRoot` | Signal | 278 | Virtualizer scroll element |
| `projection` | Memo | 333 | Timeline rows, active message |
| `timelineRows()` | Memo | 340 | Virtualizer count |
| `toolOpen` | Store | 411 | Tool accordion open state |
| `renderOverscan` | Signal | 412 | Virtualizer overscan count |
| `title` | Store | 554 | Title editing, sharing, menu |
| `share` | Store | 563 | Share popover state |

#### Composer Signals
**Owner:** `usePromptInputV2Controller()` in `prompt-input-v2.tsx`

| Signal/Store | Type | Consumers |
|-------------|------|-----------|
| `interaction` | Store | Mode switching, submit |
| `mode()` | Signal | Shell/normal mode |
| `history` | Store | Prompt history persistence |
| `working()` | Memo | Current session working state |
| `blank()` | Memo | Submit button disabled state |
| `stopping()` | Memo | Stop generation button |
| `context()` | Memo | @mention suggestions |

#### Command/Event System
**Owner:** `CommandProvider` in `command.tsx`

| Signal/Store | Type | Consumers |
|-------------|------|-----------|
| `store.registrations` | Store | Command registration |
| `registered()` | Memo | Flattened command options |
| `options()` | Memo | Resolved options with keybinds |
| `keymap()` | Memo | Keyboard signature → commands map |
| `catalog` | Store | Persisted command catalog |

### Reactive Propagation Paths

```
User Input → Signal.set() → createEffect → Memo update → DOM render
```

**Concrete example — Panel resize:**
```
User drags ResizeHandle
  → onResize callback fires
    → layout.explorerPanel.resize(newWidth)
      → setStore("explorerPanel", "width", newWidth)
        → Persist writes to localStorage (debounced)
        → Panel style {{ width: layout.explorerPanel.width() + 'px' }} re-evaluates
          → DOM width transitions via CSS transition (240ms cubic-bezier)
```

**Concrete example — Session message streaming:**
```
SDK event: "message.part.delta"
  → server-sync event listener
    → applyGlobalEvent / applyDirectoryEvent
      → produce/store update on sync().data.message[sessionID]
        → sessionMessages() memo re-evaluates
          → createTimelineProjection re-projects
            → timelineRows() memo re-evaluates
              → Virtualizer count changes
                → Virtualizer re-renders affected rows
                  → DOM updates with new message content
```

### Derived State and Computed Values

| Computed Value | Derivation | Dependencies |
|---------------|------------|-------------|
| `canBack()` | `history.stack.length > 1 && history.index > 0` | titlebar history store |
| `canForward()` | `history.index < history.stack.length - 1` | titlebar history store |
| `blank()` | `!prompt.current()?.text && attachments.length === 0 && commentCount === 0` | prompt state |
| `stopping()` | `working() && blank()` | session working, blank |
| `centered()` | `!desktopReviewOpen() && !terminalOpen()` | session panel layout |
| `isDesktop` | `createMediaQuery("(min-width: 768px)")` | viewport width |
| `scope()` | `serverSDK().scope` | server SDK re-creation |
| `sessionKey()` | `scope + directory + sessionID` | SDK, route params |
| `layoutUpgrade()` | `launchState.previous !== currentVersion` | settings launch state |

### Resource (Async Data) Graph

| Resource | Fetcher | Dependencies | Suspense |
|----------|---------|-------------|----------|
| `startupHealthCheck` | Effect health check loop | server.current, checkMode | Yes |
| `fileContent` | `sd.file.read()` | activeFile(), activeDir() | No (Show-based) |
| `parsedHtml` | `marked.parse()` | fileContent() content | No |
| `rootFiles` | `sd.file.list()` | activeDir | No |
| `sessionInfo` | SDK fetch | sessionID | Yes |
| `searchEntries` | Command palette search | query | No |
| `suspendUntilPromptReady` | Prompt readiness promise | prompt session | Yes |

### Reactive Lifecycle

SolidJS runs reactive code in the following order:

1. **`createRenderEffect`** — runs synchronously during render, before DOM commit. Used for body class toggling (`BodyDesignClass`).
2. **`createMemo`** — lazy, re-evaluates when dependencies change. All derived state.
3. **`createEffect`** — runs after DOM commit, batches changes. Most side effects.
4. **`onMount`** — runs once after initial render. Event listeners, post-mount initialization.
5. **`onCleanup`** — runs when component unmounts or reactive scope disposes.

### Synchronous vs Deferred Updates

| Update Type | Mechanism | Examples |
|-------------|-----------|----------|
| Synchronous (same tick) | Direct `setStore/setSignal` | Button click toggling, panel resize |
| Deferred (next frame) | `queueMicrotask`, `requestAnimationFrame` | Scroll position flush, prepend anchor adjustment |
| Deferred (async) | `createResource` fetch | File loading, command palette search |
| Batched | `batch()` | Comment CRUD operations, multiple store updates |
| Persisted (debounced) | `persisted()` utility | Layout state, settings, scroll positions |

---

## 53. State Ownership Map

### State Categories

The application has four categories of state:

| Category | Persistence | Lifetime | Examples |
|----------|------------|----------|----------|
| **User Settings** | Persistent (localStorage) | Application lifetime | `settings.v3`, `app-version.v1` |
| **Server State** | Persistent (server-scoped) | Per-server lifetime | Layout, notifications, permissions, terminals |
| **UI State** | Ephemeral | Component lifetime | Panel open/closed, scroll positions, active tabs |
| **Session State** | Server-owned | Session lifetime | Messages, permissions, questions, todos, diffs |

### State Ownership by Provider

#### SettingsProvider
**Owner:** `packages/app/src/context/settings.tsx`
**Storage key:** `Persist("settings.v3")`
**State shape:**
```typescript
{
  general: { autoSave, releaseNotes, followup, showFileTree, showNavigation, showSearch, showStatus,
             showTerminal, showReasoningSummaries, shellToolPartsExpanded, editToolPartsExpanded,
             showCustomAgents, mobileTitlebarPosition, newLayoutDesigns, layoutTransitionEligible,
             layoutTransitionClassified, ... },
  appearance: { fontSize, font, uiFont, terminalFont },
  keybinds: Record<string, string>,   // per-action custom keybinds
  permissions: { autoApprove },
  notifications: { agent, permissions, errors },
  sounds: { agentEnabled, agent, permissionsEnabled, permissions, errorsEnabled, errors }
}
```
**Readers:** All components
**Writers:** Settings dialog, migration effects
**Lifetime:** Application lifetime (global persist)

#### ServerProvider
**Owner:** `packages/app/src/context/server.tsx`
**Storage key:** `Persist.global("server", ["server.v3"])`
**State:**
```typescript
{
  list: StoredServer[],             // persisted
  projects: Record<key, StoredProject[]>,  // persisted
  lastProject: Record<key, string>,        // persisted
  recentlyClosed: Record<key, string[]>,   // persisted (16 entries)
  active: ServerConnection.Key     // ephemeral (not persisted)
}
```
**Readers:** GlobalProvider, LayoutProvider, ConnectionGate, route components
**Writers:** `setActive`, `add`, `remove`, project operations
**Lifetime:** Server connection lifetime

#### LayoutProvider
**Owner:** `packages/app/src/context/layout.tsx`
**Storage key:** `Persist.serverGlobal(scope, "layout", ["layout.v6"])`
**State shape:** ~30 fields across sidebar, terminal, review, fileTree, session, mobileSidebar, explorerPanel, previewPanel, sessionTabs, sessionView, home
**Readers:** Layout components (explorer, preview, titlebar, session page)
**Writers:** Panel resize/toggle, tab operations, project selection
**Lifetime:** Per-server, cleared when server changes

#### TabsProvider
**Owner:** `packages/app/src/context/tabs.tsx`
**Storage keys:** `Persist.window("tabs")`, `Persist.window("tabs.recent")`, `Persist.window("tabs.info")`, `Persist.window("tabs.closed")`
**State:**
```typescript
{ store: Tab[], recent: RecentTab, info: Record<string, TabInfo>, closed: ClosedTab[] }
```
**Readers:** Titlebar, route components, SessionPage
**Writers:** Tab CRUD operations
**Lifetime:** Window lifetime (window-scoped persist)

#### CommandProvider
**Owner:** `packages/app/src/context/command.tsx`
**Storage key:** `Persist.global("command.catalog.v1")`
**State:** `{ registrations: CommandRegistration[], suspendCount: number, catalog: CommandCatalog }`
**Readers:** Command palette, keybind settings
**Writers:** `register()`, component mount/unmount
**Lifetime:** Application lifetime

#### GlobalProvider
**Owner:** `packages/app/src/context/global.tsx`
**State:**
```typescript
{ settings: { serverKey: ServerConnection.Key | undefined }, serverCtxs: Map<Key, ServerCtx> }
```
**Readers:** NotificationProvider, PermissionProvider, LayoutProvider
**Writers:** `ensureServerCtx()`, server list changes
**Lifetime:** Application lifetime; per-server contexts cleaned up on server removal

### State Initialization Order

```
1. Platform (injected singleton) — no async
2. Settings — async load from localStorage
3. Server — async load from localStorage
4. Global — synchronous, creates per-server contexts
5. Tabs — async load from localStorage
6. Layout — async load from localStorage (server-scoped)
7. File — async (watcher + tree), resets on directory change
8. Terminal — async load + PTY session creation
9. Comments — async load from localStorage (session-scoped)
10. Prompt — synchronous once session key resolves
```

### State Reset Triggers

| Trigger | State Reset |
|---------|------------|
| Server switch | New server-scoped contexts, layout, projects, notifications, permissions reload |
| Directory change | File tree cleared, terminal workspace trimmed, new view state |
| Session switch | Timeline cache saved, scroll positions stored, new session data loaded |
| Layout toggle (new ↔ legacy) | Full component tree unmount/remount |
| Settings change | Reactive propagation to all components |
| Theme change | All CSS variables update via ThemeProvider |
| Panel toggle | Conditional mount/unmount of panel content |
| Dialog open/close | Dialog content mount/unmount |

### State Persistence Mechanisms

```
localStorage (via persisted() utility)
  ├── Global keys: "settings.v3", "command.catalog.v1", "app-version.v1", "language.v1", "highlights.v1", "model.v1"
  ├── Server-global keys: server:{scope}:layout.v6, server:{scope}:server.v3, server:{scope}:notification.v1, etc.
  ├── Server-workspace keys: server:{scope}:ws:{dir}:terminal, etc.
  ├── Server-scoped session keys: server:{scope}:ws:{dir}:session:{id}:prompt, etc.
  ├── Draft keys: draft:{id}:prompt
  └── Window keys: tabs, tabs.recent, tabs.info, tabs.closed
```

All persistence uses the `persisted()` wrapper which:
1. Wraps `createStore` with async load from `localStorage`
2. Provides `ready()` accessor with `.promise` for async initialization
3. Debounces writes to storage
4. Supports legacy key migration

---

## 54. Event Flow Atlas

### Keyboard Event Flow

**Global keyboard handler** (`command.tsx:413`, `onMount`):
```
keydown event (document, capture phase)
  → signatureFromEvent(event) -> "key:mask" string
  → Check palette signature first
    → Match? → command.show() (open command palette)
  → Lookup keymap().get(sig)
    → Find best match via resolveKeybindOption(respects "when" guard)
      → Call option.onSelect?.("keybind")
```

**Session keyboard handler** (`session.tsx:1996`, `onMount`):
```
keydown event (document)
  → Deep active element detection (traverses shadow DOM)
  → Check [data-prevent-autofocus] on event path
  → Check isEditableTarget (input, textarea, [contenteditable])
  → Check dialog.active
  → If Escape on active input → blur it
  → Process scroll keys (PageUp, PageDown, etc.)
  → If single printable character → focus prompt input + set cursor position
```

**Command palette keyboard handler** (`dialog-command-palette-v2.tsx:168`):
```
keydown event (within palette dialog)
  → ArrowDown/Up → move(1/-1), scroll into view
  → Enter → select active entry
  → Escape → close dialog
```

**Message timeline keyboard handler** (`message-timeline.tsx:623`):
```
keydown event (within timeline)
  → Scroll keys (via scrollKey, isScrollKeyTarget, scrollKeyOwner)
  → Clear prepend anchor unless loading
  → Mark scroll gesture
```

### Mouse Event Flow

**Panel resize:**
```
mousedown on ResizeHandle
  → Capture initial position
  → mousemove (document)
    → Calculate delta
    → layout.explorerPanel.resize(newWidth) / layout.previewPanel.resize(newWidth)
    → DOM style updates reactively
  → mouseup
    → Release capture
```

**Click — file tree:**
```
click on FileTreeV2 row
  → handleFileSelect(filePath)
    → layout.previewPanel.selectFile(filePath)
      → setStore("previewPanel", "currentFile", filePath)
        → PreviewPanel file resource refetches
          → File content loaded and rendered
```

**Click — titlebar tab:**
```
click on SortableTabV2
  → onNavigate callback
    → tabs.select(tab)
      → navigate(tab.href)
        → Router updates route
          → Session page re-renders with new session
```

**Right-click — context menu:**
```
contextmenu on element (file tree row, project, session item)
  → ContextMenu.Portal opens
  → Menu positioned at cursor
  → Click menu item → handler executes
  → Menu closes
```

### Touch Event Flow

**Timeline scroll (touch devices):**
```
touchstart
  → Capture initial Y position
  → Clear prepend anchor
touchmove
  → Compute delta from previous position
  → markBoundaryGesture(root, target, delta)
  → If boundary crossed → delegate scroll to parent
touchend
  → Clear touch gesture state
```

### Wheel Event Flow

**Timeline wheel scroll:**
```
wheel event on timeline
  → handleListWheel
    → Clear prepend anchor (unless loading)
    → normalizeWheelDelta(event)
    → markBoundaryGesture(root, target, normalizedDelta)
```

### Focus/Blur Event Flow

**Dialog focus trap:**
```
Dialog opens
  → Focus trapped within dialog container
  → Tab/Shift+Tab cycles through focusable elements
  → Close button or Escape → focus restored to trigger element
```

**Input focus:**
```
Printable key pressed while no input focused
  → session.tsx handleKeyDown
    → inputRef.focus()
    → set cursor position
    → PromptInputV2 ready for typing
```

**Terminal focus:**
```
User clicks terminal or focus requested via code
  → terminal.requestFocus(id)
    → setUi("focus", { request: ++focusCounter, id })
  → TerminalPanel's autoFocus prop matches
  → xterm.js instance receives focus
  → Global focusin listener cancels terminal focus when clicking outside #terminal-panel
```

### Resize Event Flow

**Browser resize:**
```
window resize
  → createMediaQuery("min-width: 768px") re-evaluates
    → If below 768px:
      → layout.explorerPanel.close()
      → layout.previewPanel.close()
```

**Panel resize handle drag:**
```
ResizeHandle mousedown → document mousemove → layout store update → CSS transition
```

### Visibility Event Flow

**Page visibility change:**
```
visibilitychange
  → DebugBar: stops FPS monitoring when hidden, resets and resumes when visible
  → layout.tsx pagehide: flushes scroll state before page hide
  → server-sdk.tsx pagehide/pageshow: event stream reconnect handling
```

### Clipboard Event Flow

```
Copy share URL → navigator.clipboard.writeText(url) → showToast confirmation
```

### Drag/Drop Event Flow

**Tab drag reorder:**
```
dragstart on SortableTabV2
  → Capture tab data
dragover on tab strip
  → Calculate drop position
drop or dragend
  → tabs.reorder(keys)
    → setStore reorders tab array
    → Persisted to localStorage
```

### Context Menu Event Flow

```
contextmenu event (native or synthetic)
  → MenuV2.Context / ContextMenu.Portal opens at cursor position
  → User clicks menu item
  → onSelect handler executes action
  → Menu closes
```

### Window Events

| Event | Handler | Effect |
|-------|---------|--------|
| `popstate` | Router | Route change, timeline navigation |
| `pagehide` | layout.tsx | Flush scroll state to persisted store |
| `pageshow` | server-sdk.tsx | Event stream reconnection |
| `visibilitychange` | layout.tsx, debug-bar.tsx | Flush state, pause/resume monitoring |
| `beforeunload` | (implicit) | Persisted stores flush |

---

## 55. Rendering Lifecycle

### Initial Render

The initial render follows this sequence:

1. **`render()` call** in `entry.tsx:167-181` mounts SolidJS app into `#root`
2. **Component tree creation**: SolidJS walks the JSX tree, creates reactive primitives
3. **First paint**: All components render synchronously, DOM commits
4. **`onMount` callbacks**: Run after first paint (event listeners, post-mount init)
5. **`ConnectionGate` splash**: Shows pulsing logo overlay while health check runs
6. **Health check completes**: Splash fades, app content renders
7. **Settings load**: `persisted()` stores complete async loading, UI adjusts

### Re-render Triggers

| Trigger | Scope | Examples |
|---------|-------|----------|
| Signal/store update | Dependent components only | Panel toggle, tab switch |
| Route change | Route component + children | Session switch, settings dialog |
| Provider value change | All consuming components | Theme change, settings update |
| SDK event | Sync data consumers | New message, permission request |
| Resource refetch | Resource consumer | File content reload |
| Window resize | Media query listeners | Desktop/mobile layout switch |

### Partial Render (Reactive Granularity)

SolidJS compiles JSX to fine-grained reactive expressions. Each `{expression}` in JSX becomes its own reactive node. When a signal updates:

1. Only the specific DOM nodes reading that signal are updated
2. No virtual DOM diffing — direct DOM mutations
3. Components that don't read the changed signal do NOT re-execute

**Example — Session message list:**
```
New message arrives → sync.data.message[sessionID] updates
  → sessionMessages() memo re-evaluates
    → timelineRows() memo re-evaluates
      → Virtualizer.addItems() called
        → Only new rows rendered
```

### Conditional Render

Conditional rendering uses SolidJS `Show`, `Match`/`Switch`, and ternary expressions:

**`Show` pattern:**
```tsx
<Show when={condition()} fallback={<Alternative />}>
  <Primary />
</Show>
```
- `Primary` is NOT rendered when `condition()` is `false`
- Component unmounts when condition flips from `true` to `false`
- Fresh mount when condition flips back

**Keyed `Show`:**
```tsx
<Show when={someValue()} keyed>
  {(value) => <Component data={value} />}
</Show>
```
- Component identity is keyed to `someValue()` — changing value causes remount

### Lazy Render

Lazy loading uses SolidJS `lazy()`:

```typescript
const NewSession = lazy(() => import("@/pages/new-session"))
```

**Behavior:**
1. Component code NOT loaded until first render attempt
2. When route navigates to lazy component, Suspense boundary catches loading promise
3. Suspense fallback renders while chunk loads
4. When chunk loaded, component renders normally
5. Subsequent renders use cached module

**Lazy components:**
- `NewSession` — route-triggered, Suspense at layout-new.tsx:102
- `DialogSelectDirectoryV2` — dialog open
- `DialogSelectFileV2` — dialog open
- `IconV2` (in settings-keybinds) — settings keybinds tab
- `StatusPopoverBody` / `StatusPopoverServerBody` — popover hover

### Portal Render

Portals use `solid-js/web`'s `Portal` component or Kobalte's `*Portal`:

**SolidJS Portal:**
```tsx
<Portal mount={mountElement()}>
  <Content />
</Portal>
```
- Content renders into `mountElement` (outside current DOM tree)
- Events bubble through component tree (not DOM tree)
- Content shares same reactive context as parent

**Kobalte Portal (DropdownMenu, Dialog, etc.):**
```tsx
<DropdownMenu.Portal>
  <DropdownMenu.Content />
</DropdownMenu.Portal>
```
- Renders to `document.body` by default
- Creates independent stacking context
- Theme: portaled content outside ThemeProvider may need manual theme mirroring

**Portal targets:**
- `#opencode-titlebar-center` — session search button
- Titlebar right mount ref — session controls, StatusPopoverV2
- `document.body` — all dropdowns, menus, context menus, tooltips

### Suspense Rendering

Suspense boundaries catch `createResource` loading states:

```tsx
<Suspense fallback={<Loading />}>
  <ResourceConsumer />
</Suspense>
```

**Suspense boundaries in app:**
| Location | Wraps | Fallback |
|----------|-------|----------|
| `layout-new.tsx:102` | Route content | Implicit (nothing, content hidden) |
| `status-popover.tsx:63` | StatusPopoverBody | 360px wide placeholder |
| `status-popover.tsx:147` | StatusPopoverServerBody | Implicit |

**Suspense wrapping pattern (prompt.tsx):**
```typescript
const withSuspense = <T,>(cb: () => T): (() => T) => {
  const [resource] = createResource(() => session().ready.promise.then(cb))
  return () => resource()
}
```
- Wraps session accessors in `createResource` that waits for prompt readiness
- Enables `<Suspense>` to catch loading state

### Hydration

Not applicable. This is a client-rendered SolidJS application with no SSR/hydration. All rendering is dynamic client-side.

### Cleanup Rendering

On component unmount:
1. SolidJS removes DOM nodes
2. All `onCleanup` callbacks execute
3. Reactive subscriptions are garbage collected
4. Portal content is removed from mount target
5. `createRoot`-disposed scopes release all nested effects and memos

---

## 56. Component Lifecycle Atlas

### Titlebar (`titlebar.tsx`)

| Phase | Actions |
|-------|---------|
| **Creation** | Imports: platform, layout, tabs, command, settings contexts |
| **Initialization** | Sets up history store, zoom calculations, platform detection, navigation effects |
| **Mount** | `onMount`: finds `#opencode-titlebar-right` mount target via `useTitlebarRightMount` |
| **Runtime updates** | Route change → `createEffect` updates navigation history and tab state. Theme change → `createEffect` calls `window.api.setTitlebar` |
| **Visibility changes** | Tabs show/hide based on `currentTab()` match |
| **Disposal** | `createEffect` cleanup: tab event listener removal, session tab cleanup |

### ExplorerPanel (`explorer-panel.tsx`)

| Phase | Actions |
|-------|---------|
| **Creation** | Creates tree cache store, expanded state, filter query signal, root files resource |
| **Initialization** | `createResource` loads root directory files via SDK |
| **Mount** | Renders HomeProjectsView or HomeSessionsView based on selection |
| **Runtime updates** | Directory selection changes → resource refetches. File tree expand → lazy SDK fetch. Filter query → reactive file list filtering |
| **Visibility changes** | Auto-closes below 768px via layout effect. Panel toggle → `Show` conditional mount |
| **Disposal** | Resource cleanup, tree cache cleared |

### SessionPage (`session.tsx`)

| Phase | Actions |
|-------|---------|
| **Creation** | Creates all state stores (ui, store, followup, tree), establishes session ownership |
| **Initialization** | Sets up session lineage, composer state, timeline model, VCS diff watcher, keyboard listener, command registration |
| **Mount** | `onMount`: registers global keydown listener. Creates session, file, permission, comments providers |
| **Runtime updates** | Message streaming → timeline projection updates. Permission requests → dock activation. Scroll → state updates, history loading |
| **Visibility changes** | Tab switch → new sessionKey → fresh timeline. Panel toggle → layout store updates |
| **Disposal** | `onCleanup`: cancels all animation frames, clears timeouts, unsubscribes SDK events, saves timeline cache |

### MessageTimeline (`message-timeline.tsx`)

| Phase | Actions |
|-------|---------|
| **Creation** | Virtualizer setup, timeline cache restore, signal/memo initialization |
| **Initialization** | Projection memo creation, row construction from session messages |
| **Mount** | `onMount`: RAF chain for initial scroll-to-end + overscan expansion |
| **Runtime updates** | Message arrival → projection updates → virtualizer re-renders. Scroll → history loading, prepend anchor adjustment. Resize → virtualizer measure |
| **Visibility changes** | Session switch → timeline cache saved, new session data loaded, scroll restored |
| **Disposal** | `onCleanup`: saves virtualizer snapshot + toolOpen state to cache (capped at 16), cancels RAFs, clears callbacks |

### PromptInputV2Composer (`prompt-input-v2.tsx`)

| Phase | Actions |
|-------|---------|
| **Creation** | Creates interaction state machine, history store, model/agent selectors |
| **Initialization** | Sets up editor, registers commands, restores history, initializes context suggestions |
| **Mount** | Focus prompt input if needed |
| **Runtime updates** | Typing → editor content changes reactively. @mention → suggestion list shows. Submit → session API call. Mode switch → shell/normal mode |
| **Visibility changes** | Session working → show stop button. Session blocked → dock replaces composer |
| **Disposal** | Cleanup via controller disposal |

### DialogV2 (generic dialog lifecycle)

| Phase | Actions |
|-------|---------|
| **Creation** | Dynamic import (some dialogs lazy), `dialog.show(() => <Dialog />)` |
| **Initialization** | Kobalte Dialog mounts, focus trap activated, backdrop rendered |
| **Mount** | Auto-focus on first focusable element |
| **Runtime updates** | Form input, tab switch (settings), search (command palette) |
| **Visibility changes** | N/A (shown until closed) |
| **Disposal** | Escape/close → focus restored to trigger element → dialog portal unmounted → component destroyed |

---

## 57. Navigation Runtime

### Route Navigation

Navigation uses `@solidjs/router` `<Router>` with `useNavigate()`:

```
navigate(href) → Router updates location → Route matches → Component mounts
```

**Navigation triggers:**
- User clicks link/button → `navigate(href)`
- Keyboard shortcut → `navigate(href)`
- Tab click → `tabs.select(tab)` → `navigate(tab.href)`
- Programmatic (e.g., after session delete) → `navigate("/")`

### Project Selection

**New layout** (`app.tsx:609-635`):
```
User selects project in HomeProjectsView
  → layout.home.selection.set(directory)
    → navigate to /{dir}/session (or /new-session for draft)
```

**Route resolution:**
- `/:dir/session/:id` → `SessionRoute` → `SessionPage` (existing session)
- `/:dir/session` (no id) → `SessionRoute` → creates draft or redirect
- `/new-session?draftId=...` → `DraftRoute` → `NewSession` prompt-only page

### Session Switching

**Tab click:**
```
User clicks tab in TitlebarTabStrip
  → onNavigate(tab)
    → tabs.select(tab)
      → navigate(tab.href)
        → SessionPage mounts with new sessionID
```

**Session switch reactive effects:**
```
new sessionID → useSessionKey() recomputes sessionKey
  → New session data loads from sync
    → Timeline clears and reloads
      → MessageTimeline gets new projection
        → Virtualizer resets
```

### Tab Switching

**Tab lifecycle:**
```
Tab created:
  Session tab → tabs.addSessionTab({ server, sessionId })
  Draft tab → tabs.newDraft({ server, directory }, prompt)

Tab switched:
  → tabs.remember(tab) — persists as recent
  → navigate(tab.href)

Tab closed:
  → tabs.closeTab(index)
    → Removed from store
    → Pushed to closed stack (max 25)
    → Navigated to next tab or "/"

Tab reopened:
  → tabs.reopenClosedTab()
    → Pop from closed stack
    → Added to store
    → Navigated to href
```

**Tab reorder:**
```
User drags tab to new position
  → onReorder(keys)
    → tabs.reorder(keys)
      → setStore reorders array
```

### Explorer Navigation

```
ExplorerPanel file tree:
  Click file → layout.previewPanel.selectFile(path)
  Click directory → toggleDirectory(path) → SDK list → expand/collapse
  Click project header → layout.home.selection.set(undefined) → back to project list

HomeProjectsView:
  Click project → layout.home.selection.set(directory)
  Click "Back" → layout.home.selection.set(undefined)

HomeSessionsView:
  Click session → navigate to /{dir}/session/{id}
```

### Preview Navigation

```
PreviewPanel tab bar:
  Click tab → layout.previewPanel.setCurrentFile(path)
  Click close → layout.previewPanel.closeFile(path)
  Click close all → layout.previewPanel.close()
```

### Navigation History

**Titlebar history** (`titlebar.tsx:99`):
```typescript
type History = { stack: string[], index: number, action: "push" | "pop" | "replace" }
```
- Tracks navigation within session
- `back()` / `forward()` uses `window.history.back()` / `window.history.forward()`
- `canBack()` / `canForward()` computed from stack

### Keyboard Navigation

| Key | Action | Context |
|-----|--------|---------|
| `Ctrl+,` | Open settings | Global |
| `Ctrl+K` | Open command palette | Global |
| `Ctrl+Tab` | Next tab | Global |
| `Ctrl+Shift+Tab` | Previous tab | Global |
| `Ctrl+W` | Close tab | Global |
| `Ctrl+T` | New tab | Global |
| `Ctrl+Shift+E` / `Ctrl+Shift+X` | Normal/Shell mode | Session |
| `Ctrl+'` | Choose model | Session |
| `Shift+Ctrl+D` | Cycle model variant | Session |
| `Ctrl+.` / `Shift+Ctrl+.` | Cycle agent | Session |
| `Escape` | Close dialog, blur input | Global |
| Arrow keys | Navigate command palette | Command palette |

---

## 58. Runtime Interaction Pipeline

### Complete Pipeline for Each Major Interaction

#### Click → Open File Timeline

```
1. Click on FileTreeV2 row
2. → onClick handler: handleFileSelect(filePath)
3. → layout.previewPanel.selectFile(filePath)
4.   → setStore("previewPanel", "currentFile", filePath)
5.   → setStore("previewPanel", "files", [...files, filePath]) (if new)
6. → Reactive propagation:
     activeFile() memo re-evaluates
     → File resource createResource refetches
       → SDK client: sd.file.read({ path })
         → HTTP request to server
           → Response with file content
7. → Render:
     isMarkdown() → marked.parse() → innerHTML
     isImage() → <img> tag
     isPdf() → <embed> tag
     else → <pre><code> monospace
8. → Final visual state: Preview panel shows file content
```

#### Click → Open Session from Home

```
1. Click on HomeSessionsView session item
2. → layout.tabs(sessionKey).setActive(id)
3. → navigate(href = `/${dir}/session/${id}`)
4. → Router updates location
5. → SessionRoute resolves with params.id
6. → SessionPage component mounts
7. → useSessionKey() derives new sessionKey
8. → sync().session.get(id) loads session data
9. → timeline projection creates rows from messages
10. → MessageTimeline virtualizes and renders
11. → Final state: Session workspace visible with timeline
```

#### Click → Submit Prompt

```
1. Click submit button in PromptInputV2
2. → submission.handleSubmit()
3. → Captures current prompt text, context items, attachments
4. → Calls SDK: sd.session.prompt(...) with captured data
5. → HTTP request to server
6. → Server processes prompt, begins streaming response
7. → SDK events flow through server-sync:
     session.busy → working() = true
     message.part.delta → timeline updates with streaming content
     session.idle → working() = false
8. → Reactive propagation:
     sessionMessages() updates → timeline re-projects
     working() updates → composer shows stop button
9. → Render:
     New messages appear in timeline (streaming text, tool calls, diffs)
     Composer resets (clears prompt, hides submit, shows stop)
10. → Final state: Session showing AI response, composer ready for next input
```

#### Click → Dialog Open/Close

```
1. Click "Settings" button
2. → useSettingsDialog() → dialog.show(() => <DialogSettings />)
3. → Kobalte Dialog mounts Dialog.Portal to document.body
4. → Backdrop renders (semi-transparent overlay)
5. → Dialog content renders (centered, rounded, shadow)
6. → Focus trapped within dialog
7. → Animation: Dialog enters (fade + scale)
8. → Final state: Settings dialog visible, interaction blocked behind backdrop
9. Click "X" or Escape:
   → Dialog closes (fade out)
   → Focus restored to trigger element
   → Dialog portal unmounts
```

#### Drag → Panel Resize

```
1. mousedown on ResizeHandle
2. → Capture start position
3. → mousemove on document:
     Calculate delta from start
     layout.explorerPanel.resize(newWidth)
       → setStore("explorerPanel", "width", newWidth)
       → CSS transition triggers on panel width
4. → Render:
     Panel width style updates reactively
     CSS transition animates (240ms cubic-bezier)
     Adjacent panel adjusts via flex layout
5. → mouseup:
     Release capture
     Persist new width to localStorage
6. → Final state: Panels at new widths
```

#### Keyboard → Open Command Palette

```
1. Press Ctrl+K (or Cmd+K)
2. → Global keydown handler (capture phase at document level)
3. → signatureFromEvent(event) = "k:mod"
4. → palette().has("k:mod") → true
5. → command.show()
6. → dialog.show(() => <DialogCommandPaletteV2 />)
7. → Command palette renders
8. → Input autofocused
9. User types query:
   → setQuery(text)
   → createResource fetches search results
   → visibleEntries memo deduplicates
   → groupedEntries memo groups by category
10. Arrow keys:
    → move(1/-1)
    → active signal updates
    → RAF scrolls into view
11. Enter:
    → select(activeEntry())
    → If command: option.onSelect("palette")
    → If session: onSelectSession(item)
    → Dialog closes
12. Final state: Command executed or session navigated to
```

#### Scroll → History Loading

```
1. User scrolls timeline near top
2. → handleListScroll fires
3. → onHistoryScroll() → Page.loadOlder()
4. → capturePrependAnchor()
     → Find first visible [data-timeline-key] element
     → Save key + top offset
5. → SDK: sd.session.getHistory({ before: firstMessageID })
6. → HTTP request to server
7. → Response: older messages
8. → sync().data.message updates (prepended)
9. → timelineRows() memo re-evaluates (now longer)
10. → Virtualizer adds new items at top
11. → restorePrependAnchor(done):
      → RAF loop adjusts scrollTop to maintain anchor position
      → Stabilizes after 30 frames or 3 seconds
12. → Final state: Timeline shows older messages, scroll position preserved
```

---

## 59. Runtime Provider Graph

### Complete Provider Hierarchy

```
PlatformProvider (injected, non-reactive)
  └── LanguageProvider (i18n: en/zh)
      └── UiI18nBridge (bridges to @opencode-ai/ui I18nProvider)
          └── ErrorBoundary (top-level, renders ErrorPage)
              └── QueryProvider (TanStack QueryClient, no auto-refetch)
                  └── WslServersProvider (WSL-specific, Windows only)
                      └── DialogProvider (centralized dialog.show/active)
                          └── MarkedProvider (markdown renderer context)
                              └── FileComponentProvider (file renderer injection)
                                  └── ServerProvider (server list + active)
                                      └── GlobalProvider (per-server context factory)
                                          └── SettingsProvider (persisted settings)
                                              └── ConnectionGate (health check gate)
                                                  └── TabsProvider (window-scoped tab state)
                                                      └── PermissionProvider (auto-accept rules)
                                                          └── NotificationProvider (session notifications)
                                                              └── QueryProvider (ServerShell)
                                                                  └── CommandProvider (keyboard commands)
                                                                      └── HighlightsProvider (release notes)
                                                                          └── LayoutProvider (panel dimensions, view)
                                                                              └── ModelsProvider (available models)
                                                                                  └── Router (route tree)
```

### Provider Dependencies

| Provider | Depends On | Consumed By |
|----------|-----------|-------------|
| `LanguageProvider` | `Platform` | All text-rendering components |
| `SettingsProvider` | `Platform` | All components (theme, layout, behavior gating) |
| `ServerProvider` | — (requires props) | GlobalProvider, Layout, Tabs, all route components |
| `GlobalProvider` | `Server` | Notification, Permission, Layout |
| `TabsProvider` | `Server`, `Platform` | Titlebar, session routing, SessionPage |
| `LayoutProvider` | `ServerSDK`, `ServerSync`, `Server`, `Tabs`, `Platform` | Explorer, Preview, SessionPage, Titlebar |
| `CommandProvider` | `Settings`, `Language` | All components (command registration) |
| `FileProvider` | `SDK`, `ServerSDK`, `Layout`, `Sync` | File tree, file loading |
| `TerminalProvider` | `SDK`, `ServerSDK` | TerminalPanel |
| `PromptProvider` | `SDK`, `ServerSDK`, `Tabs`, `Settings` | PromptInputV2, composer |
| `PermissionProvider` | `Global`, `Server`, `Tabs`, `Settings` | SessionPermissionDock |
| `NotificationProvider` | `Global`, `Server`, `Tabs`, `Platform`, `Settings`, `Language` | Session notifications |

### Provider Communication

Providers communicate through:
1. **Context values** — `useXxx()` hooks provide state and methods
2. **Shared stores** — Multiple providers read/write the same persisted stores (e.g., Layout reads Tabs, Tabs reads Server)
3. **Event streams** — Server-sync events flow through SDK → Global → per-directory stores → reactive components
4. **Command system** — Cross-component communication via `command.register()` / `command.trigger()`

### Provider State Sharing

| State | Owned By | Shared With |
|-------|----------|-------------|
| Active server key | ServerProvider | GlobalProvider, Layout, Tabs, all route components |
| Current directory | SDKProvider | File, Terminal, Comments, Prompt |
| Layout panel state | LayoutProvider | ExplorerPanel, PreviewPanel, Titlebar |
| Session data | ServerSync (+ child stores) | Timeline, composer, docks, side panel |
| User settings | SettingsProvider | All components |
| Tab state | TabsProvider | Titlebar, session routing |
| Notifications | NotificationProvider | Toast region, session indicators |
| Permissions | PermissionProvider | SessionPermissionDock |

### Provider Disposal

When a provider unmounts (e.g., server removal, layout switch):
1. `onCleanup` callbacks execute in child-first order
2. `createRoot`-disposed contexts release all nested effects
3. Persisted stores remain in localStorage for next mount
4. Event listeners unregistered

**Server context disposal:**
```
Server removed from list
  → createEffect detects stale entries in serverCtxs Map
    → dispose() called on stale server root
      → SDK client destroyed
      → Event stream closed
      → Sync child stores evicted
      → QueryClient destroyed
```

---

## 60. Overlay Lifecycle

### Dialog Lifecycle

**Creation:**
```
dialog.show(() => <MyDialog />)
  → Kobalte Portal mounts dialog to document.body
  → Backdrop renders
  → Dialog container renders
```

**Visibility:**
- Visible immediately on creation
- Blocking: backdrop prevents interaction with underlying content
- Backdrop blur effect: CSS `backdrop-filter: blur(...)` on `.bg-opacity-*` classes

**Focus:**
- Focus trapped within dialog
- First focusable element auto-focused (via `autofocus` prop)
- Tab/Shift+Tab cycles through dialog controls
- Escape closes dialog

**Dismiss triggers:**
- Click outside (when `dismissable` is true)
- Escape key
- Click close button (X)
- Click cancel/confirm button
- Programmatic `dialog.close()`

**Destroy:**
```
Dialog dismisses
  → Dialog.Portal unmounts
  → Dialog component destroyed
  → Focus returned to trigger element
  → onCleanup runs (if any)
```

### Menu/Dropdown Lifecycle

**Creation:**
```
Trigger click
  → DropdownMenu.Portal or MenuV2.Portal opens
  → Content positioned relative to trigger (bottom/right alignment)
```

**Visibility:**
- Visible on trigger click, hidden on selection or click outside
- Position calculated by Kobalte/DropdownMenu (handles edge-of-viewport)
- `gutter`, `shift`, `placement` props control positioning

**Focus:**
- First menu item auto-focused
- Arrow keys navigate between items
- Enter/Space selects current item
- Escape closes menu

**Dismiss triggers:**
- Select menu item
- Click outside
- Escape key
- Hover out (some submenus)

**Destroy:**
- Portal unmounts
- Focus returns to trigger

### Context Menu Lifecycle

**Creation:**
```
contextmenu event on element
  → MenuV2.Context or ContextMenu.Portal opens at cursor position
```

**Visibility:**
- Positioned at cursor (screen-relative)
- Hidden on selection or click outside

**Destroy:** Same as dropdown

### Tooltip Lifecycle

**Creation:**
```
Hover on element with tooltip
  → TooltipV2 or Tooltip renders after delay (e.g., 500ms)
  → Positioned relative to trigger
```

**Visibility:**
- Visible on hover, hidden on hover-out
- Content is text-only (no interactive elements)

**Destroy:**
- On hover-out → tooltip disappears (CSS transition or immediate)

### Toast Lifecycle

**Creation:**
```
showToast({ title, description, variant, action })
  → ToastRegion appends toast to list
  → Toast renders at top-right (default) or bottom (mobile)
```

**Visibility:**
- Visible immediately
- Auto-dismiss after 5 seconds (or configured duration)
- Multiple toasts stack vertically
- Persistent toasts require user dismiss

**Destroy:**
- Auto-dismiss after timeout
- User clicks close button
- User clicks action button (if action provided)
- Animated exit (fade/slide out)

### Popover Lifecycle

**Creation:**
```
Trigger click
  → Popover opens with lazy-loaded body (via Show + Suspense)
  → Positioned relative to trigger (bottom-end by default)
```

**Visibility:**
- Controlled by `open`/`onOpenChange` binding
- `gutter={4}`, `placement="bottom-end"`, `shift` for positioning

**Destroy:**
- Click outside
- Escape
- Second click on trigger (toggle)

### Loading Overlay Lifecycle

**ConnectionGate splash:**
```
App starts
  → ConnectionGate shows fixed splash overlay (z-[9999])
  → Health check runs (10 second timeout)
  → On healthy: splash hidden, app renders
  → On unhealthy: ConnectionError renders with retry
```

**Inline loading states:**
```
createResource pending
  → Show fallback while loading
  → Fallback removed on resolved/error
```

### Debug Overlay Lifecycle

**DebugBar:**
```
DEV mode + debugTools enabled
  → Renders at bottom of layout (inline) or fixed bottom-right (widget mode)
  → PerformanceObserver instances created on mount
  → FPS loop runs while visible
  → On visibilitychange: pause/resume monitoring
  → On unmount: disconnects observers, cancels RAF
  → Force focus mode: toggles platform.setForceFocus
```

---

## 61. Session Runtime

### Session Creation

**Draft tab** (new layout):
```
1. User clicks "New Session" or Ctrl+T
2. → tabs.newDraft({ server, directory }, prompt?)
3. → Draft tab created in tabs store
4. → Navigate to /new-session?draftId={draftID}
5. → DraftRoute resolves
6. → ResolvedDraftRoute mounts:
     ServerSDKProvider → ServerSyncProvider → ModelsProvider → SDKProvider
     → DirectoryDataProvider → DraftProviders (File + Prompt + Comments)
     → NewSession page renders
7. → PromptInputV2Composer mounts with empty prompt
8. → User types and submits prompt
9. → SDK creates session
10. → Draft promoted: tabs.promoteDraft(draftID, session) → navigate to session
```

**Session tab** (existing session):
```
1. User navigates to /{dir}/session/{id}
2. → SessionRoute → SessionPage mounts
3. → useSessionKey() derives sessionKey
4. → sync().data loads messages
5. → Timeline renders
6. → New session tab created if not existing
```

### Session Loading

**Data flow:**
```
Route navigates to session
  → SessionPage mounts
  → useSessionKey() derives sessionKey from route params
  → useSessionLayout() provides tabs + view
  → Timeline subscribes to sync().data.message[sessionID]
  → Messages loaded reactively from sync
  → createTimelineProjection transforms messages to timeline rows
  → MessageTimeline virtualizes rows
```

**Async loading sequence:**
1. Server sync data loaded (may be async)
2. Session messages available from sync
3. Timeline projection computed
4. Virtualizer measures and renders

### Session Switching

```
User switches session tab
  → navigate(newSessionHref)
  → Route changes → new params.id
  → SessionPage re-renders with new sessionID
  → Timeline cache saves current state (measurements, toolOpen)
  → New session data loads from sync
  → Timeline creates new projection
  → Virtualizer resets
```

### Streaming

**Message streaming pipeline:**
```
Server processes prompt
  → SSE events: message.part.delta
  → server-sdk.tsx receives events
  → server-sync.tsx event listener:
    → applyGlobalEvent({ type: "message.part.delta", ... })
    → Sync.data.message[sessionID] updated via produce/reconcile
  → sessionMessages() memo re-evaluates
  → createTimelineProjection re-projects
    → Rows constructed from updated messages
  → MessageTimeline virtualizer detects row changes
  → New/updated rows rendered
  → If anchored to bottom: auto-scroll follows new content
```

**Streaming visual states:**
- Assistant message → streaming cursor (blinking text cursor)
- Tool call → tool header (name + icon), then input/output when received
- Thinking → TextShimmer "thinking..." with fade-up text reveal
- Diff → Streaming diff content with syntax highlighting

### Timeline Updates

**Trigger conditions:**
- New message (user or assistant)
- Message part delta (streaming update)
- Permission request
- Question request
- Session status change
- Followup queue change
- Tool call complete
- Compaction/interruption

**Update mechanism:**
```
New data → Sync store update
  → Timeline model re-projects
    → Row diff (added/removed/changed)
      → Virtualizer adjusts
        → Only affected rows update in DOM
```

### Dock Activation

**Dock lifecycle:**
```
Permission request arrives:
  → sync().data.permission[sessionID] updates
  → composer.blocked() = true
  → SessionPermissionDock shows

Question request arrives:
  → sync().data.question[sessionID] updates
  → composer.blocked() = true
  → SessionQuestionDock shows

Session starts working:
  → sync().data.todo[sessionID] updates
  → composer.live() = true
  → SessionTodoDock animates open (iOS-style spring animation)

Session completes:
  → todos done or cancelled
  → scheduleClose(5000ms) → dock animates closed
```

### Composer Updates

**During streaming:**
- Composer shows stop button (`working() && blank()`)
- Prompt input disabled/dimmed
- Session docks may appear above composer

**After streaming complete:**
- Composer re-enabled
- Stop button hidden
- Followup dock may show suggested followups
- Session state returns to idle

### Permission Requests

**Flow:**
```
Server needs permission → sends permission.asked event
  → sync().data.permission[sessionID] updates
  → SessionPermissionDock renders
    → Shows: warning icon, header, description, code block
    → Buttons: Deny, Allow Always, Allow Once
  → User clicks response
    → compose.decide(response)
      → SDK call: permission.respond({ id, response })
      → Auto-accept rule persisted if "always"
      → Dock closes
```

### Question Requests

**Flow:**
```
Server needs clarification → sends question.asked event
  → sync().data.question[sessionID] updates
  → SessionQuestionDock renders
    → Shows: progress (Question X of Y), options (radio/checkbox)
    → Optional custom textarea input
    → Buttons: Dismiss, Back, Next, Submit
  → User progresses through questions
  → On final Submit → SDK call with answers
  → Dock closes
```

### Followups

**Flow:**
```
Session completes (idle)
  → Server may send followup suggestions
  → SessionFollowupDock shows
    → Count + preview + chevron (collapsible)
    → Items: text + Send Now / Edit buttons
  → User clicks "Send Now" → followup submitted as new prompt
  → User clicks "Edit" → followup content loaded into composer
```

---

## 62. Explorer Runtime

### Project Load

```
HomeProjectsView mounts
  → Creates home controller with project list
  → Projects loaded from server sync data
  → Enriched with metadata (avatar colors, session counts)
  → Renders server groups → project rows
```

**Flow:**
```
layout.projects.list() → enriched projects
  → layout.list() adds avatar colors
  → HomeProjectsView renders:
    → HomeServerRow per server
      → HomeProjectRow per project
        → ProjectAvatar + name + path + context menu
```

### Directory Load

```
User selects project
  → layout.home.selection.set(directory)
  → ExplorerPanel rootFiles resource refetches
    → sd.file.list({ path: dir })
      → Files and directories returned
  → FileTreeV2 renders root items
```

### Expand/Collapse

```
User clicks chevron on directory:
  → toggleDirectory(dirPath)
    → If closed: set expanded = true
      → Check treeCache for listing
        → Cache miss: sd.file.list({ path }) → store in treeCache
      → Renders children in tree
    → If open: set expanded = false
      → Children hidden
```

### Lazy Loading

Directory listings are cached in `treeCache` store:
```typescript
treeCache = createStore<Record<string, FileEntry[]>>({})
```
- First expand → SDK fetch → cached
- Subsequent toggle → cache hit → immediate render
- Force refresh → `refetch()` on rootFiles resource

### Selection

```
File selected:
  → layout.previewPanel.selectFile(filePath)
    → Preview opens/activates
    → File highlighted in tree

Directory selected:
  → Toggle expand/collapse
```

### Filtering

```
User types in filter input:
  → filterQuery signal updates
  → filterItems(currentFiles):
    → Filter by filename includes query (case-insensitive)
    → Tree renders only matching items
```

### Search

Search input at top of ExplorerPanel:
```
As user types:
  → Root files filtered by name match
  → Non-matching items hidden
```

### Reload

```
Force refresh:
  → refetchRoot() on rootFiles resource
    → SDK list call
    → treeCache updated
    → Tree re-renders
```

### Preview Synchronization

```
Click file in tree:
  → layout.previewPanel.selectFile(filePath)
    → Preview opens (if closed) or switches to file (if open)
    → File content loaded and rendered in PreviewPanel
    → Preview tab created if file not already open
```

---

## 63. Preview Runtime

### Open File

```
Trigger: click file in explorer tree, or open in preview command
  → layout.previewPanel.selectFile(filePath)
    → setStore("previewPanel", "currentFile", filePath)
    → setStore("previewPanel", "files", [...files, filePath]) (if new)
    → setStore("previewPanel", "opened", true) (if closed)
```

### Load File

```
activeFile() changes → createResource refetches:
  → SDK: sd.file.read({ path: relativePath })
    → Response: { content, ... }
  → File type detection:
    → Markdown: marked.parse() → innerHTML
    → Image: <img src={...} />
    → PDF: <embed src={...} />
    → Text/Binary: <pre><code> monospace or icon + message
```

### Caching

Preview panel does NOT cache file content client-side beyond the resource lifetime. Each file switch triggers a new `createResource` fetch. However, the SDK layer may have its own HTTP caching (ETags, etc.).

### Scroll Restoration

```typescript
createEffect(() => {
  const file = activeFile()
  if (!file || !contentRef) return
  const savedPos = scrollPositions[file] ?? 0
  queueMicrotask(() => {
    if (contentRef) contentRef.scrollTop = savedPos
  })
})
```
- Scroll positions stored per file in `scrollPositions` store
- Restored via `queueMicrotask` on file switch
- Position saved on scroll (via onScroll handler)

### Tab Switching

```
Click tab in preview tab bar:
  → layout.previewPanel.setCurrentFile(path)
    → activeFile() memo changes
    → Resource refetches new file content
    → Scroll position restored from scrollPositions
```

### Closing

```
Click close (X) on tab:
  → layout.previewPanel.closeFile(path)
    → File removed from files list
    → currentFile switches to next available or undefined

Click close-all (X button):
  → layout.previewPanel.close()
    → files = [], currentFile = undefined
    → Preview panel width animates to 0
```

### Error Handling

```
File load fails:
  → createResource error state
  → "Failed to load file content" message shown
  → "Retry" ButtonV2 → refetch() called
```

### Reload

```
Manual reload:
  → refetch() on fileContent resource
    → SDK re-reads file
    → Content re-rendered
```

---

## 64. Composer Runtime

### Typing

```
User types in contentEditable div (ProseMirror rich editor)
  → prompt.set(text, cursorPosition)
    → PromptStore updates
  → prompt.current() memo re-evaluates
  → blank() computed (text + attachments + comments)
  → Submit button enabled/disabled
```

### History

```
ArrowUp (at start of input):
  → controller.addHistory(value, mode)
    → Cycles through previous prompts (if any)
    → Prompt content replaced with history entry

ArrowDown (at end of input):
  → controller.resetHistory()
    → Returns to current (empty) prompt
```

History persisted via `history` store (per-session or per-draft).

### Autocomplete / @Mentions

```
User types @
  → onSuggestionSelect callback
  → Context suggestions computed:
    → resources(): MCP resources
    → references(): session context files
    → agents(): available agents
    → recent(): recently opened files
  → Dropdown renders with filtered suggestions
  → User selects → item added to prompt context
  → ContextItems chips shown below input
```

### Slash Commands

```
User types /
  → commands() memo computes available slash commands
    → Built-in commands + custom ones (from command registration)
  → Dropdown shows available commands
  → User selects → command executes
```

**Built-in commands:**
- Shell mode (`/shell`)
- Normal mode (`/normal`)
- File attach (`/file`)
- Clear context

### Attachments

**File attachment:**
```
Ctrl+U or click attach button
  → controller.attach()
    → File picker dialog opens
    → User selects file
    → File added to prompt context
    → ImageAttachments show thumbnail
```

**Comment attachment:**
```
Add comment to context:
  → prompt.context.add(commentItem)
    → ContextItems chip shown
    → commentCount() increments
```

### Model Selection

```
Click model name in composer
  → ModelSelectorPopoverV2 opens
  → Shows available models by provider
  → User selects model
  → model.selection.set(model)
    → PromptModel updated
    → Composer re-renders with new model badge
```

**Keyboard:**
```
Ctrl+' → DialogSelectModel opens
Shift+Ctrl+D → cycles to next model variant
```

### Agent Selection

```
Click agent name in composer
  → Agent selector dropdown
  → User selects agent (Ask, Build, Plan, Review, Docs, Explore, Write)
  → agent set via prompt or session controller
```

**Keyboard:**
```
Ctrl+. → next agent
Shift+Ctrl+. → previous agent
```

### Submit

```
User clicks submit button or Ctrl+Enter:
  → submission.handleSubmit()
  → Captures:
    prompt text (from ProseMirror editor)
    context items (files, comments)
    attachments (images)
    model selection
    agent selection
  → If draft tab: creates session via SDK
  → If existing session: sends prompt to session
  → On success:
    → Clears prompt text
    → Clears context items (configurable)
    → Resumes auto-scroll in timeline
    → Focus returns to input
  → On error:
    → Error toast shown
    → Prompt preserved for retry
```

### Streaming

After submit, the session enters streaming state:
```
SDK event: session.busy → working() = true
  → Composer shows stop button
  → Prompt input disabled/lowered opacity
  → Timeline shows streaming content

SDK event: session.idle → working() = false
  → Composer re-enabled
  → Stop button hidden
  → Followup dock may appear
```

### Reset

```
Reset trigger:
  → prompt.reset(scope)
    → PromptStore cleared
    → Cursor reset
    → Context items cleared
    → History preserved
```

---

## 65. Terminal Runtime

### Terminal Creation

```
User clicks "+" in terminal tab bar:
  → terminal.new({ focus: true })
    → SDK: sd.pty.start() creates PTY session
    → New terminal entry added to persisted store
    → xterm.js instance mounts in TerminalPanel
    → PTY connected to WebSocket
```

**Provider-initiated creation:**
TerminalProvider creates a `createWorkspaceTerminalSession()` for each workspace key:
- Sets up persisted store (cache max 20)
- Registers `pty.exited` event listener
- Provides `new()`, `update()`, `trim()`, `clone()`, `open()`, `close()`, `move()`

### PTY Creation

```
sd.pty.start() creates PTY:
  → Server spawns shell process
  → WebSocket connection established
  → PTY output streamed to xterm.js
  → User input sent via WebSocket to PTY
```

### Tab Creation

```
terminal.new() creates terminal entry:
  → ID generated
  → Persisted to server-workspace store
  → Tab rendered in terminal tab strip
  → Auto-focus (if focus: true)
```

**Terminal tab types:**
- `LocalPTY: { id, title?, state?, ... }`

### Resize

```
TerminalPanel resized (drag resize handle):
  → terminal.update({ id, rows, cols })
    → PTY resize sent via WebSocket
    → xterm.js resize

Or panel resize:
  → layout.terminal.resize(height)
    → Terminal panel height changes
    → xterm.js detects container resize
    → PTY resize sent
```

### Reconnect

**Event stream reconnect:**
```
pagehide/pageshow → server-sdk.tsx handles reconnection
  → Terminal event stream reconnects
  → PTY state re-synced
```

### Recovery

```
PTY exits unexpectedly:
  → pty.exited event received
  → Terminal removed from store
  → Tab removed from tab strip
  → User notified via UI (terminal gone)
```

### Focus

```
User clicks terminal:
  → terminal.requestFocus(id)
    → xterm.js focused
    → Global focus listener cancels terminal focus when clicking outside #terminal-panel

Focus request via code:
  → terminal.consumeFocus(id) → xterm.js focused
```

### Disposal

```
Terminal tab closed:
  → terminal.close(id)
    → PTY process killed via SDK
    → Terminal removed from store
    → xterm.js instance destroyed
    → Tab removed

Workspace switch:
  → Terminal trimmed (buffers cleared)
  → Cached for later return to workspace

Cleanup on provider unmount:
  → All cached terminal sessions disposed
  → Global caches set removes entry
```

---

## 66. Animation Runtime

### Animation Trigger Sources

| Trigger | Animation | Source |
|---------|-----------|--------|
| Component mount | Fade-in, slide-up | CSS transitions, Tailwind |
| State change | Width transition (panels) | `transition-[width]` CSS |
| Hover | Background color, shadow | CSS transitions |
| Focus | Border ring, shadow | `--shadow-xs-border-focus` |
| Loading | Pulse opacity | `--animate-pulse` |
| Splash screen | Pulse scale | `--animate-pulse-scale` |
| Text reveal | Staggered fade-up | `fadeUp` keyframe + delays |
| Todo progress | Spring animation | SolidJS spring physics |
| Update spinner | Rotation | `titlebar-update-loader-spin` |
| Scroll edge fade | Visibility animation | CSS Scroll-Timeline API |

### Scheduling

**CSS Animations:**
- Declared in `animations.css` and inline Tailwind
- Scheduled by browser rendering engine
- Run on the compositor thread (GPU-accelerated where possible)

**JS-Driven Animations:**
- RAF-based loops (DebugBar FPS, prepend anchor, todo animation)
- `requestAnimationFrame` scheduling
- Spring physics via manual RAF loop (SessionTodoDock)

### Execution

**CSS Animation execution:**
```
Element mounts / class toggled
  → Browser starts animation
  → Animation runs on compositor (opacity, transform)
  → `animationend` event fires on completion
```

**CSS Transition execution:**
```
Property changes (e.g., width from 0px to 280px)
  → Transition triggers
  → Duration: 240ms, easing: cubic-bezier(0.22,1,0.36,1)
  → `transitionend` event fires
  → `motion-reduce:transition-none` for accessibility
```

**JS Animation execution (prepend anchor):**
```
capturePrependAnchor() → save anchor element + offset
restorePrependAnchor() → RAF loop:
  → Find anchor element in DOM
  → Calculate offset difference
  → Adjust scrollTop
  → Loop until stable (30 frames) or timeout (180 frames = 3s)
```

**Spring animation execution (todo dock):**
```
Todos update → todoState changes
  → RAF loop calculates spring physics
  → Dock position lerps to target
  → Settles when velocity near zero
```

### Completion

**CSS completion:**
- Native `animationend` / `transitionend` events
- No JS callback needed for most animations

**JS completion:**
- RAF loop ends when condition met (stable frames, settled spring)
- Callback executes

### Cancellation

**CSS cancellation:**
- Class removed → animation stops
- Property reset → transition interrupts
- `animation: none` (reduced motion)

**JS cancellation:**
- RAF canceled via `cancelAnimationFrame`
- Timeout cleared via `clearTimeout`
- Interrupted by new animation start

### Interruptions

**Transition interruption:**
```
Width transition in progress (panel opening)
  → User triggers panel close
    → Width changes from intermediate value to 0
    → Transition interrupts and reverses
    → CSS transition handles this natively
```

**Animation interruption:**
```
Fade-up text animation in progress
  → Component unmounts
    → Animation stops immediately
```

### Reduced Motion

**`prefers-reduced-motion: reduce` handling:**
```css
/* Panel transitions */
motion-reduce:transition-none

/* Titlebar update spinner */
@media (prefers-reduced-motion: reduce) {
  [data-slot="titlebar-update-loader"] { animation: none; }
}
```

---

## 67. Focus Management

### Focus Ownership

Focus is owned by the currently active interactive element:
- `input`, `textarea`, `[contenteditable]` — text input fields
- `button`, `[role="button"]`, `a` — clickable elements
- `[tabindex]` — programmatically focusable elements
- `xterm.js` — terminal PTY instances

### Focus Transfer

**Dialog opens:**
```
dialog.show() → Kobalte Dialog mounts
  → Focus trapped within dialog
  → First focusable element auto-focused
  → Previous focus saved for restoration
```

**Dialog closes:**
```
Dialog dismisses
  → Focus returned to trigger element
  → If trigger unmounted, focus falls back to <body>
```

**Terminal focus:**
```
User clicks terminal:
  → terminal.requestFocus(id)
    → xterm.js focused
  → Global focusin listener tracks terminal focus

Code requests focus:
  → terminal.requestFocus(id)
  → TerminalPanel's autoFocus prop = true
  → xterm.js receives focus

Focus leaves terminal:
  → document focusin event
  → If target is NOT inside #terminal-panel
    → terminal.cancelFocus()
```

**Composer focus:**
```
Global keydown handler (session.tsx):
  → Single printable character pressed
  → If not editing in a protected element (input, dialog, [data-prevent-autofocus])
    → inputRef.focus()
    → Restore cursor position
```

### Keyboard Navigation Tab Order

Natural DOM order follows component render order. Key tab order regions:

1. **Titlebar:** Window controls → Menu bar → Tab strip → Session controls
2. **Explorer Panel:** Collapsible sections → Project list → File tree → New Session button
3. **Main area (session):** Message timeline → Composer → Docks
4. **Preview Panel:** Tab bar → File content
5. **Dialogs:** Close button → Content controls → Action buttons
6. **Command Palette:** Search input → Results list

### Dialog Focus Trap

Kobalte Dialog implements focus trapping:
```
Dialog mounts
  → Focus trapped: Tab/Shift+Tab cycles within dialog
  → First focusable element gets initial focus
  → Last element wraps to first (and vice versa)
  → Escape key closes dialog
  → Click outside closes (if dismissable)
  → onCloseAutoFocus restores focus to trigger
```

### Restore Focus

On dialog close, Kobalte restores focus to the element that triggered the dialog:
```
Dialog closes
  → onCloseAutoFocus event
  → Focus returned to previously focused element
  → If element no longer exists → fallback to document.body
```

On session switch, no explicit focus restore — the user's focus naturally follows their interaction.

---

## 68. Runtime Error Recovery

### Loading Failures

**File content fails:**
```
sd.file.read() throws
  → createResource enters error state
  → PreviewPanel shows: "Failed to load file content" message
  → "Retry" ButtonV2 shown
  → Click → refetch() → SDK re-reads
```

**Directory listing fails:**
```
sd.file.list() throws
  → ExplorerPanel shows: "Failed to load project files" message
  → "Retry" ButtonV2 shown
  → Click → refetch() → SDK re-lists
```

**Session loading fails:**
```
SessionData fetch fails
  → SessionRouteErrorBoundary catches error
  → Renders SessionErrorFallback (new layout) or ErrorPage (legacy)
  → Shows error context + retry options
```

### Preview Failures

**Unsupported file type:**
```
File type not in known types (md, png, pdf, text)
  → Show: file icon + "Binary or unsupported file format" + file path
```

**Image load fails:**
```
<img> src fails to load
  → Native img error handler (broken image icon)
```

### Session Failures

**Session not found:**
```
sync().data has no session matching ID
  → SessionRouteErrorBoundary renders fallback
  → SessionErrorFallback with "Session not found" message
```

**Session API failure:**
```
Prompt submission fails
  → Error toast shown
  → Prompt text preserved for retry
  → User can re-submit
```

**Session streaming error:**
```
Session errors during streaming
  → ErrorNotification added to notification store
  → Notification icon shown in UI
  → Timeline may show error row (TimelineRow.Error type)
```

### Provider Failures

**Server connection lost:**
```
ConnectionGate health check fails
  → ConnectionError screen renders
  → Shows: unreachable server name, retrying message
  → Auto-retry every 1 second
  → Shows list of other servers to switch to
  → User clicks another server → setActive + healthCheckActions.refetch()
```

**Provider auth failure:**
```
Provider key invalid/expired
  → Permission dialogs or provider connection dialog
  → User can reconnect/re-authenticate
```

### Rendering Failures

**Component render error:**
```
Component throws during render
  → ErrorBoundary catches
  → Sentry.captureException() called
  → SessionRouteErrorBoundary: renders SessionErrorFallback or ErrorPage
  → Top-level ErrorBoundary: renders ErrorPage
```

**ErrorPage content:**
```
Logo, "Something went wrong" title
  → Error description (localized)
  → TextField with formatted error details (copyable)
  → Buttons: Restart, Export Logs, Report (Sentry), Check Updates
  → Discord link + version info
```

### Recovery Flow

```
Error occurs
  → ErrorBoundary catches
  → Error details captured via Sentry
  → Fallback UI renders
  → User can:
    → Restart app (platform.restart → window.location.reload())
    → Export logs (platform.exportDebugLogs)
    → Report error (Sentry.captureException)
    → Check for updates (platform.updater)
    → Retry (via specific retry button in component)
```

### Retry Flow

**Auto-retry:**
```
ConnectionGate: retry every 1 second
  → setInterval(props.onRetry, 1000)
  → Triggers health check refetch
```

**Manual retry:**
```
"Retry" button in PreviewPanel / ExplorerPanel:
  → refetch() on resource
  → SDK call re-executes
```

### Fallback UI

**Error fallback hierarchy:**
```
Top-level ErrorBoundary (app.tsx)
  → ErrorPage (full-screen recovery page)

SessionRouteErrorBoundary (session.tsx)
  → SessionErrorFallback (if newLayoutDesigns)
  → ErrorPage (if legacy layout)

Inner ErrorBoundary (session panel)
  → SessionErrorFallback (resettable error boundary)
```

---

## 69. Runtime Performance Behavior

### Lazy Loading

**6 lazy-loaded components** via `lazy()`:
```
NewSession          → route-navigation triggered (app.tsx:72)
DialogSelectDirectoryV2 → dialog-open triggered (directory-picker.tsx:9)
DialogSelectFileV2  → dialog-open triggered (dialog-select-file.tsx:25)
IconV2 (settings)   → settings-tab triggered (settings-keybinds.tsx:19)
StatusPopoverBody   → popover-hover triggered (status-popover.tsx:14)
StatusPopoverServerBody → popover-hover triggered (status-popover.tsx:15)
```

Each lazy component creates a separate JS chunk loaded on demand.

### Memoization

**`createMemo` usage** — extensive throughout the codebase:
- All derived state uses `createMemo` for lazy evaluation
- Dependencies tracked automatically
- Only re-evaluates when dependencies change
- Multiple consumers share single evaluation

**Key memoization examples:**
- `timelineRows()` — derived from session messages, updates only on message change
- `options()` — resolved command options, updates only on registration or keybind change
- `current()` (server) — active server connection, updates only on server list or active change
- `scope()` / `sessionKey()` — reactive route keys

### Virtualization

**2 virtualized components:**

**FileTreeV2:**
- Custom virtual scroll implementation
- Only renders visible tree nodes + overscan
- Handles variable-height rows (indentation depth)
- Efficient expand/collapse (no re-render of invisible nodes)

**MessageTimeline** (`@tanstack/solid-virtual`):
```
createVirtualizer configuration:
  count: timelineRows().length  (reactive)
  estimateSize: 60px  (fallback)
  overscan: 50  (render 50 items outside viewport)
  anchorTo: "end"  (bottom-anchored)
  followOnAppend: true  (auto-follow new content)
  scrollEndThreshold: 80px  (considered "at end")
  paddingEnd: 64px  (extra bottom padding)
  scrollMargin: 64px  (when header visible)
```

**Virtualizer performance features:**
- `getItemKey` — stable identity for rows (prevents unnecessary remounts)
- `initialMeasurementsCache` — preserves measurements across session switches
- `resizeItem` override — handles large size changes without jank
- Custom `rangeExtractor` — pins active message and resize indexes
- `timelineCache` — LRU cache (max 16 sessions) preserves scroll state

### Suspense

**3 Suspense boundaries:**
```
layout-new.tsx:102 → route content (catches lazy route components)
status-popover.tsx:63 → StatusPopoverBody (catches lazy body)
status-popover.tsx:147 → StatusPopoverServerBody (catches lazy server body)
```

**Suspense wrapping (prompt.tsx):**
```typescript
const withSuspense = <T,>(cb: () => T): (() => T) => {
  const [resource] = createResource(() => session().ready.promise.then(cb))
  return () => resource()
}
```
Wraps session accessors so `<Suspense>` can catch async session readiness.

### Deferred Rendering

**`requestAnimationFrame` scheduling:**
```
MessageTimeline onMount:
  → 1st RAF: scrollToEnd()
  → 2nd RAF: setRenderOverscan(20), scrollToEnd() again

Prepend anchor adjustment:
  → RAF loop (up to 180 frames, 3 seconds)

Panel width animation:
  → CSS transition (native, compositor-thread)

Session page deferred init:
  → requestAnimationFrame + setTimeout(0) for non-blocking init
```

### Batching

**`batch()` usage:**
```
Comments CRUD:
  → batch(() => {
      setStore mutations
      focus resets
    })
  → Single reactive notification to consumers

Dialog operations:
  → Status updates batched in dialog lifecycle
```

SolidJS automatically batches state updates within event handlers, effects, and timeouts.

### Caching

**Timeline cache:**
```
timelineCache: Map<string, { measurements, toolOpen }>
  → Saved on session switch (onCleanup)
  → Restored on session re-entry
  → LRU eviction at 16 entries
```

**File tree cache:**
```
treeCache: Record<string, FileEntry[]>
  → Cached directory listings
  → Cleared on directory change
  → No explicit eviction limit
```

**Prompt session cache:**
```
cache: Map<string, PromptCacheEntry>
  → LRU eviction at 20 entries
  → Disposed via createRoot on cleanup
```

**Terminal session cache:**
```
cache: Map (per workspace)
  → Max 20 terminal sessions
  → Pruned on exceed
  → Trimmed (buffer cleared) on workspace switch
```

**File content LRU:**
```
evictContentLru() — byte-budget eviction
  → Tracks total loaded file content size
  → Evicts least recently used when over budget
```

**Command catalog cache:**
```
catalog: persisted store
  → Caches known command metadata
  → Allows keybind settings UI to list all commands even before their modules mount
```

### Resource Reuse

**Server contexts:**
```
GlobalProvider.ensureServerCtx(conn):
  → createRefCountMap caches SDK + sync contexts per server
  → Reused across all components consuming the same server
  → Disposed only when server removed
```

**Per-tab reactive roots:**
```
tabs.state(tab, name, init):
  → tab-memory.ts creates/retrieves per-tab reactive root
  → State persists across tab switches
  → Disposed when tab is closed
```

---

## 70. Final Runtime Blueprint

### Runtime Architecture Summary

The HeniossAI Presentation Layer runtime is a **SolidJS reactive application** running in a browser/desktop (Tauri) environment. The runtime is organized as:

1. **Entry/Bootstrap** (`entry.tsx` → `app.tsx`): Platform detection, locale detection, server initialization, provider chain mount
2. **Provider Shell** (~23 nested providers): Context-based state distribution with hierarchical initialization
3. **Router/Layout Gate** (`Router` + `NewLayout`/`LegacyLayout`): Route-driven component mounting with layout gating
4. **Session Workspace** (`SessionPage`): Message timeline, composer, docks, side panel, terminal — the primary interaction surface
5. **Overlay System** (`DialogProvider` + portals): Dialogs, menus, popovers, toasts — transient UI layers

### Reactive Architecture Summary

```
Signals (createSignal)        → Simple state (± boolean, string, number)
Stores (createStore)          → Complex state (± objects, arrays)
Memos (createMemo)            → Derived/computed values
Effects (createEffect)        → Side effects (DOM, persistence, logging)
Resources (createResource)    → Async data fetching
Roots (createRoot)            → Isolated disposable scopes
```

**Reactive propagation:** Change → Signal/Store set → Memo re-evaluation → Effect execution → DOM update (direct, no VDOM)

### Rendering Architecture Summary

| Feature | Implementation | Count |
|---------|---------------|-------|
| Initial render | Synchronous tree walk + DOM commit | 1 per page load |
| Re-render | Fine-grained signal-to-DOM binding | Per-signal-change |
| Conditional | Show/Match/Switch (unmounts hidden branches) | ~200+ instances |
| Lazy | `lazy()` + Suspense | 6 components |
| Portal | `Portal` + `*Portal` (Kobalte/DropdownMenu) | ~40+ portal sites |
| Suspense | Resource-boundary fallback | 3 boundaries |
| Virtualized | `@tanstack/solid-virtual` | 2 components |
| Deferred | `requestAnimationFrame` / `setTimeout(0)` | Timeline init, prepend anchor |

### Provider Architecture Summary

**23 providers** organized in 4 tiers:
1. **Foundation** (Platform, Language, Theme, ErrorBoundary): App-wide singletons
2. **Data** (Server, Global, Settings, Tabs): Server connection and user state
3. **Workspace** (Layout, SDK, File, Terminal, Comments, Prompt): Per-directory/session state
4. **UI** (Command, Dialog, Permission, Notification, Highlights): Interaction management

### Navigation Runtime Summary

| Navigation Type | Mechanism | State Effect |
|---------|-----------|-------------|
| Route navigation | `navigate(href)` → Router → component mount | Full page/session switch |
| Tab switch | `tabs.select(tab)` → `navigate(tab.href)` | Session switch, timeline reset |
| Project selection | `layout.home.selection.set(dir)` | Explorer reload, route update |
| Panel toggle | Layout store → CSS transition | Panel mount/unmount |
| Tab close | `tabs.closeTab(index)` | Store update, route navigate |

### Explorer Runtime

- **Project load**: Server sync data → enriched → avatar colors → rendered list
- **Directory load**: SDK list → treeCache → FileTreeV2 virtual rows
- **Expand/Collapse**: Toggle state → lazy SDK fetch → cached children
- **Filter/Search**: Signal → reactive filter → tree re-render
- **Preview sync**: File click → layout.previewPanel.selectFile() → preview opens

### Workspace Runtime

- **Timeline**: Virtualized message list, streaming updates, scroll-anchored history loading
- **Composer**: Rich text editor, @mentions, slash commands, model/agent selection, submit/stream
- **Docks**: Permission, question, todos, followups, revert — reactive to session state
- **Side panel**: Review (diffs), context (stats), file browser (tree), file view (tabs)
- **Terminal**: PTY via WebSocket, multiple tabs, resize, focus management

### Preview Runtime

- **Open**: File click or layout store update → SDK read → type detection → render
- **Scroll**: Per-file scroll position persisted and restored on switch
- **Tabs**: Multiple open files, tab switching, close individual or all
- **Error**: Failed load → retry button → SDK refetch

### Session Runtime

- **Creation**: Draft tab → prompt submit → SDK session create → promoted to session tab
- **Streaming**: SSE events → sync store → timeline projection → virtualizer → DOM
- **State transitions**: idle → busy (streaming) → idle (complete) with dock animations
- **Permissions/Questions**: Non-blocking docks, auto-accept rules
- **Followups**: Queued, auto-send on idle, editable
- **Termination**: Archive (hides), Delete (removes + navigates)

### Composer Runtime

- **Input**: ProseMirror editor → reactive signal → derived state (blank, stopping)
- **Submit**: Capture state → SDK call → clear on success → error toast on failure
- **History**: Arrow navigation through previous prompts
- **Mentions**: @ → context suggestions → selection → context chip
- **Model/Agent**: Selector popovers → SDK update → session model change
- **Mode**: Shell (Ctrl+Shift+X) / Normal (Ctrl+Shift+E)

### Terminal Runtime

- **Creation**: SDK pty.start → WebSocket → xterm.js
- **Tabs**: Multiple per workspace, persisted, drag-reorderable
- **Resize**: WebSocket → PTY resize → xterm resize
- **Reconnect**: Event stream → page visibility → auto-reconnect
- **Focus**: Request/cancel via terminal provider, global focus listener
- **Disposal**: PTY kill → store remove → xterm destroy

### Overlay Runtime

- **Dialogs**: Portal mount → backdrop → focus trap → dismiss → focus restore → portal unmount
- **Menus**: Portal mount → position relative to trigger → keyboard nav → select/dismiss
- **Popovers**: Lazy body → Show condition → Suspense → positioned relative → dismiss
- **Toasts**: Stacked region → auto-dismiss timer → manual dismiss → animated exit
- **Debug**: PerformanceObserver + RAF loop → metrics display → visibility pause/resume

### Animation Runtime

- **CSS Animations**: Keyframes from `animations.css` (pulse, fade-up, spin)
- **CSS Transitions**: Panel width (240ms cubic-bezier), hover effects
- **JS Animations**: Spring physics (todo dock), RAF loops (prepend anchor, FPS monitoring)
- **Reduced Motion**: `motion-reduce` utilities, `prefers-reduced-motion: reduce` media query

### Focus Runtime

- **Global keyboard**: document-level keydown (capture), command dispatch, input focusing
- **Dialog focus trap**: Kobalte Dialog: trap, auto-focus, restore trigger on close
- **Terminal focus**: Request/cancel pattern, global focusout listener
- **Composer focus**: Auto-focus on printable key outside editable targets
- **[data-prevent-autofocus]**: Attribute prevents focus stealing during reactive updates

### Performance Runtime

- **Lazy loading**: 6 lazy components, code-split by route/dialog trigger
- **Memoization**: Extensive `createMemo` usage for derived state
- **Virtualization**: 2 virtualized components (timeline + file tree)
- **Caching**: Session timeline (16 LRU), file tree directory listings, terminal sessions (20), prompt sessions (20), file content (byte-budget LRU)
- **Batching**: SolidJS auto-batching within event handlers + manual `batch()` calls
- **Deferred rendering**: RAF for non-critical work, `setTimeout(0)` for deferred init

### State Runtime

- **Persistence**: `localStorage` via `persisted()` utility, scoped by global/server/workspace/session/window
- **Initialization**: Async load from storage, `ready()` signal for gated components
- **Reset triggers**: Server switch, directory change, session switch, layout toggle
- **Cleanup**: `onCleanup` + `createRoot.dispose()` for deterministic teardown

### Event Runtime

- **Keyboard**: Global capture handler → `signatureFromEvent()` → `keymap` lookup → `onSelect`
- **Mouse**: Event delegation (Show, click handlers) → state updates → reactive propagation → render
- **Touch/Wheel**: Gesture boundary detection → scroll anchoring → history loading
- **Window**: `visibilitychange` → monitoring pause/resume, `pagehide` → state flush
- **SDK Events**: Server-Sent Events → server-sync → per-directory stores → reactive components

### Lifecycle Runtime

- **Bootstrap**: entry.tsx → Platform → Providers → ConnectionGate → Router → Layout → Route
- **Component mount**: JSX evaluation → reactive primitive creation → DOM commit → onMount
- **Component update**: Reactive signal change → fine-grained DOM update
- **Component unmount**: onCleanup → reactive scope disposal → DOM removal
- **Session lifecycle**: Draft → Submit → Stream → Complete → Archive/Delete

### Complete Runtime Flow (End to End)

```
Application Start (entry.tsx)
  → Platform detection (web/desktop)
  → Locale detection (en/zh)
  → Auth token extraction
  → Server URL resolution
  → Provider chain mount (23 providers)
  → ConnectionGate health check
    → Splash screen (loading)
    → On healthy: App renders
    → On unhealthy: ConnectionError (auto-retry)

User Interaction
  → Event triggers (click, keydown, etc.)
  → Handler execution
  → State update (Signal/Store set)
  → Reactive propagation (Memo → Effect)
  → Fine-grained DOM update
  → Animation (CSS transition/keyframe)
  → Final visual state

Session Lifecycle
  → User creates/submits prompt
  → SDK call → server processes
  → SSE events → sync store updates
  → Timeline projection recomputes
  → Virtualizer renders new/updated rows
  → Streaming content appears
  → Session completes
  → Followup suggestions / notification

Cleanup
  → User closes tab / switches session
  → onCleanup: state saved, caches stored
  → New session state loads
  → Timeline restores from cache

Shutdown
  → User closes window / navigates away
  → pagehide: final state flush
  → Browser unloads
  → localStorage persists state
```