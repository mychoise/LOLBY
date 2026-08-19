import { Module } from '@nestjs/common';
import { MemeController } from './meme.controller';
import { MemeService } from './meme.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [MemeController],
  providers: [MemeService, DrizzleModule],
  exports: [MemeService],
})
export class MemeModule {}
