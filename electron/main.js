import { app, BrowserWindow, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win;

const Database = require('better-sqlite3');
const db = new Database('billing.db');

db.exec(
  `CREATE TABLE IF NOT EXISTS items (name VARCHAR NOT NULL,code NUMBER PRIMARY KEY ,price NUMERIC NOT NULL);`
  );
ipcMain.handle('additems', (event, item) => {
  const insert = db.prepare(`INSERT INTO items (name, code, price) VALUES(?, ?, ?);`)
  const result = insert.run(item.name, item.code, item.price);
  return {success: true, id: result.lastInsertRowId};
});
ipcMain.handle('delitems',(event, code) =>{
  const del = db.prepare(`DELETE FROM items WHERE code = ?;`)
  const result = del.run(code);
  return {success: true, id: result.lastDeleteRowId};
});
ipcMain.handle('getitems', () => {
  const select = db.prepare(`SELECT * FROM items`);
  return select.all();

});
ipcMain.handle('finditems', (event, code)=>{
  const find = db.prepare(`SELECT * from items WHERE code = ?;`);
  return find.get(code);
});

ipcMain.handle('updateitems', (event, item)=>{
  const find = db.prepare(`UPDATE items
    SET name = ?, price = ?
    WHERE code = ?;
    `);
  const res = find.run(item.name,item.price, item.code);
  return {success: true,id : res.changes};
});
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
