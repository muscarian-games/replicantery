'use strict';
const { Broadcast: B } = require('ranvier');

const { generateCodename } = require('../../lib/codenames');
const { getRandomRole, ROLES } = require('../../lib/roles');

module.exports = {
  listeners: {

    /** Handle setting up the character's codename, role, & other game-related info. */
    login: state => function () {
      const randomName = generateCodename();
      if (!this.metadata.points) {
        this.metadata.points = 0;
      }

      // Set game-based metadata
      this.metadata.name = randomName;
      this.metadata.role = getRandomRole();
      const roleData = ROLES[this.metadata.role];

      // Inform player of their role
      B.sayAt(player, `You are a ${this.metadata.role}.`);
      B.sayAt(player, roleData.help);
    },

    /**
     * Handle a player movement command. From: 'commands' input event.
     * movementCommand is a result of CommandParser.parse
     */
    move: state => function (movementCommand) {
      const { roomExit } = movementCommand;

      if (!roomExit) {
        return B.sayAt(this, "You can't go that way!");
      }

      const nextRoom = state.RoomManager.getRoom(roomExit.roomId);
      const oldRoom = this.room;

      const door = oldRoom.getDoor(nextRoom) || nextRoom.getDoor(oldRoom);

      if (door) {
        if (door.locked) {
          return B.sayAt(this, "The door is locked.");
        }

        if (door.closed) {
          return B.sayAt(this, "The door is closed.");
        }
      }

      this.moveTo(nextRoom, _ => {
        state.CommandManager.get('look').execute('', this);
      });

      B.sayAt(oldRoom, `${this.name} leaves.`);
      B.sayAtExcept(nextRoom, `${this.name} enters.`, this);
    },

    /**
     * Increment or decrement the character's points
     */
    point: state => function (amount = 1) {
      if (isNaN(this.metadata.points)) {
        Logger.warn(`Player ${this.name} had invalid points.`);
        this.metadata.points = 0;
      }

      const suffix = Math.abs(amount) > 1 ? 's' : ''

      this.metadata.points = this.metadata.points + amount;
      B.sayAt(this, `You have earned ${amount} point${suffix}. (Total: ${this.metadata.points})`);
    },

    /** Save the player character file. */
    save: state => async function (callback) {
      await state.PlayerManager.save(this);
      if (typeof callback === 'function') {
        callback();
      }
    },
  },
};
