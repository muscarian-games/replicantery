'use strict';
const _ = require('lodash');
const { Broadcast: B, Logger } = require('ranvier');

const getOtherCharactersInRoom = require('../lib/getOtherCharactersInRoom');

module.exports = {
  command: state => function (args, player) {
    if (!player.room) {
      Logger.error(player.name + ' is in limbo.');
      return B.sayAt(player, 'You are in a deep, dark void.');
    }

    const { room } = player;

    B.sayAt(player, room.title);
    B.sayAt(player, room.description, 80);

    const characters = getOtherCharactersInRoom(room, player);
    
    if (characters.length) {
      const charactersList = _.map(characters, 'metadata.name').join(', ');
      B.sayAt(player, `Here you find: ${charactersList}.`);
    } else {
      B.sayAt(player, 'No one else is here. You\'re safe for now.');
    }

    for (const item of room.items) {
      B.sayAt(player, `[Item] ${item.roomDesc}`);
    }

    const exits = room.getExits();
    const foundExits = [];

    // prioritize explicit over inferred exits with the same name
    for (const exit of exits) {
      if (foundExits.find(fe => fe.direction === exit.direction)) {
        continue;
      }

      foundExits.push(exit);
    }

    B.at(player, 'Exits: ');
    B.at(player, foundExits.map(exit => {
      const exitRoom = state.RoomManager.getRoom(exit.roomId);
      const door = room.getDoor(exitRoom) || exitRoom.getDoor(room);
      if (door && (door.locked || door.closed)) {
        return '(' + exit.direction + ')';
      }

      return exit.direction;
    }).join(' '));

    if (!foundExits.length) {
      B.at(player, 'none');
    }
  },
};
