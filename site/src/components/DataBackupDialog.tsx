import { useRef, useState } from 'react'
import { downloadBackup, importBackup, type ImportBackupResult } from '../utils/dataBackup'

interface Props {
  storagePrefix: string
  onClose: () => void
  onImported: () => void
}

export function DataBackupDialog({ storagePrefix, onClose, onImported }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [result, setResult] = useState<ImportBackupResult | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [pendingRaw, setPendingRaw] = useState<unknown>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string)
        setPendingRaw(parsed)
        setConfirming(true)
        setResult(null)
      } catch {
        setResult({ ok: false, error: 'Não foi possível ler o arquivo.' })
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleConfirmImport() {
    const r = importBackup(storagePrefix, pendingRaw)
    setResult(r)
    setConfirming(false)
    setPendingRaw(null)
    if (r.ok) {
      onImported()
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Backup de dados"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#1a1a22] p-5 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Backup de dados</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 transition"
          >
            Fechar
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Exporte todos os seus dados (ouvidos, curtidos, anotações e playlists) para um arquivo JSON,
          ou importe um backup anterior.
        </p>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => downloadBackup(storagePrefix)}
            className="w-full rounded-lg border border-violet-500/40 bg-violet-500/10 px-4 py-2 text-sm text-violet-200 hover:bg-violet-500/20 transition"
          >
            Exportar backup
          </button>

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10 transition"
          >
            Importar backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {confirming && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 flex flex-col gap-3">
            <p className="text-xs text-amber-200">
              Isso vai <strong>substituir</strong> todos os dados atuais pelo backup. Continuar?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleConfirmImport}
                className="flex-1 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-200 hover:bg-amber-500/20 transition"
              >
                Sim, importar
              </button>
              <button
                type="button"
                onClick={() => { setConfirming(false); setPendingRaw(null) }}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {result && (
          result.ok ? (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
              Importado com sucesso —{' '}
              {result.watched} ouvidos · {result.liked} curtidos · {result.comments} anotações · {result.playlists} playlists
            </div>
          ) : (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {result.error}
            </div>
          )
        )}
      </div>
    </div>
  )
}
