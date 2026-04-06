require('dotenv').config();
const http       = require('http');
const { Server } = require('socket.io');
const app        = require('./app');
const connectDB  = require('./config/db');
const initSockets= require('./sockets');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

initSockets(io);

connectDB().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
