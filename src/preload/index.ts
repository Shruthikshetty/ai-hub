import { contextBridge, ipcRenderer, webUtils } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // Generic function for non-streaming requests
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: (path: string, method = 'GET', body?: any) =>
    ipcRenderer.invoke('hono-request', { path, method, body }),

  // Streaming: returns requestId, then use event-based methods to receive chunks
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startStream: (path: string, method = 'GET', body?: any): Promise<{ requestId: number }> =>
    ipcRenderer.invoke('hono-stream-request', { path, method, body }),

  onStreamChunk: (requestId: number, callback: (data: string) => void): void => {
    ipcRenderer.on(`stream-chunk-${requestId}`, (_event, data) => callback(data))
  },

  onStreamEnd: (requestId: number, callback: () => void): void => {
    ipcRenderer.on(`stream-end-${requestId}`, () => callback())
  },

  onStreamError: (requestId: number, callback: (error: string) => void): void => {
    ipcRenderer.on(`stream-error-${requestId}`, (_event, error) => callback(error))
  },

  removeStreamListeners: (requestId: number): void => {
    ipcRenderer.removeAllListeners(`stream-chunk-${requestId}`)
    ipcRenderer.removeAllListeners(`stream-end-${requestId}`)
    ipcRenderer.removeAllListeners(`stream-error-${requestId}`)
  },

  // Signal to main process that stream listeners are attached and ready
  streamReady: (requestId: number): void => {
    ipcRenderer.send(`stream-ready-${requestId}`)
  },

  // Get the real filesystem path from a File object (from <input type="file">)
  // This avoids base64 encoding — the path string is sent to the backend which
  // does a stream copy directly.
  getFilePath: (file: File): string => webUtils.getPathForFile(file),

  // Download a file to a user-chosen location via native Save dialog
  downloadFile: (
    relativePath: string
  ): Promise<{ success: boolean; filePath?: string; canceled?: boolean; error?: string }> =>
    ipcRenderer.invoke('download-file', relativePath)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
