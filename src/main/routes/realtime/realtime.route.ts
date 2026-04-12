import { ipcMain } from 'electron'
import { handleGetRealtimeToken } from './realtime.handler'

export const registerRealtimeRoutes = () => {
  ipcMain.handle('realtime:getToken', handleGetRealtimeToken)
}
