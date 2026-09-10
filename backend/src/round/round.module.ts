import { Module } from '@nestjs/common';
import { RoundController } from './round.controller';
import { RoundService } from './round.service';
import { MemeModule } from 'src/meme/meme.module';
import { RoundGateway } from './round.gateway';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [MemeModule, RoomModule],
  controllers: [RoundController],
  providers: [RoundService, RoundGateway],
  exports: [RoundService],
})
export class RoundModule {}
