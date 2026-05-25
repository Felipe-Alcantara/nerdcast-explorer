const SELECT_CLS = 'bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-violet-500/50 transition cursor-pointer'
const BTN_CLS = 'bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10 transition whitespace-nowrap cursor-pointer'

interface Props {
  search: string
  onSearch: (v: string) => void
  selectedType: string
  onType: (v: string) => void
  yearFrom: string
  onYearFrom: (v: string) => void
  yearTo: string
  onYearTo: (v: string) => void
  sortOrder: 'asc' | 'desc'
  onSort: (v: 'asc' | 'desc') => void
  onlyUnwatched: boolean
  onToggleUnwatched: () => void
  types: string[]
  years: number[]
  total: number
  filtered: number
  watchedCount: number
}

export function FilterBar({
  search, onSearch,
  selectedType, onType,
  yearFrom, onYearFrom,
  yearTo, onYearTo,
  sortOrder, onSort,
  onlyUnwatched, onToggleUnwatched,
  types, years,
  total, filtered,
  watchedCount,
}: Props) {
  const pct = total > 0 ? Math.round((watchedCount / total) * 100) : 0

  return (
    <div className="sticky top-0 z-10 bg-[#0f0f13]/95 backdrop-blur border-b border-white/5 px-4 py-3">
      <div className="max-w-5xl mx-auto flex flex-col gap-3">

        {/* Linha 1: busca + programa + ordenação */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Buscar episódio..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-violet-500/50 transition"
          />
          <select value={selectedType} onChange={e => onType(e.target.value)} className={SELECT_CLS}>
            <option value="">Todos os programas</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button onClick={() => onSort(sortOrder === 'desc' ? 'asc' : 'desc')} className={BTN_CLS}>
            {sortOrder === 'desc' ? '↓ Mais recente' : '↑ Mais antigo'}
          </button>
        </div>

        {/* Linha 2: intervalo de anos + checklist */}
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
        </div>

        {/* Linha 3: contadores */}
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
