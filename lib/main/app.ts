import { BrowserWindow, shell, app, ipcMain } from 'electron'
import { join } from 'path'
import { analyzeSentiment } from './LLMSentiment';
import appIcon from '@/resources/build/icon.png?asset'

export function createAppWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    backgroundColor: '#1c1c1c',
    icon: appIcon,
    frame: false,
    titleBarStyle: 'hiddenInset',
    title: 'Electron React App',
    maximizable: false,
    resizable: false,
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      sandbox: false,
    },
  })


  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.webContents.openDevTools()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  ipcMain.handle('open-file-dialog', async () => {
    const { dialog } = require('electron');
    return dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Text', extensions: ['txt'] }]
    }).then(r => r.filePaths[0]);
  });

  ipcMain.handle('open-folder-dialog', async () => {
    const { dialog } = require('electron');
    return dialog.showOpenDialog({
      properties: ['openDirectory']
    }).then(r => r.filePaths[0]);
  });

  ipcMain.handle('analyze-sentiment', async (_, text) => {
    return await analyzeSentiment(text);
  });

}
