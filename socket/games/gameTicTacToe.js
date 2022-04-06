function checkRow(board, socket) {
  for (let i = 0; i < 9; i += 3) {
    let win = 0;
    let column = i;
    for (let j = 0; j < 3; j++) {
      if (socket.sign === board[column].sign) {
        win++;
      }
      column++;
    }
    if (win === 3) {
      return true;
    }
  }
  return false;
}

function checkColumn(board, socket) {
  for (let i = 0; i < 3; i++) {
    let win = 0;
    for (let j = i; j < 9; j += 3) {
      if (socket.sign === board[j].sign) {
        win++;
      }
    }
    if (win === 3) {
      return true;
    }
  }
  return false;
}

function checkDiagonal(board, socket) {
  let win = 0;
  for (let i = 0; i < 9; i += 4) {
    if (socket.sign === board[i].sign) {
      win++;
    }
    if (win === 3) {
      return true;
    }
  }

  win = 0;
  for (let i = 2; i < 7; i += 2) {
    if (socket.sign === board[i].sign) {
      win++;
    }
    if (win === 3) {
      return true;
    }
  }

  return false;
}

function checkGame(socket, io, id, board) {
  if (
    checkRow(board, socket) ||
    checkColumn(board, socket) ||
    checkDiagonal(board, socket)
  ) {
    socket.score++;
    io.sockets.in(id).emit("game-over-tic");
    updatePlayers(io, id);
    return;
  } else {
    for (const tile of board) {
      if (!tile.sign) {
        return;
      }
    }
  }

  io.sockets.in(id).emit("game-over-tic");
}

function updatePlayers(io, id) {
  const clients = io.sockets.adapter.rooms.get(id);

  if (clients) {
    const users = [];

    for (const clientId of clients) {
      const clientSocket = io.sockets.sockets.get(clientId);

      users.push({
        nickname: clientSocket.nickname,
        sign: clientSocket.sign,
        move: clientSocket.move,
        score: clientSocket.score,
      });
    }

    io.sockets.in(id).emit("get-players", users);
  }
}

module.exports = function (socket, io) {
  let board = [
    { sign: "" },
    { sign: "" },
    { sign: "" },
    { sign: "" },
    { sign: "" },
    { sign: "" },
    { sign: "" },
    { sign: "" },
    { sign: "" },
  ];

  socket.on("tic-tac-toe-setup", (id) => {
    const clients = io.sockets.adapter.rooms.get(id);

    if (clients) {
      const users = [];

      let i = 0;

      for (const clientId of clients) {
        const clientSocket = io.sockets.sockets.get(clientId);

        clientSocket.score = 0;

        if (i) {
          clientSocket.sign = "X";
          clientSocket.move = true;
        } else {
          clientSocket.sign = "O";
          clientSocket.move = false;
        }

        users.push({
          nickname: clientSocket.nickname,
          sign: clientSocket.sign,
          move: clientSocket.move,
          score: clientSocket.score,
        });

        i++;
      }

      io.sockets.in(id).emit("get-players", users);
      io.sockets.in(id).emit("move-made-tic", board);
    }
  });

  socket.on("make-move-tic", (index, id) => {
    if (socket.move && !board[index].sign) {
      socket.move = false;
      board[index].sign = socket.sign;

      checkGame(socket, io, id, board);

      socket.broadcast.to(id).emit("update-board", board);
      socket.broadcast.to(id).emit("send-move");
      io.sockets.in(id).emit("move-made-tic", board);
    }
  });

  socket.on("set-move", (id) => {
    socket.move = true;
    updatePlayers(io, id);
  });

  socket.on("set-board", (data) => {
    board = data;
  });

  socket.on("reset-game-tic", (id) => {
    board = [
      { sign: "" },
      { sign: "" },
      { sign: "" },
      { sign: "" },
      { sign: "" },
      { sign: "" },
      { sign: "" },
      { sign: "" },
      { sign: "" },
    ];

    socket.broadcast.to(id).emit("update-board", board);
    io.sockets.in(id).emit("move-made-tic", board);
  });
};
