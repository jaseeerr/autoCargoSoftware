const { app, BrowserWindow, session } = require('electron');
const { exec } = require('child_process');
const treeKill = require('tree-kill');
const path = require('path');
const net = require('net');


let mainWindow;
let backendProcess;
let frontendProcess;

function createWindow() {
  session.defaultSession.clearStorageData({
    storages: ['appcache', 'cookies', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers'],
  });

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'pglog.jpg'),
    webPreferences: {
      nodeIntegration: false, // Consider disabling nodeIntegration
      contextIsolation: true, // Enable context isolation for security
      preload: path.join(__dirname, 'preload.js') // Path to preload script
    },
  });

  mainWindow.loadURL('http://localhost:5173');

  mainWindow.on('closed', function () {
    mainWindow = null;
    killProcesses();
  });

  startProcesses();

 
}


async function startProcesses(){
  const port1234InUse = await isPortTaken(1234);
  const port3000InUse = await isPortTaken(3000);

  if (port1234InUse) {
    console.error('Port 1234 is already in use.');
   
  }
  else
  {
    console.error('Port 1234 is already in use.');

    startProcessesFront()
  }

  if (port3000InUse) {
    console.error('Port 3000 is already in use.');
  
  }
  else
  {
    console.log("starting 3000 server")
    startProcessesBack()
  }
}

function startProcessesBack() {
  // backendProcess = exec('npm start', { cwd: 'C:\\logs\\sys\\backendManager\\server' }, (error, stdout, stderr) => {
    // C:\Users\toble\OneDrive\Desktop\autoCargo
    backendProcess = exec('npm start', { cwd: 'C:\\Users\\toble\\OneDrive\\Desktop\\autoCargo\\server' }, (error, stdout, stderr) => {
   
    if (error) {
      console.error('Failed to start backend process:', error);
    }
    console.log(`Backend process stdout: ${stdout}`);
    console.error(`Backend process stderr: ${stderr}`);
  });

  // backendProcess = exec('npm start', { cwd: 'C:\\Windows\\sysFile\\backendManager\\server' }, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error('Failed to start backend process:', error);
  //   }
  //   console.log(`Backend process stdout: ${stdout}`);
  //   console.error(`Backend process stderr: ${stderr}`);
  // });

 
}

function startProcessesFront() {
 

  // frontendProcess = exec('npm start', { cwd: 'C:\\logs\\sys\\backendManager\\Client' }, (error, stdout, stderr) => {
    frontendProcess = exec('npm run dev', { cwd: 'C:\\Users\\toble\\OneDrive\\Desktop\\autoCargo\\Client' }, (error, stdout, stderr) => {

    if (error) {
      console.error('Failed to start frontend process:', error);
    }
    console.log(`Frontend process stdout: ${stdout}`);
    console.error(`Frontend process stderr: ${stderr}`);
  });

  // frontendProcess = exec('npm start', { cwd: 'C:\\Windows\\sysFile\\backendManager\\Client' }, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error('Failed to start frontend process:', error);
  //   }
  //   console.log(`Frontend process stdout: ${stdout}`);
  //   console.error(`Frontend process stderr: ${stderr}`);
  // });
}

function isPortTaken(port) {
  return new Promise((resolve) => {
    const tester = net.createServer()
      .once('error', () => resolve(true))
      .once('listening', () => tester.once('close', () => resolve(false)).close())
      .listen(port);
  });
}

function killProcesses() {
  if (backendProcess) {
    treeKill(backendProcess.pid, 'SIGKILL', (err) => {
      if (err) console.error('Failed to kill backend process:', err);
    });
  }
  if (frontendProcess) {
    treeKill(frontendProcess.pid, 'SIGKILL', (err) => {
      if (err) console.error('Failed to kill frontend process:', err);
    });
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
