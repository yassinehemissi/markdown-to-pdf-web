import { ArrowDownToLine, LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useWorkspace } from '../(hooks)/use-workspace'
import { usePdfExport } from '../(hooks)/use-pdf-export'
import type { EditorToolbarProps } from '../workspace.types'
export function EditorToolbar({ note, html }: EditorToolbarProps) {
  const { save } = useWorkspace()
  const { exporting, exportPdf } = usePdfExport({ note, html })
  return <div className="document-bar"><div className="document-name"><Input aria-label="Note title" placeholder="Untitled note" value={note.title} maxLength={120} onInput={event => save({ ...note, title: event.currentTarget.value, updatedAt: Date.now() })} /></div><div className="document-actions"><Button className="pdf-button" onClick={() => void exportPdf()} disabled={exporting}>{exporting ? <LoaderCircle className="spin" /> : <ArrowDownToLine />}<span>{exporting ? 'Exporting…' : 'Download PDF'}</span></Button></div></div>
}
