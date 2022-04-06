module.exports = function (socket, io) {
  socket.on("send-message", (message, id) => {
    if (!socket?.lobby?.mute) {
      io.sockets.in(id).emit("receive-message", {
        id: socket.id,
        message: message,
        nickname: socket.nickname,
      });
    }
  });
};
