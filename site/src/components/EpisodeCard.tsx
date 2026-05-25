import { useMemo, useState } from 'react'
import type { Episode } from '../types'
import { ProgramBadge } from './ProgramBadge'
import { fetchEpisodeFullDescription } from '../utils/episode-content'
import { sanitizeDescriptionHtml, stripHtml } from '../utils/html'

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function formatDate(date: string): string {
  if (!date) return ''
  const [year, month, day] = date.split('-')
  return `${day} ${MONTHS[parseInt(month) - 1]} ${year}`
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return ''
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return h > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${m}min`
}

function guestUrl(twitter: string): string {
  if (!twitter) return ''
  if (/^https?:\/\//i.test(twitter)) return twitter
  return `https://twitter.com/${twitter.replace(/^@/, '')}`
}

function thumbUrl(image: string): string {
  if (!image) return ''
  // Já tem dimensão no nome do arquivo? Usa direto.
  if (/-\d+x\d+\.(jpg|jpeg|png|webp)/i.test(image)) return image
  // Senão, pede resize via query (CDN do site suporta)
  return image.includes('?') ? image : `${image}?ims=180x180/filters:quality(75)`
}

interface Props {
  episode: Episode
  watched: boolean
  onToggle: (id: string) => void
}

type DescriptionStatus = 'idle' | 'loading' | 'loaded' | 'error'

export function EpisodeCard({ episode, watched, onToggle }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [fullDescription, setFullDescription] = useState('')
  const [descriptionStatus, setDescriptionStatus] = useState<DescriptionStatus>('idle')
  const thumb = thumbUrl(episode.image)
  const duration = formatDuration(episode.duration_seconds)
  const description = episode.description ? stripHtml(episode.description) : ''
  const hasDescription = !!episode.description?.trim()
  const hasDescriptionDetails = hasDescription || !!episode.slug
  const fullDescriptionText = fullDescription ? stripHtml(fullDescription) : ''
  const expandedDescription = useMemo(() => {
    const parts = []

    if (episode.description) {
      parts.push(episode.description)
    }

    if (fullDescription && fullDescriptionText !== description) {
      parts.push(fullDescription)
    }

    return sanitizeDescriptionHtml(parts.join('\n'))
  }, [description, episode.description, fullDescription, fullDescriptionText])

  async function loadFullDescription() {
    if (!episode.slug || descriptionStatus === 'loading' || descriptionStatus === 'loaded') {
      return
    }

    setDescriptionStatus('loading')

    try {
      const content = await fetchEpisodeFullDescription(episode.slug)
      setFullDescription(content)
      setDescriptionStatus('loaded')
    } catch {
      setDescriptionStatus('error')
    }
  }

  function toggleDescription() {
    const nextExpanded = !expanded
    setExpanded(nextExpanded)

    if (nextExpanded) {
      void loadFullDescription()
    }
  }

  return (
    <div className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/3 transition group ${watched ? 'opacity-40' : ''}`}>

      {/* Checkbox */}
      <button
        onClick={() => onToggle(episode.id)}
        title={watched ? 'Marcar como não ouvido' : 'Marcar como ouvido'}
        className={`shrink-0 w-5 h-5 mt-1 rounded border flex items-center justify-center transition cursor-pointer
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

      {/* Thumbnail (também é link) */}
      {thumb && (
        episode.url ? (
          <a
            href={episode.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
            title={`Abrir "${episode.title}" no Jovem Nerd`}
          >
            <img
              src={thumb}
              alt=""
              loading="lazy"
              width={64}
              height={64}
              className="w-16 h-16 rounded object-cover bg-white/5 hover:opacity-80 transition"
            />
          </a>
        ) : (
          <img
            src={thumb}
            alt=""
            loading="lazy"
            width={64}
            height={64}
            className="shrink-0 w-16 h-16 rounded object-cover bg-white/5"
          />
        )
      )}

      {/* Conteúdo */}
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

        <p className={`text-sm leading-snug ${watched ? 'line-through text-slate-500' : 'text-slate-200'}`}>
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

        {episode.guests.length > 0 && (
          <p className="text-xs text-slate-500 truncate">
            com{' '}
            {episode.guests.map((g, i) => {
              const url = guestUrl(g.twitter)
              return (
                <span key={g.id ?? g.name}>
                  {i > 0 && ', '}
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-violet-300 hover:underline underline-offset-2 transition"
                      title={`Abrir Twitter de ${g.name}`}
                    >
                      {g.name}
                    </a>
                  ) : (
                    g.name
                  )}
                </span>
              )
            })}
          </p>
        )}

        {hasDescription && !expanded && (
          <p className="text-xs text-slate-400 line-clamp-2">
            {description}
          </p>
        )}

        {hasDescriptionDetails && (
          <button
            type="button"
            onClick={toggleDescription}
            aria-expanded={expanded}
            aria-controls={`description-${episode.id}`}
            className="self-start text-xs font-medium text-violet-300 hover:text-violet-200 transition cursor-pointer rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
          >
            {expanded ? 'Recolher descricao' : 'Ver descricao completa'}
          </button>
        )}

        {expanded && (
          <div id={`description-${episode.id}`} className="mt-1 text-xs text-slate-300 leading-relaxed">
            {expandedDescription && (
              <div
                className="episode-description"
                dangerouslySetInnerHTML={{ __html: expandedDescription }}
              />
            )}
            {descriptionStatus === 'loading' && (
              <p className="text-slate-500">Carregando descricao completa...</p>
            )}
            {descriptionStatus === 'error' && (
              <p className="text-amber-300">Nao foi possivel carregar a descricao completa. Exibindo o resumo local.</p>
            )}
          </div>
        )}
      </div>

      {/* Metadados à direita */}
      <div className="flex flex-col items-end gap-1 shrink-0 text-xs text-slate-500">
        <span>{formatDate(episode.date)}</span>
        {duration && <span>{duration}</span>}
      </div>
    </div>
  )
}
