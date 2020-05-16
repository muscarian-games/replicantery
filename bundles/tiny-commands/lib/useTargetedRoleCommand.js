const { Broadcast: B } = require('ranvier');
const getOtherCharactersInRoom = require('./getOtherCharactersInRoom');

/**
 * {
 *    target: target || null,
 *    failure: failureMessage || null
 * }
 */

/**
 * For generically handling a command that is targeted
 * at another character, and requires a specific role.
 */
module.exports = function useTargetedRoleCommand({
  args,
  invalidArgsMessage,
  invalidRoleMessage,
  noOneHereMessage,
  targetNotFoundMessage,
  player,
  requiredRole,
  successCallback,
}) {
  if (player.metadata.role !== requiredRole) {
    return B.sayAt(player, invalidRoleMessage);
  }

  // If no args, ask for a target.
  if (!args) {
    return B.sayAt(player, invalidArgsMessage);
  }

  // Try to find target of scan based on args.
  const { room } = player;

  const characters = getOtherCharactersInRoom(room, player);

  if (!characters.length) {
    return B.sayAt(player, noOneHereMessage);
  }

  const target = characters.find(char => char.metadata.name.toLowerCase().includes(args.toLowerCase()));
  if (!target) {
    return B.sayAt(player, targetNotFoundMessage.replace('%name%', `'${args}'`));
  }

  successCallback(player, target);
};