import { useEffect, useRef } from 'preact/hooks'
import type { WritePaneProps } from '../workspace.types'
export function useMarkdownEditor({ note, updateContent }: WritePaneProps) {
  const textarea = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (!note.content) textarea.current?.focus()
  }, [note.id])
  function onKeyDown(
    event: KeyboardEvent & { currentTarget: HTMLTextAreaElement },
  ) {
    const element = event.currentTarget
    const start = element.selectionStart
    const end = element.selectionEnd
    if (
      (event.ctrlKey || event.metaKey) &&
      ['b', 'i', 's'].includes(event.key.toLowerCase())
    ) {
      event.preventDefault()
      if (event.key.toLowerCase() === 's') return
      const marker = event.key.toLowerCase() === 'b' ? '**' : '*'
      const selected = note.content.slice(start, end) || 'text'
      updateContent(
        note.content.slice(0, start) +
          marker +
          selected +
          marker +
          note.content.slice(end),
      )
      requestAnimationFrame(() =>
        element.setSelectionRange(
          start + marker.length,
          start + marker.length + selected.length,
        ),
      )
    }
    if (event.key === 'Tab') {
      event.preventDefault()
      updateContent(
        note.content.slice(0, start) + '  ' + note.content.slice(end),
      )
      requestAnimationFrame(() => {
        element.selectionStart = element.selectionEnd = start + 2
      })
    }
  }
  return { textarea, onKeyDown }
}
