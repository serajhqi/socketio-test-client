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
          <ReactJson src={response} collapsed={1} enableClipboard={true} />
        )}
      </div>
    </div>
  )
}
