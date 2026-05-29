import { useCallback, useEffect, useState } from 'react'
import { loadStringSet, saveStringSet } from '../utils/storage'

export function useChecklist(storagePrefix: string) {
  const storageKey = `${storagePrefix}-watched`
  const [watched, setWatched] = useState<Set<string>>(() => loadStringSet(storageKey))

  useEffect(() => { saveStringSet(storageKey, watched) }, [storageKey, watched])

  const toggle = useCallback((id: string) => {
    setWatched(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const isWatched = useCallback((id: string) => watched.has(id), [watched])

  return { watched, toggle, isWatched, count: watched.size }
}
