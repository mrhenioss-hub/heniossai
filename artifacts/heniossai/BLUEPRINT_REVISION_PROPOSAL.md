# Blueprint Revision — Product Vision Correction

## Executive Summary

The implementation faithfully followed the Blueprint's literal wording ("hidden by default"). However, the Product Vision was misinterpreted. The invariant I-VISIBLE-ISOLATION was intended to protect the **Session region only**, not the entire application window. The surrounding workspace — Explorer shelf, Preview Panel, chrome — should clearly communicate that this is HeniossAI from the first launch.

This revision corrects the Blueprint to align with the original intent: a visible three-pane environment on first launch, with the Session as the only unchanged region.

---

## Clarified Product Vision

### Three-Pane Architecture (revised)

| Pane | Default state | Visual change from OpenCode |
|------|---------------|------------------------------|
| **Left — Explorer** | Visible at 280px | New — file tree, project navigation |
| **Center — Session** | Full width minus panels | **Identical** — I-VISIBLE-ISOLATION applies here only |
| **Right — Preview Panel** | Visible at 420px, branded empty state | New — tabbed file preview with HeniossAI welcome |

### Clarified Principle

**Before (misinterpreted):** "The application should look almost identical to OpenCode on first launch."

**After (corrected):** "The Session workspace (center pane) should look identical to OpenCode. The three-pane environment should be immediately visible. The Session is the unchanged working surface; the panels are the extended HeniossAI workspace."

### Invariant I-VISIBLE-ISOLATION — Corrected Scope

| Before (incorrect application) | After (corrected) |
|-------------------------------|-------------------|
| "New panel styles must not leak into the Session" — applied to mean "entire window unchanged" | "New panel styles must not leak into the **Session region**" — applies only to the `<main>` element containing routed content |
| Panels hidden by default to satisfy this invariant | Panels visible by default; invariant satisfied by CSS isolation on the Session element |

The invariant text itself was already correct:
> "Session rendering and interaction must be visually and behaviorally identical to the pre-change state."

The implementation applied this too broadly — it treated the entire window as the Session.

---

## Revised Default State

### Defaults

| State | Current | Revised |
|-------|---------|---------|
| `explorerPanel.opened` | `false` | `true` |
| `explorerPanel.width` | `280` | `280` (unchanged) |
| `previewPanel.opened` | `false` | `true` |
| `previewPanel.width` | `420` | `420` (unchanged) |
| Preview Panel content when idle | (hidden) | HeniossAI branded empty state |
| `files` | `[]` | `[]` (unchanged — no file selected yet) |
| `currentFile` | `undefined` | `undefined` (unchanged — no file selected yet) |

### Visual Layout on First Launch

```
|  Explorer (280px)  |  Session (flex-1)          |  Preview Panel (420px)     |
|                    |                             |                            |
|  [Project Name]    |  Original OpenCode          |  [HeniossAI Logo]          |
|  ─────────────     |  workspace                  |                            |
|  🔍 Filter...      |  (exact, unchanged)         |  Select a file from the    |
|  📁 src/           |                             |  Explorer to preview it    |
|  📁 docs/          |  Conversations              |  here.                     |
|  📄 README.md      |  Agent execution            |                            |
|  📄 package.json   |  Diff                       |  Supported formats:        |
|                    |  Terminal                   |  📝 Markdown               |
|                    |  Task execution             |  🖼 Images                 |
|                    |  Streaming                  |  📄 PDF                    |
|                    |                             |  💻 Code                   |
|                    |                             |                            |
```

The Preview Panel shows an informative welcome state with HeniossAI branding and a brief explanation of what the panel does. This empty state already exists in the `PreviewPanel` component (Phase 3 deliverable: "Empty state when no file selected") — it only needs cosmetic updates.

---

## What Changes

### Files Modified

| File | Change | Impact |
|------|--------|--------|
| `packages/app/src/context/layout.tsx` | `explorerPanel.opened: false` → `true`; `previewPanel.opened: false` → `true` | 1 line each, zero structural changes |
| `packages/app/src/components/preview-panel.tsx` (optional) | Polish empty state with HeniossAI branding/logo | Cosmetic only — or leave as-is if the current empty state already communicates the purpose |

That's it. Two default value changes. No new components. No persistence. No new state domains. No new dependencies.

---

## Invariant Compliance

| Invariant | Status | Rationale |
|-----------|--------|-----------|
| **I-SESSION** | ✅ PASS | Session renders as `{props.children}` in unchanged `<main>` element. Zero modification to Session files. |
| **I-RUNTIME** | ✅ PASS | No backend, Core, or Application Engine changes. |
| **I-SCOPE** | ✅ PASS | Changes are in `layout.tsx` (Presentation Layer). |
| **I-CATEGORY-A** | ✅ PASS | Zero imports from protected subsystems. |
| **I-SESSION-FILES** | ✅ PASS | Zero imports from Session internals. |
| **I-NO-DEPS** | ✅ PASS | Zero new npm packages. |
| **I-BACKWARD** | ✅ PASS | Existing Layout State domains untouched. Only default values changed. Existing consumers observe no API change. |
| **I-UNIDIRECTIONAL** | ✅ PASS | Session does not import panels. |
| **I-COMM-LAYER** | ✅ PASS | Panels communicate through Layout State only. |
| **I-VISIBLE-ISOLATION** | ✅ PASS | Session region is visually and behaviorally identical. Panel content is outside the Session `<main>` element. CSS isolation (existing classes on `<main>`) prevents style leakage. |

### I-VISIBLE-ISOLATION — Specific Verification

The `<main>` element in `layout-new.tsx`:
```tsx
<main class="flex-1 min-h-0 min-w-0 overflow-x-hidden flex flex-col items-start contain-strict">
  <Suspense>{props.children}</Suspense>
</main>
```

These classes are unchanged from the pre-change state. The `contain-strict` class provides CSS containment, preventing panel styles from affecting the Session. The panels render in sibling `<div>` elements outside `<main>`. No style leakage is possible.

---

## Verification Criteria

After the default change, verify:
1. Three columns render on first launch (Explorer | Session | Preview)
2. Session `<main>` element classes are unchanged from pre-change state
3. Session scrolling, interaction, and rendering are identical to original OpenCode
4. Preview Panel shows empty state (not file content) when no file is selected
5. Explorer directories are expandable
6. File selection opens Preview Panel content
7. Both panels can be closed via keyboard shortcuts
8. On viewports <768px, responsive auto-close still works (both panels close)
9. Full Session workflow (prompt → response → diff → terminal) works identically

---

## Rollback

Revert two default values in `layout.tsx`: `explorerPanel.opened: true` → `false`, `previewPanel.opened: true` → `false`. Single-commit revert.

---

*End of Blueprint Revision*
*Awaiting user decision before implementation.*
