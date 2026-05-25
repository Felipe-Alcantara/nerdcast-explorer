import { useMemo, useState } from 'react'
import type { ImportConflictAction, ImportPlanItem, ImportablePlaylist } from '../hooks/usePlaylists'
import type { Playlist } from '../types'
import { cx } from '../utils/cx'
import { BTN_CLS } from './filterStyles'

interface Props {
  incoming: ImportablePlaylist[]
  existingByName: (name: string) => Playlist | null
  onCancel: () => void
  onConfirm: (plan: ImportPlanItem[]) => void
}

const ACTION_LABELS: Record<ImportConflictAction, string> = {
  duplicate: 'Criar nova',
  merge: 'Mesclar',
  replace: 'Substituir',
  skip: 'Pular',
}

const ACTION_HINTS: Record<ImportConflictAction, string> = {
  duplicate: 'Cria nova playlist com sufixo "(importada)"',
  merge: 'Une episódios da playlist existente com os importados',
  replace: 'Sobrescreve a playlist atual com a importada',
  skip: 'Não importa esta playlist',
}

export function PlaylistConflictDialog({ incoming, existingByName, onCancel, onConfirm }: Props) {
  const items = useMemo(
    () =>
      incoming.map(playlist => ({
        incoming: playlist,
        existing: existingByName(playlist.name),
      })),
    [incoming, existingByName],
  )

  const [overrides, setOverrides] = useState<Record<number, ImportConflictAction>>({})

  const actions = useMemo(
    () =>
      items.map((item, index) =>
        overrides[index] ?? (item.existing ? 'merge' : 'duplicate'),
      ),
    [items, overrides],
  )

  function setAction(index: number, action: ImportConflictAction) {
    setOverrides(prev => ({ ...prev, [index]: action }))
  }

  function handleConfirm() {
    const plan: ImportPlanItem[] = items.map((item, index) => ({
      incoming: item.incoming,
      existing: item.existing,
      action: actions[index],
    }))
    onConfirm(plan)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Importar playlists"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm md:items-center"
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-t-2xl border border-white/10 bg-[#15151c] md:rounded-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Importar playlists</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Escolha o que fazer com cada playlist a ser importada.
            </p>
          </div>
          <button type="button" onClick={onCancel} className={BTN_CLS}>
            Cancelar
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <ul className="flex flex-col gap-3">
            {items.map((item, index) => {
              const availableActions: ImportConflictAction[] = item.existing
                ? ['merge', 'replace', 'duplicate', 'skip']
                : ['duplicate', 'skip']

              return (
                <li
                  key={`${item.incoming.name}-${index}`}
                  className="flex flex-col gap-2 rounded-xl border border-white/10 bg-[#1c1c28] px-4 py-3"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{item.incoming.name}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {item.incoming.episodeIds.length} episódio(s)
                        {item.existing
                          ? ` · já existe com ${item.existing.episodeIds.length}`
                          : ' · nome livre'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {availableActions.map(action => {
                      const active = actions[index] === action
                      return (
                        <button
                          key={action}
                          type="button"
                          onClick={() => setAction(index, action)}
                          className={cx(
                            BTN_CLS,
                            'text-xs',
                            active && 'border-violet-500/50 bg-violet-500/10 text-violet-200',
                          )}
                          title={ACTION_HINTS[action]}
                        >
                          {ACTION_LABELS[action]}
                        </button>
                      )
                    })}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-white/10 px-5 py-3">
          <button type="button" onClick={onCancel} className={BTN_CLS}>
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={cx(BTN_CLS, 'border-violet-500/50 bg-violet-500/10 text-violet-200')}
          >
            Importar {items.length}
          </button>
        </div>
      </div>
    </div>
  )
}
