import { ipcMain, app, BrowserWindow } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
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
db.exec(
  `CREATE TABLE IF NOT EXISTS items (name VARCHAR NOT NULL,code NUMBER PRIMARY KEY ,price NUMERIC NOT NULL);`
);
ipcMain.handle("additems", (event, item) => {
  const insert = db.prepare(`INSERT INTO items (name, code, price) VALUES(?, ?, ?)`);
  const result = insert.run(item.name, item.code, item.price);
  return { success: true, id: result.lastInsertRowId };
});
ipcMain.handle("delitems", (event, code) => {
  const del = db.prepare(`DELETE FROM items WHERE code = ?;`);
  const result = del.run(code);
  return { success: true, id: result.lastDeleteRowid };
});
ipcMain.handle("getitems", (event) => {
  const select = db.prepare(`SELECT * FROM items`);
  return select.all();
});
function createWindow() {
  win = new BrowserWindow({
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
