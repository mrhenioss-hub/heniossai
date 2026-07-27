import { For, Show, createMemo } from "solid-js"
import { DropdownMenu } from "@opencode-ai/ui/dropdown-menu"
import { useCommand } from "@/context/command"
import { usePlatform } from "@/context/platform"
import type { DesktopMenuAction } from "@/desktop-menu"

type MenuItem = {
  id: string
  label: string
  command?: string
  action?: DesktopMenuAction
  href?: string
  separator?: true
}

type MenuDef = {
  id: string
  label: string
  items: MenuItem[]
}

const MENUS: MenuDef[] = [
  {
    id: "heniossai",
    label: "HeniossAI",
    items: [
      { id: "about", label: "About HeniossAI", action: "app.about" },
      { id: "sep1", separator: true },
      { id: "settings", label: "Settings...", command: "settings.open" },
      { id: "sep2", separator: true },
      { id: "quit", label: "Quit", action: "app.quit" },
    ],
  },
  {
    id: "file",
    label: "File",
    items: [
      { id: "new-session", label: "New Session", command: "session.new" },
      { id: "new-draft", label: "New Draft", command: "tab.new" },
      { id: "sep1", separator: true },
      { id: "close-tab", label: "Close Tab", command: "tab.close" },
      { id: "reopen-tab", label: "Reopen Closed Tab", command: "tab.reopenClosed" },
      { id: "sep2", separator: true },
      { id: "close-window", label: "Close Window", action: "window.close" },
    ],
  },
  {
    id: "edit",
    label: "Edit",
    items: [
      { id: "undo", label: "Undo", command: "session.undo" },
      { id: "redo", label: "Redo", command: "session.redo" },
      { id: "sep1", separator: true },
      { id: "cut", label: "Cut", action: "edit.cut" },
      { id: "copy", label: "Copy", action: "edit.copy" },
      { id: "paste", label: "Paste", action: "edit.paste" },
      { id: "select-all", label: "Select All", action: "edit.selectAll" },
    ],
  },
  {
    id: "view",
    label: "View",
    items: [
      { id: "sidebar", label: "Toggle Sidebar", command: "sidebar.toggle" },
      { id: "explorer", label: "Explorer Panel", command: "explorerPanel.toggle" },
      { id: "preview", label: "Preview Panel", command: "previewPanel.toggle" },
      { id: "sep1", separator: true },
      { id: "command-palette", label: "Command Palette" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    items: [
      { id: "open-settings", label: "Settings...", command: "settings.open" },
      { id: "sep1", separator: true },
      { id: "export-logs", label: "Export Logs...", command: "logs.export" },
    ],
  },
  {
    id: "help",
    label: "Help",
    items: [
      { id: "docs", label: "Documentation", href: "https://opencode.ai/docs" },
      { id: "forum", label: "Support Forum", href: "https://discord.com/invite/opencode" },
      { id: "feedback", label: "Share Feedback", href: "https://github.com/anomalyco/opencode/issues/new?template=feature_request.yml" },
      { id: "bug", label: "Report a Bug", href: "https://github.com/anomalyco/opencode/issues/new?template=bug_report.yml" },
      { id: "sep1", separator: true },
      { id: "about", label: "About HeniossAI" },
    ],
  },
]

export function ClassicMenuBar() {
  const command = useCommand()
  const platform = usePlatform()

  return (
    <div class="flex flex-row items-center h-full gap-0 shrink-0" data-component="classic-menu-bar">
      <For each={MENUS}>{(menu) => (
        <DropdownMenu gutter={2} modal={false} placement="bottom-start">
          <DropdownMenu.Trigger
            as="button"
            class="flex items-center h-full px-3 text-[13px] text-v2-text-text-secondary hover:bg-v2-overlay-simple-overlay-hover hover:text-v2-text-text-primary whitespace-nowrap focus-visible:outline-none focus-visible:bg-v2-overlay-simple-overlay-hover"
          >
            {menu.label}
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content class="desktop-app-menu min-w-[200px] py-1">
              <For each={menu.items}>
                {(item) => {
                  if (item.separator) return <DropdownMenu.Separator />
                  return (
                    <DropdownMenu.Item
                      onSelect={() => {
                        if (item.command) { command.trigger(item.command); return }
                        if (item.action) { void platform.runDesktopMenuAction?.(item.action); return }
                        if (item.href) { platform.openLink(item.href); return }
                        if (item.id === "command-palette") { command.show(); return }
                        if (item.id === "about") { command.trigger("settings.open") }
                      }}
                      class="text-[13px]"
                    >
                      <DropdownMenu.ItemLabel>{item.label}</DropdownMenu.ItemLabel>
                      <Show when={item.command}>
                        <span data-slot="desktop-app-menu-keybind" class="text-[11px] opacity-60 ml-8">
                          {command.keybind(item.command ?? "")}
                        </span>
                      </Show>
                    </DropdownMenu.Item>
                  )
                }}
              </For>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu>
      )}</For>
    </div>
  )
}
