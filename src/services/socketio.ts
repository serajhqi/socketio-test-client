import { io, Socket } from 'socket.io-client'
import { useStore } from '../store'
import { saveRequest } from './storage'

export const isJson = (str: string): boolean => {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

let socket: Socket | null = null

export const toggleConnection = (): void => {
  try {
    const state = useStore.getState()
    const { address, status, options } = state

    if (status === 'disconnected') {
      if (!address) {
        logger('connection error: server address is not set')
        return
      }

      useStore.getState().setStatus('connecting')
      logger('connecting')

      socket = io(address, options)
      socket.connect()

      socket.on('connect', () => {
        const transport = (socket?.io?.engine?.transport?.name as string) || 'unknown'
        useStore.getState().setStatus('connected')
        useStore.getState().setConnectionDetails({
          socketId: socket?.id,
          transport,
          connectedAt: Date.now(),
        })
        logger('connected')
      })

      socket.on('connect_error', (error) => {
        useStore.getState().setStatus('disconnected')
        useStore.getState().setConnectionDetails({
          socketId: undefined,
          connectedAt: undefined,
        })
        logger('connection error: ' + error.message)

        if (useStore.getState().status !== 'connected' && socket) {
          socket.disconnect()
          logger('disconnected')
        }
      })

      socket.on('disconnect', () => {
        useStore.getState().setStatus('disconnected')
        useStore.getState().setConnectionDetails({
          socketId: undefined,
          connectedAt: undefined,
        })
        logger('disconnected')
      })

      socket.on('upgrade', () => {
        const transport = (socket?.io?.engine?.transport?.name as string) || 'unknown'
        useStore.getState().setConnectionDetails({ transport })
      })

      socket.on('reconnect', () => {
        const current = useStore.getState().connectionDetails
        useStore.getState().setConnectionDetails({
          reconnectionCount: current.reconnectionCount + 1,
        })
      })

      const handleEvent = (eventName: string, ...args: unknown[]) => {
        useStore.getState().appendMessage(eventName, args)
        logger(`${eventName} ${JSON.stringify(args)}`)
      }

      socket.onAny(handleEvent)
      socket.onAnyOutgoing(handleEvent)
    } else if (status === 'connected') {
      useStore.getState().setStatus('disconnecting')
      logger('disconnecting')

      socket?.disconnect()
      socket?.close()

      useStore.getState().setStatus('disconnected')
      useStore.getState().setConnectionDetails({
        socketId: undefined,
        connectedAt: undefined,
      })
      socket = null
    } else if (status === 'connecting' || status === 'disconnecting') {
      socket?.disconnect()
      socket?.close()

      useStore.getState().setStatus('disconnected')
      useStore.getState().setConnectionDetails({
        socketId: undefined,
        connectedAt: undefined,
      })
      socket = null
    }
  } catch (e) {
    console.error('toggleConnection error:', e)
  }
}

export const close = (): void => {
  socket?.disconnect()
  socket?.close()
  socket = null
}

export const sendRequest = (): void => {
  if (!socket) {
    throw new Error('Socket is not connected')
  }

  const state = useStore.getState()
  const req = state.request

  const reqBody = isJson(req.body || '') ? JSON.parse(req.body || '{}') : req.body
  logger(`[request] ${req.emitName} ${JSON.stringify(reqBody)}`)

  const startTime = Date.now()
  socket.emit(req.emitName, reqBody, (response: unknown) => {
    const duration = Date.now() - startTime
    useStore.getState().setRequest({ response, duration })

    const historyState = useStore.getState().requestHistory
    const objIndex = historyState.findIndex((item) => item.title === req.title)

    if (objIndex === -1) {
      useStore.getState().upsertHistory({ ...req, response, duration })
    } else {
      historyState[objIndex] = { ...req, response, duration }
      useStore.getState().setRequestHistory(historyState)
      logger(`[response] ${req.emitName} ${JSON.stringify(response)}`)
    }
    saveRequest()
  })

  socket.on('error', (error: unknown) => {
    logger(`[socket error] ${JSON.stringify(error)}`)
  })
}

export const logger = (message: string): void => {
  useStore.getState().appendLog(message)
}
