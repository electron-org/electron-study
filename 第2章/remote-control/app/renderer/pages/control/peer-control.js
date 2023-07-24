const EventEmitter = require('events')
const peer = new EventEmitter()

const { ipcRenderer } = require('electron')

// peer.on('robot', (type, data) => {
//     if (type === 'mouse') {
//         data.screen = {
//             width: window.screen.width,
//             height: window.screen.height,
//         }
//     }
//     setTimeout(() => {
//         ipcRenderer.send('robot', type, data)
//     }, 2000);

// })
const pc = new window.RTCPeerConnection({})
async function createOffer() {
    const offer = await pc.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: true,
    })
    await pc.setLocalDescription(offer)
    console.log('pc offer', JSON.stringify(offer))
    return pc.localDescription;
}
createOffer()
async function setRemote(answer) {
    await pc.setRemoteDescription(answer)
}
window.setRemote = setRemote
pc.onaddstream = function (e) {
    console.log('add stream',e)
    peer.emit('add-stream', e.stream)
}
module.exports = peer;