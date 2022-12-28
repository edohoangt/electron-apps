const { app, BrowserWindow, Menu, shell, ipcMain } = require("electron");
const path = require("path");

const menuItemsTempl = [
  {
    label: "Menu",
    submenu: [
      {
        label: "About",
        click: async () => {
          await shell.openExternal("https://github.com");
        },
      },
    ],
  },
  {
    label: "File",
    submenu: [
      {
        label: "Open Camera",
        click: async () => {
          const newWin = new BrowserWindow({
            height: 500,
            width: 800,
            show: false,
            webPreferences: {
              preload: path.join(__dirname, "cameraPreload.js"),
            },
          });

          ipcMain.on("close-camera-window", () => {
            newWin.close();
          });

          //   newWin.webContents.openDevTools();
          newWin.loadFile("camera.html");
          newWin.once("ready-to-show", () => {
            newWin.show();
          });
        },
      },
      {
        label: "New Window",
        click: async () => {
          const newWin = new BrowserWindow({
            height: 300,
            width: 400,
            show: false,
            backgroundColor: "#2e2c29",
            movable: false,
          });

          //   newWin.loadFile("new-window.html");
          //   newWin.loadURL("https://github.com");
          newWin.once("ready-to-show", () => {
            newWin.show();
          });
        },
      },
      {
        label: "Learn More",
      },
      {
        type: "separator",
      },
      {
        label: "Exit",
        click: () => {
          app.quit();
        },
      },
    ],
  },
  {
    label: "Window",
    submenu: [
      {
        role: "minimize",
      },
      {
        role: "close",
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(menuItemsTempl);
Menu.setApplicationMenu(menu);

const createWindow = () => {
  const win = new BrowserWindow({
    height: 500,
    width: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.on("set-image", (event, data) => {
    // console.log(data);
    win.webContents.send("image-to-renderer", data);
  });

  //   win.openDevTools();
  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
