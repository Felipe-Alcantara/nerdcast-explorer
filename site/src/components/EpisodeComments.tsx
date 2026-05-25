import { useState } from 'react'
import { MAX_EPISODE_COMMENT_LENGTH } from '../hooks/useEpisodeComments'
import { cx } from '../utils/cx'

interface Props {
  episodeId: string
  comment: string
  onUpdateComment: (episodeId: string, comment: string) => void
}

export function EpisodeComments({ episodeId, comment, onUpdateComment }: Props) {
  const [expanded, setExpanded] = useState(false)
  const hasComment = comment.trim().length > 0
  const textareaId = `comments-${episodeId}`

  function clearComment() {
    onUpdateComment(episodeId, '')
    setExpanded(false)
  }

  return (
    <div className="mt-1">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setExpanded(value => !value)}
          aria-expanded={expanded}
          aria-controls={textareaId}
          className={cx(
            'self-start rounded text-xs font-medium transition cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400',
            hasComment
              ? 'text-amber-300 hover:text-amber-200'
              : 'text-slate-500 hover:text-amber-300'
          )}
        >
          {expanded
            ? 'Fechar comentarios'
            : hasComment
              ? 'Editar comentarios'
              : 'Adicionar comentarios'}
        </button>

        {hasComment && !expanded && (
          <span className="text-[11px] text-amber-300/70">Marcacoes salvas</span>
        )}
      </div>

      {hasComment && !expanded && (
        <p className="mt-1 max-w-2xl whitespace-pre-line line-clamp-2 rounded border border-amber-400/15 bg-amber-400/5 px-2.5 py-2 text-xs leading-relaxed text-amber-50/85">
          {comment.trim()}
        </p>
      )}

      {expanded && (
        <div id={textareaId} className="mt-2 max-w-2xl rounded border border-white/10 bg-white/[0.03] p-2.5">
          <textarea
            value={comment}
            onChange={event => onUpdateComment(episodeId, event.target.value)}
            maxLength={MAX_EPISODE_COMMENT_LENGTH}
            rows={4}
            placeholder="Ex.: 00:42 piada boa; 1:13:20 referencia para rever"
            className="min-h-24 w-full resize-y rounded border border-white/10 bg-[#111116] px-3 py-2 text-xs leading-relaxed text-slate-100 placeholder:text-slate-600 focus:border-amber-400/70 focus:outline-none"
          />
          <div className="mt-1.5 flex items-center justify-between gap-3 text-[11px] text-slate-500">
            <span>{comment.length.toLocaleString('pt-BR')} / {MAX_EPISODE_COMMENT_LENGTH.toLocaleString('pt-BR')}</span>
            {hasComment && (
              <button
                type="button"
                onClick={clearComment}
                className="rounded text-rose-300/80 transition hover:text-rose-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
              >
                Apagar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
