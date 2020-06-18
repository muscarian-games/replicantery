"use strict";

const { Account } = require("ranvier");

module.exports = {
  event: state => (socket, {account}) => {
    socket.write(`Please enter your account's email:\r\n(It must be a valid address or you will be unable to recover your password in case it is lost.\r\n)`);

    socket.once("data", data => {
      const email = data.toString("utf8").trim().toLowerCase();
      account.setMeta('email', email);
      return socket.emit("create-character", socket, {account});
    });
  }
};

