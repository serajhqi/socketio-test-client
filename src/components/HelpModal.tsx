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

  if (!isOpen) return null

  return (
    <div className="help-modal-overlay" onClick={onClose}>
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="help-modal__header">
          <h2 className="help-modal__title">About Socket.IO Test Client</h2>
          <button
            className="help-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="help-modal__content">
          <section className="help-modal__section">
            <h3>Project</h3>
            <p>
              A modern web application for testing Socket.IO connections and
              events. Built with React and TypeScript.
            </p>
          </section>

          <section className="help-modal__section">
            <h3>Contributors</h3>
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

          <section className="help-modal__section">
            <h3>Resources</h3>
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
