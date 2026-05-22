import { useState, useRef, useEffect } from 'react'
import { useStore } from '../store'
import { toast } from 'sonner'
import './ProfileSwitcher.scss'
import { SaveProfileModal } from './SaveProfileModal'

interface DropdownState {
  isOpen: boolean
  editingId?: string
  editName?: string
}

export function ProfileSwitcher() {
  const { profiles, activeProfileId, setActiveProfile, setProfiles, address, options } =
    useStore()
  const [dropdown, setDropdown] = useState<DropdownState>({ isOpen: false })
  const [showSaveModal, setShowSaveModal] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const activeProfile = profiles.find((p) => p.id === activeProfileId)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdown({ isOpen: false })
      }
    }

    if (dropdown.isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdown.isOpen])

  const handleSaveAsProfile = () => {
    setDropdown({ isOpen: false })
    setShowSaveModal(true)
  }

  const handleConfirmSave = (name: string) => {
    const newProfile = {
      id: Date.now().toString(),
      name,
      address,
      options,
      socketioVersion: '4' as const,
    }

    setProfiles([...profiles, newProfile])
    setActiveProfile(newProfile.id)
    toast.success(`Profile saved: ${name}`)
    setShowSaveModal(false)
  }

  const handleRenameProfile = (id: string, currentName: string) => {
    setDropdown({ isOpen: true, editingId: id, editName: currentName })
  }

  const handleConfirmRename = (id: string) => {
    if (!dropdown.editName?.trim()) {
      toast.error('Profile name cannot be empty')
      return
    }

    const updated = profiles.map((p) =>
      p.id === id ? { ...p, name: dropdown.editName } : p
    )
    setProfiles(updated)
    setDropdown({ isOpen: true })
    toast.success('Profile renamed')
  }

  const handleDeleteProfile = (id: string) => {
    if (!confirm('Delete this profile?')) return

    const filtered = profiles.filter((p) => p.id !== id)
    setProfiles(filtered)

    if (activeProfileId === id) {
      setActiveProfile(filtered.length > 0 ? filtered[0].id : '')
    }

    toast.success('Profile deleted')
  }

  const handleSelectProfile = (id: string) => {
    const profile = profiles.find((p) => p.id === id)
    if (profile) {
      useStore.getState().setAddress(profile.address)
      useStore.getState().setOptions(profile.options)
      setActiveProfile(id)
      toast.success(`Switched to: ${profile.name}`)
    }
    setDropdown({ isOpen: false })
  }

  return (
    <div className="profile-switcher" ref={dropdownRef}>
      <button
        className="profile-switcher__btn"
        onClick={() =>
          setDropdown((s) => ({ ...s, isOpen: !s.isOpen, editingId: undefined }))
        }
        title="Manage profiles"
      >
        <span className="profile-switcher__icon">👤</span>
        {activeProfile ? (
          <span className="profile-switcher__name">{activeProfile.name}</span>
        ) : (
          <span className="profile-switcher__placeholder">Profiles</span>
        )}
        <span className="profile-switcher__arrow">▼</span>
      </button>

      <SaveProfileModal
        isOpen={showSaveModal}
        serverAddress={address}
        onSave={handleConfirmSave}
        onClose={() => setShowSaveModal(false)}
      />

      {dropdown.isOpen && (
        <div className="profile-dropdown">
          <div className="profile-dropdown__section">
            <button
              className="profile-dropdown__action"
              onClick={handleSaveAsProfile}
              title="Save current settings as a profile"
            >
              + Save as Profile
            </button>
          </div>

          {profiles.length > 0 && (
            <div className="profile-dropdown__section">
              <div className="profile-dropdown__label">Saved Profiles</div>
              <div className="profile-list">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className={`profile-item ${
                      activeProfileId === profile.id ? 'profile-item--active' : ''
                    }`}
                  >
                    {dropdown.editingId === profile.id ? (
                      <input
                        type="text"
                        className="profile-item__input"
                        value={dropdown.editName || ''}
                        onChange={(e) =>
                          setDropdown((s) => ({
                            ...s,
                            editName: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleConfirmRename(profile.id)
                          } else if (e.key === 'Escape') {
                            setDropdown({ isOpen: true })
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <button
                        className="profile-item__button"
                        onClick={() => handleSelectProfile(profile.id)}
                      >
                        <span className="profile-item__name">{profile.name}</span>
                        {profile.address && (
                          <span className="profile-item__url">
                            {new URL(profile.address).hostname}
                          </span>
                        )}
                      </button>
                    )}

                    <div className="profile-item__actions">
                      {dropdown.editingId !== profile.id && (
                        <>
                          <button
                            className="profile-item__edit"
                            onClick={() => handleRenameProfile(profile.id, profile.name)}
                            title="Rename"
                          >
                            ✎
                          </button>
                          <button
                            className="profile-item__delete"
                            onClick={() => handleDeleteProfile(profile.id)}
                            title="Delete"
                          >
                            ✕
                          </button>
                        </>
                      )}
                      {dropdown.editingId === profile.id && (
                        <>
                          <button
                            className="profile-item__confirm"
                            onClick={() => handleConfirmRename(profile.id)}
                            title="Confirm"
                          >
                            ✓
                          </button>
                          <button
                            className="profile-item__cancel"
                            onClick={() => setDropdown({ isOpen: true })}
                            title="Cancel"
                          >
                            ✕
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {profiles.length === 0 && (
            <div className="profile-dropdown__empty">
              <p>No profiles yet. Save your first one!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
