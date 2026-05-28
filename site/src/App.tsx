import { useCallback, useEffect, useMemo, useState } from 'react'
import { FilterBar } from './components/FilterBar'
import { DataBackupDialog } from './components/DataBackupDialog'
import { EpisodeCard } from './components/EpisodeCard'
import { PlaylistConflictDialog } from './components/PlaylistConflictDialog'
import { PlaylistShareDialog } from './components/PlaylistShareDialog'
import { useChecklist } from './hooks/useChecklist'
import { useEpisodeComments } from './hooks/useEpisodeComments'
import { useEpisodeData } from './hooks/useEpisodeData'
import { useEpisodeFilters } from './hooks/useEpisodeFilters'
import { useLikes } from './hooks/useLikes'
import {
  usePlaylists,
  type ImportPlanItem,
  type ImportResult,
} from './hooks/usePlaylists'
import {
  clearShareFromLocation,
  readShareFromLocation,
  type ParsedShare,
} from './utils/playlistShare'

const PAGE_SIZE = 100

export default function App() {
  const [backupOpen, setBackupOpen] = useState(false)
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('')
  const [initialShareFromUrl] = useState<ParsedShare | null>(() => readShareFromLocation())
  const [shareDialogOpen, setShareDialogOpen] = useState(() => initialShareFromUrl !== null)
  const [shareDialogMode, setShareDialogMode] = useState<'export' | 'import'>(
    () => (initialShareFromUrl ? 'import' : 'export'),
  )
  const [pendingImport, setPendingImport] = useState<ParsedShare | null>(() => initialShareFromUrl)
  const [importSummary, setImportSummary] = useState<ImportResult | null>(null)

  const { episodes, programs, themes, loading, error } = useEpisodeData()
  const { toggle, isWatched, count: watchedCount } = useChecklist()
  const { comments, setComment } = useEpisodeComments()
  const { toggle: toggleLike, isLiked, count: likedCount } = useLikes()
  const {
    playlists,
    createPlaylist,
    deletePlaylist,
    toggleEpisodeInPlaylist,
    importPlaylists,
    findPlaylistByName,
  } = usePlaylists()

  const selectedPlaylist = useMemo(
    () => playlists.find(playlist => playlist.id === selectedPlaylistId) ?? null,
    [playlists, selectedPlaylistId]
  )

  const selectedPlaylistEpisodeIds = useMemo(
    () => new Set(selectedPlaylist?.episodeIds ?? []),
    [selectedPlaylist]
  )

  const episodeFilters = useEpisodeFilters({
    episodes,
    isWatched,
    isLiked,
    playlistEpisodeIds: selectedPlaylistEpisodeIds,
    hasSelectedPlaylist: !!selectedPlaylist,
    pageSize: PAGE_SIZE,
  })
  const { resetPage, setPlaylistOnly } = episodeFilters

  const handlePlaylist = useCallback((id: string) => {
    setSelectedPlaylistId(id)
    if (!id) {
      setPlaylistOnly(false)
    } else {
      resetPage()
    }
  }, [resetPage, setPlaylistOnly])

  const handleCreatePlaylist = useCallback((name: string) => {
    const normalizedName = name.trim().toLocaleLowerCase('pt-BR')
    const existingPlaylist = playlists.find(playlist =>
      playlist.name.trim().toLocaleLowerCase('pt-BR') === normalizedName
    )

    if (existingPlaylist) {
      setSelectedPlaylistId(existingPlaylist.id)
      setPlaylistOnly(false)

      return true
    }

    const id = createPlaylist(name)

    if (!id) {
      return false
    }

    setSelectedPlaylistId(id)
    setPlaylistOnly(false)

    return true
  }, [createPlaylist, playlists, setPlaylistOnly])

  const handleDeletePlaylist = useCallback((id: string) => {
    deletePlaylist(id)

    if (id === selectedPlaylistId) {
      setSelectedPlaylistId('')
      setPlaylistOnly(false)
    }
  }, [deletePlaylist, selectedPlaylistId, setPlaylistOnly])

  const handleToggleEpisodeInPlaylist = useCallback((episodeId: string) => {
    if (selectedPlaylistId) {
      toggleEpisodeInPlaylist(selectedPlaylistId, episodeId)
    }
  }, [selectedPlaylistId, toggleEpisodeInPlaylist])

  const handleOpenShare = useCallback(() => {
    setShareDialogMode('export')
    setPendingImport(null)
    setImportSummary(null)
    setShareDialogOpen(true)
  }, [])

  const handleCloseShare = useCallback(() => {
    setShareDialogOpen(false)
    setPendingImport(null)
  }, [])

  const handleImportParsed = useCallback((parsed: ParsedShare) => {
    setPendingImport(parsed)
  }, [])

  const handleConfirmImport = useCallback((plan: ImportPlanItem[]) => {
    const result = importPlaylists(plan)
    setImportSummary(result)
    setPendingImport(null)
    setShareDialogOpen(false)
  }, [importPlaylists])

  useEffect(() => {
    if (initialShareFromUrl) {
      clearShareFromLocation()
    }
  }, [initialShareFromUrl])

  return (
    <div className="min-h-screen bg-[#0f0f13] text-slate-200">
      <header className="border-b border-white/5 px-4 py-5">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <span className="text-2xl">🎙️</span>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-white leading-none">NerdCast Explorer</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Acervo não-oficial · {episodes.length.toLocaleString('pt-BR')} episódios desde 2006
            </p>
          </div>
          <button
            type="button"
            onClick={() => setBackupOpen(true)}
            className="text-xs text-slate-400 hover:text-slate-200 transition px-2 py-1 rounded border border-white/10 hover:border-white/20"
          >
            Backup
          </button>
        </div>
      </header>

      <FilterBar
        search={episodeFilters.search} onSearch={episodeFilters.handleSearch}
        selectedProgram={episodeFilters.selectedProgram} onProgram={episodeFilters.handleProgram}
        selectedTheme={episodeFilters.selectedTheme} onTheme={episodeFilters.handleTheme}
        selectedGuest={episodeFilters.selectedGuest} onGuest={episodeFilters.handleGuest}
        yearFrom={episodeFilters.yearFrom} onYearFrom={episodeFilters.handleYearFrom}
        yearTo={episodeFilters.yearTo} onYearTo={episodeFilters.handleYearTo}
        sortOrder={episodeFilters.sortOrder} onSort={episodeFilters.handleSort}
        onlyUnwatched={episodeFilters.onlyUnwatched} onToggleUnwatched={episodeFilters.handleToggleUnwatched}
        onlyLiked={episodeFilters.onlyLiked} onToggleLiked={episodeFilters.handleToggleLiked}
        selectedPlaylistId={selectedPlaylistId}
        playlistOnly={episodeFilters.playlistOnly}
        onPlaylist={handlePlaylist}
        onCreatePlaylist={handleCreatePlaylist}
        onDeletePlaylist={handleDeletePlaylist}
        onTogglePlaylistOnly={episodeFilters.handleTogglePlaylistOnly}
        onOpenPlaylistShare={handleOpenShare}
        programs={programs} themes={themes} guests={episodeFilters.guests} playlists={playlists} years={episodeFilters.years}
        total={episodes.length} filtered={episodeFilters.filtered.length}
        watchedCount={watchedCount}
        likedCount={likedCount}
      />

      <main className="max-w-5xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-500 text-sm">
            Carregando episódios...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-24 text-amber-300 text-sm">
            {error}
          </div>
        ) : episodeFilters.filtered.length === 0 ? (
          <div className="flex items-center justify-center py-24 text-slate-500 text-sm">
            Nenhum episódio encontrado
          </div>
        ) : (
          <>
            {episodeFilters.visible.map(ep => (
              <EpisodeCard
                key={ep.id}
                episode={ep}
                watched={isWatched(ep.id)}
                liked={isLiked(ep.id)}
                comment={comments[ep.id] ?? ''}
                onToggle={toggle}
                onToggleLike={toggleLike}
                onUpdateComment={setComment}
                activePlaylistName={selectedPlaylist?.name ?? ''}
                isInActivePlaylist={selectedPlaylistEpisodeIds.has(ep.id)}
                onTogglePlaylist={handleToggleEpisodeInPlaylist}
              />
            ))}
            {episodeFilters.visible.length < episodeFilters.filtered.length && (
              <div className="flex justify-center py-6">
                <button
                  onClick={() => episodeFilters.setPage(p => p + 1)}
                  className="px-5 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-slate-300 hover:bg-white/10 transition cursor-pointer"
                >
                  Carregar mais ({episodeFilters.filtered.length - episodeFilters.visible.length} restantes)
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {shareDialogOpen && !pendingImport && (
        <PlaylistShareDialog
          playlists={playlists}
          initialMode={shareDialogMode}
          onClose={handleCloseShare}
          onImportParsed={handleImportParsed}
        />
      )}

      {pendingImport && (
        <PlaylistConflictDialog
          incoming={pendingImport.playlists}
          existingByName={findPlaylistByName}
          onCancel={handleCloseShare}
          onConfirm={handleConfirmImport}
        />
      )}

      {importSummary && (
        <ImportToast result={importSummary} onClose={() => setImportSummary(null)} />
      )}

      {backupOpen && (
        <DataBackupDialog
          onClose={() => setBackupOpen(false)}
          onImported={() => window.location.reload()}
        />
      )}
    </div>
  )
}

function ImportToast({ result, onClose }: { result: ImportResult; onClose: () => void }) {
  useEffect(() => {
    const timeout = window.setTimeout(onClose, 4500)
    return () => window.clearTimeout(timeout)
  }, [onClose])

  const parts = [
    result.added > 0 && `${result.added} adicionada(s)`,
    result.merged > 0 && `${result.merged} mesclada(s)`,
    result.replaced > 0 && `${result.replaced} substituída(s)`,
    result.skipped > 0 && `${result.skipped} ignorada(s)`,
  ].filter(Boolean) as string[]

  return (
    <div
      role="status"
      className="pointer-events-auto fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-200 shadow-lg"
    >
      Playlists importadas — {parts.join(' · ') || 'nenhuma alteração'}
    </div>
  )
}
