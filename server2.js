// server.js 또는 app.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:5173', // 클라이언트의 URL을 명시합니다.
        methods: ['GET', 'POST'],
    },
});

// CORS 미들웨어 추가
app.use(cors());

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('chatting', (data) => {
        io.emit('chatting', data);
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(7000, () => {
    console.log('Server is running on port 7000');
});
