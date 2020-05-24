const _ = require('lodash');

module.exports = function getScannedAmount(target) {
  const scannedEffectOnTarget = target.effects.getByType('scanned');
  const scannedAmount = _.get(scannedEffectOnTarget, 'state.stacks', 0);
  return scannedAmount
};
