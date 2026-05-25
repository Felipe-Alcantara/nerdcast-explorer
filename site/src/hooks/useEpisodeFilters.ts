import { useCallback, useMemo, useState } from 'react'
import type { Episode, GuestFilterOption, SortOrder } from '../types'

interface UseEpisodeFiltersArgs {
  episodes: Episode[]
  isWatched: (id: string) => boolean
  isLiked: (id: string) => boolean
  playlistEpisodeIds: Set<string>
  hasSelectedPlaylist: boolean
  pageSize: number
}

export function useEpisodeFilters({
  episodes,
  isWatched,
  isLiked,
  playlistEpisodeIds,
  hasSelectedPlaylist,
  pageSize,
}: UseEpisodeFiltersArgs) {
  const [search, setSearch] = useState('')
  const [selectedProgram, setSelectedProgram] = useState('')
  const [selectedTheme, setSelectedTheme] = useState('')
  const [selectedGuest, setSelectedGuest] = useState('')
  const [yearFrom, setYearFrom] = useState('')
  const [yearTo, setYearTo] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [onlyUnwatched, setOnlyUnwatched] = useState(false)
  const [onlyLiked, setOnlyLiked] = useState(false)
  const [playlistOnly, setPlaylistOnlyState] = useState(false)
  const [page, setPage] = useState(1)

  const resetPage = useCallback(() => setPage(1), [])

  const years = useMemo(() => {
    const set = new Set(episodes.map(e => e.year).filter(Boolean) as number[])
    return Array.from(set).sort((a, b) => b - a)
  }, [episodes])

  const guests = useMemo<GuestFilterOption[]>(() => {
    const index = new Map<string, GuestFilterOption>()

    for (const episode of episodes) {
      for (const guest of episode.guests) {
        const name = guest.name.trim()
        const value = name.toLocaleLowerCase('pt-BR')

        if (!name || !value) {
          continue
        }

        const option = index.get(value)

        if (option) {
          option.count += 1
        } else {
          index.set(value, { name, value, count: 1 })
        }
      }
    }

    return Array.from(index.values()).sort((a, b) =>
      a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
    )
  }, [episodes])

  const filtered = useMemo(() => {
    let list = episodes

    if (playlistOnly && hasSelectedPlaylist) {
      list = list.filter(e => playlistEpisodeIds.has(e.id))
    }
    if (selectedProgram) list = list.filter(e => e.program.slug === selectedProgram)
    if (selectedTheme) list = list.filter(e => e.theme === selectedTheme)
    if (selectedGuest) {
      list = list.filter(e =>
        e.guests.some(g => g.name.trim().toLocaleLowerCase('pt-BR') === selectedGuest)
      )
    }
    if (yearFrom) list = list.filter(e => e.year !== null && e.year >= parseInt(yearFrom))
    if (yearTo) list = list.filter(e => e.year !== null && e.year <= parseInt(yearTo))
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.guests.some(g => g.name.toLowerCase().includes(q))
      )
    }
    if (onlyUnwatched) list = list.filter(e => !isWatched(e.id))
    if (onlyLiked) list = list.filter(e => isLiked(e.id))

    return [...list].sort((a, b) =>
      sortOrder === 'desc'
        ? a.date < b.date ? 1 : -1
        : a.date > b.date ? 1 : -1
    )
  }, [
    episodes,
    playlistOnly,
    hasSelectedPlaylist,
    playlistEpisodeIds,
    selectedProgram,
    selectedTheme,
    selectedGuest,
    yearFrom,
    yearTo,
    search,
    onlyUnwatched,
    onlyLiked,
    isWatched,
    isLiked,
    sortOrder,
  ])

  const visible = useMemo(() => filtered.slice(0, page * pageSize), [filtered, page, pageSize])

  const setPlaylistOnly = useCallback((value: boolean) => {
    setPlaylistOnlyState(value)
    resetPage()
  }, [resetPage])

  return {
    search,
    selectedProgram,
    selectedTheme,
    selectedGuest,
    yearFrom,
    yearTo,
    sortOrder,
    onlyUnwatched,
    onlyLiked,
    playlistOnly,
    page,
    years,
    guests,
    filtered,
    visible,
    resetPage,
    setPlaylistOnly,
    setPage,
    handleSearch: useCallback((value: string) => {
      setSearch(value)
      resetPage()
    }, [resetPage]),
    handleProgram: useCallback((value: string) => {
      setSelectedProgram(value)
      resetPage()
    }, [resetPage]),
    handleTheme: useCallback((value: string) => {
      setSelectedTheme(value)
      resetPage()
    }, [resetPage]),
    handleGuest: useCallback((value: string) => {
      setSelectedGuest(value)
      resetPage()
    }, [resetPage]),
    handleYearFrom: useCallback((value: string) => {
      setYearFrom(value)
      resetPage()
    }, [resetPage]),
    handleYearTo: useCallback((value: string) => {
      setYearTo(value)
      resetPage()
    }, [resetPage]),
    handleSort: useCallback((value: SortOrder) => {
      setSortOrder(value)
      resetPage()
    }, [resetPage]),
    handleToggleUnwatched: useCallback(() => {
      setOnlyUnwatched(v => !v)
      resetPage()
    }, [resetPage]),
    handleToggleLiked: useCallback(() => {
      setOnlyLiked(v => !v)
      resetPage()
    }, [resetPage]),
    handleTogglePlaylistOnly: useCallback(() => {
      if (!hasSelectedPlaylist) {
        return
      }

      setPlaylistOnlyState(v => !v)
      resetPage()
    }, [hasSelectedPlaylist, resetPage]),
  }
}
