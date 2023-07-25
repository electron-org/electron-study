# electron-study

# 1. Electron环境搭建

## 1.1 Electron安装

```bash
npm install electron --save-dev
```

```bash
npm install --arch=32 --platform=win32 electron
```

## 1.2 验证安装成功

```bash
npx electron -v
./node_modules/.bin/electron
```

## 1.3 加速技巧

ELECTRON_MIRROR=https://cdn.npm.taobao.org/dist/electron/

## 1.4 运行程序

在`package.json`配置文件中的`scripts`字段下增加一条`start`命令

```json
{
	"scripts": {
		"start": "electron ."
	}
}
```

在终端下执行

```bash
npm start
```

# 2.番茄钟应用

## 2.1 新版本electron白屏问题

新版本的 electron，可能会有安全问题导致代码不能正常运行，可以参考 https://www.electronjs.org/docs/tutorial/security#3-enable-context-isolation-for-remote-content。 

其主要就是在创建 `BrowserWindow` 时设置 `nodeIntegration: true` 和 `contextIsolation: false`

```javascript
win = new BrowserWindow({
    width: 1000,
    height: 300,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
    }
})
```

## 2.2 打开调试工具

打开 BrowserWindow 的 webContents.openDevTools()。

```javascript
let win = new BrowserWindow()
win.webContents.openDevTools();
```

## 2.3 mac上不显示通知问题

设置->通知->Electron->允许通知

# 3.远程控制软件

## 3.1 捕获音视频媒体流

html代码

```html
<video id="video1></video>
```

js代码

```javascript
navigator.mediaDevices.getUserMedia({
    audio: true,
    video: {
        width: { min: 1024, ideal: 1280, max: 1920 },
        height: { min: 576, ideal: 720, max: 1080 },
        frameRate: { max: 30 }
    }
}).then(stream => {
    console.log(stream)
    const video1 = document.getElementById('video1')
    video1.srcObject = stream
    video1.onloadedmetadata = function () {
        video1.play()
    }
})
```

## 3.2 捕获桌面视频流

[Electron 17开始desktopCapturer.getSources只能写在主进程里](https://www.electronjs.org/docs/latest/api/desktop-capturer)

Main process

```javascript
// In the main process.
const { BrowserWindow, desktopCapturer } = require('electron')

const mainWindow = new BrowserWindow()

desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
  for (const source of sources) {
    mainWindow.webContents.send('SET_SOURCE', source.id)
    return
  }
})
```

Preload process

```javascript
// In the preload script.
const { ipcRenderer } = require('electron')

ipcRenderer.on('SET_SOURCE', async (event, sourceId) => {
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
    handleError(e)
  }
})

function handleStream (stream) {
  const video = document.querySelector('video')
  video.srcObject = stream
  video.onloadedmetadata = (e) => video.play()
}

function handleError (e) {
  console.log(e)
}
```

## 3.3 服务端实现WebSocket服务器(基于Node.js)

(1) 安装

```bash
npm install ws --save
```

(2) 基本使用

```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8010 });
wss.on('connection', function connection(ws, request) {
    ws.on('message', function incoming(msg) {
        // 响应客户端send事件
    })
    ws.on('close', function () {
        // 响应客户端close事件
    })
    // 发送内容到客户端
    ws.send('推送内容')
})
```

## 3.4 禁止多开

```javascript
const gotTheLock = app.requestSingleInstanceLock()
if(!gotTheLock) {
	app.quit()
} else {
	app.on('second-instance',(event,commandLine,workingDirectory)=>{
		//当运行第二个实例时,将会聚焦到myWindow这个窗口
		showMainWindow()
	})
	app.on('ready',()=>{
	...
	})
}
```

## 3.5 Menu/MenuItem(菜单/菜单项)

(1) 新建菜单

```javascript
const menu = new Menu()
```

(2) 新建菜单项

```javascript
const menuItem1 = new MenuItem({ label: '复制', role: 'copy' })
const menuItem2 = new MenuItem({ label: '菜单项名', click: handler, enabled, visible,
type: normal | separator | submenu | checkbox | radio,
role: copy | paste | cut | quit | ... })
```

(3) 添加菜单项

```javascript
menu.append(menuItem1)
menu.append(new MenuItem({ type: 'separator' })) menu.append(menuItem2)
```

(4) 弹出右键菜单

```javascript
menu.popup({ window: remote.getCurrentWindow() })
```

(5) 设置应用菜单栏

```javascript
app.applicationMenu = appMenu;
```

## 3.6 托盘

(1) 创建托盘

```javascript
tray = new Tray('/path/to/my/icon')
```

* Mac图片建议保留 1倍图(32 * 32)，2倍图@2x(64 * 64)
* Windows使用ico格式
* 大部分Mac托盘都是偏黑色的、Windows则是彩色的

(2) 弹出托盘菜单

```javascript
const contextMenu = Menu.buildFromTemplate([ { label: '显示', click: () => {showMainWindow()}}, { label: '退出', role: 'quit'}}
]) tray.popUpContextMenu(contextMenu)
```

(3) 事件

* 'click':点击托盘
* 'right-click':右击托盘 
* 'drop-files':文件拖拽。类似的还有drop-text 
* 'balloon-click':托盘气泡被点击(Windows特性)
