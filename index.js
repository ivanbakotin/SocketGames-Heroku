const path = require("path")
const express = require("express");
const http = require("http");
const port = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server)

app.use(express.static(path.join(__dirname, "build")));

app.get( `*`, (req, res, next) => {
 res.sendFile(path.join(__dirname, "build", "index.html"));
});

io.on("connection", socket => {
  require('./socket/global.js')(socket, io);
  require('./socket/lobbyplayers.js')(socket, io);
  require('./socket/lobbychat.js')(socket, io);
  require('./socket/lobbywaiting.js')(socket, io);
  require('./socket/games/gameTicTacToe.js')(socket, io);
  require('./socket/games/gameRGB.js')(socket, io);
})

server.listen(port, () => console.log(`Listening on port ${port}`));

//fix lobby requests player update
//forbid taken nickname in group
//leave lobby on return fix in game
