// Electron メインプロセス。BrowserWindow を生成してゲームを起動する
'use strict'

const { app, BrowserWindow } = require('electron')
const path = require('path')

/**
 * ゲームウィンドウを生成する
 * 初期サイズ 960×540・リサイズ可・メニューバーなし
 */
function createWindow() {
  const win = new BrowserWindow({
    width: 960,
    height: 540,
    minWidth: 640,
    minHeight: 360,
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

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
