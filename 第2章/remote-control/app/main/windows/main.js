const { BrowserWindow, desktopCapturer } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')

let win
function create() {
    win = new BrowserWindow({
        width: 600,
        height: 300,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })
    if (isDev) {
        win.loadURL('http://localhost:3000')
    } else {
        win.loadFile(path.resolve(__dirname, '../renderer/pages/main/index.html'))
    }
    getSources()
}
function send(channel, ...args) {
    win.webContents.send(channel, ...args)
}

async function getSources() {
    const sources = await desktopCapturer.getSources({ types: ["screen"] });
    try {
        send('SET_SOURCE', sources[0].id, ...args);
    } catch (e) {
        console.error(e);
    }
}

module.exports = { create, send, getSources }