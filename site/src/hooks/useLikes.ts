import { useCallback, useEffect, useState } from 'react'
import { loadStringSet, saveStringSet } from '../utils/storage'

const STORAGE_KEY = 'nerdcast-liked'

export function useLikes() {
  const [liked, setLiked] = useState<Set<string>>(() => loadStringSet(STORAGE_KEY))

  useEffect(() => { saveStringSet(STORAGE_KEY, liked) }, [liked])

  const toggle = useCallback((id: string) => {
    setLiked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const isLiked = useCallback((id: string) => liked.has(id), [liked])

  return { liked, toggle, isLiked, count: liked.size }
}
