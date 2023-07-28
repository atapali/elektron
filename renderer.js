const information = document.getElementById("info");
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;

async function init() {
	const count = await config.get("counter");
	document.getElementById("sayac").innerText = count;

	const dark = await config.get("darkMode");
	document.getElementById("dark-mode-value").innerText = dark;

	const mode = darkMode ? "whitesmoke" : "dark";
	document.getElementById("body").style.cssText = `background-color: ${mode};`;
}

async function toggleDarkMode() {
	const darkMode = await config.get("darkMode");
	await config.set("darkMode", !darkMode);
}

async function addToCounter() {
	const counter = await config.get("counter");
	await config.set("counter", counter + 1);
}

setTimeout(() => {
	init();
}, 100);
