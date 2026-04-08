// Electron メインプロセス。BrowserWindow を生成してゲームを起動する
'use strict'

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

/** @type {BrowserWindow | null} */
let win = null

/**
 * ゲームウィンドウを生成する
 * 初期サイズ 960×540・リサイズ可・OSネイティブフレーム表示
 * innerHeight は titlebar を除いたコンテンツ領域を示すため、スケール計算はそのまま正確に動作する
 */
function createWindow() {
  win = new BrowserWindow({
    width: 960,
    height: 580,
    minWidth: 640,
    minHeight: 400,
    resizable: true,
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

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
