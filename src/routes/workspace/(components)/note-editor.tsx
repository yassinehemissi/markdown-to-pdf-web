import { useMemo } from 'preact/hooks'
import { cn } from '@/lib/utils'
import { useWorkspace } from '../(hooks)/use-workspace'
import { renderMarkdown } from '../(utils)/render-markdown'
import type { EditorProps } from '../workspace.types'
import { EditorToolbar } from './editor-toolbar'
import { WritePane } from './write-pane'
import { PreviewPane } from './preview-pane'
import { EditorStatus } from './editor-status'
export function NoteEditor({ note }: EditorProps) {
  const { save, mode } = useWorkspace()
  const html = useMemo(() => renderMarkdown(note.content), [note.content])
  return (
    <div className="document">
      <EditorToolbar note={note} html={html} />
      <div className={cn('editor-layout', `mode-${mode}`)}>
        {mode !== 'preview' && (
          <WritePane
            note={note}
            updateContent={(content) =>
              save({ ...note, content, updatedAt: Date.now() })
            }
          />
        )}
        {mode !== 'write' && <PreviewPane html={html} />}
      </div>
      <EditorStatus content={note.content} />
    </div>
  )
}
