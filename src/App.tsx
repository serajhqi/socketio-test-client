import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import { useStore } from './store'
import { TopMenu } from './components/TopMenu'
import { ProfileSwitcher } from './components/ProfileSwitcher'
import { ExportImport } from './components/ExportImport'
import { ServerAddressModal } from './components/ServerAddressModal'
import { HelpModal } from './components/HelpModal'
import { Request } from './components/Request'
import { Response } from './components/Response'
import { Logger } from './components/Logger'
import { Listeners } from './components/Listeners'
import { History } from './components/History'
import './App.scss'

export default function App() {
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const { historyCollapsed, setHistoryCollapsed } = useStore()

  useEffect(() => {
    const address = localStorage.getItem('address')
    const options = localStorage.getItem('options')
    if (address) useStore.getState().setAddress(address)
    if (options) {
      try { useStore.getState().setOptions(JSON.parse(options)) } catch {}
    }
    fetch('https://api.github.com/repos/serajhqi/socketio-test-client')
      .then(res => res.json())
      .then(data => useStore.getState().setRepoStars(data.stargazers_count || 0))
      .catch(() => {})
  }, [])

  return (
    <div className="app">
      <TopMenu
        profileSwitcher={<ProfileSwitcher />}
        exportImport={<ExportImport />}
        onHelpClick={() => setShowHelpModal(true)}
      />

      <div className="app-body" role="main">
        {historyCollapsed ? (
          <div className="app-col app-col--history-collapsed">
            <button
              className="app-col__expand-btn"
              onClick={() => setHistoryCollapsed(false)}
              title="Show history"
              aria-label="Expand history panel"
            >
              ▶
            </button>
          </div>
        ) : (
          <div className="app-col app-col--history">
            <History onCollapse={() => setHistoryCollapsed(true)} />
          </div>
        )}

        <div className="app-col app-col--center">
          <div className="app-pane app-pane--request">
            <Request onServerClick={() => setShowAddressModal(true)} />
          </div>
          <div className="app-pane app-pane--logger">
            <Logger />
          </div>
        </div>

        <div className="app-col app-col--right">
          <div className="app-pane app-pane--response">
            <Response />
          </div>
          <div className="app-pane app-pane--listeners">
            <Listeners />
          </div>
        </div>
      </div>

      <ServerAddressModal isOpen={showAddressModal} onClose={() => setShowAddressModal(false)} />
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
      <Toaster position="bottom-right" />
    </div>
  )
}
