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
    let numberofMemerequired = playerCount;
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

  // private getIndividualUserMeme(playerCount: number, userTokens: any) {
  //   const randomImages = this.getRandomMemeTemplate(playerCount);
  //   if (!randomImages) {
  //     console.log('Error in getting memes');
  //   }
  //   userTokens.forEach((token: any) => console.log('token is', token));
  // }
}
