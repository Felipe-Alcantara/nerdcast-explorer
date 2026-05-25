import { useState } from 'react'
import type { Playlist } from '../types'
import { cx } from '../utils/cx'
import { BTN_CLS, INPUT_CLS, SELECT_CLS } from './filterStyles'

interface Props {
  playlists: Playlist[]
  selectedPlaylistId: string
  playlistOnly: boolean
  onPlaylist: (id: string) => void
  onCreatePlaylist: (name: string) => boolean
  onDeletePlaylist: (id: string) => void
  onTogglePlaylistOnly: () => void
  onOpenShare: () => void
}

export function PlaylistControls({
  playlists,
  selectedPlaylistId,
  playlistOnly,
  onPlaylist,
  onCreatePlaylist,
  onDeletePlaylist,
  onTogglePlaylistOnly,
  onOpenShare,
}: Props) {
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const selectedPlaylist = playlists.find(playlist => playlist.id === selectedPlaylistId) ?? null
  const canCreate = newPlaylistName.trim().length > 0

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canCreate) {
      return
    }

    if (onCreatePlaylist(newPlaylistName)) {
      setNewPlaylistName('')
    }
  }

  function handleDelete() {
    if (!selectedPlaylist) {
      return
    }

    if (window.confirm(`Excluir a playlist "${selectedPlaylist.name}"?`)) {
      onDeletePlaylist(selectedPlaylist.id)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <select
        value={selectedPlaylistId}
        onChange={event => onPlaylist(event.target.value)}
        className={cx(SELECT_CLS, 'flex-1 min-w-45')}
      >
        <option value="">Selecionar playlist</option>
        {playlists.map(playlist => (
          <option key={playlist.id} value={playlist.id}>
            {playlist.name} ({playlist.episodeIds.length})
          </option>
        ))}
      </select>

      <form onSubmit={handleCreate} className="flex flex-1 gap-2">
        <input
          type="text"
          value={newPlaylistName}
          onChange={event => setNewPlaylistName(event.target.value)}
          placeholder="Nova playlist..."
          className={cx(INPUT_CLS, 'min-w-0 flex-1')}
        />
        <button type="submit" disabled={!canCreate} className={BTN_CLS}>
          Criar
        </button>
      </form>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onTogglePlaylistOnly}
          disabled={!selectedPlaylist}
          className={cx(BTN_CLS, playlistOnly && 'border-violet-500/50 text-violet-300 bg-violet-500/10')}
        >
          {playlistOnly ? 'Ver todos' : 'Só playlist'}
        </button>
        <button type="button" onClick={onOpenShare} className={BTN_CLS}>
          Compartilhar
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={!selectedPlaylist}
          className={BTN_CLS}
        >
          Excluir
        </button>
      </div>
    </div>
  )
}
