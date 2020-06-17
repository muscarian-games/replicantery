'use strict';

const { Random } = require('rando-js');
const { Broadcast: B, Logger } = require('ranvier');

const { getRandomRole } = require('../../../lib/roles');
const alertAreaWithDistance = require('../lib/alertAreaWithDistance');
const getHumanOrReplicantRole = require('../lib/getHumanOrReplicantRole');
const getScannedAmount = require('../lib/getScannedAmount');

module.exports = {
  name: 'Scan',

  cooldown: {
    group: 'detective',
    length: 5
  },

  options: {
    invalidArgsMessage: 'Who would you like to scan?',
    invalidRoleMessage: 'You would need a detective\'s scanner.',
    noOneHereMessage: 'There is no one else here to scan, and you are fairly sure you\'re not a replicant.',
    targetNotFoundMessage: 'There is no one here called %name%.',
    requiredRole: 'detective'
  },

  requiresTarget: true,

  run: (state) => (args, player, target) => {
    const targetCodename = target.metadata.name;
    const playerCodename = player.metadata.name;
    B.sayAt(player, `You scan ${targetCodename} for evidence of replicantery!`);

    // Scanning places a scanned effect on the target.
    // Scanning 3 times (3 stacked effects) will reveal the role with 100% confidence.
    // Scanning places an effect on the player which reveals them as a detective, though.
    const scannedEffect = state.EffectFactory.create(
      'scanned',
    );
    target.addEffect(scannedEffect);


    B.sayAt(target, `You have been scanned by ${playerCodename}.`);
    B.sayAtExcept(player.room, `${playerCodename} scans ${targetCodename}!`, [player, target]);

    const scannedAmount = getScannedAmount(target);
    alertAreaWithDistance(state, player, 'a scanner operating');

    if (scannedAmount >= 3) {
      if (scannedAmount > 3) {
        Logger.warn('More than 3 scans stacked on target ' + target.name);
      }

      const roleType = getHumanOrReplicantRole(target.metadata.role);
      B.sayAt(player, `You are 100% confident that they are a ${roleType}!`);
    } else if (scannedAmount === 2) {
      const correctGuess = Random.probability(75);
      const roleGuess = correctGuess ? target.metadata.role : getRandomRole();
      const roleTypeGuess = getHumanOrReplicantRole(roleGuess);
      B.sayAt(player, `You are 75% confident that they are a ${roleTypeGuess}.`);
    } else {
      const correctGuess = Random.probability(50);
      const roleGuess = correctGuess ? target.metadata.role : getRandomRole();
      const roleTypeGuess = getHumanOrReplicantRole(roleGuess);
      B.sayAt(player, `You are 50% confident that they are a ${roleTypeGuess}.`);
    }

  }
};