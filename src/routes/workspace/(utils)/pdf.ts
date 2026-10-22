import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { filename } from '@/lib/filename'
import { googleFontUrls } from '../workspace.constants'
import { markdownPdfContent, markdownPdfDefaultStyle } from './markdown-pdf'

// Google Fonts hosts these faces; no font assets are stored in the project.
let fontCache: Promise<Record<string, string>> | undefined
function googleFonts() {
  if (!fontCache) fontCache = Promise.all(Object.entries(googleFontUrls).map(async ([style, url]) => {
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) })
    if (!response.ok) throw new Error('Google Fonts could not be loaded')
    const bytes = new Uint8Array(await response.arrayBuffer())
    let binary = ''
    for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192))
    return [`${style}.ttf`, btoa(binary)] as const
  })).then(entries => Object.fromEntries(entries)).catch(error => { fontCache = undefined; throw error })
  return fontCache
}

/** Render plain Markdown as selectable PDF text, without extra titles or footers. */
export async function exportNotePdf(title: string, html: string) {
  const [{ default: pdfMake }, fonts] = await Promise.all([import('pdfmake/build/pdfmake'), googleFonts()])
  await document.fonts.load('500 16px Montserrat')
  await document.fonts.load('700 16px Montserrat')
  pdfMake.vfs = fonts
  pdfMake.fonts = { Montserrat: { normal: 'normal.ttf', bold: 'bold.ttf', italics: 'italics.ttf', bolditalics: 'bolditalics.ttf' } }
  const definition: TDocumentDefinitions = {
    info: { title, creator: 'M2PDF' }, pageSize: 'A4', pageMargins: [24, 24, 24, 24],
    defaultStyle: markdownPdfDefaultStyle,
    content: markdownPdfContent(html, 595.28 - 48),
  }
  const blob = await new Promise<Blob>(resolve => pdfMake.createPdf(definition).getBlob(resolve))
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${filename(title)}.pdf`; anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
