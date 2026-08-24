import { Injectable } from '@nestjs/common';
import { Player, Room, Round, Submission } from 'src/meme/meme.interface';
import { MemeService } from 'src/meme/meme.service';

@Injectable()
export class RoundService {
  constructor(private readonly memeService: MemeService) {}
  startGame(room: Room, host_id: string) {
    const players = room.players;
    if (room.host_id !== host_id) {
      return {
        success: false,
        message: 'You are not the host of this room',
      };
    }
    const randomImages = this.memeService.getIndividualMemeTemplate(players);
    if (!randomImages) {
      return {
        success: false,
        message: 'Error in getting images for the players',
      };
    }
    const images = randomImages.data;
    room.gamestatus = 'in-progress';
    players.forEach((item: Player) => {
      const memeTemplate: any = images.filter(
        (value) => item.token === value.player.token,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const actualMeme = memeTemplate.map((entry) => entry.memeTemplate);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const extraMeme = memeTemplate.map((entry) => entry.extraImage);
      item.memeTemplate = actualMeme[0];
      item.extraImage = extraMeme[0];
    });
    return { success: true };
  }

  handleNextRound(room: Room) {
    const nextRoundNumber = (room.currentRound?.roundNumber ?? 0) + 1;
    const round: Round = {
      roundNumber: nextRoundNumber,
      submissions: [],
      votes: [],
      phase: 'submitting',
      roundEndsAt: Date.now() + 60_000,
    };
    room.currentRound = round;
    this.memeService.getImageForRound(room.players, nextRoundNumber);
    return round;
  }

  handleCaptionSubmission(
    playerToken: string,
    imageId: string,
    captionText: string,
  ) {
    const submission: Submission = {
      playerToken,
      templateId: imageId,
      captionText,
    };
    return submission;
  }
}
