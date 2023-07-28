const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("config", {
	get: (key) => ipcRenderer.invoke("config.get", key),
	set: (key, value) => ipcRenderer.invoke("config.set", key, value),
});

contextBridge.exposeInMainWorld("versions", {
	node: () => process.versions.node,
	chrome: () => process.versions.chrome,
	electron: () => process.versions.electron,
	// we can also expose variables, not just functions
});
