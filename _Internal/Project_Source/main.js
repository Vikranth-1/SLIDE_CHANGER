const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const server = require('./server'); // Import our existing server

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        frame: false, // Frameless for custom "luxury" UI
        transparent: true,
        resizable: false,
        icon: path.join(__dirname, 'public/logo.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false // For simple IPC in this local app
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'public/desktop.html'));

    // Start server and get URL
    const { url } = server.startServer();

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('server-info', { url });
    });
}

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

// IPC handlers for custom window controls
ipcMain.on('app-minimize', () => mainWindow.minimize());
ipcMain.on('app-close', () => app.quit());
