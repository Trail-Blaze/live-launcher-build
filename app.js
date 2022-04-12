const { app, BrowserWindow, ipcMain } = require("electron");
const ipc = ipcMain;
const path = require("path");
const { cpuUsage } = require("process");
const version = "0.0.1A-RC";
const full_version = `BL Otto Launcher v${version}`;
const hotreload_base = "https://trail-blaze.github.io/Otto/";
let win;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
   // eslint-disable-line global-require
   app.quit();
}

const createWindow = () => {
   // Print out version to console once launched

   console.log(`Starting up...\nWelcome to ${full_version}!`);
   // Create the browser window.
   const mainWindow = new BrowserWindow({
      width: 1200,
      height: 750,
      minWidth: 1155,
      minHeight: 750,
      titleBarStyle: "hiddenInset",
      hasShadow: true,
      webPreferences: {
         nodeIntegration: true,
         contextIsolation: false,
         enableRemoteModule: true,
         // devTools: true,
         // preload: path.join(__dirname, "appFunctions.js"),
      },
   });

   // and load the index.html of the app.
   mainWindow.loadFile(hotreload_base);

   // Open the DevTools.
   // mainWindow.webContents.openDevTools();
   mainWindow.setOpacity(0.95);
   win = mainWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
   if (process.platform !== "darwin") {
      app.quit();
   }
});

app.on("activate", () => {
   // On OS X it's common to re-create a window in the app when the
   // dock icon is clicked and there are no other windows open.
   if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
   }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipc.on("reqPageSwitch", (event, data) => {
   console.log("Page Switch Requested.");
   win.loadFile(hotreload_base + "/" + data);
});

let currentState;

ipc.on("sendState", (event, data) => {
   currentState = data;
   console.log(`currentState = ${currentState}\n`);
});

// Send current state (package#)
// If nothing is saved it will send back nothing at all

ipc.on("reqState", (event, data) => {
   event.reply("sendState", currentState);
});

// Send out both the version number and full version name if requested

ipc.on("reqVer", () => {
   // win.webContents.send("version", version);
   win.webContents.send("full_version", full_version);
   console.log("App wants version");
});
