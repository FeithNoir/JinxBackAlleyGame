const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, 'dist/jinx-backalley-game/browser/assets/icon.png') // Adjust if icon exists
  });

  // Load the compiled Angular app
  const indexPath = path.join(__dirname, 'dist/jinx-backalley-game/browser/index.html');
  if (fs.existsSync(indexPath)) {
    mainWindow.loadFile(indexPath);
  } else {
    console.error('Build not found. Please run "npm run build" first.');
    mainWindow.loadURL('http://localhost:4200'); // Fallback for dev
  }

  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers for "Backend" Storage
const DATA_FILE = path.join(app.getPath('userData'), 'game_data.json');

ipcMain.handle('save-data', async (event, data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-data', async () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
    return null;
  } catch (error) {
    return { error: error.message };
  }
});
