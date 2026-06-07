import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TopMenu } from './TopMenu'
import { useStore } from '../../store'

describe('TopMenu', () => {
  beforeEach(() => {
    useStore.setState({ repoStars: 42 })
  })

  it('renders title', () => {
    render(<TopMenu />)
    expect(screen.getByText('Socket.IO Test Client')).toBeInTheDocument()
  })

  it('renders version from APP_VERSION constant', () => {
    render(<TopMenu />)
    expect(screen.getByText(/v1\.0\.0/)).toBeInTheDocument()
  })

  it('renders GitHub stars badge', () => {
    render(<TopMenu />)
    expect(screen.getByText(/42/)).toBeInTheDocument()
  })

  it('renders GitHub link with correct href', () => {
    render(<TopMenu />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://github.com/serajhqi/socketio-test-client')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('calls onHelpClick when help button clicked', async () => {
    const onHelp = vi.fn()
    render(<TopMenu onHelpClick={onHelp} />)
    await userEvent.click(screen.getByLabelText('Open help guide'))
    expect(onHelp).toHaveBeenCalled()
  })

  it('calls onDonateClick when donate button clicked', async () => {
    const onDonate = vi.fn()
    render(<TopMenu onDonateClick={onDonate} />)
    await userEvent.click(screen.getByLabelText('Open donation modal'))
    expect(onDonate).toHaveBeenCalled()
  })
})
