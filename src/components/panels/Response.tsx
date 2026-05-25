import { useState } from 'react'
import { useStore } from '../../store'
import { toast } from 'sonner'
import ReactJson from 'react-json-view'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import './Response.scss'

function formatDuration(ms?: number): string {
  if (ms === undefined || ms === null) return '—'
  if (ms < 1000) return `${Math.round(ms)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

export function Response() {
  const [expanded, setExpanded] = useState(false)
  const { request, connectionDetails, status } = useStore()
  const { response, duration } = request || {}

  const handleCopy = () => {
    if (response === undefined) return
    const text = typeof response === 'string' ? response : JSON.stringify(response, null, 2)
    navigator.clipboard.writeText(text).then(() => toast.success('Copied to clipboard'))
  }

  const hasResponse = response !== undefined
  const socketId = connectionDetails?.socketId
  const transport = connectionDetails?.transport
  const reconnections = connectionDetails?.reconnectionCount ?? 0

  return (
    <div className="response-panel">
      <div className="response-panel__statusbar">
        <div className="response-statusbar__left">
          <span className="response-statusbar__item">
            <span className="response-statusbar__label">id</span>
            <span
              className={`response-statusbar__value ${socketId ? '' : 'response-statusbar__value--muted'}`}
              title={socketId ? `Socket ID: ${socketId}` : ''}
            >
              {socketId ? socketId.substring(0, 24) + (socketId.length > 24 ? '…' : '') : status === 'disconnected' ? 'disconnected' : '…'}
            </span>
          </span>
          {transport && (
            <span className="response-statusbar__item">
              <span className="response-statusbar__label">via</span>
              <span className="response-statusbar__value">{transport}</span>
            </span>
          )}
          <span className="response-statusbar__item">
            <span className="response-statusbar__label">reconnects</span>
            <span className="response-statusbar__value response-statusbar__value--muted">{reconnections}</span>
          </span>
        </div>
        <div className="response-statusbar__right">
          <span className="response-statusbar__duration">
            {formatDuration(duration)}
          </span>
          {hasResponse && typeof response !== 'string' && (
            <button
              className="response-panel__expand-btn"
              onClick={() => setExpanded(!expanded)}
              title={expanded ? 'Show interactive view' : 'Show plain JSON'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {expanded ? (
                  <path d="M3 6h18M3 12h18M3 18h18" />
                ) : (
                  <path d="M12 5v14M5 12h14M9 8l3-3 3 3M9 16l3 3 3-3" />
                )}
              </svg>
            </button>
          )}
          {hasResponse && (
            <button className="response-panel__copy-btn" onClick={handleCopy} title="Copy response">
              copy
            </button>
          )}
        </div>
      </div>

      <div className="response-panel__content">
        {!hasResponse ? (
          <div className="response-panel__empty">
            <p>No response yet.</p>
            <p className="response-panel__empty-hint">Send a request to see the response here.</p>
          </div>
        ) : typeof response === 'string' ? (
          <pre className="response-panel__json">{response}</pre>
        ) : expanded ? (
          <CodeMirror
            value={JSON.stringify(response, null, 2)}
            extensions={[json()]}
            theme={oneDark}
            readOnly
            className="response-panel__codemirror"
          />
        ) : (
          <ReactJson
            src={response as object}
            collapsed={false}
            enableClipboard={true}
            theme={{
              base00: 'transparent',
              base01: 'rgba(176,160,160,0.05)',
              base02: 'rgba(176,160,160,0.1)',
              base03: 'rgba(176,160,160,0.45)',
              base04: 'rgba(176,160,160,0.6)',
              base05: 'rgba(255,255,255,0.82)',
              base06: '#ffffff',
              base07: '#ffffff',
              base08: '#f97583',
              base09: '#79b8ff',
              base0A: '#fbbf24',
              base0B: '#85e89d',
              base0C: '#7dd3fc',
              base0D: '#7dd3fc',
              base0E: '#f97583',
              base0F: '#f97316',
            }}
          />
        )}
      </div>
    </div>
  )
}
