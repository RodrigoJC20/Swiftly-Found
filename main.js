const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
    const window = new BrowserWindow({
        title: 'Swiftly Found',
        width: 1920,
        height: 1080,
    })

    window.loadFile(path.join(__dirname, './renderer/index.html'))
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})