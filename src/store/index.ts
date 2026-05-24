import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  ConnectionStatus,
  RequestType,
  ListenerType,
  LogType,
  ServerProfile,
  ConnectionDetails,
} from '../types'
import { SCHEMA_VERSION } from '../types'
import { nanoid } from 'nanoid'

// ============================================================================
// Connection Slice
// ============================================================================

interface ConnectionSlice {
  address: string | null
  status: ConnectionStatus
  options: Record<string, unknown>
  connectionDetails: ConnectionDetails
  profiles: ServerProfile[]
  activeProfileId: string | null
  setAddress: (address: string | null) => void
  setStatus: (status: ConnectionStatus) => void
  setOptions: (options: Record<string, unknown>) => void
  setConnectionDetails: (details: Partial<ConnectionDetails>) => void
  setProfiles: (profiles: ServerProfile[]) => void
  setActiveProfile: (id: string | null) => void
  clearSettings: () => void
}

// ============================================================================
// Request Slice
// ============================================================================

interface RequestSlice {
  request: RequestType
  requestHistory: RequestType[]
  setRequest: (req: Partial<RequestType>) => void
  setRequestHistory: (history: RequestType[]) => void
  upsertHistory: (req: RequestType) => void
  removeFromHistory: (title: string) => void
  clearRequest: () => void
}

// ============================================================================
// Listener Slice
// ============================================================================

interface ListenerSlice {
  listeners: ListenerType[]
  setListeners: (listeners: ListenerType[]) => void
  addListener: (title: string) => void
  removeListener: (title: string) => void
  appendMessage: (eventName: string, args: unknown[]) => void
  clearMessages: (title: string) => void
}

// ============================================================================
// Log Slice
// ============================================================================

const MAX_LOGS = 2000

interface LogSlice {
  logs: LogType[]
  appendLog: (message: string) => void
  clearLogs: () => void
}

// ============================================================================
// UI Slice
// ============================================================================

interface UiSlice {
  repoStars: number
  appVersion: string
  historyCollapsed: boolean
  setRepoStars: (count: number) => void
  setAppVersion: (version: string) => void
  setHistoryCollapsed: (collapsed: boolean) => void
}

// ============================================================================
// Combined Store Type
// ============================================================================

type Store = ConnectionSlice & RequestSlice & ListenerSlice & LogSlice & UiSlice

// ============================================================================
// Create Zustand Store
// ============================================================================

export const useStore = create<Store>()(
  persist(
    (set) => ({
      // Connection
      address: null,
      status: 'disconnected',
      options: {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      },
      connectionDetails: { reconnectionCount: 0 },
      profiles: [],
      activeProfileId: null,
      setAddress: (address) => set({ address }),
      setStatus: (status) => set({ status }),
      setOptions: (options) => set({ options }),
      setConnectionDetails: (details) =>
        set((state) => ({
          connectionDetails: { ...state.connectionDetails, ...details },
        })),
      setProfiles: (profiles) => set({ profiles }),
      setActiveProfile: (id) => set({ activeProfileId: id }),
      clearSettings: () =>
        set({
          address: null,
          status: 'disconnected',
          options: {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
          },
          connectionDetails: { reconnectionCount: 0 },
          activeProfileId: null,
        }),

      // Request
      request: {
        emitName: '',
        title: '',
        body: undefined,
        response: undefined,
        duration: undefined,
      },
      requestHistory: [],
      setRequest: (req) =>
        set((state) => ({
          request: { ...state.request, ...req },
        })),
      setRequestHistory: (history) => set({ requestHistory: history }),
      upsertHistory: (req) =>
        set((state) => {
          const index = state.requestHistory.findIndex((r) => r.title === req.title)
          if (index >= 0) {
            const updated = [...state.requestHistory]
            updated[index] = req
            return { requestHistory: updated }
          }
          return { requestHistory: [...state.requestHistory, req] }
        }),
      removeFromHistory: (title) =>
        set((state) => ({
          requestHistory: state.requestHistory.filter((r) => r.title !== title),
        })),
      clearRequest: () =>
        set({
          request: {
            emitName: '',
            title: '',
            body: undefined,
            response: undefined,
            duration: undefined,
          },
        }),

      // Listeners
      listeners: [],
      setListeners: (listeners) => set({ listeners }),
      addListener: (title) =>
        set((state) => {
          if (state.listeners.find((l) => l.title === title)) {
            return state
          }
          return {
            listeners: [...state.listeners, { title, messages: [] }],
          }
        }),
      removeListener: (title) =>
        set((state) => ({
          listeners: state.listeners.filter((l) => l.title !== title),
        })),
      appendMessage: (eventName, args) =>
        set((state) => {
          const listeners = [...state.listeners]
          const index = listeners.findIndex((l) => l.title === eventName)
          if (index >= 0) {
            const listener = listeners[index]
            listeners[index] = {
              ...listener,
              messages: [
                ...listener.messages,
                {
                  id: nanoid(5),
                  time: new Date().toISOString(),
                  text: args,
                },
              ],
            }
          }
          return { listeners }
        }),
      clearMessages: (title) =>
        set((state) => ({
          listeners: state.listeners.map((l) =>
            l.title === title ? { ...l, messages: [] } : l,
          ),
        })),

      // Logs
      logs: [],
      appendLog: (message) =>
        set((state) => {
          const newLogs = [
            ...state.logs,
            {
              id: nanoid(5),
              time: new Date().toISOString(),
              message,
            },
          ]
          if (newLogs.length > MAX_LOGS) {
            newLogs.splice(0, newLogs.length - MAX_LOGS)
          }
          return { logs: newLogs }
        }),
      clearLogs: () => set({ logs: [] }),

      // UI
      repoStars: 0,
      appVersion: '0.9.0',
      historyCollapsed: false,
      setRepoStars: (count) => set({ repoStars: count }),
      setAppVersion: (version) => set({ appVersion: version }),
      setHistoryCollapsed: (collapsed) => set({ historyCollapsed: collapsed }),
    }),
    {
      name: 'socketio-client',
      version: SCHEMA_VERSION,
      partialize: (state) => ({
        address: state.address,
        options: state.options,
        profiles: state.profiles,
        activeProfileId: state.activeProfileId,
        requestHistory: state.requestHistory,
        listeners: state.listeners,
        historyCollapsed: state.historyCollapsed,
      }),
    },
  ),
)
