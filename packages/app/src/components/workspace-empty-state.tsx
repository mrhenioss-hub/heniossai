import { useTabs } from "@/context/tabs"
import { useServer, ServerConnection } from "@/context/server"
import { useGlobal } from "@/context/global"
import { useLanguage } from "@/context/language"

export function WorkspaceEmptyState() {
  const tabs = useTabs()
  const server = useServer()
  const global = useGlobal()
  const language = useLanguage()

  const handleNewSession = () => {
    const conn = server.current
    if (conn) {
      const ctx = global.ensureServerCtx(conn)
      const project = ctx.projects.list()[0]
      if (project) {
        ctx.projects.open(project.worktree)
        ctx.projects.touch(project.worktree)
        void tabs.newDraft({ server: server.key, directory: project.worktree })
        return
      }
    }
    const fallback = global.servers.list().flatMap((conn) => {
      const ctx = global.ensureServerCtx(conn)
      const project = ctx.projects.list()[0]
      return project ? [{ server: ServerConnection.key(conn), ctx, project }] : []
    })[0]
    if (!fallback) return
    fallback.ctx.projects.open(fallback.project.worktree)
    fallback.ctx.projects.touch(fallback.project.worktree)
    void tabs.newDraft({ server: fallback.server, directory: fallback.project.worktree })
  }

  return (
    <div class="flex-1 min-h-0 w-full flex flex-col items-center justify-center px-6 text-center gap-3">
      <div class="flex flex-col gap-1">
        <div class="text-16-medium text-text-strong">No active session</div>
        <p class="text-13-regular text-text-weak max-w-[320px]">
          Select a session from the Explorer to continue working, or start a new session.
        </p>
      </div>
      <button
        type="button"
        onClick={handleNewSession}
        class="px-4 py-1.5 bg-primary text-white rounded-md text-13-medium hover:bg-primary-hover transition-colors cursor-pointer"
      >
        {language.t("command.session.new")}
      </button>
    </div>
  )
}
