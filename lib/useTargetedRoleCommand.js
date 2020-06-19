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
  args = '',
  invalidArgsMessage = 'Please specify a target.',
  invalidRoleMessage = 'You can\'t do that.',
  noOneHereMessage = 'No one else is here.',
  targetNotFoundMessage = 'No luck finding %name%.',
  player,
  requiredRole,
}) {
  if (requiredRole && player.metadata.role !== requiredRole) {
    return {
      failure: invalidRoleMessage
    };
  }

  // If no args, ask for a target.
  if (!args) {
    return {
      failure: invalidArgsMessage
    };
  }

  // Try to find target of command based on args.
  const { room } = player;

  const characters = getOtherCharactersInRoom(room, player);

  if (!characters.length) {
    return {
      failure: noOneHereMessage
    }
  }

  const target = characters.find(char => char.metadata.name.toLowerCase().includes(args.toLowerCase()));
  if (!target) {
    return {
      failure: targetNotFoundMessage.replace('%name%', `'${args}'`)
    }
  }

  return {
    target
  };
};