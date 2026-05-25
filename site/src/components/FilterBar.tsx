interface Props {
  search: string
  onSearch: (v: string) => void
  selectedType: string
  onType: (v: string) => void
  selectedYear: string
  onYear: (v: string) => void
  sortOrder: 'asc' | 'desc'
  onSort: (v: 'asc' | 'desc') => void
  types: string[]
  years: number[]
  total: number
  filtered: number
}

export function FilterBar({
  search, onSearch,
  selectedType, onType,
  selectedYear, onYear,
  sortOrder, onSort,
  types, years,
  total, filtered,
}: Props) {
  return (
    <div className="sticky top-0 z-10 bg-[#0f0f13]/95 backdrop-blur border-b border-white/5 px-4 py-3">
      <div className="max-w-5xl mx-auto flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Buscar episódio..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-violet-500/50 focus:bg-white/8 transition"
          />
          <select
            value={selectedType}
            onChange={e => onType(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-violet-500/50 transition cursor-pointer"
          >
            <option value="">Todos os programas</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            value={selectedYear}
            onChange={e => onYear(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-violet-500/50 transition cursor-pointer"
          >
            <option value="">Todos os anos</option>
            {years.map(y => <option key={y} value={String(y)}>{y}</option>)}
          </select>
          <button
            onClick={() => onSort(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10 transition whitespace-nowrap cursor-pointer"
          >
            {sortOrder === 'desc' ? '↓ Mais recente' : '↑ Mais antigo'}
          </button>
        </div>
        <p className="text-xs text-slate-500">
          {filtered === total
            ? `${total.toLocaleString('pt-BR')} episódios`
            : `${filtered.toLocaleString('pt-BR')} de ${total.toLocaleString('pt-BR')} episódios`}
        </p>
      </div>
    </div>
  )
}
