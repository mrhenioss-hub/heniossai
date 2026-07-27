import { splitProps, type ComponentProps } from "solid-js"
import { ButtonV2, type ButtonV2Props } from "./button-v2"
import { IconButtonV2, type IconButtonV2Props } from "./icon-button-v2"
import { TextInputV2, type TextInputV2Props } from "./text-input-v2"

/**
 * HDS primitive wrappers (Blueprint §12.3 Phase B, Design Directive DD-7).
 *
 * These are DELIBERATELY thin. Each forwards to its existing V2 counterpart and
 * adds only:
 *   - a `data-hds` marker so HDS-adopting call sites are greppable and can be
 *     targeted by HDS stylesheets without affecting legacy call sites, and
 *   - the Blueprint's vocabulary mapped onto the existing V2 prop values.
 *
 * They intentionally do NOT re-implement styling. The V2 components already
 * carry the correct geometry (button radius 6px, weight 530, 13px/20px), and
 * duplicating that would create a second source of truth — precisely the
 * problem HDS exists to remove.
 *
 * {I-BACKWARD}: purely additive. No existing component, prop or call site is
 * modified. Nothing consumes these yet; Phase C migrates call sites.
 * {I-NO-DEPS}: no new packages.
 */

/* ==========================================================================
   Button (Blueprint §8.1)
   ========================================================================== */

/**
 * Blueprint variant vocabulary -> existing ButtonV2 variants.
 *
 * The Blueprint names seven variants; ButtonV2 already implements the same
 * seven under partly different names. Mapping rather than renaming avoids
 * touching button-v2.css and its existing consumers.
 */
export type HdsButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "ghost-muted"
  | "neutral"
  | "contrast"
  | "destructive"

export const HDS_BUTTON_VARIANT: Record<HdsButtonVariant, NonNullable<ButtonV2Props["variant"]>> = {
  primary: "contrast",
  secondary: "outline",
  ghost: "ghost",
  "ghost-muted": "ghost-muted",
  neutral: "neutral",
  contrast: "contrast",
  destructive: "danger",
}

export interface HdsButtonProps extends Omit<ButtonV2Props, "variant"> {
  variant?: HdsButtonVariant
}

export function HdsButton(props: HdsButtonProps) {
  const [split, rest] = splitProps(props, ["variant"])
  return <ButtonV2 {...rest} data-hds="button" variant={HDS_BUTTON_VARIANT[split.variant ?? "secondary"]} />
}

/* ==========================================================================
   Icon button (Blueprint §8.1)
   ========================================================================== */

/**
 * Note: IconButtonV2 is declared as `ComponentProps<"button"> & IconButtonV2Props`,
 * so the wrapper must mirror that intersection exactly — `IconButtonV2Props`
 * alone widens `type` to `string` and fails to assign.
 */
export type HdsIconButtonProps = ComponentProps<"button"> & IconButtonV2Props

export function HdsIconButton(props: HdsIconButtonProps) {
  return <IconButtonV2 {...props} data-hds="icon-button" />
}

/* ==========================================================================
   Input (Blueprint §8.2)
   ========================================================================== */

export interface HdsInputProps extends Omit<TextInputV2Props, "appearance"> {
  /**
   * Blueprint §8.2: 32px default, 28px compact in toolbars.
   * Maps onto TextInputV2's existing `appearance` ("large" = 32, "base" = 28).
   */
  size?: "compact" | "base"
}

export function HdsInput(props: HdsInputProps) {
  const [split, rest] = splitProps(props, ["size"])
  return <TextInputV2 {...rest} data-hds="input" appearance={split.size === "compact" ? "base" : "large"} />
}
