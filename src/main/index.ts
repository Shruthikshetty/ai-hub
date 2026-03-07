import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  utilityProcess,
  MessageChannelMain,
  protocol,
  net
} from 'electron'
import { join } from 'path'
import path from 'node:path'
import fs from 'node:fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { EXT_TO_MIME } from '../common/constants/global.constants'
import icon from '../../resources/icon.png?asset'

// Custom media:// protocol
// Must be registered before app.ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'media',
    privileges: {
      standard: true, //Tells Chromium to parse media:// URLs the same way it parses http://URLs
      secure: true, //Tells the browser that resources loaded from this protocol are "secure"
      supportFetchAPI: true, //Enables to use fetch('media://...') and XMLHttpRequest on these URLs in React code
      stream: true, //Allows the protocol handler to return a Node.js Stream (which we do internally using net.fetch). Crucial for efficiently loading large videos or images without loading them entirely into memory first.
      bypassCSP: true //Bypasses the Content Security Policy (CSP).
    }
  }
])

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

  // ─── Register media:// protocol handler ────────────────────────
  // Serves files from APP_USER_DATA/media/ so the renderer can use
  // <img src="media://profile/avatar.png"> directly.
  const mediaRoot = path.join(app.getPath('userData'), 'media')

  protocol.handle('media', (request) => {
    // media://profile/avatar.png → profile/avatar.png
    const url = new URL(request.url)
    // Combine host + pathname for the relative path and decode URI components
    // e.g. media://profile-img/my_avatar.png → "profile-img/my_avatar.png"
    const host = decodeURIComponent(url.host) //  decodeURIComponent  so that node js extracts correct path even with "_" and emojis
    const pathname = decodeURIComponent(url.pathname)
    const relativePath = (host + pathname).replace(/^\/*/, '')

    // Security: prevent path traversal
    if (relativePath.includes('..')) {
      return new Response('Forbidden', { status: 403 })
    }

    const absolutePath = path.join(mediaRoot, relativePath)

    // Verify file is within media root
    const mediaRootWithSep = mediaRoot.endsWith(path.sep) ? mediaRoot : mediaRoot + path.sep
    if (!absolutePath.startsWith(mediaRootWithSep) && absolutePath !== mediaRoot) {
      return new Response('Forbidden', { status: 403 })
    }

    if (!fs.existsSync(absolutePath)) {
      return new Response('Not found', { status: 404 })
    }

    // Serve the file using net.fetch for efficient streaming
    const ext = path.extname(absolutePath).replace('.', '').toLowerCase()
    const mime = EXT_TO_MIME[ext] ?? 'application/octet-stream'

    return net.fetch(`file://${absolutePath}`).then((response) => {
      return new Response(response.body, {
        status: 200,
        headers: {
          'Content-Type': mime,
          'Cache-Control': 'no-cache'
        }
      })
    })
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
      const chunks: string[] = []

      worker.postMessage({ type: 'hono-request', path, method, body }, [port2])

      let timeout = setTimeout(() => {
        port1.close()
        reject(new Error('Worker request timed out'))
      }, 30_000)

      // used to reset the timeout for each chunk
      const resetTimeout = () => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          port1.close()
          reject(new Error('Worker request timed out'))
        }, 30_000)
      }

      port1.on('message', (msgEvent) => {
        const msg = msgEvent.data

        if (msg.type === 'complete') {
          clearTimeout(timeout)
          // If chunks were buffered, concatenate them; otherwise use complete data
          resolve(chunks.length > 0 ? chunks.join('') : msg.data)
          port1.close()
        } else if (msg.type === 'end') {
          clearTimeout(timeout)
          resolve(chunks.join(''))
          port1.close()
        } else if (msg.type === 'error') {
          clearTimeout(timeout)
          reject(new Error(msg.data))
          port1.close()
        } else if (msg.type === 'chunk') {
          resetTimeout()
          // Buffer chunks — don't resolve or close yet
          chunks.push(msg.data)
        } else {
          resetTimeout()
          // Unknown message type — buffer as fallback
          chunks.push(msg.data)
        }
      })
      port1.start()
    })
  })

  // Handle streaming Hono requests - returns requestId immediately,
  // then sends chunks and end signal as events.
  // Uses a readiness handshake: buffer worker messages until the renderer
  // signals it has attached listeners via 'stream-ready-{requestId}'.
  ipcMain.handle('hono-stream-request', async (event, { path, method, body }) => {
    const { port1, port2 } = new MessageChannelMain()
    const requestId = ++streamRequestId

    // Buffer for messages that arrive before renderer is ready
    let rendererReady = false
    const bufferedMessages: Array<{ type: string; data?: unknown }> = []

    // Activity-based timeout: resets on each chunk, so long-running AI ops
    // (image gen, video gen) stay alive as long as data is flowing.
    let inactivityTimeout: ReturnType<typeof setTimeout>
    const INACTIVITY_MS = 300_000 // 5 minutes

    const cleanup = (): void => {
      clearTimeout(inactivityTimeout)
      ipcMain.removeAllListeners(`stream-ready-${requestId}`)
    }

    const resetInactivityTimeout = (): void => {
      clearTimeout(inactivityTimeout)
      inactivityTimeout = setTimeout(() => {
        event.sender.send(`stream-error-${requestId}`, 'Stream inactive for 5 minutes')
        event.sender.send(`stream-end-${requestId}`)
        port1.close()
        cleanup()
      }, INACTIVITY_MS)
    }

    const forwardMessage = (msg: { type: string; data?: unknown }): void => {
      if (msg.type === 'chunk') {
        resetInactivityTimeout()
        event.sender.send(`stream-chunk-${requestId}`, msg.data)
      } else if (msg.type === 'end') {
        cleanup()
        event.sender.send(`stream-end-${requestId}`)
        port1.close()
      } else if (msg.type === 'error') {
        cleanup()
        event.sender.send(`stream-error-${requestId}`, msg.data)
        port1.close()
      } else if (msg.type === 'complete') {
        cleanup()
        event.sender.send(`stream-chunk-${requestId}`, JSON.stringify(msg.data))
        event.sender.send(`stream-end-${requestId}`)
        port1.close()
      }
    }

    // Start the initial inactivity timeout
    resetInactivityTimeout()

    // Listen for renderer ready signal, then flush buffer
    ipcMain.once(`stream-ready-${requestId}`, () => {
      rendererReady = true
      for (const msg of bufferedMessages) {
        forwardMessage(msg)
      }
      bufferedMessages.length = 0
    })

    worker.postMessage({ type: 'hono-request', path, method, body }, [port2])

    port1.on('message', (msgEvent) => {
      const msg = msgEvent.data
      if (rendererReady) {
        forwardMessage(msg)
      } else {
        bufferedMessages.push(msg)
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
