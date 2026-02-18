const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const { Server } = socketio;
const { spawn } = require('child_process');
const ip = require('ip');
const path = require('path');
const { app } = require('electron');

const expressApp = express();
const server = http.createServer(expressApp);
// Force WebSocket transport to avoid polling delay
const io = new Server(server, {
    transports: ['websocket']
});

// Serve static files from 'public' directory
expressApp.use(express.static(path.join(__dirname, 'public')));

// --- Native C# Key Sender ---
let ps;

function initKeySender() {
    // In Electron production, extraResources are in process.resourcesPath
    // In development, they are in the project root
    const isPackaged = app && app.isPackaged;
    const keySenderPath = isPackaged
        ? path.join(process.resourcesPath, 'KeySender.exe')
        : path.join(__dirname, 'KeySender.exe');

    ps = spawn(keySenderPath);

    ps.stdin.setEncoding('utf-8');
    ps.on('error', (err) => {
        console.error('KeySender process error:', err);
        console.log(`Ensure KeySender.exe is at: ${keySenderPath}`);
    });

    process.on('exit', () => ps.kill());
}
// ----------------------------

const pressKey = (keyString) => {
    if (!ps) return;
    // Send command to KeySender.exe
    ps.stdin.write(keyString + '\n');
};

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('slide-next', () => {
        console.log('Next Slide');
        pressKey('{RIGHT}');
    });

    socket.on('slide-prev', () => {
        console.log('Previous Slide');
        pressKey('{LEFT}');
    });

    socket.on('play-pause', () => {
        console.log('Play/Pause');
        pressKey(' '); // Spacebar
    });
});

const PORT = 3000;

function startServer() {
    initKeySender();
    server.listen(PORT, () => {
        const localIp = ip.address();
        const url = `http://${localIp}:${PORT}`;

        console.log(`\nServer running on ${url}`);
        console.log('Mobile device should connect to this URL.\n');

        // We don't need qrcode-terminal anymore as it's shown in Electron GUI
    });

    return { url: `http://${ip.address()}:${PORT}` };
}

module.exports = { startServer };
