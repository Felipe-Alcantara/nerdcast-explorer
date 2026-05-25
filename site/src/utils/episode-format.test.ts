import { describe, expect, it } from 'vitest'
import { formatDuration, formatEpisodeDate, guestUrl, thumbUrl } from './episode-format'

describe('episode-format', () => {
  it('formats valid ISO dates using pt-BR short month labels', () => {
    expect(formatEpisodeDate('2026-05-22')).toBe('22 mai 2026')
  })

  it('returns an empty date label for missing or invalid dates', () => {
    expect(formatEpisodeDate('')).toBe('')
    expect(formatEpisodeDate('2026-99-22')).toBe('')
  })

  it('formats durations with hours only when needed', () => {
    expect(formatDuration(76 * 60)).toBe('1h16')
    expect(formatDuration(42 * 60)).toBe('42min')
    expect(formatDuration(null)).toBe('')
  })

  it('normalizes twitter handles into urls without touching absolute urls', () => {
    expect(guestUrl('@azaghal')).toBe('https://twitter.com/azaghal')
    expect(guestUrl('https://example.com/profile')).toBe('https://example.com/profile')
    expect(guestUrl('')).toBe('')
  })

  it('uses existing resized thumbnails or adds CDN resize params', () => {
    expect(thumbUrl('https://cdn.example.com/image-180x180.jpg')).toBe('https://cdn.example.com/image-180x180.jpg')
    expect(thumbUrl('https://cdn.example.com/image.jpg')).toBe('https://cdn.example.com/image.jpg?ims=180x180/filters:quality(75)')
    expect(thumbUrl('https://cdn.example.com/image.jpg?foo=bar')).toBe('https://cdn.example.com/image.jpg?foo=bar')
  })
})
