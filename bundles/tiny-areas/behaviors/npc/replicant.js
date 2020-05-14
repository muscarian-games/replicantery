'use strict';

const { Logger } = require('ranvier');
const { generateCodename } = require('../../../../lib/codenames');
const { handleNpcDeath } = require('../../../../lib/death');

module.exports = {
  listeners: {
    death: state => function (config) {
      handleNpcDeath(state, this);
    },

    spawn: state => function (config) {
      if (!this.metadata) {
        this.metadata = {};
      }

      this.metadata.name = generateCodename();
      this.metadata.role = 'replicant';
      Logger.log(`Added ${this.metadata.name} as replicant.`);
    }
  }
};