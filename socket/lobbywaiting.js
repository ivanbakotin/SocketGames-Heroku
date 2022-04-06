const global = require("../utils/global.js");

module.exports = function (socket, io) {
  socket.on("enter-waiting", (id) => {
    io.sockets.in(id).emit("player-waiting", {
      id: socket.id,
      nickname: socket.nickname,
      lobby: socket.lobby,
    });
  });

  socket.on("accept-request", (player_id, id) => {
    if (global.checkIfHost(socket, id)) {
      const player_socket = io.sockets.sockets.get(player_id);

      player_socket.join(id);

      player_socket.lobby = {
        room: id,
        id: player_id,
        host: false,
        accepted: true,
        mute: false,
        ready: false,
      };

      player_socket.emit("accepted");

      global.getUsers(io, id);
    }
  });

  socket.on("decline-request", (player_id, id) => {
    if (global.checkIfHost(socket, id)) {
      const player_socket = io.sockets.sockets.get(player_id);
      player_socket.emit("declined");
    }
  });
};
