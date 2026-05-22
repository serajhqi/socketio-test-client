import { useEffect } from 'react'
import { Toaster } from 'sonner'
import { useStore } from './store'

export default function App() {
  useEffect(() => {
    // Initialize from localStorage
    const address = localStorage.getItem('address')
    const options = localStorage.getItem('options')

    if (address) {
      useStore.getState().setAddress(address)
    }

    if (options) {
      try {
        useStore.getState().setOptions(JSON.parse(options))
      } catch {
        // Invalid JSON, skip
      }
    }

    // Fetch GitHub stars
    fetch('https://api.github.com/repos/serajhqi/socketio-test-client')
      .then((res) => res.json())
      .then((data) => useStore.getState().setRepoStars(data.stargazers_count || 0))
      .catch(() => {})
  }, [])

  return (
    <div className="h-screen w-screen flex flex-col bg-burnt">
      <header className="border-b border-burning p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Socket.IO Test Client</h1>
        <div className="text-sm text-semiburnt">React Migration</div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <p className="text-white text-lg">Building React components...</p>
      </main>
      <Toaster />
    </div>
  )
}
