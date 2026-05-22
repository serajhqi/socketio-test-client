import { useEffect, useState } from 'react'
import './HelpModal.scss'

interface Contributor {
  login: string
  avatar_url: string
  profile_url: string
  contributions: number
}

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    setLoading(true)
    fetch('https://api.github.com/repos/serajhqi/socketio-test-client/contributors')
      .then((res) => res.json())
      .then((data) => {
        setContributors(
          data.slice(0, 10).map((c: any) => ({
            login: c.login,
            avatar_url: c.avatar_url,
            profile_url: c.html_url,
            contributions: c.contributions,
          }))
        )
      })
      .catch(() => setContributors([]))
      .finally(() => setLoading(false))
  }, [isOpen])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="help-modal-overlay" onClick={onClose}>
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="help-modal__header">
          <h2 className="help-modal__title">Socket.IO Test Client — Guide</h2>
          <button
            className="help-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="help-modal__content">

          {/* Quick Start */}
          <section className="help-modal__section">
            <h3 className="help-modal__section-title">Quick Start</h3>
            <ol className="help-modal__steps">
              <li>Click the server URL area (left side of the request bar) to configure your Socket.IO server URL</li>
              <li>Click the connection dot (●) to connect</li>
              <li>Type your event name, optional title, and JSON payload</li>
              <li>Press <strong>Send</strong> or <kbd>Ctrl+Enter</kbd> to emit the event</li>
              <li>View the response and logs in the right panels</li>
            </ol>
          </section>

          {/* Keyboard Shortcuts */}
          <section className="help-modal__section">
            <h3 className="help-modal__section-title">Keyboard Shortcuts</h3>
            <div className="help-modal__shortcuts">
              <div className="help-modal__shortcut-row">
                <div className="help-modal__shortcut-keys">
                  <kbd>Ctrl</kbd><span className="help-modal__plus">+</span><kbd>Enter</kbd>
                  <span className="help-modal__sep">/</span>
                  <kbd>⌘</kbd><span className="help-modal__plus">+</span><kbd>Enter</kbd>
                </div>
                <span className="help-modal__shortcut-desc">Send request</span>
              </div>
              <div className="help-modal__shortcut-row">
                <div className="help-modal__shortcut-keys">
                  <kbd>Escape</kbd>
                </div>
                <span className="help-modal__shortcut-desc">Close any modal</span>
              </div>
            </div>
          </section>

          {/* Connection Options */}
          <section className="help-modal__section">
            <h3 className="help-modal__section-title">Connection Options</h3>
            <p className="help-modal__text">
              The options field accepts a JSON object passed directly to the Socket.IO client constructor.
              Common fields:
            </p>
            <pre className="help-modal__code">{`{
  "transports": ["websocket"],
  "auth": { "token": "your-token" },
  "extraHeaders": { "Authorization": "Bearer ..." },
  "path": "/socket.io"
}`}</pre>
          </section>

          {/* Listeners */}
          <section className="help-modal__section">
            <h3 className="help-modal__section-title">Listeners</h3>
            <ul className="help-modal__list">
              <li>Type an event name in the listeners area and press <kbd>Enter</kbd> to subscribe</li>
              <li>Messages appear in real-time as the server emits them</li>
              <li>Click a message to inspect the full payload in the JSON viewer</li>
            </ul>
          </section>

          {/* Profiles */}
          <section className="help-modal__section">
            <h3 className="help-modal__section-title">Profiles</h3>
            <ul className="help-modal__list">
              <li>Save server configurations (URL + options) as named profiles</li>
              <li>Switch between profiles from the top toolbar</li>
              <li>Profiles are persisted between sessions</li>
            </ul>
          </section>

          {/* Export / Import */}
          <section className="help-modal__section">
            <h3 className="help-modal__section-title">Export / Import</h3>
            <ul className="help-modal__list">
              <li>Export saves your history, listeners, and profiles as a JSON file</li>
              <li>Import restores a previously exported session</li>
            </ul>
          </section>

          {/* Contributors */}
          <section className="help-modal__section">
            <h3 className="help-modal__section-title">Contributors</h3>
            {loading ? (
              <p className="help-modal__loading">Loading contributors...</p>
            ) : contributors.length > 0 ? (
              <div className="help-modal__contributors">
                {contributors.map((c) => (
                  <a
                    key={c.login}
                    href={c.profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="help-modal__contributor"
                    title={`${c.login} (${c.contributions} contributions)`}
                  >
                    <img
                      src={c.avatar_url}
                      alt={c.login}
                      className="help-modal__avatar"
                    />
                    <span className="help-modal__login">{c.login}</span>
                    <span className="help-modal__count">{c.contributions}</span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="help-modal__empty">Failed to load contributors</p>
            )}
          </section>

          {/* Resources */}
          <section className="help-modal__section">
            <h3 className="help-modal__section-title">Resources</h3>
            <ul className="help-modal__links">
              <li>
                <a
                  href="https://github.com/serajhqi/socketio-test-client"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="https://socket.io/docs/v4/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Socket.IO Documentation
                </a>
              </li>
            </ul>
          </section>

        </div>

        <div className="help-modal__footer">
          <button className="help-modal__button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
