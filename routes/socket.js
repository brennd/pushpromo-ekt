
// export function for listening to the socket
module.exports = function (socket) {

  // broadcast a user's message to other users
  socket.on('send:product', function (data) {
    socket.broadcast.emit('receive:product', data);
  });


};
