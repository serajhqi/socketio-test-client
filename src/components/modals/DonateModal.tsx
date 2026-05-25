import { useState, useCallback } from 'react'
import './DonateModal.scss'

interface DonateModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Token {
  symbol: string
  color: string
}

interface Network {
  id: string
  name: string
  color: string
  address: string
  qr: string
  tokens: Token[]
  warning?: string
}

const NETWORKS: Network[] = [
  {
    id: 'trc20',
    name: 'TRC-20',
    color: '#ef0027',
    address: 'TWtfL74KCjAWCnD7gsj83J2pS9yzbAeqHu',
    qr: '/qr/usdt-trc20.svg',
    tokens: [
      { symbol: 'TRX', color: '#ef0027' },
      { symbol: 'USDT', color: '#26a17b' },
    ],
    warning: 'Only send TRX or USDT on TRC-20 to this address',
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    color: '#f7931a',
    address: 'bc1q5mmtmpqkf8lm4zyph93l7rny6hae6vyfkmaznp',
    qr: '/qr/btc.svg',
    tokens: [
      { symbol: 'BTC', color: '#f7931a' },
    ],
  },
  {
    id: 'solana',
    name: 'Solana',
    color: '#9945ff',
    address: '6BLjWH3x3Hgr5Qiu5W7C25ZcMryEqms17AS9t7YgYyNF',
    qr: '/qr/sol.svg',
    tokens: [
      { symbol: 'SOL', color: '#9945ff' },
    ],
  },
  {
    id: 'ethereum',
    name: 'ERC-20',
    color: '#627eea',
    address: '0x1F7150eE6bb33ff66e43bd2Ce122f43C83f0cf2C',
    qr: '/qr/eth.svg',
    tokens: [
      { symbol: 'ETH', color: '#627eea' },
      { symbol: 'USDT', color: '#26a17b' },
      { symbol: 'MATIC', color: '#8247e5' },
    ],
    warning: 'Works on Ethereum mainnet and Polygon — verify your network before sending',
  },
]

export function DonateModal({ isOpen, onClose }: DonateModalProps) {
  const [selectedId, setSelectedId] = useState('trc20')
  const [copied, setCopied] = useState(false)

  const network = NETWORKS.find((n) => n.id === selectedId) ?? NETWORKS[0]

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(network.address).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [network.address])

  const handleSelect = (id: string) => {
    setSelectedId(id)
    setCopied(false)
  }

  const handleBackdrop = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose],
  )

  if (!isOpen) return null

  return (
    <div
      className="donate-modal__backdrop"
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Donate to support this project"
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div className="donate-modal">
        <div className="donate-modal__header">
          <h2 className="donate-modal__title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 21.593c-.525-.445-4.783-4.048-6.584-5.718C2.896 13.4 1 11.4 1 8.5A5.48 5.48 0 0 1 6.5 3C8.46 3 10.083 4.009 11 5.49 11.917 4.009 13.54 3 15.5 3A5.48 5.48 0 0 1 21 8.5c0 2.9-1.896 4.9-4.416 7.375C14.783 17.545 12.525 21.148 12 21.593z"/>
            </svg>
            Support This Project
          </h2>
          <button className="donate-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <p className="donate-modal__intro">
          If this tool saves you time, a small crypto donation keeps development going.
        </p>

        {/* Network tabs */}
        <div className="donate-modal__tabs" role="tablist" aria-label="Select network">
          {NETWORKS.map((n) => (
            <button
              key={n.id}
              className={`donate-modal__tab${selectedId === n.id ? ' donate-modal__tab--active' : ''}`}
              style={{ '--net-color': n.color } as React.CSSProperties}
              onClick={() => handleSelect(n.id)}
              role="tab"
              aria-selected={selectedId === n.id}
            >
              <span className="donate-modal__tab-dot" />
              {n.name}
            </button>
          ))}
        </div>

        {/* QR + accepted tokens */}
        <div className="donate-modal__body">
          <div className="donate-modal__qr-wrap">
            <img
              src={network.qr}
              alt={`QR code for ${network.name} address`}
              width={180}
              height={180}
            />
          </div>

          <div className="donate-modal__tokens">
            <span className="donate-modal__tokens-label">Accepts</span>
            <div className="donate-modal__token-list">
              {network.tokens.map((t) => (
                <span
                  key={t.symbol}
                  className="donate-modal__token"
                  style={{ '--token-color': t.color } as React.CSSProperties}
                >
                  {t.symbol}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="donate-modal__address-row">
          <span className="donate-modal__address" title={network.address}>
            {network.address}
          </span>
          <button
            className={`donate-modal__copy${copied ? ' donate-modal__copy--done' : ''}`}
            onClick={handleCopy}
            aria-label={copied ? 'Copied!' : `Copy ${network.name} address`}
            title={copied ? 'Copied!' : 'Copy address'}
          >
            {copied ? '✓' : '⎘'}
          </button>
        </div>

        {/* Warning — always rendered to prevent layout shift */}
        <p className={`donate-modal__warning${network.warning ? '' : ' donate-modal__warning--hidden'}`} aria-hidden={!network.warning}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2L1 21h22L12 2zm0 3.5L20.5 19h-17L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
          </svg>
          {network.warning ?? ' '}
        </p>
      </div>
    </div>
  )
}
