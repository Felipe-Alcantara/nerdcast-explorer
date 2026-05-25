import type { GuestFilterOption, Playlist, Program, Theme } from '../types'
import { PlaylistControls } from './PlaylistControls'

const SELECT_CLS = 'bg-[#1c1c28] border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-violet-500/50 transition cursor-pointer'
const BTN_CLS = 'bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10 transition whitespace-nowrap cursor-pointer'

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
  sortOrder: 'asc' | 'desc'
  onSort: (v: 'asc' | 'desc') => void
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
  const pct = total > 0 ? Math.round((watchedCount / total) * 100) : 0

  return (
    <div className="sticky top-0 z-10 bg-[#0f0f13]/95 backdrop-blur border-b border-white/5 px-4 py-3">
      <div className="max-w-5xl mx-auto flex flex-col gap-3">

        {/* Linha 1: busca + ordenação */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Buscar episódio..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-violet-500/50 transition"
          />
          <button onClick={() => onSort(sortOrder === 'desc' ? 'asc' : 'desc')} className={BTN_CLS}>
            {sortOrder === 'desc' ? '↓ Mais recente' : '↑ Mais antigo'}
          </button>
        </div>

        {/* Linha 2: programa + tema + convidado */}
        <div className="flex flex-wrap gap-2">
          <select value={selectedProgram} onChange={e => onProgram(e.target.value)} className={`${SELECT_CLS} flex-1 min-w-45`}>
            <option value="">Todos os programas</option>
            {programs.map(p => (
              <option key={p.slug} value={p.slug}>
                {p.name}{p.count ? ` (${p.count})` : ''}
              </option>
            ))}
          </select>
          <select value={selectedTheme} onChange={e => onTheme(e.target.value)} className={`${SELECT_CLS} flex-1 min-w-45`}>
            <option value="">Todos os temas</option>
            {themes.map(t => (
              <option key={t.slug} value={t.name}>{t.name}</option>
            ))}
          </select>
          <select value={selectedGuest} onChange={e => onGuest(e.target.value)} className={`${SELECT_CLS} flex-1 min-w-45`}>
            <option value="">Todos os convidados</option>
            {guests.map(g => (
              <option key={g.value} value={g.value}>
                {g.name} ({g.count})
              </option>
            ))}
          </select>
        </div>

        {/* Linha 3: playlists */}
        <PlaylistControls
          playlists={playlists}
          selectedPlaylistId={selectedPlaylistId}
          playlistOnly={playlistOnly}
          onPlaylist={onPlaylist}
          onCreatePlaylist={onCreatePlaylist}
          onDeletePlaylist={onDeletePlaylist}
          onTogglePlaylistOnly={onTogglePlaylistOnly}
        />

        {/* Linha 4: intervalo de anos + checklist */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-500 shrink-0">Período:</span>
          <select value={yearFrom} onChange={e => onYearFrom(e.target.value)} className={SELECT_CLS}>
            <option value="">Desde</option>
            {[...years].reverse().map(y => <option key={y} value={String(y)}>{y}</option>)}
          </select>
          <span className="text-xs text-slate-500">até</span>
          <select value={yearTo} onChange={e => onYearTo(e.target.value)} className={SELECT_CLS}>
            <option value="">Hoje</option>
            {years.map(y => <option key={y} value={String(y)}>{y}</option>)}
          </select>

          <div className="flex-1" />

          <button
            onClick={onToggleUnwatched}
            className={`${BTN_CLS} ${onlyUnwatched ? 'border-violet-500/50 text-violet-300 bg-violet-500/10' : ''}`}
          >
            {onlyUnwatched ? '✓ Só não ouvidos' : 'Só não ouvidos'}
          </button>
          <button
            onClick={onToggleLiked}
            className={`${BTN_CLS} ${onlyLiked ? 'border-rose-500/50 text-rose-300 bg-rose-500/10' : ''}`}
          >
            {onlyLiked ? '♥ Só curtidos' : 'Só curtidos'}
          </button>
        </div>

        {/* Linha 5: contadores */}
        <div className="flex items-center gap-4">
          <p className="text-xs text-slate-500">
            {filtered === total
              ? `${total.toLocaleString('pt-BR')} episódios`
              : `${filtered.toLocaleString('pt-BR')} de ${total.toLocaleString('pt-BR')} episódios`}
          </p>
          <div className="flex-1" />
          <p className="text-xs text-slate-500">
            Ouvidos: <span className="text-slate-300">{watchedCount.toLocaleString('pt-BR')}</span>
            {' / '}{total.toLocaleString('pt-BR')}
            {' '}
            <span className="text-violet-400">({pct}%)</span>
            <span className="mx-2 text-slate-700">·</span>
            Curtidos: <span className="text-rose-300">{likedCount.toLocaleString('pt-BR')}</span>
          </p>
        </div>

        {/* Barra de progresso */}
        {watchedCount > 0 && (
          <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
