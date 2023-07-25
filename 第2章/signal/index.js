const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8010 });
const code2ws = new Map()
wss.on('connection', function connection(ws, request) {
    // ws => 端
    let code = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    code2ws.set(code, ws)
    ws.sendData = (event, data) => {
        ws.send(JSON.stringify({ event, data }))
    }

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
        }
    })
    ws.on('close', function () {
        // 响应客户端close事件
    })
    // 发送内容到客户端
    ws.send('推送内容')
})