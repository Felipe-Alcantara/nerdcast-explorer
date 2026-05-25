import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Episode } from './types'
import { FilterBar } from './components/FilterBar'
import { EpisodeCard } from './components/EpisodeCard'
import { useChecklist } from './hooks/useChecklist'

const PAGE_SIZE = 100

export default function App() {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [yearFrom, setYearFrom] = useState('')
  const [yearTo, setYearTo] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [onlyUnwatched, setOnlyUnwatched] = useState(false)
  const [page, setPage] = useState(1)

  const { toggle, isWatched, count: watchedCount } = useChecklist()

  useEffect(() => {
    fetch('/episodes.json')
      .then(r => r.json())
      .then((data: Episode[]) => {
        setEpisodes(data)
        setLoading(false)
      })
  }, [])

  const types = useMemo(() => {
    const set = new Set(episodes.map(e => e.type))
    return Array.from(set).sort()
  }, [episodes])

  const years = useMemo(() => {
    const set = new Set(episodes.map(e => e.year).filter(Boolean) as number[])
    return Array.from(set).sort((a, b) => b - a)
  }, [episodes])

  const filtered = useMemo(() => {
    let list = episodes

    if (selectedType) list = list.filter(e => e.type === selectedType)
    if (yearFrom) list = list.filter(e => e.year !== null && e.year >= parseInt(yearFrom))
    if (yearTo) list = list.filter(e => e.year !== null && e.year <= parseInt(yearTo))
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(e => e.title.toLowerCase().includes(q))
    }
    if (onlyUnwatched) list = list.filter(e => !isWatched(e.id))

    return [...list].sort((a, b) =>
      sortOrder === 'desc'
        ? a.date < b.date ? 1 : -1
        : a.date > b.date ? 1 : -1
    )
  }, [episodes, search, selectedType, yearFrom, yearTo, sortOrder, onlyUnwatched, isWatched])

  const visible = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page])

  useEffect(() => {
    setPage(1)
  }, [search, selectedType, yearFrom, yearTo, sortOrder, onlyUnwatched])

  const handleToggleUnwatched = useCallback(() => setOnlyUnwatched(v => !v), [])

  return (
    <div className="min-h-screen bg-[#0f0f13] text-slate-200">
      <header className="border-b border-white/5 px-4 py-5">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <span className="text-2xl">🎙️</span>
          <div>
            <h1 className="text-xl font-semibold text-white leading-none">NerdCast Explorer</h1>
            <p className="text-xs text-slate-500 mt-0.5">Acervo não-oficial · 2006–2024</p>
          </div>
        </div>
      </header>

      <FilterBar
        search={search} onSearch={setSearch}
        selectedType={selectedType} onType={setSelectedType}
        yearFrom={yearFrom} onYearFrom={setYearFrom}
        yearTo={yearTo} onYearTo={setYearTo}
        sortOrder={sortOrder} onSort={setSortOrder}
        onlyUnwatched={onlyUnwatched} onToggleUnwatched={handleToggleUnwatched}
        types={types} years={years}
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
