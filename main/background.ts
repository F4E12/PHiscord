import path from 'path';
import { app, ipcMain, Tray, Menu, nativeImage, BrowserWindow } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';

let mainWindow;
let tray;
const iconPath = path.join(__dirname, '../renderer/public/images/PHiscordLogoNOBG.png');
const icons = nativeImage.createFromPath(iconPath);

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

function handleCommandLineArguments(argv = process.argv) {
  console.log('Handling command-line arguments:', argv);
  argv.forEach((arg) => {
    console.log('Argument:', arg);
    if (arg === '--toggle-mute') {
      console.log('Sending toggle-mute event');
      mainWindow.webContents.send('toggle-mute');
    }
    if (arg === '--toggle-deafen') {
      console.log('Sending toggle-deafen event');
      mainWindow.webContents.send('toggle-deafen');
    }
    if (arg === '--disconnect') {
      console.log('Sending disconnect event');
      mainWindow.webContents.send('disconnect');
    }
  });
}

app.setJumpList([
  {
    type: 'custom',
    name: 'Quick Actions',
    items: [
      { type: 'task', title: 'Mute', description: 'Toggle mute', program: process.execPath, args: '--toggle-mute', iconPath: process.execPath, iconIndex: 0 },
      { type: 'task', title: 'Deafen', description: 'Toggle deafen', program: process.execPath, args: '--toggle-deafen', iconPath: process.execPath, iconIndex: 0 },
      { type: 'task', title: 'Disconnect', description: 'Disconnect from channel', program: process.execPath, args: '--disconnect', iconPath: process.execPath, iconIndex: 0 }
    ]
  }
]);

;(async () => {
  await app.whenReady().then(() => {
    app.setName('PHiscord');
    
    // TRAY
    tray = new Tray(icons);
    
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Open PHiscord', click: () => mainWindow.show() },
      { label: 'Toggle Mute', click: toggleMute },
      { label: 'Toggle Deafen', click: toggleDeafen },
      { type: 'separator' },
      { label: 'Quit', click: quitApp }
    ]);

    tray.setToolTip('PHiscord');
    tray.setContextMenu(contextMenu);

    mainWindow = createWindow('main', {
      width: 1000,
      height: 600,
      icon: icons,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      },
    });

    if (isProd) {
      mainWindow.loadURL('app://./home');
    } else {
      const port = process.argv[2];
      mainWindow.loadURL(`http://localhost:${port}/home`);
      mainWindow.webContents.openDevTools();
    }

    handleCommandLineArguments(process.argv);
  });
})();

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`);
});

function toggleMute() {
  if (mainWindow) {
    mainWindow.webContents.send('toggle-mute');
  }
}

function toggleDeafen() {
  if (mainWindow) {
    mainWindow.webContents.send('toggle-deafen');
  }
}

function quitApp() {
  app.quit();
}
