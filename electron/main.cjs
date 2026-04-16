// Electron メインプロセス。BrowserWindow を生成してゲームを起動する
'use strict'

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

/** @type {BrowserWindow | null} */
let win = null

/**
 * ゲームウィンドウを生成する
 * useContentSize: true によりwidth/heightはコンテンツ領域サイズを指す
 * タイトルバー分のズレなしにスケール計算が正確に動作する
 */
function createWindow() {
  win = new BrowserWindow({
    width: 960,
    height: 540,
    minWidth: 640,
    minHeight: 400,
    resizable: true,
    useContentSize: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // アプリケーションメニューを非表示にしてゲームらしい見た目にする
  win.setMenu(null)

  // dist/ 内の index.html を読み込む（開発時・パッケージ後いずれも同じパス構造）
  win.loadFile(path.join(__dirname, '../dist/index.html'))
}

// ウィンドウ操作 IPC ハンドラ（レンダラーの windowControls API から呼び出される）
ipcMain.on('win:minimize', () => win?.minimize())
ipcMain.on('win:close', () => win?.close())
// タイトルバー分のズレを回避するためコンテンツ領域サイズを直接設定する
ipcMain.on('win:setContentSize', (_e, w, h) => {
  win?.setContentSize(w, h)
})

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
