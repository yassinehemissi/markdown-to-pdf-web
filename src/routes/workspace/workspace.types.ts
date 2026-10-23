import type { ComponentChildren } from 'preact'
import type { Note } from '@/types/note.types'

export type ViewMode = 'write' | 'split' | 'preview'
export interface WorkspaceState {
  notes: Note[]
  error: string | null
  save: (note: Note) => void
  sidebar: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
  mode: ViewMode
  setMode: (mode: ViewMode) => void
  createOpen: boolean
  name: string
  setName: (name: string) => void
  askCreate: () => void
  closeCreate: () => void
  create: () => void
  deleting: Note | null
  askDelete: (note: Note) => void
  closeDelete: () => void
  confirmDelete: () => void
  toast: string
  notify: (message: string) => void
  clearToast: () => void
}
export interface WorkspaceProviderProps {
  children: ComponentChildren
}
export interface EditorProps {
  note: Note
}
export interface EmptyStateProps {
  missing?: boolean
}
export interface EditorPaneProps {
  html: string
}
export interface WritePaneProps {
  note: Note
  updateContent: (content: string) => void
}
export interface StatusBarProps {
  content: string
}
export interface EditorToolbarProps {
  note: Note
  html: string
}
