'use strict';

const { Broadcast: B } = require('ranvier');

const getOtherCharactersInRoom = require('../lib/getOtherCharactersInRoom');

module.exports = {
  command: (state) => (args, player) => {
    if (player.metadata.role !== 'detective') {
      return B.sayAt(player, 'Who are you to accuse anyone?');
    }

    // If no args, ask for a target.
    if (!args) {
      return B.sayAt(player, 'Who are you accusing?');
    }

    // Try to find target of accusation based on args.
    const { room } = player;

    const characters = getOtherCharactersInRoom(room, player);

    if (!characters.length) {
      return B.sayAt(player, 'There is no one else here... paranoid much?');
    }

    const target = characters.find(char => char.metadata.name.toLowerCase().includes(args.toLowerCase()));
    if (!target) {
      return B.sayAt(player, `There is no one called '${args}' here. Perhaps a figment of your imagination?`);
    }

    const targetCodename = target.metadata.name;
    const playerCodename = player.metadata.name;
    B.sayAt(player, `You accuse ${targetCodename} of being a replicant!`);

    // Handle the consequences of the accusation.
    if (target.metadata.role === 'replicant') {
      B.sayAt(player, `They must be a replicant! Your scanner melts them down to a puddle of goo.`);
      if (!target.isNpc) {
        B.sayAt(target, `${playerCodename} fires their scanner at you! You're doomed!`);
      }
      B.sayAtExcept(player.room, `${playerCodename} fires their scanner at ${targetCodename}. ${targetCodename} melts into a gooey pile of machinery!`, [player, target]);
      player.emit('point');
      target.emit('death');
    } else {
      // TODO: Player cannot accuse for 30s
      B.sayAt(player, `Having wrongly accused ${targetCodename}, your replicant scanner malfunctions!`);
      target.emit('point');
      player.emit('point', -1);
      if (!target.isNpc) {
        B.sayAt(target, `${playerCodename} fires their scanner at you! It starts to malfunction.`);
      }
      B.sayAtExcept(player.room, `${playerCodename} fires their scanner at ${targetCodename}. The scanner starts emitting sparks as it refuses to melt an organic human!`, [player, target]);
      target.emit('accused', player);
    }
  }
};
