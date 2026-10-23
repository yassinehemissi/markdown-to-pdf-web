import { describe, it, expect } from 'vitest'
import { filename } from './filename'
describe('download filenames', () => {
  it('keeps readable Unicode titles while removing filesystem control characters', () => {
    expect(filename('  Café: ideas / notes?  ')).toBe('Café ideas  notes')
    expect(filename('\u0000<>:"/\\|?*')).toBe('Untitled note')
  })
  it('bounds very long titles', () => {
    expect(filename('a'.repeat(500))).toHaveLength(100)
  })
})
