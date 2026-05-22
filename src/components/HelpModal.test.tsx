import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HelpModal } from './HelpModal'

vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          login: 'user1',
          avatar_url: 'https://example.com/avatar1.jpg',
          html_url: 'https://github.com/user1',
          contributions: 10,
        },
      ]),
  })
))

describe('HelpModal', () => {
  it('does not render when closed', () => {
    const { container } = render(
      <HelpModal isOpen={false} onClose={() => {}} />
    )
    expect(container.firstChild).toBeEmptyDOMNode()
  })

  it('renders when open', () => {
    render(<HelpModal isOpen={true} onClose={() => {}} />)
    expect(screen.getByText('About Socket.IO Test Client')).toBeInTheDocument()
  })

  it('renders title and sections', () => {
    render(<HelpModal isOpen={true} onClose={() => {}} />)
    expect(screen.getByText('Project')).toBeInTheDocument()
    expect(screen.getByText('Contributors')).toBeInTheDocument()
    expect(screen.getByText('Resources')).toBeInTheDocument()
  })

  it('renders close button', () => {
    const { container } = render(
      <HelpModal isOpen={true} onClose={() => {}} />
    )
    const closeBtn = container.querySelector('.help-modal__close')
    expect(closeBtn).toBeInTheDocument()
  })

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn()
    const { container } = render(
      <HelpModal isOpen={true} onClose={onClose} />
    )
    const closeBtn = container.querySelector('.help-modal__close') as HTMLElement
    closeBtn.click()
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when overlay clicked', () => {
    const onClose = vi.fn()
    const { container } = render(
      <HelpModal isOpen={true} onClose={onClose} />
    )
    const overlay = container.querySelector(
      '.help-modal-overlay'
    ) as HTMLElement
    overlay.click()
    expect(onClose).toHaveBeenCalled()
  })

  it('does not close when modal content clicked', () => {
    const onClose = vi.fn()
    const { container } = render(
      <HelpModal isOpen={true} onClose={onClose} />
    )
    const modal = container.querySelector('.help-modal') as HTMLElement
    modal.click()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('renders GitHub and Socket.IO links', async () => {
    render(<HelpModal isOpen={true} onClose={() => {}} />)
    const links = screen.getAllByRole('link')
    expect(links.some((l) => l.getAttribute('href')?.includes('github.com'))).toBe(
      true
    )
  })
})
