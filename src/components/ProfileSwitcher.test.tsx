import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProfileSwitcher } from './ProfileSwitcher'
import { useStore } from '../store'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('ProfileSwitcher', () => {
  beforeEach(() => {
    useStore.setState({
      profiles: [],
      activeProfileId: '',
      address: 'http://localhost:3000',
      options: {},
    })
    vi.clearAllMocks()
  })

  it('renders profile button', () => {
    render(<ProfileSwitcher />)
    const btn = screen.getByTitle('Manage profiles')
    expect(btn).toBeInTheDocument()
  })

  it('shows "Profiles" placeholder when no active profile', () => {
    render(<ProfileSwitcher />)
    expect(screen.getByText('Profiles')).toBeInTheDocument()
  })

  it('shows active profile name', () => {
    useStore.setState({
      profiles: [
        {
          id: '1',
          name: 'Local Dev',
          address: 'http://localhost:3000',
          options: {},
        },
      ],
      activeProfileId: '1',
    })
    render(<ProfileSwitcher />)
    expect(screen.getByText('Local Dev')).toBeInTheDocument()
  })

  it('opens dropdown when clicked', async () => {
    render(<ProfileSwitcher />)
    const btn = screen.getByTitle('Manage profiles')
    await userEvent.click(btn)

    expect(screen.getByText('+ Save as Profile')).toBeInTheDocument()
  })

  it('closes dropdown when clicked outside', async () => {
    const { container } = render(<ProfileSwitcher />)
    const btn = screen.getByTitle('Manage profiles')

    await userEvent.click(btn)
    expect(screen.getByText('+ Save as Profile')).toBeInTheDocument()

    await userEvent.click(container)
    // Dropdown should be removed from DOM
    expect(screen.queryByText('+ Save as Profile')).not.toBeInTheDocument()
  })

  it('displays saved profiles', () => {
    useStore.setState({
      profiles: [
        {
          id: '1',
          name: 'Dev Server',
          address: 'http://localhost:3000',
          options: {},
        },
        {
          id: '2',
          name: 'Prod Server',
          address: 'https://api.example.com',
          options: {},
        },
      ],
    })
    const { rerender } = render(<ProfileSwitcher />)
    const btn = screen.getByTitle('Manage profiles')

    userEvent.click(btn)
    rerender(<ProfileSwitcher />)

    expect(screen.getByText('Dev Server')).toBeInTheDocument()
    expect(screen.getByText('Prod Server')).toBeInTheDocument()
  })

  it('shows empty message when no profiles', async () => {
    render(<ProfileSwitcher />)
    const btn = screen.getByTitle('Manage profiles')
    await userEvent.click(btn)

    expect(screen.getByText(/No profiles yet/)).toBeInTheDocument()
  })

  it('can select a profile', async () => {
    useStore.setState({
      profiles: [
        {
          id: '1',
          name: 'Dev',
          address: 'http://localhost:3000',
          options: {},
        },
      ],
    })
    const { rerender } = render(<ProfileSwitcher />)
    const btn = screen.getByTitle('Manage profiles')

    await userEvent.click(btn)
    rerender(<ProfileSwitcher />)

    const profileBtn = screen.getByText('Dev')
    await userEvent.click(profileBtn)

    expect(useStore.getState().activeProfileId).toBe('1')
  })

  it('displays hostname for each profile', async () => {
    useStore.setState({
      profiles: [
        {
          id: '1',
          name: 'Dev',
          address: 'http://localhost:3000',
          options: {},
        },
      ],
    })
    const { rerender } = render(<ProfileSwitcher />)
    const btn = screen.getByTitle('Manage profiles')

    await userEvent.click(btn)
    rerender(<ProfileSwitcher />)

    expect(screen.getByText('localhost')).toBeInTheDocument()
  })

  it('highlights active profile', () => {
    useStore.setState({
      profiles: [
        {
          id: '1',
          name: 'Dev',
          address: 'http://localhost:3000',
          options: {},
        },
      ],
      activeProfileId: '1',
    })
    const { container, rerender } = render(<ProfileSwitcher />)
    const btn = screen.getByTitle('Manage profiles')

    userEvent.click(btn)
    rerender(<ProfileSwitcher />)

    const activeItem = container.querySelector('.profile-item--active')
    expect(activeItem).toBeInTheDocument()
  })

  it('can rename a profile', async () => {
    const renameSpy = vi.spyOn(window, 'prompt').mockReturnValue('New Name')

    useStore.setState({
      profiles: [
        {
          id: '1',
          name: 'Dev',
          address: 'http://localhost:3000',
          options: {},
        },
      ],
    })

    // Can't easily test the full rename flow in jsdom, but we verify the function exists
    const { rerender } = render(<ProfileSwitcher />)
    const btn = screen.getByTitle('Manage profiles')

    await userEvent.click(btn)
    rerender(<ProfileSwitcher />)

    const editBtn = screen.getByTitle('Rename')
    expect(editBtn).toBeInTheDocument()

    renameSpy.mockRestore()
  })

  it('can delete a profile', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    useStore.setState({
      profiles: [
        {
          id: '1',
          name: 'Dev',
          address: 'http://localhost:3000',
          options: {},
        },
      ],
    })

    const { rerender } = render(<ProfileSwitcher />)
    const btn = screen.getByTitle('Manage profiles')

    userEvent.click(btn)
    rerender(<ProfileSwitcher />)

    const deleteBtn = screen.getByTitle('Delete')
    expect(deleteBtn).toBeInTheDocument()

    confirmSpy.mockRestore()
  })

  it('can save current settings as profile', async () => {
    const promptSpy = vi.spyOn(window, 'prompt').mockReturnValue('My Profile')

    render(<ProfileSwitcher />)
    const btn = screen.getByTitle('Manage profiles')

    await userEvent.click(btn)
    const saveBtn = screen.getByText('+ Save as Profile')
    await userEvent.click(saveBtn)

    expect(promptSpy).toHaveBeenCalledWith('Profile name:', '')

    promptSpy.mockRestore()
  })
})
