import type { JSX } from "solid-js"
import { Show } from "solid-js"
import { Icon, type IconProps } from "@opencode-ai/ui/icon"
import { Spinner } from "@opencode-ai/ui/spinner"

/**
 * HDS universal state contracts (Blueprint §8.17, Phase C).
 *
 * Every panel in the product implements empty / loading / error identically.
 * This is what makes 202 components feel like one product (DD-7).
 *
 * BEFORE: explorer-panel.tsx and preview-panel.tsx each defined their own
 * EmptyState / LoadingState / ErrorState. They had drifted apart:
 *   - Explorer used 13px text + `text-v2-text-text-muted` + radius 4px
 *   - Preview  used 12px text + `text-text-weak`        + radius `md`
 * Same three states, two visual languages, two token families.
 *
 * AFTER: one implementation, HDS tokens, per the Blueprint contract:
 *   Empty   — centred column · 24px faint icon · 8px · 14/530 strong title
 *             · 4px · 13/440 muted description · 12px · optional action
 *   Loading — 16px spinner + 8px + 13/440 muted label
 *   Error   — 16px critical icon + 8px + 13/440 critical message
 *             + 12px + Retry secondary button    ("no error without a remedy")
 *
 * SCOPE: presentation only. These render markup and consume CSS variables.
 * No runtime, state, provider or data-flow involvement. Callers keep their
 * exact existing props and copy, so behaviour is unchanged {I-BACKWARD}.
 */

export interface HdsEmptyStateProps {
  /** Blueprint §8.17: 24px icon, `text-faint`. */
  icon?: IconProps["name"]
  /** 14px / 530 / text-strong. */
  title: string
  /** 13px / 440 / text-muted. Max ~44ch. */
  description?: string
  /** Optional primary action. */
  action?: JSX.Element
}

export function HdsEmptyState(props: HdsEmptyStateProps): JSX.Element {
  return (
    <div
      data-hds-state="empty"
      class="h-full w-full flex flex-col items-center justify-center text-center"
      style={{ padding: "var(--hds-spacing-4)" }}
    >
      <Show when={props.icon}>
        <Icon
          name={props.icon!}
          class="opacity-90"
          style={{
            width: "24px",
            height: "24px",
            color: "var(--hds-text-faint)",
            "margin-bottom": "var(--hds-spacing-2)",
          }}
        />
      </Show>
      <span
        style={{
          "font-size": "var(--hds-size-14)",
          "line-height": "var(--hds-line-14)",
          "font-weight": "var(--hds-weight-medium)",
          color: "var(--hds-text-strong)",
        }}
      >
        {props.title}
      </span>
      <Show when={props.description}>
        <span
          style={{
            "font-size": "var(--hds-size-13)",
            "line-height": "var(--hds-line-13)",
            "font-weight": "var(--hds-weight-regular)",
            color: "var(--hds-text-muted)",
            "margin-top": "var(--hds-spacing-1)",
            "max-width": "44ch",
          }}
        >
          {props.description}
        </span>
      </Show>
      <Show when={props.action}>
        <div style={{ "margin-top": "var(--hds-spacing-3)" }}>{props.action}</div>
      </Show>
    </div>
  )
}

export interface HdsLoadingStateProps {
  /** 13px / 440 / text-muted. */
  label?: string
}

export function HdsLoadingState(props: HdsLoadingStateProps): JSX.Element {
  return (
    <div
      data-hds-state="loading"
      class="h-full w-full flex flex-col items-center justify-center"
      style={{ padding: "var(--hds-spacing-4)", gap: "var(--hds-spacing-2)" }}
    >
      {/*
        Uses the real Spinner component, not <Icon name="spinner" />.
        Neither icon module defines a "spinner" symbol, so the previous
        panel-local implementations emitted <use href="#spinner"> which
        resolves to nothing and rendered an EMPTY box. Spinner is
        self-animating (CSS keyframes in spinner.css), so no animate-spin.
      */}
      <Spinner style={{ width: "16px", height: "16px", color: "var(--hds-text-muted)" }} />
      <Show when={props.label}>
        <span
          style={{
            "font-size": "var(--hds-size-13)",
            "line-height": "var(--hds-line-13)",
            "font-weight": "var(--hds-weight-regular)",
            color: "var(--hds-text-muted)",
          }}
        >
          {props.label}
        </span>
      </Show>
    </div>
  )
}

export interface HdsErrorStateProps {
  message: string
  onRetry?: () => void
  /** Defaults to "Retry". */
  retryLabel?: string
}

export function HdsErrorState(props: HdsErrorStateProps): JSX.Element {
  return (
    <div
      data-hds-state="error"
      class="h-full w-full flex flex-col items-center justify-center text-center"
      style={{ padding: "var(--hds-spacing-4)", gap: "var(--hds-spacing-2)" }}
    >
      <div class="flex items-center" style={{ gap: "var(--hds-spacing-2)" }}>
        <Icon
          name="warning"
          style={{ width: "16px", height: "16px", color: "var(--hds-critical)", "flex-shrink": "0" }}
        />
        <span
          style={{
            "font-size": "var(--hds-size-13)",
            "line-height": "var(--hds-line-13)",
            "font-weight": "var(--hds-weight-regular)",
            color: "var(--hds-critical)",
          }}
        >
          {props.message}
        </span>
      </div>
      {/* Blueprint §8.17: an error is never shown without a recovery action. */}
      <Show when={props.onRetry}>
        <button
          type="button"
          onClick={() => props.onRetry?.()}
          class="cursor-pointer"
          style={{
            height: "var(--hds-row-base)",
            padding: `0 var(--hds-spacing-3)`,
            "border-radius": "var(--hds-radius-6)",
            border: "1px solid var(--hds-border-base)",
            background: "var(--hds-bg-layer-01)",
            color: "var(--hds-text-base)",
            "font-size": "var(--hds-size-13)",
            "font-weight": "var(--hds-weight-medium)",
            transition: `background var(--hds-motion-fast) var(--hds-ease-default)`,
          }}
        >
          {props.retryLabel ?? "Retry"}
        </button>
      </Show>
    </div>
  )
}
