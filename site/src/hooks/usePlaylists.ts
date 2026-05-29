import { useCallback, useEffect, useState } from 'react'
import type { Playlist } from '../types'
import { loadJson, saveJson } from '../utils/storage'


export type ImportConflictAction = 'replace' | 'merge' | 'duplicate' | 'skip'

export interface ImportablePlaylist {
  name: string
  episodeIds: string[]
}

export interface ImportPlanItem {
  incoming: ImportablePlaylist
  existing: Playlist | null
  action: ImportConflictAction
}

export interface ImportResult {
  added: number
  replaced: number
  merged: number
  skipped: number
}

function createId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `playlist-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function findByName(playlists: Playlist[], name: string): Playlist | null {
  const target = name.trim().toLocaleLowerCase('pt-BR')
  return playlists.find(playlist => playlist.name.trim().toLocaleLowerCase('pt-BR') === target) ?? null
}

function nextAvailableName(playlists: Playlist[], baseName: string): string {
  const taken = new Set(playlists.map(playlist => playlist.name.trim().toLocaleLowerCase('pt-BR')))
  const trimmed = baseName.trim() || 'Playlist'
  const importedLabel = `${trimmed} (importada)`
  if (!taken.has(importedLabel.toLocaleLowerCase('pt-BR'))) {
    return importedLabel
  }
  let attempt = 2
  while (taken.has(`${importedLabel} ${attempt}`.toLocaleLowerCase('pt-BR'))) {
    attempt += 1
  }
  return `${importedLabel} ${attempt}`
}

export function normalizePlaylists(value: unknown): Playlist[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap(item => {
    if (!item || typeof item !== 'object') {
      return []
    }

    const raw = item as Partial<Playlist>
    const id = typeof raw.id === 'string' ? raw.id.trim() : ''
    const name = typeof raw.name === 'string' ? raw.name.trim() : ''
    const episodeIds = Array.isArray(raw.episodeIds)
      ? Array.from(new Set(raw.episodeIds.filter((episodeId): episodeId is string => typeof episodeId === 'string')))
      : []

    if (!id || !name) {
      return []
    }

    return [{ id, name, episodeIds }]
  })
}

export function usePlaylists(storagePrefix: string) {
  const storageKey = `${storagePrefix}-playlists`
  const [playlists, setPlaylists] = useState<Playlist[]>(() =>
    loadJson(storageKey, [], normalizePlaylists)
  )

  useEffect(() => { saveJson(storageKey, playlists) }, [storageKey, playlists])

  const createPlaylist = useCallback((rawName: string) => {
    const name = rawName.trim()

    if (!name) {
      return ''
    }

    const id = createId()
    setPlaylists(prev => [...prev, { id, name, episodeIds: [] }])

    return id
  }, [])

  const deletePlaylist = useCallback((id: string) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== id))
  }, [])

  const toggleEpisodeInPlaylist = useCallback((playlistId: string, episodeId: string) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id !== playlistId) {
        return playlist
      }

      const episodeIds = new Set(playlist.episodeIds)

      if (episodeIds.has(episodeId)) {
        episodeIds.delete(episodeId)
      } else {
        episodeIds.add(episodeId)
      }

      return { ...playlist, episodeIds: Array.from(episodeIds) }
    }))
  }, [])

  const importPlaylists = useCallback((plan: ImportPlanItem[]): ImportResult => {
    const result: ImportResult = { added: 0, replaced: 0, merged: 0, skipped: 0 }

    setPlaylists(prev => {
      const next = [...prev]

      for (const item of plan) {
        const incomingName = item.incoming.name.trim()
        const incomingIds = Array.from(new Set(item.incoming.episodeIds.filter(Boolean)))

        if (!incomingName) {
          result.skipped += 1
          continue
        }

        if (item.action === 'skip') {
          result.skipped += 1
          continue
        }

        const existingIndex = item.existing
          ? next.findIndex(playlist => playlist.id === item.existing!.id)
          : -1
        const existing = existingIndex >= 0 ? next[existingIndex] : null

        if (item.action === 'replace' && existing) {
          next[existingIndex] = { ...existing, name: incomingName, episodeIds: incomingIds }
          result.replaced += 1
          continue
        }

        if (item.action === 'merge' && existing) {
          const merged = Array.from(new Set([...existing.episodeIds, ...incomingIds]))
          next[existingIndex] = { ...existing, episodeIds: merged }
          result.merged += 1
          continue
        }

        const name = existing ? nextAvailableName(next, incomingName) : incomingName
        next.push({ id: createId(), name, episodeIds: incomingIds })
        result.added += 1
      }

      return next
    })

    return result
  }, [])

  const findPlaylistByName = useCallback(
    (name: string) => findByName(playlists, name),
    [playlists],
  )

  return {
    playlists,
    createPlaylist,
    deletePlaylist,
    toggleEpisodeInPlaylist,
    importPlaylists,
    findPlaylistByName,
  }
}
