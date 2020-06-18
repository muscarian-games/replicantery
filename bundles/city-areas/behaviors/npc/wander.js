'use strict';

/**
 * An example behavior that causes an NPC to wander around an area when not in combat
 * Options:
 *   areaRestricted: boolean, true to restrict the NPC's wandering to his home area. Default: false
 *   restrictTo: Array<EntityReference>, list of room entity references to restrict the NPC to. For
 *     example if you want them to wander along a set path
 *   interval: number, delay in seconds between room movements. Default: 20
 */


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

module.exports = srcPath => {
  const { Random } = require('rando-js');
  const Broadcast = require(srcPath + 'Broadcast');
  const Logger = require(srcPath + 'Logger');

  return {
    listeners: {
      updateTick: state => function (config) {
        if (this.isInCombat() || !this.room || this._aggroWarned || this.following) {
          return;
        }

        if (config === true) {
          config = {};
        }

        config = Object.assign({
          areaRestricted: false,
          restrictTo: null,
          interval: 20,
        }, config);

        if (!this._lastWanderTime) {
          this._lastWanderTime = Date.now();
        }

        if (Date.now() - this._lastWanderTime < config.interval * 1000) {
          return;
        }

        this._lastWanderTime = Date.now();
        let possibleRooms = {};
        for (const possibleExit of this.room.exits) {
          possibleRooms[possibleExit.direction] = possibleExit.roomId;
        }

        const coords = this.room.coordinates;
        if (coords) {
          // find exits from coordinates
          const area = this.room.area;
          const directions = {
            north: [0, 1, 0],
            south: [0, -1, 0],
            east: [1, 0, 0],
            west: [-1, 0, 0],
            up: [0, 0, 1],
            down: [0, 0, -1],
          };

          for (const [dir, diff] of Object.entries(directions)) {
            const room = area.getRoomAtCoordinates(coords.x + diff[0], coords.y + diff[1], coords.z + diff[2]);
            if (room) {
              possibleRooms[dir] = room.entityReference;
            }
          }
        }

        const [direction, roomId] = Random.fromArray(Object.entries(possibleRooms));
        const randomRoom = state.RoomManager.getRoom(roomId);

        const door = this.room.getDoor(randomRoom) || randomRoom.getDoor(this.room);
        if (randomRoom && door && (door.locked || door.closed)) {
          // maybe a possible feature where it could be configured that they can open doors
          // or even if they have the key they can unlock the doors
          Logger.verbose(`NPC [${this.uuid}] wander blocked by door.`);
          return;
        }

        if (
          !randomRoom ||
          (config.restrictTo && !config.restrictTo.includes(randomRoom.entityReference)) ||
          (config.areaRestricted && randomRoom.area !== this.area)
        ) {
          return;
        }

        Logger.verbose(`NPC [${this.uuid}] wandering from ${this.room.entityReference} to ${randomRoom.entityReference}.`);
        const verb = 'leave';
        Broadcast.sayAt(this.room, `${this.metadata.name} ${verb}s ${direction}.`);
        this.moveTo(randomRoom);
        
        Broadcast.sayAtExcept(randomRoom, `${this.metadata.name} enters from the ${REVERSE_DIRECTION_MAP[direction]}.`, this);

      }
    }
  };
};