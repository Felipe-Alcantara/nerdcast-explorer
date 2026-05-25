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
  watched: boolean
  onToggle: (id: string) => void
}

export function EpisodeCard({ episode, watched, onToggle }: Props) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/3 transition group ${watched ? 'opacity-40' : ''}`}>

      {/* Checkbox */}
      <button
        onClick={() => onToggle(episode.id)}
        title={watched ? 'Marcar como não ouvido' : 'Marcar como ouvido'}
        className={`shrink-0 w-5 h-5 rounded border flex items-center justify-center transition cursor-pointer
          ${watched
            ? 'bg-violet-600 border-violet-500'
            : 'border-white/20 hover:border-violet-400 bg-transparent'}`}
      >
        {watched && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Conteúdo */}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <TypeBadge type={episode.type} />
          {episode.episode_number && (
            <span className="text-xs text-slate-500">#{episode.episode_number}</span>
          )}
        </div>
        <p className={`text-sm leading-snug ${watched ? 'line-through text-slate-500' : 'text-slate-200'}`}>
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

      <span className="text-xs text-slate-500 whitespace-nowrap shrink-0">
        {formatDate(episode.date)}
      </span>
    </div>
  )
}
