import type { GuestFilterOption, Playlist, Program, SortOrder, Theme } from '../types'
import { FilterPeriodActions } from './FilterPeriodActions'
import { FilterSearchSort } from './FilterSearchSort'
import { FilterSelects } from './FilterSelects'
import { FilterStats } from './FilterStats'
import { PlaylistControls } from './PlaylistControls'

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
  onOpenPlaylistShare: () => void
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
  onPlaylist, onCreatePlaylist, onDeletePlaylist, onTogglePlaylistOnly, onOpenPlaylistShare,
  programs, themes, guests, playlists, years,
  total, filtered,
  watchedCount,
  likedCount,
}: Props) {
  return (
    <div className="border-b border-white/5 px-4 py-3">
      <div className="max-w-5xl mx-auto flex flex-col gap-3">
        <FilterSearchSort
          search={search}
          onSearch={onSearch}
          sortOrder={sortOrder}
          onSort={onSort}
        />

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
          onOpenShare={onOpenPlaylistShare}
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

        <FilterStats
          total={total}
          filtered={filtered}
          watchedCount={watchedCount}
          likedCount={likedCount}
        />
      </div>
    </div>
  )
}
