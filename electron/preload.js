import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
  // You can expose other APTs you need here.
  // ...
})
contextBridge.exposeInMainWorld('api', {
  additems: (item)=> ipcRenderer.invoke('additems', item),
  getitems: ()=> ipcRenderer.invoke('getitems'),
  delitems: (code)=> ipcRenderer.invoke('delitems', code),
  finditems: (code)=> ipcRenderer.invoke('finditems', code),
  updateitems: (item)=> ipcRenderer.invoke('updateitems', item),
  addtransaction: (item) => ipcRenderer.invoke('addtransaction',item),
  gettransactions: ()=>ipcRenderer.invoke('gettransactions'),
  getcategories: ()=> ipcRenderer.invoke('getcategories'),
  addcategory: (name) => ipcRenderer.invoke('addcategory',name),
  getexpenses: () =>ipcRenderer.invoke('getexpenses'),
  addexpense: (expense) => ipcRenderer.invoke('addexpense',expense),
  delexpense: (desc)=> ipcRenderer.invoke('delexpense', desc),
  updateexpense: (desc)=> ipcRenderer.invoke('updateexpense', desc),
});