import { useEffect, useState } from 'react'
import type { Episode, Program, Theme } from '../types'

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to load ${url}: HTTP ${response.status}`)
  }

  return response.json() as Promise<T>
}

export function useEpisodeData() {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    Promise.all([
      fetchJson<Episode[]>('/episodes.json'),
      fetchJson<Program[]>('/programs.json'),
      fetchJson<Theme[]>('/themes.json'),
    ])
      .then(([eps, progs, thms]) => {
        if (!active) {
          return
        }

        setEpisodes(eps)
        setPrograms(progs)
        setThemes(thms.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')))
      })
      .catch(error => {
        if (active) {
          setError(error instanceof Error ? error.message : 'Falha ao carregar dados do site.')
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  return { episodes, programs, themes, loading, error }
}
