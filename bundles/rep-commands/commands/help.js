'use strict';

const { Broadcast: B } = require('ranvier');

const { ROLES } = require('../../../lib/roles');

module.exports = {
  command: (state) => (args, player) => {
    const roleData = ROLES[player.metadata.role];

    B.sayAt(player, `You are a ${player.metadata.role}.`);
    B.sayAt(player, roleData.help);
    B.sayAt(player, `Use 'brief' to toggle brief descriptions on/off.`);
    B.sayAt(player, `Use 'score' to see your score and the leaderboard.`);
    B.sayAt(player, `Use 'quit' to safely quit.`);
    B.sayAt(player, `Type a direction to move.`);
  }
};
