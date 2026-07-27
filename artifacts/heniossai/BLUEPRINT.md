# HeniossAI Presentation Layer — Implementation Blueprint

> Planning Phase | Not an implementation request
> Five approved research documents + approved product vision = architectural constitution

---

## 1. Executive Summary

HeniossAI builds a new Presentation Layer around the existing OpenCode workspace using a Three-Pane layout: Explorer (left), Original OpenCode workspace (center), Preview Panel (right). The center pane is the exact, unmodified OpenCode workspace — a black box. All changes are confined to the Presentation Layer. Runtime, Core, and Application Engine are untouched.

**Strategy:** Composition over replacement. Wrapping over rewriting. Extension over modification. Reversible changes only.

**Approach:** Five sequential phases across three architectural concerns: layout state (foundation), layout shell (wrapping), panel content (population). Each phase terminates at a verified milestone.

---

## 2. Architectural Invariants

These invariants govern all phases. They are defined once here and referenced by label throughout the document.

### Invariant Labels

| Label | Statement |
|-------|-----------|
| **I-SESSION** | The OpenCode workspace center pane is a black box. It must never be modified, wrapped in additional event layers, or have its DOM or behavior altered. |
| **I-RUNTIME** | No changes to Runtime, Core, or Application Engine. This is a Presentation Layer reconstruction only. |
| **I-SCOPE** | Scope is limited to: UI, UX, Layout, Navigation, Components, Design System, Visual Language, Motion, Accessibility, Workspace Organization, Information Architecture, User Flows. |
| **I-CATEGORY-A** | Category A subsystems (execution pipeline, LLM provider, EventV2, tool registry core) must never be imported or modified by new Presentation code. |
| **I-SESSION-FILES** | The Session's internal component set must never be modified or imported by new Presentation code. |
| **I-NO-DEPS** | No new npm packages or runtime dependencies. All required infrastructure already exists in the codebase. |
| **I-BACKWARD** | All existing Presentation Layer APIs and behaviors must remain unchanged. New code is additive only. |
| **I-UNIDIRECTIONAL** | Session must never import from or know about the new panels. New panels may communicate among themselves but never into the Session black box. |
| **I-COMM-LAYER** | New panels communicate with the outside world through stable Presentation Layer state and existing SDK client APIs. No direct import of Runtime, Core, or Application internals. |
| **I-VISIBLE-ISOLATION** | New panel styles and behavior must not leak into the Session region. Session rendering and interaction must be visually and behaviorally identical to the pre-change state. |

### Invariant Reference Convention

Throughout this document, invariants are referenced as `{I-LABEL}`. For example: `{I-SESSION}` means the center pane black box constraint applies.

---

## 3. Product Vision (Approved — Not Open for Redesign)

### 3.1 Three-Pane Architecture

- **Left Pane — Explorer:** Project tree, files, folders, expand/collapse, project/workspace navigation, file management. Responsible for navigating the project. Not the working area.
- **Center Pane — Original OpenCode Workspace:** The exact, unmodified OpenCode working surface. Conversations, agent execution, diff, terminal, task execution, streaming — all unchanged. Visual embedding principle: visually crop the required working surface and embed it inside the new layout. An experienced OpenCode user should immediately recognize that the working experience has not changed.
- **Right Pane — Preview Panel:** Displays files selected from the Explorer. README.md, architecture documents, planning documents, markdown, images, PDFs, text files. Opening a document inside the Preview Panel must never replace or interrupt the original OpenCode workspace.

### 3.2 Interaction Model

```
Explorer → Select File → Preview Panel displays the file
Original OpenCode workspace continues running unchanged in the center
User can continue coding, chatting, and executing tasks while reading simultaneously
```

### 3.3 Non-Negotiable Principle

HeniossAI is NOT a Runtime reconstruction. NOT a Core reconstruction. NOT an OpenCode rewrite. It is a Presentation Layer reconstruction project. Runtime, Core, and Application Engine are preserved exactly as they exist. `{I-RUNTIME}`

---

## 4. Architectural Context (from Approved Research)

### 4.1 Layer Architecture

The Presentation Layer is the outermost of seven layers. New code resides entirely within this layer. Below it lie Transport, Application, Core, and Schema layers — all `{I-RUNTIME}` and `{I-CATEGORY-A}` territory.

### 4.2 Key Existing Infrastructure (Stable APIs)

The following Presentation Layer infrastructure exists and is available for reuse:

| Infrastructure | Architectural Role | Stability |
|---------------|-------------------|-----------|
| Layout Shell | The outermost layout wrapper that receives routed content | Stable — modification target |
| Layout State | A Presentation-layer state container providing panel visibility, width, and project state | Stable — extension target |
| Resize Component | A draggable divider between layout regions | Stable — reuse |
| Visibility Pattern | A boolean-flag model controlling panel shown/hidden state | Stable — pattern reuse |
| Width Pattern | Width constants with clamping utility for panel sizing | Stable — pattern reuse |
| Side Panel Pattern | An existing side panel implementing expand/collapse behavior | Stable — pattern reference |
| Markdown Provider | A globally provisioned markdown rendering service | Stable — reuse |
| Context Factory | A proven state-management pattern for creating context providers | Stable — pattern reuse |

### 4.3 Architectural Contract (from Research Section 24)

**Allowed modifications (`{I-BACKWARD}`):**
1. Extend Layout State with new Presentation-layer domains
2. Add new Presentation-layer components
3. Modify Layout Shell to wrap the Session in a multi-column layout
4. Import existing Presentation-layer UI infrastructure (resize component, etc.)
5. Use existing Presentation-layer patterns (context factory, visibility, width)
6. Import stable Application-layer APIs through the SDK client
7. Add CSS/design for new Presentation-layer components
8. Import existing Presentation-layer providers (markdown, etc.)

**Forbidden modifications (`{I-RUNTIME}`, `{I-CATEGORY-A}`, `{I-SESSION-FILES}`, `{I-NO-DEPS}`):**
1. Touch Runtime or Core subsystems
2. Touch high-risk subsystems (Session storage, tool registry, plugin system)
3. Modify Session-internal components
4. Modify the Session component itself
5. Import Runtime/Core types into new Presentation components
6. Add runtime Dependency Injection
7. Add new npm packages
8. Modify existing Layout State domains
9. Modify the Top Bar or Status Bar
10. Modify router configuration
11. Add backend endpoints

### 4.4 Research Documents

| Ref | Document | Role in Blueprint |
|-----|----------|-------------------|
| R1 | UI/UX Forensic Audit (Part 1) | Existing infrastructure inventory; component isolation boundaries; state architecture |
| R2 | Architecture Archaeology (Part 2) | Seven-layer architecture; provider tree; package organization; dependency rules |
| R3 | Ownership Matrix (Part 2, Section 18) | Subsystem classification; protection levels; black box identification |
| R4 | Runtime & Core Protection (Part 4) | Category A/B/C/D classification; execution pipeline boundaries; communication contracts |
| R5 | Three-Column Research (Part 5) | Architectural decision record; five-option comparison; migration contract; ten invariants |
| R6 | Presentation Ownership (Part 3 extension) | UI subsystem classification; communication rules; state boundaries |
| R7 | Implementation Blueprint (Part 6) | Phase structure; risk matrix; validation strategy; execution order |

---

## 5. Implementation Strategy

### 5.1 Architectural Approach

Per the Part 5 research (five-option comparison), the recommended approach is the **Wrapper Shell** strategy:

- **Modify** the existing Layout Shell to replace its single-region layout with a multi-column flex container. The Session continues to render as routed content — exactly unchanged.
- **Extend** the existing Layout State with new Presentation-layer state domains for left and right panel control. Existing domains are never modified `{I-BACKWARD}`.
- **Add** new Presentation-layer components for panel content. These are additive — they never modify existing components `{I-SESSION}`, `{I-SESSION-FILES}`.

This approach achieves maximum session isolation (`{I-SESSION}`), minimal implementation risk, high maintainability (compositional, additive), low migration complexity (revertible), and long-term viability (survives upstream changes).

### 5.2 Scope Boundaries

| In Scope (Presentation Layer Only) | Out of Scope (Everything Else) |
|-----------------------------------|--------------------------------|
| UI layout and shell structure | Session execution pipeline |
| Exploratory navigation UI | LLM provider integration |
| File selection and preview UI | Tool registration and execution |
| Panel state management | MCP protocol handling |
| In-browser content rendering | Backend business logic |
| Visual design and motion | Agent orchestration loop |
| Accessibility | Durable event storage |
| Responsive layout | Plugin system |
| User flows and interactions | Streaming infrastructure |

`{I-RUNTIME}`, `{I-SCOPE}`

### 5.3 Risk-Phasing Strategy

Highest-risk concerns are addressed earliest to fail fast:

- **Phase 0** — Lowest risk: extending existing Layout State via a proven pattern. If this fails, the architectural approach is unsound. Stop before investing in shell or content.
- **Phase 1** — Low risk: a minimal change to the Layout Shell. If the Session breaks when wrapped, the wrapping strategy is invalid `{I-SESSION}`. Stop and evaluate alternatives.
- **Phases 2–3** — Medium risk: new UI surface area. Protected by Phases 0–1 verifying the architectural foundation.
- **Phase 4** — Lowest risk: enhancement-only. Protected by Phases 2–3 verifying content works.

---

## 6. Architectural Decomposition

The work decomposes into three independent architectural concerns:

### Concern A: Layout State (Foundation)
- State model for left panel and right panel visibility, width, expansion
- File selection event propagation (Explorer selection → Preview display)
- Extends existing Layout State with new Presentation-layer domains only
- Backward compatibility: all existing state consumers observe zero API change `{I-BACKWARD}`

### Concern B: Layout Shell (Wrapping)
- Multi-column container replacing single-region layout in the existing Layout Shell
- Resize components between columns
- Session continues rendering as routed content, exactly unchanged `{I-SESSION}`
- New panel slots initialized as hidden regions

### Concern C: Panel Content (Population)
- **Left panel:** project navigation, file tree, expand/collapse, file selection
- **Right panel:** file preview for text, markdown, images, PDFs; file tab management
- Content reads from existing Layout State and SDK client APIs `{I-COMM-LAYER}`
- Never imports from Session internals `{I-SESSION-FILES}`
- Panels communicate only through Layout State `{I-UNIDIRECTIONAL}`

### Dependency Between Concerns

```
Concern A (Layout State) ──► Concern B (Layout Shell)
                                    │
                         ┌──────────┴──────────┐
                         ▼                     ▼
              Concern C-Left (Explorer)   Concern C-Right (Preview)
              (depends on A + B)         (depends on A + B)
```

Concerns C-Left and C-Right are independent — parallelizable.

---

## 7. Project Phases

### 7.1 Phase Overview

| Phase | Concern | Name | Duration (est.) | Risk |
|-------|---------|------|-----------------|------|
| 0 | A | Foundation — Layout State Extension | 2–3 days | Low |
| 1 | B | Shell — Multi-Column Layout | 1–2 days | Low |
| 2 | C-Left | Left Panel — Explorer | 5–7 days | Medium |
| 3 | C-Right | Right Panel — Preview Panel | 4–6 days | Medium |
| 4 | A+B+C | Polish & Production Readiness | 5–8 days | Medium |

Phases 2 and 3 can execute in parallel if capacity permits.

### 7.2 Phase 0 — Foundation: Layout State Extension

**Concern:** A — Layout State

**Milestone (definition of done):**
The existing Layout State exposes two new Presentation-layer state domains — one for left panel control, one for right panel control. These domains provide panel visibility, width, and file selection state. A file-selection action propagates selection events from the left domain to the right domain. All existing consumers observe zero API change `{I-BACKWARD}`.

**Deliverables:**
1. New state domains appended to Layout State (existing domains untouched)
2. File selection action bridging left panel selection to right panel display
3. Uses proven state-management pattern from existing Presentation infrastructure

**Risks:**
- `{I-BACKWARD}` violation: if extension breaks existing consumers, the approach is unsound
- Mitigation: single-revert boundary; zero consumers depend on new domains at this stage

**Validation gate:**
- Type checking passes
- All existing Layout State consumer tests pass with zero modification
- New state domains queryable and writable

**Rollback:** Single revert. No downstream consumers yet.

### 7.3 Phase 1 — Shell: Multi-Column Layout

**Concern:** B — Layout Shell

**Milestone (definition of done):**
A multi-column layout renders four regions: left panel slot (hidden by default), center Session workspace, right panel slot (hidden by default), and resize components between them. The Session renders as routed content — exact, unmodified `{I-SESSION}`. Before/after comparison shows zero visual or behavioral change to the Session region.

**Deliverables:**
1. Multi-column flex container replacing single-region layout in the existing Layout Shell
2. Session renders as routed content — zero modification `{I-SESSION}`
3. Left and right panel slots initialized as empty, hidden regions
4. Resize components placed between columns
5. New Layout State domains control panel visibility and width

**Risks:**
- Layout change could visually affect the Session region `{I-VISIBLE-ISOLATION}`
- Resize component interaction could interfere with Session event handling `{I-SESSION}`
- Upstream Layout Shell changes could conflict with modifications
- Mitigations: before/after screenshot comparison; pointer-event containment for resize components; ~15-line modification surface (easily reapplied)

**Validation gate:**
1. Type checking passes
2. All existing tests pass
3. Before/after visual comparison of Session region = zero change `{I-VISIBLE-ISOLATION}`
4. Full Session workflow: prompt → agent response → diff → terminal
5. Panel slots render (DOM inspection)
6. Resize components render and respond to drag

**Rollback:** Single revert restores original single-region layout.

### 7.4 Phase 2 — Left Panel: Explorer

**Concern:** C-Left — Explorer Content

**Milestone (definition of done):**
A navigable Explorer panel displays the project tree with expandable directories and selectable files. Selecting a file propagates to Layout State, making it available for the Preview Panel (Phase 3). The Explorer reads project and file data exclusively through SDK client APIs `{I-COMM-LAYER}`. It has zero imports from Session internals `{I-SESSION-FILES}`, `{I-CATEGORY-A}`.

**Deliverables:**
1. Project tree — renders project list via SDK client API
2. File tree — recursive expand/collapse with lazy loading on expand
3. File selection action → Layout State bridge
4. Empty state when no project is open
5. Loading state during data fetch

**Data sources (stable SDK APIs):**
- Project listing
- File tree (path-scoped queries)
- File content retrieval

**Risks:**
- Large directory performance: expanding a directory with 10,000+ entries could cause UI delay
  - Mitigation: lazy-load children only on expand. If performance issues emerge during implementation, apply optimization (the optimization technique, whether virtual scrolling, pagination, or incremental rendering, is an implementation decision — see Section 11)
- File tree staleness during long sessions
  - Mitigation: refresh action available; debounced refresh on file system events (implementation detail)
- Keybinding overlap with Session `{I-SESSION}`
  - Mitigation: Explorer captures keys within its own DOM subtree; Session's key handlers are unaffected

**Validation gate:**
1. Project tree renders with correct project list
2. Expand folder → children appear
3. Select file → Layout State updated
4. Empty state renders when no project open
5. Loading state renders during data fetch
6. No imports from Session internals (audit) `{I-SESSION-FILES}`
7. Center Session continues functioning throughout Explorer interaction `{I-SESSION}`

**Rollback:** Remove panel content; revert to empty hidden region.

### 7.5 Phase 3 — Right Panel: Preview Panel

**Concern:** C-Right — Preview Content

**Milestone (definition of done):**
A Preview Panel displays files selected from the Explorer. Supported formats: markdown (uses existing Markdown Provider), images (browser-native rendering), PDFs (browser-native rendering), and text with code rendering. Multiple files can be opened simultaneously with tabbed navigation. The center Session workspace continues running uninterrupted throughout all Preview Panel operations `{I-SESSION}`.

**Deliverables:**
1. Tab-based interface for open files
2. Markdown rendering via existing Markdown Provider
3. Image rendering (browser-native)
4. PDF rendering (browser-native)
5. Text/code rendering
6. Unsupported format fallback
7. Empty state when no file selected

**Critical constraints `{I-SESSION}`, `{I-SESSION-FILES}`, `{I-CATEGORY-A}`, `{I-COMM-LAYER}`:**
- Must never interact with Session DOM or event system
- Must never import from Session internals
- File content is read-only — no writes or mutations
- Preview Panel errors must never surface in Session region
- Content loaded via SDK client API only

**Format detection strategy:**
| Format Category | Detection | Rendering Strategy |
|----------------|-----------|-------------------|
| Markdown (`.md`, `.mdx`) | File extension | Existing Markdown Provider |
| Images (`.png`, `.jpg`, `.gif`, `.svg`, `.webp`) | File extension / MIME | Browser-native |
| PDF (`.pdf`) | File extension / MIME | Browser-native |
| Plain text & code | File extension | Text rendering |
| Unsupported (binary, etc.) | MIME detection | Fallback + download link |

**Risks:**
- Large file memory pressure: very large files could strain browser memory
  - Mitigation: implementation may limit concurrent open files or warn on large payloads. These are implementation decisions, not architectural constraints (see Section 11)
- PDF rendering varies by browser
  - Mitigation: fallback download link if browser-native rendering fails
- Code rendering performance for very large files
  - Mitigation: implementation may cap rendered line count for highlighted display. Details deferred (Section 11)
- Preview Panel must not affect Session scroll or interaction `{I-SESSION}`
  - Mitigation: each region is independently scrollable; no event sharing between regions

**Validation gate:**
1. Markdown file → rendered content
2. Image file → displayed image
3. PDF → rendered or fallback link shown
4. Code/text file → rendered content
5. Unknown format → fallback message + download link
6. Multiple tabs open and switchable
7. Close tab → state cleaned up
8. **Session continues running throughout** `{I-SESSION}`
9. No imports from Session internals (audit) `{I-SESSION-FILES}`

**Rollback:** Remove panel content; revert to empty hidden region.

### 7.6 Phase 4 — Polish & Production Readiness

**Concern:** Cross-cutting (enhancement of all previous phases)

**Milestone (definition of done):**
Both panels are production-ready with keyboard navigation, smooth transitions, responsive layout, accessibility support, performant behavior, and graceful handling of all states (empty, error, loading, edge cases).

**Deliverables:**
1. Keyboard navigation — logical Tab order across all three panes; keyboard-operated file tree and panel toggle
2. Panel collapse/expand — keyboard shortcuts to show/hide panels
3. Transition animations — smooth appearance/disappearance on panel toggle; smooth resize dragging
4. Responsive layout — adapts to different viewport widths; panels stack appropriately on narrow viewports
5. Empty states — descriptive messages when no content is available
6. Error states — inline error display with retry action
7. Loading states — visual feedback during data retrieval
8. Explorer context menu — file/folder operations (create, rename, delete, reveal)
9. File tree search or filter — filter visible files by name
10. Scroll position memory — per-file scroll positions preserved across tab switches
11. Accessibility — ARIA labels, focus management, screen reader announcements, keyboard operability

**Risks:**
- Keyboard navigation could conflict with existing Session keybindings
  - Mitigation: panel-level key capture; Session key handlers fire for Session region only `{I-SESSION}`
- Responsive layout on narrow viewports could degrade Session experience
  - Mitigation: panels become collapsible behind a toggle; Session occupies full viewport when panels are hidden
- Animations could cause layout shift
  - Mitigation: prefer animations that don't cause layout reflow; respect user motion preferences

**Validation gate:**
1. Full keyboard-only navigation: Explorer → select file → Preview reads → Session unaffected
2. Panel toggle via keyboard shortcut
3. Smooth animations without layout disruption
4. Responsive layout renders without overflow or clipping
5. Empty, error, and loading states render correctly
6. Context menu actions work
7. File filter narrows file list
8. Scroll positions preserved per file
9. Accessibility audit — no violations
10. `{I-VISIBLE-ISOLATION}` — all existing behaviors intact

**Rollback:** Individual commits revertible per concern.

---

## 8. Dependency Map

### 8.1 Phase Dependencies

```
Phase 0 (Layout State) ───► Phase 1 (Layout Shell)
                                   │
                        ┌──────────┴──────────┐
                        ▼                     ▼
               Phase 2 (Explorer)      Phase 3 (Preview)
                        │                     │
                        └──────────┬──────────┘
                                   ▼
                          Phase 4 (Polish)
```

### 8.2 Concern Dependencies

```
Concern A ───► Concern B ────┬──► Concern C-Left
                              └──► Concern C-Right
                                   (parallelizable)
```

### 8.3 External Dependencies (for new panel content)

New panels depend only on:
1. **Existing Layout State** — visibility, width, file selection, project data
2. **Existing SDK Client APIs** — project listing, file tree, file content
3. **Existing Providers** — markdown rendering

All three already exist in the codebase. No new external dependencies are required `{I-NO-DEPS}`.

---

## 9. Risk Management

### 9.1 Risk Register

| ID | Risk | Impact | Prob. | Phase | Mitigation |
|----|------|--------|-------|-------|------------|
| R01 | Session breaks when wrapped in new layout | Critical | Very Low | 1 | Phase 1 precedes content phases; stop if this fails; evaluate alternative wrapping |
| R02 | Style or behavior leaks from new panels into Session | Medium | Low | 1–4 | Visual regression at every phase boundary; style isolation mechanisms from existing CSS architecture `{I-VISIBLE-ISOLATION}` |
| R03 | Resize component interferes with Session interaction | Medium | Low | 1 | Input-event containment on resize handles; Session region has no additional event layers `{I-SESSION}` |
| R04 | Large directory tree degrades Explorer performance | Medium | Medium | 2 | Lazy load on expand; optimization deferred to implementation (Section 11) |
| R05 | Large file preview causes memory pressure | Low | Low | 3 | Implementation may limit open files or warn on large payloads (deferred — Section 11) |
| R06 | Preview file loading errors | Low | Medium | 3 | Error surface in Preview Panel only; never in Session `{I-SESSION}` |
| R07 | Keyboard navigation conflicts across panes | Medium | Medium | 4 | Panel-level key capture; Session native key handlers for its region only |
| R08 | Narrow viewport renders unworkably | Low | Medium | 4 | Panels collapse behind toggle; Session at full width when panels hidden |
| R09 | Accessibility gaps in new panels | Medium | Medium | 4 | Automated accessibility audit in Phase 4; remediation sprint if needed |
| R10 | Upstream Layout Shell changes conflict with modifications | Medium | Low | Ongoing | ~15-line change surface; easily reapplied; monitor upstream diffs |

### 9.2 Risk Score Summary

- Critical: 0
- High: 0
- Medium: 5
- Low: 5

No Critical or High risks.

### 9.3 Fail-Fast Decision Points

| Gate | Trigger | Action |
|------|---------|--------|
| End of Phase 0 | Layout State extension breaks existing consumers | Abort; architecture approach unsound |
| End of Phase 1 | Session visual or behavioral change `{I-VISIBLE-ISOLATION}` | Abort Option A; evaluate alternative wrapping |
| Mid-Phase 2 | File tree performance unacceptable | Apply implementation optimization (technique deferred — Section 11) |
| Mid-Phase 3 | Preview resource exhaustion | Tighten implementation guardrails (details deferred — Section 11) |
| End of Phase 4 | Accessibility audit failure | Schedule remediation sprint before delivery |

---

## 10. Validation Strategy

### 10.1 Per-Phase Validation Gates

Every phase includes:

1. **Type check** — compilation correctness
2. **Regression test** — existing test suite passes
3. **Behavioral verification** — phase-specific acceptance criteria
4. **Architecture audit** — no imports from forbidden subsystems; no modifications to forbidden files `{I-CATEGORY-A}`, `{I-SESSION-FILES}`, `{I-RUNTIME}`

### 10.2 Validation Methods

| Method | Application | Phase |
|--------|-------------|-------|
| Type checking | Compilation correctness | 0–4 |
| Existing test suite | Regression prevention | 0–4 |
| Visual comparison (before/after) | Session visual fidelity `{I-VISIBLE-ISOLATION}` | 1, also spot-check 2–4 |
| Session full workflow | Functional correctness `{I-SESSION}` | 1, re-verified 2–4 |
| DOM inspection | Layout structure correctness | 1 |
| Tab-order audit | Keyboard navigation | 4 |
| Accessibility audit | Accessibility compliance | 4 |
| Manual cross-panel workflow | Integration correctness | 2–4 |
| Import scanner | Architectural boundary enforcement `{I-CATEGORY-A}`, `{I-SESSION-FILES}`, `{I-COMM-LAYER}` | 0–4 |

### 10.3 Invariant Verification at Every Phase Boundary

At each phase transition (0→1, 1→2, 2→3, 3→4, 4→done):
- `{I-SESSION}` — Session component: zero modifications (diff check)
- `{I-SESSION-FILES}` — Session internals: zero modifications (diff check)
- `{I-CATEGORY-A}` — Protected subsystems: zero modifications (diff check)
- `{I-BACKWARD}` — Existing Layout State: additions only, no modifications (diff check)
- `{I-NO-DEPS}` — Dependencies: zero new entries (diff check)
- `{I-COMM-LAYER}` — New code imports: no forbidden imports (grep check)

### 10.4 Rollback Strategy

| Phase | Rollback | Complexity |
|-------|----------|------------|
| 0 | Revert extension commit | Trivial |
| 1 | Revert Layout Shell modification | Trivial |
| 2 | Revert Explorer commits + panel removal | Easy |
| 3 | Revert Preview commits + panel removal | Easy |
| 4 | Revert polish commits individually | Low |

Full rollback: sequence of reverts returns to pre-change state.

---

## 11. Deferred Architectural Decisions

The following decisions are intentionally postponed to the Implementation Phase. They are not yet resolved because they depend on implementation experience, performance measurement, or specific technical evaluation that cannot be performed during planning.

### 11.1 Deferred: Component Decomposition

The exact component hierarchy within the Explorer and Preview panels is not specified. The implementation phase will determine how to decompose panel content into sub-components based on cohesion, reusability, and testability.

**Rationale for deferral:** Component decomposition is an implementation concern. Premature decomposition would constrain the implementation without providing architectural value.

### 11.2 Deferred: Internal State Model Shape

The exact shape of the state within the new Layout State domains (data structures, nesting, normalization) is not specified.

**Rationale for deferral:** State shape should be driven by actual rendering and interaction requirements discovered during implementation. Forcing a specific state shape during planning may lead to mismatch.

### 11.3 Deferred: Preview Rendering Mechanisms

The specific technique for rendering each file format (iframe, embed, shadow DOM, sandboxed context) is not specified.

**Rationale for deferral:** Rendering mechanisms depend on browser capabilities, security requirements, and integration with existing rendering infrastructure. These are implementation decisions.

### 11.4 Deferred: Syntax Highlighting Approach

The specific approach for code syntax highlighting (library choice, rendering strategy, lazy loading) is not specified.

**Rationale for deferral:** The codebase may already contain syntax highlighting infrastructure. Highlighting approach depends on integration with existing tooling, not on architectural planning.

### 11.5 Deferred: Performance Optimization Techniques

Specific optimization techniques (virtual scrolling, incremental rendering, memoization, debouncing thresholds) are not specified.

**Rationale for deferral:** Optimization should be driven by measured performance data, not by speculation. If performance issues emerge during implementation, they will be addressed with the appropriate technique at that time.

### 11.6 Deferred: Responsive Breakpoints

Exact viewport width thresholds for layout adaptation are not specified.

**Rationale for deferral:** Breakpoints depend on content nature, design mockups, and device testing. They are a design implementation concern.

### 11.7 Deferred: Animation Techniques and Timing

Specific animation approaches, CSS properties, timing functions, and duration values are not specified.

**Rationale for deferral:** Animation is a design implementation concern. Motion design should be driven by visual design mockups and user experience testing, not by architectural planning.

### 11.8 Deferred: Keyboard Shortcut Bindings

Specific keyboard shortcut assignments are not specified.

**Rationale for deferral:** Shortcuts should be chosen during implementation based on platform conventions, user research, and potential conflicts with existing Session keybindings. Premature binding risks conflict.

### 11.9 Deferred: Icon and Visual Asset Choices

Specific icon sets, visual styles, and asset choices are not specified.

**Rationale for deferral:** Visual design belongs to the design system implementation phase. Selection should be consistent with the existing visual language, determined during implementation.

### 11.10 Deferred: Resource Limit Values

Specific limits (concurrent open tabs, file size thresholds, render line caps) are not specified.

**Rationale for deferral:** Limits should be established based on observed real-world usage and performance testing during implementation. Speculative limits during planning may be too restrictive or too permissive.

---

## 12. Decision Log

### ADR-001: Wrapper Shell Architecture

**Status:** Accepted (from Part 5 research — reaffirmed, not redesigned)

**Context:** Five architectural options were evaluated in Part 5 research. All alternatives (iframe isolation, UI package extraction, Web Component, React rewrite) were rejected.

**Decision:** Modify the existing Layout Shell to wrap the Session in a multi-column layout. Session renders as routed content — exactly unchanged `{I-SESSION}`.

**Rationale:** Maximum Session isolation; zero Session modification; compositional; reversible; all evaluation criteria pass with maximum scores.

---

### ADR-002: Tab-Based Preview

**Status:** Accepted

**Context:** Product vision states the Preview Panel displays files selected from Explorer. Users may reference multiple files simultaneously.

**Decision:** Multi-tab interface. Each file opens in a closable tab. Tab state owned by Layout State (Presentation Layer only).

**Rationale:** Established developer tool convention; state owned entirely within Presentation Layer `{I-SCOPE}`; no Session involvement `{I-SESSION}`, `{I-UNIDIRECTIONAL}`.

---

### ADR-003: Lazy File Tree

**Status:** Accepted

**Context:** Projects may contain large directory trees. Full load on mount is infeasible for large projects.

**Decision:** Load file tree children only on folder expand. Optimization techniques (virtual scrolling, pagination, incremental rendering) are implementation decisions (Section 11).

**Rationale:** Matches established developer tool behavior; minimizes initial load; SDK APIs support path-scoped queries.

---

### ADR-004: No New External Dependencies

**Status:** Accepted (from Part 5 research — reaffirmed)

**Context:** `{I-NO-DEPS}` forbids new npm packages.

**Decision:** Use existing styling and rendering infrastructure. No new CSS framework, JavaScript library, or runtime dependency.

**Rationale:** Zero new external dependencies; all required infrastructure already exists.

---

### ADR-005: Extend Existing Layout State

**Status:** Accepted (from Part 5 research — reaffirmed)

**Context:** Left and right panels need shared state (visibility, width, file selection, open files).

**Decision:** Extend the existing Layout State with new panel state domains. Do not create a new state container.

**Rationale:** Proven state-management pattern exists `{I-BACKWARD}`; single source of truth for layout state; append-only extension preserves backward compatibility.

---

## 13. Readiness Assessment

| # | Prerequisite | Status |
|---|-------------|--------|
| P1 | Research complete (Parts 1–6) | ✅ |
| P2 | Product vision approved | ✅ |
| P3 | Architecture strategy selected (Option A) | ✅ |
| P4 | Architectural invariants documented | ✅ (10 invariants) |
| P5 | Phase decomposition with milestones | ✅ (5 phases) |
| P6 | Risk register with mitigations | ✅ (10 risks, 0 Critical/High) |
| P7 | Rollback strategy per phase | ✅ |
| P8 | Validation strategy per phase | ✅ |
| P9 | Decision log (ADRs) | ✅ (5 ADRs) |
| P10 | Deferred decisions documented | ✅ (10 deferred decisions) |
| P11 | Scope boundaries defined | ✅ |

**Verdict:** ✅ All 11 prerequisites met. Ready for implementation at user direction.

---

*End of Blueprint — Planning Phase Only*
*Awaiting user direction to begin Phase 0 or continue planning.*
