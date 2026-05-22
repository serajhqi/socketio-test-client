import { useEffect, useRef } from 'react'
import { useStore } from '../store'
import './Logger.scss'

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

  const handleClear = () => {
    useStore.getState().clearLogs()
  }

  return (
    <div className="logger-panel">
      <div className="logger-panel__header">
        <h2 className="logger-panel__title">Log</h2>
        <button
          className="logger-panel__clear-btn"
          onClick={handleClear}
          disabled={logs.length === 0}
          title="Clear all logs"
        >
          Clear
        </button>
      </div>

      <div
        className="logger-panel__content"
        onScroll={handleScroll}
        ref={scrollRef}
      >
        {logs.length === 0 ? (
          <div className="logger-panel__empty">
            <p>No logs yet. Connect to a server or send requests to see logs.</p>
          </div>
        ) : (
          <div className="logger-panel__logs">
            {logs.map((log) => (
              <div key={log.id} className="log-entry">
                <span className="log-entry__time">
                  {new Date(log.time).toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    fractionalSecondDigits: 3,
                  })}
                </span>
                <span className="log-entry__message">{log.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="logger-panel__footer">
        <span className="logger-panel__count">{logs.length} entries</span>
      </div>
    </div>
  )
}
