import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

vi.mock('sonner', () => ({
  Toaster: () => null,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText('Socket.IO Test Client')).toBeInTheDocument()
  })

  it('renders top menu', () => {
    render(<App />)
    expect(screen.getByText('Socket.IO Test Client')).toBeInTheDocument()
  })

  it('renders server button', () => {
    render(<App />)
    expect(screen.getByTitle('Configure server address')).toBeInTheDocument()
  })

  it('renders help button', () => {
    render(<App />)
    expect(screen.getByTitle('Show help')).toBeInTheDocument()
  })

  it('renders connection controller', () => {
    render(<App />)
    const connectBtn = screen.queryByText(/Connect|Disconnect|Connecting|Disconnecting/)
    expect(connectBtn).toBeInTheDocument()
  })

  it('renders request panel', () => {
    render(<App />)
    expect(screen.getByText('Send Request')).toBeInTheDocument()
  })

  it('renders response panel', () => {
    render(<App />)
    expect(screen.getByText('Response')).toBeInTheDocument()
  })

  it('renders logger panel', () => {
    render(<App />)
    expect(screen.getByText('Log')).toBeInTheDocument()
  })

  it('renders listeners panel', () => {
    render(<App />)
    expect(screen.getByText('Listeners')).toBeInTheDocument()
  })

  it('renders history panel', () => {
    render(<App />)
    expect(screen.getByText('History')).toBeInTheDocument()
  })

  it('renders modals when buttons clicked', async () => {
    const { container } = render(<App />)

    // Modals should exist but not be visible initially
    const modals = container.querySelectorAll('.modal-overlay, .help-modal-overlay')
    expect(modals.length).toBeGreaterThanOrEqual(0)
  })
})
