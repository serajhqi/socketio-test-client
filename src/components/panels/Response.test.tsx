import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Response } from './Response'
import { useStore } from '../../store'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}))

describe('Response', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useStore.setState({
      request: {
        emitName: '',
        note: undefined,
        body: undefined,
        response: undefined,
        duration: undefined,
      },
      connectionDetails: {
        socketId: undefined,
        transport: undefined,
        reconnectionCount: 0,
      },
    })
  })

  it('renders title', () => {
    render(<Response />)
    expect(screen.getByText('Response')).toBeInTheDocument()
  })

  it('shows empty message when no response', () => {
    render(<Response />)
    expect(
      screen.getByText(/No response yet/)
    ).toBeInTheDocument()
  })

  it('does not show copy button when no response', () => {
    render(<Response />)
    expect(screen.queryByText('Copy')).not.toBeInTheDocument()
  })

  it('shows copy button when response exists', () => {
    useStore.setState({
      request: {
        emitName: 'test',
        note: 'test',
        body: undefined,
        response: { message: 'hello' },
        duration: 100,
      },
    })
    render(<Response />)
    expect(screen.getByText('Copy')).toBeInTheDocument()
  })

  it('displays JSON response', () => {
    useStore.setState({
      request: {
        emitName: 'test',
        note: 'test',
        body: undefined,
        response: { message: 'hello', value: 42 },
        duration: 100,
      },
    })
    render(<Response />)
    expect(screen.getByText(/message/)).toBeInTheDocument()
    expect(screen.getByText(/hello/)).toBeInTheDocument()
  })

  it('displays duration', () => {
    useStore.setState({
      request: {
        emitName: 'test',
        note: 'test',
        body: undefined,
        response: {},
        duration: 250,
      },
    })
    render(<Response />)
    expect(screen.getByText(/250ms/)).toBeInTheDocument()
  })

  it('formats duration in seconds for values > 1000ms', () => {
    useStore.setState({
      request: {
        emitName: 'test',
        note: 'test',
        body: undefined,
        response: {},
        duration: 1500,
      },
    })
    render(<Response />)
    expect(screen.getByText(/1.50s/)).toBeInTheDocument()
  })

  it('displays socket ID', () => {
    useStore.setState({
      connectionDetails: {
        socketId: 'socket123456789',
        transport: 'websocket',
        reconnectionCount: 0,
      },
    })
    render(<Response />)
    expect(screen.getByText(/socket123456/)).toBeInTheDocument()
  })

  it('displays transport type', () => {
    useStore.setState({
      connectionDetails: {
        socketId: 'socket1',
        transport: 'websocket',
        reconnectionCount: 0,
      },
    })
    render(<Response />)
    expect(screen.getByText(/websocket/)).toBeInTheDocument()
  })

  it('displays reconnection count', () => {
    useStore.setState({
      connectionDetails: {
        socketId: 'socket1',
        transport: 'websocket',
        reconnectionCount: 3,
      },
    })
    render(<Response />)
    expect(screen.getByText(/3/)).toBeInTheDocument()
  })

  it('copies response to clipboard', async () => {
    const clipboardSpy = vi.spyOn(navigator.clipboard, 'writeText')
    useStore.setState({
      request: {
        emitName: 'test',
        note: 'test',
        body: undefined,
        response: { message: 'hello' },
        duration: 100,
      },
    })
    render(<Response />)
    await userEvent.click(screen.getByText('Copy'))
    expect(clipboardSpy).toHaveBeenCalled()
  })

  it('handles string responses', () => {
    useStore.setState({
      request: {
        emitName: 'test',
        note: 'test',
        body: undefined,
        response: 'Hello, World!',
        duration: 100,
      },
    })
    render(<Response />)
    expect(screen.getByText('Hello, World!')).toBeInTheDocument()
  })
})
