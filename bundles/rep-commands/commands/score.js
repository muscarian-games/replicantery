'use strict';

const { Broadcast } = require('ranvier');

module.exports = {
  command: (state) => (args, player) => {
    const topTen = state.Leaderboard.getTopTenScores();
    const playerScore = player.account.getMeta('score');
    const say = m => Broadcast.sayAt(player, m);

    say(`Your score is ${playerScore}.`);

    say(`Top ten scores:`);
    let i = 1;
    for (const { name, score } of topTen) {
      say(`${i}) ${name} (Score: ${score})`);
      i++;
    }
  }
};
