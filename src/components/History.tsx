import { useState } from 'react'
import { useStore } from '../store'
import './History.scss'

export function History() {
  const { requestHistory, historyCollapsed, setHistoryCollapsed } = useStore()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredHistory = requestHistory.filter((item) =>
    (item.title || item.emitName).toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenRequest = (title: string) => {
    const item = requestHistory.find((h) => h.title === title)
    if (item) {
      useStore.getState().setRequest(item)
    }
  }

  const handleRemoveRequest = (title: string) => {
    useStore.getState().removeFromHistory(title)
  }

  return (
    <div className="history-panel">
      <button
        className="history-toggle"
        onClick={() => setHistoryCollapsed(!historyCollapsed)}
        title={historyCollapsed ? 'Expand history' : 'Collapse history'}
      >
        <span className="history-toggle__arrow">
          {historyCollapsed ? '▶' : '▼'}
        </span>
        History
        {requestHistory.length > 0 && (
          <span className="history-toggle__count">{requestHistory.length}</span>
        )}
      </button>

      {!historyCollapsed && (
        <div className="history-content">
          {requestHistory.length === 0 ? (
            <div className="history-empty">
              <p>No history yet. Send some requests to populate history.</p>
            </div>
          ) : (
            <>
              <div className="history-search">
                <input
                  type="text"
                  className="history-search__input"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {filteredHistory.length === 0 ? (
                <div className="history-empty">
                  <p>No matching requests.</p>
                </div>
              ) : (
                <div className="history-list">
                  {filteredHistory.map((item) => (
                    <div key={item.title} className="history-item">
                      <button
                        className="history-item__button"
                        onClick={() => handleOpenRequest(item.title)}
                        title="Open request"
                      >
                        <div className="history-item__info">
                          <div className="history-item__title">
                            {item.title}
                          </div>
                          <div className="history-item__event">
                            {item.emitName}
                          </div>
                        </div>
                      </button>
                      <button
                        className="history-item__remove"
                        onClick={() => handleRemoveRequest(item.title)}
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
