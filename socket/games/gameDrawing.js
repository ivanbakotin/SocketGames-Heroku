module.exports = function (socket, io) { 
  socket.on('drawing', (data) => io.sockets.in(data.id).emit('drawing', data));
}