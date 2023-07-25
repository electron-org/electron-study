const EventEmitter = require('events')
const peer = new EventEmitter()
const { ipcRenderer } = require('electron')
const pc = new window.RTCPeerConnection({})

let dc = pc.createDataChannel('robotchannel', { reliable: false });
console.log('before-opened', dc)
dc.onopen = function () {
    console.log('opened')
    peer.on('robot', (type, data) => {
        dc.send(JSON.stringify({ type, data }))
    })
}
dc.onmessage = function (event) {
    console.log('message', event)
}
dc.onerror = (e) => { console.log(e) }

async function createOffer() {
    let offer = await pc.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: true
    })
    await pc.setLocalDescription(offer)
    console.log('create-offer\n', JSON.stringify(pc.localDescription))
    return pc.localDescription
}
createOffer().then((offer) => {
    console.log('forward', 'offer', offer)
    ipcRenderer.send('forward', 'offer', { type: offer.type, sdp: offer.sdp })
})

ipcRenderer.on('answer', (e, answer) => {
    setRemote(answer)
})
ipcRenderer.on('candidate', (e, candidate) => {
    addIceCandidate(candidate)
})
async function setRemote(answer) {
    await pc.setRemoteDescription(answer)
    console.log('create-answer', pc)
}
window.setRemote = setRemote

pc.onicecandidate = (e) => {
    console.log('candidate', JSON.stringify(e.candidate))
    ipcRenderer.send('forward', 'control-candidate', e.candidate)
}

const candidates = []
async function addIceCandidate(candidate) {
    if (!candidate || !candidate.type) return
    candidates.push(candidate)
    if (pc.remoteDescription && pc.remoteDescription.type) {
        for (let i = 0; i < candidates.length; i++) {
            await pc.addIceCandidate(new RTCIceCandidate(candidates[i]))
        }
        candidates = []
    }
}
window.addIceCandidate = addIceCandidate

pc.onaddstream = (e) => {
	console.log('addstream', e)
	peer.emit('add-stream', e.stream)

}

module.exports = peer