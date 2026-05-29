import { useCallback, useEffect, useState } from 'react'
import { loadStringSet, saveStringSet } from '../utils/storage'

export function useLikes(storagePrefix: string) {
  const storageKey = `${storagePrefix}-liked`
  const [liked, setLiked] = useState<Set<string>>(() => loadStringSet(storageKey))

  useEffect(() => { saveStringSet(storageKey, liked) }, [storageKey, liked])

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
