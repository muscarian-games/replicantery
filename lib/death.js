module.exports = {
  handleNpcDeath
};

function handleNpcDeath(state, npc) {
  state.MobManager.removeMob(npc);
}
