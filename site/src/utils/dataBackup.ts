import { normalizeEpisodeComments } from '../hooks/useEpisodeComments'
import { normalizePlaylists } from '../hooks/usePlaylists'
import { normalizeStringArray } from './storage'

const BACKUP_VERSION = 1

function storageKeys(prefix: string) {
  return {
    watched: `${prefix}-watched`,
    liked: `${prefix}-liked`,
    comments: `${prefix}-episode-comments`,
    playlists: `${prefix}-playlists`,
  }
}

export interface BackupData {
  version: number
  exportedAt: string
  watched: string[]
  liked: string[]
  comments: Record<string, string>
  playlists: { id: string; name: string; episodeIds: string[] }[]
}

export function exportBackup(storagePrefix: string): BackupData {
  const keys = storageKeys(storagePrefix)

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
    watched: normalizeStringArray(read(keys.watched, [])),
    liked: normalizeStringArray(read(keys.liked, [])),
    comments: normalizeEpisodeComments(read(keys.comments, {})),
    playlists: normalizePlaylists(read(keys.playlists, [])),
  }
}

export function downloadBackup(storagePrefix: string): void {
  const data = exportBackup(storagePrefix)
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

export function importBackup(storagePrefix: string, raw: unknown): ImportBackupResult {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, error: 'Arquivo inválido.' }
  }

  const data = raw as Record<string, unknown>

  if (typeof data.version !== 'number' || data.version > BACKUP_VERSION) {
    return { ok: false, error: 'Versão do backup não suportada.' }
  }

  const keys = storageKeys(storagePrefix)
  const watched = normalizeStringArray(data.watched)
  const liked = normalizeStringArray(data.liked)
  const comments = normalizeEpisodeComments(data.comments)
  const playlists = normalizePlaylists(data.playlists)

  try {
    localStorage.setItem(keys.watched, JSON.stringify(watched))
    localStorage.setItem(keys.liked, JSON.stringify(liked))
    localStorage.setItem(keys.comments, JSON.stringify(comments))
    localStorage.setItem(keys.playlists, JSON.stringify(playlists))
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
