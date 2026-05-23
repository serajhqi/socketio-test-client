import { useState, useEffect } from 'react'
import { useStore } from '../../store'
import { toast } from 'sonner'
import './ServerAddressModal.scss'

interface ServerAddressModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ServerAddressModal({ isOpen, onClose }: ServerAddressModalProps) {
  const { address, options, setAddress, setOptions } = useStore()
  const [url, setUrl] = useState('')
  const [optionsText, setOptionsText] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setUrl(address)
      setOptionsText(options ? JSON.stringify(options, null, 2) : '{}')
      setError('')
    }
  }, [isOpen, address, options])

  const handleSave = () => {
    if (!url.trim()) {
      setError('Server address is required')
      return
    }

    try {
      const parsed = optionsText.trim() ? JSON.parse(optionsText) : {}
      setAddress(url)
      setOptions(parsed)
      toast.success('Server settings saved')
      onClose()
    } catch (e) {
      setError('Invalid JSON in options')
    }
  }

  const handleClear = () => {
    setUrl('')
    setOptions({})
    setAddress('')
    toast.success('Settings cleared')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">Server Settings</h2>
          <button
            className="modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="modal__content">
          <div className="form-group">
            <label className="form-group__label">Server Address</label>
            <input
              type="text"
              className="form-group__input"
              placeholder="http://localhost:3000"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setError('')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave()
              }}
            />
            <p className="form-group__hint">
              Full URL of your Socket.IO server (e.g., http://localhost:3000)
            </p>
          </div>

          <div className="form-group">
            <label className="form-group__label">Connection Options (JSON)</label>
            <textarea
              className="form-group__textarea"
              placeholder={'{\n  "reconnection": true,\n  "reconnectionDelay": 1000\n}'}
              value={optionsText}
              onChange={(e) => {
                setOptionsText(e.target.value)
                setError('')
              }}
              spellCheck="false"
            />
            <p className="form-group__hint">
              Optional Socket.IO connection options as JSON
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="modal__footer">
          <button
            className="btn btn--secondary"
            onClick={handleClear}
          >
            Clear
          </button>
          <div className="modal__footer-right">
            <button className="btn btn--secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn--primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
