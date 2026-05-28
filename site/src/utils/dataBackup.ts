import { normalizeEpisodeComments } from '../hooks/useEpisodeComments'
import { normalizePlaylists } from '../hooks/usePlaylists'
import { normalizeStringArray } from './storage'

const BACKUP_VERSION = 1

const KEYS = {
  watched: 'nerdcast-watched',
  liked: 'nerdcast-liked',
  comments: 'nerdcast-episode-comments',
  playlists: 'nerdcast-playlists',
} as const

export interface BackupData {
  version: number
  exportedAt: string
  watched: string[]
  liked: string[]
  comments: Record<string, string>
  playlists: { id: string; name: string; episodeIds: string[] }[]
}

export function exportBackup(): BackupData {
  function read<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : fallback
    } catch {
      return fallback
    }
  }

  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    watched: normalizeStringArray(read(KEYS.watched, [])),
    liked: normalizeStringArray(read(KEYS.liked, [])),
    comments: normalizeEpisodeComments(read(KEYS.comments, {})),
    playlists: normalizePlaylists(read(KEYS.playlists, [])),
  }
}

export function downloadBackup(): void {
  const data = exportBackup()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const date = new Date().toISOString().slice(0, 10)
  const a = document.createElement('a')
  a.href = url
  a.download = `nerdcast-backup-${date}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export type ImportBackupResult = {
  ok: true
  watched: number
  liked: number
  comments: number
  playlists: number
} | {
  ok: false
  error: string
}

export function importBackup(raw: unknown): ImportBackupResult {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, error: 'Arquivo inválido.' }
  }

  const data = raw as Record<string, unknown>

  if (typeof data.version !== 'number' || data.version > BACKUP_VERSION) {
    return { ok: false, error: 'Versão do backup não suportada.' }
  }

  const watched = normalizeStringArray(data.watched)
  const liked = normalizeStringArray(data.liked)
  const comments = normalizeEpisodeComments(data.comments)
  const playlists = normalizePlaylists(data.playlists)

  try {
    localStorage.setItem(KEYS.watched, JSON.stringify(watched))
    localStorage.setItem(KEYS.liked, JSON.stringify(liked))
    localStorage.setItem(KEYS.comments, JSON.stringify(comments))
    localStorage.setItem(KEYS.playlists, JSON.stringify(playlists))
  } catch {
    return { ok: false, error: 'Não foi possível salvar os dados.' }
  }

  return {
    ok: true,
    watched: watched.length,
    liked: liked.length,
    comments: Object.keys(comments).length,
    playlists: playlists.length,
  }
}
