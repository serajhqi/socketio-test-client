import { useState, useRef, useEffect } from 'react'
import { useStore } from '../../store'
import { toast } from 'sonner'
import { SaveProfileModal } from './SaveProfileModal'
import './ProfilePicker.scss'

export function ProfilePicker() {
  const { profiles, activeProfileId, setActiveProfile, setProfiles, address, options, requestHistory, listeners, status } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [showSaveModal, setShowSaveModal] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const activeProfile = profiles.find(p => p.id === activeProfileId)

  useEffect(() => {
    if (!isOpen) return
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setEditingId(null)
      }
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsOpen(false); setEditingId(null) }
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen])

  const handleSelect = (id: string) => {
    if (status !== 'disconnected') {
      toast.error('Disconnect before switching profiles')
      return
    }
    const profile = profiles.find(p => p.id === id)
    if (profile) {
      useStore.setState({
        address: profile.address,
        options: profile.options,
        requestHistory: profile.requestHistory ?? [],
        listeners: (profile.listenerNames ?? []).map(name => ({ title: name, messages: [] })),
        activeProfileId: id,
      })
      toast.success(`Switched to: ${profile.name}`)
    }
    setIsOpen(false)
  }

  const handleSaveAs = () => {
    setIsOpen(false)
    setShowSaveModal(true)
  }

  const handleConfirmSave = (name: string) => {
    const newProfile = {
      id: Date.now().toString(),
      name,
      socketioVersion: '4' as const,
      address: '',
      options: {},
      requestHistory: [],
      listenerNames: [],
    }
    setProfiles([...profiles, newProfile])
    toast.success(`Profile saved: ${name}. Switch to it by disconnecting and selecting from the profile menu.`)
    setShowSaveModal(false)
  }

  const handleRename = (id: string, currentName: string) => {
    setEditingId(id)
    setEditName(currentName)
  }

  const handleConfirmRename = (id: string) => {
    if (!editName.trim()) { toast.error('Name cannot be empty'); return }
    setProfiles(profiles.map(p => p.id === id ? { ...p, name: editName } : p))
    setEditingId(null)
    toast.success('Profile renamed')
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this profile?')) return
    const filtered = profiles.filter(p => p.id !== id)
    setProfiles(filtered)
    if (activeProfileId === id) setActiveProfile(filtered[0]?.id ?? '')
    toast.success('Profile deleted')
  }

  const handleExport = () => {
    const data = {
      schema_version: 1,
      timestamp: Date.now(),
      history: requestHistory,
      listeners: listeners.map(({ title, messages }) => ({ title, messages })),
      profiles,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `socketio-session-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Session exported')
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        if (data.schema_version !== 1) { toast.error('Unsupported schema version'); return }
        if (!Array.isArray(data.history)) throw new Error('Invalid history')
        if (!Array.isArray(data.listeners)) throw new Error('Invalid listeners')
        if (!Array.isArray(data.profiles)) throw new Error('Invalid profiles')
        if (data.history.length > 0) useStore.getState().setRequestHistory(data.history)
        if (data.listeners.length > 0) useStore.getState().setListeners(data.listeners)
        if (data.profiles.length > 0) useStore.getState().setProfiles(data.profiles)
        toast.success(`Imported: ${data.history.length} requests, ${data.listeners.length} listeners, ${data.profiles.length} profiles`)
      } catch (err) {
        toast.error(err instanceof Error ? `Import failed: ${err.message}` : 'Import failed')
      }
    }
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const safeHostname = (addr: string) => {
    try { return new URL(addr).hostname } catch { return addr }
  }

  return (
    <div className="profile-picker" ref={containerRef}>
      <button
        className={`profile-picker__trigger${isOpen ? ' profile-picker__trigger--open' : ''}`}
        onClick={() => { setIsOpen(s => !s); setEditingId(null) }}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={activeProfile
          ? `Active profile: ${activeProfile.name}. Click to manage profiles.`
          : 'No profile selected. Click to manage profiles.'}
        title="Manage profiles, export and import"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
        </svg>
        <span className={`profile-picker__label${!activeProfile ? ' profile-picker__label--empty' : ''}`}>
          {activeProfile ? activeProfile.name : 'No profile'}
        </span>
        <svg
          width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
          className={`profile-picker__chevron${isOpen ? ' profile-picker__chevron--open' : ''}`}
        >
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      </button>

      <SaveProfileModal
        isOpen={showSaveModal}
        serverAddress={address ?? ''}
        onSave={handleConfirmSave}
        onClose={() => setShowSaveModal(false)}
      />

      {isOpen && (
        <div className="profile-picker__dropdown" role="dialog" aria-label="Profile management">

          {profiles.length > 0 && (
            <div className="profile-picker__section">
              <span className="profile-picker__section-label">Profiles</span>
              <div role="listbox" aria-label="Select profile">
                {profiles.map(profile => (
                  <div
                    key={profile.id}
                    className={`profile-picker__item${activeProfileId === profile.id ? ' profile-picker__item--active' : ''}`}
                    role="option"
                    aria-selected={activeProfileId === profile.id}
                  >
                    {editingId === profile.id ? (
                      <input
                        className="profile-picker__rename-input"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleConfirmRename(profile.id)
                          else if (e.key === 'Escape') setEditingId(null)
                        }}
                        autoFocus
                        aria-label="New profile name"
                      />
                    ) : (
                      <button
                        className="profile-picker__item-body"
                        onClick={() => handleSelect(profile.id)}
                      >
                        <span className="profile-picker__item-name">{profile.name}</span>
                        {profile.address && (
                          <span className="profile-picker__item-host">{safeHostname(profile.address)}</span>
                        )}
                      </button>
                    )}

                    <div className="profile-picker__item-actions">
                      {editingId === profile.id ? (
                        <>
                          <button className="profile-picker__act profile-picker__act--confirm" onClick={() => handleConfirmRename(profile.id)} title="Confirm" aria-label="Confirm rename">✓</button>
                          <button className="profile-picker__act profile-picker__act--cancel" onClick={() => setEditingId(null)} title="Cancel" aria-label="Cancel rename">✕</button>
                        </>
                      ) : (
                        <>
                          <button className="profile-picker__act" onClick={() => handleRename(profile.id, profile.name)} title="Rename" aria-label={`Rename ${profile.name}`}>✎</button>
                          <button className="profile-picker__act profile-picker__act--danger" onClick={() => handleDelete(profile.id)} title="Delete" aria-label={`Delete ${profile.name}`}>✕</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {profiles.length === 0 && (
            <div className="profile-picker__empty">No saved profiles yet</div>
          )}

          <div className="profile-picker__section">
            <button className="profile-picker__save-btn" onClick={handleSaveAs}>
              + Save as new profile
            </button>
          </div>

          <div className="profile-picker__rule" role="separator" />

          <div className="profile-picker__section profile-picker__section--row">
            <button className="profile-picker__io-btn" onClick={handleExport} aria-label="Export session to JSON">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
              Export
            </button>
            <button className="profile-picker__io-btn" onClick={() => fileInputRef.current?.click()} aria-label="Import session from JSON">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/>
              </svg>
              Import
            </button>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </div>

        </div>
      )}
    </div>
  )
}
