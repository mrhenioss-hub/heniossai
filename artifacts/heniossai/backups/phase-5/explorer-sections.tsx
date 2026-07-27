import { createSignal, Show, type JSX } from "solid-js"
import { Icon } from "@opencode-ai/ui/v2/icon"

export interface CollapsibleSectionProps {
  title: string
  defaultOpen?: boolean
  children: JSX.Element
  onContentClass?: string
}

export function CollapsibleSection(props: CollapsibleSectionProps) {
  const [open, setOpen] = createSignal(props.defaultOpen ?? true)

  return (
    <div class="flex flex-col">
      <button
        type="button"
        class="flex items-center gap-1.5 w-full px-3 py-1.5 text-12-medium text-text-strong hover:bg-surface-base transition-colors cursor-pointer text-left"
        onClick={() => setOpen(!open())}
        aria-expanded={open()}
      >
        <Icon name={open() ? "chevron-down" : "chevron-right"} class="w-3.5 h-3.5 text-text-weak shrink-0" />
        <span class="truncate">{props.title}</span>
      </button>
      <Show when={open()}>
        <div class={`flex flex-col overflow-visible ${props.onContentClass ?? ""}`}>
          {props.children}
        </div>
      </Show>
    </div>
  )
}
