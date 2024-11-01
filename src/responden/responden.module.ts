import { Module } from '@nestjs/common';
import { RespondenService } from './responden.service';
import { RespondenController } from './responden.controller';

@Module({
  providers: [RespondenService],
  controllers: [RespondenController]
})
export class RespondenModule {}
