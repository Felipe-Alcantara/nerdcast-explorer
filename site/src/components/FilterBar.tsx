import { useEffect, useState } from 'react'
import type { GuestFilterOption, Playlist, Program, SortOrder, Theme } from '../types'
import { cx } from '../utils/cx'
import { FilterPeriodActions } from './FilterPeriodActions'
import { FilterSearchSort } from './FilterSearchSort'
import { FilterSelects } from './FilterSelects'
import { FilterStats } from './FilterStats'
import { PlaylistControls } from './PlaylistControls'
import { BTN_CLS } from './filterStyles'

interface Props {
  search: string
  onSearch: (v: string) => void
  selectedProgram: string
  onProgram: (v: string) => void
  selectedTheme: string
  onTheme: (v: string) => void
  selectedGuest: string
  onGuest: (v: string) => void
  yearFrom: string
  onYearFrom: (v: string) => void
  yearTo: string
  onYearTo: (v: string) => void
  sortOrder: SortOrder
  onSort: (v: SortOrder) => void
  onlyUnwatched: boolean
  onToggleUnwatched: () => void
  onlyLiked: boolean
  onToggleLiked: () => void
  selectedPlaylistId: string
  playlistOnly: boolean
  onPlaylist: (id: string) => void
  onCreatePlaylist: (name: string) => boolean
  onDeletePlaylist: (id: string) => void
  onTogglePlaylistOnly: () => void
  programs: Program[]
  themes: Theme[]
  guests: GuestFilterOption[]
  playlists: Playlist[]
  years: number[]
  total: number
  filtered: number
  watchedCount: number
  likedCount: number
}

export function FilterBar({
  search, onSearch,
  selectedProgram, onProgram,
  selectedTheme, onTheme,
  selectedGuest, onGuest,
  yearFrom, onYearFrom,
  yearTo, onYearTo,
  sortOrder, onSort,
  onlyUnwatched, onToggleUnwatched,
  onlyLiked, onToggleLiked,
  selectedPlaylistId, playlistOnly,
  onPlaylist, onCreatePlaylist, onDeletePlaylist, onTogglePlaylistOnly,
  programs, themes, guests, playlists, years,
  total, filtered,
  watchedCount,
  likedCount,
}: Props) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const activeFilterCount = [
    selectedProgram,
    selectedTheme,
    selectedGuest,
    yearFrom,
    yearTo,
    selectedPlaylistId,
    onlyUnwatched,
    onlyLiked,
    playlistOnly,
  ].filter(Boolean).length

  useEffect(() => {
    if (!mobileFiltersOpen) {
      return
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMobileFiltersOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [mobileFiltersOpen])

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setMobileFiltersOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function renderFilterControls() {
    return (
      <>
        <FilterSelects
          selectedProgram={selectedProgram}
          onProgram={onProgram}
          selectedTheme={selectedTheme}
          onTheme={onTheme}
          selectedGuest={selectedGuest}
          onGuest={onGuest}
          programs={programs}
          themes={themes}
          guests={guests}
        />

        <PlaylistControls
          playlists={playlists}
          selectedPlaylistId={selectedPlaylistId}
          playlistOnly={playlistOnly}
          onPlaylist={onPlaylist}
          onCreatePlaylist={onCreatePlaylist}
          onDeletePlaylist={onDeletePlaylist}
          onTogglePlaylistOnly={onTogglePlaylistOnly}
        />

        <FilterPeriodActions
          yearFrom={yearFrom}
          onYearFrom={onYearFrom}
          yearTo={yearTo}
          onYearTo={onYearTo}
          years={years}
          onlyUnwatched={onlyUnwatched}
          onToggleUnwatched={onToggleUnwatched}
          onlyLiked={onlyLiked}
          onToggleLiked={onToggleLiked}
        />
      </>
    )
  }

  return (
    <>
      <div className="sticky top-0 z-20 bg-[#0f0f13]/95 backdrop-blur border-b border-white/5 px-4 py-3">
        <div className="max-w-5xl mx-auto flex flex-col gap-3">
          <FilterSearchSort
            search={search}
            onSearch={onSearch}
            sortOrder={sortOrder}
            onSort={onSort}
          />

          <div className="hidden md:flex md:flex-col md:gap-3">
            {renderFilterControls()}
          </div>

          <div className="hidden md:block">
            <FilterStats
              total={total}
              filtered={filtered}
              watchedCount={watchedCount}
              likedCount={likedCount}
            />
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <p className="min-w-0 flex-1 truncate text-xs text-slate-500">
              {filtered === total
                ? `${total.toLocaleString('pt-BR')} episodios`
                : `${filtered.toLocaleString('pt-BR')} de ${total.toLocaleString('pt-BR')} episodios`}
            </p>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className={cx(BTN_CLS, 'shrink-0 border-violet-500/40 text-violet-200')}
            >
              Filtros{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </button>
          </div>
        </div>
      </div>

      {mobileFiltersOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filtros"
          className="fixed inset-0 z-50 flex h-dvh flex-col bg-[#0f0f13] md:hidden"
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-white">Filtros</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {filtered.toLocaleString('pt-BR')} de {total.toLocaleString('pt-BR')} episodios
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className={BTN_CLS}
            >
              Fechar
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="mx-auto flex max-w-5xl flex-col gap-3 pb-24">
              {renderFilterControls()}
            </div>
          </div>

          <div className="border-t border-white/10 bg-[#0f0f13]/95 px-4 py-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className={cx(BTN_CLS, 'w-full border-violet-500/50 bg-violet-500/10 text-violet-200')}
            >
              Ver resultados
            </button>
          </div>
        </div>
      )}
    </>
  )
}
