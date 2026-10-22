import { describe, it, expect, vi } from 'vitest'
import { readNotes, storeNotes } from './note-storage'
import { STORAGE_KEY, LEGACY_STORAGE_KEY } from '@/constants/storage'

const note = { id: 'one', title: 'A note', content: '# My writing', updatedAt: 123 }
describe('local note storage', () => {
  it('uses the starter note only when storage is absent, respecting an intentionally empty notebook', () => {
    expect(readNotes([note]).notes).toEqual([note])
    expect(storeNotes([])).toBeNull()
    expect(readNotes([note]).notes).toEqual([])
  })
  it('round-trips notes and reads existing notebooks without deleting their source', () => {
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify([note]))
    expect(readNotes().notes).toEqual([note])
    expect(storeNotes(readNotes().notes)).toBeNull()
    expect(readNotes().notes).toEqual([note])
    expect(localStorage.getItem(LEGACY_STORAGE_KEY)).not.toBeNull()
  })
  it.each(['not json', '{}', '[{"id":"incomplete"}]', JSON.stringify([note, note])])('preserves invalid storage and reports the problem', raw => {
    localStorage.setItem(STORAGE_KEY, raw)
    expect(readNotes().error).toContain('could not be read')
    expect(readNotes().notes).toEqual([])
    expect(localStorage.getItem(STORAGE_KEY)).toBe(raw)
  })
  it('reports an unavailable storage boundary rather than claiming a successful save', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Full', 'QuotaExceededError') })
    expect(storeNotes([note])).toContain('Download your work')
  })
})
