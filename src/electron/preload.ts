import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...
})

//expose global window.electronAPI for font-end by contextBridge
contextBridge.exposeInMainWorld('electronAPI', {
  loadCalendar: async (calendarName: string) => {
    return await ipcRenderer.invoke("load-calendar", calendarName);
  },
});

// declare the window.electronAPI, nor the font-end can't access electronAPI
declare global {
  interface Window {
    electronAPI: {
      loadCalendar: (calendarName: string) => Promise<any>;
    }
  }
}