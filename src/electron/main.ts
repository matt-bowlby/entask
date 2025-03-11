import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import DataManager from "../classes/dataManager/DataManager";
import { Event, Task} from "../classes/thing/Thing";
import { IdHandler } from "../classes/calendar/IdHandler";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
    ? path.join(process.env.APP_ROOT, "public")
    : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
    win = new BrowserWindow({
        icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
        webPreferences: {
            preload: path.join(__dirname, "preload.mjs"),
        },
    });

    win.setMenuBarVisibility(false);

    // Test active push message to Renderer-process.
    win.webContents.on("did-finish-load", () => {
        win?.webContents.send(
            "main-process-message",
            new Date().toLocaleString()
        );
    });

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL);
    } else {
        // win.loadFile('dist/index.html')
        win.loadFile(path.join(RENDERER_DIST, "index.html"));
    }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
        win = null;
    }
});

app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.whenReady().then(createWindow);

//// For testing database ////

const myTestDataBase = new DataManager;

const myIDhandler = new IdHandler(myTestDataBase.loadIds());

const testEvent = new Event("EventTestName");
testEvent.completed = false;
myTestDataBase.saveEvent(testEvent);


const testTask = new Task("TaskTestName,",50);
testTask.completed = true;
myTestDataBase.saveTask(testTask);

const myCalendar = myTestDataBase.loadDatabase("myCalendar");

console.log(myCalendar.name);
let myThingList = myCalendar.getActiveThings();
let events = myThingList.getEvents();
let tasks = myThingList.getTasks();

for (let i = 0; i < events.length; i++) {
    console.log(events[i].name, "\n");
}
for (let i = 0; i < tasks.length; i++) {
    console.log(tasks[i].name, "\n");
}

myThingList = myCalendar.getCompletedThings();
events = myThingList.getEvents();
tasks = myThingList.getTasks();

for (let i = 0; i < events.length; i++) {
    console.log(events[i].name, "\n");
}
for (let i = 0; i < tasks.length; i++) {
    console.log(tasks[i].name, "\n");
}

myTestDataBase.saveIds(myIDhandler.getIds());

console.log(myIDhandler.getIds());