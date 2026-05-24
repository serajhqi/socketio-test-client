import { useState, useCallback } from 'react'
import './DonateModal.scss'

interface DonateModalProps {
  isOpen: boolean
  onClose: () => void
}

interface CryptoOption {
  id: string
  label: string
  symbol: string
  network: string
  address: string
  color: string
}

const CRYPTOS: CryptoOption[] = [
  {
    id: 'usdt-trc20',
    label: 'USDT',
    symbol: '₮',
    network: 'TRC-20',
    address: 'TWtfL74KCjAWCnD7gsj83J2pS9yzbAeqHu',
    color: '#26a17b',
  },
  {
    id: 'btc',
    label: 'BTC',
    symbol: '₿',
    network: 'Bitcoin',
    address: 'bc1q5mmtmpqkf8lm4zyph93l7rny6hae6vyfkmaznp',
    color: '#f7931a',
  },
  {
    id: 'sol',
    label: 'SOL',
    symbol: '◎',
    network: 'Solana',
    address: '6BLjWH3x3Hgr5Qiu5W7C25ZcMryEqms17AS9t7YgYyNF',
    color: '#9945ff',
  },
  {
    id: 'eth',
    label: 'ETH',
    symbol: 'Ξ',
    network: 'ERC-20 / Polygon',
    address: '0x1F7150eE6bb33ff66e43bd2Ce122f43C83f0cf2C',
    color: '#627eea',
  },
]

export function DonateModal({ isOpen, onClose }: DonateModalProps) {
  const [selectedId, setSelectedId] = useState('usdt-trc20')
  const [copied, setCopied] = useState(false)

  const selected = CRYPTOS.find((c) => c.id === selectedId) ?? CRYPTOS[0]

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(selected.address).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [selected.address])

  const handleBackdrop = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  if (!isOpen) return null

  const isPlaceholder = selected.address.startsWith('YOUR_')

  return (
    <div
      className="donate-modal__backdrop"
      onClick={handleBackdrop}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Donate to support this project"
    >
      <div className="donate-modal">
        <div className="donate-modal__header">
          <h2 className="donate-modal__title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 21.593c-.525-.445-4.783-4.048-6.584-5.718C2.896 13.4 1 11.4 1 8.5A5.48 5.48 0 0 1 6.5 3C8.46 3 10.083 4.009 11 5.49 11.917 4.009 13.54 3 15.5 3A5.48 5.48 0 0 1 21 8.5c0 2.9-1.896 4.9-4.416 7.375C14.783 17.545 12.525 21.148 12 21.593z"/>
            </svg>
            Support This Project
          </h2>
          <button
            className="donate-modal__close"
            onClick={onClose}
            aria-label="Close donation modal"
          >
            ✕
          </button>
        </div>

        <p className="donate-modal__intro">
          If this tool saves you time, a small crypto donation keeps development going.
        </p>

        {/* Crypto selector */}
        <div className="donate-modal__selector" role="group" aria-label="Select cryptocurrency">
          {CRYPTOS.map((crypto) => (
            <button
              key={crypto.id}
              className={`donate-modal__crypto-btn${selectedId === crypto.id ? ' donate-modal__crypto-btn--active' : ''}`}
              style={{ '--crypto-color': crypto.color } as React.CSSProperties}
              onClick={() => { setSelectedId(crypto.id); setCopied(false) }}
              aria-pressed={selectedId === crypto.id}
            >
              <span className="donate-modal__crypto-symbol">{crypto.symbol}</span>
              <span className="donate-modal__crypto-label">{crypto.label}</span>
              <span className="donate-modal__crypto-network">{crypto.network}</span>
            </button>
          ))}
        </div>

        {/* QR code area */}
        <div className="donate-modal__qr-area">
          {isPlaceholder ? (
            <div className="donate-modal__qr-placeholder">
              <span>Address not configured yet</span>
            </div>
          ) : (
            <div className="donate-modal__qr-wrap">
              <img
                src={`/qr/${selected.id}.svg`}
                alt={`QR code for ${selected.label} ${selected.network} address`}
                width={180}
                height={180}
              />
            </div>
          )}
        </div>

        {/* Address */}
        <div className="donate-modal__address-row">
          {isPlaceholder ? (
            <span className="donate-modal__address donate-modal__address--placeholder">
              Coming soon
            </span>
          ) : (
            <>
              <span className="donate-modal__address" title={selected.address}>
                {selected.address}
              </span>
              <button
                className={`donate-modal__copy${copied ? ' donate-modal__copy--done' : ''}`}
                onClick={handleCopy}
                aria-label={copied ? 'Copied!' : `Copy ${selected.label} address`}
                title={copied ? 'Copied!' : 'Copy address'}
              >
                {copied ? '✓' : '⎘'}
              </button>
            </>
          )}
        </div>

        <p className="donate-modal__network-note">
          Network: <strong>{selected.network}</strong>
          {selected.id === 'usdt-trc20' && (
            <span className="donate-modal__warning"> — send only USDT on TRC-20</span>
          )}
        </p>
      </div>
    </div>
  )
}
