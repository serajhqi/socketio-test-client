import { useStore } from '../store'
import { toggleConnection } from '../services/socketio'
import './ConnectionController.scss'

interface ConnectionControllerProps {
  onServerClick?: () => void
}

export function ConnectionController({ onServerClick }: ConnectionControllerProps) {
  const { address, status } = useStore()

  const isConnected = status === 'connected'
  const isTransitioning = status === 'connecting' || status === 'disconnecting'

  const serverLabel = address
    ? address.replace(/^https?:\/\//, '')
    : null

  return (
    <div className="connection-controller">
      <button
        className={`connection-controller__server ${!address ? 'connection-controller__server--empty' : ''}`}
        onClick={onServerClick}
        title={address ? `Server: ${address} — click to change` : 'Click to set server URL'}
        aria-label={address ? `Server: ${address}. Click to change.` : 'No server set. Click to configure server URL.'}
      >
        {serverLabel ? (
          <span className="connection-controller__server-url">{serverLabel}</span>
        ) : (
          <span className="connection-controller__server-placeholder">set server</span>
        )}
        <span className="connection-controller__server-edit">✎</span>
      </button>

      <button
        className={`connection-controller__connect connection-controller__connect--${status}`}
        onClick={toggleConnection}
        disabled={isTransitioning}
        title={
          isTransitioning
            ? status
            : isConnected
            ? 'Connected — click to disconnect'
            : 'Disconnected — click to connect'
        }
        aria-label={
          isTransitioning
            ? `Connection status: ${status}`
            : isConnected
            ? 'Connected. Click to disconnect.'
            : 'Disconnected. Click to connect.'
        }
      >
        <span className="connection-controller__connect-dot" />
      </button>
    </div>
  )
}
