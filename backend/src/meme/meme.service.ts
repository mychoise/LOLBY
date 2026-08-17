import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import * as schema from 'src/drizzle/schema/index';
import { eq } from 'drizzle-orm';

export interface MemeTemplate {
  id: string;
  image_url: string;
  is_active: boolean;
  created_at: Date;
}

@Injectable()
export class MemeService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

  private readonly logger = new Logger(MemeService.name);
  private memeTemplate: MemeTemplate[] = [];

  async onModuleInit() {
    await this.initData();
  }

  private async initData() {
    const data = await this.db
      .select()
      .from(schema.memeImageSchema)
      .where(eq(schema.memeImageSchema.is_active, true));
    this.memeTemplate = data;
    this.logger.log(
      `Meme templates initialized with ${this.memeTemplate.length} active templates.`,
    );
  }

  getRandomMemeTemplate(playerCount: number) {
    if (playerCount > 7) {
      this.logger.warn('number exceed');
      throw new BadRequestException('number exceed');
    }

    if (playerCount < 2) {
      this.logger.warn('number is less than 2');
      throw new BadRequestException('number is less than 2');
    }

    console.log('this.memeTemplate', this.memeTemplate);
    const randomNumbers: number[] = [];
    const randomImage: any = [];
    let numberofMemerequired = playerCount * 10;
    console.log('executing loop');
    for (let i = 0; i < numberofMemerequired; i++) {
      console.log('executing loop', i);
      const randomIndex = Math.floor(Math.random() * numberofMemerequired);
      console.log('randomIndex', randomIndex);
      if (randomNumbers.includes(randomIndex)) {
        console.log('random number array while includes', randomNumbers);
        numberofMemerequired++;
      } else {
        console.log('random number array while not including', randomNumbers);
        randomNumbers.push(randomIndex);
      }
    }

    console.log('random number are', randomNumbers);
    randomNumbers.forEach((item) => {
      console.log('item is', item);
      const image = this.memeTemplate[item];
      randomImage.push(image);
    });

    console.log('random images are', randomImage);
    return {
      msg: 'Random meme templates selected',
      data: randomNumbers,
      images: randomImage,
    };
  }

  getIndividualMemeTemplate(players: any) {
    console.log('players is', players);
    if (players.length > 7) {
      this.logger.warn('number exceed');
      throw new BadRequestException('number exceed');
    }

    if (players.length < 2) {
      this.logger.warn('number is less than 2');
      throw new BadRequestException('number is less than 2');
    }
    const randomImage = this.getRandomMemeTemplate(players.length);
    const individualMemeTemplate: any = [];
    players.forEach((player: any, index: number) => {
      const playerChunk = randomImage.images.slice(
        index * 10,
        (index + 1) * 10,
      );
      individualMemeTemplate.push({
        player: player,
        extraImage: playerChunk.slice(0, 3),
        memeTemplate: playerChunk.slice(3, 10),
      });
    });
    return {
      msg: 'Individual meme templates selected',
      data: individualMemeTemplate,
    };
  }
}
