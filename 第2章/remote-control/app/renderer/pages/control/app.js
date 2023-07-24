const { ipcRenderer } = require('electron')

ipcRenderer.on('add-stream', async (event, sourceId) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sourceId,
                    maxWidth: window.screen.width,
                    maxHeight: window.screen.height
                }
            }
        })
        console.log(stream)
        play(stream)
    } catch (e) {
        handleError(e)
    }
})

function handleError(e) {
    console.log(e)
}

let video = document.getElementById('screen-video')
function play(stream) {
    video.srcObject = stream
    video.onloadedmetadata = (e) => video.play()
}
