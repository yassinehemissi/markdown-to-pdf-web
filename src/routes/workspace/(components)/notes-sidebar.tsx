import { Link } from '@tanstack/react-router'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { links } from '@/constants/links'
import { useWorkspace } from '../(hooks)/use-workspace'
import { noteUrlId } from '../(utils)/note-url'

export function NotesSidebar() {
  const { notes, askCreate, askDelete, closeSidebar } = useWorkspace()
  return (
    <>
      <Button
        variant="ghost"
        className="sidebar-scrim"
        aria-label="Dismiss notes menu"
        onClick={closeSidebar}
      />
      <aside className="sidebar" aria-label="Saved notes">
        <div className="sidebar-heading">
          <span>Your notes</span>
          <span>{notes.length.toString().padStart(2, '0')}</span>
        </div>
        <Button
          variant="outline"
          className="create-note-button"
          onClick={askCreate}
        >
          <Plus />
          New note
        </Button>
        <div className="notes-list">
          {[...notes]
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .map((note) => (
              <div className="note-row" key={note.id}>
                <Link
                  to={links.workspace.note}
                  params={{ noteId: noteUrlId(note) }}
                  activeProps={{ className: 'active' }}
                  className="note-link"
                  onClick={() => {
                    if (window.innerWidth < 760) closeSidebar()
                  }}
                >
                  <span>{note.title || 'Untitled note'}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="delete-note"
                  aria-label={`Delete ${note.title || 'Untitled note'}`}
                  onClick={() => askDelete(note)}
                >
                  <Trash2 size={13} />
                </Button>
              </div>
            ))}
          {!notes.length && <p className="no-notes">No notes yet.</p>}
        </div>
      </aside>
    </>
  )
}
