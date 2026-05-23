import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ServerAddressModal } from './ServerAddressModal'
import { useStore } from '../../store'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('ServerAddressModal', () => {
  beforeEach(() => {
    useStore.setState({ address: '', options: {} })
  })

  it('does not render when closed', () => {
    const { container } = render(
      <ServerAddressModal isOpen={false} onClose={() => {}} />
    )
    expect(container.firstChild).toBeEmptyDOMNode()
  })

  it('renders when open', () => {
    render(<ServerAddressModal isOpen={true} onClose={() => {}} />)
    expect(screen.getByText('Server Settings')).toBeInTheDocument()
  })

  it('renders address input field', () => {
    render(<ServerAddressModal isOpen={true} onClose={() => {}} />)
    expect(screen.getByPlaceholderText(/localhost:3000/)).toBeInTheDocument()
  })

  it('renders options textarea', () => {
    render(<ServerAddressModal isOpen={true} onClose={() => {}} />)
    expect(screen.getByPlaceholderText(/reconnection/)).toBeInTheDocument()
  })

  it('renders save button', () => {
    render(<ServerAddressModal isOpen={true} onClose={() => {}} />)
    expect(screen.getByText('Save')).toBeInTheDocument()
  })

  it('renders cancel button', () => {
    render(<ServerAddressModal isOpen={true} onClose={() => {}} />)
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('renders clear button', () => {
    render(<ServerAddressModal isOpen={true} onClose={() => {}} />)
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })

  it('shows error when address is empty', async () => {
    render(<ServerAddressModal isOpen={true} onClose={() => {}} />)
    const input = screen.getByPlaceholderText(/localhost:3000/) as HTMLInputElement
    const saveBtn = screen.getByText('Save')

    await userEvent.clear(input)
    await userEvent.click(saveBtn)

    expect(screen.getByText('Server address is required')).toBeInTheDocument()
  })

  it('shows error on invalid JSON', async () => {
    render(<ServerAddressModal isOpen={true} onClose={() => {}} />)
    const textarea = screen.getByPlaceholderText(/reconnection/) as HTMLTextAreaElement
    const saveBtn = screen.getByText('Save')

    await userEvent.clear(textarea)
    await userEvent.type(textarea, 'invalid json')
    await userEvent.click(saveBtn)

    expect(screen.getByText('Invalid JSON in options')).toBeInTheDocument()
  })

  it('calls onClose when cancel clicked', async () => {
    const onClose = vi.fn()
    render(<ServerAddressModal isOpen={true} onClose={onClose} />)
    await userEvent.click(screen.getByText('Cancel'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when overlay clicked', async () => {
    const onClose = vi.fn()
    const { container } = render(
      <ServerAddressModal isOpen={true} onClose={onClose} />
    )
    const overlay = container.querySelector('.modal-overlay') as HTMLElement
    await userEvent.click(overlay)
    expect(onClose).toHaveBeenCalled()
  })

  it('does not close when modal clicked', async () => {
    const onClose = vi.fn()
    const { container } = render(
      <ServerAddressModal isOpen={true} onClose={onClose} />
    )
    const modal = container.querySelector('.modal') as HTMLElement
    await userEvent.click(modal)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('populates fields from store', () => {
    useStore.setState({ address: 'http://example.com', options: { test: true } })
    render(<ServerAddressModal isOpen={true} onClose={() => {}} />)
    const input = screen.getByDisplayValue('http://example.com')
    expect(input).toBeInTheDocument()
  })

  it('renders close button', () => {
    const { container } = render(
      <ServerAddressModal isOpen={true} onClose={() => {}} />
    )
    expect(container.querySelector('.modal__close')).toBeInTheDocument()
  })
})
