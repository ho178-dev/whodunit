// Electron プリロードスクリプト
// contextBridge 経由でウィンドウ操作 API をレンダラープロセスに公開する
'use strict'

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  windowControls: {
    minimize: () => ipcRenderer.send('win:minimize'),
    quit: () => ipcRenderer.send('win:close'),
  },
})
