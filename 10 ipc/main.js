const { app, BrowserWindow, Notification, ipcMain, webContents } = require('electron')

let win
app.on('ready', () => {
    win = new BrowserWindow({
        width: 1000,
        height: 300,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })
    win.webContents.openDevTools();
    win.loadFile('./index.html')
    handleIPC()
})

function handleIPC() {
    ipcMain.on('do-some-work', function (e,a,b) {
        // do some work
        console.log('do-some-work',a,b)
    })
}