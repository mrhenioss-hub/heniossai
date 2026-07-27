# HeniossAI — Design Execution Blueprint

## V1 | Visual Evolution Roadmap for the Presentation Layer | 2026-07-27

> **Document class:** Design Direction + Execution Roadmap
> **Authority position:** Sits *below* Product Vision / BLUEPRINT.md / EXECUTION_PLAN.md, *beside* the V1–V4 design specs. It does not override them. It resolves them into one executable visual system.
> **Scope:** Presentation Layer only. Visual reconstruction only.
> **Runtime rule:** Black box. `{I-RUNTIME}` `{I-SESSION}` `{I-SESSION-FILES}` `{I-CATEGORY-A}` `{I-NO-DEPS}` `{I-BACKWARD}` `{I-UNIDIRECTIONAL}` `{I-COMM-LAYER}` `{I-VISIBLE-ISOLATION}` `{I-SCOPE}`
> **Mandate:** HeniossAI **evolved**, not HeniossAI **replaced**.

---

### Source Documents Read Before Writing (Single Source of Truth)

| # | Document | Lines | Role in this blueprint |
|---|---|---|---|
| S1 | `plans/Presentation_Layer_Visual_Forensic_Audit.md` | 1,055 | Baseline visual inventory, layout metrics, dialog/dock/tab catalogue |
| S2 | `plans/Presentation_Layer_Visual_Forensic_Audit_V2.md` | 3,493 | Component hierarchy, ownership, journeys, dead/duplicate audit |
| S3 | `plans/Presentation_Layer_Visual_Forensic_Audit_V3_Blueprint.md` | 4,772 | Design System Atlas, theme system, responsive matrix, z-order, animation atlas |
| S4 | `plans/Presentation_Layer_Runtime_Behavior_Blueprint_V4.md` | 2,914 | Runtime, provider graph, reactive graph, lifecycles — the immutable constraint set |
| S5 | `design-spec/HeniossAI_Presentation_Layer_Product_Design_Specification.md` | 1,473 | "Precision Surface" identity, HDS v1 tokens, screens, consistency laws |
| S6 | `design-spec/HeniossAI_AI_First_Presentation_Layer_Specification_V2.md` | — | AI-first re-weighting directive |
| S7 | `design-spec/HeniossAI_Spec_V3_AI_NATIVE_FINAL.md` | 889 | AI-native IA, Activity Bar, Side Bar modes |
| S8 | `design-spec/HeniossAI_Spec_V4_MISSION_CENTERED_FINAL.md` | 400 | **Mission is primary object. AI is primary actor.** Current governing spec |
| S9 | `BLUEPRINT.md` / `EXECUTION_PLAN.md` / `IMPLEMENTATION_PROTOCOL.md` | 2,320 | Invariants, phase discipline, authority hierarchy, quality gates |
| S10 | `HENIOSSAI_..._PRODUCTION_READINESS_REPORT.md` + `REPORT_PHASE_0..4.md` | 1,614 | What is already shipped and must not regress |
| S11 | `UX_PHASE1/2_*` menu-bar & top-bar papers | 1,816 | Approved top-bar minimalism direction |
| S12 | `baseline/*.md` | 57 | Explorer capabilities, routes, shortcuts, empty states, context menus |
| S13 | `packages/ui/src/styles/hds.css` (388 lines), `theme.css`, `packages/app/src/pages/layout-new.tsx` | — | What already exists in code — the real starting line |

**Design Directives referenced by ID throughout this document:**

| ID | Directive | Source |
|---|---|---|
| **DD-1** | Mission is the primary object. Not the file. | S8 |
| **DD-2** | AI is the primary actor, not an assistant bolted to an editor. | S6, S7, S8 |
| **DD-3** | Files, editors, terminals, previews are **secondary tools** that surface only when the mission requires them. | S8 |
| **DD-4** | Zero runtime modification. Presentation adapts to runtime, never the reverse. | S4, S9 |
| **DD-5** | Productivity before decoration. Calm density. | S5 |
| **DD-6** | Command-first, pointer-second. | S5 |
| **DD-7** | One system: one icon system, one button system, one tooltip system, one menu system. | S5 |
| **DD-8** | Dark-first, light as an equal-quality citizen. | S5 |
| **DD-9** | Trustworthy transparency — model, agent, tokens, permissions always visible. | S5, S7 |
| **DD-10** | Additive only. Existing APIs and behaviours unchanged. `{I-BACKWARD}` | S9 |
| **DD-11** | Must not resemble OpenCode, VS Code, Cursor, Antigravity or any existing AI IDE. Own identity. | S5, S8 |
| **DD-12** | Context preservation is sacred (scroll positions, caches, widths). | S5 |
| **DD-13** | Antigravity is a *philosophical* reference only — never a visual one. | S7, S8 |
| **DD-14** | Motion is functional. 120/160/180/240ms, `cubic-bezier(0.22,1,0.36,1)` is the signature. | S3, S5 |
| **DD-15** | Accessibility is part of flow, not an afterthought. AA minimum, AAA for body. | S5 |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Visual Identity](#2-visual-identity)
3. [Design Language](#3-design-language)
4. [Color System](#4-color-system)
5. [Typography](#5-typography)
6. [Iconography](#6-iconography)
7. [Motion System](#7-motion-system)
8. [Component Language](#8-component-language)
9. [Screen-by-Screen Design](#9-screen-by-screen-design)
10. [AI Presence](#10-ai-presence)
11. [HDS Foundation](#11-hds-foundation)
12. [Implementation Roadmap](#12-implementation-roadmap)
13. [Design Validation Register](#13-design-validation-register)
14. [Visual Concepts](#14-visual-concepts)
15. [Compliance Declaration](#15-compliance-declaration)

---

# 1. Executive Summary

## 1.1 What this document is — and is not

This is **not** a redesign. HeniossAI already has an approved architecture, an approved runtime, an approved information architecture and a shipped three-pane Presentation Layer (Phases 0–4, all closed, all green per S10). Everything structural is settled.

What is *not* settled is **how the product looks and feels when you use it**. Today the surface is a set of correct decisions that have never been unified: two token systems (`--v2-*` and semantic), two layout systems, two icon systems, two tooltip systems, 17 duplicate V1/V2 component pairs, 35 themes, 1,200 colour values, and a visual weighting inherited from a code editor rather than earned by a mission-centred AI environment.

This document is the **execution roadmap for the visual layer only** — the plan by which HeniossAI's existing, correct product becomes visually singular, coherent and unmistakable, without one line of runtime, business logic, provider, lifecycle, SDK, API or data-model change.

## 1.2 Overall visual direction — "Quiet Instrument"

The direction is named **Quiet Instrument**.

HeniossAI is a precision instrument that does difficult work on your behalf and reports back honestly. Instruments are not decorative. They are legible under pressure, they never lie about state, and they get out of the way of the reading. A well-made instrument feels expensive precisely because it *refuses* to perform.

Three ideas carry the whole system:

**(a) The Spine.** A mission is a continuous line of reasoning. HeniossAI renders that literally: a single 1px vertical hairline runs down the left margin of the timeline, tying every turn — human, model, tool, permission — into one visible thread. Completed segments are neutral border colour; the active segment carries Henioss Cobalt. This is the product's signature gesture. It appears nowhere else in the software industry, it is one CSS pseudo-element, and it costs nothing at runtime.

**(b) Weight tells you what matters.** There is no chrome hierarchy, no colour hierarchy, no icon hierarchy. There is one hierarchy: **typographic and elevation weight**. Mission content is largest, warmest, most elevated and most spaced. Artifacts (Review, Context) are next. Files, previews and terminals are smallest, coolest, flattest and densest. A user who cannot read a word of the interface can still tell what the product thinks is important. This is DD-1, DD-2 and DD-3 expressed as pure visual grammar.

**(c) One accent, spent carefully.** Henioss Cobalt `#2A5FFF` is the only chromatic colour in the entire chrome. It appears on: focus rings, the active spine segment, the active-item 2px bar, the primary button, and the context chip tint. Nowhere else. Everything else is neutral charcoal or warm paper. Semantic colours (green/amber/red) are permitted *only* where they carry semantics — diffs, permission, status, error. Because the accent is rationed, every appearance of it means "here, now, this".

## 1.3 Design philosophy

> **Calm surfaces. Explicit state. Rationed emphasis. Zero decoration.**

Four operating principles, each inherited (not invented) from the approved specs:

1. **The runtime is the client.** (DD-4) Every visual decision in this document was checked against S4. If a proposal would require a new provider, a new signal, a new lifecycle hook or a new dependency, it was discarded and re-derived as CSS, JSX ordering, or a default value. No exceptions were made.
2. **Evolution reads as recognition.** (DD-10) An existing user must open the new build and *immediately* find every panel, every keybind, every context menu item exactly where it was. Nothing moves. Nothing is renamed in the UI. What changes is grain, weight, rhythm, colour discipline and motion. Recognition is a feature.
3. **Density is a courtesy, not a cost.** (DD-5) More rows per screen, fewer visual events per row. We buy density by tightening the 4px grid and muting secondary text — never by removing labels, affordances or breathing room around mission content.
4. **Presence without personification.** (§10) The AI is never drawn. It is *felt* — through the spine, the caret, the progress rhythm, the elevation of the composer. No avatar, no bubble, no mascot, no name, no face.

## 1.4 Expected user perception

| Horizon | What the user should conclude |
|---|---|
| **First 3 seconds** | "This is not a fork of anything. This is a product." |
| **First 30 seconds** | "It's the same app I know — it just got sharper." |
| **First 3 minutes** | "I can tell what's happening without reading. The blue line is the AI working." |
| **First 30 minutes** | "Everything is where I left it. Nothing lost my scroll position." |
| **First week** | "I stopped noticing the interface." — the highest score an instrument can get. |

## 1.5 Desired emotional feeling

**Composure under load.**

Not excitement. Not delight. Not playfulness. HeniossAI's user is running five concurrent missions, arbitrating permission requests, and reading diffs at 11pm. The correct emotion is the one a good cockpit produces: everything is instrumented, nothing is shouting, and you trust the readouts.

Warmth is permitted in exactly two places: the light theme is warm *paper*, never cold grey; and the six avatar hues are desaturated to the point of being almost neutral, giving projects and missions a human fingerprint without introducing colour noise.

Forbidden emotional registers: cheerful, magical, futuristic, gamified, "AI-mystical". No glow, no aurora, no particle fields, no gradient meshes, no confetti, no springy overshoot outside the one existing todo-progress spring.

---

# 2. Visual Identity

## 2.1 Personality

Five traits, each with a concrete visual consequence. If a trait cannot be pointed at in the pixels, it is not a trait — it is a wish.

| Trait | Visual consequence |
|---|---|
| **Precise** | Only 4/6/8/12/full radii exist. Only 11/12/13/14/16px type exists. Only 2/4/6/8/12/16/20/24/32/40/48px spacing exists. No 7px. No 15px. No 300ms. Deviation is a lint error. |
| **Composed** | Backgrounds occupy a 22-point lightness band (`#121214`→`#2E2E31`). No large lightness jumps. Depth is made from a 1px border plus a shadow, never from a bright surface. |
| **Honest** | Every state is drawn, never implied. Working shows a spinner. Permission shows amber. Error shows red plus text plus a retry. Token usage shows a meter. Nothing is hidden to look clean. (DD-9) |
| **Rationed** | One accent. One icon stroke. One tooltip. One menu. One button family. Restraint is the brand. (DD-7) |
| **Continuous** | The Spine. Missions are lines, not lists of cards. Continuity is drawn, not implied by proximity. |

## 2.2 Visual language — "Precision Surface", second generation

S5 established **Precision Surface**: matte stone surfaces, glass overlays, metal borders. That vocabulary is *kept*, not replaced. This blueprint extends it with three refinements that carry the mission-centred mandate:

**Refinement 1 — Stone is now graded by role, not by depth alone.**
Previously a surface's lightness told you how deep it sat. Now it tells you *what kind of thing it is*:

| Role | Surface | Border | Shadow | Example |
|---|---|---|---|---|
| **Frame** (never contains content) | `bg-deep` | — | — | Titlebar, activity rail, status bar |
| **Field** (contains flowing content) | `bg-base` | 1px `border-base` between fields | none | Sidebar, timeline column, auxiliary panel |
| **Object** (a discrete, addressable thing) | `bg-layer-01` | 1px `border-base` | `shadow-xs` | Tool card, dock, composer, dialog, popover |
| **Transient** (temporary, above everything) | `bg-layer-01` + overlay scrim | 1px `border-base` | `shadow-lg` | Dialog, command palette, toast, menu |

A user learns the grammar in a minute without being taught: *if it has a border and a shadow, it is a thing you can act on.*

**Refinement 2 — Glass is demoted.** S5 permitted `backdrop-filter: blur(12px)` broadly. It is now permitted **only** on the modal scrim behind dialogs and the command palette. Popovers, menus, tooltips and toasts become opaque `bg-layer-01`. Reason: blur on a dense workspace produces visual mud at 13px, costs compositor time on Windows/Tauri, and is the single most imitated effect in the AI-IDE category (DD-11). Opaque overlays with crisp 1px borders read sharper and are ours.

**Refinement 3 — The hairline is the primary structural device.** Panels separate with 1px `border-base`. Lists separate with 1px `border-weak`. Groups separate with whitespace. Nothing separates with a shadow, a gradient or a colour change. The whole product is drawn with a single-weight pen.

## 2.3 The premium feeling — where it actually comes from

Premium is not gloss. In dense professional software premium is produced by five measurable things, and this is where the budget goes:

1. **Optical alignment, not mathematical alignment.** Icon+label pairs align on the icon's optical centre, not its bounding box. The 16px icon in a 28px row sits at 6px/6px, not 6px/5px. Chevrons are nudged 0.5px. This is invisible and it is the difference.
2. **Consistent internal rhythm.** Every row in the product is 24, 28, 32, 36 or 48px tall. Never 30. Never 35. When you scroll a sidebar next to a tab strip, the beats line up.
3. **Nothing reflows.** Hover never changes size, weight or position — only background and colour. Skeletons reserve exact final height. Spinners occupy the same box as the icon they replace. The interface never twitches.
4. **Two-tier text contrast.** Primary text at AAA (≥7:1), secondary at AA (≥4.5:1), and a deliberate, wide gap between them. Cheap interfaces use three or four muddy contrast steps; expensive ones use two confident ones.
5. **Shadow honesty.** One shadow scale, layered 3-stop, `light-dark()`-aware, already present in `theme.css`. No colored shadows. No shadow on things that don't float.

## 2.4 The AI-native feeling — where it actually comes from

An interface reads as AI-native when the **process** is visible, not when robots are drawn. HeniossAI achieves this with six devices, all already supported by the runtime:

| Device | What it communicates | Runtime source (existing) |
|---|---|---|
| **The Spine** | This mission is one continuous act of reasoning | pure CSS on the timeline column |
| **Live caret** | Generation is happening *right now* | existing streaming signal |
| **Elevated composer** | The input is the centre of the product, not a footer | CSS elevation |
| **Context chips** | The AI's inputs are explicit and editable — no hidden context | existing `ContextItems` |
| **Progress rhythm** | Work is decomposed and advancing | existing Todo dock + `AnimatedNumber` spring |
| **Permission amber** | The AI asked before acting | existing Permission dock |

Note what is absent: no "thinking…" animations beyond the existing caret, no pulsing orbs, no synthetic personality. **Presence is evidence of work, not decoration about work.**

## 2.5 Uniqueness — what makes HeniossAI recognisable in one frame

If a screenshot of HeniossAI is placed in a lineup of ten AI IDEs, these five properties identify it instantly:

1. **The Spine.** No other product draws mission continuity as a single accent-tipped hairline down the timeline gutter.
2. **The mission/tool weight inversion.** In every competitor the file tree is bold and the conversation is a side panel. In HeniossAI the file tree is 13px muted grey, explicitly labelled `FILES — SECONDARY TOOL`, and the conversation is 14px at 180% leading. Nobody else does this, because nobody else made Mission the primary object (DD-1).
3. **Chromatic austerity.** Exactly one accent hue across the entire chrome. Competitors average four to seven.
4. **Rectilinear discipline.** No pill sidebars, no floating rounded islands, no card-on-card nesting. Flush panels, hairline seams, 4/6/8/12 radii only.
5. **The Henioss shield monogram.** A single geometric "H" enclosed in a shield silhouette, cobalt on charcoal, used at 20px in the titlebar and as a 3% watermark on empty canvases. Never animated. Never gradient. Never accompanied by a wordmark inside the app.

**Recognition test for reviewers:** crop any 400×300 region of any screen. If the crop contains a hairline seam, muted 13px secondary text and at most one cobalt element, it is HeniossAI.

---

# 3. Design Language

## 3.1 Surfaces

Four surfaces. No fifth surface may be introduced.

| Surface | Dark | Light | Used for | Never used for |
|---|---|---|---|---|
| `bg-deep` | `#121214` | `#F8F8F5` | Titlebar, activity rail, status bar, tooltip body | Content regions |
| `bg-base` | `#18181B` | `#FCFCFB` | Sidebar, main column, auxiliary panel, preview, terminal | Floating objects |
| `bg-layer-01` | `#1F1F22` | `#FFFFFF` | Cards, docks, composer, dialogs, popovers, menus, toasts, inputs | Full-panel backgrounds |
| `bg-layer-02` | `#262629` | `#F3F3F1` | Hover only | Resting state |
| `bg-layer-03` | `#2E2E31` | `#EBEBE8` | Selected / active row fill, pressed | Hover |

*Rule S-1:* A panel is never `bg-layer-01`. A card is never `bg-base`. Role determines surface, depth does not.
*Rule S-2:* `bg-layer-02` and `bg-layer-03` are **interaction states**, not surfaces. They may never be a component's resting background.

## 3.2 Elevation

Five levels. Shadow tokens already exist in `theme.css` and are reused unchanged (DD-4, `{I-NO-DEPS}`).

| Level | Composition | Z-band | Members |
|---|---|---|---|
| **E0 — Ground** | background only | 0 | Frames, fields, timeline, file tree rows, preview content |
| **E1 — Object** | `bg-layer-01` + 1px `border-base` + `shadow-xs` | 1–9 | Tool cards, docks, composer, review diff container |
| **E2 — Floating** | `bg-layer-01` + 1px `border-base` + `shadow-md` | 50 | Popovers, menus, context menus, hover cards, slash popover |
| **E3 — Modal** | scrim (`bg-overlay` + blur 12px) + `bg-layer-01` + 1px `border-base` + `shadow-lg` | 50–51 | Dialogs, command palette, mobile drawers |
| **E4 — Notice** | `bg-layer-01` + 1px `border-base` + `shadow-lg` | 70+ | Toasts, provider tip |

*Rule E-1:* Elevation never animates on hover. No lift, no scale-up, no shadow growth. Hover changes background only. This is the single strongest anti-website rule in the system.
*Rule E-2:* Nothing nests two elevations deep. A card inside a dialog is E0 with a border, not E1. Depth stacking is what makes dense UIs feel cheap.
*Rule E-3:* The existing z-index bands from S3 §41 are preserved exactly. This blueprint adds no new z-layer.

## 3.3 Borders

| Token | Weight | Purpose |
|---|---|---|
| `border-base` | 1px | Panel seams, object outlines, dialog outlines |
| `border-weak` | 1px | Intra-panel dividers, list separators, tab-strip underline, table rules |
| `border-strong` | 1px | Scrollbar thumb, disabled input outline, high-contrast mode |
| `border-focus` | 2px ring | Keyboard focus only — cobalt, never used decoratively |

*Rule B-1:* Every panel boundary is an explicit 1px border. Panels are never separated by background lightness alone. This is the strongest carrier of the "instrument" character.
*Rule B-2:* Border radius may never exceed the parent's radius minus its padding. A 4px-padded 8px card contains 4px children.
*Rule B-3:* The 2px active bar (`interactive-base`) is a *marker*, not a border. It sits inside the element's box, is `radius-full`, is 16px tall for 28–32px rows, and is the sole selection indicator for every list in the product.

## 3.4 Layering

The workspace layers along one axis: **left is orientation, centre is work, right is evidence, bottom is execution, top is control.** This is the existing IA (S3 §19, S7 §10) and it is preserved verbatim — nothing moves (DD-10).

```
┌── Titlebar 36 ────────────────────────────────────────── control ──┐
│ H │ mission tabs …                         + │  status │ ▁ ▢ ✕     │
├───┬────────────┬──────────────────────────┬────────────────────────┤
│ A │  Side Bar  │      Main / Mission      │     Auxiliary          │
│ c │   240      │        flex-1            │       360              │
│ t │            │                          │  ┌──────────────────┐  │
│ 48│ MISSIONS   │  ▏ timeline (spine)      │  │ Review · Context │  │  ← primary
│   │  today     │  ▏                       │  ├──────────────────┤  │
│   │  yesterday │  ▏ tool cards            │  │ preview (32h)    │  │  ← secondary
│   │            │  ┌────────────────────┐  │  └──────────────────┘  │
│   │ FILES ▾    │  │ docks              │  │                        │
│   │  (muted)   │  ├────────────────────┤  │                        │
│   │            │  │ composer  ▲ E1     │  │                        │
├───┴────────────┴──┴────────────────────┴──┴────────────────────────┤
│  Terminal 200 (hidden by default)                       execution   │
├─────────────────────────────────────────────────────────────────────┤
│  Status 24 · branch · model · context meter               readout    │
└─────────────────────────────────────────────────────────────────────┘
```

*Rule L-1:* No region ever moves, resizes its role, or changes side. Panel *default widths* may change (a value, not a structure) — 280→240 sidebar, 420→360 auxiliary — because S7/S8 already specify this and both remain inside the existing 200–600/200–800 clamps enforced by the runtime.
*Rule L-2:* Secondary tools (Preview, Terminal) default to closed. This is a default value in existing persisted layout state, not a behaviour change (DD-3). Users who had them open keep them open — persisted state wins.

## 3.5 Visual rhythm

The product beats on a **4px grid** with a **28px row pulse**.

| Beat | Value | Where |
|---|---|---|
| Micro | 2px | Icon-to-badge, chip internals |
| Base | 4px | Icon-to-label, tight stacks |
| Step | 8px | Panel padding, control gaps, dock internal gap |
| Group | 12px | Card padding, section gaps, **timeline turn gap** |
| Section | 16px | Timeline horizontal padding, dialog padding |
| Zone | 24px | Dialog margins, empty-state stack |

Row heights, exhaustively: **24** (compact chip / small icon button) · **28** (tree row, session row, menu item, tab, small input) · **32** (input, button, toolbar, sidebar section header) · **36** (titlebar, tab strip, panel header, large button) · **48** (dialog header/footer, palette search).

*Rule R-1:* A vertical scan down any two adjacent panels must find shared beats. The sidebar's 28px rows and the auxiliary's 28px rows align by construction.

## 3.6 Whitespace

Whitespace is **allocated by importance**, and this allocation *is* the mission-centred mandate made visual (DD-1, DD-2, DD-3):

| Content | Gap between items | Horizontal padding | Line-height |
|---|---|---|---|
| **Mission timeline turns** | 12px | 16px | 180% |
| Docks | 8px | 12px | 150% |
| Review file rows | 4px | 8px | 138% |
| Session/mission rows | 2px | 8px | 138% |
| **File tree rows** | 0px | 6px | 130% |
| **Preview content** | 0px | 12px | 150% |

Read the first column top to bottom: 12 → 8 → 4 → 2 → 0. That gradient *is* the hierarchy. Nothing else is required to communicate it.

*Rule W-1:* Whitespace is never symmetric-for-beauty. Any increase in whitespace must be justified by an increase in the importance of what it surrounds.

## 3.7 Density

Target: **~36 addressable rows in a 1024px-tall sidebar**, up from ~28 today (S5), achieved *without removing anything*.

| Lever | Before | After | Rows gained |
|---|---|---|---|
| Tree row height | 32 | 28 | +4 |
| Tree row padding-x | 8 | 6 | — |
| Section header height | 36 | 32 | +1 |
| Toolbar height | 36 | 32 | +1 |
| Inter-row gap | 2 | 0 (tree) | +2 |

Density is bought back as calm by: muting secondary text one full step, using mono-variant file icons at rest (colour only on hover — existing `FileIcon` pair behaviour, preserved), and removing every hover effect except background.

*Rule D-1:* Density may never be purchased by deleting a label, a badge, a status dot or an affordance. Every capability in `baseline/capabilities-inventory.md` remains visible and reachable.

## 3.8 Hierarchy

The single, total ordering of visual weight in HeniossAI. Every component's type size, weight, colour and elevation must be consistent with its position here:

```
1  Mission timeline message content        14px / 440 / text-base   / 180% / E0 / gap 12
2  Composer input                          14px / 440 / text-base   / 143% / E1 elevated
3  Permission & Question docks             13px / 530 / text-strong / E1 + amber/info border
4  Mission (session) row title             14px / 530 / text-base   / E0 + 2px bar when active
5  Review tab + diff stats                 14px / 530 / text-base   / E0
6  Todo / Followup / Revert docks          13px / 440 / text-base   / E1
7  Context chips                           12px / 500 / text-base   / cobalt-faint fill
8  Panel & section headers                 14px / 530 / text-strong
9  Metadata (time, path, count)            12px / 440 / text-muted
10 File tree row name                      13px / 440 / text-muted   ← deliberately below metadata weight
11 Preview tab filename                    12px / 440 / text-muted
12 Preview body content                    12px mono / 440 / text-muted / 90% opacity
13 Group labels (TODAY, RECENT, FILES)     11px / 600 / uppercase / 0.6px / text-faint
```

*Rule H-1:* No component may be styled above its rank. If a new element needs prominence, it must be assigned a rank here first.
*Rule H-2:* Rank 10 sitting below rank 9 is intentional and is the most load-bearing decision in the document. A file name is less important than a timestamp on a mission, because the mission is the object (DD-1).

---

# 4. Color System

## 4.1 Governing philosophy

**Neutral carries structure. Chroma carries meaning. There is no decorative colour.**

Three consequences:
- The chrome is achromatic. Charcoal in dark, warm paper in light. Zero hue in backgrounds, borders or body text.
- One brand accent, spent only on interaction and AI-active states.
- Semantic hues appear only where they encode semantics, and always with a redundant non-colour signal (icon, text, badge letter) per DD-15.

**Why:** a dense IDE displaying syntax-highlighted code, coloured diffs, provider logos and project avatars is already colour-saturated *in its content*. If the chrome also carries colour, the content stops being readable. Achromatic chrome is what lets HeniossAI show more information than competitors while feeling calmer. (DD-5)

## 4.2 Primary palette — Neutral Stone

The structural spine of the product. Pure neutral: no blue tint in dark, warm paper in light.

| Token | Dark | Light | Contrast on base | Role |
|---|---|---|---|---|
| `--hds-bg-deep` | `#121214` | `#F8F8F5` | — | Frame |
| `--hds-bg-base` | `#18181B` | `#FCFCFB` | — | Field |
| `--hds-bg-layer-01` | `#1F1F22` | `#FFFFFF` | — | Object |
| `--hds-bg-layer-02` | `#262629` | `#F3F3F1` | — | Hover |
| `--hds-bg-layer-03` | `#2E2E31` | `#EBEBE8` | — | Selected |
| `--hds-text-strong` | `#F4F4F3` | `#171717` | 15.8 / 15.2 : 1 | Headings, active items |
| `--hds-text-base` | `#CBCBC8` | `#3A3A38` | 9.2 / 11.1 : 1 | Body, mission content |
| `--hds-text-muted` | `#8A8A87` | `#6F6F6C` | 5.8 / 5.2 : 1 | Secondary, file names |
| `--hds-text-faint` | `#5E5E5B` | `#9A9A96` | 4.6 / 4.6 : 1 | Metadata, group labels |
| `--hds-text-weak` | `#3E3E3B` | `#C7C7C3` | — | Disabled, watermark |

**Why these exact values (all inherited unchanged from S5 and already present in `hds.css`):**
- `#121214` not `#000000`: pure black on OLED produces smearing on scroll and makes 1px borders invisible. A 7% lift keeps hairlines legible.
- `#FCFCFB` not `#FFFFFF`: pure white at 1000+ nits for 8 hours is fatiguing. A 1% warm cast reads as paper, differentiates from every cold-grey competitor (DD-11), and preserves AAA text contrast.
- Only 22 lightness points from deepest to lightest surface: large jumps make an interface look like a web dashboard. Small jumps plus explicit borders make it look like an instrument.
- Five text steps, but only two are for reading (`strong`, `base`). The rest are for recession. Never use `faint` for anything a user must read to complete a task.

## 4.3 Secondary palette — Henioss Cobalt (Interactive)

| Token | Value | Applied to |
|---|---|---|
| `--hds-interactive-base` | `#2A5FFF` | Primary button fill, focus ring, active 2px bar, active tab underline, active spine segment, live caret |
| `--hds-interactive-hover` | `#1F4DE8` | Primary button hover |
| `--hds-interactive-active` | `#1A42C7` | Primary button pressed |
| `--hds-interactive-faint` | `rgba(42,95,255,.12)` dark / `.08` light | Selected mission row fill, context chip fill |
| `--hds-interactive-weak` | `rgba(42,95,255,.08)` dark / `.05` light | Selected file row fill, chip border |

**Why cobalt, and why only cobalt:**
- `#2A5FFF` is a true blue with high chroma and no violet lean. Violet-leaning blues are the dominant signature of the current AI-product wave; avoiding violet is a direct DD-11 requirement.
- It reaches ≥4.6:1 against both `#18181B` and `#FCFCFB` — one accent value serves both themes with no per-theme fork. Fewer tokens, fewer bugs, identical brand across themes (DD-8).
- Rationing is the point. When the *only* chromatic element on screen is the cobalt spine segment, the user's eye goes to the AI's current work without being told.

*Rule C-1:* Cobalt never appears on a non-interactive, non-AI-active element. No cobalt headings, no cobalt icons at rest, no cobalt borders for decoration.

**Weight ladder (DD-1/DD-2 enforcement):** selected *mission* row = `interactive-faint` fill + 2px solid bar. Selected *file* row = `interactive-weak` fill + 2px bar. The mission is visibly the stronger selection.

## 4.4 Accent palette — Mission & Project Identity (6 desaturated hues)

Used **only** for `ProjectAvatar` and `SessionTabAvatar`. Never for buttons, borders, text or states.

| Hue | Bg dark | Text dark | Bg light | Text light |
|---|---|---|---|---|
| Pink | `#2A1F26` | `#E8A8C8` | `#FDF0F6` | `#B01A6B` |
| Mint | `#1F2624` | `#8ED8C3` | `#E6FBF3` | `#147D6F` |
| Orange | `#29221F` | `#E3A070` | `#FEF3EB` | `#C05300` |
| Purple | `#25212A` | `#C2A8E8` | `#F5F0FD` | `#8445BC` |
| Cyan | `#1F2628` | `#8ACED8` | `#E6F8FB` | `#0A7A8A` |
| Lime | `#232A1F` | `#A8C86A` | `#EFF8E3` | `#5D770D` |

**Why:** the runtime already assigns one of six colours per project (S1 §12) — this is existing, deterministic behaviour we must not change (DD-4). What we change is *saturation*. Backgrounds are near-neutral (≈8% chroma), text is the only carrier of hue. Result: a 28px avatar gives instant project recognition at a glance, but twelve avatars in a list produce no colour noise. This is the one place warmth enters the product, and it is the one place it belongs — identity.

## 4.5 Semantic colors

Every semantic colour carries a mandatory redundant signal (DD-15).

### Success — `#3ECF4A` dark / `#17872D` light
Health dots, completed todos, added-lines badge `A`, "connected" state.
Redundant signal: check glyph or the letter `A`.
**Why:** desaturated from typical UI greens so it never competes with diff green in the same viewport.

### Warning — `#F5B83A` dark / `#A66A00` light
**Reserved almost exclusively for permission.** Also: modified-lines badge `M`, degraded server health.
Redundant signal: `alert-triangle` 16px + the word "Permission".
**Why:** amber is the only colour permitted to interrupt. Because HeniossAI uses it for essentially one thing, an amber border anywhere in the product means "the AI is waiting on you". That's an extremely valuable, learnable signal and it directly serves DD-9.

### Error / Critical — `#FF4D4D` dark / `#C81E1E` light
Failed loads, disconnected servers, deleted-lines badge `D`, destructive buttons.
Redundant signal: `alert-circle` icon + explicit message text + a **Retry** action. Never a bare red dot.
**Why:** S5's "every error has an explicit recovery action" rule is preserved and enforced at the colour level — red without a remedy is forbidden.

### Information — `#4DA6FF` dark / `#0F6ECD` light
Question docks, unseen-mission dots, informational toasts.
Redundant signal: icon + text.
**Why:** deliberately a *lighter, softer* blue than cobalt so it never competes with interactive state. Info is passive; cobalt is active. Placing them adjacent must never confuse "this is happening" with "you can click this".

### Diff colors (Review + timeline only)
| | Bg dark | Border | Text dark | Bg light | Text light |
|---|---|---|---|---|---|
| Add | `#153D1F` | `#2A7A3A` | `#3ECF4A` | `#E3F9E5` | `#17872D` |
| Delete | `#4A1515` | `#8A2A2A` | `#FF8A8A` | `#FCE8E6` | `#C81E1E` |
| Modify | `#4A3A15` | `#8A6A2A` | `#F5B83A` | `#FEF3C7` | `#A66A00` |

**Why:** diffs need a *background band* (line-level) plus *text* (token-level) plus a *sign* (`+`/`−`). Three redundant channels means diffs remain readable for deuteranopic users and in greyscale printouts.

*Rule C-2:* Diff colours appear only in the Review panel and timeline diff blocks. File-tree kind badges use the semantic text colour at 11px with a 20%-opacity fill — never the full diff band.

## 4.6 Background system (composition rules)

| Region | Surface | Rationale |
|---|---|---|
| Titlebar, activity rail, status bar | `bg-deep` | Frame recedes; content advances |
| Sidebar, main column, auxiliary, preview, terminal | `bg-base` | All content fields are peers — the eye is directed by *weight*, not by surface |
| Cards, docks, composer, dialogs, popovers, menus, toasts, inputs | `bg-layer-01` | Objects lift off fields |
| Modal scrim | `bg-overlay` (dark `rgba(24,24,27,.6)`, light `rgba(252,252,251,.7)`) + `blur(12px)` | The only glass in the product |

**Why every content field shares one surface:** the alternative — a darker sidebar, a lighter main area, a mid-tone auxiliary — is the standard editor convention and it hard-codes a hierarchy in the wrong place. HeniossAI's hierarchy lives in typography and elevation. Uniform fields let that hierarchy be legible, and they make the panel seams (1px hairlines) the visible structure. This is the clearest single break from editor convention (DD-11) and the clearest expression of DD-1.

## 4.7 Surface system quick reference

| Need | Use |
|---|---|
| A panel | `bg-base` + 1px `border-base` on the shared edge |
| A thing inside a panel | `bg-layer-01` + 1px `border-base` + `shadow-xs` + `radius-8` |
| A row that can be hovered | transparent → `bg-layer-02` on hover |
| A row that is selected | `bg-layer-03` *or* `interactive-faint` + 2px cobalt bar + `text-strong` |
| A floating thing | `bg-layer-01` + 1px `border-base` + `shadow-md` + `radius-8` |
| A modal thing | scrim + `bg-layer-01` + 1px `border-base` + `shadow-lg` + `radius-12` |

## 4.8 Theme parity

Dark is the primary authoring target (DD-8). Light is not a filter — it is authored, and it must satisfy:
- Identical token *names*, identical component structure, identical geometry. Only values differ.
- Contrast parity: every pair meets or exceeds the dark equivalent.
- Shadows in light use `rgba(0,0,0,.08)` layered (already in `theme.css`); in dark they use `rgba(0,0,0,.15–.25)`. Never invert to a light "glow".
- Cobalt is identical in both. One brand colour, no theme fork.
- The existing 35-theme / 13-scale-family system (S3 §43) is untouched. HDS tokens map onto it; user themes continue to work exactly as today (DD-4, `{I-BACKWARD}`).

---

# 5. Typography

## 5.1 Families

| Role | Family | Fallback stack | Rationale |
|---|---|---|---|
| **UI** | **Inter** (already loaded, TTF 100–900) | `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif` | Already in the asset atlas (S3 §39) so adopting it costs zero bytes and zero new deps `{I-NO-DEPS}`. Inter's tall x-height and open apertures keep 12–13px legible on Windows at 100% scaling, which is where most of this product's density lives. Its numeric alignment (tabular via `tnum`) matters for token meters, diff stats and timestamps. |
| **Mono** | **JetBrains Mono** (already loaded, WOFF2) | `ui-monospace, SFMono-Regular, Menlo, Monaco, "Liberation Mono", monospace` | Already loaded. Designed for long code reading: tall x-height, distinct `l/1/I`, `0` with a dot, and — critically — a 600-unit width that keeps a 120-column diff inside a 360px review panel at 12px. |
| **Display** | Inter, `-0.16px` tracking | — | We deliberately do **not** introduce a display face. A third family is a new asset, a new load, a new failure mode, and — for an instrument — an affectation. Dialog titles are simply Inter 16/500 with tightened tracking. |

*Rule T-0:* Inter never renders code. JetBrains Mono never renders UI prose. Zero exceptions, including inline code inside markdown (mono) and file paths inside chips (Inter — because a chip is UI, not code).

**Font features:** `ss01` (alternate `a`/`g`) and `cv05` enabled on Inter for legibility at small sizes; `tnum` enabled on any numeric readout (timestamps, diff stats, token counts, todo progress) so digits do not jitter as they update during streaming. This last point is a genuine quality signal — non-tabular figures in a live counter make an interface look amateur.

## 5.2 Scale

Seven UI steps, three mono steps. **No other sizes may exist.**

| Token | Size | Line | Weight | Tracking | Use |
|---|---|---|---|---|---|
| `hds-text-11-upper` | 11px | 14px | 600 | +0.6px, uppercase | Group labels only: `TODAY`, `RECENT`, `FILES — SECONDARY TOOL`, `MISSIONS`, kind badges |
| `hds-text-12` | 12px | 16px (133%) | 440 | 0 | Metadata, timestamps, paths, tooltips, keybinds, preview tab filename |
| `hds-text-13` | 13px | 18px (138%) | 440 | 0 | Secondary body, descriptions, **file tree names**, menu items, small buttons |
| `hds-text-13-med` | 13px | 18px | 530 | 0 | Dock headers, model names, section strong labels, normal buttons |
| `hds-text-14` | 14px | 20px (143%) | 440 | 0 | **Primary body**, composer input, project names, palette result titles |
| `hds-text-14-med` | 14px | 20px | 530 | 0 | **Mission row titles**, panel headers, Review tab, diff stats |
| `hds-text-16` | 16px | 24px (150%) | 500 | −0.16px | Dialog titles, empty-state headlines, palette search field |
| `hds-mono-12` | 12px | 18px | 400 | 0 | Preview body, inline code, permission pattern, tool JSON |
| `hds-mono-13` | 13px | 20px | 400 | 0 | Timeline code blocks, **Review diff** |
| `hds-mono-14` | 14px | 22px | 400 | 0 | Terminal (xterm), open-file editor view |

**Special case — mission message content:** 14px at **180% line-height (25px)**. This is the only 180% value in the product and it is the typographic core of DD-1/DD-2. Model output is long-form reading; 143% is correct for a UI label and wrong for four paragraphs of reasoning. The extra leading is what makes the timeline feel like a document rather than a log.

## 5.3 Weight strategy

Only three weights: **440** (regular), **530** (medium), **600** (uppercase labels only).

**Why 440 and 530, not 400 and 500:** Inter's variable axis lets us pick optical weights. At 13px on dark backgrounds, 400 renders thin and 500 renders indistinct from 400 after subpixel antialiasing. 440/530 restores a *visible* one-step contrast at small sizes on both themes without introducing a third reading weight. These values are already declared in `hds.css`.

*Rule T-1:* Weight change is the primary emphasis device. Colour change is second. Size change is last. Never combine all three.
*Rule T-2:* 600 exists only for 11px uppercase labels, where the extra weight compensates for the small size and wide tracking.
*Rule T-3:* Bold is never used for running text, including inside markdown output — markdown `**bold**` renders at 530, not 700.

## 5.4 Hierarchy in practice

| Element | Token | Colour |
|---|---|---|
| Dialog title | `text-16` | `text-strong` |
| Panel / section header | `text-14-med` | `text-strong` |
| **Mission row title** | `text-14-med` | `text-base` |
| **Mission message body** | `text-14` @180% | `text-base` |
| Composer input | `text-14` | `text-base` |
| Composer placeholder | `text-14` | `text-faint` |
| Assistant model label | `text-13-med` | `text-base` |
| User turn label `YOU` | `text-11-upper` | `text-muted` |
| Dock header | `text-13-med` | `text-strong` |
| Dock body | `text-13` | `text-base` |
| Review tab trigger | `text-14-med` | `text-base` (active `text-strong`) |
| Preview tab trigger | `text-12` | `text-muted` |
| Button (normal / small) | `text-13-med` / `text-12-med` | per variant |
| Menu item | `text-13` | `text-base` |
| Keybind suffix | `text-12` | `text-muted` |
| **File tree name** | `text-13` | **`text-muted`** |
| Metadata / timestamp | `text-12` | `text-faint` |
| Group label | `text-11-upper` | `text-faint` |

The two rows in bold are the entire mission-centred thesis. A mission title is 14/530 in `text-base`. A file name is 13/440 in `text-muted`. Roughly a 40% perceived-weight difference, achieved with two token swaps and zero runtime change (DD-1, DD-3, DD-4).

## 5.5 Spacing & readability

- **Paragraph spacing:** 0. Line-height carries rhythm. Markdown `<p>` gets `margin-block: 8px` only inside timeline and preview prose.
- **Measure:** mission timeline content is capped at **72ch (~960px)** and centred on ultra-wide; preview prose at **68ch (~768px)**. Beyond ~75 characters the eye loses the line return — the single most common readability failure in wide AI interfaces.
- **Truncation:** single-line ellipsis for names and paths, with the **full value in a tooltip, always**. Middle-truncation for paths in context chips (`src/…/jwt.ts`) so both the meaningful head and the filename survive.
- **Selection:** `user-select: none` on chrome; `select-text` on inputs, code, timeline content and preview — the existing rule in `layout-new.tsx`, preserved.
- **Minimum size:** 12px for anything readable. 11px only for uppercase labels, where cap-height and tracking preserve legibility.
- **Zoom:** px is retained for stability (S5). The existing Tauri `titlebarZoom` counter-zoom is untouched. A future rem migration is documented but explicitly **out of scope** for V1.

---

# 6. Iconography

## 6.1 Philosophy

**Icons are punctuation, not illustration.** They accelerate recognition of a known action; they never explain a new concept. If a user needs an icon explained, the icon is wrong — use a label.

Three consequences:
1. Every icon-only control has a tooltip carrying its label **and** its keybind (DD-6, DD-9).
2. No icon is ever the sole carrier of state (DD-15). State = icon + colour + text.
3. No icon is decorative. Empty states get exactly one 24px icon; nothing else in the product gets an icon that isn't clickable or state-bearing.

## 6.2 Systems (unified, not replaced)

| System | Count | Status |
|---|---|---|
| `HdsIcon` (wrapper over existing `IconV2`, Lucide-derived) | 35+ | **The one UI icon system** (DD-7) |
| `Icon` (legacy) | 30 | Deprecated. Frozen. Migrated component-by-component. Never used in new code. |
| `FileIcon` (sprite) | ~700 | Preserved unchanged — specialised, language-aware, dual colour/mono variant |
| `ProviderIcon` (sprite) | ~100 | Preserved, rendered at 90% saturation in dark theme |
| `AppIcon` | 15 | Preserved |

`HdsIcon` is a *wrapper*, not a rewrite: it constrains size and stroke and forwards to `IconV2`. Additive, zero behavioural change (DD-10, `{I-BACKWARD}`, `{I-NO-DEPS}`).

## 6.3 Stroke & geometry

- **Stroke: 1.5px, absolute, non-scaling.** A 24px icon still draws at 1.5px, never 2.25px. Scaling stroke with size is the most common way an icon set stops feeling like a set.
- **Grid:** 24px design grid, 2px safe margin, 20px live area.
- **Terminals:** round caps, round joins — matches Inter's humanist curves; square caps would read as engineering-CAD and fight the type.
- **Style:** outline only. Filled shapes exist for exactly two things: status dots (8px circles) and the todo checkbox check.
- **Colour:** `currentColor`. Always. No multi-colour UI icons. (Sprite systems excepted.)

## 6.4 Sizes

| Size | px | Use |
|---|---|---|
| `xs` | 12 | Chevrons, close-small, chip icons, keybind glyphs, tree chevron |
| `sm` | 16 | **Default.** Toolbars, buttons, menu items, file icons, tab icons |
| `md` | 20 | Dialog header icons, activity rail icons |
| `lg` | 24 | Empty states, welcome |

*Rule I-1:* An icon's size is set by its container, not by its importance. All 28px rows use 16px icons. All 24px controls use 12px icons.

## 6.5 Consistency rules

1. **Pairing:** icon 16 + 8px gap + label 13. Never 6px, never 10px.
2. **Optical centring:** the icon centres on the label's *x-height midpoint*, not the line box.
3. **One concept, one icon, product-wide.** `chevron-right` is always "expand". `plus` is always "create". `x` is always "dismiss this one thing". No synonyms.
4. **Never rotate to mean something new.** Chevron rotation encodes expand/collapse only.
5. **No badges on icons** except the existing 8px notification dot at `top-right -2px`.
6. **Loading replaces in place:** a 16px spinner occupies the exact box of the 16px icon it replaces. No layout shift.
7. **Disabled** = 60% opacity, never a different glyph.

## 6.6 Usage map (mission-weighted per DD-2)

| Context | Treatment |
|---|---|
| **AI-state icons** (permission triangle, todo checkbox, model/provider glyph, working spinner) | 16px, full colour weight, never shrunk |
| Activity rail | 20px, `text-muted` at rest → `text-strong` when active + 2px cobalt bar |
| Primary toolbar | 16px, `text-muted` → `text-base` on hover |
| Tree chevrons | 12px, `text-faint` — deliberately the quietest icons in the product |
| File icons | 16px, **mono variant at rest**, colour variant on hover/active (existing behaviour, preserved) |
| Preview tab icon | 12px, `text-muted` |
| Empty states | 24px, `text-faint` |
| Status dots | 8px filled circle + adjacent text + tooltip |

Note the deliberate inversion: the AI's state icons are the largest and most saturated; the file system's icons are the smallest and greyest. Same rule as typography, applied to glyphs. (DD-1, DD-3)

---

# 7. Motion System

## 7.1 Philosophy

**Motion answers three questions and nothing else:** *Where did it go?* (orientation) · *Did that register?* (feedback) · *What follows what?* (continuity).

Any animation that answers none of these is deleted. Motion never entertains. Motion never delays. Motion is never the reason something takes longer than it needs to.

Everything in this section already exists in the codebase (S3 §42, `hds.css`). This blueprint **standardises** what is there; it introduces no new animation engine, no new dependency, no JS animation loop. (DD-4, DD-14, `{I-NO-DEPS}`)

## 7.2 Duration & easing tokens

| Token | Value | Easing | Applied to |
|---|---|---|---|
| `--hds-motion-fast` | **120ms** | `ease-out` | Hover background, opacity, tooltip fade, focus ring, colour change |
| `--hds-motion-normal` | **160ms** | `ease-out` | Chevron rotation, micro-interactions, tab close, icon morph |
| `--hds-motion-slow` | **180ms** | `ease-in-out` | Dialog fade + scale, backdrop, menu fade, palette entry |
| `--hds-motion-panel` | **240ms** | `cubic-bezier(0.22,1,0.36,1)` | **Signature.** Panel width/height, dock slide-in, drawer |
| `--hds-motion-spring` | ~400ms | existing `useSpring` | Todo progress only |

**Why 240ms with `cubic-bezier(0.22,1,0.36,1)`:** this curve is already the app's panel easing (S1, `layout-new.tsx`). It is a strong ease-out with a near-instant departure and a long, decelerating settle — the motion of something *heavy and well-damped*. It reads as mass, which reads as quality, and it makes a panel opening feel deliberate instead of springy. It is HeniossAI's motion signature and it is used for every structural movement in the product. Changing it would be a regression.

*Rule M-1:* No duration outside this table. No 200ms, no 300ms, no 500ms. This is lint-enforced.
*Rule M-2:* `ease-in` alone is never used — it makes UI feel sluggish to start.

## 7.3 Transitions

| Event | Specification |
|---|---|
| **Panel open/close** | `width`/`height` 240ms signature, `will-change: width`, `motion-reduce:transition-none`. **No transition while dragging** — resize is 1:1 with the pointer, always. |
| **Dialog open** | Backdrop opacity 0→1 180ms; container opacity 0→1 + `scale(0.98→1)` 180ms, origin centre |
| **Dialog close** | Reverse, 120ms (exits are faster than entrances — a closing thing must not feel like it's resisting) |
| **Command palette** | 180ms fade + `translateY(8px→0)` |
| **Menu / popover** | 120ms fade + `scale(0.96→1)`, `transform-origin` at the trigger corner |
| **Tooltip** | 120ms fade, 800ms open delay, **0ms close** |
| **Hover** | `background-color` 120ms. Nothing else. No transform, no shadow, no size. |
| **Focus ring** | 120ms `box-shadow`. Never disabled, including under reduced-motion. |
| **Tab switch** | **Instant.** Content swaps with zero transition. Any crossfade here reads as lag. |
| **Timeline append** | **No animation.** New content appears; the virtualizer auto-follows within the existing 80px threshold. Animating streamed content is nauseating and fights the virtualizer. |
| **Dock enter** | `translateY(8px→0)` + fade, 240ms signature. Docks are the AI asking for attention — they get the signature curve. |
| **Dock exit** | Fade 120ms + height collapse 160ms |
| **Tree expand** | Chevron rotate 160ms; children `fade-up` 120ms via the existing `fadeUp` keyframe |
| **Row archive** | Fade 160ms then height collapse 200ms |

## 7.4 Continuous animations (all existing, all preserved)

| Animation | Duration | Meaning |
|---|---|---|
| Spinner | 1s linear | Work in progress |
| **Streaming caret** | 1s `pulse-opacity` | **The AI is generating right now** |
| `pulse-opacity` / `pulse-scale` | 2s / 1.2s | Splash, subtle attention |
| Permission-icon pulse | 2s, very low amplitude | Unanswered permission request |
| Titlebar update loader | 0.67s linear | Update installing |
| Todo progress | `useSpring` | Progress advanced |

*Rule M-3:* At most **one** continuous animation may be visible in a given panel. If the timeline is streaming (caret) and a tool is running (spinner), the spinner sits inside a tool card — different panel-region, permitted. Two competing pulses in one region is a defect.

## 7.5 Interaction feedback

| Interaction | Response |
|---|---|
| Button press | `scale(0.98)`, 80ms — the only transform-on-interaction in the product |
| Icon button press | icon `scale(0.92)`, 80ms |
| Row click | `bg-layer-03` on `:active`, instant |
| Resize handle hover | 4px handle reveals a 2px cobalt interior after 120ms; hit area is 12px |
| Drag (tabs) | ghost at 30% opacity; drop target shows a 2px cobalt insertion line |
| Copy action | icon morphs to a check for 160ms + toast top-right |
| Submit prompt | send button → stop button, instant swap, no morph |
| Invalid / blocked | **No shake.** Disabled state at 60% opacity + tooltip explaining why. Shake is a punishment animation and this product does not punish. |

## 7.6 Reduced motion

`@media (prefers-reduced-motion: reduce)`:
- All `transition` and `animation` → `none`, product-wide.
- Spinners → a static 60%-opacity glyph.
- Streaming caret → **solid, non-blinking** cobalt bar (presence preserved, motion removed — this matters; the caret is a state indicator, not decoration).
- Panels open/close instantly.
- **Focus rings remain fully animated/visible.** Never suppressed. (DD-15)

## 7.7 Runtime compatibility guarantee

| Existing runtime behaviour | Guarantee |
|---|---|
| Virtualizer (`overscan 50`, `anchorTo end`, `followOnAppend`, `threshold 80`, `paddingEnd 64`) | No animation is applied to virtualized rows. Untouched. |
| Prepend-anchor RAF loop (30 stable frames) | No CSS transition on the scroll container. Untouched. |
| `useSpring` todo dock | Preserved exactly. |
| Panel `will-change: width` | Preserved. |
| Per-file preview scroll restore (`queueMicrotask`) | No transition on the preview scroll container. Untouched. (DD-12) |
| Terminal xterm rendering | Zero CSS animation inside the terminal region. |

---

# 8. Component Language

Visual specification only. No implementation. Every component maps to an existing component in the S2 inventory of 202 — nothing new is invented (DD-10).

## 8.1 Buttons

Seven variants (existing, preserved), three sizes, six states.

| Variant | Resting | Hover | Active |
|---|---|---|---|
| **Primary** | `interactive-base` fill, white text | `interactive-hover` | `interactive-active` + `scale(.98)` |
| **Secondary** | `bg-layer-01`, 1px `border-base`, `text-base` | `bg-layer-02` | `bg-layer-03` |
| **Ghost** | transparent, `text-base` | `bg-layer-02` | `bg-layer-03` |
| **Ghost-muted** | transparent, `text-muted` | `bg-layer-02`, `text-base` | `bg-layer-03` |
| **Neutral** | `bg-layer-02`, `text-base` | `bg-layer-03` | `bg-layer-03` |
| **Contrast** | `text-strong` fill, `bg-base` text | 90% opacity | 85% |
| **Destructive** | `critical` fill, white text | darken 8% | darken 14% |

Sizes: **small** 28px / `text-12-med` / px-8 · **normal** 32px / `text-13-med` / px-12 · **large** 40px / `text-14-med` / px-16.
Icon buttons: **24** (icon 12) · **28** (icon 16) · **32** (icon 16).
Radius **6px**. Focus: 2px cobalt ring, offset 1px. Disabled: 60% opacity, `not-allowed`. Loading: spinner replaces the leading icon; **label stays**; width does not change.

*Rule Btn-1:* One primary button per view region. If two actions look equally primary, one of them isn't.
*Rule Btn-2:* Icon-only buttons always carry a tooltip with label + keybind. (DD-6)

## 8.2 Inputs

Height **32px** (28px compact in toolbars). `bg-layer-01`, 1px `border-base`, radius **6px**, padding `8px 12px`, `text-13`, placeholder `text-faint`.
Focus: `border-focus` + 2px cobalt ring (the existing `shadow-xs-border-focus`). Error: `critical` border + 12px message below. Disabled: `bg-base`, `text-weak`.
Search variant: 16px magnifier at 8px left, 32px left padding, clear `x` right (visible only when non-empty).
Composer contenteditable: no visible border of its own — the composer *card* carries the border, and focus lifts the card's border to cobalt. The input and its container are one object.

## 8.3 Panels

Structure: optional 32–36px header (`text-14-med` `text-strong`, 1px `border-weak` beneath) → `flex-1` scroll region → optional footer.
Surface `bg-base`. Separated from neighbours by 1px `border-base` + a 4px `ResizeHandle` (12px hit area).
Padding: 8px dense (sidebar), 12px comfortable (auxiliary).
Collapsible sections: 32px header, 12px chevron + label, hover `bg-layer-02`, radius 4px.

*Rule P-1:* A panel is never elevated and never rounded. Panels are architecture; only objects float.

## 8.4 Cards

`bg-layer-01`, 1px `border-base`, radius **8px**, `shadow-xs`, padding **12px**, internal gap 8px.
Used for: tool calls, docks, review diff containers, settings groups.
Header row: 16px icon + `text-13-med` + right-aligned metadata (`text-12` `text-faint`).
Nested code: `bg-layer-02`, radius 6px, padding 8px, `mono-12`.

*Rule Cd-1:* Cards never nest. Never hover-lift. Never carry a coloured background — colour enters only via a semantic **border** (permission amber, question info).

## 8.5 Trees

Row **28px**, indent **8 + 12×level** (existing, preserved), radius 4px, padding-x 6px.
Composition: 12px chevron (folders) → 16px file icon (mono variant) → 4px gap → `text-13` `text-muted` name → optional 11px kind badge right.
States: hover `bg-layer-02` + `text-base` + icon switches to colour variant · selected `interactive-weak` + 2px cobalt bar + `text-strong` · loading 12px spinner in the chevron slot · ignored 60% opacity.
Kind badges: 16px tall, radius 4px, `text-11-upper`, semantic text on a 20%-opacity fill — `A` success, `M` warning, `D` critical.
Virtualization is untouched (`@tanstack/solid-virtual`, `MAX_DEPTH 128`).

## 8.6 Tabs

Three tab species, deliberately different weights:

| Species | Height | Type | Active marker |
|---|---|---|---|
| **Mission tabs** (titlebar) | 28 in a 36 strip | `text-13` + 16px icon | `bg-layer-02` + 2px cobalt bottom border + `text-strong` |
| **Auxiliary primary tabs** (Review / Context) | 36 | `text-14-med` | 2px cobalt bottom border + `text-strong` |
| **Secondary tabs** (Preview files, Terminal, Open Files) | 32 | `text-12` `text-muted` | 2px cobalt bottom border + `text-base`, no fill |

The three-tier tab weighting *is* DD-1/DD-3 at the navigation level: missions read loudest, artifacts next, files quietest.
Close `x` 12px, visible on hover/active. Overflow → existing `TabPopover`. Drag reorder → existing `@dnd-kit`, ghost at 30%, 2px cobalt insertion line.

## 8.7 Dialogs

Scrim: `bg-overlay` + `blur(12px)`, 180ms fade.
Container: `bg-layer-01`, 1px `border-base`, radius **12px**, `shadow-lg`, `max-height: 80vh`.
Widths: small 400 · medium 600 · large 900 · x-large 1100 · full.
Header 48px: `text-16` `text-strong` left, 28px ghost close right, 1px `border-weak` below.
Content: 16px padding (24px for settings rows), scrolls independently.
Footer 48px: 1px `border-weak` above, right-aligned, 8px gap, secondary then primary.
Focus trap, Escape, backdrop-click, focus restore — existing Kobalte behaviour, untouched.

## 8.8 Menus

`bg-layer-01`, 1px `border-base`, radius **8px**, `shadow-md`, padding 4px, min-width 160, max-width 320.
Item: 28px, padding-x 8px, radius 4px, 16px icon + 8px gap + `text-13` + right-aligned `text-12` `text-muted` keybind.
Hover `bg-layer-02` · active `bg-layer-03` · disabled 60% · destructive `critical` text with a `critical`-tinted hover.
Separator: 1px `border-weak`, 4px vertical margin.
Submenu: 12px chevron right, opens on hover after 200ms.
**Opaque — no blur.** (§2.2 Refinement 2)

## 8.9 Tooltips

`bg-deep` (the only inverted surface in the product), `text-strong`, `text-12`, padding `4px 8px`, radius 6px, `shadow-xs`, max-width 280.
Keybind suffix: `text-12` at 70% opacity, 8px gap, rendered as plain glyphs (`⌘⇧E`) — no key-cap chrome.
Placement: right on desktop, bottom on mobile. Open delay 800ms, close 0ms. Fade 120ms.
No arrow. No blur.

*Rule Tt-1:* Every icon-only control has one. Every truncated string has one. Nothing else does. Tooltips on already-labelled controls are noise.

## 8.10 Scrollbars

Width **8px** (10px hit area). Track transparent. Thumb `border-strong`, radius `full`, 2px inset. Hover: thumb lightens one step. No arrow buttons. No track border. Overlay-style: content is not inset by the scrollbar.
Existing scroll-fade masks (`home-projects-fade`, S3 §42) preserved.

## 8.11 Toasts

`bg-layer-01`, 1px `border-base`, radius **8px**, `shadow-lg`, padding 12px, width 360 max, 8px gap when stacked.
Composition: 16px semantic icon → `text-13-med` title → optional `text-13` `text-muted` description → optional ghost action → 12px close.
Variant is carried by the **icon colour only** — no coloured fills, no coloured left bars.
Position: top-right desktop, bottom mobile (existing). Enter: 240ms signature slide from the right + fade. Exit: 120ms fade. Auto-dismiss 5s; persistent variants never auto-dismiss.

## 8.12 Timeline messages

The centre of the product. Column max-width **72ch**, centred, horizontal padding 16px, **12px gap between turns**.

**The Spine:** a 1px vertical rule at the column's left margin (`border-base`), running continuously through the whole timeline. The segment beside the currently-streaming turn is `interactive-base` and fades back to `border-base` on completion (240ms). It is one absolutely-positioned pseudo-element on the timeline container plus a modifier on the active turn — pure CSS, zero runtime coupling.

**User turn:** `YOU` in `text-11-upper` `text-muted`, timestamp `text-12` `text-faint` right-aligned; content `text-14` `text-base` at 180%. No background, no bubble, no border, no avatar.

**Assistant turn:** model name in `text-13-med` `text-base`; content `text-14` `text-base` at 180% with full markdown; streaming shows a 1px × 16px cobalt caret pulsing 1s at the insertion point.

**Tool call:** E1 card. Header: 16px icon + `text-13-med` tool name + status (spinner / green check / red alert) + right-aligned duration `text-12` `text-faint`. Body: input `mono-12` on `bg-layer-02` radius 6; output likewise; diffs render as full `FileVisual` blocks with a 40px line-number gutter, `mono-13`, banded add/delete rows. Collapsed state is a single 28px header row with a chevron.

**Docks** (Permission / Question / Followup / Todo / Revert): E1 cards stacked above the composer, 8px gap.
- *Permission* — 1px `warning` border, 16px amber triangle, `text-13-med` "Permission requested", `mono-12` pattern block, footer `Deny` ghost / `Allow always` secondary / `Allow once` primary. **Always rendered topmost of the stack.** (DD-9)
- *Question* — 1px `info` border, "Question X of Y" in `text-11-upper`, options as 32px selectable rows.
- *Todo* — no semantic border; `AnimatedNumber` progress `3/5` in `text-13-med`, 16px checkboxes, completed items struck through and muted.
- *Followup* / *Revert* — collapsible, count + preview + chevron.

**Composer:** the most elevated object in the product. `bg-layer-01`, 1px `border-base`, radius **12px**, `shadow-xs-border-base`, padding 12px, min-height 72, max-height 240. Focus-within lifts the border to cobalt and swaps to `shadow-xs-border-focus`.
Stack: image attachments (40px thumbs) → context chips → contenteditable → action row.
**Context chips:** 24px, radius `full`, `interactive-faint` fill, 1px `interactive-weak` border, 12px file icon + `text-12` (500) middle-truncated path + `text-12` `text-muted` line range + 12px `x`. The cobalt tint is deliberate: these are the AI's explicit inputs, and the accent says "this is live". (DD-9)
Action row: provider glyph 16 + model `text-13-med` + chevron · agent selector · right: shell toggle (ghost) + 32px cobalt primary send. While working the send becomes a stop square, instantly.

## 8.13 Review

`text-14-med` tab. Stats line: `text-14-med` "3 files changed" with `+45` in `success` and `−12` in `critical`, tabular figures. 28px filter input. File rows 28px with icon + `text-13` path + kind badge. Diff viewer at **full opacity**, `mono-13`, 40px right-aligned line-number gutter in `text-faint`, banded add/delete backgrounds with `+`/`−` signs.

## 8.14 Context

Stat grid, 2 columns: label `text-11-upper` `text-faint` over value `text-14-med` `text-strong`.
Token meter: 8px-tall segmented bar, radius `full`, one desaturated hue per segment type, 8px legend dots + `text-12` labels beneath. **The only place a multi-hue element is permitted in the chrome** — because it is a data visualisation, not decoration.
System prompt: markdown in a collapsed accordion. Raw messages: accordion, `mono-12`.

## 8.15 Explorer

Back row 32px: 12px chevron-left + `text-13` "All Projects".
Project header 32px: 16px folder icon + `text-14-med` name + 20px project avatar.
Toolbar 32px: 28px filter input + three 24px ghost icon buttons.
Tree per §8.5.
**Footer label:** `text-11-upper` `text-faint` — `FILES — SECONDARY TOOL` — with a tooltip: *"Files appear when the mission needs them ⌘⇧E."* This single label does more DD-3 work than any amount of restyling: it *tells* the user the product's model of itself.

## 8.16 Preview

Tab bar **32px** (vs Review's 36) — `bg-base`, 1px `border-weak` below. Tab: 12px file icon + `text-12` `text-muted` filename + 10px close. Active: `text-base` + 2px cobalt bottom border.
Content at **90% opacity**, `mono-12` for text/code, prose styling for markdown, images centred with radius 8 + `shadow-xs`, PDF embedded with an "Open externally" secondary button.
States: empty (24px icon + `text-13` `text-muted` "No file selected") · loading (16px spinner + "Loading preview…") · error (16px critical icon + message + **Retry** secondary) · binary (icon + `mono-12` path).
Per-file scroll restore untouched. (DD-12)

## 8.17 Universal state contracts

Every component in the product implements these identically. This is what makes 202 components feel like one product.

**Empty:** centred column · 24px `text-faint` icon · 8px · `text-14-med` `text-strong` title · 4px · `text-13` `text-muted` description (max 44ch) · 12px · primary action button.
**Loading:** 16px spinner + 8px + `text-13` `text-muted` "Loading…". Skeletons only for timeline history (where final height is known).
**Error:** 16px `critical` icon + 8px + `text-13` `critical` message + 12px + **Retry** secondary button. No error without a remedy.
**Six interaction states, everywhere:** default · hover (`bg-layer-02`) · active (`bg-layer-03` + `scale(.98)` for buttons) · focus-visible (2px cobalt ring) · disabled (60%, `not-allowed`) · selected (`interactive-faint` + 2px cobalt bar + `text-strong`).

---

# 9. Screen-by-Screen Design

Each screen: layout (unchanged), visual treatment (changed), hierarchy, states. **No screen is invented, moved, added or removed.** (DD-10)

## 9.1 Welcome / First Launch

**Layout (unchanged):** titlebar 36 · activity rail 48 · sidebar 240 · main (empty state) · auxiliary closed · status 24.

**Visual:** main canvas is a wide, quiet `bg-base` field. The shield monogram sits behind everything as a **3% opacity outlined watermark**, large, off-centre — texture, not logo placement. Centred 480px column: 24px `text-faint` icon → `text-16` `text-strong` "No active mission" → `text-13` `text-muted` "Select a mission from the sidebar, or start a new one." → row of primary **New Mission** + secondary **Open Project** → a 3-item recent list (`text-13` title + `text-12` `text-faint` time).
Sidebar shows `MISSIONS` with the full-width New Mission button and an empty hint. Provider tip (if no provider) floats bottom-centre as an E4 notice with a cobalt text link and a dismiss `x`.

**Hierarchy:** watermark (texture) → headline → primary CTA → recents.
**Why:** first impression must read *product*, not *tool with an empty file tree*. Directing the user to a **mission**, never to a folder, is DD-1 at the moment of first contact.
**States:** this state *is* empty — no skeletons. Health-check failure escalates to the existing full-screen ConnectionError.

## 9.2 Project Picker (`DialogSelectDirectoryV2`)

**Layout (unchanged):** medium dialog 600, path input on top, native tree below (`@pierre/trees`), footer actions.
**Visual:** E3 modal. Header 48 `text-16` "Open project". Path input 32px full-width with a 16px folder icon. Tree rows 28px, 12px chevrons, 16px mono folder icons, `text-13`; selected row gets `interactive-weak` + 2px cobalt bar. Footer: ghost **Cancel** + primary **Open**.
**States:** loading spinner inside the tree region · permission-denied error row with Retry · empty "No folders here".
**Why:** the picker is a *tool*, so it gets tool weight — tight, quiet, no illustration. Reusing the tree row spec exactly means zero new visual vocabulary.

## 9.3 Explorer

**Layout (unchanged):** sidebar 240 (200–600), back row → project header → toolbar → virtualized tree → secondary-tool footer label.
**Visual:** §8.15. The whole panel is deliberately the quietest field in the product: `text-13` `text-muted` names, `text-faint` chevrons, mono file icons at rest.
**Hierarchy:** project header (14/530 strong) → toolbar → tree (13/440 muted) → footer label (11 upper faint).
**States:** loading spinner + "Loading workspace files…" · error "Failed to load project files" + Retry · empty "Folder is empty" · filtered no-results empty state. All four exist today and keep their exact copy (S12).
**Why:** the file tree keeps 100% of its capability (all 19 items in `capabilities-inventory.md`) while ceding all visual weight to missions. Capability preserved, priority corrected. (DD-3)

## 9.4 Workspace — Draft / New Mission

**Layout (unchanged):** `NewSessionDesignView`, full-bleed centred composer.
**Visual:** the composer is the screen. 640px centred column on `bg-base` with the 3% shield watermark behind. Above the composer, a quiet meta row: project selector (`text-13-med` + chevron), workspace selector, git branch (12px icon + `text-12` `text-muted`). The composer is at its maximum elevation. Placeholder: *"What is next for this mission?"* Nothing else competes.
**Hierarchy:** composer → meta row → provider tip.
**Why:** the draft state is the purest statement of DD-2 — the product opens with an input for intent, not a file browser.
**States:** blank (submit at 60%) · has-content (submit active) · no provider (E4 tip) · submitting (input dims to 60%, send → stop).

## 9.5 Workspace — Active Mission

**Layout (unchanged):** titlebar · rail 48 · sidebar 240 · main flex-1 · auxiliary 360 · terminal (closed by default) · status 24.

**Visual:**
- *Sidebar:* `MISSIONS` grouped `TODAY` / `YESTERDAY` / `OLDER`; rows 28–32px with 16px avatar, `text-14-med` title, `text-12` `text-muted` description, `text-12` `text-faint` time, status dots; active row `interactive-faint` + 2px cobalt bar.
- *Main:* the Spine runs the full column. Turns at 12px gaps, 180% leading, 72ch measure. Tool cards E1. Docks stacked above the composer. Composer elevated at the bottom.
- *Auxiliary:* Review/Context at `text-14-med`; the Preview strip below at 32px/`text-12`/90% opacity, closed unless a file was opened.
- *Status bar:* branch · model · segmented context meter, all `text-12` `text-faint`.

**Hierarchy (visual weight budget):** timeline 60% · composer + docks 20% · Review/Context 15% · files/preview/terminal 5%.
**Why:** this is the daily screen and therefore the screen where DD-1/DD-2/DD-3 must be unmistakable. The budget above is the specification, and it is achieved entirely with type scale, gaps, elevation and default widths.
**States:** idle · streaming (spine cobalt + caret) · permission (amber dock, topmost) · question (info dock) · error (critical dock) · working with terminal open.

## 9.6 Session / Timeline Focus

**Layout (unchanged):** same screen with sidebar and auxiliary collapsed by the user.
**Visual:** the timeline widens to its 72ch cap and centres itself with auto margins. Everything else is gone. The Spine is now the leftmost element on screen — at this moment the product is *only* the mission.
**Why:** reading a long mission is a distinct mode of use that already exists (users collapse panels today). We simply make the collapsed state beautiful rather than merely wide. `max-width` on the content, not on the panel, so the runtime's flex layout is untouched.

## 9.7 Review

**Layout (unchanged):** auxiliary 360, Review tab active by default.
**Visual:** §8.13. Full-opacity diffs — the only place in the product with denser colour than the timeline, and correctly so: this is the evidence surface.
**Hierarchy:** stats → filter → file list → diff.
**States:** no changes ("No changes yet" empty state) · loading · error + Retry · filtered empty.
**Why:** artifacts over browsing (DD-1). Review is `text-14-med` and Preview is `text-12` `text-muted`; a user glancing at the right panel sees *what the AI changed* before *what files exist*.

## 9.8 Preview

**Layout (unchanged):** secondary strip inside the auxiliary column; default width 0 (closed).
**Visual:** §8.16. Systematically quieter: shorter tab bar, smaller type, muted colour, 90% content opacity.
**States:** empty · loading · error + Retry · markdown · image · PDF · text/code · binary. All eight preserved verbatim from the existing state machine.
**Why:** DD-3, expressed as three coordinated reductions (height, size, opacity) rather than by removing the feature. Every preview capability remains; it simply stops shouting.

## 9.9 Settings

**Layout (unchanged):** `DialogSettingsV2`, large 900, 200px vertical tab column + content.
**Visual:** E3 modal. Left column: 36px tab rows, 16px icon + `text-13`, active = `bg-layer-02` + 2px cobalt left bar. Right: setting rows with `text-14-med` title over `text-13` `text-muted` description, right-aligned control (36×20 switch, 160px select, 240px input), 1px `border-weak` between rows. Section headers `text-11-upper` `text-faint`.
**States:** default · searching (Models tab) · loading providers · connection error inline.
**Why:** settings is where a product's discipline is most visible. Two-line rows with a consistent right-aligned control column read as engineered; a mixed grid reads as accumulated.

## 9.10 Command Palette

**Layout (unchanged):** medium 600 modal, `mod+p`.
**Visual:** E3. 48px search field, `text-16`, 16px magnifier, 1px `border-weak` beneath. Results grouped under `text-11-upper` `text-faint` labels in the order **MISSIONS → COMMANDS → ARTIFACTS → FILES**, with the FILES group rendered one step dimmer. Rows 36px: 16px icon + `text-14` title (matched characters in cobalt 530) + `text-13` `text-muted` description + right-aligned `text-12` keybind. Active row `bg-layer-02` + 2px cobalt left bar.
**Why:** the palette is the primary navigation surface (DD-6), so its *result ordering* is the strongest available statement of DD-1. Missions first, files last and dimmest — same hierarchy, different surface. Grouping order is presentation-layer ordering only; the existing fuzzy-match runtime is untouched.

## 9.11 Dialogs (all 19)

One foundation (§8.7), no exceptions. Each specialised dialog contributes only its content region:

| Dialog | Content treatment |
|---|---|
| `SelectDirectoryV2` | Path input + native tree (§9.2) |
| `SelectServer` | 28px rows, health dot + name + version |
| `EditProjectV2` | Name input, 6-swatch avatar picker (28px, selected = 2px cobalt ring), disabled path |
| `SelectModel` | Provider tabs, search, model rows with variant dropdown |
| `ConnectProvider` | OAuth step list or API-key input with a visibility toggle |
| `ManageModels` | Table, 28px rows, right-aligned switches |
| `ReleaseNotes` | Markdown prose, 68ch measure |
| `Fork` | Directory input + prompt textarea |
| `SelectMcp` | Checkbox list |
| `UsageExceeded` | Warning icon + message + primary Upgrade |
| `DeleteWorkspace` | Destructive: critical icon, clean/dirty variants, primary is Destructive |
| `ResetWorkspace` | Archive list + destructive confirm |
| + 7 others | Same foundation |

**Why:** 19 dialogs sharing one header/content/footer skeleton is the cheapest, most visible consistency win available (DD-7).

## 9.12 Empty states

Nine of them (welcome, no project, empty folder, no sessions, no search results, no changes, no file selected, no terminals, no providers). All use the §8.17 empty contract exactly — same icon size, same stack, same spacing, same copy tone.
**Why:** empty states are where products leak personality inconsistently. One contract, nine instances.

## 9.13 Loading states

Spinner 16px + `text-13` `text-muted` label. Skeletons only for timeline history (known height). Panels never show a full-panel skeleton — they show their frame immediately and load content inside it, so the layout never jumps.
**Why:** structural stability during load is a top-three perceived-quality signal, and it costs nothing.

## 9.14 Error states

| Scope | Treatment |
|---|---|
| Inline (file load, directory) | 16px critical icon + `text-13` critical message + Retry secondary |
| Panel | Centred error empty-state with Retry |
| Route | Existing `RouteErrorBoundary`: title, `mono-12` detail, Close |
| Connection | Existing full-screen `ConnectionError`: status, auto-retry countdown, other-servers list |
| Fatal | Existing `ErrorPage`: message, `mono-12` stack in a collapsed accordion, Restart / Export logs / Report |

Every one has an action. **No dead end anywhere in the product.** (DD-9)

## 9.15 Responsive

| Breakpoint | Behaviour (existing, preserved) |
|---|---|
| **Ultra-wide >1920** | Sidebar 320, auxiliary 480, timeline capped at 72ch and centred |
| **Desktop 1280–1920** | Baseline: rail 48 / sidebar 240 / main flex / auxiliary 360 |
| **Laptop 1024–1280** | Auxiliary becomes an 80%-width overlay drawer with scrim |
| **Small 768–1024** | Sidebar narrows to 200; preview overlays |
| **Mobile <768** | Existing auto-close effect; sidebar becomes a left drawer; preview and terminal go full-screen modal; toasts move to bottom; inputs forced to 16px (iOS zoom guard) |

All driven by the existing `createMediaQuery("(min-width: 768px)")` and the existing container query. No new breakpoints. Persisted user widths always win over responsive defaults — responsive controls *visibility*, never *width*. (DD-12)

---

# 10. AI Presence

## 10.1 The constraint, and why it is right

**Forbidden:** avatars, chat bubbles, mascots, faces, names, personalities, "thinking…" theatre, typing-dot animations, personified copy ("I'll take a look!").

This is not merely an aesthetic preference; it is a correctness argument. Personification makes an interface **claim** things it cannot guarantee — that it understands, that it intends, that it is a colleague. In a tool that edits your source code and requests filesystem permissions, that claim is a trust liability. HeniossAI instead shows *evidence of work*. Evidence is verifiable; personality is not. This is DD-9 taken seriously.

## 10.2 The seven presence devices

Presence is composed entirely from these. Each is a visual-layer device driven by a signal the runtime already emits.

**1 — The Spine.**
A 1px vertical hairline down the timeline's left margin. Neutral for settled turns; `interactive-base` beside the streaming turn; fades back over 240ms on completion. *Says:* this is one continuous act of reasoning, and here is where it currently is.

**2 — The Caret.**
A 1×16px cobalt bar at the insertion point, `pulse-opacity` 1s. Solid (non-blinking) under reduced motion. *Says:* generating, right now. It is the smallest possible truthful liveness indicator.

**3 — Composer elevation.**
The composer is the most elevated object in the product and the only one at radius 12 with a focus-lifted cobalt border. *Says:* the conversation is the centre of this application, not a footer attached to an editor. (DD-2)

**4 — Context chips.**
Cobalt-tinted, cobalt-bordered, individually removable. *Says:* here is exactly what the AI can see. Nothing hidden. Because they carry the accent, they read as *live inputs to a running system* rather than as decorative tags. (DD-9)

**5 — Progress rhythm.**
The Todo dock's spring-animated `3/5`, checkboxes resolving, items striking through. *Says:* the work is decomposed and advancing. This is the only "alive" motion in the product, and it is tied to real state.

**6 — Permission amber.**
An amber-bordered dock, always topmost in the stack, with a low-amplitude 2s icon pulse. Because amber is reserved for essentially this one purpose, its appearance anywhere in the product means *the AI has stopped and is waiting for you*. *Says:* nothing happens to your machine without your consent.

**7 — The Context meter.**
A segmented bar in the status bar and Context tab. *Says:* here is how much the AI is currently holding. Transparency about limits is a presence signal — it treats the model as a mechanism with capacity, not an oracle.

## 10.3 Presence intensity ladder

| Runtime state | Spine | Caret | Composer | Docks | Status |
|---|---|---|---|---|---|
| Idle | neutral | none | resting border | none | model + branch |
| Streaming | **cobalt active segment** | **pulsing** | resting | Todo may show | context meter animates |
| Tool running | cobalt | none | resting | tool card spinner | — |
| Awaiting permission | cobalt **paused** (held, not fading) | none | resting | **amber dock, topmost, pulsing icon** | — |
| Complete | fades to neutral 240ms | none | resting | Followup may appear | meter settles |
| Error | segment turns `critical` | none | resting | critical dock + Retry | — |

A user can read the AI's entire state from the left edge of the timeline and the dock stack. Without reading a word.

## 10.4 What presence must never do

- Never occupy space when idle. No persistent "AI panel", no always-on indicator, no greeting.
- Never animate without a corresponding runtime state. Every motion maps to a real signal.
- Never use more than one accent element simultaneously in one region. (§7 Rule M-3)
- Never speak in first person in chrome copy. Buttons say "Allow once", not "Let me do this".
- Never imply capability it lacks. No "Thinking deeply…", no "Analysing your codebase…" unless the runtime literally reports that tool state.

---

# 11. HDS Foundation

The HeniossAI Design System token layer. `packages/ui/src/styles/hds.css` **already exists** (388 lines) and already contains most of what follows. This section is the canonical, completed specification of that file. Additions are additive; nothing existing is redefined. (DD-4, DD-10, `{I-BACKWARD}`, `{I-NO-DEPS}`)

## 11.1 Token naming contract

```
--hds-<category>-<role>[-<variant>][-<theme>]
```
Categories: `spacing` · `radius` · `motion` · `ease` · `bg` · `text` · `border` · `interactive` · `shadow` · `font` · `size` · `layout` · `z`.
Theme resolution uses `light-dark()`, matching the existing `theme.css` mechanism exactly.

*Rule Tk-1:* Components consume **semantic** tokens only (`--hds-bg-base`), never raw values (`#18181B`) and never theme-suffixed primitives (`--hds-bg-base-dark`).
*Rule Tk-2:* HDS tokens **map onto** existing `--v2-*` tokens for the transition. Both coexist. `--v2-*` is deprecated for new code, never deleted. This is the whole zero-risk migration strategy.

## 11.2 Spacing scale (4px base)

| Token | Value | Use |
|---|---|---|
| `--hds-spacing-0` | 0 | Flush |
| `--hds-spacing-0-5` | 2px | Micro gaps, badge internals |
| `--hds-spacing-1` | 4px | Icon-to-label tight, list gaps |
| `--hds-spacing-1-5` | 6px | Tree row padding-x |
| `--hds-spacing-2` | 8px | **Default gap.** Panel padding, control gaps |
| `--hds-spacing-3` | 12px | Card padding, **timeline turn gap** |
| `--hds-spacing-4` | 16px | Section gaps, dialog padding, timeline padding-x |
| `--hds-spacing-5` | 20px | Rare, large card internals |
| `--hds-spacing-6` | 24px | Dialog margins, empty-state stacks |
| `--hds-spacing-8` | 32px | Major section separation |
| `--hds-spacing-10` | 40px | Welcome column spacing |
| `--hds-spacing-12` | 48px | Maximum |

Forbidden: 3, 5, 7, 9, 10, 11, 13, 14, 15px. Lint-enforced (no `p-[13px]`).
**Why 4px:** it is already the app's `--spacing` base and Tailwind unit. Adopting anything else would mean rewriting every utility class in the codebase — an unjustifiable risk for zero user benefit.

## 11.3 Radius scale

| Token | Value | Semantic meaning |
|---|---|---|
| `--hds-radius-4` | 4px | **Functional** — tree rows, menu items, kind badges |
| `--hds-radius-6` | 6px | **Interactive** — buttons, inputs, tabs, icon buttons |
| `--hds-radius-8` | 8px | **Container** — cards, docks, panels-as-objects, popovers |
| `--hds-radius-12` | 12px | **Overlay** — dialogs, command palette, composer |
| `--hds-radius-full` | 9999px | **Pill** — chips, badges, status dots, scrollbar thumb, active bar |

Radius encodes *category*, not size. A user learns in minutes that 12px means "this is a major surface" and `full` means "this is a small discrete token".

## 11.4 Elevation scale

| Token | Composition |
|---|---|
| `--hds-elevation-0` | none |
| `--hds-elevation-1` | `var(--shadow-xs)` + 1px `border-base` |
| `--hds-elevation-2` | `var(--shadow-md)` + 1px `border-base` |
| `--hds-elevation-3` | `var(--shadow-lg)` + 1px `border-base` + scrim |
| `--hds-elevation-4` | `var(--shadow-lg)` + 1px `border-base` |

All shadow primitives are the **existing** `theme.css` tokens (`--shadow-xs`, `--shadow-md`, `--shadow-lg`, `--shadow-xs-border-base`, `--shadow-xs-border-focus`), already `light-dark()`-aware and already tuned. HDS aliases them; it does not redefine them.

## 11.5 Typography scale

```css
--hds-font-ui:   "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
--hds-font-mono: "JetBrainsMono Nerd Font Mono", ui-monospace, SFMono-Regular, Menlo, monospace;

--hds-size-11: 11px;  --hds-line-11: 14px;
--hds-size-12: 12px;  --hds-line-12: 16px;
--hds-size-13: 13px;  --hds-line-13: 18px;
--hds-size-14: 14px;  --hds-line-14: 20px;
--hds-size-16: 16px;  --hds-line-16: 24px;

--hds-line-timeline: 180%;   /* mission content only */

--hds-weight-regular:  440;
--hds-weight-medium:   530;
--hds-weight-label:    600;

--hds-tracking-normal:  0;
--hds-tracking-tight:  -0.16px;   /* 16px+ */
--hds-tracking-label:   0.6px;    /* 11px uppercase */

/* AI-weighting aliases (already in hds.css) */
--hds-weight-primary:   var(--hds-weight-medium);
--hds-weight-secondary: var(--hds-weight-regular);
--hds-font-size-primary:   14px;  /* mission content */
--hds-font-size-secondary: 13px;  /* file tree */
--hds-font-size-tertiary:  12px;  /* preview, metadata */
--hds-font-size-micro:     11px;  /* group labels */
```

## 11.6 Motion tokens

```css
--hds-motion-fast:   120ms;
--hds-motion-normal: 160ms;
--hds-motion-slow:   180ms;
--hds-motion-panel:  240ms;

--hds-ease-default:    ease-out;
--hds-ease-emphasized: cubic-bezier(0.22, 1, 0.36, 1);   /* signature */
--hds-ease-spring:     linear(…);                         /* existing, todo dock */
```

## 11.7 Color tokens

Complete set as specified in §4, already present in `hds.css`: backgrounds (6), text (5), borders (4), interactive (5), semantic (4), diff (9), avatar (24). All resolved through `light-dark()`.

## 11.8 Layout tokens

```css
--hds-activity-bar-width: 48px;
--hds-sidebar-width:      240px;   /* clamp 200–600 (runtime-enforced, unchanged) */
--hds-auxiliary-width:    360px;   /* clamp 200–800 (runtime-enforced, unchanged) */
--hds-preview-width:      360px;
--hds-terminal-height:    200px;   /* clamp 100px–60vh (unchanged) */
--hds-titlebar-height:     36px;
--hds-statusbar-height:    24px;
--hds-resize-handle:        4px;
--hds-resize-hit:          12px;
--hds-timeline-measure:    72ch;
--hds-prose-measure:       68ch;
```

Every clamp is the **existing runtime clamp**. Only defaults change, and only within those clamps.

## 11.9 Row-height tokens

```css
--hds-row-compact: 24px;  --hds-row-dense:   28px;
--hds-row-base:    32px;  --hds-row-comfort: 36px;
--hds-row-header:  48px;
```

## 11.10 Token governance

1. New token requires: a name, a value per theme, a stated use, and a rejected alternative.
2. No component-specific tokens (`--hds-explorer-bg` is forbidden). Semantic only.
3. Deprecation: mark, keep, migrate, remove only at a major version.
4. Every token appears in a Storybook token page with a live swatch (the `storybook` package already exists).
5. Lint: no hex literals in `.tsx`; no arbitrary Tailwind spacing; no raw `transition-duration`.

---

# 12. Implementation Roadmap

## 12.1 Ordering principle

**Safest order = lowest blast radius first, and never touch the Session black box.**

Three risk axes, ordered:
1. **Additive-only work** (new files, new tokens) — no existing pixel changes. Zero risk.
2. **Leaf styling** (components with no children that other components style) — bounded risk.
3. **Shell/container styling** (layout, titlebar) — highest risk, always last, always behind an existing gate.

The Session region (`{I-SESSION}`, `{I-SESSION-FILES}`) is never modified. Where mission-content styling is required, it is applied via the *container* the Presentation Layer already owns, never by editing Session-internal files.

## 12.2 Universal per-phase gate

No phase closes until **all** of the following pass. This mirrors `IMPLEMENTATION_PROTOCOL.md` §8 and `EXECUTION_PLAN.md`.

| Gate | Criterion |
|---|---|
| G1 Typecheck | `bun typecheck` — only the known pre-existing `custom-elements.d.ts` error |
| G2 Tests | `bun test` — 671/672 (only the known pre-existing i18n parity failure) |
| G3 Import audit | Zero imports from Runtime / Core / Session internals |
| G4 Session isolation | Screenshot diff of the Session region: **zero pixels changed** for phases 0–2 |
| G5 Journey smoke | All 10 journeys in S2 §26 pass manually |
| G6 A11y | Keyboard-only traversal of the phase's surface; contrast spot-check |
| G7 Reduced motion | Phase surface verified with `prefers-reduced-motion: reduce` |
| G8 Theme parity | Phase surface verified in dark, light, and 3 sampled custom themes |
| G9 Revertibility | Phase is a single revertible commit range |

## 12.3 Phases

### Phase A — Token Completion (2–3 days) · Risk: **None**
Complete `hds.css` to the §11 specification: add missing row-height, layout-measure, elevation-alias and typography tokens. Add the `--v2-*` → `--hds-*` bridge map. Add Storybook token pages.
**Nothing consumes the new tokens yet.** Zero visual change is the success criterion.
*Preserves:* everything. *Justifies:* DD-4, DD-7, DD-10. *Solves:* two competing token systems producing drift.
*Rollback:* delete additions.

### Phase B — Primitive Wrappers (3–4 days) · Risk: **Very low**
Add `HdsIcon` (size + 1.5px stroke enforcement over `IconV2`), `HdsButton`, `HdsIconButton`, `HdsInput`, `HdsTooltip` — thin wrappers, HDS-tokened, API-compatible with their V2 counterparts. No call sites migrated. Storybook stories with all six states.
*Preserves:* every existing component; V1/V2 remain functional. *Justifies:* DD-7, DD-10. *Solves:* 17 duplicate pairs, two icon systems, two tooltip systems.
*Rollback:* delete new files.

### Phase C — Leaf Components (5–7 days) · Risk: **Low**
Restyle self-contained leaves to HDS: buttons, inputs, badges, status dots, tooltips, menu items, empty/loading/error state contracts (§8.17). Migrate call sites to the Phase-B wrappers in Presentation-owned files only.
*Preserves:* all props, all handlers, all ARIA. *Justifies:* DD-5, DD-7, DD-15. *Solves:* inconsistent states across 202 components.
*Rollback:* per-component.

### Phase D — Explorer & Secondary-Tool De-weighting (4–6 days) · Risk: **Low**
Apply §8.15 / §9.3: tree rows 28px, `text-13` `text-muted`, mono icons at rest, 2px cobalt selection bar, HDS kind badges, unified toolbar, the `FILES — SECONDARY TOOL` footer label with tooltip.
*Preserves:* virtualization, `MAX_DEPTH 128`, lazy load, `treeCache`, filter, context menus, all 19 capabilities, all 4 empty/loading/error states, all keybinds. *Justifies:* DD-1, DD-3, DD-5. *Solves:* the file tree currently out-competing missions for attention.
*Rollback:* single file revert (`explorer-panel.tsx` styling only).

### Phase E — Preview & Auxiliary Re-weighting (4–6 days) · Risk: **Low**
Preview tab bar 32px, `text-12` `text-muted`, 90% content opacity; Review/Context triggers to `text-14-med`; full-opacity diff viewer; Context token meter.
*Preserves:* the entire 8-state preview machine, per-file scroll restoration, tab open/close/switch, SDK read path. *Justifies:* DD-1, DD-3. *Solves:* Review (the AI's output) reading as subordinate to Preview (a file viewer).
*Rollback:* two-file revert.

### Phase F — Mission Surfaces: Timeline, Docks, Composer (6–8 days) · Risk: **Medium** — highest care
Apply §8.12 via Presentation-owned containers only:
- **The Spine** — one pseudo-element on the timeline container + one active modifier.
- Turn gap 12px, measure 72ch, mission content 180%.
- Tool cards, dock cards, permission amber, composer elevation, cobalt context chips.

**Hard constraints:** no change to virtualizer configuration; no CSS transition on the scroll container (protects the prepend-anchor RAF loop); no change to `useSpring`; no imports from Session internals; styling is applied through the container the Presentation Layer already owns.
*Preserves:* streaming, tool rendering, permission/question/followup/todo/revert logic, composer submit/history/mentions/slash/attachments/model/agent/shell mode, timeline cache LRU 16. *Justifies:* DD-1, DD-2, DD-9, DD-12. *Solves:* mission content reading as a chat log instead of the product's centre.
*Rollback:* CSS-only revert; the Spine is one rule.

### Phase G — Overlays: Dialogs, Palette, Menus, Toasts (5–7 days) · Risk: **Low**
One dialog foundation across all 19; palette result reordering (Missions → Commands → Artifacts → Files) as pure presentation ordering; opaque menus; unified toast.
*Preserves:* focus trap, focus restore, Escape/backdrop dismiss, all portal targets, fuzzy-match logic, all keybinds. *Justifies:* DD-6, DD-7. *Solves:* 19 dialogs with drifting headers/footers.
*Rollback:* per-dialog.

### Phase H — Titlebar, Status Bar, Activity Rail (3–4 days) · Risk: **Medium-high** — deliberately last
Restyle the titlebar to HDS; tab strip to §8.6; optional 24px status bar (settings-gated, off by default); the 48px activity rail introduced **behind the existing `newLayoutDesigns` feature flag**.
**Hard constraints:** `data-tauri-drag-region` untouched; double-click-maximize untouched; `titlebarZoom` counter-zoom untouched; `env(safe-area-inset-*)` untouched; window-control platform logic untouched; both portal targets (`#opencode-titlebar-center`, right slot) preserved.
*Preserves:* drag, zoom, safe areas, window controls, menu bars (Windows + macOS), tab drag/overflow, status popover, `OpenInApp`. *Justifies:* DD-5, DD-9, DD-11, and the approved S11 top-bar minimalism. *Solves:* the titlebar being the least-unified surface.
*Rollback:* flag off.

### Phase I — Motion, Density, A11y, Consistency (5–8 days) · Risk: **Low**
Normalise every duration/easing to HDS tokens; apply the §3.7 density levers; full keyboard traversal audit; reduced-motion audit; contrast audit; enable the lint rules (no hex in tsx, no arbitrary spacing, no raw durations); remove the 4 confirmed dead-UI items; publish the V1→V2→HDS deprecation guide.
*Preserves:* all shortcuts, all ARIA roles, all focus management. *Justifies:* DD-5, DD-6, DD-14, DD-15. *Solves:* long-term drift.

### Phase J — Concept Validation & Sign-off (3–5 days) · Risk: **None**
Side-by-side before/after for all 15 screens in dark + light; the §13 validation register completed per proposal; recognition test with existing users ("is this the same product?" must be unanimously yes); premium-perception test with new users.

**Dependency graph:** `A → B → C → (D ∥ E) → F → G → H → I → J`
**Total:** 40–58 days solo · 26–36 days with two engineers parallelising D∥E and G∥H.

## 12.4 Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Styling leaks into the Session region | Medium | **High** | G4 pixel-diff gate on every phase; `{I-VISIBLE-ISOLATION}`; Phase F applies only via owned containers |
| Timeline scroll anchoring breaks | Low | **High** | Rule: no CSS transition on the scroll container; G5 journey test explicitly exercises history load |
| Custom themes break under HDS | Medium | Medium | HDS maps onto existing tokens rather than replacing them; G8 tests 3 sampled themes |
| Density reduces touch targets | Low | Medium | Hit areas stay ≥24px even where the visual is 12px (resize handle pattern) |
| Density reduces legibility | Medium | Medium | Minimum 12px readable; contrast raised as size drops; G6 |
| Users disoriented by re-weighting | Low | Medium | Nothing moves; only weight changes; recognition test in Phase J |
| Panel default changes surprise users | Low | Low | Persisted widths always win; defaults apply to new installs only |
| Scope creep into runtime | Medium | **Critical** | `IMPLEMENTATION_PROTOCOL.md` authority hierarchy; G3 import audit; developer right-to-refuse |

## 12.5 What is explicitly out of scope for V1

Rem migration · new global search implementation · split-editor · minimap · new themes · icon-set replacement · new dependencies · workflow changes · navigation changes · new screens · moving any UI region.

---

# 13. Design Validation Register

Per the task's Design Validation requirement: for every major proposal — **why it improves HeniossAI · what behaviour is preserved · which Design Directives justify it · what user problem it solves.**

### V-01 · The Spine
**Improves:** gives HeniossAI a unique, ownable signature and makes mission continuity and live state readable at a glance.
**Preserves:** everything. It is one pseudo-element on a container the Presentation Layer already owns; the virtualizer, scroll anchoring and streaming are untouched.
**Directives:** DD-1, DD-2, DD-11, DD-14.
**Problem solved:** users cannot tell at a glance whether the AI is working, waiting or finished without reading the timeline.

### V-02 · Mission/file weight inversion
**Improves:** makes the product's own model of itself visible — Mission is the object, files are tools.
**Preserves:** every Explorer capability (all 19), all keybinds, virtualization, caching, context menus, all four states.
**Directives:** DD-1, DD-2, DD-3, DD-5.
**Problem solved:** today the file tree competes visually with the conversation, pulling users into a file-first mental model the product does not actually have.

### V-03 · Single-accent discipline
**Improves:** every cobalt element becomes meaningful; the chrome recedes and content dominates.
**Preserves:** all semantic colours, all diff colours, all avatar colours, the entire 35-theme system.
**Directives:** DD-5, DD-9, DD-11.
**Problem solved:** 1,200 colour values produce inconsistent emphasis; users cannot learn what colour means.

### V-04 · Elevation-by-role (Frame/Field/Object/Transient)
**Improves:** a learnable grammar — bordered + shadowed means actionable.
**Preserves:** all existing z-index bands, all portals, all shadow tokens.
**Directives:** DD-5, DD-7.
**Problem solved:** depth is currently applied inconsistently, so elevation carries no information.

### V-05 · Whitespace gradient (12→8→4→2→0)
**Improves:** encodes hierarchy in rhythm, so importance is legible pre-attentively.
**Preserves:** all layouts, all clamps, all persisted widths.
**Directives:** DD-1, DD-3, DD-5.
**Problem solved:** uniform spacing forces users to read everything to find anything.

### V-06 · Composer as the most elevated object
**Improves:** states unambiguously that intent-input is the centre of the application.
**Preserves:** ProseMirror, submit, history, mentions, slash commands, attachments, model/agent selection, shell mode, all keybinds.
**Directives:** DD-2, DD-9.
**Problem solved:** the composer currently reads as a footer, understating the primary interaction.

### V-07 · Cobalt context chips
**Improves:** makes the AI's inputs explicit, live and editable.
**Preserves:** the entire `ContextItems` behaviour and data flow.
**Directives:** DD-9, DD-2.
**Problem solved:** users are unsure what context the model actually has.

### V-08 · Reserved permission amber
**Improves:** creates a single, learnable "the AI is waiting on you" signal.
**Preserves:** the permission dock's full logic, auto-accept rules, all three actions.
**Directives:** DD-9, DD-15.
**Problem solved:** permission requests can be missed during long streaming sessions.

### V-09 · Preview de-weighting (32px / 12px / 90%)
**Improves:** artifacts (Review) read before files (Preview).
**Preserves:** all 8 preview states, per-file scroll restoration, tabs, SDK read path.
**Directives:** DD-1, DD-3, DD-12.
**Problem solved:** the file viewer currently out-competes the AI's actual output.

### V-10 · Unified overlay foundation
**Improves:** 19 dialogs + palette + menus + toasts become one recognisable system.
**Preserves:** focus trap, focus restore, dismissal, portals, all dialog-specific logic.
**Directives:** DD-6, DD-7.
**Problem solved:** drifting overlay chrome makes the product feel assembled rather than designed.

### V-11 · Palette result ordering (Missions → Commands → Artifacts → Files)
**Improves:** the primary navigation surface reflects the primary object.
**Preserves:** fuzzy matching, keyboard navigation, all registered commands, dedup.
**Directives:** DD-1, DD-6.
**Problem solved:** file-first result ordering contradicts the mission-first product model.

### V-12 · No-personification presence system
**Improves:** builds trust through evidence rather than through claims.
**Preserves:** all AI state rendering.
**Directives:** DD-9, DD-11.
**Problem solved:** personified AI UI implies understanding it cannot guarantee, in a tool that edits code and requests permissions.

### V-13 · Density increase (~28 → ~36 rows)
**Improves:** more context per screen, less scrolling.
**Preserves:** every label, badge, dot and affordance; hit areas ≥24px.
**Directives:** DD-5.
**Problem solved:** power users with many projects and missions scroll constantly.

### V-14 · Motion normalisation to 4 durations
**Improves:** the product moves with one temperament.
**Preserves:** the 240ms signature panel easing, the todo spring, all keyframes, reduced-motion support.
**Directives:** DD-14, DD-15.
**Problem solved:** mixed durations make interactions feel inconsistently responsive.

### V-15 · HDS token layer over (not instead of) `--v2-*`
**Improves:** consistency without a risky migration.
**Preserves:** every existing token, every custom theme, every existing consumer.
**Directives:** DD-4, DD-7, DD-10.
**Problem solved:** two token systems drifting apart with no single source of truth.

### V-16 · `FILES — SECONDARY TOOL` label
**Improves:** teaches the product's model of itself in five words.
**Preserves:** the entire Explorer.
**Directives:** DD-1, DD-3.
**Problem solved:** new users assume a file-first IDE and never discover the mission-first flow.

---

# 14. Visual Concepts

Eight concept explorations, generated for this blueprint. **These are concept explorations, not implementation screenshots.** They communicate weight, rhythm, colour discipline and hierarchy. They are not pixel-accurate, and where a concept image and this document disagree, **this document wins**.

Location: `artifacts/heniossai/design-spec/concepts/`

| # | File | Concept | Demonstrates |
|---|---|---|---|
| C01 | `C01_workspace_dark.png` | **Main Workspace — Dark** | Full layout, the Spine, mission-weighted sidebar, elevated composer, Review primary, single-accent discipline |
| C02 | `C02_workspace_light.png` | **Main Workspace — Light** | Warm-paper theme at full parity; identical structure, identical hierarchy |
| C03 | `C03_explorer_dark.png` | **Explorer** | 28px muted tree, 2px cobalt selection bar, kind badges, `FILES — SECONDARY TOOL` footer |
| C04 | `C04_session_timeline_dark.png` | **Session / Timeline** | The Spine at full length, 180% leading, tool cards, live caret, amber permission dock |
| C05 | `C05_review_dark.png` | **Review** | 14/530 primary tabs vs 12px muted secondary tabs, full-opacity diff, de-weighted preview strip |
| C06 | `C06_settings_dark.png` | **Settings** | Unified dialog foundation, 200px vertical tabs, two-line setting rows |
| C07 | `C07_welcome_light.png` | **Welcome — Light** | 3% shield watermark, mission-directed empty state, provider notice |
| C08 | `C08_composer_palette_dark.png` | **Composer + Command Palette** | Cobalt context chips, slash popover, mission-first palette ordering |

**Coverage against the required minimum:** Main Workspace (C01, C02) · Explorer (C03) · Session (C04) · Review (C05) · Settings (C06) · Light Theme (C02, C07) · Dark Theme (C01, C03–C06, C08). All required concepts delivered, plus two extra studies (Welcome, Composer/Palette).

**How to read them:** judge weight relationships, spacing rhythm, colour rationing and elevation grammar. Do not judge string content, exact pixel measurements, or icon-glyph specifics — those are specified normatively in §3–§9 of this document.

---

# 15. Compliance Declaration

## 15.1 Non-negotiable architectural contract

| Requirement | Status | Evidence |
|---|---|---|
| Zero runtime modification | ✅ | Every proposal is CSS, a token, a default value, or JSX ordering |
| Zero business-logic modification | ✅ | No logic referenced anywhere in this document |
| Zero state-management modification | ✅ | No new stores; existing `layout.*` signals only |
| Zero provider modification | ✅ | All 23–24 providers untouched, order preserved |
| Zero lifecycle modification | ✅ | No mount/cleanup/effect changes |
| Zero backend modification | ✅ | Out of scope |
| Zero SDK modification | ✅ | Existing `sd.file.read/list`, `sd.session.prompt`, `sd.pty.start` only |
| Zero API modification | ✅ | None referenced |
| Zero new dependencies `{I-NO-DEPS}` | ✅ | Inter, JetBrains Mono, Lucide/IconV2, Tailwind, Kobalte, dnd-kit, solid-virtual all already present |
| Session black box `{I-SESSION}` `{I-SESSION-FILES}` | ✅ | Phase F styles only Presentation-owned containers; G4 pixel-diff gate |
| Additive only `{I-BACKWARD}` | ✅ | HDS maps onto `--v2-*`; V1/V2 components remain functional |
| Unidirectional `{I-UNIDIRECTIONAL}` | ✅ | No Session→panel awareness introduced |
| Visible isolation `{I-VISIBLE-ISOLATION}` | ✅ | Gate G4 |
| Entirely within the Presentation Layer | ✅ | Layout, hierarchy, spacing, design system, styling, interaction presentation, motion, typography, colour, icons, IA presentation, panel/navigation presentation, responsive, accessibility — nothing else |

## 15.2 Prohibition compliance

| Prohibition | Status |
|---|---|
| Do NOT redesign the product | ✅ Same product, same purpose |
| Do NOT redesign workflows | ✅ All 10 journeys unchanged |
| Do NOT redesign runtime | ✅ Black box, verified against S4 |
| Do NOT redesign navigation | ✅ Same routes, same keybinds, same palette, same tabs |
| Do NOT redesign architecture | ✅ Same 7 layers, same providers |
| Do NOT redesign interaction philosophy | ✅ Command-first, pointer-second, preserved |
| Do NOT invent new screens | ✅ Every screen in §9 exists today |
| Do NOT invent new workflows | ✅ None |
| Do NOT move major UI regions | ✅ Left/centre/right/bottom/top roles identical |
| Do NOT imitate VS Code / Cursor / Claude Code / Antigravity / Lovable / ChatGPT / Bolt / Windsurf | ✅ Uniform content-field surfaces (breaks editor convention), no violet, no glass overlays, no chat bubbles, no avatars, no cards-on-cards, and one wholly original device — the Spine |

## 15.3 Success criteria

| Criterion | How this blueprint satisfies it |
|---|---|
| "This is unmistakably HeniossAI." | The Spine + weight inversion + single-accent austerity + hairline structure form a combination no other product has. |
| Existing users immediately recognise the product. | Zero structural change. Every panel, keybind, menu item and route is exactly where it was. Only weight, grain, rhythm and colour discipline change. |
| New users perceive a premium, AI-native environment. | Premium via optical alignment, rhythm consistency, no-reflow interaction, two-tier contrast and shadow honesty (§2.3). AI-native via process visibility, not personification (§10). |
| Feels evolved, not replaced. | Every change is a re-weighting of something that already exists. Nothing is deleted, moved or renamed in the UI. |
| A UI engineer can implement without subjective decisions. | §3–§8 specify surface, elevation, border, radius, type token, weight, colour token, spacing, row height, state and motion for every component; §11 gives the exhaustive token set; §12 gives the order and the gates. Where a value is not stated, §8.17's universal contracts apply. |

---

**End of Blueprint · HeniossAI Design Execution Blueprint V1**
*Mission is the object. AI is the actor. Files are tools. The runtime is untouched.*
*HeniossAI evolved — not HeniossAI replaced.*
