'use strict';

/**
 * Effect placed on detectives after scanner usage that reveals them for 30 seconds.
 */
module.exports = {
  config: {
    name: 'Used Scanner',
    duration: 30 * 1000,
    refreshes: true,
  }
};