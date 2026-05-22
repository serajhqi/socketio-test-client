import { useState } from 'react'
import './AddListenerModal.scss'

interface AddListenerModalProps {
  isOpen: boolean
  onAdd: (name: string) => void
  onClose: () => void
}

export function AddListenerModal({
  isOpen,
  onAdd,
  onClose,
}: AddListenerModalProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Event name is required')
      return
    }

    onAdd(trimmed)
    setName('')
    setError('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    } else if (e.key === 'Escape') {
      handleClose()
    }
  }

  const handleClose = () => {
    setName('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="add-listener-overlay" onClick={handleClose}>
      <div className="add-listener-modal" onClick={(e) => e.stopPropagation()}>
        <div className="add-listener-modal__header">
          <h2 className="add-listener-modal__title">Add Event Listener</h2>
          <button
            className="add-listener-modal__close"
            onClick={handleClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="add-listener-modal__body">
          <label className="add-listener-modal__label">Event Name</label>
          <input
            type="text"
            className="add-listener-modal__input"
            placeholder="e.g., message, status, data:update"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          {error && <div className="add-listener-modal__error">{error}</div>}
          <p className="add-listener-modal__hint">
            Enter the Socket.IO event name you want to listen for
          </p>
        </div>

        <div className="add-listener-modal__footer">
          <button
            className="add-listener-modal__btn add-listener-modal__btn--cancel"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="add-listener-modal__btn add-listener-modal__btn--add"
            onClick={handleSubmit}
            disabled={!name.trim()}
          >
            Add Listener
          </button>
        </div>
      </div>
    </div>
  )
}
