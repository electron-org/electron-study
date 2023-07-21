const {app,BrowserWindow} = require('electron')
let mainWindow
app.whenReady().then(()=>{
    mainWindow = new BrowserWindow({
        width:1000,
        height:680,
    })
    mainWindow.loadURL('https://mathiasbynens.be/demo/img-loading-lazy')
})