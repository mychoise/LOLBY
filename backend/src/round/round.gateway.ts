import { Logger, UseFilters } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Player, Room } from '../meme/meme.interface';
import { MemeService } from '../meme/meme.service';
import { AllExceptionsFilter } from 'src/common/filters/ws-exception.filter';
import { RoundService } from 'src/round/round.service';
@UseFilters(AllExceptionsFilter)
@WebSocketGateway()
export class RoundGateway {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(RoundGateway.name);
  private roomDetail = new Map<string, Room>();

  constructor(
    private readonly memeService: MemeService,
    private readonly roundService: RoundService,
  ) {}

  handleConnection(client: Socket) {
    console.log('client joined!!!!!', client.id);
    this.logger.log('Someone joined with id', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('client disconnected!!!');
  }

  @SubscribeMessage('createRoom')
  handleCreateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { name: string },
  ) {
    if (!data.name) {
      client.emit('appError', {
        message: "Don't try to be hero write your fucking name",
      });
      console.log('no name provided');
      return;
    }
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const user_token = Math.random().toString(36).substring(2, 8).toUpperCase();

    const playerData: Player = {
      socket_id: client.id,
      token: user_token,
      name: data.name,
      score: 0,
    };
    const payload: Room = {
      code: roomCode,
      host_id: user_token,
      gamestatus: 'lobby',
      players: [playerData],
    };
    console.log('generated room token is', roomCode);
    console.log('host token is', user_token);
    this.roomDetail.set(roomCode, payload);
    client.emit('roomGenerated', payload);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { name: string; roomCode: string },
  ) {
    const roomCode = data.roomCode;
    console.log('received data is', data);
    console.log('received room code is', data.roomCode);
    const room = this.roomDetail.get(roomCode);
    if (!room) {
      client.emit('appError', { message: 'Room not found' });
      return;
    }
    const socketId = client.id;
    const userToken = Math.random().toString(36).substring(2, 8).toUpperCase();
    const payload: Player = {
      socket_id: socketId,
      token: userToken,
      name: data.name,
      score: 0,
    };
    room.players.push(payload);
    client.join(roomCode);
    client.emit('joinedRoom', userToken);
    this.server.to(roomCode).emit('playerListUpdated', {
      players: room.players,
    });
  }

  @SubscribeMessage('startGame')
  handleStartGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomCode: string; token: string },
  ) {
    const roomCode = data.roomCode;
    console.log('roomcode is', roomCode);
    const room = this.roomDetail.get(roomCode);
    if (!data.token) {
      console.log('token is required');
      client.emit('appError', { message: 'Token is required' });
    }
    if (!room) {
      client.emit('appError', { message: 'Room not found' });
      return;
    }
    const result = this.roundService.startGame(room, data.token);
    console.log('result is', result);
    if (result.success === false) {
      client.emit('appError', { message: result.message });
      return;
    }
    room.players.forEach((item) => {
      this.server.to(item.socket_id).emit('memeImage', item.memeTemplate);
      this.server.to(item.socket_id).emit('extraImage', item.extraImage);
    });
    client.emit('gameStarted', {
      message: 'Game has been started sucessfully',
    });
  }
}
