import type { Episode } from '../types'
import { TypeBadge } from './TypeBadge'

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function formatDate(date: string): string {
  if (!date) return ''
  const [year, month, day] = date.split('-')
  return `${day} ${MONTHS[parseInt(month) - 1]} ${year}`
}

interface Props {
  episode: Episode
}

export function EpisodeCard({ episode }: Props) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/3 transition group">
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <TypeBadge type={episode.type} />
          {episode.episode_number && (
            <span className="text-xs text-slate-500">#{episode.episode_number}</span>
          )}
        </div>
        <p className="text-sm text-slate-200 leading-snug">
          {episode.url ? (
            <a
              href={episode.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-violet-300 transition"
            >
              {episode.title}
            </a>
          ) : (
            episode.title
          )}
        </p>
      </div>
      <span className="text-xs text-slate-500 whitespace-nowrap shrink-0 mt-1">
        {formatDate(episode.date)}
      </span>
    </div>
  )
}
