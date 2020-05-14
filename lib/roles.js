const { Random } = require('rando-js');
const ROLES = Object.freeze({
  detective: {
    help: `It's up to you to patrol the mean streets and catch replicants. Use 'scan' to check citizens for replicantery, and then 'accuse' ones that seem suspicious!`
  },

  replicant: {
    help: `You are a replicant trying to blend in with the human citizens. You can 'zap' citizens with your lazer eyes to get rid of pesky detectives, but they will glow for a minute after!`
  },

  saboteur: {
    help: `You are a part of the human resistance trying to free the replicants. It is up to you to bait detectives into making false accusations.`
  }
});

module.exports = {
  getRandomRole,
  ROLES
};



function getRandomRole() {
  return Random.fromArray(Object.keys(ROLES));
}
