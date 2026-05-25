import { useCallback, useEffect, useState } from 'react'
import type { Playlist } from '../types'

const STORAGE_KEY = 'nerdcast-playlists'

function createId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `playlist-${Date.now()}-${Math.random().toString(36).slice(2)}`
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

function load(): Playlist[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? normalizePlaylists(JSON.parse(raw)) : []
  } catch {
    return []
  }
}

function save(playlists: Playlist[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists))
}

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>(() => load())

  useEffect(() => { save(playlists) }, [playlists])

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

  return { playlists, createPlaylist, deletePlaylist, toggleEpisodeInPlaylist }
}
