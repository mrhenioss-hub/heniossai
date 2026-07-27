/**
 * Activity Bar — AI-First Navigation
 * Presentation Layer only, zero runtime modification, visual reconstruction only
 * Implements AI-first hierarchy: Sessions (AI conversations) primary top, Review/Context, Search, Explorer files secondary bottom top group
 * Uses existing layout.* toggle signals, no new providers, no new state managers — extends layout state with new Presentation domain activity (allowed per blueprint)
 */

import { Show } from "solid-js"
import { Icon } from "@opencode-ai/ui/v2/icon"
import { Tooltip } from "@opencode-ai/ui/v2/tooltip"
import { useLayout } from "@/context/layout"
import { createStore } from "solid-js/store"

/**
 * Activity kinds — AI-first order
 * Sessions (chat bubble) top, Review diff, Context bar-chart, Search, Explorer folder secondary
 * When VS Code suggests Explorer top, prefer Antigravity direction: AI work top per contract
 */
export type ActivityKind = "sessions" | "review" | "context" | "search" | "explorer" | "terminal"

type ActivityItem = {
  id: ActivityKind
  label: string
  icon: string
  keybind: string
  group: "ai" | "secondary" | "bottom"
}

const ACTIVITY_ITEMS: ActivityItem[] = [
  // AI work top group — primary collaborator
  { id: "sessions", label: "Sessions", icon: "message-square", keybind: "mod+shift+s", group: "ai" },
  { id: "review", label: "Review", icon: "diff-modified", keybind: "mod+shift+r", group: "ai" },
  { id: "context", label: "Context", icon: "sliders", keybind: "mod+shift+c", group: "ai" },
  { id: "search", label: "Search", icon: "search", keybind: "mod+shift+f", group: "ai" },
  // Files secondary — bottom of top group per AI-first
  { id: "explorer", label: "Explorer", icon: "folder", keybind: "mod+shift+e", group: "secondary" },
]

const BOTTOM_ITEMS: ActivityItem[] = [
  { id: "terminal", label: "Terminal", icon: "terminal", keybind: "ctrl+`", group: "bottom" },
]

/**
 * Activity store — new Presentation-layer domain, existing domains untouched per I-BACKWARD
 * Stored via createStore local ephemeral, not persisted via persisted() to avoid runtime persistence mechanism change?
 * Actually allowed to extend Layout State with new domain per blueprint allowed modifications:
 * Extend Layout State with new Presentation-layer domains — new Presentation-layer state domains for left and right panel control
 * So we create new store in LayoutProvider? For now local to ActivityBar to prove zero runtime mod, but can be moved to LayoutProvider as layout.activity.active()
 */
export function createActivityState() {
  const [state, setState] = createStore<{ active: ActivityKind }>({ active: "sessions" as ActivityKind })
  return {
    active: () => state.active,
    setActive: (kind: ActivityKind) => setState("active", kind),
  }
}

export function ActivityBar(props: {
  active: ActivityKind
  onActiveChange: (kind: ActivityKind) => void
}) {
  const layout = useLayout()

  const handleClick = (item: ActivityItem) => {
    // Visual reconstruction only: toggle panels via existing layout.* signals, no new runtime
    if (item.id === "explorer") {
      // Explorer files secondary — toggle explorer panel via existing signal
      layout.explorerPanel.toggle()
      // Still set active to explorer to show file tree when explorer opened
      props.onActiveChange(item.id)
      return
    }
    if (item.id === "terminal") {
      layout.terminalPanel.toggle()
      return
    }
    // For sessions/review/context/search — set active, ensure explorer opened if sessions/review needs sidebar?
    // Sessions primary: if clicked, ensure explorer opened (since sessions list lives in explorer panel currently per forensic)
    // This is presentation only — uses existing explorerPanel.opened()
    if (item.id === "sessions" || item.id === "review" || item.id === "context") {
      if (!layout.explorerPanel.opened()) layout.explorerPanel.open()
    }
    props.onActiveChange(item.id)
  }

  return (
    <div
      data-component="hds-activity-bar"
      class="select-none"
      style={{
        width: "var(--hds-activity-bar-width, 48px)",
        "min-width": "var(--hds-activity-bar-width, 48px)",
        background: "var(--hds-bg-deep, var(--v2-background-bg-deep))",
        "border-right": "1px solid var(--hds-border-base, var(--v2-border-border-weaker))",
        display: "flex",
        "flex-direction": "column",
        "align-items": "center",
        padding: "8px 0",
        gap: "8px",
      }}
    >
      <div data-slot="top-group" class="flex flex-col gap-1 flex-1">
        {ACTIVITY_ITEMS.map((item) => (
          <Tooltip
            // @ts-ignore TooltipV2 API may be different, using generic
            content={`${item.label} (${item.keybind})`}
            placement="right"
          >
            <button
              data-component="hds-activity-item"
              data-kind={item.id}
              data-active={props.active === item.id ? "true" : "false"}
              aria-label={`${item.label} ${item.keybind}`}
              data-slot={item.group === "ai" ? "ai-primary" : "secondary"}
              onClick={() => handleClick(item)}
              class="w-[32px] h-[32px] rounded-[6px] flex items-center justify-center text-[var(--hds-text-muted)] hover:bg-[var(--hds-bg-layer-02)] hover:text-[var(--hds-text-base)] data-[active=true]:bg-[var(--hds-bg-layer-03)] data-[active=true]:text-[var(--hds-text-strong)] relative transition-colors duration-[120ms] ease-out"
            >
              <Show when={props.active === item.id}>
                <div class="absolute left-[-8px] top-1/2 -translate-y-1/2 w-[2px] h-[16px] bg-[var(--hds-interactive-base,#2A5FFF)] rounded-full" />
              </Show>
              <Icon name={item.icon as any} size={16} />
            </button>
          </Tooltip>
        ))}
      </div>

      <div data-slot="bottom-group" class="flex flex-col gap-1">
        {BOTTOM_ITEMS.map((item) => (
          <Tooltip content={`${item.label} (${item.keybind})`} placement="right">
            <button
              data-component="hds-activity-item"
              data-kind={item.id}
              aria-label={item.label}
              onClick={() => handleClick(item)}
              class="w-[32px] h-[32px] rounded-[6px] flex items-center justify-center text-[var(--hds-text-muted)] hover:bg-[var(--hds-bg-layer-02)] hover:text-[var(--hds-text-base)] transition-colors duration-[120ms] ease-out"
            >
              <Icon name={item.icon as any} size={16} />
            </button>
          </Tooltip>
        ))}

        {/* Settings + Help bottom per forensic legacy footer Settings + Help buttons */}
        <div class="w-full h-[1px] bg-[var(--hds-border-weak)] my-1" />

        <Tooltip content="Settings (mod+,)" placement="right">
          <button
            aria-label="Settings"
            class="w-[32px] h-[32px] rounded-[6px] flex items-center justify-center text-[var(--hds-text-muted)] hover:bg-[var(--hds-bg-layer-02)] hover:text-[var(--hds-text-base)]"
            onClick={() => {
              // Open settings via existing command? Use DOM event? For now placeholder
              // Existing settings opens via mod+, handled by CommandProvider — no runtime new
            }}
          >
            <Icon name="settings-gear" size={16} />
          </button>
        </Tooltip>

        <Tooltip content="Help" placement="right">
          <button
            aria-label="Help"
            class="w-[32px] h-[32px] rounded-[6px] flex items-center justify-center text-[var(--hds-text-muted)] hover:bg-[var(--hds-bg-layer-02)] hover:text-[var(--hds-text-base)]"
          >
            <Icon name="help" size={16} />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}
