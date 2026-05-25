import { useCallback, useEffect, useState } from 'react'
import { loadStringSet, saveStringSet } from '../utils/storage'

const STORAGE_KEY = 'nerdcast-watched'

export function useChecklist() {
  const [watched, setWatched] = useState<Set<string>>(() => loadStringSet(STORAGE_KEY))

  useEffect(() => { saveStringSet(STORAGE_KEY, watched) }, [watched])

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
