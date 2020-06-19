const { Random } = require('rando-js');
const ROLES = Object.freeze({
  detective: {
    help: `It's up to you to patrol the mean streets and catch replicants. Use 'scan' to check citizens for replicantery, and then 'accuse' ones that seem suspicious!`
  },

  replicant: {
    help: `You are a replicant trying to blend in with the human citizens. You can 'zap' citizens with your lazer eyes to get rid of pesky detectives, but they will glow for a minute after! Use 'scan' to make sure you don't zap fellow replicants.`
  },
});

module.exports = {
  getRandomRole,
  ROLES
};



function getRandomRole() {
  return Random.fromArray(Object.keys(ROLES));
}
