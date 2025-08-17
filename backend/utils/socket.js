const userSockets = new Map(); 

function registerSocket(io) {
  io.on('connection', (socket) => {
    const userId = socket.handshake.auth?.userId;
    if (userId) {
      const set = userSockets.get(userId) || new Set();
      set.add(socket.id);
      userSockets.set(userId, set);
    }

    socket.on('disconnect', () => {
      if (userId) {
        const set = userSockets.get(userId);
        if (set) {
          set.delete(socket.id);
          if (set.size === 0) userSockets.delete(userId);
        }
      }
    });
  });
}

function emitToUsers(io, userIds, event, payload) {
  userIds.forEach((id) => {
    const set = userSockets.get(String(id));
    if (set) {
      set.forEach((sid) => io.to(sid).emit(event, payload));
    }
  });
}

module.exports = { registerSocket, emitToUsers };