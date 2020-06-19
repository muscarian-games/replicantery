const { Broadcast: B } = require('ranvier');

/**
 * Alerts all players in game of skill use, also giving the distance in blocks n/e/s/w.
 * @param state GameState
 * @param player Player
 * @param audible String - what you want them to 'hear'
 */
module.exports = function alertAreaWithDistance(state, player, audible) {
  const hereCoords = player.room.coordinates;

  // Inform others in area of the skill use
  for (const [key, other] of state.PlayerManager.players) {
    if (other.room === player.room) continue;
    const thereCoords = other.room.coordinates;
    // Try to keep it so positive = East/North
    const distanceX = thereCoords.x - hereCoords.x;
    const distanceY = hereCoords.y - thereCoords.y;

    const xDirection = distanceX >= 0 ? 'west' : 'east';
    const yDirection = distanceY >= 0 ? 'north' : 'south';

    const alertString = `You hear the sound of <bold>${audible}</bold> from ${
      distanceX ? `${Math.abs(distanceX)} blocks ${xDirection} ` : ''
    }${
      distanceY ? `${distanceX ? 'and ' : ''}${Math.abs(distanceY)} blocks ${yDirection}` : ''
    }!`;

    B.sayAt(other, alertString);
  }
}