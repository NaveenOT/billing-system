import { ipcMain, app, BrowserWindow, screen } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { webcrypto } from "node:crypto";
const urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
const POOL_SIZE_MULTIPLIER = 128;
let pool, poolOffset;
function fillPool(bytes) {
  if (!pool || pool.length < bytes) {
    pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER);
    webcrypto.getRandomValues(pool);
    poolOffset = 0;
  } else if (poolOffset + bytes > pool.length) {
    webcrypto.getRandomValues(pool);
    poolOffset = 0;
  }
  poolOffset += bytes;
}
function nanoid(size = 21) {
  fillPool(size |= 0);
  let id = "";
  for (let i = poolOffset - size; i < poolOffset; i++) {
    id += urlAlphabet[pool[i] & 63];
  }
  return id;
}
const require2 = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
const Database = require2("better-sqlite3");
const db = new Database("billing.db");
db.exec(`CREATE TABLE IF NOT EXISTS categories(name TEXT);`);
db.exec(
  `CREATE TABLE IF NOT EXISTS items (category TEXT, name TEXT NOT NULL,code NUMBER PRIMARY KEY ,price NUMERIC NOT NULL, quantity NUMERIC, procurement_rate NUMERIC);`
);
db.exec(
  `CREATE TABLE IF NOT EXISTS transactions(tid TEXT PRIMARY KEY, cust_name TEXT, phone_no TEXT, amount NUMERIC NOT NULL, t_date DATETIME DEFAULT CURRENT_TIMESTAMP, ttype TEXT, notes TEXT, items_json TEXT);`
);
db.exec(
  `CREATE TABLE IF NOT EXISTS expenses(description TEXT, date DATETIME DEFAULT CURRENT_TIMESTAMP, amount NUMERIC, COMPLETED BOOLEAN DEFAULT false);`
);
ipcMain.handle("getexpenses", () => {
  const select = db.prepare(`SELECT * FROM expenses;`);
  return select.all();
});
ipcMain.handle("addexpense", (event, expense) => {
  const insert = db.prepare(`INSERT INTO expenses (description, date, amount) VALUES(?, ?, ?);`);
  const res = insert.run(expense.description, expense.date, expense.amount);
  return { success: true, id: res.lastInsertRowId };
});
ipcMain.handle("updateexpense", (event, expense) => {
  const find = db.prepare(`UPDATE expenses
    SET completed = true
    WHERE description = ?;
    `);
  const res = find.run(expense);
  return { success: true, id: res.changes };
});
ipcMain.handle("delexpense", (event, desc) => {
  const del = db.prepare(`DELETE FROM expenses WHERE description = ?;`);
  const result = del.run(desc);
  return { success: true, id: result.lastDeleteRowId };
});
ipcMain.handle("addtransaction", (event, item) => {
  const tid = nanoid(10);
  const insert = db.prepare(`INSERT INTO transactions(tid, cust_name, phone_no, amount, ttype, notes, items_json)
                              VALUES(?, ?, ?, ?, ?, ?, ?);`);
  insert.run(tid, item.cust_name, item.phno, item.amount, item.ttype, item.notes, item.items_json);
  return tid;
});
ipcMain.handle("gettransactions", () => {
  const select = db.prepare(`SELECT * FROM transactions;`);
  return select.all();
});
ipcMain.handle("additems", (event, item) => {
  const insert = db.prepare(`INSERT INTO items (category, name, code, price, quantity, procurement_rate) VALUES(?, ?, ?, ?, ?, ?);`);
  const result = insert.run(item.category, item.name, item.code, item.price, item.quantity, item.procurement_rate);
  return { success: true, id: result.lastInsertRowId };
});
ipcMain.handle("addcategory", (event, name) => {
  const insert = db.prepare(`INSERT INTO categories (name) VALUES(?);`);
  const res = insert.run(name);
  return { success: true, id: res.lastInsertRowId };
});
ipcMain.handle("getcategories", () => {
  const select = db.prepare(`SELECT * FROM categories;`);
  return select.all();
});
ipcMain.handle("delitems", (event, code) => {
  const del = db.prepare(`DELETE FROM items WHERE code = ?;`);
  const result = del.run(code);
  return { success: true, id: result.lastDeleteRowId };
});
ipcMain.handle("getitems", () => {
  const select = db.prepare(`SELECT * FROM items;`);
  return select.all();
});
ipcMain.handle("finditems", (event, code) => {
  const find = db.prepare(`SELECT * from items WHERE code = ?;`);
  return find.get(code);
});
ipcMain.handle("updateitems", (event, item) => {
  const find = db.prepare(`UPDATE items
    SET name = ?, price = ?, quantity = ?, category = ?, procurement_rate = ?
    WHERE code = ?;
    `);
  const res = find.run(item.name, item.price, item.quantity, item.category, item.procurement_rate, item.code);
  return { success: true, id: res.changes };
});
function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    width,
    height,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
