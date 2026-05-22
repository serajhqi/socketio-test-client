import { useEffect, useRef } from 'react'
import { useStore } from '../store'
import './Logger.scss'

function classifyMessage(msg: string): string {
  const lower = msg.toLowerCase()
  if (lower.includes('connect') && !lower.includes('disconnect')) return 'connect'
  if (lower.includes('disconnect') || lower.includes('error') || lower.includes('fail')) return 'disconnect'
  if (lower.includes('emit') || lower.includes('sent')) return 'emit'
  if (lower.includes('receiv') || lower.includes('response') || lower.includes('ack')) return 'receive'
  if (lower.includes('warn')) return 'warn'
  return ''
}

export function Logger() {
  const { logs } = useStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const shouldAutoScroll = useRef(true)

  useEffect(() => {
    if (shouldAutoScroll.current && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const handleScroll = () => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    shouldAutoScroll.current = scrollTop + clientHeight >= scrollHeight - 10
  }

  return (
    <div className="logger-panel">
      <div className="logger-panel__header">
        <h2 className="logger-panel__title">console</h2>
        <button
          className="logger-panel__clear-btn"
          onClick={() => useStore.getState().clearLogs()}
          disabled={logs.length === 0}
          aria-label="Clear console logs"
        >
          clear
        </button>
      </div>

      <div className="logger-panel__content" onScroll={handleScroll} ref={scrollRef}>
        {logs.length === 0 ? (
          <div className="logger-panel__empty">
            <p>Waiting for activity…</p>
          </div>
        ) : (
          <div className="logger-panel__logs">
            {logs.map((log) => {
              const kind = classifyMessage(log.message)
              return (
                <div key={log.id} className="log-entry">
                  <span className="log-entry__time">
                    {new Date(log.time).toLocaleTimeString('en-US', {
                      hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
                    })}
                  </span>
                  <span className="log-entry__prompt">›</span>
                  <span className={`log-entry__message${kind ? ` log-entry__message--${kind}` : ''}`}>
                    {log.message}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="logger-panel__footer">
        <span className="logger-panel__count">{logs.length} lines</span>
        <span className="logger-panel__cursor" />
      </div>
    </div>
  )
}
