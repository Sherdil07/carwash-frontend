const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Optional, if you have a preload script
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadURL("http://localhost:3000"); // Load your Next.js app
}

app.whenReady().then(() => {
  // Start the Node server
  const server = spawn("node", ["server/server.js"], {
    shell: true,
    stdio: "inherit", // This will inherit the output of the server
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      server.kill(); // Kill the server when the app is closed
      app.quit();
    }
  });
});

app.on("ready", createWindow);
