const {
  Menu,
  shell,
  ipcMain,
  globalShortcut,
  app,
  dialog,
} = require("electron");
const { BrowserWindow } = require("electron/main");
const fs = require("fs");

function saveFileHandler() {
  console.log("Saving the file...");
  const window = BrowserWindow.getFocusedWindow();
  window.webContents.send("editor-event", "save");
}

function loadFileHandler() {
  const parentWindow = BrowserWindow.getFocusedWindow();

  const options = {
    title: "Pick a markdown file",
    filters: [
      { name: "Markdown files", extensions: ["md"] },
      {
        name: "Text files",
        extensions: ["txt"],
      },
    ],
  };

  dialog.showOpenDialog(parentWindow, options).then((res) => {
    const { _, filePaths } = res;
    if (filePaths.length > 0) {
      const content = fs.readFileSync(filePaths[0]).toString();
      parentWindow.webContents.send("load", content);
    }
  });
}

app.on("ready", () => {
  globalShortcut.register("CommandOrControl+S", saveFileHandler);

  globalShortcut.register("CommandOrControl+O", loadFileHandler);
});

ipcMain.on("editor-reply", (_, data) => {
  console.log(`Received reply from web page: ${data}`);
});

ipcMain.on("save", (_, data) => {
  console.log("Saving content of the file");
  console.log(data);

  const parentWindow = BrowserWindow.getFocusedWindow();
  const options = {
    title: "Save markdown file",
    filters: [
      {
        name: "MyFile",
        extensions: ["md"],
      },
    ],
  };

  dialog.showSaveDialog(parentWindow, options).then((res) => {
    const { canceled, filePath } = res;

    if (!canceled) {
      console.log(`Saving content to the file: ${filePath}`);
      fs.writeFileSync(filePath, data);
    }
  });
});

const template = [
  {
    label: "File",
    submenu: [
      {
        label: "Open",
        accelerator: "CommandOrControl+O",
        click: loadFileHandler,
      },
      {
        label: "Save",
        accelerator: "CommandOrControl+S",
        click: saveFileHandler,
      },
    ],
  },
  {
    label: "Format",
    submenu: [
      {
        label: "Toggle Bold",
        click() {
          const window = BrowserWindow.getFocusedWindow();
          window.webContents.send("editor-event", "toggle-bold");
        },
      },
    ],
  },
  {
    role: "help",
    submenu: [
      {
        label: "About Editor Component",
        click() {
          shell.openExternal("https://simplemde.com/");
        },
      },
    ],
  },
];

if (process.env.DEBUG) {
  template.push({
    label: "Debugging",
    submenu: [
      {
        label: "Dev Tools",
        role: "toggleDevTools",
      },
      {
        type: "separator",
      },
      {
        role: "reload",
        accelerator: "Alt+R",
      },
    ],
  });
}

if (process.platform === "darwin") {
  template.unshift({
    label: app.getName(),
    submenu: [{ role: "about" }, { type: "separator" }, { role: "quit" }],
  });
}

const menu = Menu.buildFromTemplate(template);

module.exports = menu;
