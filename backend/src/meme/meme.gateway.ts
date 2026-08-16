import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Player, Room } from './meme.interface';
@WebSocketGateway()
export class MemeGateway {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(MemeGateway.name);
  private roomDetail = new Map<string, Room>();

  handleConnection(client: Socket) {
    console.log('client joined!!!!!', client.id);
    this.logger.log('Someone joined with id', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('client disconnected!!!');
  }

  @SubscribeMessage('createRomm')
  handleCreateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { name: string },
  ) {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const host_Token = client.id;
    const user_token = Math.random().toString(36).substring(2, 8).toUpperCase();

    const playerData: Player = {
      socket_id: client.id,
      token: user_token,
      name: data.name,
    };
    const payload: Room = {
      code: roomCode,
      host_id: host_Token,
      gamestatus: 'lobby',
      players: [playerData],
    };
    console.log('generated room token is', roomCode);
    this.roomDetail.set(roomCode, payload);
    client.emit('roomGenerated', payload);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { name: string; roomCode: string },
  ) {
    const roomCode = data.roomCode;
    const room = this.roomDetail.get(roomCode);
    if (!room) {
      client.emit('error', { message: 'Room not found' });
      return;
    }
    const socketId = client.id;
    const userToken = Math.random().toString(36).substring(2, 8).toUpperCase();
    const payload: Player = {
      socket_id: socketId,
      token: userToken,
      name: data.name,
    };
    room.players.push(payload);
    client.join(roomCode);
    client.emit('joinedRoom', userToken);
    this.server.to(roomCode).emit('playerListUpdated', {
      players: room.players,
    });
  }

  @SubscribeMessage('gamestatus')
  handleGameStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { roomCode: string; status: 'lobby' | 'in-progress' | 'completed' },
  ) {
    const roomCode = data.roomCode;
    const room = this.roomDetail.get(roomCode);
    if (!room) {
      client.emit('error', { message: 'Room not found' });
      return;
    }
    room.gamestatus = data.status;
    this.server.to(roomCode).emit('gameStatusUpdated', { status: data.status });
  }
}
