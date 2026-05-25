import type { Playlist } from '../types'
import { normalizePlaylists } from '../hooks/usePlaylists'

const SHARE_FORMAT = 'nerdcast-playlist'
const SHARE_VERSION = 1

export interface SharePayload {
  format: typeof SHARE_FORMAT
  version: number
  exportedAt: string
  playlists: Array<Pick<Playlist, 'name' | 'episodeIds'>>
}

export interface ParsedShare {
  playlists: Array<Pick<Playlist, 'name' | 'episodeIds'>>
}

export function buildSharePayload(playlists: Playlist[]): SharePayload {
  return {
    format: SHARE_FORMAT,
    version: SHARE_VERSION,
    exportedAt: new Date().toISOString(),
    playlists: playlists.map(({ name, episodeIds }) => ({ name, episodeIds })),
  }
}

export function toJsonString(playlists: Playlist[]): string {
  return JSON.stringify(buildSharePayload(playlists), null, 2)
}

function utf8ToBase64(input: string): string {
  if (typeof TextEncoder !== 'undefined' && typeof btoa !== 'undefined') {
    const bytes = new TextEncoder().encode(input)
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }
  if (typeof btoa !== 'undefined') {
    return btoa(unescape(encodeURIComponent(input)))
  }
  throw new Error('base64 encoding unavailable')
}

function base64ToUtf8(input: string): string {
  if (typeof atob === 'undefined') {
    throw new Error('base64 decoding unavailable')
  }
  const binary = atob(input)
  if (typeof TextDecoder !== 'undefined') {
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return new TextDecoder().decode(bytes)
  }
  return decodeURIComponent(escape(binary))
}

function toBase64Url(value: string): string {
  return utf8ToBase64(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/')
  const padding = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4))
  return base64ToUtf8(padded + padding)
}

export function toShareCode(playlists: Playlist[]): string {
  return toBase64Url(toJsonString(playlists))
}

export function toShareUrl(playlists: Playlist[], origin: string): string {
  const base = origin.replace(/\/$/, '')
  return `${base}/#share=${toShareCode(playlists)}`
}

function parseSharePayload(value: unknown): ParsedShare | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const obj = value as Record<string, unknown>
  const rawList = Array.isArray(obj.playlists) ? obj.playlists : Array.isArray(value) ? value : null

  if (!rawList) {
    return null
  }

  const normalized = normalizePlaylists(rawList).map(playlist => ({
    name: playlist.name,
    episodeIds: playlist.episodeIds,
  }))

  const lenient = rawList.flatMap((item: unknown) => {
    if (!item || typeof item !== 'object') {
      return []
    }
    const entry = item as { name?: unknown; episodeIds?: unknown }
    const name = typeof entry.name === 'string' ? entry.name.trim() : ''
    const episodeIds = Array.isArray(entry.episodeIds)
      ? Array.from(new Set(entry.episodeIds.filter((id): id is string => typeof id === 'string')))
      : []
    if (!name) {
      return []
    }
    return [{ name, episodeIds }]
  })

  const playlists = normalized.length > 0 ? normalized : lenient

  if (playlists.length === 0) {
    return null
  }

  return { playlists }
}

export function parseJsonShare(input: string): ParsedShare | null {
  try {
    return parseSharePayload(JSON.parse(input))
  } catch {
    return null
  }
}

export function parseCodeShare(input: string): ParsedShare | null {
  const trimmed = input.trim()
  if (!trimmed) {
    return null
  }
  try {
    return parseJsonShare(fromBase64Url(trimmed))
  } catch {
    return null
  }
}

export function parseShareUrl(input: string): ParsedShare | null {
  const trimmed = input.trim()
  if (!trimmed) {
    return null
  }

  const hashIndex = trimmed.indexOf('#share=')
  if (hashIndex >= 0) {
    return parseCodeShare(trimmed.slice(hashIndex + '#share='.length))
  }

  const queryIndex = trimmed.indexOf('?share=')
  if (queryIndex >= 0) {
    const rest = trimmed.slice(queryIndex + '?share='.length)
    const end = rest.search(/[&#]/)
    return parseCodeShare(end >= 0 ? rest.slice(0, end) : rest)
  }

  return parseCodeShare(trimmed)
}

export function parseAnyShare(input: string): ParsedShare | null {
  const trimmed = input.trim()
  if (!trimmed) {
    return null
  }
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return parseJsonShare(trimmed)
  }
  if (trimmed.includes('share=') || trimmed.startsWith('http')) {
    return parseShareUrl(trimmed)
  }
  return parseCodeShare(trimmed)
}

export function readShareFromLocation(): ParsedShare | null {
  if (typeof window === 'undefined') {
    return null
  }
  const { hash, search } = window.location
  if (hash && hash.includes('share=')) {
    return parseShareUrl(hash)
  }
  if (search && search.includes('share=')) {
    return parseShareUrl(search)
  }
  return null
}

export function clearShareFromLocation(): void {
  if (typeof window === 'undefined' || typeof window.history === 'undefined') {
    return
  }
  const { pathname, search, hash } = window.location
  const cleanedHash = hash.replace(/#?share=[^&]*/, '').replace(/^#/, '')
  const cleanedSearch = search.replace(/[?&]share=[^&]*/, '').replace(/^\?/, '')
  const nextUrl =
    pathname +
    (cleanedSearch ? `?${cleanedSearch}` : '') +
    (cleanedHash ? `#${cleanedHash}` : '')
  window.history.replaceState(null, '', nextUrl)
}
