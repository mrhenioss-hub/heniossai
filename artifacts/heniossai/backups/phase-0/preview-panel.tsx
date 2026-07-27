import { createEffect, createMemo, createResource, createSignal, For, Show, type JSX } from "solid-js"
import { createStore } from "solid-js/store"
import { useLayout } from "@/context/layout"
import { tryUse as tryUseSDK } from "@/context/sdk"
import { useMarked } from "@opencode-ai/ui/context/marked"
import { FileIcon } from "@opencode-ai/ui/file-icon"
import { IconButton } from "@opencode-ai/ui/icon-button"
import { Icon } from "@opencode-ai/ui/v2/icon"

export function PreviewPanel(): JSX.Element {
  const layout = useLayout()
  const sdk = tryUseSDK()
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

  // Load file content resource
  const [fileContent, { refetch }] = createResource(
    activeFile,
    async (filePath) => {
      if (!filePath) return null
      const sd = sdk?.()
      if (!sd) return null
      try {
        // Use SDK client file read API
        const res = await sd.client.file.read({ path: filePath })
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
        class="flex items-center justify-between border-b border-border-base shrink-0 bg-background-base overflow-x-auto no-scrollbar"
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
                  class="flex items-center gap-1.5 px-3 py-2 border-r border-border-base text-12-regular cursor-pointer transition-colors shrink-0 max-w-[180px]"
                  classList={{
                    "bg-background-base text-text-strong font-medium border-b-2 border-b-primary": isActive(),
                    "bg-surface-base text-text-weak hover:bg-surface-raised-base": !isActive(),
                  }}
                  onClick={() => layout.previewPanel.selectFile(file)}
                >
                  <FileIcon node={{ path: file, type: "file" }} class="w-3.5 h-3.5 shrink-0" />
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
                    <Icon name="close" class="w-3 h-3" />
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
        class="flex-1 min-h-0 overflow-y-auto p-4 select-text"
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

function EmptyState(props: { message: string }): JSX.Element {
  return (
    <div class="h-full w-full flex flex-col items-center justify-center p-4 text-center text-text-weak">
      <Icon name="file" class="w-8 h-8 mb-2 opacity-50" />
      <span class="text-12-regular">{props.message}</span>
    </div>
  )
}

function LoadingState(): JSX.Element {
  return (
    <div class="h-full w-full flex flex-col items-center justify-center p-4 text-text-weak gap-2">
      <Icon name="spinner" class="w-5 h-5 animate-spin opacity-70" />
      <span class="text-12-regular">Loading preview...</span>
    </div>
  )
}

function ErrorState(props: { message: string; onRetry: () => void }): JSX.Element {
  return (
    <div class="h-full w-full flex flex-col items-center justify-center p-4 text-center text-text-weak gap-2">
      <span class="text-12-regular text-syntax-critical">{props.message}</span>
      <button
        type="button"
        class="px-2 py-1 bg-surface-base rounded-md hover:bg-surface-raised-base text-12-medium text-text-strong transition-colors cursor-pointer"
        onClick={props.onRetry}
      >
        Retry
      </button>
    </div>
  )
}

function UnsupportedState(props: { path: string }): JSX.Element {
  return (
    <div class="h-full w-full flex flex-col items-center justify-center p-4 text-center text-text-weak gap-2">
      <Icon name="file" class="w-8 h-8 opacity-50" />
      <span class="text-12-medium text-text-strong">Binary or unsupported file format</span>
      <span class="text-12-regular text-text-weak truncate max-w-md">{props.path}</span>
    </div>
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
