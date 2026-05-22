import { useState, useEffect } from 'react'
import { useStore } from '../store'
import { sendRequest } from '../services/socketio'
import { toast } from 'sonner'
import './Request.scss'

export function Request() {
  const { request, status } = useStore()
  const [emitName, setEmitName] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (request) {
      setEmitName(request.emitName || '')
      setTitle(request.title || '')
      setBody(request.body || '')
    }
  }, [request])

  const validateAndSend = () => {
    if (!emitName.trim()) {
      setError('Event name is required')
      return
    }

    if (status !== 'connected') {
      toast.error('Not connected to server')
      return
    }

    try {
      const parsedBody = body.trim() ? JSON.parse(body) : undefined
      useStore.getState().setRequest({
        emitName,
        title: title || emitName,
        body: body.trim() ? body : undefined,
      })
      sendRequest()
      setError('')
      toast.success(`Sent: ${emitName}`)
    } catch (e) {
      setError('Invalid JSON in body')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      validateAndSend()
    }
  }

  return (
    <div className="request-panel">
      <div className="request-panel__header">
        <h2 className="request-panel__title">Send Request</h2>
        <button
          className="request-panel__send-btn"
          onClick={validateAndSend}
          disabled={status !== 'connected'}
          title="Ctrl+Enter"
        >
          Send
        </button>
      </div>

      <div className="request-panel__form">
        <div className="request-input-group">
          <label className="request-input-group__label">Event Name</label>
          <input
            type="text"
            className="request-input-group__input"
            placeholder="e.g., message, user:update"
            value={emitName}
            onChange={(e) => {
              setEmitName(e.target.value)
              setError('')
            }}
            onKeyDown={handleKeyDown}
            disabled={status !== 'connected'}
          />
        </div>

        <div className="request-input-group">
          <label className="request-input-group__label">Title (optional)</label>
          <input
            type="text"
            className="request-input-group__input"
            placeholder="Description for history"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={status !== 'connected'}
          />
        </div>

        <div className="request-input-group">
          <label className="request-input-group__label">
            JSON Body (optional)
          </label>
          <textarea
            className="request-input-group__textarea"
            placeholder={`{\n  "message": "Hello",\n  "timestamp": 1234567890\n}`}
            value={body}
            onChange={(e) => {
              setBody(e.target.value)
              setError('')
            }}
            onKeyDown={handleKeyDown}
            disabled={status !== 'connected'}
            spellCheck="false"
          />
          <p className="request-input-group__hint">
            Ctrl+Enter or Cmd+Enter to send
          </p>
        </div>

        {error && (
          <div className="request-error">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
