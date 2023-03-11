const { app, BrowserWindow } = require("electron");

let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  //   win.loadFile("index.html");
  //   win.loadURL(`file://${__dirname}/build/index.html`);
  //   win.loadURL("http://localhost:3000"); // enable live reloading

  if (process.env.DEBUG) {
    win.loadURL("http://localhost:3000"); // enable live reloading
  } else {
    win.loadURL(`file://${__dirname}/build/index.html`);
  }

  win.on("closed", () => {
    win = null;
  });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform === "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
