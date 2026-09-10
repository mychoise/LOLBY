import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemeModule } from './meme/meme.module';
import { ConfigModule } from '@nestjs/config';
import { RoundModule } from './round/round.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [MemeModule, ConfigModule.forRoot({ isGlobal: true }), RoundModule, RoomModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
