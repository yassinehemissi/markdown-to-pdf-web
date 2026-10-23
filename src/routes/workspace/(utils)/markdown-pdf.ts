import type {
  Content,
  ContentText,
  CustomTableLayout,
  Style,
  TableCell,
} from 'pdfmake/interfaces'

// CSS pixels → PDF points. These values mirror the plain .prose preview styles.
const pt = (pixels: number) => pixels * 0.75
const ink = '#1f2328'
const muted = '#656d76'
const border = '#d1d9e0'
const fontHeight = 1.219 // Montserrat's ascender-to-descender height / unitsPerEm.
const bodyLineHeight = 1.5 / fontHeight
const headingLineHeight = 1.25 / fontHeight
const gap = pt(16)
const isBlock = (node: Node) =>
  node instanceof HTMLElement &&
  /^(P|DIV|H[1-6]|UL|OL|PRE|BLOCKQUOTE|TABLE|HR|SECTION|ARTICLE|DETAILS|SUMMARY)$/.test(
    node.tagName,
  )

/** Convert the sanitized Markdown DOM into PDF text, rules and tables. No screenshots. */
export function markdownPdfContent(html: string, width: number): Content[] {
  const root = document.createElement('div')
  root.innerHTML = html

  function inline(node: Node, inherited: Style = {}): ContentText[] {
    if (node.nodeType === Node.TEXT_NODE)
      return [
        { text: (node.textContent || '').replace(/\s+/g, ' '), ...inherited },
      ]
    if (!(node instanceof HTMLElement)) return []
    const style = { ...inherited }
    switch (node.tagName) {
      case 'BR':
        return [{ text: '\n', ...style }]
      case 'STRONG':
      case 'B':
        style.bold = true
        break
      case 'EM':
      case 'I':
        style.italics = true
        break
      case 'DEL':
      case 'S':
        style.decoration = 'lineThrough'
        break
      case 'U':
        style.decoration = 'underline'
        break
      case 'CODE':
        style.fontSize = pt(16 * 0.85)
        style.background = '#eff1f3'
        break
      case 'A':
        style.color = '#0969da'
        break
      case 'SUP':
      case 'SUB':
        style.fontSize = pt(12)
        break
    }
    const result = Array.from(node.childNodes).flatMap((child) =>
      inline(child, style),
    )
    if (node.tagName === 'A')
      for (const fragment of result) {
        const href = node.getAttribute('href') || ''
        if (/^(https?:|mailto:)/i.test(href)) fragment.link = href
      }
    return result
  }

  function text(element: HTMLElement): ContentText[] {
    const fragments = Array.from(element.childNodes).flatMap((child) =>
      inline(child),
    )
    while (fragments.length && !String(fragments[0].text).trim())
      fragments.shift()
    while (
      fragments.length &&
      !String(fragments[fragments.length - 1].text).trim()
    )
      fragments.pop()
    return fragments.length ? fragments : [{ text: '' }]
  }

  const zeroPadding: CustomTableLayout = {
    hLineWidth: () => 0,
    vLineWidth: () => 0,
    paddingLeft: () => 0,
    paddingRight: () => 0,
    paddingTop: () => 0,
    paddingBottom: () => 0,
  }

  function blocks(parent: HTMLElement, availableWidth: number): Content[] {
    const result: Content[] = []
    let pending: ContentText[] = []
    let previousBottom = 0
    const flush = () => {
      if (pending.some((item) => String(item.text).trim())) {
        const bottom = parent.tagName === 'LI' ? 0 : gap
        result.push({ text: pending, margin: [0, 0, 0, bottom] })
        previousBottom = bottom
      }
      pending = []
    }
    for (const node of Array.from(parent.childNodes)) {
      if (!isBlock(node)) {
        pending.push(...inline(node))
        continue
      }
      flush()
      const el = node as HTMLElement
      const first = result.length === 0
      const heading = /^H([1-6])$/.exec(el.tagName)
      if (heading) {
        const level = Number(heading[1])
        const size = pt([32, 24, 20, 16, 14, 13.6][level - 1])
        const top = first ? 0 : Math.max(0, pt(24) - previousBottom)
        const title: ContentText = {
          text: text(el),
          fontSize: size,
          bold: true,
          lineHeight: headingLineHeight,
          color: level === 6 ? muted : ink,
          margin: [0, 0, 0, 0],
        }
        const stack: Content[] = [title]
        if (level <= 2)
          stack.push({
            canvas: [
              {
                type: 'line',
                x1: 0,
                y1: 0,
                x2: availableWidth,
                y2: 0,
                lineWidth: 0.75,
                lineColor: border,
              },
            ],
            margin: [0, size * 0.3, 0, 0],
          })
        result.push({ stack, margin: [0, top, 0, gap], unbreakable: true })
      } else if (el.tagName === 'P' || el.tagName === 'SUMMARY') {
        result.push({ text: text(el), margin: [0, 0, 0, gap] })
      } else if (el.tagName === 'PRE') {
        const source = (el.textContent || '')
          .replace(/\n$/, '')
          .replace(/\t/g, '  ')
        const cell: TableCell = {
          text: source || ' ',
          fontSize: pt(13.6),
          lineHeight: 1.45 / (0.85 * fontHeight),
          preserveLeadingSpaces: true,
          fillColor: '#f6f8fa',
        }
        result.push({
          table: {
            widths: [Math.max(1, availableWidth - pt(32))],
            body: [[cell]],
          },
          layout: {
            ...zeroPadding,
            paddingLeft: () => pt(16),
            paddingRight: () => pt(16),
            paddingTop: () => pt(16),
            paddingBottom: () => pt(16),
          },
          margin: [0, 0, 0, gap],
        })
      } else if (el.tagName === 'BLOCKQUOTE') {
        const content = blocks(el, availableWidth - pt(36))
        trimLastMargin(content)
        result.push({
          table: {
            widths: [Math.max(1, availableWidth - pt(36))],
            body: [
              [
                {
                  stack: content.length ? content : [{ text: ' ' }],
                  color: muted,
                },
              ],
            ],
          },
          layout: {
            ...zeroPadding,
            vLineWidth: (i) => (i === 0 ? pt(4) : 0),
            vLineColor: () => border,
            paddingLeft: () => pt(16),
            paddingRight: () => pt(16),
          },
          margin: [0, 0, 0, gap],
        })
      } else if (el.tagName === 'UL' || el.tagName === 'OL') {
        const items = Array.from(el.children)
          .filter((child) => child.tagName === 'LI')
          .map((child) => {
            const content = blocks(
              child as HTMLElement,
              availableWidth - pt(32),
            )
            trimLastMargin(content)
            return {
              stack: content.length ? content : [{ text: ' ' }],
              margin: [0, 0, 0, pt(4)] as [number, number, number, number],
            }
          })
        if (items.length)
          result.push(
            el.tagName === 'OL'
              ? {
                  ol: items,
                  start: Number(el.getAttribute('start')) || 1,
                  margin: [pt(16), 0, 0, gap - pt(4)],
                }
              : { ul: items, margin: [pt(16), 0, 0, gap - pt(4)] },
          )
      } else if (el.tagName === 'TABLE') {
        const rows = Array.from(el.querySelectorAll('tr')).filter(
          (row) => row.closest('table') === el,
        )
        const columnCount = Math.max(
          0,
          ...rows.map((row) => row.children.length),
        )
        if (!columnCount) continue
        // Use natural text widths for small tables; shrink wide tables to the page.
        const context = document.createElement('canvas').getContext('2d')!
        const widths = Array.from({ length: columnCount }, (_, column) =>
          Math.max(
            pt(30),
            ...rows.map((row) => {
              const cell = row.children[column] as HTMLElement | undefined
              context.font = `${cell?.tagName === 'TH' ? 700 : 500} 16px Montserrat`
              return pt(context.measureText(cell?.textContent || '').width)
            }),
          ),
        )
        const cellPadding = pt(26) + 0.75
        const naturalWidth = widths.reduce(
          (sum, width) => sum + width + cellPadding,
          0.75,
        )
        const shrink = Math.min(
          1,
          (availableWidth - columnCount * cellPadding - 0.75) /
            widths.reduce((sum, width) => sum + width, 0),
        )
        const body: TableCell[][] = rows.map((row) =>
          Array.from({ length: columnCount }, (_, column) => {
            const cell = row.children[column] as HTMLElement | undefined
            const align = cell?.getAttribute('align') || cell?.style.textAlign
            return {
              text: cell ? text(cell) : '',
              bold: cell?.tagName === 'TH',
              alignment:
                align === 'center' || align === 'right' ? align : 'left',
            }
          }),
        )
        result.push({
          table: {
            headerRows:
              rows[0]?.closest('thead') || rows[0]?.querySelector('th') ? 1 : 0,
            widths:
              naturalWidth > availableWidth
                ? widths.map((w) => Math.max(1, w * shrink))
                : widths,
            body,
            dontBreakRows: true,
          },
          layout: {
            hLineWidth: () => 0.75,
            vLineWidth: () => 0.75,
            hLineColor: () => border,
            vLineColor: () => border,
            paddingLeft: () => pt(13),
            paddingRight: () => pt(13),
            paddingTop: () => pt(6),
            paddingBottom: () => pt(6),
            fillColor: (row) =>
              (
                rows[0]?.querySelector('th')
                  ? row > 0 && row % 2 === 0
                  : row % 2 === 1
              )
                ? '#f6f8fa'
                : '#ffffff',
          },
          margin: [0, 0, 0, gap],
        })
      } else if (el.tagName === 'HR') {
        result.push({
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: availableWidth,
              h: pt(4),
              color: border,
              lineWidth: 0,
            },
          ],
          margin: [0, Math.max(0, pt(24) - previousBottom), 0, pt(24)],
        })
        previousBottom = pt(24)
        continue
      } else {
        result.push(...blocks(el, availableWidth))
      }
      previousBottom = gap
    }
    flush()
    return result
  }

  const result = blocks(root, width)
  trimLastMargin(result)
  return result.length ? result : [{ text: ' ' }]
}

function trimLastMargin(content: Content[]) {
  const last = content.at(-1)
  if (
    last &&
    typeof last === 'object' &&
    !Array.isArray(last) &&
    Array.isArray(last.margin) &&
    last.margin.length === 4
  )
    last.margin[3] = 0
}

export const markdownPdfDefaultStyle = {
  font: 'Montserrat',
  fontSize: pt(16),
  lineHeight: bodyLineHeight,
  color: ink,
}
