import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      request: (path: string, method?: string, body?: any) => Promise<any>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      startStream: (path: string, method?: string, body?: any) => Promise<{ requestId: number }>
      onStreamChunk: (requestId: number, callback: (data: string) => void) => void
      onStreamEnd: (requestId: number, callback: () => void) => void
      onStreamError: (requestId: number, callback: (error: string) => void) => void
      removeStreamListeners: (requestId: number) => void
      streamReady: (requestId: number) => void
      getFilePath: (file: File) => string
      downloadFile: (
        relativePath: string
      ) => Promise<{ success: boolean; filePath?: string; canceled?: boolean; error?: string }>
    }
  }
}
