import { app as l, ipcMain as s, BrowserWindow as u, screen as m } from "electron";
import { createRequire as L } from "node:module";
import { fileURLToPath as S } from "node:url";
import o from "node:path";
import { webcrypto as T } from "node:crypto";
const _ = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict", f = 128;
let i, E;
function h(t) {
  !i || i.length < t ? (i = Buffer.allocUnsafe(t * f), T.getRandomValues(i), E = 0) : E + t > i.length && (T.getRandomValues(i), E = 0), E += t;
}
function A(t = 21) {
  h(t |= 0);
  let e = "";
  for (let r = E - t; r < E; r++)
    e += _[i[r] & 63];
  return e;
}
const O = L(import.meta.url), d = o.dirname(S(import.meta.url));
process.env.APP_ROOT = o.join(d, "..");
const p = process.env.VITE_DEV_SERVER_URL, C = o.join(process.env.APP_ROOT, "dist-electron"), R = o.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = p ? o.join(process.env.APP_ROOT, "public") : R;
let a;
const g = O("better-sqlite3"), N = o.join(l.getPath("userData"), "billing.db"), n = new g(N);
n.exec("CREATE TABLE IF NOT EXISTS categories(name TEXT);");
n.exec(
  "CREATE TABLE IF NOT EXISTS items (category TEXT, name TEXT NOT NULL,code NUMBER PRIMARY KEY ,price NUMERIC NOT NULL, quantity NUMERIC, procurement_rate NUMERIC);"
);
n.exec(
  "CREATE TABLE IF NOT EXISTS transactions(tid TEXT PRIMARY KEY, cust_name TEXT, phone_no TEXT, amount NUMERIC NOT NULL, t_date DATETIME DEFAULT CURRENT_TIMESTAMP, ttype TEXT, notes TEXT, items_json TEXT);"
);
n.exec(
  "CREATE TABLE IF NOT EXISTS expenses(description TEXT, date DATETIME DEFAULT CURRENT_TIMESTAMP, amount NUMERIC, COMPLETED BOOLEAN DEFAULT false);"
);
s.handle("getexpenses", () => n.prepare("SELECT * FROM expenses;").all());
s.handle("addexpense", (t, e) => ({ success: !0, id: n.prepare("INSERT INTO expenses (description, date, amount) VALUES(?, ?, ?);").run(e.description, e.date, e.amount).lastInsertRowId }));
s.handle("updateexpense", (t, e) => ({ success: !0, id: n.prepare(`UPDATE expenses
    SET completed = true
    WHERE description = ?;
    `).run(e).changes }));
s.handle("delexpense", (t, e) => ({ success: !0, id: n.prepare("DELETE FROM expenses WHERE description = ?;").run(e).lastDeleteRowId }));
s.handle("addtransaction", (t, e) => {
  const r = A(10);
  return n.prepare(`INSERT INTO transactions(tid, cust_name, phone_no, amount,t_date, ttype, notes, items_json)
                              VALUES(?, ?, ?, ?, ?, ?, ?, ?);`).run(r, e.cust_name, e.phno, e.amount, (/* @__PURE__ */ new Date()).toISOString(), e.ttype, e.notes, e.items_json), r;
});
s.handle("gettransactions", () => n.prepare("SELECT * FROM transactions;").all());
s.handle("additems", (t, e) => ({ success: !0, id: n.prepare("INSERT INTO items (category, name, code, price, quantity, procurement_rate) VALUES(?, ?, ?, ?, ?, ?);").run(e.category, e.name, e.code, e.price, e.quantity, e.procurement_rate).lastInsertRowId }));
s.handle("addcategory", (t, e) => ({ success: !0, id: n.prepare("INSERT INTO categories (name) VALUES(?);").run(e).lastInsertRowId }));
s.handle("getcategories", () => n.prepare("SELECT * FROM categories;").all());
s.handle("delitems", (t, e) => ({ success: !0, id: n.prepare("DELETE FROM items WHERE code = ?;").run(e).lastDeleteRowId }));
s.handle("getitems", () => n.prepare("SELECT * FROM items;").all());
s.handle("finditems", (t, e) => n.prepare("SELECT * from items WHERE code = ?;").get(e));
s.handle("updateitems", (t, e) => ({ success: !0, id: n.prepare(`UPDATE items
    SET name = ?, price = ?, quantity = ?, category = ?, procurement_rate = ?
    WHERE code = ?;
    `).run(e.name, e.price, e.quantity, e.category, e.procurement_rate, e.code).changes }));
function I() {
  const { width: t, height: e } = m.getPrimaryDisplay().workAreaSize;
  a = new u({
    width: t,
    height: e,
    title: "IvenBill",
    icon: o.join(d, "public", "icon.png"),
    webPreferences: {
      preload: o.join(d, "preload.mjs")
    }
  }), a.webContents.on("did-finish-load", () => {
    a == null || a.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), p ? a.loadURL(p) : a.loadFile(o.join(R, "index.html"));
}
l.on("window-all-closed", () => {
  process.platform !== "darwin" && (l.quit(), a = null);
});
l.on("activate", () => {
  u.getAllWindows().length === 0 && I();
});
l.whenReady().then(I);
export {
  C as MAIN_DIST,
  R as RENDERER_DIST,
  p as VITE_DEV_SERVER_URL
};
