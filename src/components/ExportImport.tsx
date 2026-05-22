import { useRef } from 'react'
import { useStore } from '../store'
import { toast } from 'sonner'
import './ExportImport.scss'

interface ExportData {
  schema_version: number
  timestamp: number
  history: any[]
  listeners: any[]
  profiles: any[]
}

export function ExportImport() {
  const { requestHistory, listeners, profiles } = useStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const data: ExportData = {
      schema_version: 1,
      timestamp: Date.now(),
      history: requestHistory,
      listeners: listeners.map(({ title, messages }) => ({ title, messages })),
      profiles,
    }

    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `socketio-session-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Session exported')
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const data = JSON.parse(content) as ExportData

        if (data.schema_version !== 1) {
          toast.error('Unsupported schema version')
          return
        }

        // Validate structure
        if (!Array.isArray(data.history)) {
          throw new Error('Invalid history format')
        }
        if (!Array.isArray(data.listeners)) {
          throw new Error('Invalid listeners format')
        }
        if (!Array.isArray(data.profiles)) {
          throw new Error('Invalid profiles format')
        }

        // Import data
        if (data.history.length > 0) {
          useStore.getState().setRequestHistory(data.history)
        }

        if (data.listeners.length > 0) {
          useStore.getState().setListeners(data.listeners)
        }

        if (data.profiles.length > 0) {
          useStore.getState().setProfiles(data.profiles)
        }

        toast.success(
          `Imported: ${data.history.length} requests, ${data.listeners.length} listeners, ${data.profiles.length} profiles`
        )
      } catch (err) {
        toast.error(
          err instanceof Error ? `Import failed: ${err.message}` : 'Import failed'
        )
      }
    }

    reader.readAsText(file)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="export-import">
      <button
        className="export-import__btn export-import__btn--export"
        onClick={handleExport}
        title="Export session"
      >
        ↓ Export
      </button>

      <button
        className="export-import__btn export-import__btn--import"
        onClick={handleImportClick}
        title="Import session"
      >
        ↑ Import
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportFile}
        style={{ display: 'none' }}
      />
    </div>
  )
}
