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
    ...(process.platform === 'linux' ? { icon } : {}),
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

  // Handle Hono requests from renderer
  ipcMain.handle('hono-request', async (_event, { path, method, body }) => {
    return new Promise((resolve, reject) => {
      // Create a message channel for this specific request
      const { port1, port2 } = new MessageChannelMain()

      // Send the request to the worker along with the port2
      // We'll use port2 in the worker to send the response back
      worker.postMessage({ type: 'hono-request', path, method, body }, [port2])

      // Set a timeout for the request
      const timeout = setTimeout(() => {
        port1.close()
        reject(new Error('Worker request timed out'))
      }, 30_000)

      // Listen for the response on port1
      port1.on('message', (event) => {
        clearTimeout(timeout)
        resolve(event.data)
        port1.close()
      })
      port1.start()
    })
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
