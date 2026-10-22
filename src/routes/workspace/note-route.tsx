import { useParams } from '@tanstack/react-router'
import { useWorkspace } from './(hooks)/use-workspace'
import { EmptyState } from './(components)/empty-state'
import { NoteEditor } from './(components)/note-editor'
export function NoteRoute() {
  const { noteId } = useParams({ strict: false })
  const { notes } = useWorkspace()
  const note = notes.find(item => item.id === noteId)
  return note ? <NoteEditor key={note.id} note={note} /> : <EmptyState missing />
}
