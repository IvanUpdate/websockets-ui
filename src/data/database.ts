interface Player {
  name: string;
  password: string;
}

interface Room {
  roomId: number;
  roomUsers: Player[];
}

interface Ship {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: "small" | "medium" | "large" | "huge";
}

interface Game {
  gameId: number;
  idPlayer: number;
}

interface Database {
  players: Player[];
  rooms: Room[];
  games: Game[];
  ships: Record<number, Ship[]>;
}

class InMemoryDatabase {
  private data: Database;

  constructor() {
    this.data = {
      players: [],
      rooms: [],
      games: [],
      ships: {},
    };
  }

  getPlayer(name: string): Player | undefined {
    return this.data.players.find((player) => player.name === name);
  }

  addPlayer(player: Player): void {
    this.data.players.push(player);
  }

  createRoom(player: Player): Room {
    const roomId = this.data.rooms.length + 1;
    const room: Room = {
      roomId,
      roomUsers: [player],
    };
    this.data.rooms.push(room);
    return room;
  }

  addUserToRoom(roomId: number, player: Player): boolean {
    const room = this.data.rooms.find((r) => r.roomId === roomId);
    if (room) {
      room.roomUsers.push(player);
      return true;
    }
    return false;
  }

  createGame(roomId: number, playerId: number): Game {
    const gameId = this.data.games.length + 1;
    const game: Game = {
      gameId,
      idPlayer: playerId,
    };
    this.data.games.push(game);
    this.data.ships[gameId] = [];
    return game;
  }

  addShips(gameId: number, ships: Ship[]): void {
    this.data.ships[gameId] = ships;
  }

  getShips(gameId: number): Ship[] | undefined {
    return this.data.ships[gameId];
  }

  getPlayers(): Player[] {
    return this.data.players;
  }

  getRooms(): Room[] {
    return this.data.rooms;
  }

  getGames(): Game[] {
    return this.data.games;
  }
}

export const db = new InMemoryDatabase();
export type { Player, Room, Ship, Game, Database };
