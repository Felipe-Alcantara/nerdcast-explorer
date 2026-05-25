import { cx } from '../utils/cx'

interface Props {
  episodeId: string
  watched: boolean
  liked: boolean
  onToggleWatched: (id: string) => void
  onToggleLike: (id: string) => void
}

export function EpisodeQuickActions({
  episodeId,
  watched,
  liked,
  onToggleWatched,
  onToggleLike,
}: Props) {
  return (
    <div className="shrink-0 flex flex-col gap-2 pt-1">
      <button
        type="button"
        onClick={() => onToggleWatched(episodeId)}
        title={watched ? 'Marcar como não ouvido' : 'Marcar como ouvido'}
        aria-label={watched ? 'Marcar como não ouvido' : 'Marcar como ouvido'}
        className={cx(
          'w-5 h-5 rounded border flex items-center justify-center transition cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400',
          watched
            ? 'bg-violet-600 border-violet-500'
            : 'border-white/20 hover:border-violet-400 bg-transparent'
        )}
      >
        {watched && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <button
        type="button"
        onClick={() => onToggleLike(episodeId)}
        title={liked ? 'Remover like' : 'Marcar like'}
        aria-label={liked ? 'Remover like' : 'Marcar like'}
        className={cx(
          'w-5 h-5 rounded border flex items-center justify-center transition cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400',
          liked
            ? 'bg-rose-500/15 border-rose-500/60 text-rose-300'
            : 'border-white/20 text-slate-500 hover:border-rose-400 hover:text-rose-300 bg-transparent'
        )}
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} aria-hidden="true">
          <path
            d="M20.8 4.6c-1.6-1.6-4.2-1.6-5.8 0L12 7.6 9 4.6C7.4 3 4.8 3 3.2 4.6s-1.6 4.2 0 5.8L12 19.2l8.8-8.8c1.6-1.6 1.6-4.2 0-5.8Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}
