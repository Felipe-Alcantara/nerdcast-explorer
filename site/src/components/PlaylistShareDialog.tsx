import { useEffect, useMemo, useRef, useState } from 'react'
import type { Playlist } from '../types'
import { cx } from '../utils/cx'
import {
  parseAnyShare,
  toJsonString,
  toShareCode,
  toShareUrl,
  type ParsedShare,
} from '../utils/playlistShare'
import { BTN_CLS, INPUT_CLS, SELECT_CLS } from './filterStyles'

type Mode = 'export' | 'import'
type ExportScope = 'all' | string

interface Props {
  playlists: Playlist[]
  initialMode?: Mode
  initialParsed?: ParsedShare | null
  onClose: () => void
  onImportParsed: (parsed: ParsedShare) => void
}

export function PlaylistShareDialog({
  playlists,
  initialMode = 'export',
  initialParsed = null,
  onClose,
  onImportParsed,
}: Props) {
  const [mode, setMode] = useState<Mode>(initialMode)
  const [scope, setScope] = useState<ExportScope>('all')
  const [copyHint, setCopyHint] = useState('')
  const [importText, setImportText] = useState('')
  const [importError, setImportError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const exportTarget = useMemo<Playlist[]>(() => {
    if (scope === 'all') {
      return playlists
    }
    return playlists.filter(playlist => playlist.id === scope)
  }, [playlists, scope])

  const jsonString = useMemo(() => toJsonString(exportTarget), [exportTarget])
  const shareCode = useMemo(() => toShareCode(exportTarget), [exportTarget])
  const shareUrl = useMemo(() => {
    const origin =
      typeof window !== 'undefined' && window.location ? window.location.origin + window.location.pathname : ''
    return toShareUrl(exportTarget, origin)
  }, [exportTarget])

  useEffect(() => {
    if (initialParsed) {
      onImportParsed(initialParsed)
    }
  }, [initialParsed, onImportParsed])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  function flashHint(message: string) {
    setCopyHint(message)
    window.setTimeout(() => setCopyHint(''), 2000)
  }

  async function copyToClipboard(value: string, label: string) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(value)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = value
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'absolute'
        textarea.style.left = '-9999px'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      flashHint(`${label} copiado!`)
    } catch {
      flashHint('Não foi possível copiar')
    }
  }

  function handleDownloadJson() {
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const name = scope === 'all' ? 'nerdcast-playlists' : `nerdcast-${exportTarget[0]?.name ?? 'playlist'}`
    const safeName = name.replace(/[^\p{L}\p{N}_-]+/gu, '-').toLowerCase()
    link.href = url
    link.download = `${safeName}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      tryParseAndConfirm(result)
    }
    reader.onerror = () => setImportError('Não foi possível ler o arquivo.')
    reader.readAsText(file)
    event.target.value = ''
  }

  function tryParseAndConfirm(value: string) {
    const parsed = parseAnyShare(value)
    if (!parsed) {
      setImportError('Conteúdo inválido. Verifique se é um JSON, código ou link de playlist NerdCast.')
      return
    }
    setImportError('')
    onImportParsed(parsed)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Compartilhar playlists"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm md:items-center"
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-t-2xl border border-white/10 bg-[#15151c] md:rounded-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Compartilhar playlists</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Exporte como arquivo, código ou link — ou importe de outro usuário.
            </p>
          </div>
          <button type="button" onClick={onClose} className={BTN_CLS}>
            Fechar
          </button>
        </div>

        <div className="flex gap-2 border-b border-white/10 px-5 py-3">
          <button
            type="button"
            onClick={() => setMode('export')}
            className={cx(
              BTN_CLS,
              mode === 'export' && 'border-violet-500/50 bg-violet-500/10 text-violet-200',
            )}
          >
            Exportar
          </button>
          <button
            type="button"
            onClick={() => setMode('import')}
            className={cx(
              BTN_CLS,
              mode === 'import' && 'border-violet-500/50 bg-violet-500/10 text-violet-200',
            )}
          >
            Importar
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {mode === 'export' ? (
            <ExportPane
              playlists={playlists}
              scope={scope}
              onScopeChange={setScope}
              jsonString={jsonString}
              shareCode={shareCode}
              shareUrl={shareUrl}
              copyHint={copyHint}
              onCopy={copyToClipboard}
              onDownload={handleDownloadJson}
            />
          ) : (
            <ImportPane
              importText={importText}
              onImportTextChange={setImportText}
              onSubmitText={() => tryParseAndConfirm(importText)}
              onPickFile={() => fileInputRef.current?.click()}
              fileInputRef={fileInputRef}
              onFile={handleFile}
              importError={importError}
            />
          )}
        </div>
      </div>
    </div>
  )
}

interface ExportPaneProps {
  playlists: Playlist[]
  scope: ExportScope
  onScopeChange: (value: ExportScope) => void
  jsonString: string
  shareCode: string
  shareUrl: string
  copyHint: string
  onCopy: (value: string, label: string) => void
  onDownload: () => void
}

function ExportPane({
  playlists,
  scope,
  onScopeChange,
  jsonString,
  shareCode,
  shareUrl,
  copyHint,
  onCopy,
  onDownload,
}: ExportPaneProps) {
  const empty = playlists.length === 0

  if (empty) {
    return (
      <p className="text-xs text-slate-500">
        Você ainda não tem playlists. Crie uma para poder exportar.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-xs text-slate-500">O que exportar</label>
        <select
          aria-label="Escolher escopo da exportação"
          value={scope}
          onChange={event => onScopeChange(event.target.value)}
          className={SELECT_CLS}
        >
          <option value="all">Todas as playlists ({playlists.length})</option>
          {playlists.map(playlist => (
            <option key={playlist.id} value={playlist.id}>
              {playlist.name} ({playlist.episodeIds.length})
            </option>
          ))}
        </select>
      </div>

      <ExportRow
        title="Arquivo JSON"
        description="Baixa um .json para anexar ou guardar."
        action={
          <button type="button" onClick={onDownload} className={BTN_CLS}>
            Baixar JSON
          </button>
        }
      />

      <ExportRow
        title="Código compartilhável"
        description="Texto curto para colar em chat. Pode ser importado em 'Importar código'."
        action={
          <button type="button" onClick={() => onCopy(shareCode, 'Código')} className={BTN_CLS}>
            Copiar código
          </button>
        }
        preview={shareCode}
      />

      <ExportRow
        title="Link compartilhável"
        description="Abre direto este site com a importação pronta."
        action={
          <button type="button" onClick={() => onCopy(shareUrl, 'Link')} className={BTN_CLS}>
            Copiar link
          </button>
        }
        preview={shareUrl}
      />

      <details className="rounded-xl border border-white/10 bg-[#1c1c28] px-4 py-3">
        <summary className="cursor-pointer text-xs font-medium text-slate-300">
          Ver JSON completo
        </summary>
        <pre className="mt-2 max-h-60 overflow-auto text-[11px] leading-relaxed text-slate-400">
          {jsonString}
        </pre>
      </details>

      {copyHint && <p className="text-xs text-emerald-300">{copyHint}</p>}
    </div>
  )
}

interface ExportRowProps {
  title: string
  description: string
  action: React.ReactNode
  preview?: string
}

function ExportRow({ title, description, action, preview }: ExportRowProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-[#1c1c28] px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        </div>
        <div className="shrink-0">{action}</div>
      </div>
      {preview && (
        <p className="truncate rounded bg-black/30 px-2 py-1 text-[11px] text-slate-500">{preview}</p>
      )}
    </div>
  )
}

interface ImportPaneProps {
  importText: string
  onImportTextChange: (value: string) => void
  onSubmitText: () => void
  onPickFile: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onFile: (event: React.ChangeEvent<HTMLInputElement>) => void
  importError: string
}

function ImportPane({
  importText,
  onImportTextChange,
  onSubmitText,
  onPickFile,
  fileInputRef,
  onFile,
  importError,
}: ImportPaneProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-[#1c1c28] px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-white">Importar de arquivo</p>
            <p className="mt-0.5 text-xs text-slate-500">Selecione um .json exportado anteriormente.</p>
          </div>
          <button type="button" onClick={onPickFile} className={BTN_CLS}>
            Escolher arquivo
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={onFile}
        />
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-[#1c1c28] px-4 py-3">
        <div>
          <p className="text-sm font-medium text-white">Importar de código ou link</p>
          <p className="mt-0.5 text-xs text-slate-500">Cole um código compartilhável ou link de playlist.</p>
        </div>
        <textarea
          value={importText}
          onChange={event => onImportTextChange(event.target.value)}
          placeholder="Cole o código, link ou JSON aqui..."
          className={cx(INPUT_CLS, 'min-h-24 w-full resize-y font-mono text-xs')}
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onSubmitText}
            disabled={!importText.trim()}
            className={cx(BTN_CLS, 'border-violet-500/50 bg-violet-500/10 text-violet-200')}
          >
            Continuar
          </button>
        </div>
      </div>

      {importError && <p className="text-xs text-amber-300">{importError}</p>}
    </div>
  )
}
