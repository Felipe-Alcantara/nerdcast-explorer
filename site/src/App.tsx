import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Episode, Program, Theme } from './types'
import { FilterBar } from './components/FilterBar'
import { EpisodeCard } from './components/EpisodeCard'
import { useChecklist } from './hooks/useChecklist'

const PAGE_SIZE = 100

export default function App() {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [selectedProgram, setSelectedProgram] = useState('')
  const [selectedTheme, setSelectedTheme] = useState('')
  const [yearFrom, setYearFrom] = useState('')
  const [yearTo, setYearTo] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [onlyUnwatched, setOnlyUnwatched] = useState(false)
  const [page, setPage] = useState(1)

  const { toggle, isWatched, count: watchedCount } = useChecklist()

  useEffect(() => {
    Promise.all([
      fetch('/episodes.json').then(r => r.json() as Promise<Episode[]>),
      fetch('/programs.json').then(r => r.json() as Promise<Program[]>),
      fetch('/themes.json').then(r => r.json() as Promise<Theme[]>),
    ]).then(([eps, progs, thms]) => {
      setEpisodes(eps)
      setPrograms(progs)
      setThemes(thms.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')))
      setLoading(false)
    })
  }, [])

  const years = useMemo(() => {
    const set = new Set(episodes.map(e => e.year).filter(Boolean) as number[])
    return Array.from(set).sort((a, b) => b - a)
  }, [episodes])

  const filtered = useMemo(() => {
    let list = episodes

    if (selectedProgram) list = list.filter(e => e.program.slug === selectedProgram)
    if (selectedTheme) list = list.filter(e => e.theme === selectedTheme)
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

    return [...list].sort((a, b) =>
      sortOrder === 'desc'
        ? a.date < b.date ? 1 : -1
        : a.date > b.date ? 1 : -1
    )
  }, [episodes, search, selectedProgram, selectedTheme, yearFrom, yearTo, sortOrder, onlyUnwatched, isWatched])

  const visible = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page])

  const resetPage = useCallback(() => setPage(1), [])
  const handleSearch = useCallback((value: string) => {
    setSearch(value)
    resetPage()
  }, [resetPage])
  const handleProgram = useCallback((value: string) => {
    setSelectedProgram(value)
    resetPage()
  }, [resetPage])
  const handleTheme = useCallback((value: string) => {
    setSelectedTheme(value)
    resetPage()
  }, [resetPage])
  const handleYearFrom = useCallback((value: string) => {
    setYearFrom(value)
    resetPage()
  }, [resetPage])
  const handleYearTo = useCallback((value: string) => {
    setYearTo(value)
    resetPage()
  }, [resetPage])
  const handleSort = useCallback((value: 'asc' | 'desc') => {
    setSortOrder(value)
    resetPage()
  }, [resetPage])
  const handleToggleUnwatched = useCallback(() => {
    setOnlyUnwatched(v => !v)
    resetPage()
  }, [resetPage])

  return (
    <div className="min-h-screen bg-[#0f0f13] text-slate-200">
      <header className="border-b border-white/5 px-4 py-5">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <span className="text-2xl">🎙️</span>
          <div>
            <h1 className="text-xl font-semibold text-white leading-none">NerdCast Explorer</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Acervo não-oficial · {episodes.length.toLocaleString('pt-BR')} episódios desde 2006
            </p>
          </div>
        </div>
      </header>

      <FilterBar
        search={search} onSearch={handleSearch}
        selectedProgram={selectedProgram} onProgram={handleProgram}
        selectedTheme={selectedTheme} onTheme={handleTheme}
        yearFrom={yearFrom} onYearFrom={handleYearFrom}
        yearTo={yearTo} onYearTo={handleYearTo}
        sortOrder={sortOrder} onSort={handleSort}
        onlyUnwatched={onlyUnwatched} onToggleUnwatched={handleToggleUnwatched}
        programs={programs} themes={themes} years={years}
        total={episodes.length} filtered={filtered.length}
        watchedCount={watchedCount}
      />

      <main className="max-w-5xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-500 text-sm">
            Carregando episódios...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-24 text-slate-500 text-sm">
            Nenhum episódio encontrado
          </div>
        ) : (
          <>
            {visible.map(ep => (
              <EpisodeCard
                key={ep.id}
                episode={ep}
                watched={isWatched(ep.id)}
                onToggle={toggle}
              />
            ))}
            {visible.length < filtered.length && (
              <div className="flex justify-center py-6">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="px-5 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-slate-300 hover:bg-white/10 transition cursor-pointer"
                >
                  Carregar mais ({filtered.length - visible.length} restantes)
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
