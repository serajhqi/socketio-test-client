import { useStore } from '../store'
import { toast } from 'sonner'
import './Response.scss'

function formatJson(obj: unknown): string {
  try {
    return JSON.stringify(obj, null, 2)
  } catch {
    return String(obj)
  }
}

function formatDuration(ms?: number): string {
  if (!ms) return '-'
  if (ms < 1000) return `${Math.round(ms)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

export function Response() {
  const { request, connectionDetails } = useStore()
  const { response, duration, body } = request || {}

  const handleCopy = () => {
    if (!response) return
    const text = typeof response === 'string' ? response : formatJson(response)
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Response copied to clipboard')
    })
  }

  const hasResponse = response !== undefined && response !== null

  return (
    <div className="response-panel">
      <div className="response-panel__header">
        <h2 className="response-panel__title">Response</h2>
        {hasResponse && (
          <button
            className="response-panel__copy-btn"
            onClick={handleCopy}
            title="Copy response"
          >
            Copy
          </button>
        )}
      </div>

      <div className="response-panel__details">
        <div className="response-detail-item">
          <span className="response-detail-item__label">Duration:</span>
          <span className="response-detail-item__value">
            {formatDuration(duration)}
          </span>
        </div>
        {connectionDetails?.socketId && (
          <div className="response-detail-item">
            <span className="response-detail-item__label">Socket ID:</span>
            <span className="response-detail-item__value">
              {connectionDetails.socketId.substring(0, 12)}...
            </span>
          </div>
        )}
        {connectionDetails?.transport && (
          <div className="response-detail-item">
            <span className="response-detail-item__label">Transport:</span>
            <span className="response-detail-item__value">
              {connectionDetails.transport}
            </span>
          </div>
        )}
        {connectionDetails?.reconnectionCount !== undefined && (
          <div className="response-detail-item">
            <span className="response-detail-item__label">Reconnections:</span>
            <span className="response-detail-item__value">
              {connectionDetails.reconnectionCount}
            </span>
          </div>
        )}
      </div>

      <div className="response-panel__content">
        {!hasResponse ? (
          <div className="response-panel__empty">
            <p>No response yet. Send a request to get a response.</p>
          </div>
        ) : (
          <pre className="response-panel__json">
            {typeof response === 'string'
              ? response
              : formatJson(response)}
          </pre>
        )}
      </div>
    </div>
  )
}
