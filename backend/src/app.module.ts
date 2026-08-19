import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemeModule } from './meme/meme.module';
import { ConfigModule } from '@nestjs/config';
import { RoundModule } from './round/round.module';

@Module({
  imports: [MemeModule, ConfigModule.forRoot({ isGlobal: true }), RoundModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
