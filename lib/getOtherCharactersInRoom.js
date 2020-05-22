const _ = require('lodash');

module.exports = function getOtherCharacterInRoom(room, player) {
  // We want a random-order list of all chars except us.
  const characters = _.shuffle(
    [...room.players.values(), ...room.npcs.values()]
  );

  if (player) {
    return characters.filter(c => player !== c)
  }

  return characters;
}