import { app, BrowserWindow, ipcMain, screen } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { nanoid } from 'nanoid'


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
/*
try{
  db.exec('SELECT quantity from items LIMI 1').get();
}catch(e){
  db.exec('ALTER TABLE items ADD COLUMN quantity NUMERIC DEFAULT 0');
  db.exec('UPDATE items SET quantity = 0 where quantity IS NULL');
}
*/
db.exec(
  `CREATE TABLE IF NOT EXISTS items (name VARCHAR NOT NULL,code NUMBER PRIMARY KEY ,price NUMERIC NOT NULL, quantity NUMERIC);`
  );
db.exec(
  `CREATE TABLE IF NOT EXISTS transactions(tid TEXT PRIMARY KEY, cust_name TEXT, phone_no TEXT, amount NUMERIC NOT NULL, t_date DATETIME DEFAULT CURRENT_TIMESTAMP, ttype TEXT, notes TEXT, items_json TEXT);`
);

ipcMain.handle('addtransaction', (event, item)=>{
  const tid = nanoid(10);
  const insert = db.prepare(`INSERT INTO transactions(tid, cust_name, phone_no, amount, ttype, notes, items_json)
                              VALUES(?, ?, ?, ?, ?, ?, ?);`)
  insert.run(tid, item.cust_name, item.phno, item.amount, item.ttype, item.notes, item.items_json);
  return tid;
});
ipcMain.handle('gettransactions', ()=>{
  const select = db.prepare(`SELECT * FROM transactions`);
  return select.all();
});
ipcMain.handle('additems', (event, item) => {
  const insert = db.prepare(`INSERT INTO items (name, code, price, quantity) VALUES(?, ?, ?, ?);`)
  const result = insert.run(item.name, item.code, item.price, item.quantity);
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
    SET name = ?, price = ?, quantity = ? 
    WHERE code = ?;
    `);
  const res = find.run(item.name,item.price,item.quantity, item.code,);
  return {success: true,id : res.changes};
});
function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    width: width,
    height: height,
    
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

