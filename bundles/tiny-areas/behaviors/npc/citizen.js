'use strict';

const { Logger } = require('ranvier');
const { generateCodename } = require('../../../../lib/codenames');

module.exports = {
  listeners: {
    spawn: state => function (config) {
      if (!this.metadata) {
        this.metadata = {};
      }

      this.metadata.name = generateCodename();
      this.metadata.role = 'citizen';
      Logger.log(`Added ${this.metadata.name} as citizen.`);
    }
  }
};