import { useEffect } from 'react'
import { ChangelogEntry, ChangeType } from '../../data/changelog'
import { APP_VERSION } from '../../version'
import './WhatsNewModal.scss'

interface WhatsNewModalProps {
  isOpen: boolean
  onClose: () => void
  entries: ChangelogEntry[]
}

const CHANGE_ICONS: Record<ChangeType, string> = {
  feat: '✦',
  fix: '✔',
  perf: '↑',
  ui: '◈',
}

const CHANGE_LABELS: Record<ChangeType, string> = {
  feat: 'Feature',
  fix: 'Fix',
  perf: 'Performance',
  ui: 'UI',
}

export function WhatsNewModal({
  isOpen,
  onClose,
  entries,
}: WhatsNewModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="whats-new-modal-overlay" onClick={onClose}>
      <div className="whats-new-modal" onClick={(e) => e.stopPropagation()}>
        <div className="whats-new-modal__header">
          <h2 className="whats-new-modal__title">What's New</h2>
          <span className="whats-new-modal__version">v{APP_VERSION}</span>
          <button
            className="whats-new-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="whats-new-modal__content">
          {entries.length > 0 ? (
            entries.map((entry) => (
              <section
                key={entry.version}
                className="whats-new-modal__section"
              >
                <h3 className="whats-new-modal__version-title">
                  Version {entry.version}
                </h3>
                <ul className="whats-new-modal__changes">
                  {entry.changes.map((change, idx) => (
                    <li
                      key={idx}
                      className={`whats-new-modal__change whats-new-modal__change--${change.type}`}
                    >
                      <span className="whats-new-modal__change-icon">
                        {CHANGE_ICONS[change.type]}
                      </span>
                      <span className="whats-new-modal__change-label">
                        {CHANGE_LABELS[change.type]}
                      </span>
                      <span className="whats-new-modal__change-text">
                        {change.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          ) : (
            <p className="whats-new-modal__no-changes">
              No changes to display.
            </p>
          )}
        </div>

        <div className="whats-new-modal__footer">
          <a
            href="https://github.com/serajhqi/socketio-test-client/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="whats-new-modal__feedback-link"
          >
            Found something? Report an issue →
          </a>
          <button className="whats-new-modal__button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
