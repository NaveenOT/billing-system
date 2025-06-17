"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
  // You can expose other APTs you need here.
  // ...
});
electron.contextBridge.exposeInMainWorld("api", {
  additems: (item) => electron.ipcRenderer.invoke("additems", item),
  getitems: () => electron.ipcRenderer.invoke("getitems"),
  delitems: (code) => electron.ipcRenderer.invoke("delitems", code),
  finditems: (code) => electron.ipcRenderer.invoke("finditems", code),
  updateitems: (item) => electron.ipcRenderer.invoke("updateitems", item),
  addtransaction: (item) => electron.ipcRenderer.invoke("addtransaction", item)
});
