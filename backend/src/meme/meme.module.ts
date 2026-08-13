import { Module } from '@nestjs/common';
import { MemeController } from './meme.controller';
import { MemeService } from './meme.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { MemeGateway } from './meme.gateway';

@Module({
  imports: [DrizzleModule],
  controllers: [MemeController],
  providers: [MemeService, DrizzleModule, MemeGateway],
})
export class MemeModule {}
