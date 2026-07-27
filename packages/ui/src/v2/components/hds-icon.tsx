import { splitProps, type ComponentProps } from "solid-js"
import { Icon, type IconProps } from "./icon"

/**
 * HdsIcon — the one UI icon system (Blueprint §6.2, Design Directive DD-7).
 *
 * A thin, additive wrapper over the existing IconV2 implementation. It exists to
 * enforce two rules that IconV2 cannot express on its own:
 *
 *   1. A four-step size scale (Blueprint §6.4)
 *        xs 12px  chevrons, close-small, chip icons, tree chevrons
 *        sm 16px  DEFAULT — toolbars, buttons, menu items, tabs
 *        md 20px  dialog header icons, activity rail
 *        lg 24px  empty states, welcome
 *
 *      IconV2's own scale is small=14 / normal=16 / large=20, which has no 12px
 *      and no 24px step. Rather than change IconV2 (it has existing callers and
 *      {I-BACKWARD} applies), HdsIcon sets width/height explicitly.
 *
 *   2. Non-scaling 1.5px stroke (Blueprint §6.3). A 24px icon still draws at
 *      1.5px, never 2.25px. Scaling stroke with size is the most common way an
 *      icon set stops feeling like a set.
 *
 * ZERO behavioural change: rendering, sprite injection and the `use href`
 * mechanism all remain IconV2's. This component adds attributes and forwards.
 * Existing `Icon` / `IconV2` callers are untouched {I-BACKWARD}.
 */

export const HDS_ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
} as const

export type HdsIconSize = keyof typeof HDS_ICON_SIZES

export interface HdsIconProps extends Omit<ComponentProps<"svg">, "size"> {
  name: IconProps["name"]
  /** Blueprint §6.4 scale. Defaults to `sm` (16px). */
  size?: HdsIconSize
}

export function HdsIcon(props: HdsIconProps) {
  const [split, rest] = splitProps(props, ["name", "size"])
  const px = () => HDS_ICON_SIZES[split.size ?? "sm"]

  return (
    <Icon
      {...rest}
      name={split.name}
      data-hds-icon=""
      data-hds-size={split.size ?? "sm"}
      width={px()}
      height={px()}
      // Absolute, non-scaling stroke. `vector-effect` keeps the stroke at 1.5px
      // regardless of the viewBox-to-pixel ratio.
      stroke-width={1.5}
      vector-effect="non-scaling-stroke"
    />
  )
}
