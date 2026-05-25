import { useCallback, useMemo, useState } from 'react'
import type { Episode, SortOrder } from '../types'
import { filterEpisodes, getEpisodeYears, getGuestFilterOptions } from '../utils/episode-filters'

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

  const years = useMemo(() => getEpisodeYears(episodes), [episodes])
  const guests = useMemo(() => getGuestFilterOptions(episodes), [episodes])

  const filtered = useMemo(() => {
    return filterEpisodes(episodes, {
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
    })
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
