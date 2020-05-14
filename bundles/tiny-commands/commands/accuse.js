'use strict';

const { Broadcast: B } = require('ranvier');

const getOtherCharactersInRoom = require('../lib/getOtherCharactersInRoom');

module.exports = {
  command: (state) => (args, player) => {
    // If no args, ask for a target.
    if (!args) {
      return B.sayAt(player, 'Who are you accusing?');
    }

    const { room } = player;

    const characters = getOtherCharactersInRoom(room, player);

    if (!characters.length) {
      return B.sayAt(player, 'There is no one else here... paranoid much?');
    }

    const characterAccused = characters.find(char => char.metadata.name.toLowerCase().includes(args.toLowerCase()));
    if (!characterAccused) {
      return B.sayAt(player, `There is no one called '${args}' here. Perhaps a figment of your imagination?`);
    }

    const accusedCodename = characterAccused.metadata.name;
    B.sayAt(player, `You accuse ${accusedCodename} of being a replicant!`);

    if (characterAccused.metadata.role === 'replicant') {
      B.sayAt(player, `They must be a replicant! Your scanner melts them down to a puddle of goo.`);
      player.emit('point');
      characterAccused.emit('death');
    } else {
      B.sayAt(player, `Having wrongly accused ${accusedCodename}, your replicant scanner self-destructs!`);
      characterAccused.emit('point');
      player.emit('death')
    }

    // Player factions: Replicant Hunter vs. Replicant Helper
    // NPC factions: Human Citizen, Replicant Spy
  }
};
