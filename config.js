"use strict";
const Store = require("electron-store");

module.exports = new Store({
	defaults: {
		favoriteAnimal: "🦄",
		showPreferences: false,
		darkMode: false,
		counter: 0,
	},
});
