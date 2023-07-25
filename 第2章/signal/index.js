const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8010 });
const code2ws = new Map()
wss.on('connection', function connection(ws, request) {
    ws.sendData = (event, data) => {
        ws.send(JSON.stringify({ event, data }))
    }
    ws.sendError = msg => {
        ws.sendData('error', {msg})
    };
    
    // ws => 端
    let code = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    code2ws.set(code, ws)


    ws.on('message', function incoming(message) {
        console.log('incoming: ', message)
        // {event,data}
        let parsedMessage = {}
        try {
            parsedMessage = JSON.parse(message);
        } catch (e) {
            ws.sendError('message invalid')
            console.log('parse message error:', e)
            return
        }
        let { event, data } = parsedMessage
        if (event === 'login') {
            ws.sendData('logined', { code })
        } else if (event === 'control') {
            let remote = +data.remote
            if (code2ws.has(remote)) {
                ws.sendData('controlled', { remote })
                let remoteWS = code2ws.get(remote)
                ws.sendRemote = remoteWS.sendData
                remoteWS.sendRemote = ws.sendData
                ws.sendRemote('be-controlled', { remote: code })
            }

        } else if (event === 'forward') {
            // data = {event,data}
            ws.sendRemote(data.event, data.data)
        }

    })
    ws.on('close', function () {
        code2ws.delete(code)
        clearTimeout(ws._closeTimeout)
    })
    ws._closeTimeout = setTimeout(() => {
        ws.terminate()
    }, 10 * 60 * 1000);
})