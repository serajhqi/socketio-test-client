import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Logger } from './Logger'
import { useStore } from '../../store'

describe('Logger', () => {
  beforeEach(() => {
    useStore.setState({ logs: [] })
    vi.clearAllMocks()
  })

  it('renders title', () => {
    render(<Logger />)
    expect(screen.getByText('Log')).toBeInTheDocument()
  })

  it('renders clear button', () => {
    render(<Logger />)
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })

  it('shows empty message when no logs', () => {
    render(<Logger />)
    expect(
      screen.getByText(/No logs yet/)
    ).toBeInTheDocument()
  })

  it('disables clear button when no logs', () => {
    render(<Logger />)
    expect(screen.getByText('Clear')).toBeDisabled()
  })

  it('enables clear button when logs exist', () => {
    useStore.setState({
      logs: [
        {
          id: '1',
          time: Date.now(),
          message: 'Test message',
        },
      ],
    })
    render(<Logger />)
    expect(screen.getByText('Clear')).not.toBeDisabled()
  })

  it('displays logs', () => {
    useStore.setState({
      logs: [
        {
          id: '1',
          time: Date.now(),
          message: 'Test message 1',
        },
        {
          id: '2',
          time: Date.now(),
          message: 'Test message 2',
        },
      ],
    })
    render(<Logger />)
    expect(screen.getByText('Test message 1')).toBeInTheDocument()
    expect(screen.getByText('Test message 2')).toBeInTheDocument()
  })

  it('shows log count', () => {
    useStore.setState({
      logs: [
        { id: '1', time: Date.now(), message: 'Test' },
        { id: '2', time: Date.now(), message: 'Test' },
        { id: '3', time: Date.now(), message: 'Test' },
      ],
    })
    render(<Logger />)
    expect(screen.getByText('3 entries')).toBeInTheDocument()
  })

  it('clears logs when clear button clicked', async () => {
    const store = useStore.getState()
    store.appendLog('Test message')

    render(<Logger />)
    expect(screen.getByText(/Test message/)).toBeInTheDocument()

    await userEvent.click(screen.getByText('Clear'))
    expect(screen.getByText(/No logs yet/)).toBeInTheDocument()
  })

  it('displays timestamps', () => {
    const now = Date.now()
    useStore.setState({
      logs: [
        {
          id: '1',
          time: now,
          message: 'Test message',
        },
      ],
    })
    render(<Logger />)
    const timeElements = screen.getAllByText(/\d{2}:\d{2}:\d{2}/)
    expect(timeElements.length).toBeGreaterThan(0)
  })

  it('renders log entries with time and message', () => {
    const now = Date.now()
    useStore.setState({
      logs: [
        {
          id: '1',
          time: now,
          message: 'Connection established',
        },
      ],
    })
    render(<Logger />)
    expect(screen.getByText(/Connection established/)).toBeInTheDocument()
  })

  it('shows entry count in footer', () => {
    useStore.setState({
      logs: [
        { id: '1', time: Date.now(), message: 'Log 1' },
        { id: '2', time: Date.now(), message: 'Log 2' },
      ],
    })
    render(<Logger />)
    expect(screen.getByText('2 entries')).toBeInTheDocument()
  })
})
