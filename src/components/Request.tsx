import { useState, useEffect, useCallback, useRef } from 'react'
import CodeMirror, { EditorView } from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { useStore } from '../store'
import { sendRequest, toggleConnection } from '../services/socketio'
import { toast } from 'sonner'
import './Request.scss'

interface RequestProps {
  onServerClick?: () => void
}

const appTheme = EditorView.theme({
  '&': {
    background: 'transparent !important',
    height: '100%',
    fontSize: '0.875rem',
    fontFamily: "'Monaco', 'Courier New', monospace",
  },
  '.cm-scroller': {
    overflow: 'auto',
    fontFamily: "'Monaco', 'Courier New', monospace",
  },
  '.cm-content': {
    color: '#fbbf24',
    caretColor: '#fbbf24',
    padding: '1rem',
    lineHeight: '1.65',
  },
  '.cm-gutters': {
    display: 'none',
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(251,191,36,0.04)',
  },
  '.cm-activeLineGutter': {
    display: 'none',
  },
  '.cm-focused': {
    outline: 'none !important',
  },
  '&.cm-focused': {
    outline: 'none !important',
  },
  '.cm-cursor': {
    borderLeftColor: '#fbbf24',
  },
  '.cm-selectionBackground, ::selection': {
    backgroundColor: 'rgba(251,191,36,0.15) !important',
  },
  '.tok-keyword':      { color: '#f97316' },
  '.tok-number':       { color: '#f97316' },
  '.tok-bool':         { color: '#f97316' },
  '.tok-null':         { color: '#f97316' },
  '.tok-string':       { color: '#86efac' },
  '.tok-propertyName': { color: '#7dd3fc' },
  '.tok-punctuation':  { color: '#958686' },
  '.tok-brace':        { color: '#958686' },
  '.tok-bracket':      { color: '#958686' },
  '.cm-placeholder':   { color: 'rgba(149, 134, 134, 0.4)' },
})

export function Request({ onServerClick }: RequestProps) {
  const { request, status, address } = useStore()
  const [emitName, setEmitName] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [jsonMode, setJsonMode] = useState(true)
  const [editorStatus, setEditorStatus] = useState('')
  const sendBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (request) {
      setEmitName(request.emitName || '')
      setTitle(request.title || '')
      setBody(request.body || '')
    }
  }, [request])

  const validateAndSend = useCallback(() => {
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
  }, [emitName, title, body, status])

  const handleFormat = () => {
    if (!body.trim()) return
    try {
      const parsed = JSON.parse(body)
      setBody(JSON.stringify(parsed, null, 2))
    } catch {
      toast.error('Cannot format: invalid JSON')
    }
  }

  const handleBarKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      validateAndSend()
    }
  }

  const ctrlEnterExtension = EditorView.domEventHandlers({
    keydown(event, view) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault()
        validateAndSend()
        return true
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        view.contentDOM.blur()
        sendBtnRef.current?.focus()
        setEditorStatus('Exited editor. Focus moved to Send button.')
        setTimeout(() => setEditorStatus(''), 2000)
        return true
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'm') {
        event.preventDefault()
        setEditorStatus('Tab inserts indent. Press Escape to exit the editor.')
        setTimeout(() => setEditorStatus(''), 3000)
        return true
      }
      return false
    },
  })

  const isConnected = status === 'connected'
  const isTransitioning = status === 'connecting' || status === 'disconnecting'

  const serverLabel = address
    ? address.replace(/^https?:\/\//, '')
    : null

  const extensions = jsonMode
    ? [json(), appTheme, ctrlEnterExtension]
    : [appTheme, ctrlEnterExtension]

  return (
    <div className="request-panel">
      <div role="status" aria-live="polite" className="sr-only">{editorStatus}</div>
      <div className="request-bar">
        <button
          className={`request-bar__server ${!address ? 'request-bar__server--empty' : ''}`}
          onClick={onServerClick}
          title={address ? `Server: ${address} — click to change` : 'Click to set server URL'}
          aria-label={address ? `Server: ${address}. Click to change.` : 'No server set. Click to configure server URL.'}
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
          aria-label={
            isTransitioning
              ? `Connection status: ${status}`
              : isConnected
              ? 'Connected. Click to disconnect.'
              : 'Disconnected. Click to connect.'
          }
        >
          <span className="request-bar__connect-dot" />
        </button>

        <input
          className="request-bar__emit"
          placeholder="Emit Name"
          value={emitName}
          onChange={e => setEmitName(e.target.value)}
          onKeyDown={handleBarKeyDown}
          spellCheck={false}
          autoComplete="off"
        />
        <input
          className="request-bar__title-input"
          placeholder="Optional Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={handleBarKeyDown}
          spellCheck={false}
          autoComplete="off"
        />
        <button
          ref={sendBtnRef}
          className="request-bar__send"
          onClick={validateAndSend}
          disabled={!isConnected}
          title="Send (Ctrl+Enter)"
          aria-label="Send request (Ctrl+Enter)"
        >
          <svg width="20" height="20" viewBox="0 0 1024 1024">
            <path d="M85.333333 896 981.333333 512 85.333333 128 85.333333 426.666667 725.333333 512 85.333333 597.333333 85.333333 896Z" />
          </svg>
        </button>
      </div>

      <div className="request-editor-toolbar">
        <button
          className="request-editor-toolbar__btn"
          onClick={handleFormat}
          title="Pretty-print JSON"
          aria-label="Format JSON body"
        >
          Format
        </button>
        <button
          className={`request-editor-toolbar__btn request-editor-toolbar__btn--mode ${jsonMode ? 'request-editor-toolbar__btn--active' : ''}`}
          onClick={() => setJsonMode(m => !m)}
          title={jsonMode ? 'Switch to plain text mode' : 'Switch to JSON mode'}
          aria-label={jsonMode ? 'Currently JSON mode. Click to switch to plain text.' : 'Currently text mode. Click to switch to JSON.'}
          aria-pressed={jsonMode}
        >
          {jsonMode ? 'JSON' : 'Text'}
        </button>
      </div>

      <div className="request-editor" role="region" aria-label="Request body editor. Tab indents. Press Escape to exit the editor.">
        <CodeMirror
          value={body}
          onChange={setBody}
          extensions={extensions}
          placeholder="Data to send"
          basicSetup={{
            lineNumbers: false,
            foldGutter: false,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: jsonMode,
            highlightActiveLine: true,
            highlightSelectionMatches: false,
            searchKeymap: false,
            tabSize: 2,
          }}
          theme="none"
          style={{ height: '100%' }}
        />
      </div>
    </div>
  )
}
