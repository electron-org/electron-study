const EventEmitter = require('events')
const peer = new EventEmitter()

const { ipcRenderer } = require('electron')

peer.on('robot', (type, data) => {
    if (type === 'mouse') {
        data.screen = {
            width: window.screen.width,
            height: window.screen.height,
        }
    }
    setTimeout(() => {
        ipcRenderer.send('robot', type, data)
    }, 2000);

})
module.exports = peer;