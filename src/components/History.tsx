import { useState } from 'react'
import { useStore } from '../store'
import './History.scss'

interface HistoryProps {
  onCollapse?: () => void
}

export function History({ onCollapse }: HistoryProps) {
  const { requestHistory } = useStore()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredHistory = [...requestHistory]
    .reverse()
    .filter(item =>
      (item.title || item.emitName).toLowerCase().includes(searchTerm.toLowerCase())
    )

  const handleOpenRequest = (title: string) => {
    const item = requestHistory.find(h => h.title === title)
    if (item) useStore.getState().setRequest(item)
  }

  const handleRemoveRequest = (title: string) => {
    useStore.getState().removeFromHistory(title)
  }

  return (
    <div className="history-sidebar">
      <div className="history-sidebar__header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <path d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <input
          className="history-sidebar__search"
          placeholder="Search Requests"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {onCollapse && (
          <button className="history-sidebar__collapse" onClick={onCollapse} title="Collapse">
            <svg width="16" height="16" viewBox="0 0 20 20" style={{ fill: 'currentColor' }}>
              <path d="M24 23h-24v-22h24v22zm-2-20h-14v18h14v-18zm-4 4l-6 5 6 5v-10z"/>
            </svg>
          </button>
        )}
      </div>

      <div className="history-sidebar__list">
        {requestHistory.length === 0 ? (
          <div className="history-sidebar__empty">
            <p>No history yet. Send some requests to populate history.</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="history-sidebar__empty">
            <p>No matching requests.</p>
          </div>
        ) : (
          filteredHistory.map(item => (
            <div key={item.title || item.emitName} className="history-item">
              <div className="history-item__info">
                <span className="history-item__title">{item.title || item.emitName}</span>
                <span className="history-item__event">{item.emitName}</span>
              </div>
              <div className="history-item__actions">
                <button
                  className="history-item__open"
                  onClick={() => handleOpenRequest(item.title || item.emitName)}
                >
                  Open
                </button>
                <button
                  className="history-item__remove"
                  onClick={() => handleRemoveRequest(item.title || item.emitName)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
