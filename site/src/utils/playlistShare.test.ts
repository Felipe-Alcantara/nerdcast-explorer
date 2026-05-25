import { describe, expect, it } from 'vitest'
import type { Playlist } from '../types'
import {
  parseAnyShare,
  parseCodeShare,
  parseJsonShare,
  parseShareUrl,
  toJsonString,
  toShareCode,
  toShareUrl,
} from './playlistShare'

const samplePlaylists: Playlist[] = [
  { id: 'a', name: 'Top NerdCasts', episodeIds: ['ep-1', 'ep-2'] },
  { id: 'b', name: 'Tecnologia', episodeIds: ['ep-3'] },
]

describe('playlistShare', () => {
  it('serializa para JSON e faz round-trip', () => {
    const json = toJsonString(samplePlaylists)
    const parsed = parseJsonShare(json)
    expect(parsed?.playlists).toEqual([
      { name: 'Top NerdCasts', episodeIds: ['ep-1', 'ep-2'] },
      { name: 'Tecnologia', episodeIds: ['ep-3'] },
    ])
  })

  it('faz round-trip via código base64-url', () => {
    const code = toShareCode(samplePlaylists)
    expect(code).not.toContain('=')
    expect(code).not.toContain('+')
    expect(code).not.toContain('/')

    const parsed = parseCodeShare(code)
    expect(parsed?.playlists).toHaveLength(2)
    expect(parsed?.playlists[0].name).toBe('Top NerdCasts')
  })

  it('extrai payload do hash da URL', () => {
    const url = toShareUrl(samplePlaylists, 'https://example.com/app')
    expect(url.startsWith('https://example.com/app/#share=')).toBe(true)

    const parsed = parseShareUrl(url)
    expect(parsed?.playlists).toHaveLength(2)
  })

  it('parseAnyShare aceita JSON, código e URL', () => {
    expect(parseAnyShare(toJsonString(samplePlaylists))?.playlists).toHaveLength(2)
    expect(parseAnyShare(toShareCode(samplePlaylists))?.playlists).toHaveLength(2)
    expect(parseAnyShare(toShareUrl(samplePlaylists, 'http://x'))?.playlists).toHaveLength(2)
  })

  it('retorna null para conteúdo inválido', () => {
    expect(parseAnyShare('')).toBeNull()
    expect(parseAnyShare('not-a-real-payload')).toBeNull()
    expect(parseJsonShare('{"foo": 1}')).toBeNull()
  })

  it('aceita array cru de playlists como JSON', () => {
    const raw = JSON.stringify([{ name: 'Solta', episodeIds: ['ep-9'] }])
    const parsed = parseJsonShare(raw)
    expect(parsed?.playlists).toEqual([{ name: 'Solta', episodeIds: ['ep-9'] }])
  })
})
