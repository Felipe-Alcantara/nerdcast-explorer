import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadJson, loadStringSet, normalizeStringArray, saveJson, saveStringSet } from './storage'

function stubStorage(store: Record<string, string> = {}) {
  vi.stubGlobal('localStorage', {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      for (const key of Object.keys(store)) {
        delete store[key]
      }
    }),
    key: vi.fn(),
    length: Object.keys(store).length,
  })

  return store
}

describe('storage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('loads JSON through a normalizer and falls back on invalid data', () => {
    stubStorage({ valid: '["a", 1, "b"]', invalid: '{nope' })

    expect(loadJson('valid', [], normalizeStringArray)).toEqual(['a', 'b'])
    expect(loadJson('missing', ['fallback'], normalizeStringArray)).toEqual(['fallback'])
    expect(loadJson('invalid', ['fallback'], normalizeStringArray)).toEqual(['fallback'])
  })

  it('loads and saves string sets as JSON arrays', () => {
    const store = stubStorage({ ids: '["ep-1", "ep-2", 3]' })

    expect(Array.from(loadStringSet('ids'))).toEqual(['ep-1', 'ep-2'])

    saveStringSet('ids', new Set(['ep-3']))

    expect(store.ids).toBe('["ep-3"]')
  })

  it('ignores save failures because local persistence is optional', () => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(() => {
        throw new Error('quota exceeded')
      }),
    })

    expect(() => saveJson('key', { ok: true })).not.toThrow()
  })
})
