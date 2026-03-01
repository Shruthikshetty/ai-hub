import { app, shell, BrowserWindow, ipcMain, utilityProcess, MessageChannelMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform !== 'darwin' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Spawn worker process
  const worker = utilityProcess.fork(join(__dirname, 'worker.js'), [], {
    stdio: 'pipe',
    env: {
      ...process.env,
      APP_USER_DATA: app.getPath('userData'),
      APP_RESOURCES_PATH: app.isPackaged ? process.resourcesPath : app.getAppPath()
    }
  })

  worker.on('spawn', () => {
    console.log('Worker spawned')
  })

  worker.on('error', (err) => {
    console.error('Worker error:', err)
  })

  worker.on('exit', (code) => {
    console.error('Worker exited with code:', code)
  })

  if (worker.stdout) {
    worker.stdout.on('data', (data) => {
      console.log(`[Worker Output]: ${data}`)
    })
  }

  if (worker.stderr) {
    worker.stderr.on('data', (data) => {
      console.error(`[Worker Error]: ${data}`)
    })
  }

  // Counter for unique stream request IDs
  let streamRequestId = 0

  // Handle regular (non-streaming) Hono requests from renderer
  ipcMain.handle('hono-request', async (_event, { path, method, body }) => {
    return new Promise((resolve, reject) => {
      const { port1, port2 } = new MessageChannelMain()

      worker.postMessage({ type: 'hono-request', path, method, body }, [port2])

      const timeout = setTimeout(() => {
        port1.close()
        reject(new Error('Worker request timed out'))
      }, 30_000)

      port1.on('message', (msgEvent) => {
        const msg = msgEvent.data
        clearTimeout(timeout)
        if (msg.type === 'complete') {
          resolve(msg.data)
        } else if (msg.type === 'error') {
          reject(new Error(msg.data))
        } else {
          // Fallback: buffer all chunks for non-stream callers
          resolve(msg.data)
        }
        port1.close()
      })
      port1.start()
    })
  })

  // Handle streaming Hono requests - returns requestId immediately,
  // then sends chunks and end signal as events
  ipcMain.handle('hono-stream-request', async (event, { path, method, body }) => {
    const { port1, port2 } = new MessageChannelMain()
    const requestId = ++streamRequestId

    worker.postMessage({ type: 'hono-request', path, method, body }, [port2])

    // Set up listener to forward chunks from worker to renderer
    port1.on('message', (msgEvent) => {
      const msg = msgEvent.data
      if (msg.type === 'chunk') {
        event.sender.send(`stream-chunk-${requestId}`, msg.data)
      } else if (msg.type === 'end') {
        event.sender.send(`stream-end-${requestId}`)
        port1.close()
      } else if (msg.type === 'error') {
        event.sender.send(`stream-error-${requestId}`, msg.data)
        port1.close()
      } else if (msg.type === 'complete') {
        // Non-streaming response came back on a stream channel
        // Send it as a single chunk then end
        event.sender.send(`stream-chunk-${requestId}`, JSON.stringify(msg.data))
        event.sender.send(`stream-end-${requestId}`)
        port1.close()
      }
    })
    port1.start()

    // Return the requestId immediately so the renderer can set up listeners
    return { requestId }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
