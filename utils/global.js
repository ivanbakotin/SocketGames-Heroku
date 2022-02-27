function getUsers(io, id) {

  const clients = io.sockets.adapter.rooms.get(id);

  if (clients) {
    
    const users = [];
  
    for (const clientId of clients ) {
      const clientSocket = io.sockets.sockets.get(clientId);

      users.push({ 
        id: clientId, 
        nickname: clientSocket.nickname, 
        lobby: clientSocket.lobby,
      });
    }
    
    io.sockets.in(id).emit('get-users', users);
  } 
}

function checkReady(io, id) {
  const clients = io.sockets.adapter.rooms.get(id);
  
  for (const clientId of clients ) {
    const clientSocket = io.sockets.sockets.get(clientId);
    if (!clientSocket.lobby.ready) {
      return false;
    }
  }

  return true;
}

function checkLobbyExists(io, id) {
  const rooms = io.sockets.adapter.rooms;

  for (const [key, value] of Object.entries(rooms)) {
    if (key == id) {
      return true;
    }
  }

  return false;
}

function checkIfHost(socket, id) {
  return socket?.lobby?.host && socket?.lobby?.room == id;
}

module.exports = { getUsers, checkReady, checkLobbyExists, checkIfHost };