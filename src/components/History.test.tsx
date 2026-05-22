import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { History } from './History'
import { useStore } from '../store'

describe('History', () => {
  beforeEach(() => {
    useStore.setState({
      requestHistory: [],
      historyCollapsed: false,
    })
  })

  it('renders history toggle button', () => {
    render(<History />)
    expect(screen.getByText('History')).toBeInTheDocument()
  })

  it('shows empty message when no history', () => {
    render(<History />)
    expect(
      screen.getByText(/No history yet/)
    ).toBeInTheDocument()
  })

  it('displays request count badge', () => {
    useStore.setState({
      requestHistory: [
        { title: 'test1', emitName: 'event1', body: '', response: undefined },
        { title: 'test2', emitName: 'event2', body: '', response: undefined },
      ],
    })
    render(<History />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('displays request history items', () => {
    useStore.setState({
      requestHistory: [
        { title: 'Get User', emitName: 'user:fetch', body: '', response: undefined },
        { title: 'Post Message', emitName: 'message:send', body: '', response: undefined },
      ],
    })
    render(<History />)
    expect(screen.getByText('Get User')).toBeInTheDocument()
    expect(screen.getByText('Post Message')).toBeInTheDocument()
  })

  it('displays event names for each item', () => {
    useStore.setState({
      requestHistory: [
        { title: 'test', emitName: 'custom:event', body: '', response: undefined },
      ],
    })
    render(<History />)
    expect(screen.getByText('custom:event')).toBeInTheDocument()
  })

  it('can collapse history', async () => {
    useStore.setState({
      requestHistory: [
        { title: 'test', emitName: 'event', body: '', response: undefined },
      ],
      historyCollapsed: false,
    })
    render(<History />)

    const toggleBtn = screen.getByTitle('Collapse history')
    await userEvent.click(toggleBtn)

    useStore.setState({ historyCollapsed: true })
  })

  it('can expand collapsed history', async () => {
    useStore.setState({
      requestHistory: [
        { title: 'test', emitName: 'event', body: '', response: undefined },
      ],
      historyCollapsed: true,
    })
    render(<History />)

    const toggleBtn = screen.getByTitle('Expand history')
    await userEvent.click(toggleBtn)

    useStore.setState({ historyCollapsed: false })
  })

  it('filters history by search term', async () => {
    useStore.setState({
      requestHistory: [
        { title: 'Get User', emitName: 'user:fetch', body: '', response: undefined },
        { title: 'Post Message', emitName: 'message:send', body: '', response: undefined },
      ],
    })
    render(<History />)

    const searchInput = screen.getByPlaceholderText('Search requests...')
    await userEvent.type(searchInput, 'User')

    expect(screen.getByText('Get User')).toBeInTheDocument()
    expect(screen.queryByText('Post Message')).not.toBeInTheDocument()
  })

  it('shows no matching message when search has no results', async () => {
    useStore.setState({
      requestHistory: [
        { title: 'test', emitName: 'event', body: '', response: undefined },
      ],
    })
    render(<History />)

    const searchInput = screen.getByPlaceholderText('Search requests...')
    await userEvent.type(searchInput, 'nonexistent')

    expect(screen.getByText(/No matching requests/)).toBeInTheDocument()
  })

  it('can open a request from history', async () => {
    const spy = vi.spyOn(useStore.getState(), 'setRequest')
    useStore.setState({
      requestHistory: [
        { title: 'test', emitName: 'event', body: '{"key": "value"}', response: undefined },
      ],
    })
    render(<History />)

    const button = screen.getByTitle('Open request')
    await userEvent.click(button)

    expect(spy).toHaveBeenCalled()
  })

  it('can remove a request from history', async () => {
    const spy = vi.spyOn(useStore.getState(), 'removeFromHistory')
    useStore.setState({
      requestHistory: [
        { title: 'test', emitName: 'event', body: '', response: undefined },
      ],
    })
    render(<History />)

    const removeBtn = screen.getByTitle('Remove')
    await userEvent.click(removeBtn)

    expect(spy).toHaveBeenCalled()
  })

  it('respects historyCollapsed state', () => {
    useStore.setState({
      requestHistory: [
        { title: 'test', emitName: 'event', body: '', response: undefined },
      ],
      historyCollapsed: true,
    })
    const { rerender } = render(<History />)

    expect(screen.queryByPlaceholderText('Search requests...')).not.toBeInTheDocument()

    useStore.setState({ historyCollapsed: false })
    rerender(<History />)

    expect(screen.getByPlaceholderText('Search requests...')).toBeInTheDocument()
  })

  it('search is case-insensitive', async () => {
    useStore.setState({
      requestHistory: [
        { title: 'Get User', emitName: 'user:fetch', body: '', response: undefined },
      ],
    })
    render(<History />)

    const searchInput = screen.getByPlaceholderText('Search requests...')
    await userEvent.type(searchInput, 'user')

    expect(screen.getByText('Get User')).toBeInTheDocument()
  })
})
