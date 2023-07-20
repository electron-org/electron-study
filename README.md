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

## 1.新版本electron白屏问题

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

## 2.打开调试工具

打开 BrowserWindow 的 webContents.openDevTools()。

```javascript
let win = new BrowserWindow()
win.webContents.openDevTools();
```

## 3.mac上不显示通知问题

设置->通知->Electron->允许通知
