import type { Episode } from '../types'
import { cx } from '../utils/cx'
import { EpisodeComments } from './EpisodeComments'
import { EpisodeDescription } from './EpisodeDescription'
import { EpisodeGuests } from './EpisodeGuests'
import { EpisodeMetadata } from './EpisodeMetadata'
import { EpisodeQuickActions } from './EpisodeQuickActions'
import { EpisodeThumbnail } from './EpisodeThumbnail'
import { ProgramBadge } from './ProgramBadge'

interface Props {
  episode: Episode
  watched: boolean
  liked: boolean
  comment: string
  onToggle: (id: string) => void
  onToggleLike: (id: string) => void
  onUpdateComment: (episodeId: string, comment: string) => void
  activePlaylistName: string
  isInActivePlaylist: boolean
  onTogglePlaylist: (id: string) => void
}

export function EpisodeCard({
  episode,
  watched,
  liked,
  comment,
  onToggle,
  onToggleLike,
  onUpdateComment,
  activePlaylistName,
  isInActivePlaylist,
  onTogglePlaylist,
}: Props) {
  return (
    <div className={cx(
      'flex items-start gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/3 transition group',
      watched && 'opacity-40'
    )}>
      <EpisodeQuickActions
        episodeId={episode.id}
        watched={watched}
        liked={liked}
        onToggleWatched={onToggle}
        onToggleLike={onToggleLike}
      />

      <EpisodeThumbnail
        image={episode.image}
        title={episode.title}
        url={episode.url}
      />

      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <ProgramBadge program={episode.program} />
          {episode.episode_number != null && (
            <span className="text-xs text-slate-500">#{episode.episode_number}</span>
          )}
          {episode.theme && (
            <span className="text-xs text-slate-500">· {episode.theme}</span>
          )}
        </div>

        <p className={cx(
          'text-sm leading-snug',
          watched ? 'line-through text-slate-500' : 'text-slate-200'
        )}>
          {episode.url ? (
            <a
              href={episode.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-violet-300 hover:underline underline-offset-2 transition"
              title={`Abrir no Jovem Nerd: ${episode.url}`}
            >
              {episode.title}
            </a>
          ) : (
            episode.title
          )}
        </p>

        <EpisodeGuests guests={episode.guests} />
        <EpisodeDescription
          episodeId={episode.id}
          slug={episode.slug}
          descriptionHtml={episode.description}
        />
        <EpisodeComments
          episodeId={episode.id}
          comment={comment}
          onUpdateComment={onUpdateComment}
        />
      </div>

      <EpisodeMetadata
        episodeId={episode.id}
        date={episode.date}
        durationSeconds={episode.duration_seconds}
        activePlaylistName={activePlaylistName}
        isInActivePlaylist={isInActivePlaylist}
        onTogglePlaylist={onTogglePlaylist}
      />
    </div>
  )
}
