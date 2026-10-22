import type { EditorPaneProps } from '../workspace.types'
export function PreviewPane({ html }: EditorPaneProps) {
  return <section className="preview-pane" aria-label="Markdown preview"><div className="pane-bar"><span>PREVIEW</span><span className="live-label"><i />LIVE</span></div><div className="preview-scroll"><article className="markdown-preview prose" dangerouslySetInnerHTML={{ __html: html || '<p class="preview-placeholder">Start writing to preview your Markdown.</p>' }} /></div></section>
}
