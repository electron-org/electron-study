const { ipcRenderer } = require('electron')
ipcRenderer.send('do-some-work',1,2)
ipcRenderer.on('do-some-render-work',()=>{
    alert('do some work')
})