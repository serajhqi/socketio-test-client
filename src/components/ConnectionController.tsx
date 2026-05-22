import { useStore } from '../store'
import { toggleConnection } from '../services/socketio'
import './ConnectionController.scss'

const STATUS_CONFIG = {
  connected: { label: 'Disconnect', className: 'btn--connected', disabled: false },
  disconnected: {
    label: 'Connect',
    className: 'btn--disconnected',
    disabled: false,
  },
  connecting: { label: 'Connecting...', className: 'btn--connecting', disabled: true },
  disconnecting: {
    label: 'Disconnecting...',
    className: 'btn--disconnecting',
    disabled: true,
  },
}

export function ConnectionController() {
  const { status } = useStore()
  const config = STATUS_CONFIG[status]

  return (
    <button
      className={`connection-btn ${config.className}`}
      onClick={toggleConnection}
      disabled={config.disabled}
      aria-label={`Connection status: ${status}`}
    >
      <span className="connection-btn__indicator"></span>
      {config.label}
    </button>
  )
}
