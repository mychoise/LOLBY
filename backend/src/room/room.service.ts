import { Injectable } from '@nestjs/common';
import { Room } from 'src/meme/meme.interface';

@Injectable()
export class RoomService {
  private roomDetail = new Map<string, Room>();
  createRoom(roomCode: string, room: Room) {
    this.roomDetail.set(roomCode, room);
  }

  getRoom(roomCode: string): Room | undefined {
    return this.roomDetail.get(roomCode);
  }

  deleteRoom(roomCode: string) {
    this.roomDetail.delete(roomCode);
  }

  hasRoom(roomCode: string): boolean {
    return this.roomDetail.has(roomCode);
  }

  getAllRooms(): Map<string, Room> {
    return this.roomDetail;
  }
}
