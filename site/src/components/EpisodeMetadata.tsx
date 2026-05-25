import { formatDuration, formatEpisodeDate } from '../utils/episode-format'

interface Props {
  episodeId: string
  date: string
  durationSeconds: number | null
  activePlaylistName: string
  isInActivePlaylist: boolean
  onTogglePlaylist: (id: string) => void
}

export function EpisodeMetadata({
  episodeId,
  date,
  durationSeconds,
  activePlaylistName,
  isInActivePlaylist,
  onTogglePlaylist,
}: Props) {
  const duration = formatDuration(durationSeconds)

  return (
    <div className="flex flex-col items-end gap-1 shrink-0 text-xs text-slate-500">
      <span>{formatEpisodeDate(date)}</span>
      {duration && <span>{duration}</span>}
      {activePlaylistName && (
        <button
          type="button"
          onClick={() => onTogglePlaylist(episodeId)}
          title={isInActivePlaylist ? `Remover de ${activePlaylistName}` : `Adicionar a ${activePlaylistName}`}
          className={`mt-1 max-w-24 rounded border px-2 py-1 text-[11px] font-medium transition cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 ${
            isInActivePlaylist
              ? 'border-violet-500/50 bg-violet-500/10 text-violet-300 hover:bg-violet-500/15'
              : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
          }`}
        >
          {isInActivePlaylist ? 'Na playlist' : '+ Playlist'}
        </button>
      )}
    </div>
  )
}
