import { useState, useEffect } from 'react'
import { useStore } from '../store'
import { sendRequest, toggleConnection } from '../services/socketio'
import { toast } from 'sonner'
import './Request.scss'

interface RequestProps {
  onServerClick?: () => void
}

export function Request({ onServerClick }: RequestProps) {
  const { request, status, address } = useStore()
  const [emitName, setEmitName] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  useEffect(() => {
    if (request) {
      setEmitName(request.emitName || '')
      setTitle(request.title || '')
      setBody(request.body || '')
    }
  }, [request])

  const validateAndSend = () => {
    if (!emitName.trim()) {
      toast.error('Event name is required')
      return
    }
    if (status !== 'connected') {
      toast.error('Not connected to server')
      return
    }
    try {
      if (body.trim()) JSON.parse(body)
      useStore.getState().setRequest({
        emitName,
        title: title || emitName,
        body: body.trim() || undefined,
      })
      sendRequest()
      toast.success(`Sent: ${emitName}`)
    } catch {
      toast.error('Invalid JSON in body')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      validateAndSend()
    }
  }

  const isConnected = status === 'connected'
  const isTransitioning = status === 'connecting' || status === 'disconnecting'

  const serverLabel = address
    ? address.replace(/^https?:\/\//, '')
    : null

  return (
    <div className="request-panel">
      <div className="request-bar">
        <button
          className={`request-bar__server ${!address ? 'request-bar__server--empty' : ''}`}
          onClick={onServerClick}
          title={address ? `Server: ${address} — click to change` : 'Click to set server URL'}
        >
          {serverLabel ? (
            <span className="request-bar__server-url">{serverLabel}</span>
          ) : (
            <span className="request-bar__server-placeholder">set server url</span>
          )}
          <span className="request-bar__server-edit">✎</span>
        </button>

        <button
          className={`request-bar__connect request-bar__connect--${status}`}
          onClick={toggleConnection}
          disabled={isTransitioning}
          title={
            isTransitioning
              ? status
              : isConnected
              ? 'Connected — click to disconnect'
              : 'Disconnected — click to connect'
          }
        >
          <span className="request-bar__connect-dot" />
        </button>

        <input
          className="request-bar__emit"
          placeholder="Emit Name"
          value={emitName}
          onChange={e => setEmitName(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
        />
        <input
          className="request-bar__title-input"
          placeholder="Optional Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
        />
        <button
          className="request-bar__send"
          onClick={validateAndSend}
          disabled={!isConnected}
          title="Send (Ctrl+Enter)"
          aria-label="Send request"
        >
          <svg width="20" height="20" viewBox="0 0 1024 1024">
            <path d="M85.333333 896 981.333333 512 85.333333 128 85.333333 426.666667 725.333333 512 85.333333 597.333333 85.333333 896Z" />
          </svg>
        </button>
      </div>

      <textarea
        className="request-body"
        placeholder="Data to send"
        value={body}
        onChange={e => setBody(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
      />
    </div>
  )
}
