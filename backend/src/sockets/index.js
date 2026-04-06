const jwt    = require('jsonwebtoken');
const engine = require('../services/engineInstance');

/**
 * Attach Socket.IO to the HTTP server.
 * Clients authenticate via handshake token, then receive live tick snapshots.
 */
function initSockets(io) {
  // Auth middleware for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Send current state immediately on connect
    socket.emit('simulation:state', engine.getSnapshot());

    // Wire engine tick callback to broadcast to all clients
    engine.onTick = (snapshot) => {
      io.emit('simulation:tick', snapshot);
    };

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}

module.exports = initSockets;
