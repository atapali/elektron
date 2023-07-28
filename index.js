"use strict";
const path = require("path");
const { app, BrowserWindow, Menu, ipcMain } = require("electron");

/// const {autoUpdater} = require('electron-updater');
const { is } = require("electron-util");
const unhandled = require("electron-unhandled");
const debug = require("electron-debug");
const contextMenu = require("electron-context-menu");
const config = require("./config.js");
const menu = require("./menu.js");

unhandled();
debug();
contextMenu();

// Note: Must match `build.appId` in package.json
app.setAppUserModelId("com.company.AppName");

// Uncomment this before publishing your first version.
// It's commented out as it throws an error if there are no published versions.
// if (!is.development) {
// 	const FOUR_HOURS = 1000 * 60 * 60 * 4;
// 	setInterval(() => {
// 		autoUpdater.checkForUpdates();
// 	}, FOUR_HOURS);
//
// 	autoUpdater.checkForUpdates();
// }

// Prevent window from being garbage collected
let mainWindow;

const createMainWindow = async () => {
	const window_ = new BrowserWindow({
		title: app.name,
		show: false,
		width: 600,
		height: 400,
		webPreferences: { preload: path.join(__dirname, "preload.js") },
	});

	window_.on("ready-to-show", () => {
		window_.show();
	});

	window_.on("closed", () => {
		// Dereference the window
		// For multiple windows store them in an array
		mainWindow = undefined;
	});

	await window_.loadFile(path.join(__dirname, "index.html"));

	return window_;
};

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
	app.quit();
}

app.on("second-instance", () => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}

		mainWindow.show();
	}
});

app.on("window-all-closed", () => {
	if (!is.macos) {
		app.quit();
	}
});

app.on("activate", async () => {
	if (!mainWindow) {
		mainWindow = await createMainWindow();
	}
});

config.onDidChange("showPreferences", () => {
	const preference = config.get("showPreferences");
	mainWindow.webContents.executeJavaScript(`
		document.getElementById("preferences").hidden = ${!preference};
		`);
});

config.onDidChange("darkMode", () => {
	const preference = config.get("darkMode");
	mainWindow.webContents.executeJavaScript(`
		document.getElementById("dark-mode-value").innerText = ${preference};
	`);
	const mode = preference ? "whitesmoke" : "dark";
	mainWindow.webContents.executeJavaScript(`
		document.getElementById("body").style.cssText = "background-color: ${mode};";
	`);
});

config.onDidChange("counter", () => {
	const counter = config.get("counter");
	mainWindow.webContents.executeJavaScript(`
	document.getElementById("sayac").innerText = ${counter};
	`);
});

(async () => {
	await app.whenReady();

	Menu.setApplicationMenu(menu);
	mainWindow = await createMainWindow();

	ipcMain.handle("config.get", (event, key) => {
		return config.get(key);
	});

	ipcMain.handle("config.set", (event, key, value) => {
		return config.set(key, value);
	});

	const favoriteAnimal = config.get("favoriteAnimal");
	mainWindow.webContents.executeJavaScript(
		`document.querySelector('header p').textContent = 'Your favorite animal is ${favoriteAnimal}'`
	);
})();
