import { describe, expect, test } from "bun:test"
import { HDS_ICON_SIZES } from "@opencode-ai/ui/v2/hds-icon"
import { HDS_BUTTON_VARIANT } from "@opencode-ai/ui/v2/hds-primitives"

/**
 * Phase B verification (Blueprint §12.3).
 *
 * NOTE ON SCOPE: this repo compiles JSX with `jsx: "preserve"` and Bun's test
 * runner does not apply Solid's JSX transform, so no test in this package
 * renders a component (every existing test asserts on plain functions/state).
 * Component rendering is covered by Storybook and the Playwright e2e suites.
 *
 * These tests therefore lock the two things the wrappers exist to guarantee and
 * that ARE unit-testable: the icon size scale and the variant mapping table.
 * Both are the contracts most likely to drift silently during Phase C
 * migration.
 */

describe("HdsIcon size scale (Blueprint §6.4)", () => {
  test("is exactly xs/sm/md/lg -> 12/16/20/24", () => {
    expect(HDS_ICON_SIZES).toEqual({ xs: 12, sm: 16, md: 20, lg: 24 })
  })

  test("includes the 12px and 24px steps IconV2 lacks", () => {
    // IconV2's own scale is small=14 / normal=16 / large=20.
    const values = Object.values(HDS_ICON_SIZES)
    expect(values).toContain(12)
    expect(values).toContain(24)
    expect(values).not.toContain(14)
  })
})

describe("HdsButton variant mapping (Blueprint §8.1)", () => {
  test("maps all seven Blueprint variants onto existing ButtonV2 variants", () => {
    expect(HDS_BUTTON_VARIANT).toEqual({
      primary: "contrast",
      secondary: "outline",
      ghost: "ghost",
      "ghost-muted": "ghost-muted",
      neutral: "neutral",
      contrast: "contrast",
      destructive: "danger",
    })
  })

  test("destructive maps to danger, never to a bare colour override", () => {
    expect(HDS_BUTTON_VARIANT.destructive).toBe("danger")
  })

  test("every mapped target is a variant ButtonV2 actually implements", () => {
    const supported = new Set(["neutral", "danger", "warning", "outline", "contrast", "ghost", "ghost-muted", "loading"])
    for (const target of Object.values(HDS_BUTTON_VARIANT)) {
      expect(supported.has(target)).toBe(true)
    }
  })
})
