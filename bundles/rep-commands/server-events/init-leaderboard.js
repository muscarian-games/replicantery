'use strict';
const _ = require('lodash');
const fs = require('fs');
const { Data, Logger } = require('ranvier');

module.exports = {
  listeners: {
    startup: state => async function () {
      Logger.log('Loading all accounts');
      const accountPathFull = Data.getDataFilePath('account', '');
      const accountPathLastSlashIndex = accountPathFull.lastIndexOf('/');
      const accountPath = accountPathFull.slice(0, accountPathLastSlashIndex + 1);
      const allAccountNames = fs.readdirSync(accountPath)
        .filter(name => name.endsWith('.json'))
        .map(name => _.first(name.split('.')));

      Logger.log('Loading ' + allAccountNames);

      for (const accountName of allAccountNames) {
        await state.AccountManager.loadAccount(accountName)
      }

      Logger.log('Setting up leaderboard');

      state.Leaderboard.initialize(state);

      console.log(state.Leaderboard.getTopNScores(3));
    },
  }
};
