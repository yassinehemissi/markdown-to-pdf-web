import { Textarea } from '@/components/ui/textarea'
import { useMarkdownEditor } from '../(hooks)/use-markdown-editor'
import type { WritePaneProps } from '../workspace.types'
export function WritePane(props: WritePaneProps) {
  const { textarea, onKeyDown } = useMarkdownEditor(props)
  return (
    <section className="write-pane" aria-label="Markdown editor">
      <div className="pane-bar">
        <span>MARKDOWN</span>
      </div>
      <Textarea
        ref={textarea}
        className="markdown-input"
        aria-label="Markdown content"
        spellcheck={false}
        value={props.note.content}
        placeholder={'# New note\n\nStart writing…'}
        onInput={(event) => props.updateContent(event.currentTarget.value)}
        onKeyDown={onKeyDown}
      />
    </section>
  )
}
