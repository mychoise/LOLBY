import { Logger, UseFilters } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Player, Room } from './meme.interface';
import { MemeService } from './meme.service';
import { AllExceptionsFilter } from 'src/common/filters/ws-exception.filter';
@UseFilters(AllExceptionsFilter)
@WebSocketGateway()
export class MemeGateway {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(MemeGateway.name);
  private roomDetail = new Map<string, Room>();

  constructor(private readonly memeService: MemeService) {}

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
    if (room.host_id !== data.token) {
      console.log('you are not host sorry!!!');
      client.emit('appError', { message: 'you are not host' });
      return;
    }
    const players = room.players;
    const randomImages = this.memeService.getIndividualMemeTemplate(players);
    const images = randomImages.data;
    console.log('images are', images);
    console.log('players are ', players);
    room.gamestatus = 'in-progress';

    players.forEach((item: Player) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const memeTemplate: any = images.filter(
        (value) => item.token === value.player.token,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const actualMeme = memeTemplate.map((entry) => entry.memeTemplate);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const extraMeme = memeTemplate.map((entry) => entry.extraImage);
      console.log('memeTemplate for player', item.token);
      console.log('memeTemplate is', memeTemplate);
      console.log('is', actualMeme[0]);
      console.log('at', extraMeme[0]);
      client.emit('all', memeTemplate);
      client.emit('meme', actualMeme[0]);
      client.emit('extra', extraMeme[0]);
      item.memeTemplate = actualMeme[0];
      item.extraImage = extraMeme[0];
      this.server.to(item.socket_id).emit('memeImage', item.memeTemplate);
      this.server.to(item.socket_id).emit('extraImage', item.extraImage);
    });
    console.log('ranndom Images from socket is', images);
    client.emit('randomImages', images);
    client.emit('playerss', players);
  }
}
