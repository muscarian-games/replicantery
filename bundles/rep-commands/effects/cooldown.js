'use strict';

/**
 * Effect placed on characters after being scanned.
 * This gradually reveals their role to whoever scans them, and stacks.
 * After 3 scans, their role is revealed with 100% confidence to anyone who scans them.
 * The effects last for 60 seconds so detectives would have to scan them 3 times within a minute.
 */

module.exports = {
  config: {
    name: 'Cooldown',
    type: 'cooldown',
    persists: false,
  }
};