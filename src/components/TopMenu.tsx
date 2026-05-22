import { useStore } from '../store'
import './TopMenu.scss'

interface TopMenuProps {
  profileSwitcher?: React.ReactNode
  exportImport?: React.ReactNode
  onHelpClick?: () => void
}

export function TopMenu({ profileSwitcher, exportImport, onHelpClick }: TopMenuProps) {
  const { repoStars, appVersion } = useStore()

  return (
    <header className="top-menu">
      <div className="top-menu__left">
        <svg className="top-menu__logo" width="30" height="30" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
          <path d="M96.447 7.382c32.267-8.275 67.929-3.453 96.386 14.11 35.84 21.433 59.238 61.976 59.833 103.71 1.31 42.15-20.659 83.944-55.963 106.865-39.293 26.433-93.648 27.446-133.775 2.322-40.9-24.41-64.774-73.645-58.641-120.916 4.94-49.95 43.52-94.005 92.16-106.09z" fill="#111"/>
          <path d="M91.505 27.803c60.964-24.41 135.74 20.658 142.05 86.028 9.824 58.82-38.995 118.593-98.59 120.32-56.677 5.656-111.449-42.39-113.056-99.304-4.227-46.08 26.136-91.803 69.596-107.044z" fill="#fff"/>
          <path d="M97.637 121.69c27.327-22.326 54.058-45.426 81.98-67.097-14.646 22.505-29.708 44.711-44.354 67.215-12.562.06-25.123.06-37.626-.119zM120.737 134.132c12.621 0 25.183 0 37.745.179-27.505 22.206-54.117 45.484-82.099 67.096 14.646-22.505 29.708-44.77 44.354-67.275z" fill="#111"/>
        </svg>
        <h1 className="top-menu__title">
          <span className="top-menu__title-brand">Socket.IO</span>
          <span className="top-menu__title-sub"> Test Client</span>
        </h1>
        {appVersion && <span className="top-menu__version">v{appVersion}</span>}
      </div>

      <div className="top-menu__center">
        {profileSwitcher && <div className="top-menu__slot">{profileSwitcher}</div>}
        {exportImport && <div className="top-menu__slot">{exportImport}</div>}
      </div>

      <div className="top-menu__right">
        {onHelpClick && (
          <button className="top-menu__help-btn" onClick={onHelpClick} title="Help & contributors">
            ?
          </button>
        )}
        <a
          href="https://github.com/serajhqi/socketio-test-client"
          target="_blank"
          rel="noopener noreferrer"
          className="top-menu__stars"
          title="Star on GitHub"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" style={{ fill: 'currentColor', marginRight: '5px' }}>
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          ★ {repoStars || '…'}
        </a>
      </div>
    </header>
  )
}
