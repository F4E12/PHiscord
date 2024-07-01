import path from 'path'
import { app, ipcMain, Tray, Menu, nativeImage } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'

let mainWindow;
let tray

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady().then(() => {
    app.setName('PHiscord');
    const iconPath = path.join(__dirname, '../renderer/public/images/PHiscordLogoNOBG.png');
    const icon = nativeImage.createFromPath(iconPath);
    tray = new Tray(icon);

    const contextMenu = Menu.buildFromTemplate([
      { label: 'Open PHiscord', click: () => mainWindow.show() },
      { label: 'Toggle Mute', click: toggleMute },
      { label: 'Toggle Deafen', click: toggleDeafen },
      { type: 'separator' },
      { label: 'Quit', click: quitApp }
    ]);

    tray.setToolTip('PHiscord');
    tray.setContextMenu(contextMenu);
  });

  mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  // Untuk hilangin tool barnya
  // mainWindow.setMenu(null);

  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})

function toggleMute() {
  console.log('Toggling mute');
}

function toggleDeafen() {
  console.log('Toggling deafen');
}

function quitApp() {
  app.quit();
}