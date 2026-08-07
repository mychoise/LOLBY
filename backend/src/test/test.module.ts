import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { TestGateway } from './test.gateway';

@Module({
  controllers: [TestController],
  providers: [TestService, TestGateway]
})
export class TestModule {}
