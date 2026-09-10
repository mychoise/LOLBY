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

  handleVoteSubmission(voterToken: string, votedForToken: string) {
    const vote = {
      voterToken,
      votedForToken,
    };
    return vote;
  }

  handlecheckForSubmission(room: Room) {
    const voteCount = room.currentRound?.submissions?.length ?? 0;
    return voteCount === room.players.length;
  }
  handleCheckForVotingComplete(room: Room) {
    const voteCount = room.currentRound?.votes?.length ?? 0;
    return voteCount === room.players.length;
  }
  handleVoteTallyAndScore(room: Room) {
    const players = room.players;
    players?.forEach((item) => {
      const score =
        room.currentRound?.votes?.filter(
          (value) => value.votedForToken === item.token,
        ).length ?? 0;
      item.score += score * 121;
    });
  }

  handleCheckValidRoomId(room: Map<string, Room>, roomId: string): boolean {
    if (roomId.length < 4) {
      return false;
    }
    if (room.get(roomId)) {
      return true;
    }
    return false;
  }
}
