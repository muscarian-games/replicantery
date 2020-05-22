'use strict';

const { Broadcast: B } = require('ranvier');

const useTargetedRoleCommand = require('../lib/useTargetedRoleCommand');

const FAILED_ZAP_MESSAGE = {
  citizen: 'They were an innocent!',
  saboteur: 'In the pile of ashes you see the badge of the resistance! Oh no.'
};

module.exports = {
  name: 'Zap',

  cooldown: {
    group: 'replicant',
    length: 15
  },

  requiresTarget: true,
  
  run: (state) => (args, player) => {
  
    const {target, failure} = useTargetedRoleCommand({
      args,
      invalidArgsMessage: 'Who are you trying to fry?',
      invalidRoleMessage:  'You squint really hard but no lasers shoot out of your eyes.',
      targetNotFoundMessage: `There is no one called '%name%' here. Perhaps you've experienced a glitch in your wiring?`,
      player,
      requiredRole: 'replicant'
    });

    if (failure) {
      return B.sayAt(player, failure);
    }

    const targetCodename = target.metadata.name;
    const playerCodename = player.metadata.name;
    B.sayAt(player, `You fire a lazer at ${targetCodename}!`);

    // Zapping anyone reveals the zapper.
    // Zapping another replicant reveals you both.
    // Zapping any human kills them.
    // If detective, zapper gains a point.
    // Else, lose a point.

    // Handle the consequences of the accusation.
    if (target.metadata.role === 'replicant') {
      B.sayAt(player, `They are a fellow replicant! Their eyes glow red as their defense systems activate.`);
      if (!target.isNpc) {
        B.sayAt(target, `${playerCodename}'s eyes light up as they zap you! You're exposed!`);
      }

      B.sayAtExcept(player.room, `${playerCodename}'s eyes light up as they zap ${targetCodename}. ${targetCodename}'s eyes glow red as they dispel the laser beam!`, [player, target]);
      player.emit('point', -1);
    } else { // Handle zaps vs. human targets
      B.sayAt(player, `Your eyes emit a horrific laser and ${targetCodename} melts into a pile of bones and ash!`);
      if (!target.isNpc) {
        B.sayAt(target, `${playerCodename} looks at you, and their eyes emit a horrible light! You combust in nanoseconds.`);
      }
      B.sayAtExcept(player.room, `${playerCodename}'s eyes light up as they zap ${targetCodename}. The victim melts into a pile of bones and ash!`, [player, target]);
      if (target.metadata.role === 'detective') {
        player.emit('point');
      } else {
        const failureMessage = FAILED_ZAP_MESSAGE[target.metadata.role];
        if (failureMessage) {
          B.sayAt(player, failureMessage);
        }
        player.emit('point', -1);
      }

      target.emit('death');
    }
  }
};
