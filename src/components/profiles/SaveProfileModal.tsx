import { useEffect, useRef, useState } from 'react'
import './SaveProfileModal.scss'

interface SaveProfileModalProps {
  isOpen: boolean
  serverAddress: string
  onSave: (name: string) => void
  onClose: () => void
}

export function SaveProfileModal({ isOpen, serverAddress, onSave, onClose }: SaveProfileModalProps) {
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setName('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSave = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    onSave(trimmed)
    setName('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave()
    }
  }

  return (
    <div className="save-profile-overlay" onClick={onClose}>
      <div className="save-profile-card" onClick={(e) => e.stopPropagation()}>
        <div className="save-profile-card__header">
          <h2 className="save-profile-card__title">Save Profile</h2>
          <button
            className="save-profile-card__close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="save-profile-card__body">
          <div className="save-profile-card__field">
            <label className="save-profile-card__label">Server</label>
            <div className="save-profile-card__address">{serverAddress || 'No address set'}</div>
          </div>

          <div className="save-profile-card__field">
            <label className="save-profile-card__label" htmlFor="save-profile-name">
              Profile Name
            </label>
            <input
              id="save-profile-name"
              ref={inputRef}
              type="text"
              className="save-profile-card__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Local dev, Production..."
              maxLength={60}
            />
          </div>
        </div>

        <div className="save-profile-card__footer">
          <button className="save-profile-card__btn save-profile-card__btn--cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="save-profile-card__btn save-profile-card__btn--save"
            onClick={handleSave}
            disabled={!name.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
