import { useEffect } from 'preact/hooks'
import { useNavigate } from '@tanstack/react-router'
import { links } from '@/constants/links'
import { useWorkspace } from './(hooks)/use-workspace'
import { EmptyState } from './(components)/empty-state'
import { noteUrlId } from './(utils)/note-url'
export function NotesIndexRoute() {
  const { notes } = useWorkspace()
  const navigate = useNavigate()
  useEffect(() => {
    if (notes.length)
      void navigate({
        to: links.workspace.note,
        params: {
          noteId: noteUrlId(
            [...notes].sort((a, b) => b.updatedAt - a.updatedAt)[0],
          ),
        },
        replace: true,
      })
  }, [notes, navigate])
  return <EmptyState />
}
