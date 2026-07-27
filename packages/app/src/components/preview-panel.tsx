import { createEffect, createMemo, createResource, createSignal, For, Show, type JSX } from "solid-js"
import { createStore } from "solid-js/store"
import { useLayout } from "@/context/layout"
import { useServerSDK } from "@/context/server-sdk"
import { useMarked } from "@opencode-ai/ui/context/marked"
import { FileIcon } from "@opencode-ai/ui/file-icon"
import { IconButton } from "@opencode-ai/ui/icon-button"
import { Icon } from "@opencode-ai/ui/v2/icon"
import { HdsEmptyState, HdsErrorState, HdsLoadingState } from "@/components/hds-states"

export function PreviewPanel(): JSX.Element {
  const layout = useLayout()
  const serverSDK = useServerSDK()
  const marked = useMarked()

  const activeFile = createMemo(() => layout.previewPanel.currentFile())
  const openFiles = createMemo(() => layout.previewPanel.files())

  // Scroll position memory per file
  const [scrollPositions, setScrollPositions] = createStore<Record<string, number>>({})
  let contentRef: HTMLDivElement | undefined

  // Format detection helpers
  const fileExt = createMemo(() => {
    const file = activeFile()
    if (!file) return ""
    const parts = file.split(".")
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ""
  })

  const isMarkdown = createMemo(() => ["md", "mdx", "markdown"].includes(fileExt()))
  const isImage = createMemo(() => ["png", "jpg", "jpeg", "gif", "svg", "webp", "ico", "bmp"].includes(fileExt()))
  const isPdf = createMemo(() => fileExt() === "pdf")

  // Active directory from Explorer's project selection
  const activeDir = createMemo(() => layout.home.selection().directory)

  // Load file content resource
  const [fileContent, { refetch }] = createResource(
    () => [activeFile(), activeDir()] as const,
    async ([filePath, dir]) => {
      if (!filePath || !dir) return null
      try {
        const sd = serverSDK().createClient({ directory: dir, throwOnError: true })
        // filePath is absolute; API expects path relative to directory
        const relativePath = filePath.startsWith(dir) ? filePath.slice(dir.length + 1) : filePath
        const res = await sd.file.read({ path: relativePath })
        return res.data ?? null
      } catch (err) {
        console.error(`[PreviewPanel] Failed to read file: ${filePath}`, err)
        throw err
      }
    },
  )

  // Restore scroll position when active file changes
  createEffect(() => {
    const file = activeFile()
    if (!file || !contentRef) return
    const savedPos = scrollPositions[file] ?? 0
    queueMicrotask(() => {
      if (contentRef) contentRef.scrollTop = savedPos
    })
  })

  // Markdown HTML parser resource
  const [parsedHtml] = createResource(
    () => {
      const data = fileContent()
      if (isMarkdown() && data?.content) return data.content
      return null
    },
    async (markdownText) => {
      if (!markdownText) return ""
      try {
        return await marked.parse(markdownText)
      } catch (err) {
        console.error("[PreviewPanel] Failed to parse markdown", err)
        return `<pre>${escapeHtml(markdownText)}</pre>`
      }
    },
  )

  return (
    <div
      data-component="preview-panel"
      role="region"
      aria-label="File Preview"
      class="h-full w-full flex flex-col bg-background-base text-text-base select-none border-l border-border-base overflow-hidden"
    >
      {/* Preview Tab Bar */}
      <div
        role="tablist"
        aria-label="Preview tabs"
        class="hds-preview-tabbar flex items-center justify-between shrink-0 overflow-x-auto no-scrollbar"
      >
        <div class="flex items-center min-w-0 flex-1 overflow-x-auto no-scrollbar">
          <For each={openFiles()}>
            {(file) => {
              const fileName = file.split(/[/\\]/).pop() || file
              const isActive = () => file === activeFile()
              return (
                <div
                  role="tab"
                  aria-selected={isActive()}
                  class="hds-preview-tab flex items-center cursor-pointer shrink-0 max-w-[180px]"
                  classList={{ "hds-preview-tab--active": isActive() }}
                  onClick={() => layout.previewPanel.selectFile(file)}
                >
                  <FileIcon node={{ path: file, type: "file" }} class="shrink-0" style={{ width: "12px", height: "12px" }} />
                  <span class="truncate flex-1" title={file}>
                    {fileName}
                  </span>
                  <button
                    type="button"
                    class="p-0.5 rounded-sm hover:bg-surface-raised-base text-text-weak hover:text-text-base transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      layout.previewPanel.closeFile(file)
                    }}
                    aria-label={`Close ${fileName}`}
                  >
                    <Icon name="close" style={{ width: "10px", height: "10px" }} />
                  </button>
                </div>
              )
            }}
          </For>
        </div>

        <div class="flex items-center px-2 shrink-0 border-l border-border-base">
          <IconButton
            icon="close"
            variant="ghost"
            size="small"
            onClick={() => layout.previewPanel.close()}
            aria-label="Close preview panel"
          />
        </div>
      </div>

      {/* Main Preview Content Area */}
      <div
        ref={contentRef}
        role="tabpanel"
        aria-label="File content preview"
        class="hds-preview-content flex-1 min-h-0 overflow-y-auto p-4 select-text"
        onScroll={(e) => {
          const file = activeFile()
          if (file) setScrollPositions(file, e.currentTarget.scrollTop)
        }}
      >
        <Show when={activeFile()} fallback={<EmptyState message="No file selected for preview" />}>
          <Show when={!fileContent.loading} fallback={<LoadingState />}>
            <Show
              when={!fileContent.error}
              fallback={<ErrorState message="Failed to load file content" onRetry={() => void refetch()} />}
            >
              {/* Markdown Content */}
              <Show when={isMarkdown()}>
                <Show when={!parsedHtml.loading} fallback={<LoadingState />}>
                  <div
                    class="prose dark:prose-invert max-w-none text-13-regular text-text-base leading-relaxed"
                    innerHTML={parsedHtml() ?? ""}
                  />
                </Show>
              </Show>

              {/* Image Content */}
              <Show when={isImage()}>
                <div class="h-full w-full flex items-center justify-center p-2 overflow-auto">
                  <img
                    src={`file://${activeFile()}`}
                    alt={activeFile()?.split(/[/\\]/).pop()}
                    class="max-w-full max-h-full object-contain rounded-md shadow-sm border border-border-base"
                    onError={(e) => {
                      // Fallback if direct file protocol fails
                      const img = e.currentTarget
                      img.style.display = "none"
                    }}
                  />
                </div>
              </Show>

              {/* PDF Content */}
              <Show when={isPdf()}>
                <div class="h-full w-full flex flex-col items-center justify-center">
                  <embed
                    src={`file://${activeFile()}`}
                    type="application/pdf"
                    class="w-full h-full min-h-[400px] border-0"
                  />
                  <div class="p-2 text-12-regular text-text-weak">
                    Having trouble viewing PDF?{" "}
                    <a
                      href={`file://${activeFile()}`}
                      target="_blank"
                      rel="noreferrer"
                      class="text-primary underline"
                    >
                      Open in external viewer
                    </a>
                  </div>
                </div>
              </Show>

              {/* Plain Text & Code Content */}
              <Show when={!isMarkdown() && !isImage() && !isPdf()}>
                <Show when={fileContent()?.content !== undefined} fallback={<UnsupportedState path={activeFile()!} />}>
                  <div class="font-mono text-12-regular text-text-base whitespace-pre overflow-x-auto leading-relaxed p-2 bg-surface-base rounded-md border border-border-base">
                    <code>{fileContent()?.content}</code>
                  </div>
                </Show>
              </Show>
            </Show>
          </Show>
        </Show>
      </div>
    </div>
  )
}

// Delegated to the shared HDS state contract (Blueprint 8.17).
// Copy and call sites are unchanged; only the visual treatment is unified.
function EmptyState(props: { message: string }): JSX.Element {
  return <HdsEmptyState icon="file-tree" title={props.message} />
}

function LoadingState(): JSX.Element {
  return <HdsLoadingState label="Loading preview..." />
}

function ErrorState(props: { message: string; onRetry: () => void }): JSX.Element {
  return <HdsErrorState message={props.message} onRetry={props.onRetry} />
}

function UnsupportedState(props: { path: string }): JSX.Element {
  return (
    <HdsEmptyState icon="file-tree" title="Binary or unsupported file format" description={props.path} />
  )
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
