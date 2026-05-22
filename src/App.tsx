import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import { useStore } from './store'
import { TopMenu } from './components/TopMenu'
import { ProfileSwitcher } from './components/ProfileSwitcher'
import { ExportImport } from './components/ExportImport'
import { ConnectionController } from './components/ConnectionController'
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

  useEffect(() => {
    // Initialize from localStorage
    const address = localStorage.getItem('address')
    const options = localStorage.getItem('options')

    if (address) {
      useStore.getState().setAddress(address)
    }

    if (options) {
      try {
        useStore.getState().setOptions(JSON.parse(options))
      } catch {
        // Invalid JSON, skip
      }
    }

    // Fetch GitHub stars
    fetch('https://api.github.com/repos/serajhqi/socketio-test-client')
      .then((res) => res.json())
      .then((data) => useStore.getState().setRepoStars(data.stargazers_count || 0))
      .catch(() => {})
  }, [])

  return (
    <div className="app">
      <TopMenu
        profileSwitcher={<ProfileSwitcher />}
        exportImport={<ExportImport />}
      />

      <div className="app-container">
        <div className="app-toolbar">
          <div className="app-toolbar__left">
            <button
              className="app-toolbar__btn"
              onClick={() => setShowAddressModal(true)}
              title="Configure server address"
            >
              ⚙️ Server
            </button>
          </div>

          <div className="app-toolbar__center">
            <ConnectionController />
          </div>

          <div className="app-toolbar__right">
            <button
              className="app-toolbar__btn"
              onClick={() => setShowHelpModal(true)}
              title="Show help"
            >
              ? Help
            </button>
          </div>
        </div>

        <div className="app-main">
          <div className="app-grid">
            <div className="app-section">
              <Request />
            </div>

            <div className="app-section">
              <Response />
            </div>

            <div className="app-section">
              <Logger />
            </div>

            <div className="app-section">
              <Listeners />
            </div>
          </div>

          <History />
        </div>
      </div>

      <ServerAddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
      />

      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />

      <Toaster />
    </div>
  )
}
