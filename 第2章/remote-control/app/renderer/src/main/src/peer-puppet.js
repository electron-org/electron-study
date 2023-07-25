// createAnswer
// addstream
import { ipcRenderer } from 'electron'

const pc = new window.RTCPeerConnection({})
ipcRenderer.on('add-stream', async (event, sourceId) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sourceId,
                    minWidth: 1280,
                    maxWidth: 1280,
                    minHeight: 720,
                    maxHeight: 720
                }
            }
        })
        handleStream(stream)
    } catch (e) {
        console.error(e)
    }
})

function handleStream(stream) {
    pc.addTrack(stream)
}

async function createAnswer(offer) {
    await pc.setRemoteDescription(offer)
    await pc.setLocalDescription(await pc.createAnswer())
    console.log('answer', JSON.stringify(pc.localDescription))
    return pc.localDescription
}
window.createAnswer = createAnswer