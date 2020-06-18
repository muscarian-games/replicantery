'use strict';

const { Broadcast: B } = require('ranvier');

const { ROLES } = require('../../../lib/roles');

module.exports = {
  command: (state) => (args, player) => {
    return;
    // const role = Object.keys(ROLES).find(rolename => rolename === args);

    // if (!role) {
    //   return B.sayAt(player, 'Invalid role.');
    // }

    // player.metadata.role = role;
    // B.sayAt(player, 'Role set to: ' + role);
  }
};
