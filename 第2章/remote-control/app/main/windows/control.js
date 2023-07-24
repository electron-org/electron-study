const { BrowserWindow, desktopCapturer } = require('electron')

const path = require('path')
let win
function create() {
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })
    win.loadFile(path.resolve(__dirname, '../../renderer/pages/control/index.html'))
    desktopCapturer.getSources({ types: ['screen'] }).then(async sources => {
        console.log(sources)
        for (const source of sources) {
            console.log(source.id)
            win.webContents.send('add-stream', source.id)
            return
        }
    })
}

module.exports = { create }
