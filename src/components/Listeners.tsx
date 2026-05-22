import { useState } from 'react'
import { useStore } from '../store'
import { toast } from 'sonner'
import './Listeners.scss'

export function Listeners() {
  const { listeners } = useStore()
  const [selectedListener, setSelectedListener] = useState<string | null>(
    listeners.length > 0 ? listeners[0].title : null
  )
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)

  const currentListener = listeners.find((l) => l.title === selectedListener)
  const currentMessage = currentListener?.messages.find(
    (m) => m.id === selectedMessageId
  )

  const handleAddListener = () => {
    const title = prompt('Enter listener event name:', '')
    if (!title) return
    useStore.getState().addListener(title)
    setSelectedListener(title)
    toast.success(`Listener added: ${title}`)
  }

  const handleRemoveListener = (title: string) => {
    useStore.getState().removeListener(title)
    if (selectedListener === title) {
      const remaining = listeners.filter((l) => l.title !== title)
      setSelectedListener(remaining.length > 0 ? remaining[0].title : null)
    }
    toast.success(`Listener removed: ${title}`)
  }

  const handleClearMessages = (title: string) => {
    useStore.getState().clearMessages(title)
    setSelectedMessageId(null)
    toast.success(`Messages cleared for: ${title}`)
  }

  const formatJson = (obj: unknown): string => {
    try {
      return JSON.stringify(obj, null, 2)
    } catch {
      return String(obj)
    }
  }

  return (
    <div className="listeners-panel">
      <div className="listeners-header">
        <h2 className="listeners-header__title">Listeners</h2>
        <button
          className="listeners-header__add-btn"
          onClick={handleAddListener}
          title="Add listener"
        >
          + Add
        </button>
      </div>

      <div className="listeners-container">
        {/* Listeners List */}
        <div className="listeners-list">
          {listeners.length === 0 ? (
            <div className="listeners-list__empty">
              <p>No listeners yet. Click "+ Add" to create one.</p>
            </div>
          ) : (
            <div className="listeners-list__items">
              {listeners.map((listener) => (
                <div
                  key={listener.title}
                  className={`listener-item ${
                    selectedListener === listener.title
                      ? 'listener-item--active'
                      : ''
                  }`}
                  onClick={() => setSelectedListener(listener.title)}
                >
                  <div className="listener-item__content">
                    <div className="listener-item__name">{listener.title}</div>
                    <div className="listener-item__count">
                      {listener.messages.length}
                    </div>
                  </div>
                  <button
                    className="listener-item__remove"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveListener(listener.title)
                    }}
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Messages List */}
        {currentListener ? (
          <div className="messages-list">
            <div className="messages-header">
              <h3 className="messages-header__title">{currentListener.title}</h3>
              <button
                className="messages-header__clear"
                onClick={() => handleClearMessages(currentListener.title)}
                disabled={currentListener.messages.length === 0}
                title="Clear messages"
              >
                Clear
              </button>
            </div>
            {currentListener.messages.length === 0 ? (
              <div className="messages-list__empty">
                <p>No messages yet.</p>
              </div>
            ) : (
              <div className="messages-list__items">
                {currentListener.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message-item ${
                      selectedMessageId === msg.id ? 'message-item--active' : ''
                    }`}
                    onClick={() => setSelectedMessageId(msg.id)}
                  >
                    <div className="message-item__time">
                      {new Date(msg.time).toLocaleTimeString('en-US', {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </div>
                    <div className="message-item__preview">
                      {typeof msg.text === 'string'
                        ? msg.text.substring(0, 40)
                        : JSON.stringify(msg.text).substring(0, 40)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="messages-list messages-list--empty">
            <div className="messages-list__empty">
              <p>Select a listener to view messages.</p>
            </div>
          </div>
        )}

        {/* JSON Viewer */}
        <div className="json-viewer">
          {currentMessage ? (
            <>
              <div className="json-viewer__header">
                <h3 className="json-viewer__title">Message</h3>
              </div>
              <pre className="json-viewer__content">
                {formatJson(currentMessage.text)}
              </pre>
            </>
          ) : (
            <div className="json-viewer__empty">
              <p>Select a message to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
