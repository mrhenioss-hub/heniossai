import { createEffect, Show, Suspense, type ParentProps } from "solid-js"
import { createStore } from "solid-js/store"
import { useNavigate } from "@solidjs/router"
import { createMediaQuery } from "@solid-primitives/media"
import { ResizeHandle } from "@opencode-ai/ui/resize-handle"
import { DebugBar } from "@/components/debug-bar"
import { ExplorerPanel } from "@/components/explorer-panel"
import { PreviewPanel } from "@/components/preview-panel"
import { TabsInfoPopup } from "@/components/help-button"
import { Titlebar, type TitlebarUpdate } from "@/components/titlebar"
import { useCommand } from "@/context/command"
import { useLayout } from "@/context/layout"
import { usePlatform } from "@/context/platform"
import { setNavigate } from "@/utils/notification-click"
import { setV2Toast, ToastRegion } from "@/utils/toast"

export default function NewLayout(props: ParentProps) {
  const layout = useLayout()
  const platform = usePlatform()
  const navigate = useNavigate()
  const command = useCommand()
  setNavigate(navigate)
  const [state, setState] = createStore({ debugTools: true })

  createEffect(() => setV2Toast(true))

  const isDesktop = createMediaQuery("(min-width: 768px)")

  createEffect(() => {
    if (!isDesktop()) {
      if (layout.explorerPanel.opened()) layout.explorerPanel.close()
      if (layout.previewPanel.opened()) layout.previewPanel.close()
    }
  })

  createEffect(() => {
    command.register("heniossai-panels", () => [
      {
        id: "explorerPanel.toggle",
        title: "Toggle Explorer Panel",
        category: "View",
        keybind: "mod+shift+e",
        onSelect: () => layout.explorerPanel.toggle(),
      },
      {
        id: "previewPanel.toggle",
        title: "Toggle Preview Panel",
        category: "View",
        keybind: "mod+shift+p",
        onSelect: () => layout.previewPanel.toggle(),
      },
    ])
  })

  const update: TitlebarUpdate = {
    version: () => {
      const state = platform.updater?.state()
      if (state?.status !== "ready") return
      return state.version
    },
    installing: () => platform.updater?.state().status === "installing",
    install: () => void platform.updater?.install(),
  }

  return (
    <div
      class="relative bg-v2-background-bg-deep flex-1 min-h-0 min-w-0 flex flex-col select-none [&_input]:select-text [&_textarea]:select-text [&_[contenteditable]]:select-text"
      style={{
        "padding-top": "env(safe-area-inset-top, 0px)",
        "padding-bottom": "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <Titlebar
        update={update}
        debugTools={
          import.meta.env.DEV
            ? { visible: state.debugTools, toggle: () => setState("debugTools", (value) => !value) }
            : undefined
        }
      />
      <div class="flex-1 min-h-0 min-w-0 flex flex-row overflow-hidden">
        <div
          class="relative flex flex-row overflow-hidden flex-shrink-0 transition-[width] duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[width] motion-reduce:transition-none"
          style={{ width: layout.explorerPanel.opened() ? `${layout.explorerPanel.width()}px` : '0px' }}
        >
          <div class="flex-shrink-0 overflow-hidden" style={{ width: `${layout.explorerPanel.width()}px` }}>
            <Show when={layout.explorerPanel.opened()}>
              <ExplorerPanel />
            </Show>
          </div>
          <Show when={layout.explorerPanel.opened()}>
            <ResizeHandle
              direction="horizontal"
              size={layout.explorerPanel.width()}
              min={200}
              max={600}
              onResize={(w) => layout.explorerPanel.resize(w)}
            />
          </Show>
        </div>
        <main class="flex-1 min-h-0 min-w-0 overflow-x-hidden flex flex-col items-start contain-strict">
          <Suspense>{props.children}</Suspense>
        </main>
        <div
          class="relative flex flex-row overflow-hidden flex-shrink-0 transition-[width] duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[width] motion-reduce:transition-none"
          style={{ width: layout.previewPanel.opened() ? `${layout.previewPanel.width()}px` : '0px' }}
        >
          <Show when={layout.previewPanel.opened()}>
            <ResizeHandle
              direction="horizontal"
              edge="start"
              size={layout.previewPanel.width()}
              min={200}
              max={800}
              onResize={(w) => layout.previewPanel.resize(w)}
            />
          </Show>
          <div class="flex-shrink-0 overflow-hidden" style={{ width: `${layout.previewPanel.width()}px` }}>
            <Show when={layout.previewPanel.opened()}>
              <PreviewPanel />
            </Show>
          </div>
        </div>
      </div>
      {import.meta.env.DEV && state.debugTools && <DebugBar inline />}
      <TabsInfoPopup />
      <ToastRegion v2 />
    </div>
  )
}
