import { useCallback, useEffect, useState } from 'react'
import { loadJson, saveJson } from '../utils/storage'

export const MAX_EPISODE_COMMENT_LENGTH = 4000

export type EpisodeComments = Record<string, string>

function sanitizeComment(comment: string): string {
  return comment.replace(/\r\n/g, '\n').slice(0, MAX_EPISODE_COMMENT_LENGTH)
}

export function normalizeEpisodeComments(value: unknown): EpisodeComments {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value).flatMap(([rawEpisodeId, rawComment]) => {
      const episodeId = rawEpisodeId.trim()

      if (!episodeId || typeof rawComment !== 'string') {
        return []
      }

      const comment = sanitizeComment(rawComment).trim()

      return comment ? [[episodeId, comment]] : []
    })
  )
}

export function useEpisodeComments(storagePrefix: string) {
  const storageKey = `${storagePrefix}-episode-comments`
  const [comments, setComments] = useState<EpisodeComments>(() =>
    loadJson(storageKey, {}, normalizeEpisodeComments)
  )

  useEffect(() => { saveJson(storageKey, comments) }, [storageKey, comments])

  const setComment = useCallback((episodeId: string, rawComment: string) => {
    const comment = sanitizeComment(rawComment)

    setComments(prev => {
      const next = { ...prev }

      if (comment.trim()) {
        next[episodeId] = comment
      } else {
        delete next[episodeId]
      }

      return next
    })
  }, [])

  return { comments, setComment, count: Object.keys(comments).length }
}
