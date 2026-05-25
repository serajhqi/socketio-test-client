import { useState, useEffect } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { useStore } from '../../store'
import { toast } from 'sonner'
import './ServerAddressModal.scss'

interface ServerAddressModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ServerAddressModal({ isOpen, onClose }: ServerAddressModalProps) {
  const { address, options, setAddress, setOptions, clearSettings } = useStore()
  const [url, setUrl] = useState('')
  const [optionsText, setOptionsText] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setUrl(address ?? '')
      setOptionsText(JSON.stringify(options, null, 2))
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
    clearSettings()
    setUrl('')
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

          <div className="form-group" onClick={(e) => e.stopPropagation()}>
            <label className="form-group__label">Connection Options (JSON)</label>
            <div className="form-group__editor" style={{"overflow":"auto"}}>
              <CodeMirror
                style={{"height":"100%"}}
                value={optionsText}
                onChange={(value) => {
                  setOptionsText(value)
                  setError('')
                }}
                extensions={[json()]}
                theme={oneDark}
                placeholder="Optional Socket.IO connection options"
                basicSetup={{
                  lineNumbers: false,
                  foldGutter: false,
                  dropCursor: false,
                  allowMultipleSelections: false,
                  indentOnInput: true,
                  bracketMatching: true,
                  closeBrackets: true,
                  autocompletion: true,
                  highlightActiveLine: true,
                  highlightSelectionMatches: false,
                  searchKeymap: false,
                  tabSize: 2,
                }}
              />
            </div>
            <p className="form-group__hint">
              Optional Socket.IO connection options as JSON
            </p>
          </div>

          <div className="server-guide">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M12 2L1 21h22L12 2zm0 3.5L20.5 19h-17L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
            </svg>
            <span>
              Getting connection errors? Make sure CORS is enabled on your server.{' '}
              <a
                href="https://socket.io/docs/v4/client-options/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Advanced options guide
              </a>
            </span>
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
