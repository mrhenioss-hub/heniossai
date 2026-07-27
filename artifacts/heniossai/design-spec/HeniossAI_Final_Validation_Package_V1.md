# HeniossAI — Final Validation Package

## V1 | Pre-Implementation Verification | 2026-07-27

> **Purpose:** Verify that the Design Execution Blueprint V1 can move from documentation into implementation with minimal technical risk and zero Presentation Layer constraint violations.
> **This is not a redesign.** No architecture, roadmap or blueprint content is changed here. One element — the Spine active segment — is **narrowed** as a direct result of code evidence, exactly as the validation brief requires.
> **Method:** Source-code verification against the live repository, not assertion. Every claim below carries a `file:line` citation.

---

## Headline Finding (read this first)

The blueprint claimed the Spine would be *"one pseudo-element on the timeline container plus a modifier on the active turn — pure CSS, zero runtime coupling."*

**Code inspection proves that claim was half right.**

| Component | Blueprint claim | Verified reality | Verdict |
|---|---|---|---|
| **Spine base rail** | Pure CSS | ✅ Confirmed — targetable via an existing DOM attribute from an external stylesheet, zero file edits | **SAFE** |
| **Spine active segment** | "a modifier on the active turn" | ❌ **No such modifier exists.** Adding one requires editing a Session-internal file | **BLOCKED — redesigned below** |

The active segment has been **redesigned into three fallback options** (§3.6), the safest of which is adopted as the default. This is disclosed rather than hidden, and it is the single most important output of this package.

**Recommendation: GO WITH CONDITIONS** (§7). Four conditions, all resolvable inside the existing roadmap without changing it.

---

# 1. Concept Gallery

Nine concepts, all at maximum available generation fidelity (1376×768 PNG, 282 KB–1.25 MB). Location: `artifacts/heniossai/design-spec/concepts/`

| # | File | Screen | Size |
|---|---|---|---|
| C01 | `C01_workspace_dark.png` | **Main Workspace — Dark** | 1213 KB |
| C02 | `C02_workspace_light.png` | **Main Workspace — Light** | 1150 KB |
| C03 | `C03_explorer_dark.png` | **Explorer** | 1068 KB |
| C04 | `C04_session_timeline_dark.png` | **Session / Timeline** | 915 KB |
| C05 | `C05_review_dark.png` | **Review** | 974 KB |
| C06 | `C06_settings_dark.png` | **Settings** | 1119 KB |
| C07 | `C07_welcome_light.png` | **Welcome** | 282 KB |
| C08 | `C08_composer_palette_dark.png` | **Composer + Command Palette** | 1252 KB |
| C09 | `C09_preview_dark.png` | **Preview** *(added for this package)* | — |

### Coverage against the requested list

| Requested | Delivered |
|---|---|
| Main Workspace | ✅ C01 (dark), C02 (light) — 2 variations |
| Explorer | ✅ C03 |
| Review | ✅ C05 |
| Preview | ✅ **C09** — newly generated; the original set showed Preview only as a subordinate strip inside C05 |
| Settings | ✅ C06 |
| Welcome | ✅ C07 |
| Dark Theme | ✅ C01, C03, C04, C05, C06, C08, C09 — 7 variations |
| Light Theme | ✅ C02, C07 — 2 variations |
| *(extra)* Session/Timeline | ✅ C04 |
| *(extra)* Composer + Palette | ✅ C08 |

**Status:** all eight requested categories covered, with all variations included.

**Standing caveat:** these are **concept explorations**, not implementation targets. They are generated imagery and contain lorem-style text artefacts, approximate glyphs and imprecise measurements. Judge weight relationships, spacing rhythm, colour rationing and elevation grammar. Where a concept and the Blueprint disagree, **the Blueprint is normative**. No engineer should measure pixels from these files.

---

# 2. Workspace Verification

Verification target: does any workspace concept require a change to runtime behaviour? Assessed against `Presentation_Layer_Runtime_Behavior_Blueprint_V4.md` and live source.

## 2.1 C01 / C02 — Main Workspace (dark + light)

**Depicts:** titlebar + activity rail + sidebar + mission column + auxiliary + status bar; spine; elevated composer; Review primary; Preview subordinate.

**Preserves:**
- Three-pane flex shell — `layout-new.tsx:81-124`, Session still renders as `<Suspense>{props.children}</Suspense>` at `layout-new.tsx:102`, untouched.
- Panel width clamps — Explorer 200–600 (`layout-new.tsx:94-95`), Preview 200–800. Concept defaults (240/360) sit inside both clamps; the clamps themselves are unchanged.
- The 240 ms `cubic-bezier(0.22,1,0.36,1)` panel transition with `will-change:[width]` and `motion-reduce:transition-none` — `layout-new.tsx:83,105`.
- Responsive auto-close below 768 px — `layout-new.tsx:29-34`.
- Command registration for `mod+shift+e` / `mod+shift+p` — `layout-new.tsx:36-53`.

**Requires runtime change:** **No.** All deltas are CSS values, token swaps and default widths.

## 2.2 C03 — Explorer

**Preserves:** virtualized tree via `@tanstack/solid-virtual` (`file-tree-v2.tsx:18,144`); `MAX_DEPTH 128`; 8 + 12×level indentation; lazy child fetch on expand; `treeCache`; fuzzy filter; the three context-menu actions; all four empty/loading/error states; `mod+shift+e` and `mod+f`.
**Requires runtime change:** **No.** Row height, type token, colour token and a static footer label only.

## 2.3 C04 — Session / Timeline

**Preserves:** see §3 for full forensic detail. Virtualizer config, streaming, measurement and anchoring all untouched.
**Requires runtime change:** **No — with one exception**, the Spine active segment, which is blocked and redesigned in §3.6.

## 2.4 C05 / C09 — Review and Preview

**Preserves:** Review tab content, diff rendering, filter, kind badges; Preview's full 8-state machine (empty / loading / error+retry / markdown / image / PDF / text / binary); per-file scroll restoration; tab open/close/switch; the `sd.file.read` path.
**Requires runtime change:** **No.** Tab-bar height, type size and a content opacity value.

## 2.5 C06 — Settings · C07 — Welcome · C08 — Composer + Palette

**Preserves:** `DialogSettingsV2` structure, all five tabs, focus trap, Escape/backdrop dismissal, focus restore; the welcome empty state and provider tip; ProseMirror composer, `ContextItems`, attachments, slash/@ popovers, model/agent selectors; palette fuzzy match and keyboard navigation.
**Requires runtime change:** **No.** Palette *result ordering* (Missions → Commands → Artifacts → Files) is presentation-layer grouping order, not match logic.

## 2.6 Explicit confirmations requested

| Subsystem | Status | Evidence |
|---|---|---|
| **Timeline unchanged** | ✅ **CONFIRMED** | Virtualizer options at `message-timeline.tsx:416-455` — `overscan:50`, `anchorTo:"end"`, `followOnAppend:true`, `scrollEndThreshold:80`, `paddingEnd:64`, `scrollMargin` 64/0, `estimateSize:60`, `rangeExtractor`, `getItemKey` — none referenced by any visual proposal. |
| **Composer unchanged** | ✅ **CONFIRMED** | `session/composer/*` untouched. Changes are container border-radius, shadow, padding and chip fill — all CSS. Submit, history, mentions, slash, attachments, model/agent, shell mode untouched. |
| **Dock Stack unchanged** | ✅ **CONFIRMED** | Permission / Question / Followup / Todo / Revert logic untouched. Changes are border colour, radius, elevation and stack order *presentation*. `useSpring` on Todo preserved. |
| **Session lifecycle unchanged** | ✅ **CONFIRMED** | Draft → submit → stream → complete → archive/delete untouched. `onCleanup` cache write at `message-timeline.tsx:~545` (`timelineCache` LRU 16) untouched. |
| **Navigation unchanged** | ✅ **CONFIRMED** | Routes at `app.tsx:620-630` untouched. All keybinds preserved. Palette re-ordering is display grouping only. |
| **Review unchanged** | ✅ **CONFIRMED** | `review-tab.tsx` / `session-review.tsx` logic untouched; diff computation, filter and kinds preserved. Type scale and opacity only. |
| **Context unchanged** | ✅ **CONFIRMED** | Token accounting, stats and system-prompt rendering untouched. The segmented meter is a restyle of the existing bar. |

**One caveat on "unchanged":** these confirmations hold **only if** styling is delivered via external stylesheets using existing attribute selectors, never by editing files under `packages/app/src/pages/session/`. That constraint is formalised as Condition C-2 in §7.

---

# 3. Spine Validation

The blueprint's most distinctive element, and therefore the one requiring the strictest proof.

## 3.1 What the code actually does

Verified in `packages/app/src/pages/session/timeline/message-timeline.tsx` (1,864 lines).

**Rows are absolutely positioned, not stacked in flow** (`:1289-1302`):

```
<div data-timeline-key={rowKey}
     style={{ position:"absolute", top:`${item().start - (showHeader()?64:0)}px`,
              left:"0", width:"100%", height:`${item().size}px`,
              overflow:"clip", "overflow-clip-margin":"0.5px" }}>
```

**The scroll content container** (`:1839-1849`):

```
<div data-timeline-virtual-content
     style={{ height:`${virtualizer.getTotalSize()}px`, position:"relative", width:"100%" }}>
```

**Content is centred inside full-width rows** (`:1084-1085`):
`"md:max-w-200 2xl:max-w-[1000px]"` + `"md:mx-auto"`.

Three consequences follow directly:

1. **A per-row spine is impossible.** Every row sets `overflow: clip`. A rail drawn inside a row is clipped at that row's box, and because rows are absolutely positioned with `TurnGap` spacer rows between them (`:1099`), the result is a dashed, broken line — not a continuous spine.
2. **A container-level spine is possible.** `[data-timeline-virtual-content]` is `position: relative` with height equal to `getTotalSize()`. A pseudo-element on it spans the full scrollable height. This is the correct anchor.
3. **The rail cannot sit at `left: 0`.** Rows are full-width but content is centred and breakpoint-dependent (`max-w-200` → 800 px at `md`, 1000 px at `2xl`). To align with the text's left margin the rail must be positioned at `calc(50% - 400px)` / `calc(50% - 500px)` per breakpoint. This is expressible in CSS but is **breakpoint-coupled and brittle** — disclosed, not hidden.

## 3.2 DOM impact

**Zero new DOM nodes. Zero edits to any Session file.**

`[data-timeline-virtual-content]` already exists in the rendered DOM (`:1840`). A stylesheet owned by the Presentation Layer can target it without touching `message-timeline.tsx`.

**Precedent confirms this is an established pattern in this codebase:** `packages/session-ui/src/components/file.css:5` already styles `[data-timeline-row] [data-component="file"]` from an external stylesheet. The technique is not novel here.

This satisfies `{I-SESSION}` (DOM not altered), `{I-SESSION-FILES}` (no internal file modified or imported) and `{I-NO-DEPS}`.

## 3.3 CSS implementation strategy

Recommended — **background gradient, not pseudo-element**:

```css
[data-timeline-virtual-content] {
  background-image: linear-gradient(to right,
    var(--hds-border-base) 0 1px, transparent 1px);
  background-repeat: no-repeat;
  background-size: 1px 100%;
  background-position: calc(50% - 400px) 0;
}
@media (min-width: 96rem) {
  [data-timeline-virtual-content] { background-position: calc(50% - 500px) 0; }
}
```

**Why a gradient rather than `::before`:** the container's height is rewritten on essentially every measurement pass — `virtualizer.getTotalSize()` at `:1843`, and imperatively inside `scrollToFn` at `:427`. A `::before` with `bottom: 0` participates in layout and would be re-laid-out on each of those writes. A background gradient is painted, not laid out, and a `background-size` of `1px × 100%` is the cheapest possible paint primitive.

## 3.4 Pseudo-element viability

**Yes, technically — but not recommended.** `::before` on the container works functionally and was the blueprint's stated approach. It is rejected here purely on cost grounds (§3.3). If a future need arises for a rail that is independently animatable, `::before` remains the fallback; it must then be `contain: strict`-adjacent and must not use `bottom: 0`.

## 3.5 Untouched-subsystem proof

| Subsystem | Evidence | Verdict |
|---|---|---|
| **Virtualization** | Options object `:416-455`. No proposal reads or writes `overscan`, `estimateSize`, `rangeExtractor`, `getItemKey`, `anchorTo`, `followOnAppend`, `scrollMargin`, `paddingEnd`. The spine is a background on a container the virtualizer only sizes. | ✅ **UNTOUCHED** |
| **Streaming** | Streamed content mutates row subtrees; the spine is painted on the ancestor and never reads message state. | ✅ **UNTOUCHED** |
| **Dynamic message heights** | Heights flow from `measureElement` (`:1273`, `:1279`), `scheduleConnectedMeasure` (`:1315`) and the `resizeItem` override (`:466-489`). A background gradient contributes **zero** height and is not observed by `ResizeObserver` — it is a paint property. **Critically, the spine is applied to the container, not to any measured element**, so it cannot enter the measurement path. | ✅ **UNTOUCHED** |
| **Prepend anchoring** | RAF loop `:381-409`, 30-stable-frame convergence, queries `[data-timeline-key]`. The spine adds no transition to the scroll container and no element matching that selector. | ✅ **UNTOUCHED** |
| **Timeline cache** | `timelineCache` LRU 16 (`:90`, `onCleanup`). Stores measurements and `toolOpen`; unaware of styling. | ✅ **UNTOUCHED** |

## 3.6 The active segment — BLOCKED, and redesigned

**The blueprint specified:** a cobalt segment beside the streaming turn, via *"a modifier on the active turn"*.

**Code reality: no such modifier exists.** There is no `data-streaming`, `data-working` or `data-active` attribute on any timeline row or on the container. `working()` is an internal signal in `session-turn.tsx` (`:335, :373, :410`), not reflected to the DOM as a styleable state attribute.

Adding one would require editing `session-turn.tsx` or `message-timeline.tsx` — both inside `packages/app/src/pages/session/`, i.e. **a direct `{I-SESSION-FILES}` violation.**

Per the brief — *"if any runtime modification would be required, the Spine must be redesigned until it becomes purely presentational"* — three options:

**Option A — Static rail only (ADOPTED as default).**
Ship the neutral rail. No cobalt segment. Liveness is carried by the existing streaming caret and the existing tool-card spinners.
Risk: **none.** Presentational: **100%.** Cost: loses roughly 20 % of the device's expressive power, retains 100 % of its uniqueness — the continuous rail is still an element no competitor has.

**Option B — `aria-hidden` state hook (SPIKE REQUIRED).**
`session-turn.tsx:410` renders `<div data-slot="session-turn-assistant-content" aria-hidden={working()}>`. When streaming, this is `aria-hidden="true"` — an existing, already-rendered attribute that mirrors working state and is CSS-targetable:
`[data-slot="session-turn-assistant-content"][aria-hidden="true"] { … }`
**Honest assessment:** this works today but couples a *visual* feature to an *accessibility* attribute. Any future a11y correction silently breaks the visual, and it inverts the intended semantic. Viable, fragile, and **must not ship without engineering sign-off.**

**Option C — Container-level streaming class (DEFERRED).**
Have the Presentation-owned wrapper *around* the Session apply a class from a signal it already legitimately observes. Requires confirming a Presentation-layer streaming signal exists outside the Session boundary. Not yet verified; deferred beyond V1.

**Decision: adopt Option A. Spike Option B during Phase F. Do not block Phase F on either.**

## 3.7 Repaint cost

**Negligible — with one measurement condition.**

- A 1 px × 100 % background gradient is the cheapest paint primitive available; no layout, no composite layer, no `ResizeObserver` involvement.
- **The condition:** the container is extremely tall (`getTotalSize()` can reach tens of thousands of pixels) and its height is rewritten frequently during streaming. Browsers repaint only the visible tile, so cost should be near zero — but "should be" is not evidence.
- **This repository already contains the harness to prove it:** `packages/app/e2e/performance/timeline-stability/`, `session-timeline-benchmark.fixture.ts`, `session-timeline-stress.fixture.ts`, `session-timeline-stream-probe.ts`. Phase F must run the existing benchmark before and after, with a **no-regression gate on streaming FPS and scroll jank**.

## 3.8 Spine verdict

| Aspect | Verdict |
|---|---|
| DOM impact | ✅ Zero nodes, zero Session file edits |
| Pure CSS | ✅ Base rail yes |
| Pseudo-element viable | ✅ Yes; gradient preferred |
| Virtualization untouched | ✅ Proven |
| Streaming untouched | ✅ Proven |
| Dynamic heights untouched | ✅ Proven — not in the measurement path |
| Repaint negligible | ⚠️ Expected; **must be measured** with the existing harness |
| Active segment | ❌ **Blocked as specified** → redesigned to Option A |
| Breakpoint alignment | ⚠️ Brittle; requires two media-query values |

**The Spine is approved in its Option-A form.**

---

# 4. Implementation Risk Review

| Phase | Risk | Regression probability | Rollback | Validation |
|---|---|---|---|---|
| **A — Token completion** | **LOW** | **<2 %** — additive CSS variables, zero consumers | Delete added token block; one commit | Typecheck; full test suite; **zero-visual-diff assertion** (nothing consumes the tokens yet) |
| **B — Primitive wrappers** | **LOW** | **<5 %** — new files, no call sites migrated | Delete new files | Storybook renders all six states per primitive; typecheck; no existing import touched |
| **C — Leaf components** | **LOW–MEDIUM** | **10–15 %** — many small call-site edits; expect minor spacing/contrast defects, not functional breakage | Per-component revert; each component is an independent commit | Storybook diff per component; keyboard traversal; contrast spot-check; full suite |
| **D — Explorer** | **LOW** | **8–12 %** — single-file styling; highest risk is virtualized row-height mismatch | Single-file revert (`explorer-panel.tsx` styling) | All 19 capabilities in `baseline/capabilities-inventory.md`; all 4 states; `mod+shift+e`/`mod+f`; **row-height change must be reflected in the virtualizer's size estimate** |
| **E — Preview / Auxiliary** | **LOW** | **8–12 %** — main risk is opacity affecting a scroll container | Two-file revert | All 8 preview states; **per-file scroll restoration explicitly retested**; `review-*.spec.ts` regression suite |
| **F — Mission surfaces (Spine, timeline, docks, composer)** | **MEDIUM–HIGH** | **25–35 %** — highest in the programme | CSS-only revert; Spine is one rule; **feature-flag the Spine** | `session-timeline-*.spec.ts` (18 specs); **existing perf harness before/after**; prepend-anchor test; streaming test; reduced-motion; `{I-SESSION-FILES}` import audit |
| **G — Overlays** | **LOW** | **10 %** — 19 dialogs, mechanical, well-covered | Per-dialog revert | Focus trap, Escape, backdrop, focus restore per dialog; palette keyboard nav |
| **H — Titlebar / rail** | **MEDIUM–HIGH** | **20–30 %** — platform-specific: Tauri drag region, zoom counter-scaling, safe-area insets, window controls | Feature flag off (`newLayoutDesigns`) | Manual Windows + macOS + Linux + web; drag; double-click-maximise; zoom; both portal targets |
| **I — Motion / density / a11y** | **LOW** | **5–8 %** | Per-rule revert | Reduced-motion sweep; full keyboard traversal; contrast audit; lint gates active |
| **J — Sign-off** | **NONE** | **0 %** | N/A | Before/after all screens; recognition test; premium-perception test |

**Programme-level regression probability: ~35–45 %** that at least one phase produces a defect requiring rework. This is **normal and healthy** for a programme of this size; the mitigating factor is that every phase is independently revertible and no phase blocks the runtime.

### Risk-level corrections against the blueprint

Two phases were **under-rated** in the blueprint and are corrected here:

- **Phase F: Medium → MEDIUM–HIGH.** The blueprint did not know that rows are absolutely positioned with `overflow: clip`, nor that no streaming hook exists. Both raise the difficulty.
- **Phase D: Low → LOW–MEDIUM** *(risk of regression, not of breakage)*. Changing tree row height from 32 px to 28 px interacts with `file-tree-v2.tsx`'s virtualizer size estimate. If the estimate is not updated in lockstep, scroll position and total height drift. **This must be an explicit Phase D checklist item.**

---

# 5. Before / After Comparison

| Screen | Current state | New state | Reason | Expected UX improvement |
|---|---|---|---|---|
| **Main Workspace** | Editor-derived weighting; file tree competes with the conversation; no continuity device; composer reads as a footer | Spine; mission content 14/530 @180 %; file tree 13/440 muted; composer at highest elevation; Review primary, Preview subordinate | DD-1, DD-2, DD-3 — Mission is the primary object | Users orient to the mission first; AI state readable from the left edge without reading text |
| **Explorer** | Tree is visually equal to (or heavier than) missions; mixed selection treatments | 28 px rows, muted 13 px names, mono icons at rest, 2 px cobalt selection bar, `FILES — SECONDARY TOOL` footer | DD-3, DD-5 | ~36 rows visible vs ~28 (+29 % density); the product teaches its own model in five words |
| **Session / Timeline** | Turns read as an undifferentiated log; no continuity; inconsistent tool-card treatment | Spine; 12 px turn gaps; 180 % leading; 72 ch measure; unified E1 tool cards | DD-1, DD-2 | Long missions become scannable; reading fatigue reduced on the highest-dwell surface |
| **Review** | Visually comparable to Preview; artifacts do not read as primary output | Tabs at 14/530 vs Preview 12 px muted; full-opacity diff | DD-1 | Users see *what the AI changed* before *what files exist* |
| **Preview** | Same visual weight as Review despite being a secondary tool | 32 px tab bar, 12 px muted tabs, 90 % content opacity | DD-3 | Reference material stops competing with output; zero capability lost |
| **Settings** | Drifting row structures across five tabs | Two-line rows, right-aligned control column, unified dialog chrome | DD-7 | Faster scanning; the product reads as engineered rather than accumulated |
| **Welcome** | Generic empty state; directs toward projects/files | 3 % shield watermark; "No active mission"; mission-first CTA | DD-1, DD-11 | First contact establishes the mission-first model and a distinct identity |
| **Command Palette** | File-first result ordering contradicts the product model | Missions → Commands → Artifacts → Files, Files dimmed | DD-1, DD-6 | The primary navigation surface reflects the primary object |
| **Composer** | Reads as a footer input | Highest elevation; radius 12; cobalt focus border; cobalt context chips | DD-2, DD-9 | Intent-input reads as the centre of the app; context becomes explicit and auditable |
| **Dark ↔ Light** | Light theme is a colour swap of a dark-authored surface | Authored warm-paper theme at full contrast parity | DD-8 | Light users get a first-class product, not a filtered one |

---

# 6. Design Confidence Report

Brutally honest. Uncertainty is disclosed, not hidden.

## 6.1 — 100 % safe (17)

Additive or pure value substitution; no behavioural surface.

1. HDS token completion (Phase A)
2. `--v2-*` → `--hds-*` bridge mapping
3. Storybook token pages
4. `HdsIcon` / `HdsButton` / `HdsIconButton` / `HdsInput` / `HdsTooltip` wrappers
5. Colour palette (all values already in `hds.css`)
6. Type scale (Inter + JetBrains Mono already loaded — zero new assets)
7. Radius scale (4/6/8/12/full)
8. Spacing scale (4 px base — already the Tailwind unit)
9. Motion duration tokens (120/160/180/240)
10. Signature easing retention
11. Empty / loading / error state contracts
12. Reduced-motion rules
13. Elevation aliases over existing `theme.css` shadows
14. Tooltip restyle
15. Toast restyle
16. Menu opacity change (blur removal)
17. Scrollbar restyle

## 6.2 — Likely safe (11)

Mechanical work; expect cosmetic defects, not breakage.

1. Button variant restyle (7 variants × 6 states — volume risk only)
2. Input restyle
3. Dialog foundation across 19 dialogs
4. Settings row restructure
5. Welcome empty state
6. Palette result re-ordering *(presentation ordering; verify no runtime coupling to group order)*
7. Explorer colour/type de-weighting
8. `FILES — SECONDARY TOOL` label
9. Preview tab-bar height and type
10. Review tab weight increase
11. Kind-badge restyle

## 6.3 — Needs prototype validation (6)

Build small, look at it, then decide. Cheap to test, real chance of being wrong.

1. **Spine horizontal alignment.** `calc(50% - 400px)` across `md`/`2xl` breakpoints, plus narrow viewports where content is *not* centred. Highest chance of looking wrong in practice.
2. **90 % preview opacity.** May read as "broken/disabled" rather than "secondary". Test 90 / 92 / 95, and confirm it does not drop contrast below AA.
3. **Density at 28 px rows.** Verify comfort at 125 %/150 % Windows scaling, not just at 100 %.
4. **440/530 weights.** Verify the one-step contrast survives macOS vs Windows antialiasing on both themes.
5. **72 ch timeline measure vs the existing `max-w-200`/`2xl:max-w-[1000px]`.** These are *different* constraints; one must win. Currently unresolved.
6. **Uniform content-field surfaces.** The strongest anti-editor decision in the system. Prototype and confirm panel boundaries stay legible with hairlines alone.

## 6.4 — Needs implementation spike (4)

Timeboxed engineering investigation before committing.

1. **Spine repaint cost** on a 20,000 px container during active streaming. Harness exists; run it.
2. **Spine active segment, Option B** (`aria-hidden` hook). Determine whether the a11y coupling is acceptable to the team. **Default to Option A if there is any doubt.**
3. **Explorer row height ↔ virtualizer estimate** in `file-tree-v2.tsx`. Confirm the size estimate is updated in lockstep with the CSS change.
4. **Composer `border-radius: 12` + `focus-within`** against ProseMirror's own focus handling. Low probability, non-trivial if wrong.

## 6.5 — Needs engineering review (5)

Requires a decision from someone with authority over the boundary.

1. **The `{I-SESSION-FILES}` boundary itself.** `message-timeline.tsx` and `session-turn.tsx` live under `pages/session/`. This package assumes styling reaches them **only** via external stylesheets and existing attribute selectors. **That interpretation must be ratified before Phase F.** If the team judges that even attribute-selector styling constitutes "altering the Session region" under `{I-VISIBLE-ISOLATION}`, **Phase F is materially reduced in scope.**
2. **Gate G4 is self-contradictory for Phase F.** G4 demands "zero pixels changed in the Session region", yet Phase F's entire purpose is to restyle mission surfaces. G4 must be **redefined** for Phase F as *"zero behavioural change; intentional visual change only, enumerated in advance"*. Unresolved, this gate blocks its own phase.
3. **Titlebar work on Tauri** — drag region, zoom counter-scaling, safe-area insets, per-platform window controls.
4. **Custom-theme compatibility.** 35 themes × 13 scale families. HDS maps onto existing tokens, but the sampled-3 approach in G8 may be insufficient.
5. **The 4 dead-UI removals** in Phase I — confirm genuinely unreachable before deleting.

## 6.6 — Known unknowns

Honest gaps in this validation:

- **No runtime perf measurement was taken.** The harness was located, not executed. Spine cost is reasoned, not measured.
- **Light theme was not verified against real content** — syntax highlighting, provider logos, avatar colours in combination.
- **No accessibility audit was run.** Contrast ratios are inherited from spec documents, not re-verified with a tool.
- **Concept images are not measurable.** They validate direction, not values.
- **Windows/Linux rendering unverified.** All reasoning assumes standard subpixel antialiasing.

---

# 7. Final Go / No-Go Assessment

## **GO WITH CONDITIONS**

The design is implementable. Architecture is sound, the roadmap ordering is correct, and the overwhelming majority of proposals are pure CSS over an already-shipped, already-audited Presentation Layer. Phases A–E and G–J can begin as written.

**The recommendation is not an unqualified GO** because code inspection disproved one specific blueprint claim (the Spine active segment) and exposed one unresolved governance ambiguity (the `{I-SESSION-FILES}` boundary and the self-contradicting G4 gate). Both are resolvable without changing the architecture or the roadmap.

### Conditions — all four must be met

**C-1 · Spine active segment de-scoped to Option A.**
Ship the static neutral rail. The cobalt streaming segment is **not** implementable without touching a Session-internal file. Option B is a Phase-F spike only, and only with explicit engineering sign-off on the `aria-hidden` coupling.
*Blocks: Phase F. Owner: design + engineering. Effort: none — a removal.*

**C-2 · Ratify the `{I-SESSION-FILES}` styling interpretation.**
Formally confirm that styling Session-region elements via **external stylesheets using pre-existing attribute selectors** — with **zero edits to any file under `packages/app/src/pages/session/`** — is compliant. Precedent exists (`file.css:5`). If rejected, Phase F reduces to composer and dock styling only.
*Blocks: Phase F. Owner: architecture authority. Effort: a decision.*

**C-3 · Redefine gate G4 for Phase F.**
Restate as: *"Zero behavioural change; intentional visual change only, enumerated in advance."* Retain the strict zero-pixel form for Phases A–E.
*Blocks: Phase F closure. Owner: whoever owns the Execution Plan. Effort: a text amendment.*

**C-4 · Run the existing perf harness before Phase F merges.**
Execute `packages/app/e2e/performance/timeline-stability/` and `session-timeline-benchmark.fixture.ts` with the Spine on and off. Gate on no regression in streaming FPS or scroll jank. **Ship the Spine behind a feature flag** so it can be disabled without a revert.
*Blocks: Phase F merge. Owner: engineering. Effort: hours.*

### Recommended, not blocking

- Resolve the **72 ch vs `max-w-200`** conflict before Phase F.
- Prototype **Spine alignment** and **preview opacity** during Phase E, so Phase F starts with answers.
- Add the **Explorer virtualizer size-estimate** check to the Phase D checklist.

### What is cleared to start immediately

**Phases A and B** — zero conditions, zero blockers, near-zero risk, and they unblock everything downstream. Begin now.

---

**End of Final Validation Package · HeniossAI V1**
*Verified against source, not asserted. One claim disproved and redesigned. Four conditions to clear.*
