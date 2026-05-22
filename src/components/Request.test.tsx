import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Request } from './Request'
import { useStore } from '../store'
import * as socketio from '../services/socketio'

vi.mock('../services/socketio')
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('Request', () => {
  beforeEach(() => {
    useStore.setState({
      request: { emitName: '', title: '', body: '', response: undefined },
      status: 'connected',
    })
    vi.clearAllMocks()
  })

  it('renders title', () => {
    render(<Request />)
    expect(screen.getByText('Send Request')).toBeInTheDocument()
  })

  it('renders event name input', () => {
    render(<Request />)
    expect(screen.getByPlaceholderText(/message, user:update/)).toBeInTheDocument()
  })

  it('renders title input', () => {
    render(<Request />)
    expect(screen.getByPlaceholderText(/Description for history/)).toBeInTheDocument()
  })

  it('renders body textarea', () => {
    render(<Request />)
    expect(screen.getByPlaceholderText(/message/)).toBeInTheDocument()
  })

  it('renders send button', () => {
    render(<Request />)
    expect(screen.getByText('Send')).toBeInTheDocument()
  })

  it('send button is disabled when disconnected', () => {
    useStore.setState({ status: 'disconnected' })
    render(<Request />)
    expect(screen.getByText('Send')).toBeDisabled()
  })

  it('send button is enabled when connected', () => {
    useStore.setState({ status: 'connected' })
    render(<Request />)
    expect(screen.getByText('Send')).not.toBeDisabled()
  })

  it('shows error when event name is empty', async () => {
    render(<Request />)
    const sendBtn = screen.getByText('Send')
    await userEvent.click(sendBtn)
    expect(screen.getByText('Event name is required')).toBeInTheDocument()
  })

  it('shows error on invalid JSON body', async () => {
    render(<Request />)
    const input = screen.getByPlaceholderText(
      /message, user:update/
    ) as HTMLInputElement
    const textarea = screen.getByPlaceholderText(/message/) as HTMLTextAreaElement

    await userEvent.type(input, 'test-event')
    await userEvent.type(textarea, 'invalid json')
    await userEvent.click(screen.getByText('Send'))

    expect(screen.getByText('Invalid JSON in body')).toBeInTheDocument()
  })

  it('clears error on input change', async () => {
    render(<Request />)
    const sendBtn = screen.getByText('Send')
    await userEvent.click(sendBtn)
    expect(screen.getByText('Event name is required')).toBeInTheDocument()

    const input = screen.getByPlaceholderText(/message, user:update/) as HTMLInputElement
    await userEvent.type(input, 'test')

    expect(screen.queryByText('Event name is required')).not.toBeInTheDocument()
  })

  it('populates fields from store', () => {
    useStore.setState({
      request: {
        emitName: 'test-event',
        title: 'Test Title',
        body: '{"key": "value"}',
        response: undefined,
      },
    })
    render(<Request />)
    expect(screen.getByDisplayValue('test-event')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Title')).toBeInTheDocument()
  })

  it('sends request on Ctrl+Enter', async () => {
    const spy = vi.spyOn(socketio, 'sendRequest')
    render(<Request />)
    const input = screen.getByPlaceholderText(
      /message, user:update/
    ) as HTMLInputElement

    await userEvent.type(input, 'test-event')
    await userEvent.keyboard('{Control>}{Enter}{/Control}')

    expect(spy).toHaveBeenCalled()
  })

  it('sends request on Cmd+Enter (Mac)', async () => {
    const spy = vi.spyOn(socketio, 'sendRequest')
    render(<Request />)
    const input = screen.getByPlaceholderText(
      /message, user:update/
    ) as HTMLInputElement

    await userEvent.type(input, 'test-event')
    await userEvent.keyboard('{Meta>}{Enter}{/Meta}')

    expect(spy).toHaveBeenCalled()
  })

  it('shows error when not connected', async () => {
    useStore.setState({ status: 'disconnected' })
    render(<Request />)
    const input = screen.getByPlaceholderText(
      /message, user:update/
    ) as HTMLInputElement

    await userEvent.type(input, 'test-event')
    const sendBtn = screen.getByText('Send') as HTMLButtonElement

    expect(sendBtn).toBeDisabled()
  })
})
