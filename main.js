const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const gmailService = require('./src/gmailService');
const Store = require('electron-store');
const store = new Store();

function createWindow() {
  const isDev = process.env.NODE_ENV === 'development';
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  }
}

// IPC Handlers for Gmail
ipcMain.handle('gmail:authenticate', async () => {
  return await gmailService.authenticate();
});

ipcMain.handle('gmail:get-credentials', () => {
  return {
    clientId: store.get('GMAIL_CLIENT_ID') || '',
    clientSecret: store.get('GMAIL_CLIENT_SECRET') || ''
  };
});

ipcMain.handle('gmail:set-credentials', (event, { clientId, clientSecret }) => {
  store.set('GMAIL_CLIENT_ID', clientId);
  store.set('GMAIL_CLIENT_SECRET', clientSecret);
  gmailService.init();
  return true;
});

ipcMain.handle('gmail:fetch-emails', async () => {
  try {
    const messages = await gmailService.listMessages();
    const fullMessages = await Promise.all(
      messages.map(m => gmailService.getMessage(m.id))
    );
    return fullMessages.map(m => gmailService.formatMessage(m));
  } catch (error) {
    console.error('Error fetching emails:', error);
    return [];
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
