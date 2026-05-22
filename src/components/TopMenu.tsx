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
          <svg width="13" height="13" viewBox="0 0 24 24" style={{ fill: 'currentColor', marginRight: '4px' }}>
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.416 3.966 1.48-8.279-6.064-5.827 8.332-1.15z"/>
          </svg>
          {repoStars || '…'}
        </a>
      </div>
    </header>
  )
}
