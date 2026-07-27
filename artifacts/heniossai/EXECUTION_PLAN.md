# HeniossAI Presentation Layer — Official Execution Plan

> Implementation Guide | v1.0
> Based on the approved Blueprint (BLUEPRINT.md)
> This document operationalizes architectural decisions. It does not redesign, replace, or question them.

---

## 1. Executive Summary

**Purpose:** This document is the daily operational guide for implementing the HeniossAI Presentation Layer. It defines every execution step, quality gate, validation check, review process, and rollback procedure required to deliver the approved three-pane layout safely and consistently.

**Audience:** Senior engineering team executing the implementation. The document assumes the team has read the Blueprint and understands the architectural invariants, scope boundaries, and approved vision.

**How to use this document:**
- Before each phase, read the phase's dedicated execution section (Section 5)
- Follow the Definition of Ready (Section 15) before starting work
- Use the Developer Checklist within each phase to track progress
- Apply the Code Review Process (Section 7) before every merge
- Validate against Quality Gates (Section 8) at every phase boundary
- Use the Definition of Done (Section 16) to confirm phase completion
- Report progress per the Communication Protocol (Section 14)

**Relationship with the Blueprint:** The Blueprint is the constitutional document — it defines what to build, why, and the architectural constraints. This Execution Plan is the operational document — it defines how to build it, in what order, under what controls. Never modify the Blueprint through this document. If a conflict arises, the Blueprint prevails.

---

## 2. Execution Philosophy

### 2.1 One Phase at a Time

Execute one phase only. Never start a phase until the previous phase is fully verified, reviewed, and approved. Never work ahead. Never implement content belonging to a future phase.

### 2.2 Finish Before Expanding

A phase is not finished until its Definition of Done (Section 16) is fully satisfied. Do not expand scope, add polish, or optimize before the phase's declared deliverables are complete and validated.

### 2.3 Verify Before Continuing

Every commit must compile. Every feature must be locally verified before the next commit. Every phase must pass its Validation Checklist before proceeding to review.

### 2.4 Review Before Merge

No code merges without passing code review. No code review without passing the Pull Request Checklist (Section 18). No merge without meeting Merge Criteria (Section 19).

### 2.5 No Shortcuts

Never skip validation. Never bypass review. Never merge failing gates. Every quality gate is mandatory. A bypassed gate is a revert trigger.

### 2.6 Small Commits, Atomic Changes

Each commit should represent one logical change: one invariant, one component, one concern. Commits must be revertible independently. A commit that mixes two concerns must be split before review.

### 2.7 Continuous Validation

Run the full validation suite after every significant change. Do not accumulate unvalidated work. The cost of fixing a regression increases with each unvalidated commit.

### 2.8 Reversibility First

Every change must be revertible. Before making any change, confirm you can undo it with a single revert. If a change is not cleanly revertible, restructure it.

---

## 3. Execution Rules

These are mandatory engineering laws. Violation requires immediate revert and re-execution.

### R1 — Phase Isolation

Never implement features outside the active phase. The active phase is the only phase with implementation authorization. Work discovered that belongs to a later phase must be logged and deferred.

### R2 — Scope Containment

Never touch a file outside Presentation Layer scope. Any modification to Runtime, Core, Application, or Session internals is forbidden. If a change requires touching forbidden code, stop and escalate — do not proceed.

### R3 — Single Concern

Each commit addresses exactly one concern. A commit that modifies the Layout Shell and the Explorer panel simultaneously is invalid. Split before review.

### R4 — No Mixed Phases

Never combine work from two phases in a single branch, commit, or pull request. Phase boundaries are absolute.

### R5 — Gate Compliance

Every quality gate (Section 8) must pass before proceeding. No exceptions. A failed gate blocks all forward progress until resolved.

### R6 — Validation Before Merge

No code merges without passing the phase's Validation Checklist and Pull Request Checklist (Section 18). Validation is the author's responsibility. Review verifies validation.

### R7 — Clean Diff

Every pull request diff must contain only changes required for its stated purpose. No whitespace changes, no formatting changes, no refactoring of unrelated code, no moved imports. A diff with unrelated changes will be rejected.

### R8 — Rollback Readiness

Every commit must be individually revertible without side effects on subsequent commits. If reverting a commit would break later commits, the sequence must be restructured.

### R9 — Zero Regressions

Existing tests must pass before and after every change. A regression in existing tests blocks the commit. Fix the regression before proceeding.

### R10 — No Speculative Work

Never implement something because you "might need it later." Never optimize without a measured need. Never add infrastructure for future features. Implement only what the active phase requires.

---

## 4. Phase Execution Workflow

Every phase follows this identical lifecycle. No phase proceeds without completing every step.

### 4.1 Lifecycle Diagram

```
Definition of Ready → Execution → Developer Validation → Self-Review
    → Pull Request → Code Review → Approval → Merge → Close Phase
                                                              ↓
                                                    Definition of Done
                                                              ↓
                                                    Transition to Next Phase
```

### 4.2 Step Definitions

**Step 1 — Definition of Ready (DoR)**
Verify the prerequisites for starting the phase are met. See Section 15 for the DoR template. If DoR fails, the phase does not begin.

**Step 2 — Execution**
Implement the phase deliverables per the Implementation Sequence in the phase's dedicated execution section (Section 5). Follow Developer Working Rules (Section 6). Commit after each atomic unit of work.

**Step 3 — Developer Validation**
Run all quality gates (Section 8) locally. Verify the Validation Checklist for the phase. Fix any failures. Do not proceed until all checks pass.

**Step 4 — Self-Review**
Review your own diff as if you were a reviewer. Check for: unrelated changes, missing edge cases, architectural violations unclear logic. Fix before submitting.

**Step 5 — Pull Request**
Create a pull request with the phase's changes. Attach the Pull Request Checklist (Section 18). Include evidence of validation (test output, screenshots if applicable).

**Step 6 — Code Review**
A reviewer examines the PR per the Code Review Process (Section 7). The reviewer checks architectural compliance, code quality, test coverage, and scope containment.

**Step 7 — Approval**
The reviewer approves the PR only when all review checklist items pass. Approval is conditional on zero unresolved comments.

**Step 8 — Merge**
Merge per Merge Criteria (Section 19). Only squash-merge or rebase-merge — never merge commit.

**Step 9 — Close Phase / Definition of Done**
Verify the phase's Definition of Done (Section 16) is fully satisfied. Confirm all deliverables exist, all gates pass, all invariants hold.

**Step 10 — Transition**
Proceed to the next phase's Definition of Ready. If this was the final phase, proceed to Final Delivery Checklist (Section 20).

---

## 5. Phase-by-Phase Execution

### 5.1 Phase 0 — Foundation: Layout State Extension

**Purpose:** Extend the existing Layout State with new Presentation-layer domains for left and right panel control. This is the foundation that all subsequent phases depend on.

**Objectives:**
- Add left panel state domain (visibility, width, expansion state)
- Add right panel state domain (visibility, width, open files, current file)
- Add file selection action that bridges left panel selection to right panel display
- Zero modification to existing Layout State domains

**Dependencies:** None (first phase)

**Inputs:** Approved Blueprint (Section 7.2), existing Layout State implementation

**Expected Outputs:**
- Layout State exposes two new queryable state domains
- File selection action propagates selection correctly
- All existing consumers observe zero API change

**Implementation Scope:**
- The existing Layout State container only
- Append-only changes — new domains added, existing domains untouched
- Uses the same state-management pattern as existing domains

**Out of Scope:**
- Any rendering, UI, or component work
- Any Session file modification
- Any Runtime, Core, or Application changes

**Developer Checklist:**
- [ ] Read Blueprint Section 7.2 for Phase 0 architectural context
- [ ] Read Blueprint Section 2 for invariant reference (particularly I-BACKWARD)
- [ ] Identify the existing Layout State container in the codebase
- [ ] Identify the state-management pattern used by existing domains
- [ ] Define new domain type interfaces for left and right panels
- [ ] Implement left panel state domain (visibility, width)
- [ ] Implement right panel state domain (visibility, width, file tracking)
- [ ] Implement file selection action (selection → right panel display bridge)
- [ ] Verify existing Layout State consumers unchanged
- [ ] Run full type check
- [ ] Run existing test suite

**Implementation Sequence:**
1. Read and understand existing Layout State implementation — identify the pattern
2. Define type interfaces for the two new state domains
3. Implement left panel domain (visibility toggle, width management)
4. Implement right panel domain (visibility toggle, width management, file tracking)
5. Implement the file selection action connecting left-to-right
6. Export new domains through the existing Layout State surface
7. Run type check
8. Run existing test suite
9. Verify existing consumers compile and behave identically
10. Commit

**Validation Checklist:**
- [ ] `bun typecheck` passes
- [ ] All existing Layout State consumer tests pass
- [ ] Existing Layout State domains are semantically identical (diff shows no modifications to existing code)
- [ ] New left panel domain: visible state defaults to hidden; width defaults to expected initial value
- [ ] New right panel domain: visible state defaults to hidden; width defaults to expected initial value
- [ ] File selection action updates right panel domain correctly
- [ ] Zero new external dependencies introduced

**Acceptance Criteria:**
- Type check passes
- All existing tests pass
- Existing state domains unchanged
- New domains queryable and writable
- File selection propagates correctly

**Definition of Done:**
- All Validation Checklist items pass
- All Acceptance Criteria met
- Commit pushed with clean diff
- Phase ready for review

**Rollback Strategy:**
- Single commit revert restores Layout State to pre-Phase 0 state
- No downstream consumers exist to break

**Review Checklist:**
- [ ] No existing Layout State domains modified
- [ ] New domains follow existing state-management pattern
- [ ] No new external dependencies
- [ ] Type definitions are correct and complete
- [ ] File selection action handles boundary cases (null selection, already-open file)

**Common Mistakes:**
- Modifying an existing domain instead of adding a new one — verify append-only
- Deviating from the established state-management pattern — match existing style
- Adding dependencies visible to consumers — must be zero-cost for non-consumers

**Approval Requirements:**
- Reviewer confirms zero modifications to existing domains
- Reviewer confirms pattern consistency
- Reviewer confirms type correctness

**Exit Criteria:**
- Phase 0 DoD satisfied
- Phase 1 DoR verified and ready to start

---

### 5.2 Phase 1 — Shell: Multi-Column Layout

**Purpose:** Modify the existing Layout Shell to render a multi-column flex container with the Session in the center, left and right panel slots, and resize components. The Session renders as routed content — exactly unchanged.

**Objectives:**
- Replace single-region layout with three-region flex container
- Session renders as routed content (zero modification to Session)
- Left and right panel slots initialized as empty, hidden regions
- Resize components placed between the three regions
- Layout State controls panel visibility and width

**Dependencies:** Phase 0 (Layout State must provide panel visibility and width domains)

**Inputs:** Phase 0 output (extended Layout State), existing Layout Shell implementation

**Expected Outputs:**
- Multi-column layout renders four regions (left slot, Session, right slot, two resize handles)
- Session content and behavior are visually and functionally identical to pre-change state
- Panel slots are hidden by default

**Implementation Scope:**
- The existing Layout Shell component only
- Adding left slot, right slot, and resize components
- Importing existing Layout State to drive visibility and width

**Out of Scope:**
- Any content inside left or right panel slots (Phase 2 and 3)
- Any modification to the Session component
- Any CSS changes that affect Session region rendering

**Developer Checklist:**
- [ ] Read Blueprint Section 7.3 for Phase 1 architectural context
- [ ] Read Blueprint Section 2 for invariants (particularly I-SESSION, I-VISIBLE-ISOLATION, I-BACKWARD)
- [ ] Identify the existing Layout Shell component
- [ ] Identify how the Session currently renders as routed content
- [ ] Identify the existing Resize Component and verify it supports the required placement
- [ ] Implement three-region flex container
- [ ] Place Session region (routed content) in center position
- [ ] Place left and right panel slots (empty divs, hidden by default)
- [ ] Place resize components between regions
- [ ] Wire panel visibility and width to Layout State
- [ ] Take before/after screenshot of Session region
- [ ] Verify Session full workflow
- [ ] Run full type check and test suite

**Implementation Sequence:**
1. Take a "before" screenshot of the current single-region layout with a standard session
2. Identify the Layout Shell component and understand its current structure
3. Add left panel slot (empty, visibility: hidden as default)
4. Add right panel slot (empty, visibility: hidden as default)
5. Add two resize components between the three regions
6. Wire slot visibility to Layout State left/right panel domains
7. Wire slot width to Layout State left/right panel width domains
8. Verify Session renders correctly as routed content
9. Take "after" screenshot
10. Compare before/after screenshots — must be identical for Session region
11. Run full Session workflow (prompt → response → diff → terminal)
12. Run type check
13. Run test suite
14. Commit

**Validation Checklist:**
- [ ] `bun typecheck` passes
- [ ] All existing tests pass
- [ ] Before/after screenshot comparison shows zero visual change to Session region
- [ ] Session full workflow: type a prompt, confirm agent responds, verify diff renders, terminal operates
- [ ] Left panel slot renders in DOM (visible when toggled)
- [ ] Right panel slot renders in DOM (visible when toggled)
- [ ] Resize components render and respond to drag
- [ ] Panel visibility driven by Layout State — toggling visibility shows/hides correct slot
- [ ] Panel width driven by Layout State — resizing updates correct panel
- [ ] Zero new external dependencies introduced

**Acceptance Criteria:**
- Three-region layout renders with correct flex proportions
- Session region content is identical to pre-change state
- Session workflows function identically
- Panel slots are hidden by default
- Resize components function correctly
- Layout State controls visibility and width

**Definition of Done:**
- All Validation Checklist items pass
- All Acceptance Criteria met
- Before/after screenshot pair saved as evidence
- Commit pushed with clean diff

**Rollback Strategy:**
- Single commit revert restores single-region layout
- No downstream consumers exist to break (panel slots are empty)

**Review Checklist:**
- [ ] Session component itself is zero-modified (diff check against session source)
- [ ] Before/after screenshots attached and verified identical
- [ ] Resize components correctly placed and functional
- [ ] Panel slots correctly wired to Layout State
- [ ] No new external dependencies
- [ ] No CSS or behavioral leaks into Session region

**Common Mistakes:**
- Accidentally wrapping Session in an additional div that affects layout/events
- Resize component placement that overlaps with Session interaction area
- CSS that cascades into Session region (verify with inspector)
- Modifying the Session component's import path or props interface

**Approval Requirements:**
- Reviewer confirms zero Session modification
- Reviewer confirms visual regression evidence
- Reviewer confirms Session workflow verification
- Reviewer confirms Layout State wiring correctness

**Exit Criteria:**
- Phase 1 DoD satisfied
- Phase 2 and Phase 3 DoR verified and ready to start (parallel execution possible)

---

### 5.3 Phase 2 — Left Panel: Explorer

**Purpose:** Build the Explorer panel — project navigation, file tree with expand/collapse, file selection for Preview Panel.

**Objectives:**
- Project tree renders project list via SDK client API
- File tree renders directories and files with recursive expand/collapse
- Selecting a file propagates to Layout State (available for Preview Panel)
- Explorer reads data exclusively through SDK client APIs — no Session imports
- Empty and loading states render appropriately

**Dependencies:** Phase 0 (Layout State), Phase 1 (Layout Shell provides left panel slot)

**Inputs:** Phase 0 output (Layout State with left panel domain), Phase 1 output (Layout Shell with left panel slot), SDK client API specifications

**Expected Outputs:**
- Project tree component renders in left panel slot
- File tree with lazy-loaded children on expand
- File selection action connected to Layout State bridge
- Empty state, loading state, basic interactions

**Implementation Scope:**
- New Presentation-layer component files (additive only)
- The left panel slot created in Phase 1
- SDK client API usage for data retrieval
- Layout State for selection propagation

**Out of Scope:**
- Right panel content (Phase 3)
- Keyboard navigation beyond basic operation (Phase 4)
- Animations and transitions (Phase 4)
- Context menus, file operations, file search (Phase 4)
- Any Session file modification

**Developer Checklist:**
- [ ] Read Blueprint Section 7.4 for Phase 2 architectural context
- [ ] Read Blueprint Section 2 (particularly I-SESSION, I-SESSION-FILES, I-CATEGORY-A, I-COMM-LAYER)
- [ ] Review existing SDK client API for project listing, file tree, and file content
- [ ] Review existing Layout State left panel domain from Phase 0
- [ ] Implement project tree (reads project list from SDK)
- [ ] Implement file tree (recursive directories, lazy load on expand)
- [ ] Connect file selection to Layout State bridge
- [ ] Implement empty state (no project open)
- [ ] Implement loading state (data retrieval in progress)
- [ ] Run type check and test suite
- [ ] Run import audit — verify no Session internal imports

**Implementation Sequence:**
1. Review SDK APIs for project listing and file queries
2. Implement project tree component — fetches and renders project list
3. Implement file tree component — fetches directory contents on expand; renders files and subdirectories
4. Connect file selection click → Layout State file selection action
5. Add empty state display when no project selected
6. Add loading state display during data fetches
7. Mount project tree and file tree in the left panel slot (Phase 1)
8. Run type check
9. Run test suite
10. Run import audit (verify zero Session internal imports)
11. Verify Session continues functioning with Explorer open
12. Commit

**Validation Checklist:**
- [ ] `bun typecheck` passes
- [ ] All existing tests pass
- [ ] Project tree renders with correct project list from SDK
- [ ] File tree renders directories; expand shows children
- [ ] Selecting a file updates Layout State correctly
- [ ] Empty state renders when no project is open
- [ ] Loading state renders during data fetch
- [ ] Zero imports from Session internal components
- [ ] Zero imports from Category A subsystems
- [ ] Session continues functioning throughout Explorer interaction
- [ ] Zero new external dependencies
- [ ] Left panel visibility/width controlled by Layout State

**Acceptance Criteria:**
- Project list displays correctly
- File tree expands/collapses recursively
- File selection propagates to Layout State
- Empty and loading states display correctly
- Session is unaffected by Explorer interaction

**Definition of Done:**
- All Validation Checklist items pass
- All Acceptance Criteria met
- Import audit clean
- Commit pushed with clean diff

**Rollback Strategy:**
- Remove Explorer component files and revert left panel slot to empty state
- Layout State extension from Phase 0 remains (no downstream breakage)

**Review Checklist:**
- [ ] Zero imports from Session internals (import audit attached)
- [ ] Zero imports from Category A subsystems
- [ ] Data fetched exclusively through SDK client APIs
- [ ] File selection wired to Layout State correctly
- [ ] Empty and loading states handled
- [ ] No modifications to existing components
- [ ] No new external dependencies

**Common Mistakes:**
- Importing from Session internal components instead of SDK — verify every import
- Making the Explorer dependent on Session being active — it should work independently
- Implementing functionality that belongs to Phase 4 (context menus, search, animations)
- Modifying the left panel slot from Phase 1 rather than adding content to it

**Approval Requirements:**
- Reviewer confirms import audit is clean
- Reviewer confirms data sourcing is SDK-only
- Reviewer confirms Session remains functional
- Reviewer confirms no Phase 4 work was included

**Exit Criteria:**
- Phase 2 DoD satisfied
- Explorer panel is functional and ready for Preview Panel integration

---

### 5.4 Phase 3 — Right Panel: Preview Panel

**Purpose:** Build the Preview Panel — display files selected from the Explorer in markdown, image, PDF, and text formats without interrupting the center Session workspace.

**Objectives:**
- Tab-based interface for open files (closable tabs, switchable)
- Markdown rendering via existing Markdown Provider
- Image rendering (browser-native)
- PDF rendering (browser-native with fallback)
- Text/code rendering
- Unsupported format fallback (message + download link)
- File content loaded via SDK client API only — zero Session imports
- Session continues running uninterrupted throughout

**Dependencies:** Phase 0 (Layout State), Phase 1 (Layout Shell provides right panel slot)

**Inputs:** Phase 0 output (Layout State with right panel domain and file selection action), Phase 1 output (Layout Shell with right panel slot), existing Markdown Provider, SDK client API for file content

**Expected Outputs:**
- Preview Panel renders in right panel slot
- Tab bar with open files; clicking tab switches preview
- Markdown, image, PDF, text rendering
- Format detection and fallback
- Empty state ("Select a file to preview")

**Implementation Scope:**
- New Presentation-layer component files (additive only)
- The right panel slot created in Phase 1
- Existing Markdown Provider for markdown rendering
- SDK client API for content retrieval
- Browser-native rendering for images and PDFs

**Out of Scope:**
- Syntax highlighting library selection (deferred — Section 11 of Blueprint)
- Performance optimization (deferred)
- Keyboard navigation beyond basic tab switching (Phase 4)
- Animations and transitions (Phase 4)
- Scroll position memory (Phase 4)
- Any Session file modification

**Developer Checklist:**
- [ ] Read Blueprint Section 7.5 for Phase 3 architectural context
- [ ] Read Blueprint Section 2 (particularly I-SESSION, I-SESSION-FILES, I-CATEGORY-A, I-COMM-LAYER)
- [ ] Review existing Markdown Provider and its input contract
- [ ] Review SDK file content API
- [ ] Review existing Layout State right panel domain from Phase 0
- [ ] Implement format detection utility
- [ ] Implement tab bar component (add file, switch tab, close tab)
- [ ] Implement markdown renderer (wrapping existing Markdown Provider)
- [ ] Implement image renderer (browser-native)
- [ ] Implement PDF renderer (browser-native with fallback)
- [ ] Implement text/code renderer
- [ ] Implement fallback for unsupported formats
- [ ] Implement empty state ("Select a file to preview")
- [ ] Connect file content retrieval via SDK
- [ ] Mount Preview Panel in the right panel slot (Phase 1)
- [ ] Run type check and test suite
- [ ] Run import audit — verify no Session internal imports

**Implementation Sequence:**
1. Review existing Markdown Provider and SDK file content API
2. Implement format detection (file extension / MIME mapping)
3. Implement tab bar — tracks open files, current tab, close action
4. Implement markdown renderer wrapping existing Markdown Provider
5. Implement image renderer using browser-native image element
6. Implement PDF renderer using browser-native embed with fallback link
7. Implement text/code renderer
8. Implement unsupported format fallback
9. Implement empty state
10. Wire file content loading from SDK on file selection
11. Mount Preview Panel in the right panel slot (Phase 1)
12. Run type check
13. Run test suite
14. Run import audit (verify zero Session internal imports)
15. Verify Session continues running during Preview operations
16. Commit

**Validation Checklist:**
- [ ] `bun typecheck` passes
- [ ] All existing tests pass
- [ ] Markdown file renders via existing Markdown Provider
- [ ] Image file renders as image
- [ ] PDF renders or shows fallback download link
- [ ] Text/code file renders as formatted text
- [ ] Unsupported format shows fallback message + download link
- [ ] Multiple tabs open and switchable; closing tab removes it
- [ ] Empty state renders when no file selected
- [ ] Zero imports from Session internal components
- [ ] Zero imports from Category A subsystems
- [ ] Session continues functioning throughout Preview interaction — agent executes, streams, responds
- [ ] Preview errors (file load failure) are contained within Preview Panel — never affect Session
- [ ] Zero new external dependencies
- [ ] Right panel visibility/width controlled by Layout State

**Acceptance Criteria:**
- All format categories render correctly
- Tab management works (open, switch, close)
- Empty state displays correctly
- Session is unaffected by Preview Panel operations
- Errors are contained within the Preview Panel

**Definition of Done:**
- All Validation Checklist items pass
- All Acceptance Criteria met
- Import audit clean
- Commit pushed with clean diff

**Rollback Strategy:**
- Remove Preview component files and revert right panel slot to empty state
- Layout State extension from Phase 0 remains (no downstream breakage)

**Review Checklist:**
- [ ] Zero imports from Session internals (import audit attached)
- [ ] Zero imports from Category A subsystems
- [ ] File content fetched exclusively through SDK client API
- [ ] Existing Markdown Provider used correctly (no duplication)
- [ ] Format detection covers all required types
- [ ] Fallback behavior for unsupported types
- [ ] Tab state management correct (add, switch, close)
- [ ] Error state isolation — Session must never observe Preview errors
- [ ] No new external dependencies
- [ ] No modifications to existing components

**Common Mistakes:**
- Importing Session internals for file content instead of SDK API
- Preview error surfacing in Session region
- Implementing functionality that belongs to Phase 4 (animations, scroll memory, keyboard navigation)
- Duplicating markdown rendering instead of using existing Markdown Provider
- Not handling the case where a file is selected but Explorer is closed

**Approval Requirements:**
- Reviewer confirms import audit is clean
- Reviewer confirms Session remains functional during Preview operations
- Reviewer confirms format coverage for all required types
- Reviewer confirms error containment within Preview Panel

**Exit Criteria:**
- Phase 3 DoD satisfied
- Preview Panel is functional and integrated with Explorer file selection

---

### 5.5 Phase 4 — Polish & Production Readiness

**Purpose:** Complete all cross-cutting concerns: keyboard navigation, transition animations, responsive layout, accessibility, performance, edge case states (empty, error, loading), and production readiness.

**Objectives:**
- Keyboard navigation across all three panes (Tab order, arrow keys, Enter, Escape)
- Panel collapse/expand via keyboard shortcuts
- Smooth transition animations on panel visibility toggle and resize
- Responsive layout adapts to different viewport widths
- Empty, error, and loading states for all panel conditions
- Explorer context menu (file/folder operations)
- File tree search/filter
- Scroll position memory per file in Preview Panel
- Accessibility compliance (ARIA, focus management, screen reader)
- Performance at scale (large directories, large files)

**Dependencies:** Phase 2 (Explorer panel functional), Phase 3 (Preview Panel functional)

**Inputs:** Phase 2 Explorer, Phase 3 Preview Panel, Phase 0 Layout State, Phase 1 Layout Shell

**Expected Outputs:**
- Fully production-ready three-pane layout
- All cross-cutting concerns implemented and verified
- Accessibility audit passed
- Responsive layout verified
- All edge case states verified

**Implementation Scope:**
- Enhancement of all previous phases — never replaces existing Phase 2/3 content
- Additive changes only to existing panel components
- No modifications to Session component or Runtime/Core

**Out of Scope:**
- New panel content or features beyond what was specified
- Any Session file modification
- Any Runtime, Core, or Application changes
- Any architectural redesign

**Developer Checklist:**
- [ ] Read Blueprint Section 7.6 for Phase 4 architectural context
- [ ] Read Blueprint Section 2 (particularly I-SESSION, I-VISIBLE-ISOLATION, I-BACKWARD)
- [ ] Read Blueprint Section 11 for deferred decisions — confirm which remain deferred
- [ ] Implement keyboard navigation (Tab order, arrows, Enter, Escape)
- [ ] Implement panel collapse/expand (keyboard shortcuts)
- [ ] Implement transition animations
- [ ] Implement responsive layout
- [ ] Implement empty states for all conditions
- [ ] Implement error states with retry
- [ ] Implement loading states
- [ ] Implement Explorer context menu
- [ ] Implement file tree search/filter
- [ ] Implement scroll position memory
- [ ] Implement accessibility (ARIA, focus, screen reader)
- [ ] Run performance check for large directories and files
- [ ] Run accessibility audit
- [ ] Run full Session workflow regression
- [ ] Run type check and test suite

**Implementation Sequence:**
1. Implement keyboard navigation:
   a. Logical Tab order across Explorer → Session → Preview
   b. Arrow key navigation in file tree (up/down, expand/collapse)
   c. Enter to open file; Escape to collapse panel
   d. Ensure Session keybindings remain functional for Session region
2. Implement panel collapse/expand keyboard shortcuts
3. Implement transition animations for panel show/hide and resize
4. Implement responsive layout — panels collapse/stack on narrow viewports
5. Add empty states for all panels (no project, no file selected, no tabs open)
6. Add error states with retry for failed data loads
7. Add loading states (visual feedback during data retrieval)
8. Implement Explorer context menu (new file, new folder, rename, delete, reveal)
9. Implement file tree search/filter by name
10. Implement scroll position memory per file tab
11. Implement accessibility:
    a. ARIA labels on panels, tree items, tabs, buttons
    b. Focus management — focus moves to panel content when panel opens
    c. Screen reader announcements for panel state changes
12. Run performance check — verify large directory load and large file render
13. Run accessibility audit
14. Run full Session workflow regression
15. Run type check and test suite
16. Commit each concern individually

**Validation Checklist:**
- [ ] `bun typecheck` passes
- [ ] All existing tests pass
- [ ] Keyboard-only navigation: Explorer → select file → Preview reads → back to Session
- [ ] Panel collapse/expand via keyboard shortcut
- [ ] Animations smooth with no layout shift; `prefers-reduced-motion` respected
- [ ] Responsive layout: narrow viewport shows stacked panels; Session at full width when panels hidden
- [ ] Empty states for all conditions
- [ ] Error states with retry action
- [ ] Loading states during data fetch
- [ ] Explorer context menu: create, rename, delete, reveal operations
- [ ] File tree filter narrows visible files by name
- [ ] Scroll position: scroll Preview file, switch tab, switch back → scroll position restored
- [ ] Accessibility audit: zero violations
- [ ] Color contrast meets WCAG AA
- [ ] Session full workflow: prompt → agent → diff → terminal — all functional
- [ ] Zero imports from Session internals
- [ ] Zero new external dependencies

**Acceptance Criteria:**
- Keyboard navigation complete and non-conflicting with Session
- Panels toggle with animation and keyboard shortcut
- Responsive layout works on narrow viewports
- All edge case states render correctly
- Accessibility audit passes with zero violations
- Session remains fully functional
- Performance acceptable for large directories and files

**Definition of Done:**
- All Validation Checklist items pass
- All Acceptance Criteria met
- Accessibility audit report clean
- Each concern committed independently
- Phase 4 complete

**Rollback Strategy:**
- Each concern committed independently — individual reverts possible
- Full Phase 4 revert: revert commits from last to first (no dependency chain issues since each concern is independent)

**Review Checklist:**
- [ ] Keyboard navigation verified (reviewer walks through Tab order)
- [ ] Animations smooth; no layout shift
- [ ] Responsive layout correct at narrow viewport
- [ ] All state types (empty, error, loading) present
- [ ] Accessibility audit attached
- [ ] No modifications to Session component
- [ ] No new external dependencies
- [ ] Zero Session internal imports
- [ ] Each commit addresses exactly one concern

**Common Mistakes:**
- Modifying Session to fix perceived keyboard navigation issues — Session's keybindings are untouched; adapt panels around them
- Adding animations that cause layout reflow affecting Session region
- Accessibility that only covers happy path — verify error and empty states too
- Performance optimization before measuring actual need (deferred per Blueprint Section 11)
- Introducing new dependencies (libraries for syntax highlighting, animation, etc.)

**Approval Requirements:**
- Reviewer confirms keyboard navigation across all three panes
- Reviewer confirms accessibility audit clean
- Reviewer confirms Session remains fully functional
- Reviewer confirms each concern is independently committed

**Exit Criteria:**
- Phase 4 DoD satisfied
- All 5 phases complete
- Ready for Final Delivery Checklist (Section 20)

---

## 6. Developer Working Rules

### 6.1 Commit Discipline

- Each commit is one logical change
- Commit message format: `type(scope): summary`
  - Types: `feat`, `fix`, `refactor`, `chore`, `test`, `docs`
  - Scope: phase number + area (e.g., `phase0`, `phase1-shell`, `phase2-explorer`)
  - Summary: present tense, imperative mood, no period
- Example: `feat(phase0): add left panel state domain to Layout State`
- Example: `fix(phase2): handle project list empty state`

### 6.2 Working on One Thing

- Work on one concern at a time
- Complete it, commit it, move to the next
- Never juggle multiple concerns in a single workspace session
- If you discover an issue in a previous phase, log it — do not fix it outside its phase

### 6.3 Reading Before Writing

- Read the relevant code before writing anything
- Understand the existing pattern before extending it
- Verify your understanding matches the actual implementation
- Never assume — verify

### 6.4 Incremental Building

- Build the smallest testable unit first
- Verify it works
- Add the next unit
- Never build two untested units before running validation

### 6.5 Continuous Type Checking

- Run type check after every significant change
- Never accumulate type errors across multiple commits
- A type error in the working tree is a blocker — fix before the next change

### 6.6 Keeping Diffs Clean

- Review your diff before committing
- Remove debugging code, console logs, commented code, TODOs
- Ensure no whitespace or formatting changes to unrelated code
- Ensure no moved imports

### 6.7 Revert Confidence

- Before committing, verify the commit can be cleanly reverted
- `git revert <commit>` should produce no merge conflicts
- If revert would cause conflicts, restructure the commit

---

## 7. Code Review Process

### 7.1 What Reviewers Verify

1. **Scope compliance** — changes are within Presentation Layer scope; no Session/Runtime/Core modifications
2. **Architectural compliance** — invariant adherence (I-SESSION, I-CATEGORY-A, etc.)
3. **Phase compliance** — changes correspond to the active phase only; no future-phase work
4. **Code quality** — follows existing codebase conventions; no antipatterns
5. **Validation evidence** — tests pass, type check passes, screenshots provided if applicable
6. **Import audit** — no forbidden imports from Session internals or Category A subsystems
7. **Diff cleanliness** — no unrelated changes, no whitespace noise, no debug artifacts
8. **Reversibility** — each commit is independently revertible
9. **Edge cases** — empty states, error states, loading states handled

### 7.2 What Blocks Approval

Any of the following blocks approval and requires fixes before re-review:
- Scope violation (Session, Runtime, Core, Application modification)
- Architectural invariant violation
- Phase boundary violation (future-phase work included)
- Unrelated changes in diff
- Validation failure (type check, tests)
- Forbidden imports found in audit
- Missing edge case handling (empty, error, loading)
- Commit that mixes multiple concerns

### 7.3 Review Checklist (Reusable)

```
[ ] Scope: Presentation Layer only. No Session/Runtime/Core/Application modifications
[ ] Invariants: No violation of Blueprint Section 2 invariants
[ ] Phase: Changes limited to the active phase only
[ ] Imports: Audit clean — no Session internal imports, no Category A imports
[ ] Diff: Contains only changes required for the stated purpose
[ ] Commits: Each commit addresses one concern; messages follow convention
[ ] Revertibility: Each commit can be cleanly reverted
[ ] Validation: Type check passes; existing tests pass; phase-specific checks pass
[ ] Edge cases: Empty states, error states, loading states handled
[ ] Dependencies: No new external dependencies introduced
[ ] Pattern consistency: Follows existing codebase conventions
[ ] Evidence: Screenshots/validation output attached where applicable
```

### 7.4 Review Sequence

1. Author submits PR with checklist (Section 18) and validation evidence
2. Reviewer reads the Blueprint phase definition for context
3. Reviewer examines diff for scope compliance
4. Reviewer runs import audit
5. Reviewer runs type check and tests locally (or confirms CI)
6. Reviewer checks edge case handling
7. Reviewer leaves comments or approves
8. If changes requested, author addresses and re-requests review
9. Reviewer re-checks changes
10. Approval granted → merge per Merge Criteria (Section 19)

### 7.5 Approval Workflow

```
PR Submitted → Reviewer Assigned → Review → Changes Needed? → Yes → Author Fixes → Re-review
                                                                  No → Approved → Merge
```

---

## 8. Quality Gates

Every gate must pass before the associated action. No exceptions.

### 8.1 Pre-Commit Gates

| Gate | Command / Method | Failure Action |
|------|-----------------|----------------|
| Type check | `bun typecheck` from package directory | Fix type errors; do not commit |
| Existing tests | `bun test` from package directory | Fix regressions; do not commit |
| Import audit | Automated grep for forbidden imports from Session internal paths and Category A paths | Remove forbidden imports; do not commit |
| Diff review | Manual self-review | Split if multi-concern; clean if noisy |

### 8.2 Pre-Review Gates

| Gate | Command / Method | Failure Action |
|------|-----------------|----------------|
| All pre-commit gates | Re-run after final commit | Fix before submitting PR |
| Phase-specific checks | Phase Validation Checklist | Fix before submitting PR |
| Screenshot evidence (Phase 1) | Before/after comparison | Retake; ensure zero diff |

### 8.3 Pre-Merge Gates

| Gate | Verification Method | Failure Action |
|------|---------------------|----------------|
| Code review approval | Reviewer sign-off on PR | Request changes; do not merge |
| All pre-review gates | Re-verified by reviewer | Block merge until fixed |
| No forbidden files modified | Automated diff check against protected file list | Block merge; revert changes |
| Clean CI | CI pipeline passes | Block merge until CI green |

### 8.4 Phase Completion Gates

| Gate | Verification Method | Failure Action |
|------|---------------------|----------------|
| Phase DoD satisfied | Section 5 DoD checklist for phase | Do not proceed to next phase |
| Transition readiness | Next phase DoR verified | Address gaps before starting next phase |

---

## 9. Validation Workflow

### 9.1 Developer Validation (before commit)

1. Implement a single concern
2. Run type check
3. Run test suite
4. Run import audit
5. Review diff
6. If all pass → commit
7. If any fail → fix before committing

### 9.2 Self-Review (before PR)

1. Review the diff as if someone else wrote it
2. Check for missing edge cases
3. Check for architectural violations
4. Check for pattern inconsistencies
5. Check for debug artifacts, TODOs, console logs
6. Verify commit messages follow convention
7. If issues found → fix before creating PR

### 9.3 Phase-Specific Validation

Each phase has a dedicated Validation Checklist in Section 5. Run it in full before creating the pull request.

### 9.4 Architecture Review (during code review)

The reviewer validates:
- No architectural invariant violations
- No scope boundary violations
- No phase boundary violations
- No forbidden imports
- No external dependency introduction

### 9.5 Final Approval

After all validation passes and the reviewer approves, the PR is ready for merge. No additional approval is required unless the change has cross-phase implications (in which case the architect should review).

---

## 10. Risk During Execution

### 10.1 Risk Register

| ID | Risk | Cause | Detection | Mitigation | Recovery |
|----|------|-------|-----------|------------|----------|
| ER01 | Working outside scope | Developer extends changes beyond Phase scope | Code review; import audit; diff review | Enforce R1 (Phase Isolation) and R2 (Scope Containment) in Developer Working Rules | Revert out-of-scope commits; re-implement within scope |
| ER02 | Accidental Session modification | Developer modifies Session file while working on Layout Shell or panels | Pre-commit diff review; pre-merge automated protected file check; pre-commit conversation check | Enforce R2 (Scope Containment); mark Session file as protected in local Git hooks | Revert accidental modification; restore Session file from origin |
| ER03 | Large commits with mixed concerns | Developer implements multiple deliverables before committing | Self-review catches it; reviewer rejects mixed-commit PR | Enforce R3 (Single Concern) and Rule 6.1 (Commit Discipline) | Split commit into individual concerns before review |
| ER04 | Phase leakage | Developer implements Phase 4 features during Phase 2 or 3 | Code review — reviewer recognizes out-of-phase features | Enforce R4 (No Mixed Phases); refer to phase-specific Out-of-Scope lists | Revert out-of-phase work; log as deferred |
| ER05 | Partial implementation | Phase submitted with incomplete deliverables | Phase DoD checklist reveals gaps during validation | Use Developer Checklist and Validation Checklist for every phase | Complete missing deliverables; re-validate |
| ER06 | Insufficient validation | Developer skips validation steps due to time pressure | Reviewer notices missing validation evidence | Enforce R6 (Validation Before Merge); reviewer blocks PR without evidence | Run validation; add evidence; resubmit |
| ER07 | Dependency chain break | SDK client API changes upstream during implementation | Type check fails; tests fail | Lock dependency version for the implementation period | Update to new API version; re-validate |
| ER08 | CSS leak into Session | New panel styles cascade into Session region | Visual regression check; browser inspector | Enforce I-VISIBLE-ISOLATION; use existing CSS isolation mechanisms | Fix CSS scope; re-verify visual regression |

### 10.2 Immediate Actions on Risk Detection

| Scenario | Action |
|----------|--------|
| Scope violation detected in PR | Reject PR; author reverts out-of-scope changes |
| Session modification detected | Revert immediately; restore Session file; investigate cause |
| Import audit failure | Remove forbidden import; replace with SDK API call or Layout State bridge |
| Mixed concerns in commit | Split into separate commits; re-push |
| Phase leakage detected | Remove out-of-phase code; defer to correct phase |
| Validation failure | Fix issue before proceeding; do not bypass |

---

## 11. Rollback Procedures

### 11.1 Single Commit Rollback

```
git revert <commit-hash>
```

Verify the revert is clean (no conflicts). If conflicts arise, the commit was not atomic — this is a process violation. Fix the commit discipline before proceeding.

### 11.2 Single Feature Rollback

```
git revert <feature-start-commit>..<feature-end-commit>
```

This reverts all commits for a feature. Verify the Session is not affected by the revert.

### 11.3 Single Phase Rollback

| Phase | Rollback Command | Verification |
|-------|-----------------|--------------|
| 0 | `git revert <phase0-commit>` | Layout State returns to pre-extension state; existing consumers unchanged |
| 1 | `git revert <phase1-commit>` | Layout Shell returns to single-region layout; Session renders correctly |
| 2 | `git revert <phase2-commits>` in reverse order | Panel content removed; left slot returns to empty state |
| 3 | `git revert <phase3-commits>` in reverse order | Panel content removed; right slot returns to empty state |
| 4 | `git revert <phase4-commits>` in reverse order | Polish enhancements removed; base panels remain |

### 11.4 Full Implementation Rollback

```
# If phases merged sequentially:
git revert <phase0-base>..<phase4-head>

# This reverts all implementation commits in reverse order.
```

After full rollback, verify:
- Session renders and functions as before
- Layout Shell is single-region
- No new files remain from HeniossAI implementation
- No modifications to any existing file persist

### 11.5 Rollback Verification

After any rollback:
1. Run type check
2. Run test suite
3. Verify Session full workflow
4. Verify no remnants of rolled-back code remain
5. Document rollback reason and resolution

---

## 12. Documentation Workflow

### 12.1 What Must Be Documented

| Artifact | When | Where |
|----------|------|-------|
| Implementation decisions not covered by Blueprint | During implementation | PR description or commit message |
| Deviations from Implementation Sequence | During implementation | PR description with justification |
| SDK API issues or workarounds | During implementation | PR description; log issue upstream |
| Performance observations requiring optimization | During Phase 4 | PR description; evaluation of alternatives |
| Any invariant violation (even if caught before commit) | When detected | Incident log; root cause analysis |

### 12.2 How Documentation Is Captured

- **Decision made during implementation:** Document in PR description as "Implementation Notes" section
- **Architecturally significant decision:** If a decision affects future phases or could affect the architectural approach, escalate for possible Blueprint amendment (via ADR process)
- **Observation or discovery:** PR description or separate issue tracker entry

### 12.3 Evidence Required

| Artifact | Evidence | Phase |
|----------|----------|-------|
| Type check | CI output or local terminal output | All |
| Tests pass | CI output or local terminal output | All |
| Visual regression | Before/after screenshots | Phase 1 |
| Import audit | Automated check output | Phases 2, 3 |
| Accessibility | axe-core or equivalent report | Phase 4 |
| Session workflow | Manual verification (screenshot or video if desired) | All |

### 12.4 Implementation Decision Recording

If an implementation decision has architectural implications, create a lightweight record:
```
## Decision Record
Date: <date>
Phase: <phase>
Decision: <what was decided>
Context: <why this decision arose>
Alternatives: <what was considered>
Impact: <effect on architecture, future phases, or invariants>
```

Attach to the PR description. If impact is significant, escalate to architect for Blueprint amendment consideration.

---

## 13. Progress Tracking

### 13.1 Phase Status

```
Phase 0: [NOT STARTED | IN PROGRESS | IN REVIEW | COMPLETED | ROLLED BACK]
Phase 1: [NOT STARTED | IN PROGRESS | IN REVIEW | COMPLETED | ROLLED BACK]
Phase 2: [NOT STARTED | IN PROGRESS | IN REVIEW | COMPLETED | ROLLED BACK]
Phase 3: [NOT STARTED | IN PROGRESS | IN REVIEW | COMPLETED | ROLLED BACK]
Phase 4: [NOT STARTED | IN PROGRESS | IN REVIEW | COMPLETED | ROLLED BACK]
```

### 13.2 Current Objective

```
Current Phase: <phase number and name>
Current Objective: <single sentence describing what is being worked on right now>
Started: <date>
Target Completion: <date>
```

### 13.3 Completed Items

```
- <date>: <phase> — <deliverable> — <evidence>
- <date>: <phase> — <deliverable> — <evidence>
```

### 13.4 Remaining Items

```
- [ ] <phase> — <deliverable>
- [ ] <phase> — <deliverable>
```

### 13.5 Blocked Items

```
- <phase> — <deliverable> — Blocked by: <reason> — Since: <date>
- <phase> — <deliverable> — Blocked by: <reason> — Since: <date>
```

### 13.6 Known Issues

```
- <phase> — <issue description> — Severity: <low/medium/high> — Status: <open/workaround/resolved>
```

### 13.7 Review Status

```
Last Review: <date> — Reviewer: <name> — Result: <approved/changes-requested>
Next Review: <date> — Reviewer: <name> — Scope: <what will be reviewed>
```

### 13.8 Approval Status

```
Phase 0: [PENDING | APPROVED | REJECTED]
Phase 1: [PENDING | APPROVED | REJECTED]
Phase 2: [PENDING | APPROVED | REJECTED]
Phase 3: [PENDING | APPROVED | REJECTED]
Phase 4: [PENDING | APPROVED | REJECTED]
```

### 13.9 Ready for Next Phase

```
Current Phase DoD: [SATISFIED | NOT SATISFIED]
Next Phase DoR: [VERIFIED | FAILED]
Transition: [READY | BLOCKED]
```

---

## 14. Communication Protocol

### 14.1 Progress Reports

After each work session, report:

```
Completed: <what was done>
Evidence: <type check passed, tests passed, screenshots, etc.>
Validation: <checks run and results>
Known Issues: <any issues discovered>
Questions: <any questions for the team>
Next Task: <what will be worked on next>
```

### 14.2 Report Style

- Concise. No narrative. No unnecessary detail.
- Use bullet points and checkboxes.
- Attach evidence (screenshots, terminal output) if relevant to validation.
- If no work was completed, report: "No progress — blocked by <reason>."

### 14.3 Escalation Triggers

Escalate immediately if:
- An architectural invariant is violated or must be reconsidered
- A scope boundary is crossed
- A phase cannot be completed as specified in the Blueprint
- An upstream change breaks the implementation assumption
- A rollback is executed

### 14.4 Decision Communication

- Implementation decisions: documented in PR description
- Architectural decisions: escalate to architect for Blueprint amendment
- Phase readiness: report to team when phase DoD is satisfied

---

## 15. Definition of Ready (DoR) — Template

Before starting any phase, verify these conditions:

```
## Definition of Ready — Phase <N>

Prerequisites:
[ ] Blueprint Section 7.<N> read and understood
[ ] Blueprint Section 2 invariants reviewed and internalized
[ ] Previous phase Definition of Done is satisfied
[ ] Previous phase approved and merged
[ ] All required inputs from previous phases are available
[ ] SDK client APIs required for this phase are available and understood
[ ] Existing infrastructure required for this phase is identified and understood
[ ] No blocking issues from previous phase

Resources:
[ ] Developer assigned and understands the phase scope
[ ] Reviewer identified for the phase

Decision:
[ ] READY TO START — all conditions met
[ ] NOT READY — outstanding items: <list>
```

---

## 16. Definition of Done (DoD) — Template

Before declaring any phase complete, verify these conditions:

```
## Definition of Done — Phase <N>

Deliverables:
[ ] All deliverables listed in Blueprint Section 7.<N> exist and are functional
[ ] All Implementation Sequence steps completed

Validation:
[ ] Type check passes
[ ] All existing tests pass
[ ] Phase-specific Validation Checklist items all pass
[ ] Import audit clean (no forbidden imports)
[ ] No new external dependencies
[ ] No modifications to Session, Runtime, Core, or Application files

Code Quality:
[ ] All commits follow single-convention per commit
[ ] Diff is clean — no unrelated changes, no debug artifacts
[ ] Commit messages follow convention: type(scope): summary

Review:
[ ] Code review completed and approved
[ ] All review comments addressed
[ ] Reviewer confirms scope compliance

Rollback:
[ ] Phase can be cleanly reverted (verified)
[ ] Rollback procedure documented if non-trivial

Transition:
[ ] Phase branch merged
[ ] Next phase DoR verified
[ ] Phase complete — ready for next phase

Decision:
[ ] DONE — all conditions met
[ ] NOT DONE — outstanding items: <list>
```

---

## 17. Phase Review Template

### 17.1 Template

```
## Phase <N> Review

### What Was Built
<brief description of deliverables>

### Validation Results
- Type check: <pass/fail>
- Existing tests: <pass/fail>
- Visual regression (Phase 1): <pass/fail — attach comparison>
- Import audit: <clean/violations found — attach audit log>
- Accessibility audit (Phase 4): <pass/fail — attach report>
- Other phase-specific checks: <pass/fail>

### Architectural Compliance
- Scope boundaries: <verified/violation>
- Invariants: <all preserved/violation>
- Forbidden modifications: <none/detailed>

### Code Quality Review
- Commit discipline: <satisfactory/issues>
- Diff cleanliness: <clean/noisy>
- Pattern consistency: <consistent/deviation>

### Known Issues
<List any issues discovered but not blocking>

### Rollback Verification
- Phase revertible: <yes/no>
- If no, explain: <reason>

### Decision
[ ] APPROVED — proceed to next phase
[ ] APPROVED WITH NOTES — proceed, but address items: <list>
[ ] REJECTED — issues to resolve before next phase: <list>

Reviewer: <name>
Date: <date>
```

---

## 18. Pull Request Checklist

Every PR must include this completed checklist:

```
## Pull Request Checklist — Phase <N>

### Scope
[ ] All changes are within Presentation Layer scope
[ ] No Session file modified
[ ] No Runtime/Core/Application file modified
[ ] No Category A subsystem imported or modified

### Phase Compliance
[ ] Changes belong to this phase only (no future-phase work)
[ ] Each commit addresses a single concern
[ ] Commit messages follow convention: type(scope): summary

### Validation
[ ] Type check passes
[ ] Existing tests pass
[ ] Validation Checklist for this phase is complete
[ ] Import audit clean (output attached)

### Evidence
[ ] Before/after screenshots attached (if Phase 1; otherwise if visual change)
[ ] Validation output attached (terminal output, CI link, etc.)

### Diff Quality
[ ] Diff contains only changes required for the stated purpose
[ ] No whitespace/formatting changes to unrelated code
[ ] No debug artifacts, console logs, TODOs, or commented code

### Edge Cases
[ ] Empty states handled
[ ] Error states handled
[ ] Loading states handled

### Dependencies
[ ] No new external dependencies introduced
[ ] Pattern consistency with existing codebase

### Rollback
[ ] Each commit is independently revertible
[ ] Rollback procedure verified

Author: <name>
Date: <date>
```

---

## 19. Merge Criteria

All conditions must be satisfied before merging any PR.

```
[ ] All quality gates pass (Section 8)
[ ] Code review approved (Section 7)
[ ] Pull Request Checklist completed and attached (Section 18)
[ ] No unresolved review comments
[ ] CI pipeline green (type check, tests, lint, import audit)
[ ] Diff contains only phase-scoped changes
[ ] No forbidden files modified (Session, Runtime, Core, Application)
[ ] Commit discipline verified (single concern per commit)
[ ] Branch is up to date with target branch
[ ] Merge method: squash-merge or rebase-merge only (no merge commits)

Decision: [APPROVED FOR MERGE | BLOCKED — <reason>]
```

---

## 20. Final Delivery Checklist

Before declaring the HeniossAI Presentation Layer implementation complete, verify all conditions:

### Phase Completion

```
[ ] Phase 0 DoD satisfied and approved
[ ] Phase 1 DoD satisfied and approved
[ ] Phase 2 DoD satisfied and approved
[ ] Phase 3 DoD satisfied and approved
[ ] Phase 4 DoD satisfied and approved
```

### Quality

```
[ ] Full test suite passes
[ ] Type check passes
[ ] Accessibility audit: zero violations
[ ] Visual regression: before/after comparison across all states
[ ] Session full workflow verified (prompt → agent → diff → terminal)
[ ] Cross-panel workflow verified (Explorer → Select → Preview → Session continues)
[ ] Keyboard navigation verified (Tab, arrows, Enter, Escape, shortcuts)
[ ] Responsive layout verified (narrow and wide viewports)
[ ] No performance regressions identified
```

### Architecture

```
[ ] Zero Session file modifications
[ ] Zero Runtime/Core/Application modifications
[ ] Zero forbidden imports detected (full audit)
[ ] Zero new external dependencies
[ ] All architectural invariants preserved (Blueprint Section 2)
[ ] No scope boundary violations
```

### Documentation

```
[ ] All implementation decisions documented in PR descriptions
[ ] Any architecturally significant decisions escalated and resolved
[ ] Rollback procedures tested and documented
```

### Governance

```
[ ] All phase reviews completed and approved
[ ] All acceptance criteria met (Blueprint Section 5 phase DoDs)
[ ] No known blocking issues
[ ] Final delivery verified by reviewer
```

### Declaration

```
This certifies that the HeniossAI Presentation Layer implementation:
- Delivers the approved three-pane product vision
- Operates entirely within Presentation Layer scope
- Preserves all architectural invariants
- Modifies zero Session, Runtime, Core, or Application files
- Is fully revertible
- Passes all quality gates, validation checks, and acceptance criteria

Signed: <name>
Date: <date>
```

---

*End of Execution Plan — Implementation Guide*
*This document operationalizes the approved Blueprint. It does not redesign, replace, or question architectural decisions.*
