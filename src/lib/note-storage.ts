import { STORAGE_KEY, LEGACY_STORAGE_KEY } from '@/constants/storage'
import type { Note } from '@/types/note.types'

export function isNote(value: unknown): value is Note {
  if (!value || typeof value !== 'object') return false
  const note = value as Record<string, unknown>
  return typeof note.id === 'string' && typeof note.title === 'string' && typeof note.content === 'string' && typeof note.updatedAt === 'number' && Number.isFinite(note.updatedAt)
}
export function readNotes(fallback: Note[] = []): { notes: Note[]; error: string | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY)
    if (raw === null) return { notes: fallback, error: null }
    const data: unknown = JSON.parse(raw)
    if (!Array.isArray(data) || !data.every(isNote) || new Set(data.map(note => note.id)).size !== data.length) throw new Error('Invalid notes')
    return { notes: data, error: null }
  } catch { return { notes: [], error: 'Saved notes could not be read. Storage has been left untouched. Download any new work before closing.' } }
}
export function storeNotes(notes: Note[]): string | null {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); return null }
  catch { return 'Browser storage is unavailable or full. Download your work before closing.' }
}
