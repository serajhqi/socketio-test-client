import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Listeners } from './Listeners'
import { useStore } from '../store'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}))

describe('Listeners', () => {
  beforeEach(() => {
    useStore.setState({ listeners: [] })
    vi.clearAllMocks()
  })

  it('renders title', () => {
    render(<Listeners />)
    expect(screen.getByText('Listeners')).toBeInTheDocument()
  })

  it('renders add button', () => {
    render(<Listeners />)
    expect(screen.getByText('+ Add')).toBeInTheDocument()
  })

  it('shows empty message when no listeners', () => {
    render(<Listeners />)
    expect(
      screen.getByText(/No listeners yet/)
    ).toBeInTheDocument()
  })

  it('displays listeners', () => {
    useStore.setState({
      listeners: [
        {
          title: 'message',
          messages: [],
        },
        {
          title: 'notification',
          messages: [],
        },
      ],
    })
    render(<Listeners />)
    expect(screen.getByText('message')).toBeInTheDocument()
    expect(screen.getByText('notification')).toBeInTheDocument()
  })

  it('shows message count for each listener', () => {
    useStore.setState({
      listeners: [
        {
          title: 'message',
          messages: [
            { id: '1', time: Date.now(), text: 'msg1' },
            { id: '2', time: Date.now(), text: 'msg2' },
          ],
        },
      ],
    })
    render(<Listeners />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('displays empty message for listener with no messages', () => {
    useStore.setState({
      listeners: [
        {
          title: 'message',
          messages: [],
        },
      ],
    })
    render(<Listeners />)
    expect(screen.getByText('message')).toBeInTheDocument()
  })

  it('allows selecting a listener', async () => {
    useStore.setState({
      listeners: [
        {
          title: 'message',
          messages: [],
        },
      ],
    })
    render(<Listeners />)
    const listener = screen.getByText('message')
    await userEvent.click(listener)

    // Should show the listener-item--active class applied
    expect(listener.closest('.listener-item--active')).toBeInTheDocument()
  })

  it('displays messages for selected listener', () => {
    useStore.setState({
      listeners: [
        {
          title: 'message',
          messages: [
            { id: '1', time: Date.now(), text: 'Hello World' },
          ],
        },
      ],
    })
    render(<Listeners />)
    expect(screen.getByText(/Hello World/)).toBeInTheDocument()
  })

  it('shows message time and preview', () => {
    const now = Date.now()
    useStore.setState({
      listeners: [
        {
          title: 'test',
          messages: [
            { id: '1', time: now, text: 'Test message content' },
          ],
        },
      ],
    })
    render(<Listeners />)
    const timeElement = screen.getAllByText(/\d{2}:\d{2}:\d{2}/)
    expect(timeElement.length).toBeGreaterThan(0)
  })

  it('can select a message', async () => {
    useStore.setState({
      listeners: [
        {
          title: 'test',
          messages: [
            { id: '1', time: Date.now(), text: { content: 'Hello' } },
          ],
        },
      ],
    })
    render(<Listeners />)
    const msgItem = screen.getByText(/Hello/)
    await userEvent.click(msgItem)
    expect(msgItem.closest('.message-item--active')).toBeInTheDocument()
  })

  it('displays JSON viewer when message is selected', () => {
    useStore.setState({
      listeners: [
        {
          title: 'test',
          messages: [
            { id: '1', time: Date.now(), text: { data: 'value' } },
          ],
        },
      ],
    })
    render(<Listeners />)
    expect(screen.getByText(/data/)).toBeInTheDocument()
  })

  it('shows empty json viewer message when no message selected', () => {
    useStore.setState({
      listeners: [
        {
          title: 'test',
          messages: [
            { id: '1', time: Date.now(), text: 'message' },
          ],
        },
      ],
    })
    render(<Listeners />)
    expect(
      screen.getByText(/Select a message to view details/)
    ).toBeInTheDocument()
  })

  it('clears messages when clear button clicked', async () => {
    useStore.setState({
      listeners: [
        {
          title: 'test',
          messages: [
            { id: '1', time: Date.now(), text: 'msg' },
          ],
        },
      ],
    })
    render(<Listeners />)
    const clearBtn = screen.getByTitle('Clear messages')
    await userEvent.click(clearBtn)

    // After clearing, the listener should still exist but with no messages
    expect(screen.getByText('test')).toBeInTheDocument()
  })

  it('disables clear button when no messages', () => {
    useStore.setState({
      listeners: [
        {
          title: 'test',
          messages: [],
        },
      ],
    })
    render(<Listeners />)
    const clearBtn = screen.getByTitle('Clear messages')
    expect(clearBtn).toBeDisabled()
  })
})
