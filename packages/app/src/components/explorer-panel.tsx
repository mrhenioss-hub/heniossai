import { createMemo, createResource, createSignal, For, Show, type JSX } from "solid-js"
import { createStore } from "solid-js/store"
import { useLayout } from "@/context/layout"
import { useServerSDK } from "@/context/server-sdk"
import { showToast } from "@/utils/toast"
import { ContextMenu } from "@opencode-ai/ui/context-menu"
import { FileIcon } from "@opencode-ai/ui/file-icon"
import { IconButton } from "@opencode-ai/ui/icon-button"
import { Icon } from "@opencode-ai/ui/v2/icon"
import { createHomeController, type HomeController } from "@/pages/home/home-controller"
import { createHomeProjectsController, type HomeProjectsController } from "@/pages/home/home-projects-controller"
import { createHomeSessionsController, type HomeSessionsController } from "@/pages/home/home-sessions-controller"
import { createHomeSessionSearchController, type HomeSessionSearchController } from "@/pages/home/home-session-search-controller"
import { createHomeScrollController, type HomeScrollController } from "@/pages/home/home-scroll-controller"
import { HomeProjectsView } from "@/pages/home/home-projects-view"
import { HomeSessionsView } from "@/pages/home/home-sessions-view"
import { CollapsibleSection } from "./explorer-sections"

export interface FileEntry {
  path: string
  type: "file" | "directory"
}

export function ExplorerPanel(): JSX.Element {
  const layout = useLayout()
  const serverSDK = useServerSDK()

  // Active directory from home project selection
  const activeDir = createMemo(() => layout.home.selection().directory)

  // Project tree collapse state
  const [projectTreeCollapsed, setProjectTreeCollapsed] = createSignal(false)

  // Track expanded directories & search filter
  const [expanded, setExpanded] = createStore<Record<string, boolean>>({})
  const [filterQuery, setFilterQuery] = createSignal("")

  // Cache loaded directory children: dirPath -> FileEntry[]
  const [treeCache, setTreeCache] = createStore<Record<string, FileEntry[]>>({})
  const [loadingDirs, setLoadingDirs] = createStore<Record<string, boolean>>({})

  // Initial root directory fetch resource
  const [rootFiles, { refetch: refetchRoot }] = createResource(
    activeDir,
    async (dir) => {
      if (!dir) return []
      try {
        const sd = serverSDK().createClient({ directory: dir, throwOnError: true })
        const res = await sd.file.list({ path: dir })
        const items = ((res.data ?? []) as any[]).map(
          (entry: any): FileEntry => ({ path: `${dir}/${entry.path}`, type: entry.type }),
        )
        setTreeCache(dir, items)
        return items
      } catch (err) {
        console.error("[ExplorerPanel] Failed to list root directory", err)
        throw err
      }
    },
  )

  // Fetch children for subdirectories on demand
  async function toggleDirectory(dirPath: string) {
    const isExpanded = expanded[dirPath]
    if (isExpanded) {
      setExpanded(dirPath, false)
      return
    }

    setExpanded(dirPath, true)
    if (!treeCache[dirPath]) {
      setLoadingDirs(dirPath, true)
      try {
        const sd = serverSDK().createClient({ directory: dirPath, throwOnError: true })
        const res = await sd.file.list({ path: dirPath })
        const items = ((res.data ?? []) as any[]).map(
          (entry: any): FileEntry => ({ path: `${dirPath}/${entry.path}`, type: entry.type }),
        )
        setTreeCache(dirPath, items)
      } catch (err) {
        console.error(`[ExplorerPanel] Failed to list directory: ${dirPath}`, err)
      } finally {
        setLoadingDirs(dirPath, false)
      }
    }
  }

  // Handle file selection -> bridges to Preview Panel via layout.selectFile
  function handleFileSelect(filePath: string) {
    layout.previewPanel.selectFile(filePath)
  }

  // Deselect project -> return to project list
  function handleProjectHeaderClick() {
    const sel = layout.home.selection()
    layout.home.setSelection({ server: sel.server })
  }

  // Filter items based on filterQuery
  const filterItems = (items: FileEntry[]) => {
    const q = filterQuery().trim().toLowerCase()
    if (!q) return items
    return items.filter((item) => {
      const name = item.path.split(/[/\\]/).pop() || ""
      return name.toLowerCase().includes(q)
    })
  }

  // Hoisted controllers (Phase 1 Infrastructure)
  const home = createHomeController()
  const projects = createHomeProjectsController(home)
  const sessions = createHomeSessionsController(home)
  const search = createHomeSessionSearchController(home, sessions)
  const scroll = createHomeScrollController(sessions.data.groups)

  // Name of the selected project for display
  const selectedProject = createMemo(() =>
    projects.project.list().find((p: any) => p.worktree === activeDir()),
  )
  const selectedProjectName = createMemo(() =>
    selectedProject()?.name ?? (activeDir()?.split("/").filter(Boolean).pop() ?? ""),
  )

  return (
    <div
      data-component="explorer-panel"
      role="region"
      aria-label="File Explorer"
      class="h-full w-full flex flex-col bg-background-base text-text-base select-none border-r border-border-base overflow-hidden"
    >
      {/* Main Content Area — 2 sections: Projects (with file tree) + Sessions */}
      <div class="flex-1 min-h-0 flex flex-col overflow-hidden">
        <CollapsibleSection title="Projects" defaultOpen>
          <Show when={activeDir()} fallback={
            <HomeProjectsView
              language={projects.copy.language}
              servers={projects.server.list}
              projects={projects.project.list}
              recentlyClosed={projects.project.recentlyClosed}
              selection={projects.selection.value}
              homedir={projects.project.homedir}
              serverHealth={projects.server.health}
              projectsForServer={projects.server.projects}
              collapsed={projects.server.collapsed}
              canDefaultServer={projects.server.canDefault}
              defaultServerKey={projects.server.defaultKey}
              canRevealProject={projects.project.canReveal}
              unseenCount={projects.project.unseenCount}
              onWheel={scroll.viewport.containWheel}
              onChooseProject={projects.project.choose}
              onFocusServer={projects.server.focus}
              onToggleCollapsed={projects.server.toggleCollapsed}
              onEditServer={projects.server.edit}
              onSetDefaultServer={projects.server.setDefault}
              onRemoveServer={projects.server.remove}
              onMoveProject={projects.project.move}
              onSelectProject={projects.project.select}
              onAddProjects={projects.project.add}
              onOpenProjectNewSession={projects.project.openNewSession}
              onEditProject={projects.project.edit}
              onRevealProject={projects.project.reveal}
              onClearNotifications={projects.project.clearNotifications}
              onCloseProject={projects.project.close}
              onOpenSettings={projects.utility.settings}
              onOpenHelp={projects.utility.help}
            />
          }>
            {/* "All Projects" back button */}
            <button
              type="button"
              onClick={handleProjectHeaderClick}
              class="flex items-center gap-1 w-full px-2 py-1 text-left text-[12px] [font-weight:440] text-v2-text-text-muted hover:bg-v2-overlay-simple-overlay-hover hover:text-v2-text-text-base transition-colors cursor-pointer"
            >
              <Icon name="chevron-left" class="w-3.5 h-3.5 shrink-0" />
              <span>All Projects</span>
            </button>
            {/* Project header with collapse toggle */}
            <button
              type="button"
              onClick={() => setProjectTreeCollapsed(!projectTreeCollapsed())}
              class="flex items-center gap-1.5 w-full px-2 py-1.5 text-left text-[13px] [font-weight:530] text-v2-text-text-base hover:bg-v2-overlay-simple-overlay-hover transition-colors cursor-pointer"
            >
              <Icon
                name={projectTreeCollapsed() ? "chevron-right" : "chevron-down"}
                class="w-3.5 h-3.5 shrink-0 text-v2-icon-icon-muted transition-transform"
              />
              <FileIcon node={{ path: "folder", type: "directory", expanded: !projectTreeCollapsed() }} class="w-4 h-4 shrink-0" />
              <span class="truncate">{selectedProjectName()}</span>
            </button>
            {/* Project toolbar */}
            <div class="flex items-center gap-1 px-2 py-1">
              <div class="flex-1 flex items-center gap-1.5 px-2 py-1 bg-v2-background-bg-layer-01/60 rounded-[6px] border border-v2-border-border-base focus-within:border-v2-border-border-focus">
                <Icon name="search" class="w-3.5 h-3.5 text-v2-icon-icon-muted shrink-0" />
                <input
                  type="text"
                  value={filterQuery()}
                  onInput={(e) => setFilterQuery(e.currentTarget.value)}
                  placeholder="Filter files..."
                  aria-label="Filter files by name"
                  class="w-full bg-transparent text-[13px] [font-weight:440] text-v2-text-text-base placeholder:text-v2-text-text-faint outline-none"
                />
                <Show when={filterQuery()}>
                  <button
                    type="button"
                    onClick={() => setFilterQuery("")}
                    aria-label="Clear filter"
                    class="text-v2-icon-icon-muted hover:text-v2-text-text-base cursor-pointer"
                  >
                    <Icon name="close" class="w-3 h-3" />
                  </button>
                </Show>
              </div>
              <IconButton icon="file-plus" variant="ghost" size="small" aria-label="New file" />
              <IconButton icon="folder-open" variant="ghost" size="small" aria-label="Reveal in file system" />
              <IconButton icon="more-horizontal" variant="ghost" size="small" aria-label="More actions" />
            </div>
            {/* Project file tree */}
            <Show when={!projectTreeCollapsed()}>
              <div class="p-1 text-12-regular" role="tree" aria-label="Project files">
                <Show when={!rootFiles.loading} fallback={<LoadingState />}>
                  <Show
                    when={!rootFiles.error}
                    fallback={<ErrorState message="Failed to load project files" onRetry={() => void refetchRoot()} />}
                  >
                    <Show when={(treeCache[activeDir()!] ?? []).length > 0} fallback={<EmptyState message="Folder is empty" />}>
                      <div class="flex flex-col gap-0.5">
                        <For each={filterItems(treeCache[activeDir()!] ?? [])}>
                          {(item) => (
                            <TreeItem
                              item={item}
                              level={0}
                              expanded={expanded}
                              treeCache={treeCache}
                              loadingDirs={loadingDirs}
                              onToggleDir={toggleDirectory}
                              onSelectFile={handleFileSelect}
                              activeFile={layout.previewPanel.currentFile()}
                              filterQuery={filterQuery()}
                            />
                          )}
                        </For>
                      </div>
                    </Show>
                  </Show>
                </Show>
              </div>
            </Show>
          </Show>
        </CollapsibleSection>
        {/* Visual separator between Projects and Sessions */}
        <div class="h-[1px] bg-v2-border-border-base mx-2 my-1" aria-hidden="true" />
        <CollapsibleSection title="Sessions" defaultOpen onContentClass="flex-1 min-h-0 flex flex-col">
          <div class="flex flex-col">
            {/* + New Session */}
            <button
              type="button"
              onClick={sessions.session.create}
              class="flex items-center gap-1.5 w-full px-2 py-1.5 text-left text-[13px] [font-weight:530] text-v2-text-text-base hover:bg-v2-overlay-simple-overlay-hover transition-colors cursor-pointer"
            >
              <Icon name="plus" class="w-3.5 h-3.5 shrink-0 text-v2-icon-icon-muted" />
              <span>New Session</span>
            </button>
            {/* Divider */}
            <div class="h-[1px] bg-v2-border-border-base mx-2 my-1" aria-hidden="true" />
            {/* Recent sessions */}
            <div class="px-2 py-0.5 text-[11px] [font-weight:530] uppercase tracking-wider text-v2-text-text-muted">
              Recent
            </div>
            <HomeSessionsView
              language={sessions.copy.language}
              groups={sessions.data.groups}
              loading={sessions.data.loading}
              showProjectName={sessions.session.showProjectName}
              server={sessions.session.server}
              canCreateSession={sessions.session.canCreate}
              searchValue={search.query.value}
              searchPlaceholder={search.query.placeholder}
              searchOpen={search.query.open}
              searchLoading={search.result.loading}
              searchResults={search.result.list}
              searchActive={search.result.active}
              searchNoResultsLabel={search.result.noResultsLabel}
              titleOpacity={scroll.header.titleOpacity}
              isOpenTab={sessions.tab.isOpen}
              onCreateSession={sessions.session.create}
              onOpenSession={sessions.session.open}
              onArchiveSession={sessions.session.archive}
              onSetHoverTarget={scroll.viewport.setHoverTarget}
              onSetThumbTrack={scroll.viewport.setThumbTrack}
              onSetContent={scroll.header.setContent}
              onSetHeader={scroll.header.setHeader}
              onWheel={scroll.viewport.containWheel}
              onSetSearchRoot={search.element.setRoot}
              onSetSearchInput={search.element.setInput}
              onSetSearchList={search.element.setList}
              onSearchFocus={search.query.focus}
              onSearchInput={search.query.input}
              onSearchClose={search.query.close}
              onSearchMove={search.result.move}
              onSearchSelectActive={search.result.selectActive}
              onSearchHighlight={search.result.highlight}
              onSearchSelect={search.result.select}
            />
          </div>
        </CollapsibleSection>
      </div>
    </div>
  )
}

interface TreeItemProps {
  item: FileEntry
  level: number
  expanded: Record<string, boolean>
  treeCache: Record<string, FileEntry[]>
  loadingDirs: Record<string, boolean>
  onToggleDir: (path: string) => void
  onSelectFile: (path: string) => void
  activeFile?: string
  filterQuery?: string
}

function TreeItem(props: TreeItemProps): JSX.Element {
  const isDir = () => props.item.type === "directory"
  const isExpanded = () => !!props.expanded[props.item.path]
  const isLoading = () => !!props.loadingDirs[props.item.path]
  const isActive = () => !isDir() && props.activeFile === props.item.path

  const fileName = () => {
    const parts = props.item.path.replace(/[/\\]+$/, "").split(/[/\\]/)
    return parts[parts.length - 1] || props.item.path
  }

  const filteredChildren = () => {
    const raw = props.treeCache[props.item.path] ?? []
    const q = props.filterQuery?.trim().toLowerCase()
    if (!q) return raw
    return raw.filter((child) => {
      const name = child.path.split(/[/\\]/).pop() || ""
      return name.toLowerCase().includes(q)
    })
  }

  return (
    <div class="flex flex-col w-full" role="none">
      <ContextMenu>
        <ContextMenu.Trigger
          as="button"
          type="button"
          role="treeitem"
          aria-expanded={isDir() ? isExpanded() : undefined}
          aria-selected={isActive()}
          class="flex items-center gap-1.5 w-full px-2 py-1 rounded-[4px] text-left hover:bg-v2-overlay-simple-overlay-hover transition-colors cursor-pointer"
          classList={{
            "bg-v2-background-bg-layer-03 text-v2-text-text-base [font-weight:530]": isActive(),
            "text-v2-text-text-muted": !isActive(),
          }}
          style={{ "padding-left": `${Math.max(8, props.level * 8 + 8)}px` }}
          onClick={() => {
            if (isDir()) {
              props.onToggleDir(props.item.path)
            } else {
              props.onSelectFile(props.item.path)
            }
          }}
        >
          <Show when={isDir()}>
            <Icon
              name={isExpanded() ? "chevron-down" : "chevron-right"}
              class="w-3.5 h-3.5 shrink-0 text-v2-icon-icon-muted"
            />
          </Show>
          <FileIcon node={props.item} expanded={isExpanded()} class="w-4 h-4 shrink-0" />
          <span class="truncate text-[13px] [font-weight:440] flex-1">{fileName()}</span>
          <Show when={isLoading()}>
            <Icon name="spinner" class="w-3 h-3 shrink-0 animate-spin text-v2-icon-icon-muted" />
          </Show>
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content class="bg-v2-background-bg-base border border-v2-border-border-base rounded-[6px] p-1 shadow-[var(--v2-elevation-floating)] text-[13px] [font-weight:440] text-v2-text-text-muted min-w-[160px] z-50">
            <Show when={!isDir()}>
              <ContextMenu.Item
                class="px-2 py-1.5 rounded-[4px] hover:bg-v2-overlay-simple-overlay-hover cursor-pointer flex items-center gap-2"
                onSelect={() => props.onSelectFile(props.item.path)}
              >
                <Icon name="file" class="w-3.5 h-3.5 text-v2-icon-icon-muted" />
                <span>Open Preview</span>
              </ContextMenu.Item>
            </Show>
            <ContextMenu.Item
              class="px-2 py-1.5 rounded-[4px] hover:bg-v2-overlay-simple-overlay-hover cursor-pointer flex items-center gap-2"
              onSelect={() => {
                void navigator.clipboard.writeText(props.item.path)
                showToast({ variant: "info", title: "Path copied to clipboard" })
              }}
            >
              <Icon name="copy" class="w-3.5 h-3.5 text-v2-icon-icon-muted" />
              <span>Copy Path</span>
            </ContextMenu.Item>
            <ContextMenu.Item
              class="px-2 py-1.5 rounded-[4px] hover:bg-v2-overlay-simple-overlay-hover cursor-pointer flex items-center gap-2"
              onSelect={() => {
                void navigator.clipboard.writeText(fileName())
                showToast({ variant: "info", title: "Filename copied to clipboard" })
              }}
            >
              <Icon name="copy" class="w-3.5 h-3.5 text-v2-icon-icon-muted" />
              <span>Copy Name</span>
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu>

      <Show when={isDir() && isExpanded() && filteredChildren().length > 0}>
        <div class="flex flex-col w-full" role="group">
          <For each={filteredChildren()}>
            {(child) => (
              <TreeItem
                item={child}
                level={props.level + 1}
                expanded={props.expanded}
                treeCache={props.treeCache}
                loadingDirs={props.loadingDirs}
                onToggleDir={props.onToggleDir}
                onSelectFile={props.onSelectFile}
                activeFile={props.activeFile}
                filterQuery={props.filterQuery}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}

function EmptyState(props: { message: string }): JSX.Element {
  return (
    <div class="h-full w-full flex flex-col items-center justify-center p-4 text-center text-v2-text-text-muted">
      <Icon name="folder" class="w-8 h-8 mb-2 opacity-50" />
      <span class="text-[13px] [font-weight:440]">{props.message}</span>
    </div>
  )
}

function LoadingState(): JSX.Element {
  return (
    <div class="h-full w-full flex flex-col items-center justify-center p-4 text-v2-text-text-muted gap-2">
      <Icon name="spinner" class="w-5 h-5 animate-spin opacity-70" />
      <span class="text-[13px] [font-weight:440]">Loading workspace files...</span>
    </div>
  )
}

function ErrorState(props: { message: string; onRetry: () => void }): JSX.Element {
  return (
    <div class="h-full w-full flex flex-col items-center justify-center p-4 text-center text-v2-text-text-muted gap-2">
      <span class="text-[13px] [font-weight:440] text-syntax-critical">{props.message}</span>
      <button
        type="button"
        class="px-2 py-1 bg-v2-background-bg-layer-01 rounded-[4px] hover:bg-v2-overlay-simple-overlay-hover text-[13px] [font-weight:530] text-v2-text-text-base transition-colors cursor-pointer"
        onClick={props.onRetry}
      >
        Retry
      </button>
    </div>
  )
}
