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
        <h1 className="top-menu__title">Socket.IO Test Client</h1>
        {appVersion && <span className="top-menu__version">{appVersion}</span>}
      </div>

      <div className="top-menu__center">
        {profileSwitcher && <div className="top-menu__slot">{profileSwitcher}</div>}
        {exportImport && <div className="top-menu__slot">{exportImport}</div>}
      </div>

      <div className="top-menu__right">
        {onHelpClick && (
          <button className="top-menu__help-btn" onClick={onHelpClick} title="Help">
            ?
          </button>
        )}
        <a
          href="https://github.com/serajhqi/socketio-test-client"
          target="_blank"
          rel="noopener noreferrer"
          className="top-menu__stars"
          title={`${repoStars} stars on GitHub`}
        >
          ★ {repoStars || '...'}
        </a>
      </div>
    </header>
  )
}
