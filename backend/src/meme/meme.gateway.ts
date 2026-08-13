import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway()
export class MemeGateway {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(MemeGateway.name);

  handleConnection(client: Socket) {
    console.log('client joined!!!!!', client.id);
    this.logger.log('Someone joined with id', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('client disconnected!!!');
  }
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
2;
