import { marked } from 'marked'
import DOMPurify from 'dompurify'
export function renderMarkdown(content: string): string {
  return DOMPurify.sanitize(marked.parse(content, { async: false, gfm: true }) as string, {
    USE_PROFILES: { html: true }, FORBID_TAGS: ['img', 'iframe', 'video', 'audio', 'style', 'input'], FORBID_ATTR: ['style'],
  })
}
