import { WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../data/database';
import { Player, Room, Ship, Game } from '../data/database';

class RequestHandler {
  private socket: WebSocket;

  constructor(socket: WebSocket) {
    this.socket = socket;
  }

  public handleRequest(request: any): void {
    const { type, data } = request;

    switch (type) {
      case 'reg':
        this.handleReg(data);
        break;
      case 'create_room':
        this.handleCreateRoom();
        break;
      case 'add_user_to_room':
        this.handleAddUserToRoom(data);
        break;
      case 'add_ships':
        this.handleAddShips(data);
        break;
      case 'attack':
        this.handleAttack(data);
        break;
      default:
        console.log('Invalid request type:', type);
    }
  }

  private handleReg(data: any): void {
    const { name, password } = data;

    const player = db.getPlayer(name);

    if (player) {
      const playerIndex = db.getPlayers().findIndex((p) => p.name === name);
      const responseData = {
        name,
        index: playerIndex,
        error: false,
        errorText: '',
      };
      const response = {
        type: 'reg',
        data: JSON.stringify(responseData),
        id: 0,
      };

      this.socket.send(JSON.stringify(response));
      return;
    }

    const newPlayer: Player = {
      name,
      password,
    };

    db.addPlayer(newPlayer);

    const players = db.getPlayers();
    const playerIndex = players.findIndex((p) => p.name === name);

    const responseData = {
      name,
      index: playerIndex,
      error: false,
      errorText: '',
    };

    const response = {
      type: 'reg',
      data: JSON.stringify(responseData),
      id: 0,
    };

    this.socket.send(JSON.stringify(response));
  }

  private handleCreateRoom(): void {
    const playerId = uuidv4();
    const player: Player = {
      name: playerId,
      password: '',
    };
    const room = db.createRoom(player);

    const response = {
      type: 'create_game',
      data: {
        idGame: room.roomId,
        idPlayer: 0,
      },
      id: 0,
    };

    this.socket.send(JSON.stringify(response));
    this.broadcastUpdateRoom();
  }

  private handleAddUserToRoom(data: any): void {
    const { indexRoom } = data;
    const playerId = uuidv4();
    const player: Player = {
      name: playerId,
      password: '',
    };

    const success = db.addUserToRoom(indexRoom, player);

    if (success) {
      this.broadcastUpdateRoom();
    } else {
      console.log('Failed to add user to room:', indexRoom);
    }
  }

  private handleAddShips(data: any): void {
    const { gameId, ships, indexPlayer } = data;
    const playerId = this.socket.id.toString();
    const player = db.getPlayer(playerId);

    if (!player) {
      console.log('Player not found:', playerId);
      return;
    }

    const game = db.getGames().find(
      (g) => g.gameId === gameId && g.idPlayer === indexPlayer
    );

    if (!game) {
      console.log('Game not found:', gameId, indexPlayer);
      return;
    }

    db.addShips(gameId, ships);

    if (db.getShips(gameId)) {
      const response = {
        type: 'start_game',
        data: {
          ships: db.getShips(gameId),
          currentPlayerIndex: indexPlayer,
        },
        id: 0,
      };

      this.socket.send(JSON.stringify(response));
    } else {
      console.log('Failed to add ships to game:', gameId);
    }
  }

  private handleAttack(data: any): void {
    const { gameId, x, y, indexPlayer } = data;
    const playerId = this.socket.id.toString();
    const player = db.getPlayer(playerId);

    if (!player) {
      console.log('Player not found:', playerId);
      return;
    }

    // Check if it's the player's turn

    // Perform attack logic

    // Send attack result

    // Check if the game has ended

    // Update game state and send updates

    // Send turn information
  }

  private broadcastUpdateRoom(): void {
    const rooms = db.getRooms();
    const players = db.getPlayers();

    const response = {
      type: 'update_room',
      data: rooms.map((room: Room) => ({
        roomId: room.roomId,
        roomUsers: room.roomUsers.map((user: Player) => ({
          name: user.name,
          index: players.findIndex((p) => p.name === user.name),
        })),
      })),
      id: 0,
    };

    this.socket.send(JSON.stringify(response));
  }
}

export default RequestHandler;



