import { Outlet } from '@tanstack/react-router'
import { useWorkspace } from '../(hooks)/use-workspace'
import { WorkspaceHeader } from './workspace-header'
import { NotesSidebar } from './notes-sidebar'
import { CreateNoteDialog } from './create-note-dialog'
import { DeleteNoteDialog } from './delete-note-dialog'
import { WorkspaceNotification } from './workspace-notification'
export function WorkspaceLayout() {
  const { sidebar, error } = useWorkspace()
  return <><div className="app-shell"><WorkspaceHeader /><div className="body-layout">{sidebar && <NotesSidebar />}<main className="main-content">{error && <div className="storage-error" role="alert">{error}</div>}<Outlet /></main></div></div><CreateNoteDialog /><DeleteNoteDialog /><WorkspaceNotification /></>
}
