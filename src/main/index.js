import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
const sqlite3 = require('sqlite3').verbose();
// const isDev = require('electron-is-dev');

// import Database from 'better-sqlite3';

// const {sqlite3} = require('sqlite3').verbose();

// const db = new sqlite3.Database(path.join(__dirname, 'test.db'), (err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log('Connected to the test database.');
// }
// );

// export function connect() {
//   return Database(
//     path.join(__dirname, '../../../', 'release/app', 'mydb.db'),
//     { verbose: console.log, fileMustExist: true },
//   );
// }

let db;

function initializeDatabase() {
    const dbPath = path.join(app.getPath('userData'), 'lodge_data.db'); // Store in user data directory
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            return console.error("Database opening error: ",err.message);
        }
        console.log('Connected to the SQLite database.');
        db.run(`
            CREATE TABLE IF NOT EXISTS rooms (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                description TEXT,
                price INTEGER,
                images TEXT
            )
        `);
        //Create other tables here
    });
}

// connect();
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  initializeDatabase();
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

ipcMain.handle('get-rooms-offline', async () => {
  return new Promise((resolve, reject) => {
      db.all('SELECT * FROM rooms', [], (err, rows) => {
          if(err) reject(err)
          resolve(rows)
      })
  })
})

ipcMain.handle('save-rooms-offline', async (event, rooms) => {
  try {
      const stmt = db.prepare('INSERT OR REPLACE INTO rooms (id, name, description, price, images) VALUES (?, ?, ?, ?, ?)');
      for (const room of rooms) {
          await new Promise((resolve, reject) => {
              stmt.run(room.id, room.name, room.description, room.price, room.images, (err) => {
                  if (err) {
                      reject(err);
                  } else {
                      resolve();
                  }
              });
          });
      }
      stmt.finalize();
      return { success: true };
  } catch (error) {
    console.error("Error saving rooms offline:", error);
    return { success: false, error: error.message };
  }
})