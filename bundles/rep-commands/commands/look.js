'use strict';
const _ = require('lodash');
const { Broadcast: B, Logger } = require('ranvier');

const getHumanOrReplicantRole = require('../lib/getHumanOrReplicantRole');
const getOtherCharactersInRoom = require('../../../lib/getOtherCharactersInRoom');
const getScannedAmount = require('../lib/getScannedAmount');

const ROLE_EXPOSED_TEXT = {
  human: 'is sweating',
  replicant: 'has glowing eyes',
};

module.exports = {
  aliases: ['l'],
  command: state => function (args, player) {
    if (!player.room) {
      Logger.error(player.name + ' is in limbo.');
      return B.sayAt(player, 'You are in a deep, dark void.');
    }

    const { room } = player;

    B.sayAt(player, `${room.title}`);
    // ${room.entityReference} ${JSON.stringify(room.coordinates)}
    if (!player.getMeta('brief')) {
      B.sayAt(player, room.description, 80);
    }

    const characters = getOtherCharactersInRoom(room, player);
    
    if (characters.length) {
      const charactersList = _.map(characters, (char) => {
        const name = _.get(char, 'metadata.name');
        if (char.hasEffectType('cooldown') || getScannedAmount(char) >= 3) {
          const roleType = getHumanOrReplicantRole(char.metadata.role);
          return `${name} ${ROLE_EXPOSED_TEXT[roleType]}`;
        }
        return name;
      }).join(', ');
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
