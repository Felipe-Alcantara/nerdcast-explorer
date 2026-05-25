interface Props {
  total: number
  filtered: number
  watchedCount: number
  likedCount: number
}

export function FilterStats({ total, filtered, watchedCount, likedCount }: Props) {
  const pct = total > 0 ? Math.round((watchedCount / total) * 100) : 0

  return (
    <>
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

      {watchedCount > 0 && (
        <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-500 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </>
  )
}
