# Explorer Capabilities Inventory — Baseline

| # | Capability | Location | Status | Notes |
|---|-----------|----------|--------|-------|
| 1 | Projects List | explorer-panel.tsx:336-368 | ✅ Functional | HomeProjectsView with full server/project list |
| 2 | Recent Projects | home-projects-view.tsx | ✅ Functional | Recently closed projects display |
| 3 | Quick Project Switch | home-projects-view.tsx | ✅ Functional | Click to switch selected project |
| 4 | Sessions Grouped by Project | explorer-panel.tsx:371-405 | ✅ Functional | HomeSessionsView with today/yesterday/older groups |
| 5 | Archived Sessions | home-session-archive.ts | ⚠️ Dead UI | SHOW_HOME_SESSION_ARCHIVE=false, archive button never rendered |
| 6 | Resume Session | home-session-open.ts | ✅ Functional | Click session row to open/resume |
| 7 | New Session | home-sessions-view.tsx:86-97 | ✅ Functional | "New Session" button in sessions section |
| 8 | File Tree | explorer-panel.tsx:38-81 | ✅ Functional | Directory/file listing with expand/collapse, lazy load |
| 9 | Collapse / Expand | explorer-panel.tsx:62-81 | ✅ Functional | Directory toggle with cached children |
| 10 | Context Menus | explorer-panel.tsx:236-268 | ✅ Functional | Right-click: Open Preview, Copy Path, Copy Name |
| 11 | Project Search (File Filter) | explorer-panel.tsx:97-104 | ✅ Functional | Filter input filters file tree by name |
| 12 | Session Search | home-session-search-controller.ts | ✅ Functional | Search input with results, keyboard nav |
| 13 | Quick Filter | explorer-panel.tsx:97-104 | ✅ Functional | Same as Project Search |
| 14 | Active Project Header | explorer-panel.tsx:113-137 | ✅ Functional | Header with project name, refresh, close |
| 15 | Status Badges | home-projects-view.tsx:128 | ✅ Functional | Server health indicators, session status badges |
| 16 | State Indicators | explorer-panel.tsx:169-194 | ✅ Functional | Loading, error, empty states for each section |
| 17 | Open Editors (Preview Tabs) | (preview-panel.tsx outside scope) | ❌ Out of scope | Preview Panel is not part of Explorer |
| 18 | Quick Actions | explorer-panel.tsx:122-137 | ✅ Functional | Refresh, close in header |
| 19 | Keyboard Shortcuts | layout-new.tsx | ✅ Functional | mod+shift+e toggle, mod+f search |
