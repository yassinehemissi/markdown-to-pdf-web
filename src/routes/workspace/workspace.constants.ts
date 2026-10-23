import type { Note } from '@/types/note.types'
import type { ViewMode } from './workspace.types'
export const viewModes: { id: ViewMode; label: string }[] = [
  { id: 'write', label: 'Write' },
  { id: 'split', label: 'Split' },
  { id: 'preview', label: 'Preview' },
]
export const workspaceMedia = { logo: '/logo.png' } as const
export const welcomeNote: Note = {
  id: 'getting-started',
  title: 'Getting started',
  updatedAt: Date.now(),
  content:
    '# Getting started\n\nWrite your notes in **Markdown**. Changes save automatically.\n\n## Formatting\n\n- **Bold** and *italic* text\n- Headings, lists, and tables\n- Code blocks and quotes\n\n> Open the notes menu to create a new note.\n\n## Export\n\nUse **Download PDF** to save a copy with selectable text.\n\n```javascript\nconst message = "Hello, M2PDF";\n```',
}
export const googleFontUrls = {
  normal:
    'https://fonts.gstatic.com/s/montserrat/v31/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtZ6Hw5aX8.ttf',
  bold: 'https://fonts.gstatic.com/s/montserrat/v31/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM73w5aX8.ttf',
  italics:
    'https://fonts.gstatic.com/s/montserrat/v31/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq5Z9WXh0ow.ttf',
  bolditalics:
    'https://fonts.gstatic.com/s/montserrat/v31/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq0N6WXh0ow.ttf',
}
