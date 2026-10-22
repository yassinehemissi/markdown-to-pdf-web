import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

beforeEach(() => {
  localStorage.clear()
  window.history.replaceState(null, '', '/')
  const nativeFetch = globalThis.fetch.bind(globalThis)
  vi.stubGlobal('fetch', vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(input instanceof Request ? input.url : String(input), location.href)
    if (url.origin === location.origin) return nativeFetch(input, init)
    return Promise.reject(new Error('Unexpected external request: mock this boundary in the test'))
  }))
  vi.stubGlobal('scrollTo', vi.fn())
})
afterEach(() => { cleanup(); vi.unstubAllGlobals() })
