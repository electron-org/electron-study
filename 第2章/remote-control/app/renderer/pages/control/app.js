const { ipcRenderer } = require('electron')
const peer = require('./peer-control')

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


window.onkeydown = function (e) {
    let data = {
        keyCode: e.keyCode,
        shift: e.shiftKey,
        meta: e.metaKey,
        control: e.ctrlKey,
        alt: e.altKey,
    }
    peer.emit('robot','key', data)
}

window.onmouseup = function (e) {
    let data = {}
    data.clientX = e.clientX;
    data.clientY = e.clientY;
    data.video = {
        width: video.getBoundingClientRect().width,
        height: video.getBoundingClientRect().height,
    }
    peer.emit('robot','mouse', data)
}