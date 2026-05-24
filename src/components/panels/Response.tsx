import { useState } from 'react'
import { useStore } from '../../store'
import { toast } from 'sonner'
import ReactJson from 'react-json-view'
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
    if (!response) return
    const text = typeof response === 'string' ? response : JSON.stringify(response, null, 2)
    navigator.clipboard.writeText(text).then(() => toast.success('Copied to clipboard'))
  }

  const hasResponse = response !== undefined && response !== null
  const socketId = connectionDetails?.socketId
  const transport = connectionDetails?.transport
  const reconnections = connectionDetails?.reconnectionCount ?? 0

  return (
    <div className="response-panel">
      <div className="response-panel__statusbar">
        <div className="response-statusbar__left">
          <span className="response-statusbar__item">
            <span className="response-statusbar__label">id</span>
            <span className={`response-statusbar__value ${socketId ? '' : 'response-statusbar__value--muted'}`}>
              {socketId ? socketId.substring(0, 14) + '…' : status === 'disconnected' ? 'disconnected' : '…'}
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
              title={expanded ? 'Show collapsed' : 'Show expanded'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {expanded ? (
                  <path d="M8 15H16M8 9H16M4 7V17C4 18.1046 4.89543 19 6 19H18C19.1046 19 20 18.1046 20 17V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7Z" />
                ) : (
                  <path d="M4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V4C20 2.89543 19.1046 2 18 2H6C4.89543 2 4 2.89543 4 4Z" />
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
        ) : (
          <ReactJson key={`${expanded}`} src={response} collapsed={expanded ? false : 2} enableClipboard={true} />
        )}
      </div>
    </div>
  )
}
