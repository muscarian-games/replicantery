
module.exports = getAllEffectsByType

/**
 * Pass in the effects list and a type string and get all effects of that type.
 */
function getAllEffectsByType(effectsList, type) {
  return [...effectsList.effects].filter(effect => {
    return effect.config.type === type;
  });
}
