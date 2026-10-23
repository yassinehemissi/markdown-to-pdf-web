import { useEffect, useLayoutEffect, useState } from 'preact/hooks'
import { useNavigate } from '@tanstack/react-router'
import { links } from '@/constants/links'
import { readNotes, storeNotes } from '@/lib/note-storage'
import type { Note } from '@/types/note.types'
import { welcomeNote } from '../workspace.constants'
import { noteUrlId } from '../(utils)/note-url'
import type { ViewMode, WorkspaceState } from '../workspace.types'

export function useWorkspaceState(): WorkspaceState {
  const [initial] = useState(() => readNotes([welcomeNote]))
  const [notes, setNotes] = useState(initial.notes)
  const [error, setError] = useState(initial.error)
  const [sidebar, setSidebar] = useState(false)
  const [mode, setMode] = useState<ViewMode>(() => window.innerWidth < 640 ? 'write' : 'split')
  const [createOpen, setCreateOpen] = useState(false)
  const [name, setName] = useState('')
  const [deleting, setDeleting] = useState<Note | null>(null)
  const [toast, setToast] = useState('')
  const navigate = useNavigate()
  useLayoutEffect(() => {
    if (initial.error) return
    setError(storeNotes(notes))
  }, [notes, initial.error])
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 4000); return () => clearTimeout(timer) }, [toast])
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebar(false)
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSidebar(old => !old) }
    }
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey)
  }, [])
  function create() {
    if (!name.trim()) return
    const note: Note = { id: crypto.randomUUID(), title: name.trim(), content: '', updatedAt: Date.now() }
    setNotes(old => [note, ...old]); setCreateOpen(false)
    if (window.innerWidth < 760) setSidebar(false)
    void navigate({ to: links.workspace.note, params: { noteId: noteUrlId(note) } })
  }
  function confirmDelete() {
    if (!deleting) return
    setNotes(old => old.filter(note => note.id !== deleting.id)); setDeleting(null)
    void navigate({ to: links.workspace.home }); setToast('Note deleted')
  }
  return {
    notes, error, save: note => setNotes(old => old.map(item => item.id === note.id ? note : item)),
    sidebar, toggleSidebar: () => setSidebar(old => !old), closeSidebar: () => setSidebar(false),
    mode, setMode, createOpen, name, setName, create,
    askCreate: () => { setName(''); setCreateOpen(true) }, closeCreate: () => setCreateOpen(false),
    deleting, askDelete: setDeleting, closeDelete: () => setDeleting(null), confirmDelete,
    toast, notify: setToast, clearToast: () => setToast(''),
  }
}
