import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TopMenu } from './TopMenu'
import { useStore } from '../../store'

describe('TopMenu', () => {
  beforeEach(() => {
    useStore.setState({ repoStars: 42, appVersion: '1.0.0' })
  })

  it('renders title', () => {
    render(<TopMenu />)
    expect(screen.getByText('Socket.IO Test Client')).toBeInTheDocument()
  })

  it('renders version when set', () => {
    render(<TopMenu />)
    expect(screen.getByText('1.0.0')).toBeInTheDocument()
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

  it('renders profile switcher slot when provided', () => {
    render(<TopMenu profileSwitcher={<div>Profile Switcher</div>} />)
    expect(screen.getByText('Profile Switcher')).toBeInTheDocument()
  })

  it('renders export/import slot when provided', () => {
    render(<TopMenu exportImport={<div>Export Import</div>} />)
    expect(screen.getByText('Export Import')).toBeInTheDocument()
  })

  it('renders both slots when provided', () => {
    render(
      <TopMenu
        profileSwitcher={<div>Profile</div>}
        exportImport={<div>Export</div>}
      />
    )
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Export')).toBeInTheDocument()
  })
})
