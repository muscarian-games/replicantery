'use strict';
const { Broadcast: B, Config, Logger } = require('ranvier');

const { generateCodename } = require('../../lib/codenames');
const { getRandomRole, ROLES } = require('../../lib/roles');

const REVERSE_DIRECTION_MAP = {
  east: 'west',
  north: 'south',
  west: 'east',
  south: 'north',
  northeast: 'southwest',
  southwest: 'northeast',
  southeast: 'northwest',
  northwest: 'southeast',
};

module.exports = {
  listeners: {
    /**
     * Handles player death.
     * Emits #login once again to respawn.
     */
    death: state => {
      const startingRoomRef = Config.get('startingRoom');
      if (!startingRoomRef) {
        Logger.error('No startingRoom defined in ranvier.json');
      }

      return function (killer) {
       let home = state.RoomManager.getRoom(startingRoomRef);
       this.moveTo(home, () => {
        B.sayAt(this, 'You died!');
        B.sayAt(this,'The system has brought you back in a new role...');
        this.emit('login');
       });
     };
   },

    /** 
     * Called on login AND respawn.
     * Handle setting up the character's codename, role, 
     * & other game-related info. 
     * */
    login: state => function () {
      const randomName = generateCodename();
      if (!this.metadata.points) {
        this.metadata.points = 0;
      }

      // Set game-based metadata.
      this.metadata.name = randomName;
      this.metadata.role = getRandomRole();

      // Inform player of their role.
      state.CommandManager.get('help').execute('', this);

      // Inform others in room of arrival.
      B.sayAtExcept(this.room, `${randomName} arrives, seemingly from thin air.`, [this]);
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

      B.sayAt(oldRoom, `${this.metadata.name} leaves ${roomExit.direction}.`);
      B.sayAtExcept(nextRoom, `${this.metadata.name} enters from the ${REVERSE_DIRECTION_MAP[roomExit.direction]}.`, this);
    },

    /**
     * Increment or decrement the character's points
     */
    point: state => function (amount = 1) {
      if (isNaN(this.account.metadata.points)) {
        Logger.warn(`Player ${this.name} had invalid points.`);
        this.account.metadata.points = 0;
      }

      const suffix = Math.abs(amount) > 1 ? 's' : '';

      this.account.metadata.points = this.account.metadata.points + amount;
      const verb = amount > 0 ? 'earned' : 'lost';
      B.sayAt(this, `You have ${verb} ${Math.abs(amount)} point${suffix}. (Total: ${this.account.metadata.points})`);
      state.Leaderboard.setScore(this);
      console.log(state.Leaderboard.getTopNScores(10));
      
      this.emit('save', () => this.account.save());
    },

    /** Save the player character file. */
    save: state => async function (callback) {
      await state.PlayerManager.save(this);
      Logger.log('Saved ' + this.name);
      if (typeof callback === 'function') {
        callback();
      }
    },
  },
};
