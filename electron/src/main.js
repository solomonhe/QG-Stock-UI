const { app, protocol, BrowserWindow, ipcMain } = require('electron')
//const {createProtocol} = require('vue-cli-plugin-electron-builder/lib')
const { installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer')
const isDevelopment = process.env.NODE_ENV !== 'production'
const Store = require('electron-store');
const path = require('path');
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
])
process.env.WEBPACK_DEV_SERVER_URL = true

async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        icon: path.resolve(__dirname, './html/logo/logo.png'),
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            contextIsolation: false,     //上下文隔离
            enableRemoteModule: true,   //启用远程模块
            nodeIntegration: true, //开启自带node环境
            webviewTag: true,     //开启webview
            webSecurity: false,
            allowDisplayingInsecureContent: true,
            allowRunningInsecureContent: true
        }
    })
    win.openDevTools()
    win.show()
    ipcMain.on('getPrinterList', (event) => {
        //主线程获取打印机列表
        win.webContents.getPrintersAsync().then(data => {
            win.webContents.send('getPrinterList', data);
        });
        //通过webContents发送事件到渲染线程，同时将打印机列表也传过去

    });
    win.maximize()
    console.log(process.env.WEBPACK_DEV_SERVER_URL);
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL("http://127.0.0.1/")
    } else {
        //createProtocol('app')
        // Load the index.html when not in development
        await win.loadFile(path.resolve(__dirname, './html/index.html'))
    }

}
// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    Store.initRenderer();
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e)
        }
    }
    await createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {

    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}
