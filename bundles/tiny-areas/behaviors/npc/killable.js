'use strict';

const { handleNpcDeath } = require('../../../../lib/death');

module.exports = {
  listeners: {
    death: state => function (config) {
      handleNpcDeath(state, this);
    }
  }
};