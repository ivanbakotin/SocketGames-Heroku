const global = require("../utils/global.js");
const crypto = require("crypto");

module.exports = function (socket, io) { 
  socket.on('setup-lobby', () => {
    let id;

    do {
      id = crypto.randomBytes(16).toString('hex');
    } while (global.checkLobbyExists(io, id))

    socket.join(id);

    socket.lobby = { 
      room: id,
      id: socket.id,
      host: true, 
      accepted: true,
      mute: false,
      ready: false,
    };

    socket.emit("send-link", id);
  })

  socket.on("leave-lobby", id => {
    //check if host if yes assign one
    if (global.checkIfHost(socket, id)) {

    }

    socket.lobby = { 
      room: null,
      id: socket.id,
      host: false, 
      accepted: false,
      mute: false,
      ready: false,
    };

    socket.leave(id);
    global.getUsers(io, id);
  })

  socket.on("kick-player", (player_id, id) => {
    if (global.checkIfHost(socket, id)) {
      const player_socket = io.sockets.sockets.get(player_id);
  
      player_socket.leave(id);
  
      player_socket.emit("kicked");
  
      player_socket.lobby = { 
        room: null,
        id: player_id,
        host: false, 
        accepted: false,
        mute: false,
        ready: false,
      };
  
      global.getUsers(io, id);
    }
  })

  socket.on("set-mute", (player_id, id) => {
    if (global.checkIfHost(socket, id)) {
      const player_socket = io.sockets.sockets.get(player_id);
      player_socket.lobby.mute = !player_socket.lobby.mute;
      global.getUsers(io, id);
    }
  })

  socket.on("set-ready", id => {
    socket.lobby.ready = !socket.lobby.ready;
    global.getUsers(io, id);
  })

  socket.on("start-game", id => {
    if (global.checkReady(io, id)) {
      io.sockets.in(id).emit('navigate-game');
    }
  })
}