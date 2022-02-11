const path = require("path")
const express = require("express");
const http = require("http");
const port = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
const crypto = require("crypto");

const io = require("socket.io")(server)

app.use(express.static(path.join(__dirname, "build")));

app.get( `*`, (req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

function getUsers(io, id) {

  const clients = io.sockets.adapter.rooms.get(id);

  if (clients) {
    const users = [];
  
    for (const clientId of clients ) {
      const clientSocket = io.sockets.sockets.get(clientId);
      users.push({ id: clientId, nickname: clientSocket.nickname, ready: clientSocket.ready, counter: clientSocket.counter });
    }
      
    io.sockets.in(id).emit('get-users', users);
  } 
}

function checkReady(io, id) {
  const clients = io.sockets.adapter.rooms.get(id);
  
  for (const clientId of clients ) {
    const clientSocket = io.sockets.sockets.get(clientId);
    if (!clientSocket.ready) {
      return false;
    }
  }

  return true;
}

io.on("connection", socket => {

  const token = crypto.randomBytes(4).toString('hex');
  socket.nickname = "Player" + token;

  socket.on("set-nickname", (nickname, id) => {
    socket.nickname = nickname;
    if (id) getUsers(io, id);
  })

  socket.on('get-link', () => {
    const id = crypto.randomBytes(16).toString('hex');
    socket.emit("send-link", id);
  })

  socket.on("join-room", id => {
    socket.ready = false;
    socket.counter = 0;
    socket.join(id);
    getUsers(io, id);
  })

  socket.on("send-users", id => {
    getUsers(io, id);
  })

  socket.on("set-ready", id => {
    socket.ready = !socket.ready ;
    getUsers(io, id);
  })

  socket.on("start-game", id => {
    if (checkReady(io, id)) {
      io.sockets.in(id).emit('navigate-game');
    }
  })

  socket.on("leave-lobby", id => {
    socket.leave(id);
    getUsers(io, id);
  })

  socket.on('drawing', (data) => io.sockets.in(data.id).emit('drawing', data));

})

server.listen(port, () => console.log(`Listening on port ${port}`));

//remove player from lobby as host
//declare host
//dont display button
// maybe game list then game
