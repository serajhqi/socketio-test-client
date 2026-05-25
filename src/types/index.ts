export type ConnectionStatus = 'connected' | 'connecting' | 'disconnecting' | 'disconnected'

export type RequestType = {
  emitName: string
  note?: string
  body?: string
  response?: unknown
  duration?: number
}

export type ListenerType = {
  title: string
  messages: {
    id: string
    time: string | number
    text: unknown
  }[]
}

export type LogType = {
  time: string | number
  message: string
  id: string
}

export type ServerProfile = {
  id: string
  name: string
  address: string
  options: Record<string, unknown>
  socketioVersion?: '3' | '4'
  requestHistory?: RequestType[]
  listenerNames?: string[]
}

export type ConnectionDetails = {
  socketId?: string
  transport?: string
  connectedAt?: number
  reconnectionCount: number
}

export const SCHEMA_VERSION = 1
