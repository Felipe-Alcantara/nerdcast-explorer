import { useMemo, useState } from 'react'
import { fetchEpisodeFullDescription } from '../utils/episode-content'
import { sanitizeDescriptionHtml, stripHtml } from '../utils/html'

interface Props {
  episodeId: string
  slug: string
  descriptionHtml: string
}

type DescriptionStatus = 'idle' | 'loading' | 'loaded' | 'error'

export function EpisodeDescription({ episodeId, slug, descriptionHtml }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [fullDescription, setFullDescription] = useState('')
  const [descriptionStatus, setDescriptionStatus] = useState<DescriptionStatus>('idle')

  const description = descriptionHtml ? stripHtml(descriptionHtml) : ''
  const hasDescription = !!descriptionHtml?.trim()
  const hasDescriptionDetails = hasDescription || !!slug
  const fullDescriptionText = fullDescription ? stripHtml(fullDescription) : ''
  const expandedDescription = useMemo(() => {
    const parts = []

    if (descriptionHtml) {
      parts.push(descriptionHtml)
    }

    if (fullDescription && fullDescriptionText !== description) {
      parts.push(fullDescription)
    }

    return sanitizeDescriptionHtml(parts.join('\n'))
  }, [description, descriptionHtml, fullDescription, fullDescriptionText])

  async function loadFullDescription() {
    if (!slug || descriptionStatus === 'loading' || descriptionStatus === 'loaded') {
      return
    }

    setDescriptionStatus('loading')

    try {
      const content = await fetchEpisodeFullDescription(slug)
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
    <>
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
          aria-controls={`description-${episodeId}`}
          className="self-start text-xs font-medium text-violet-300 hover:text-violet-200 transition cursor-pointer rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
        >
          {expanded ? 'Recolher descrição' : 'Ver descrição completa'}
        </button>
      )}

      {expanded && (
        <div id={`description-${episodeId}`} className="mt-1 text-xs text-slate-300 leading-relaxed">
          {expandedDescription && (
            <div
              className="episode-description"
              dangerouslySetInnerHTML={{ __html: expandedDescription }}
            />
          )}
          {descriptionStatus === 'loading' && (
            <p className="text-slate-500">Carregando descrição completa...</p>
          )}
          {descriptionStatus === 'error' && (
            <p className="text-amber-300">Não foi possível carregar a descrição completa. Exibindo o resumo local.</p>
          )}
        </div>
      )}
    </>
  )
}
