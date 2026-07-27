import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import { join } from "node:path"

/**
 * Phase I — HDS token discipline (Blueprint §11.10 governance).
 *
 * These lock the two invariants most likely to regress silently during future
 * work, both of which were real defects found during implementation.
 */

const UI_STYLES = join(import.meta.dir, "../../ui/src/styles")
const hds = readFileSync(join(UI_STYLES, "hds.css"), "utf8")

const HDS_FILES = [
  "hds-explorer.css",
  "hds-preview.css",
  "hds-overlay.css",
  "hds-timeline.css",
  "hds-mission.css",
  "hds-mission-composer.css",
  "hds-titlebar.css",
]

describe("theme compatibility (the Phase A fix)", () => {
  /**
   * ThemeProvider (ui/src/theme/context.tsx:143-155) injects a :root stylesheet
   * at runtime that redefines the --v2-* variables for the active theme. A
   * hard-coded HDS colour would ignore the active theme and break switching
   * across all 35 themes. Every colour token must therefore derive.
   */
  test("every HDS colour token derives from --v2-* or composes the accent", () => {
    const tokens = [
      ...hds.matchAll(
        /^\s*(--hds-(?:bg|text|border|interactive|success|warning|critical|info)[a-z0-9-]*):\s*([^;]+);/gm,
      ),
    ]
    expect(tokens.length).toBeGreaterThan(20)

    const hardCoded = tokens
      .filter(([, , value]) => {
        const derived = value.includes("var(--v2-") || value.includes("var(--text-diff")
        const composed = value.includes("color-mix(") && value.includes("var(--hds-interactive-base)")
        return !derived && !composed
      })
      .map(([, name]) => name)

    expect(hardCoded).toEqual([])
  })

  test("fallbacks are still present so tokens resolve without a theme", () => {
    expect(hds).toContain("var(--v2-background-bg-base, ")
    expect(hds).toContain("var(--v2-text-text-muted, ")
  })
})

describe("motion discipline (Blueprint §7.2 Rule M-1)", () => {
  test("no hard-coded durations outside the motion token definitions", () => {
    for (const file of HDS_FILES) {
      const css = readFileSync(join(UI_STYLES, file), "utf8")
      // Strip comments before scanning so prose cannot trip the check.
      const code = css.replace(/\/\*[\s\S]*?\*\//g, "")
      const durations = code.match(/\b\d+m?s\b/g) ?? []
      expect({ file, durations }).toEqual({ file, durations: [] })
    }
  })

  test("no raw hex colours in HDS component stylesheets", () => {
    for (const file of HDS_FILES) {
      const css = readFileSync(join(UI_STYLES, file), "utf8")
      const code = css.replace(/\/\*[\s\S]*?\*\//g, "")
      const hex = code.match(/#[0-9a-fA-F]{3,8}\b/g) ?? []
      expect({ file, hex }).toEqual({ file, hex: [] })
    }
  })
})

describe("Spine remains presentation-only (Validation Package §3)", () => {
  const spineRaw = readFileSync(join(UI_STYLES, "hds-timeline.css"), "utf8")
  // Strip comments: the header legitimately DISCUSSES ::before and the blocked
  // active segment, and must not trip the checks below.
  const spine = spineRaw.replace(/\/\*[\s\S]*?\*\//g, "")

  test("targets the existing container attribute, adds no new hook", () => {
    expect(spine).toContain("[data-timeline-virtual-content]")
  })

  test("is painted, not laid out — background only, never ::before", () => {
    expect(spine).toContain("background-image")
    expect(spine).not.toContain("::before")
  })

  test("does not reintroduce the blocked active segment", () => {
    // The cobalt streaming segment needs a DOM streaming hook that does not
    // exist; adding one would violate {I-SESSION-FILES}. Option A only.
    expect(spine).not.toContain("data-streaming")
    expect(spine).not.toContain("data-working")
  })
})
