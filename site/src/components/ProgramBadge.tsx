import type { Program } from '../types'

const COLORS: Record<string, string> = {
  'nerdcast':            'bg-violet-600/20 text-violet-300 border-violet-500/30',
  'la-do-bunker':        'bg-amber-600/20 text-amber-300 border-amber-500/30',
  'nerdtech':            'bg-cyan-600/20 text-cyan-300 border-cyan-500/30',
  'caneca-de-mamicas':   'bg-pink-600/20 text-pink-300 border-pink-500/30',
  'mau-acompanhado':     'bg-orange-600/20 text-orange-300 border-orange-500/30',
  'speak-english':       'bg-blue-600/20 text-blue-300 border-blue-500/30',
  'nerdcash':            'bg-emerald-600/20 text-emerald-300 border-emerald-500/30',
  'empreendedor':        'bg-teal-600/20 text-teal-300 border-teal-500/30',
  'vaitecatar':          'bg-green-600/20 text-green-300 border-green-500/30',
  'generacast':          'bg-rose-600/20 text-rose-300 border-rose-500/30',
  'nerdologia':          'bg-indigo-600/20 text-indigo-300 border-indigo-500/30',
  'hypezilla':           'bg-fuchsia-600/20 text-fuchsia-300 border-fuchsia-500/30',
  'nerd-na-cloud':       'bg-sky-600/20 text-sky-300 border-sky-500/30',
  'depois-do-expediente':'bg-yellow-600/20 text-yellow-300 border-yellow-500/30',
  'papo-de-parceiro':    'bg-lime-600/20 text-lime-300 border-lime-500/30',
}

const FALLBACK = 'bg-slate-600/20 text-slate-300 border-slate-500/30'

interface Props {
  program: Program
}

export function ProgramBadge({ program }: Props) {
  const color = COLORS[program.slug] ?? FALLBACK
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded border ${color} shrink-0`}>
      {program.name}
    </span>
  )
}
