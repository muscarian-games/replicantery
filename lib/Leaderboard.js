const _ = require('lodash');
const { Logger } = require('ranvier');

module.exports = class Leaderboard {
  constructor() {
    this.scores = new Map();
  }

  /**
   * Given the game state, initialize a leaderboard based on pre-existing account scores.
   * Not optimitized at the moment, but if needed we could add an algorithm to only keep top ten scores,
   * etc.
   * @param {GameState} state 
   */
  initialize(state) {
    for (const [accountName, account] of state.AccountManager.accounts) {
      const character = _.first(account.characters);
      if (!character) {
        Logger.warn(`No character found for account ${accountName}. Weird, huh?`);
        continue;
      }

      const name = character.username;
      const score = this.getScoreFromAccount(account);
      this.set(name, score);
    }
  }

  /**
   * Gets the top n scores...
   * @param {number} n scores to get
   * @returns {Array<{name: string, score: number}>} top scores
   */
  getTopNScores(n) {
    return _.chain([...this.scores.entries()])
      .map(([name, score]) => ({ name, score }))
      .sortBy(({name, score}) => -score)
      .take(n)
      .value();
  }

  /**
   * Easy-to-remember alias for getTopNScores(10)
   */
  getTopTenScores() {
    return this.getTopNScores(10);
  }

  /**
   * Gets the score from an account obj, defaults to 0.
   * @param {Account} account 
   */
  getScoreFromAccount(account) {
    return account.metadata.points || 0;
  }

  /**
   * Sets the name and score on an internal map
   * @param {string} name 
   * @param {number} score 
   */
  set (name, score) {
    this.scores.set(name, score);
  }

  /**
   * Sets the score properly given just a character object.
   * @param {Character} character 
   * @returns {Boolean} success
   */
  setScore (character) {
    const account = character.account;
    if (!account) {
      Logger.warn(`No account found for character ${character.name} -- weird!!`);
      return false;
    }

    const score = this.getScoreFromAccount(account);
    this.set(character.name, score);
    return true;
  }
}