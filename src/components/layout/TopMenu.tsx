import { useStore } from '../../store'
import { APP_VERSION } from '../../version'
import { ProfilePicker } from '../profiles/ProfilePicker'
import { ConnectionController } from '../ConnectionController'
import './TopMenu.scss'

interface TopMenuProps {
  onHelpClick?: () => void
  onDonateClick?: () => void
  onServerClick?: () => void
}

export function TopMenu({ onHelpClick, onDonateClick, onServerClick }: TopMenuProps) {
  const { repoStars, theme, setTheme } = useStore()

  return (
    <header className="top-menu">
      <div className="top-menu__left">
        <div className="top-menu__brand">
          <svg className="top-menu__logo" width="30" height="30" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <path d="M96.447 7.382c32.267-8.275 67.929-3.453 96.386 14.11 35.84 21.433 59.238 61.976 59.833 103.71 1.31 42.15-20.659 83.944-55.963 106.865-39.293 26.433-93.648 27.446-133.775 2.322-40.9-24.41-64.774-73.645-58.641-120.916 4.94-49.95 43.52-94.005 92.16-106.09z" fill="#111"/>
            <path d="M91.505 27.803c60.964-24.41 135.74 20.658 142.05 86.028 9.824 58.82-38.995 118.593-98.59 120.32-56.677 5.656-111.449-42.39-113.056-99.304-4.227-46.08 26.136-91.803 69.596-107.044z" fill="#fff"/>
            <path d="M97.637 121.69c27.327-22.326 54.058-45.426 81.98-67.097-14.646 22.505-29.708 44.711-44.354 67.215-12.562.06-25.123.06-37.626-.119zM120.737 134.132c12.621 0 25.183 0 37.745.179-27.505 22.206-54.117 45.484-82.099 67.096 14.646-22.505 29.708-44.77 44.354-67.275z" fill="#111"/>
          </svg>
        </div>
        <div className="top-menu__title-group">
          <h1 className="top-menu__title">
            <span className="top-menu__title-brand">Socket.IO</span>
            <span className="top-menu__title-sub"> Test Client</span>
          </h1>
          <a
            href="https://logicamp.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="top-menu__byline"
            aria-label="logicamp.dev"
          >
            logicamp.dev
          </a>
        </div>
        {APP_VERSION && <span className="top-menu__version">v{APP_VERSION}</span>}
      </div>
    

      <div className="top-menu__center">
        <ConnectionController onServerClick={onServerClick} />
        <div className="top-menu__divider" aria-hidden="true" />
        <ProfilePicker />
      </div>

      <div className="top-menu__right">

        {/* Theme toggle */}
        <button
          className="top-menu__theme-btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-2c1.65 0 3-1.35 3-3s-1.35-3-3-3-3 1.35-3 3 1.35 3 3 3zm-1-8V3h2v4h-2zm0 14v-4h2v4h-2zM4 11H1v2h3v-2zm17 0h-3v2h3v-2zM5.64 6.36 4.22 4.94 2.81 6.35l1.41 1.42 1.42-1.41zm12.73 11.31-1.41-1.41-1.42 1.41 1.42 1.42 1.41-1.42zM5.64 17.64l-1.42-1.41-1.41 1.41 1.41 1.42 1.42-1.42zm12.72-11.3-1.42-1.42-1.41 1.42 1.41 1.41 1.42-1.41z"/>
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>
            </svg>
          )}
        </button>

        {/* Help */}
        {onHelpClick && (
          <button
            className="top-menu__help-btn"
            onClick={onHelpClick}
            title="Help & keyboard shortcuts"
            aria-label="Open help guide"
          >
            ?
          </button>
        )}

        <div className="top-menu__divider" aria-hidden="true" />

        {/* Feedback / contact */}
        <a
          href="mailto:haqiqi.seraj@gmail.com?subject=Socket.IO%20Test%20Client%20Feedback"
          className="top-menu__feedback-btn"
          title="I'd love to hear from you — haqiqi.seraj@gmail.com"
          aria-label="Send feedback by email to haqiqi.seraj@gmail.com"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          <span>Feedback</span>
        </a>

        {/* Donate */}
        {onDonateClick && (
          <button
            className="top-menu__donate-btn"
            onClick={onDonateClick}
            title="Support this project with a crypto donation"
            aria-label="Open donation modal"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 21.593c-.525-.445-4.783-4.048-6.584-5.718C2.896 13.4 1 11.4 1 8.5A5.48 5.48 0 0 1 6.5 3C8.46 3 10.083 4.009 11 5.49 11.917 4.009 13.54 3 15.5 3A5.48 5.48 0 0 1 21 8.5c0 2.9-1.896 4.9-4.416 7.375C14.783 17.545 12.525 21.148 12 21.593z"/>
            </svg>
            <span>Donate</span>
          </button>
        )}

        <div className="top-menu__divider" aria-hidden="true" />

        {/* GitHub stars */}
        <a
          href="https://github.com/serajhqi/socketio-test-client"
          target="_blank"
          rel="noopener noreferrer"
          className="top-menu__stars"
          title="Star on GitHub"
          aria-label={`Star on GitHub — ${repoStars || '...'} stars`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          ★ {repoStars || '…'}
        </a>
      </div>
    </header>
  )
}
