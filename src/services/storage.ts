import { useStore } from '../store'

export function readItems<T>(key: string): T[] | undefined {
  try {
    const data = localStorage.getItem(key)
    if (!data) return undefined
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) ? parsed : undefined
  } catch {
    return undefined
  }
}

export function saveRequest(): void {
  const history = useStore.getState().requestHistory
  try {
    localStorage.setItem('history', JSON.stringify(history))
  } catch (e) {
    console.error('Failed to save request history:', e)
  }
}

export function saveListeners(): void {
  const listeners = useStore.getState().listeners
  try {
    localStorage.setItem('listeners', JSON.stringify(listeners))
  } catch (e) {
    console.error('Failed to save listeners:', e)
  }
}

export function removeRequest(title: string): void {
  const history = readItems<any>('history') ?? []
  const filtered = history.filter((r) => r.title !== title)
  localStorage.setItem('history', JSON.stringify(filtered))
}

export function removeListener(title: string): void {
  const listeners = readItems<any>('listeners') ?? []
  const filtered = listeners.filter((l) => l.title !== title)
  localStorage.setItem('listeners', JSON.stringify(filtered))
}
