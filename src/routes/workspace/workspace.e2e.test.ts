import { test, expect } from '@playwright/test'
import { readFile, writeFile } from 'node:fs/promises'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import pdfFonts from 'pdfmake/build/vfs_fonts.js'
import { googleFontUrls } from './workspace.constants'

// Font delivery is an external boundary. Use the PDF engine's bundled test
// fonts and a local browser face, and reject every other external HTTP request.
test.beforeEach(async ({ page }) => {
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url())
    if (url.hostname === '127.0.0.1' || url.hostname === 'localhost')
      return route.continue()
    if (url.hostname === 'fonts.googleapis.com')
      return route.fulfill({
        contentType: 'text/css',
        body: '@font-face{font-family:Montserrat;src:local("Arial");font-weight:100 900;font-style:normal}@font-face{font-family:Montserrat;src:local("Arial");font-weight:100 900;font-style:italic}',
      })
    if (url.hostname === 'fonts.gstatic.com') {
      const style =
        Object.entries(googleFontUrls).find(
          ([, value]) => value === url.href,
        )?.[0] || 'normal'
      const font = {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf',
      }[style]!
      return route.fulfill({
        contentType: 'font/ttf',
        body: Buffer.from(
          (pdfFonts as unknown as Record<string, string>)[font],
          'base64',
        ),
        headers: { 'access-control-allow-origin': '*' },
      })
    }
    return route.abort('blockedbyclient')
  })
})

test('named notes persist and all three editor modes fill the workspace', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.getByLabel('Note title')).toHaveValue('Getting started')
  await expect(page.getByLabel('Markdown content')).toHaveCSS(
    'font-family',
    'Montserrat, sans-serif',
  )
  expect(
    await page
      .getByLabel('Markdown content')
      .evaluate((el) => el.getBoundingClientRect().height),
  ).toBeGreaterThan(450)
  await expect(page.locator('.markdown-preview h1')).toHaveCSS(
    'font-size',
    '32px',
  )
  await expect(page.locator('.markdown-preview h1')).toHaveCSS(
    'font-family',
    'Montserrat, sans-serif',
  )
  await expect(
    page.getByRole('complementary', { name: 'Saved notes' }),
  ).toHaveCount(0)
  await page.getByRole('button', { name: 'New note', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(
    dialog.getByRole('button', { name: 'Create note' }),
  ).toBeDisabled()
  await expect(dialog.getByLabel('Note name')).toBeFocused()
  await dialog.getByLabel('Note name').fill('My first note')
  await page.screenshot({ path: 'test-results/m2pdf-modal.png' })
  await dialog.getByRole('button', { name: 'Create note' }).click()
  await expect(page.getByLabel('Note title')).toHaveValue('My first note')
  await page
    .getByLabel('Markdown content')
    .fill(
      '# Hello M2PDF\n\nA **bold** idea.\n\n<script>alert(1)</script>\n![tracking](https://example.com/pixel.png)',
    )
  await expect(page.locator('.markdown-preview h1')).toHaveText('Hello M2PDF')
  await expect(page.locator('.markdown-preview strong')).toHaveText('bold')
  await expect(
    page.locator('.markdown-preview script, .markdown-preview img'),
  ).toHaveCount(0)
  await page.getByRole('button', { name: 'Write', exact: true }).click()
  await expect(page.getByLabel('Markdown content')).toBeVisible()
  await expect(
    page.getByRole('region', { name: 'Markdown preview' }),
  ).toHaveCount(0)
  expect(
    await page
      .locator('.write-pane')
      .evaluate((el) => el.getBoundingClientRect().width),
  ).toBeGreaterThan(1200)
  await page.getByRole('button', { name: 'Preview', exact: true }).click()
  await expect(page.getByLabel('Markdown content')).toHaveCount(0)
  expect(
    await page
      .locator('.preview-pane')
      .evaluate((el) => el.getBoundingClientRect().width),
  ).toBeGreaterThan(1200)
  await page.getByRole('button', { name: 'Split', exact: true }).click()
  await expect(page.getByLabel('Markdown content')).toBeVisible()
  await expect(
    page.getByRole('region', { name: 'Markdown preview' }),
  ).toBeVisible()
  await page.reload()
  await expect(page.getByLabel('Note title')).toHaveValue('My first note')
  await expect(page.getByLabel('Markdown content')).toHaveValue(/Hello M2PDF/)
  await page.getByLabel('Open notes').click()
  await expect(page.locator('.note-link')).toHaveCount(2)
  await page.getByLabel('Close notes').click()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollHeight <= innerHeight,
    ),
  ).toBe(true)
})

test('PDF contains selectable text, formatting, Unicode, and multiple pages', async ({
  page,
}) => {
  test.setTimeout(60000)
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('/')
  await page.getByLabel('Note title').fill('Selectable PDF')
  const content =
    '# Actual PDF text\n\nCafé résumé — selectable and searchable.\n\nA **bold** word and *italic* text.\n\n## Lists and quotes\n\n- List entry\n- Second entry\n  - Nested entry\n\n> A block quote with **bold text**.\n\n## Table\n\n| Name | Value |\n| --- | --- |\n| Table cell | Visible value |\n| Second row | Another value |\n\n## Code\n\n```js\nconst message = "Real text";\n  const indented = true;\n```\n\n---\n\n' +
    Array.from(
      { length: 75 },
      (_, i) =>
        `Paragraph ${i + 1}. This is a longer note that should continue across pages without turning any of the words into an image.`,
    ).join('\n\n') +
    '\n\nEND OF DOCUMENT'
  await page.getByLabel('Markdown content').fill(content)
  const pending = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download PDF' }).click()
  const download = await pending
  expect(download.suggestedFilename()).toBe('Selectable PDF.pdf')
  const buffer = await readFile((await download.path())!)
  const pdf = await getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
  }).promise
  expect(pdf.numPages).toBeGreaterThan(1)
  const firstPage = await pdf.getPage(1)
  const firstText = await firstPage.getTextContent()
  const title = firstText.items.find(
    (item) => 'str' in item && item.str === 'Actual PDF text',
  )
  expect(title && 'height' in title ? title.height : 0).toBeCloseTo(24, 0)
  const firstViewport = firstPage.getViewport({ scale: 4 / 3 })
  const factory = pdf.canvasFactory as {
    create(
      width: number,
      height: number,
    ): {
      canvas: HTMLCanvasElement & { toBuffer(type: string): Buffer }
      context: CanvasRenderingContext2D
    }
  }
  const rendered = factory.create(firstViewport.width, firstViewport.height)
  await firstPage.render({
    canvas: rendered.canvas,
    canvasContext: rendered.context,
    viewport: firstViewport,
  }).promise
  await writeFile(
    'test-results/m2pdf-export.png',
    rendered.canvas.toBuffer('image/png'),
  )
  await page.setViewportSize({ width: 900, height: 1200 })
  await page.getByRole('button', { name: 'Preview', exact: true }).click()
  await page.locator('.markdown-preview').evaluate((el) => {
    el.style.width = '793.7067px'
    el.style.maxWidth = 'none'
    el.style.padding = '32px'
  })
  const previewBox = await page.locator('.markdown-preview').boundingBox()
  await page.screenshot({
    path: 'test-results/m2pdf-export-preview.png',
    clip: { x: previewBox!.x, y: previewBox!.y, width: 793, height: 900 },
  })
  let extracted = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const text = await page.getTextContent()
    extracted +=
      text.items.map((item) => ('str' in item ? item.str : '')).join(' ') + '\n'
  }
  for (const value of [
    'Actual PDF text',
    'Café résumé',
    'selectable and searchable',
    'bold',
    'italic',
    'List entry',
    'Nested entry',
    'A block quote',
    'Table cell',
    'Visible value',
    'Real text',
    'indented',
    'END OF DOCUMENT',
  ])
    expect(extracted).toContain(value)
  await pdf.cleanup()
  expect(errors).toEqual([])
})

test('sidebar creates, switches, and deletes notes with confirmation', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByLabel('Open notes').click()
  await expect(page.locator('input[type=file]')).toHaveCount(0)
  await expect(
    page.getByText('Saved in this browser', { exact: true }),
  ).toHaveCount(0)
  await page.locator('.create-note-button').click()
  await page.getByLabel('Note name').fill('Another note')
  await page.getByRole('button', { name: 'Create note', exact: true }).click()
  await expect(page.getByLabel('Note title')).toHaveValue('Another note')
  await page.getByRole('link', { name: 'Getting started', exact: true }).click()
  await expect(page.getByLabel('Note title')).toHaveValue('Getting started')
  await page.getByRole('link', { name: 'Another note', exact: true }).click()
  await page.getByLabel('Delete Another note', { exact: true }).click()
  await page.getByRole('button', { name: 'Keep note' }).click()
  await expect(page.getByLabel('Note title')).toHaveValue('Another note')
  await page.getByLabel('Delete Another note', { exact: true }).click()
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Delete note' })
    .click()
  await expect(page.getByLabel('Note title')).toHaveValue('Getting started')
  await expect(page.locator('.note-link')).toHaveCount(1)
})

test('mobile layout, sidebar, and naming modal work without overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.getByLabel('Markdown content')).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  await page.getByLabel('Open notes').click()
  await expect(
    page.getByRole('complementary', { name: 'Saved notes' }),
  ).toBeVisible()
  await page
    .getByLabel('Dismiss notes menu')
    .click({ position: { x: 350, y: 200 } })
  await page.getByRole('button', { name: 'New note', exact: true }).click()
  await page.getByLabel('Note name').fill('Mobile note')
  await page.getByLabel('Note name').press('Enter')
  await expect(page.getByLabel('Note title')).toHaveValue('Mobile note')
  await page.getByRole('button', { name: 'Split', exact: true }).click()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  await page.screenshot({ path: 'test-results/m2pdf-mobile.png' })
})

test('existing notes migrate and invalid storage is preserved', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'folio.notes.v1',
      JSON.stringify([
        {
          id: 'legacy',
          title: 'Existing note',
          content: 'Keep my writing',
          updatedAt: 123,
          favorite: true,
        },
      ]),
    )
  })
  await page.goto('/')
  await expect(page.getByLabel('Note title')).toHaveValue('Existing note')
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('m2pdf.notes.v1')!)[0].content,
    ),
  ).toBe('Keep my writing')
  await page.evaluate(() =>
    localStorage.setItem('m2pdf.notes.v1', 'invalid json'),
  )
  await page.reload()
  await expect(page.getByRole('alert')).toContainText('could not be read')
  expect(
    await page.evaluate(() => localStorage.getItem('m2pdf.notes.v1')),
  ).toBe('invalid json')
})

test('desktop workspace matches the simple split layout', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  await expect(page.locator('.markdown-preview h1')).toBeVisible()
  await page.screenshot({ path: 'test-results/m2pdf-desktop.png' })
})
