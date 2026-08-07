import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface Player {
  socketId: string | null; // null when disconnected
  token: string;
}

interface Room {
  code: string;
  players: Map<string, Player>; // keyed by token, not socketId
}

@WebSocketGateway()
export class TestGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  roomMap = new Map<string, Room>();

  handleConnection(client: Socket) {
    console.log('user joined with id ', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('user disconnected with id ', client.id);

    for (const room of this.roomMap.values()) {
      for (const player of room.players.values()) {
        if (player.socketId === client.id) {
          player.socketId = null; // mark disconnected, don't delete yet
          this.server.to(room.code).emit('playerListUpdated', {
            players: Array.from(room.players.values()),
          });
          // TODO: grace-period timer to fully remove them if they
          // don't rejoin within ~30-60s (prevents memory leak)
        }
      }
    }
  }

  @SubscribeMessage('message')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage('createRoom')
  handleCreateRoom(@ConnectedSocket() client: Socket) {
    const roomId = Math.random().toString(36).substring(2, 15);
    const token = Math.random().toString(36).substring(2, 15);

    const player: Player = {
      socketId: client.id,
      token: token,
    };

    this.roomMap.set(roomId, {
      code: roomId,
      players: new Map([[token, player]]),
    });

    client.join(roomId);
    console.log('room created:', roomId, 'by', client.id);

    // tell the creator their room code + token, or they can never
    // share the code or rejoin their own room later
    client.emit('roomCreated', { roomId, token });
  }

  @SubscribeMessage('joinRoom')
  handlejoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { code: string },
  ) {
    const room = this.roomMap.get(data.code);
    if (!room) {
      client.emit('error', { message: 'Room not found' });
      return;
    }

    const token = Math.random().toString(36).substring(2, 15);
    const player: Player = {
      socketId: client.id,
      token: token,
    };

    room.players.set(token, player);
    client.join(data.code); // <-- was missing

    client.emit('joinedRoom', { token });

    // let everyone in the room (including the new joiner) see updated list
    this.server.to(data.code).emit('playerListUpdated', {
      players: Array.from(room.players.values()),
    });
  }

  @SubscribeMessage('rejoinRoom')
  handleRejoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { code: string; token: string },
  ) {
    const room = this.roomMap.get(data.code); // <-- was missing
    const player = room?.players.get(data.token); // <-- was this.roomMap.players (bug)

    if (!player) {
      client.emit('error', { message: 'Could not rejoin — session expired' });
      return;
    }

    player.socketId = client.id; // swap in the new socket
    client.join(data.code);

    client.emit('rejoined', { token: data.token });

    this.server.to(data.code).emit('playerListUpdated', {
      players: Array.from(room!.players.values()),
    });
  }
}
