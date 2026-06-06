import { useState } from 'react'
import { useStore } from '../../store'
import './History.scss'

interface HistoryProps {
  onCollapse?: () => void
}

export function History({ onCollapse }: HistoryProps) {
  const { requestHistory } = useStore()
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = [...requestHistory]
    .reverse()
    .filter(item =>
      item.emitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.note && item.note.toLowerCase().includes(searchTerm.toLowerCase()))
    )

  const handleOpen = (emitName: string) => {
    const item = requestHistory.find(h => h.emitName === emitName)
    if (item) useStore.getState().setRequest({ response: undefined, duration: undefined, ...item })
  }

  const handleRemove = (e: React.MouseEvent, emitName: string) => {
    e.stopPropagation()
    useStore.getState().removeFromHistory(emitName)
  }

  return (
    <div className="history">
      <div className="history__header">
        <div className="history__search-row">
          <svg className="history__search-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            className="history__search"
            placeholder="Search…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            spellCheck={false}
          />
          {requestHistory.length > 0 && (
            <span className="history__count">{filtered.length}/{requestHistory.length}</span>
          )}
        </div>
        {onCollapse && (
          <button className="history__collapse" onClick={onCollapse} title="Collapse history" aria-label="Collapse history panel">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
        )}
      </div>

      <div className="history__list">
        {requestHistory.length === 0 ? (
          <div className="history__empty">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 8v4l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>No history yet</span>
            <span className="history__empty-hint">Sent requests appear here</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="history__empty">
            <span>No matches</span>
          </div>
        ) : (
          filtered.map(item => {
            const hasResponse = item.response !== undefined

            return (
              <button
                key={item.emitName}
                className="history__item"
                onClick={() => handleOpen(item.emitName)}
                title={`Open: ${item.emitName}`}
                aria-label={`Load request: ${item.emitName}`}
              >
                <span className={`history__dot ${hasResponse ? 'history__dot--response' : ''}`} aria-hidden="true" />
                <span className="history__item-body">
                  <span className="history__event">{item.emitName}</span>
                  {item.note && <span className="history__title">{item.note}</span>}
                </span>
                <span
                  className="history__remove"
                  role="button"
                  tabIndex={0}
                  title="Remove from history"
                  aria-label={`Remove ${item.emitName} from history`}
                  onClick={e => handleRemove(e as unknown as React.MouseEvent, item.emitName)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleRemove(e as unknown as React.MouseEvent, item.emitName) }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </span>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
