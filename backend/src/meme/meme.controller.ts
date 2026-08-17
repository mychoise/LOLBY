import { Body, Controller, Get } from '@nestjs/common';
import { MemeService } from './meme.service';

@Controller('meme')
export class MemeController {
  constructor(private readonly memeService: MemeService) {}

  @Get('random')
  getRandomMemeTemplate(@Body('playerCount') playerCount: number) {
    return this.memeService.getRandomMemeTemplate(playerCount);
  }
  @Get('individual')
  getIndividualMemeTemplate(@Body('players') players: any) {
    return this.memeService.getIndividualMemeTemplate(players);
  }
}
