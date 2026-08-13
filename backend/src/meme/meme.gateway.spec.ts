import { Test, TestingModule } from '@nestjs/testing';
import { MemeGateway } from './meme.gateway';

describe('MemeGateway', () => {
  let gateway: MemeGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemeGateway],
    }).compile();

    gateway = module.get<MemeGateway>(MemeGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
