import { useLayoutEffect } from 'preact/hooks'
import { useNavigate, useParams } from '@tanstack/react-router'
import { links } from '@/constants/links'
import { noteUrlId, resolveNote } from './(utils)/note-url'
import { useWorkspace } from './(hooks)/use-workspace'
import { EmptyState } from './(components)/empty-state'
import { NoteEditor } from './(components)/note-editor'
export function NoteRoute() {
  const { noteId } = useParams({ strict: false })
  const { notes } = useWorkspace()
  const navigate = useNavigate()
  const note = resolveNote(notes, noteId)
  const canonicalId = note ? noteUrlId(note) : undefined
  useLayoutEffect(() => {
    if (canonicalId && canonicalId !== noteId) {
      void navigate({
        to: links.workspace.note,
        params: { noteId: canonicalId },
        replace: true,
      })
    }
  }, [canonicalId, noteId, navigate])
  return note ? (
    <NoteEditor key={note.id} note={note} />
  ) : (
    <EmptyState missing />
  )
}
