import type { Note } from '@/types/note.types'

export function noteSlug(title: string): string {
  return title.normalize('NFKC').toLowerCase().trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '') || 'untitled-note'
}

export function noteUrlId(note: Note): string {
  return `${note.id}--${noteSlug(note.title)}`
}

export function resolveNote(notes: Note[], value: string | undefined): Note | undefined {
  if (!value) return undefined
  return notes.find(note => note.id === value || value.startsWith(`${note.id}--`))
    ?? notes.find(note => noteSlug(note.title) === noteSlug(value))
}
