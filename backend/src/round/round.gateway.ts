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
    if (room.gamestatus !== 'lobby') {
      client.emit('appError', {
        message: 'Game has already started , cannot fucking start again',
      });
      return;
    }
    const result = this.roundService.startGame(room, data.token);
    console.log('result is', result);
    if (result.success === false) {
      client.emit('appError', { message: result.message });
      return;
    }
    const round = this.roundService.handleNextRound(room);
    room.players.forEach((item) => {
      this.server.to(item.socket_id).emit('memeImages', item.memeTemplate);
      this.server.to(item.socket_id).emit('extraImages', item.extraImage);
      this.server
        .to(item.socket_id)
        .emit('currentRoundImage', item.currentRoundImage);
    });
    room.gamestatus = 'in-progress';
    this.server.to(roomCode).emit('roundStarted', round);
    client.emit('gameStarted', {
      message: 'Game has been started sucessfully',
    });
  }

  @SubscribeMessage('submitCaption')
  handleSubmitCaption(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      roomCode: string;
      playerToken: string;
      imageId: string;
      captionText: string;
    },
  ) {
    const room = this.roomDetail.get(data.roomCode);
    if (!room) {
      client.emit('appError', { message: 'Room not found' });
      return;
    }
    if (room.gamestatus !== 'in-progress') {
      client.emit('appError', {
        message: 'Game is not in progress, cannot submit caption',
      });
      return;
    }
    const player = room.players.find((p) => p.token === data.playerToken);
    if (!player) {
      client.emit('appError', { message: 'Player not found' });
      return;
    }
    if (data.imageId !== player.currentRoundImage?.id) {
      client.emit('appError', {
        message: 'You can only submit caption for your current round image',
      });
      return;
    }
    const alreadySubmitted = room.currentRound?.submissions?.find(
      (item) => item.playerToken === data.playerToken,
    );
    if (alreadySubmitted) {
      client.emit('appError', {
        message: 'You have already submitted a caption for this round',
      });
      return;
    }
    const submission = this.roundService.handleCaptionSubmission(
      data.playerToken,
      data.imageId,
      data.captionText,
    );
    room.currentRound?.submissions?.push(submission);
    client.emit('captionSubmitted', {
      message: 'Caption submitted successfully',
    });
    if (this.roundService.handlecheckForSubmission(room)) {
      room.players.map((item) => {
        const images = room.currentRound?.submissions;
        const actualImage = images
          ?.filter((value) => value.playerToken !== item.token)
          .map((value2) => {
            return {
              submissionId: value2.playerToken,
              imageUrl: item.currentRoundImage?.image_url,
              captionText: value2.captionText,
            };
          });
        console.log('voting images are', actualImage);
        this.server.to(item.socket_id).emit('votingImages', actualImage);
      });
    }
  }

  @SubscribeMessage('sumbitVote')
  handleSubmitVote(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      roomCode: string;
      voterToken: string;
      votedForToken: string;
    },
  ) {
    const room = this.roomDetail.get(data.roomCode);
    if (!room) {
      client.emit('appError', { message: 'Room not found' });
      return;
    }
    if (room.gamestatus !== 'in-progress') {
      client.emit('appError', {
        message: 'Game is not in progress, cannot submit vote',
      });
      return;
    }
    const player = room.players.find((p) => p.token === data.voterToken);
    if (!player) {
      client.emit('appError', { message: 'Player not found' });
      return;
    }
    const alreadyVoted = room.currentRound?.votes?.find(
      (item) => item.voterToken === data.voterToken,
    );
    if (alreadyVoted) {
      client.emit('appError', {
        message: 'You have already voted for this round',
      });
      return;
    }
    const vote = this.roundService.handleVoteSubmission(
      data.voterToken,
      data.votedForToken,
    );
    room.currentRound?.votes?.push(vote);
    client.emit('voteSubmitted', {
      message: 'Vote submitted successfully',
    });
  }
}
