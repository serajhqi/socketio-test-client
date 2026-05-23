import { useState, useRef } from 'react'
import { useStore } from '../../store'
import { toast } from 'sonner'
import './Listeners.scss'

export function Listeners() {
  const { listeners } = useStore()
  const [composeValue, setComposeValue] = useState('')
  const [composeFocused, setComposeFocused] = useState(false)
  const [selectedListener, setSelectedListener] = useState<string | null>(
    listeners.length > 0 ? listeners[0].title : null
  )
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const composeInputRef = useRef<HTMLInputElement>(null)

  const currentListener = listeners.find((l) => l.title === selectedListener)
  const currentMessage = currentListener?.messages.find((m) => m.id === selectedMessageId)

  const handleAddListener = () => {
    const name = composeValue.trim()
    if (!name) return
    if (listeners.find((l) => l.title === name)) {
      toast.error('Listener already exists')
      return
    }
    useStore.getState().addListener(name)
    setSelectedListener(name)
    setComposeValue('')
    toast.success(`Listening: ${name}`)
  }

  const handleComposeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddListener()
    } else if (e.key === 'Escape') {
      setComposeValue('')
      composeInputRef.current?.blur()
    }
  }

  const handleRemoveListener = (title: string) => {
    useStore.getState().removeListener(title)
    if (selectedListener === title) {
      const remaining = listeners.filter((l) => l.title !== title)
      setSelectedListener(remaining.length > 0 ? remaining[0].title : null)
    }
  }

  const handleClearMessages = (title: string) => {
    useStore.getState().clearMessages(title)
    setSelectedMessageId(null)
  }

  const formatJson = (obj: unknown): string => {
    try { return JSON.stringify(obj, null, 2) } catch { return String(obj) }
  }

  return (
    <div className="listeners-panel">
      <div className="listeners-header">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <path d="M8.3931 9.85868C8.38638 10.2728 8.71667 10.614 9.13083 10.6208C9.54499 10.6275 9.88618 10.2972 9.8929 9.88303L8.3931 9.85868ZM14.857 9.87086L15.607 9.87398C15.607 9.86888 15.607 9.86378 15.6069 9.85868L14.857 9.87086ZM13.633 12.1419L14.043 12.7699L14.048 12.7666L13.633 12.1419ZM11.1306 14.0509C10.7297 14.1549 10.489 14.5643 10.593 14.9652C10.6971 15.3662 11.1064 15.6069 11.5074 15.5028L11.1306 14.0509ZM7 10.0039H7.75L7.75 10.0034L7 10.0039ZM9.8929 9.88303C9.91139 8.74418 10.8493 7.8358 11.9882 7.85376L12.0118 6.35395C10.0449 6.32292 8.42502 7.89179 8.3931 9.85868L9.8929 9.88303ZM12.0118 7.85376C13.1507 7.8358 14.0886 8.74418 14.1071 9.88303L15.6069 9.85868C15.575 7.89179 13.9551 6.32292 11.9882 6.35395L12.0118 7.85376ZM14.107 9.86773C14.1042 10.5314 13.7708 11.1499 13.218 11.5171L14.048 12.7666C15.0174 12.1227 15.6021 11.0378 15.607 9.87398L14.107 9.86773ZM13.223 11.5139C12.1865 12.1906 11.7688 12.9152 11.4957 13.4681C11.1952 14.0765 11.2 14.0329 11.1306 14.0509L11.5074 15.5028C12.386 15.2748 12.6633 14.4913 12.8406 14.1324C13.0452 13.718 13.3105 13.2481 14.043 12.7699L13.223 11.5139ZM7.75 10.0034C7.74865 7.98563 9.16618 6.24508 11.1424 5.83793L10.8397 4.36878C8.16601 4.91964 6.24817 7.2745 6.25 10.0044L7.75 10.0034Z" fill="#fbbf24"/>
        </svg>
        <span className="listeners-header__title">Listeners</span>
      </div>

      <div className="listeners-container">
        {/* Listeners List */}
        <div className="listeners-list">
          {listeners.length === 0 ? (
            <div className="listeners-list__empty">
              <p>Add an event name below to start listening</p>
            </div>
          ) : (
            <div className="listeners-list__items">
              {listeners.map((listener) => (
                <div
                  key={listener.title}
                  className={`listener-item ${selectedListener === listener.title ? 'listener-item--active' : ''}`}
                  onClick={() => setSelectedListener(listener.title)}
                >
                  <div className="listener-item__content">
                    <span className="listener-item__name">{listener.title}</span>
                    {listener.messages.length > 0 && (
                      <span className="listener-item__count">({listener.messages.length})</span>
                    )}
                  </div>
                  <button
                    className="listener-item__remove"
                    onClick={e => { e.stopPropagation(); handleRemoveListener(listener.title) }}
                    title="Remove listener"
                    aria-label={`Remove listener: ${listener.title}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Compose row at the bottom of the list */}
          <div
            className={`listeners-compose ${composeFocused ? 'listeners-compose--focused' : ''}`}
            onClick={() => composeInputRef.current?.focus()}
          >
            <input
              ref={composeInputRef}
              className="listeners-compose__input"
              placeholder="event name…"
              value={composeValue}
              onChange={e => setComposeValue(e.target.value)}
              onKeyDown={handleComposeKeyDown}
              onFocus={() => setComposeFocused(true)}
              onBlur={() => setComposeFocused(false)}
              spellCheck={false}
              autoComplete="off"
            />
            <button
              className="listeners-compose__add"
              onClick={e => { e.stopPropagation(); handleAddListener() }}
              title="Add listener"
              aria-label="Add listener"
              tabIndex={-1}
            >
              →
            </button>
          </div>
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
                aria-label={`Clear messages for ${currentListener.title}`}
              >
                clear
              </button>
            </div>
            {currentListener.messages.length === 0 ? (
              <div className="messages-list__empty"><p>Waiting…</p></div>
            ) : (
              <div className="messages-list__items">
                {currentListener.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message-item ${selectedMessageId === msg.id ? 'message-item--active' : ''}`}
                    onClick={() => setSelectedMessageId(msg.id)}
                  >
                    <div className="message-item__time">
                      {new Date(msg.time).toLocaleTimeString('en-US', {
                        hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
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
            <div className="messages-list__empty"><p>Select a listener to view messages.</p></div>
          </div>
        )}

        {/* JSON Viewer */}
        <div className="json-viewer">
          {currentMessage ? (
            <>
              <div className="json-viewer__header">
                <h3 className="json-viewer__title">Payload</h3>
              </div>
              <pre className="json-viewer__content">{formatJson(currentMessage.text)}</pre>
            </>
          ) : (
            <div className="json-viewer__empty">
              <p>Select a message to inspect its payload.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
