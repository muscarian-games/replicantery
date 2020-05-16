'use strict';

const { Logger } = require('ranvier');
const { generateCodename } = require('../../../../lib/codenames');
const { getRandomRole } = require('../../../../lib/roles');

module.exports = {
  listeners: {
    spawn: state => function (config = {}) {
      if (!this.metadata) {
        this.metadata = {};
      }

      this.metadata.name = generateCodename();
      this.metadata.role = config.role || getRandomRole();
      Logger.log(`Added ${this.metadata.name} as ${this.metadata.role}.`);
    }
  }
};