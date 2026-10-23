import { useState } from 'preact/hooks'
import type { EditorToolbarProps } from '../workspace.types'
import { useWorkspace } from './use-workspace'
export function usePdfExport({ note, html }: EditorToolbarProps) {
  const [exporting, setExporting] = useState(false)
  const { notify } = useWorkspace()
  async function exportPdf() {
    if (exporting) return
    setExporting(true)
    try {
      const { exportNotePdf } = await import('../(utils)/pdf')
      await exportNotePdf(note.title || 'Untitled note', html)
      notify('PDF downloaded')
    } catch {
      notify(
        'PDF export failed. Check your connection to Google Fonts and try again.',
      )
    } finally {
      setExporting(false)
    }
  }
  return { exporting, exportPdf }
}
