import { describe, it, expect } from 'vitest'
import { renderMarkdown } from './render-markdown'
describe('Markdown rendering', () => {
  it('renders GitHub-style tables, nested lists, emphasis, and code', () => {
    const element = document.createElement('div')
    element.innerHTML = renderMarkdown('# Heading\n\n**Bold** and *italic*\n\n- Outer\n  - Inner\n\n| Name | Value |\n| --- | --- |\n| A | B |\n\n```js\nconst a = 1;\n```')
    expect(element.querySelector('h1')).toHaveTextContent('Heading')
    expect(element.querySelector('strong')).toHaveTextContent('Bold')
    expect(element.querySelector('ul ul')).toHaveTextContent('Inner')
    expect(element.querySelector('td')).toHaveTextContent('A')
    expect(element.querySelector('pre code')).toHaveTextContent('const a = 1;')
  })
  it('removes executable HTML and remote media without removing normal text and links', () => {
    const element = document.createElement('div')
    element.innerHTML = renderMarkdown('<script>alert(1)</script><img src="https://example.com/pixel"><iframe src="https://example.com"></iframe><svg><image href="https://example.com" /></svg>\n\n[Unsafe](javascript:alert(1)) and [Safe](https://example.com)')
    expect(element.querySelector('script, img, iframe, svg')).toBeNull()
    expect(element.querySelector('a[href^="javascript"]')).toBeNull()
    expect(element.querySelector('a[href="https://example.com"]')).toHaveTextContent('Safe')
  })
})
