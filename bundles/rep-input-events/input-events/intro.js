'use strict';

module.exports = {
  event: state => socket => {
    socket.write("Welcome to Replicantery!\r\n");
    return socket.emit('login', socket);
  },
};
