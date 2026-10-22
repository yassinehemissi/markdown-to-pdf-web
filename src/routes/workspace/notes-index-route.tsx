import { useEffect } from 'preact/hooks'
import { useNavigate } from '@tanstack/react-router'
import { links } from '@/constants/links'
import { useWorkspace } from './(hooks)/use-workspace'
import { EmptyState } from './(components)/empty-state'
export function NotesIndexRoute() {
  const { notes } = useWorkspace()
  const navigate = useNavigate()
  useEffect(() => {
    if (notes.length) void navigate({ to: links.workspace.note, params: { noteId: [...notes].sort((a, b) => b.updatedAt - a.updatedAt)[0].id }, replace: true })
  }, [notes, navigate])
  return <EmptyState />
}
