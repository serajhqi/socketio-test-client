export type ChangeType = 'feat' | 'fix' | 'perf' | 'ui'

export interface ChangelogEntry {
  version: string
  changes: { type: ChangeType; text: string }[]
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.0.0',
    changes: [
      { type: 'feat', text: 'Plain JSON toggle for listener payloads' },
      { type: 'ui', text: 'Added backdrop blur to all modals' },
      { type: 'fix', text: 'Prevent modal close when dragging text selection outside' },
      { type: 'fix', text: 'Preserve listener state per profile when switching' },
      { type: 'ui', text: 'Increased color contrast for better readability' },
    ],
  },
  {
    version: '0.9.0',
    changes: [
      { type: 'feat', text: 'Profiles: full-state save and auto-sync' },
      { type: 'feat', text: 'Relocate connection controls to top menu' },
      { type: 'feat', text: 'Replace request title with optional note' },
      { type: 'feat', text: 'Allow connection cancellation during connecting' },
      { type: 'ui', text: 'Redesigned history panel with polish' },
      { type: 'ui', text: 'Redesigned donate modal organized by network' },
      { type: 'fix', text: 'Fix broadcast routing in listeners' },
      { type: 'fix', text: 'Add CORS hint to server connection modal' },
    ],
  },
]

// Compare semantic versions: return true if v1 < v2
function isVersionLess(v1: string, v2: string): boolean {
  const parts1 = v1.split('.').map(Number)
  const parts2 = v2.split('.').map(Number)

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] ?? 0
    const p2 = parts2[i] ?? 0
    if (p1 < p2) return true
    if (p1 > p2) return false
  }
  return false
}

export function getChangesSince(
  fromVersion: string,
  toVersion: string
): ChangelogEntry[] {
  return CHANGELOG.filter(
    (entry) =>
      isVersionLess(fromVersion, entry.version) &&
      !isVersionLess(toVersion, entry.version)
  )
}
