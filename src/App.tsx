import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import { useStore } from './store'
import { TopMenu } from './components/layout/TopMenu'
import { ServerAddressModal } from './components/modals/ServerAddressModal'
import { HelpModal } from './components/modals/HelpModal'
import { DonateModal } from './components/modals/DonateModal'
import { Request } from './components/panels/Request'
import { Response } from './components/panels/Response'
import { Logger } from './components/panels/Logger'
import { Listeners } from './components/panels/Listeners'
import { History } from './components/panels/History'
import './App.scss'

export default function App() {
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showDonateModal, setShowDonateModal] = useState(false)
  const { historyCollapsed, setHistoryCollapsed } = useStore()

  useEffect(() => {
    fetch('https://api.github.com/repos/serajhqi/socketio-test-client')
      .then(res => res.json())
      .then(data => useStore.getState().setRepoStars(data.stargazers_count || 0))
      .catch(() => {})
  }, [])

  useEffect(() => {
    return useStore.subscribe((state, prev) => {
      if (!state.activeProfileId) return
      if (state.activeProfileId !== prev.activeProfileId) return
      const changed =
        state.address !== prev.address ||
        state.options !== prev.options ||
        state.requestHistory !== prev.requestHistory ||
        state.listeners !== prev.listeners
      if (!changed) return
      useStore.setState({
        profiles: state.profiles.map(p =>
          p.id === state.activeProfileId
            ? { ...p, address: state.address ?? '', options: state.options, requestHistory: state.requestHistory, listeners: state.listeners }
            : p
        ),
      })
    })
  }, [])

  return (
    <div className="app">
      <TopMenu onHelpClick={() => setShowHelpModal(true)} onDonateClick={() => setShowDonateModal(true)} onServerClick={() => setShowAddressModal(true)} />

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
            <Request />
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
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} onDonateClick={() => { setShowHelpModal(false); setShowDonateModal(true) }} />
      <DonateModal isOpen={showDonateModal} onClose={() => setShowDonateModal(false)} />
      <Toaster position="bottom-right" />
    </div>
  )
}
