const jwt = require('jsonwebtoken');
const engineManager = require('../services/engineManager');

function initSockets(io) {
  // Authenticate socket with JWT
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = (socket.user._id || socket.user.id)?.toString();

    if (!userId) {
      console.log(`Socket rejected: invalid token payload for socket ${socket.id}`);
      socket.disconnect();
      return;
    }

    const room = `user:${userId}`;
    socket.join(room);

    const engine = engineManager.getEngine(userId);

    console.log(`Socket connected: ${socket.id}, user: ${userId}`);

    // Send this user's current state immediately
    socket.emit('simulation:state', engine.getSnapshot());

    // Broadcast only to this user's room
    engine.onTick = (snapshot) => {
      io.to(room).emit('simulation:tick', snapshot);
    };

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}, user: ${userId}`);
    });
  });
}

module.exports = initSockets;