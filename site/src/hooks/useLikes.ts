import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'nerdcast-liked'

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

export function useLikes() {
  const [liked, setLiked] = useState<Set<string>>(() => load())

  useEffect(() => { save(liked) }, [liked])

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
