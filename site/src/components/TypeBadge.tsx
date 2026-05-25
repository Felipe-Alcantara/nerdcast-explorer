const TYPE_COLORS: Record<string, string> = {
  'NerdCast': 'bg-violet-600/20 text-violet-300 border-violet-500/30',
  'Lá do Bunker': 'bg-amber-600/20 text-amber-300 border-amber-500/30',
  'NerdTech': 'bg-cyan-600/20 text-cyan-300 border-cyan-500/30',
  'NerdCast RPG': 'bg-red-600/20 text-red-300 border-red-500/30',
  'Vai te Catar': 'bg-green-600/20 text-green-300 border-green-500/30',
  'Speak English': 'bg-blue-600/20 text-blue-300 border-blue-500/30',
  'NerdCash': 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30',
  'Generacast': 'bg-pink-600/20 text-pink-300 border-pink-500/30',
}

function getColor(type: string): string {
  for (const [key, color] of Object.entries(TYPE_COLORS)) {
    if (type.startsWith(key)) return color
  }
  return 'bg-slate-600/20 text-slate-300 border-slate-500/30'
}

export function TypeBadge({ type }: { type: string }) {
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded border ${getColor(type)} shrink-0`}>
      {type}
    </span>
  )
}
