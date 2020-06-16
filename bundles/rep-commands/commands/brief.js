'use strict';

const { Broadcast: B } = require('ranvier');


module.exports = {
  command: (state) => (args, player) => {
    const brief = !player.getMeta('brief');
    player.setMeta('brief', brief);
    player.save(() => {
      B.sayAt(player, 'Brief descriptions set to: ' + brief);
    });
  }
};
