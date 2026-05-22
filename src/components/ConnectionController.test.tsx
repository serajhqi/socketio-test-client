import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConnectionController } from './ConnectionController'
import { useStore } from '../store'
import * as socketio from '../services/socketio'

vi.mock('../services/socketio')

describe('ConnectionController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders connect button when disconnected', () => {
    useStore.setState({ status: 'disconnected' })
    render(<ConnectionController />)
    expect(screen.getByText('Connect')).toBeInTheDocument()
  })

  it('renders disconnect button when connected', () => {
    useStore.setState({ status: 'connected' })
    render(<ConnectionController />)
    expect(screen.getByText('Disconnect')).toBeInTheDocument()
  })

  it('renders connecting state', () => {
    useStore.setState({ status: 'connecting' })
    render(<ConnectionController />)
    expect(screen.getByText('Connecting...')).toBeInTheDocument()
  })

  it('renders disconnecting state', () => {
    useStore.setState({ status: 'disconnecting' })
    render(<ConnectionController />)
    expect(screen.getByText('Disconnecting...')).toBeInTheDocument()
  })

  it('button is disabled when connecting', () => {
    useStore.setState({ status: 'connecting' })
    render(<ConnectionController />)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
  })

  it('button is disabled when disconnecting', () => {
    useStore.setState({ status: 'disconnecting' })
    render(<ConnectionController />)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
  })

  it('button is enabled when connected', () => {
    useStore.setState({ status: 'connected' })
    render(<ConnectionController />)
    const btn = screen.getByRole('button')
    expect(btn).not.toBeDisabled()
  })

  it('button is enabled when disconnected', () => {
    useStore.setState({ status: 'disconnected' })
    render(<ConnectionController />)
    const btn = screen.getByRole('button')
    expect(btn).not.toBeDisabled()
  })

  it('calls toggleConnection when clicked', async () => {
    useStore.setState({ status: 'disconnected' })
    const spy = vi.spyOn(socketio, 'toggleConnection')
    const user = userEvent.setup()

    render(<ConnectionController />)
    await user.click(screen.getByRole('button'))

    expect(spy).toHaveBeenCalled()
  })

  it('has correct CSS class for connected state', () => {
    useStore.setState({ status: 'connected' })
    const { container } = render(<ConnectionController />)
    expect(container.querySelector('.btn--connected')).toBeInTheDocument()
  })

  it('has correct CSS class for disconnected state', () => {
    useStore.setState({ status: 'disconnected' })
    const { container } = render(<ConnectionController />)
    expect(container.querySelector('.btn--disconnected')).toBeInTheDocument()
  })

  it('has correct CSS class for connecting state', () => {
    useStore.setState({ status: 'connecting' })
    const { container } = render(<ConnectionController />)
    expect(container.querySelector('.btn--connecting')).toBeInTheDocument()
  })

  it('has correct CSS class for disconnecting state', () => {
    useStore.setState({ status: 'disconnecting' })
    const { container } = render(<ConnectionController />)
    expect(container.querySelector('.btn--disconnecting')).toBeInTheDocument()
  })

  it('renders indicator element', () => {
    useStore.setState({ status: 'connected' })
    const { container } = render(<ConnectionController />)
    expect(container.querySelector('.connection-btn__indicator')).toBeInTheDocument()
  })
})
