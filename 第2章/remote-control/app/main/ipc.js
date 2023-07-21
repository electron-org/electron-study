const {ipcMain} = require('electron')
module.exports = function() {
    ipcMain.handle('login',async ()=>{
        // 先mock,返回一个code
        let code =Math.floor(Math.random() * (999999 - 100000)) + 100000
        return code
    })
}