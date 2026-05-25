import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'nerdcast-watched'

function load(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function save(set: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)))
}

export function useChecklist() {
  const [watched, setWatched] = useState<Set<string>>(() => load())

  useEffect(() => { save(watched) }, [watched])

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
